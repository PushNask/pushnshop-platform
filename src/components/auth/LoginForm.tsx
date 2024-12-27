import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { useRoleManagement } from '@/hooks/useRoleManagement'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { logError } from '@/utils/errorLogger'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user } = useAuth()
  const { checkRoleWithRetry, isCheckingRole } = useRoleManagement()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || isCheckingRole) {
      console.log('Preventing duplicate submission')
      return
    }

    setIsLoading(true)
    console.log('Login attempt:', { email })

    try {
      await signIn(email, password)
      const { data: { user: signedInUser }, error: signInError } = await supabase.auth.getUser()
      
      if (signInError) throw signInError
      if (!signedInUser) throw new Error('No user data received after sign in')

      // Then check their role with retries
      const role = await checkRoleWithRetry(signedInUser.id, signedInUser.email)
      
      console.log('Login successful, redirecting based on role:', role)
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      })

      // Redirect based on role
      switch (role) {
        case 'admin':
          navigate('/admin', { replace: true })
          break
        case 'seller':
          navigate('/seller', { replace: true })
          break
        default:
          navigate('/', { replace: true })
      }
    } catch (err) {
      logError(err, 'Login error')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading || isCheckingRole}
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
          disabled={isLoading || isCheckingRole}
          className="bg-background"
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isCheckingRole}
      >
        {isLoading || isCheckingRole ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isCheckingRole ? 'Checking role...' : 'Signing in...'}
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}

export default LoginForm