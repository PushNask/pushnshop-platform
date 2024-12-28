import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { logError } from '@/utils/errorLogger'
import { toast } from '@/hooks/use-toast'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    console.log('Login attempt:', { email })

    try {
      await signIn(email, password)
    } catch (err) {
      logError(err, 'Login error')
      
      // Handle email confirmation error specifically
      if (err instanceof Error && 
          (err.message?.includes('email_not_confirmed') || 
           err.message?.includes('Email not confirmed'))) {
        toast({
          variant: 'destructive',
          title: 'Email Not Confirmed',
          description: "Please check your email and confirm your account before signing in. Check your spam folder if you can't find the confirmation email.",
        })
        return
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error 
          ? err.message 
          : 'Failed to sign in. Please check your credentials.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="bg-background"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Input
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
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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