import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, userRole } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      })
      
      // Get the redirect path from location state or default based on role
      const from = location.state?.from?.pathname || getDashboardPath(userRole)
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign in. Please check your credentials.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to determine the dashboard path based on user role
  const getDashboardPath = (role: string | null) => {
    switch (role) {
      case 'admin':
        return '/admin'
      case 'seller':
        return '/seller'
      default:
        return '/'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
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