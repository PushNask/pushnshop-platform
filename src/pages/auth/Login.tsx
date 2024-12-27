import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import LoginHeader from '@/components/auth/LoginHeader'
import LoginForm from '@/components/auth/LoginForm'
import LoginFooter from '@/components/auth/LoginFooter'

const Login = () => {
  const { user, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const dashboardPath = userRole === 'admin' ? '/admin' : userRole === 'seller' ? '/seller' : '/'
      navigate(dashboardPath, { replace: true })
    }
  }, [user, userRole, navigate])

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <LoginHeader />
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <LoginFooter />
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login