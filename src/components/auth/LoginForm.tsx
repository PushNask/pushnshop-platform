import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { logError } from '@/utils/errorLogger'
import { toast } from '@/hooks/use-toast'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailInputRef = useRef<HTMLInputElement>(null)

  // Extract the redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  // Auto-focus the email input on component mount
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Navigate to the intended page upon successful login
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  // Synchronize local isLoading with context loading
  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  /**
   * Validates the email format using regex.
   * @param email - The email string to validate.
   * @returns Boolean indicating whether the email is valid.
   */
  const isValidEmail = (email: string): boolean => {
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Handles form submission for user login.
   * @param e - The form submission event.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Prevent submission if already loading
      if (isLoading) return

      // Basic email format validation
      if (!isValidEmail(email)) {
        toast({
          variant: 'destructive',
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
        })
        return
      }

      // Clear any existing errors and show loading state
      setIsLoading(true)
      console.log('Login attempt:', { email })

      try {
        await signIn(email, password)
        // Upon successful sign-in, navigation is handled by useEffect
      } catch (err) {
        logError(err, 'Login error')

        // Handle email confirmation error specifically
        if (
          err instanceof Error &&
          (err.message.toLowerCase().includes('email_not_confirmed') ||
            err.message.toLowerCase().includes('email not confirmed'))
        ) {
          toast({
            variant: 'destructive',
            title: 'Email Not Confirmed',
            description:
              'Please check your email and confirm your account before signing in. Check your spam folder if you can\'t find the confirmation email.',
          })
          return
        }

        // General error handling
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description:
            err instanceof Error
              ? err.message
              : 'Failed to sign in. Please check your credentials.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [email, password, signIn, isLoading]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up" aria-busy={isLoading}>
      <div className="space-y-2">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="bg-background"
          autoComplete="email"
          ref={emailInputRef}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="bg-background"
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full flex items-center justify-center"
        disabled={isLoading}
        aria-disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}

export default LoginForm