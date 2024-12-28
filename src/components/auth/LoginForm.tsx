import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { logError } from '@/utils/errorLogger';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    mounted.current = true;
    emailInputRef.current?.focus();
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (user && mounted.current) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = useCallback((data: LoginFormData): boolean => {
    try {
      loginSchema.parse(data);
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, curr) => ({
          ...acc,
          [curr.path[0]]: curr.message
        }), {});
        setFormErrors(errors);
      }
      return false;
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validateForm(formData)) {
      return;
    }

    try {
      await signIn(formData.email, formData.password);
    } catch (err) {
      logError(err, 'Login error');

      if (err instanceof Error && 
          err.message.toLowerCase().includes('email_not_confirmed')) {
        toast({
          variant: 'destructive',
          title: 'Email Not Confirmed',
          description: 'Please check your email and confirm your account. Check your spam folder if needed.'
        });
        return;
      }

      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: err instanceof Error
          ? err.message
          : 'Failed to sign in. Please check your credentials.'
      });
    }
  }, [formData, signIn, loading, validateForm]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 animate-fade-up" 
      aria-busy={loading}
      noValidate
    >
      <div className="space-y-2">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={loading}
          className={`bg-background ${formErrors.email ? 'border-red-500' : ''}`}
          autoComplete="email"
          ref={emailInputRef}
          aria-invalid={Boolean(formErrors.email)}
          aria-describedby={formErrors.email ? 'email-error' : undefined}
        />
        {formErrors.email && (
          <p id="email-error" className="text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={loading}
          className={`bg-background ${formErrors.password ? 'border-red-500' : ''}`}
          autoComplete="current-password"
          aria-invalid={Boolean(formErrors.password)}
          aria-describedby={formErrors.password ? 'password-error' : undefined}
        />
        {formErrors.password && (
          <p id="password-error" className="text-sm text-red-500">{formErrors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full flex items-center justify-center"
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;