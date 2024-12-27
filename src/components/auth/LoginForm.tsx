import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const MAX_ROLE_CHECK_ATTEMPTS = 10
const ROLE_CHECK_INTERVAL = 500 // ms

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, userRole, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Redirect if already logged in and has role
    if (user && userRole) {
      const from = location.state?.from?.pathname || getDashboardPath(userRole)
      navigate(from, { replace: true })
    }
  }, [user, userRole, navigate, location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) {
      console.log('Preventing duplicate submission')
      return
    }

    setIsLoading(true)
    console.log('Login attempt:', { email })

    try {
      await signIn(email, password)
      
      // Poll for role with timeout
      let attempts = 0
      const checkRole = async (): Promise<void> => {
        console.log('Checking role, attempt:', attempts + 1)
        
        if (attempts >= MAX_ROLE_CHECK_ATTEMPTS) {
          throw new Error('Failed to get user role after multiple attempts')
        }

        if (!userRole) {
          attempts++
          await new Promise(resolve => setTimeout(resolve, ROLE_CHECK_INTERVAL))
          return checkRole()
        }

        console.log('Role found:', userRole)
        const from = location.state?.from?.pathname || getDashboardPath(userRole)
        
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        })
        
        navigate(from, { replace: true })
      }

      await checkRole()
    } catch (err) {
      console.error('Login error:', err)
      setIsLoading(false)
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error 
          ? err.message 
          : 'Failed to sign in. Please check your credentials.',
      })
    }
  }

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