import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import LoginHeader from '@/components/auth/LoginHeader'
import LoginForm from '@/components/auth/LoginForm'
import LoginFooter from '@/components/auth/LoginFooter'

const Login = () => {
  const { user, userRole, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && user && userRole) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || getDashboardPath(userRole)
      navigate(from, { replace: true })
    }
  }, [user, userRole, loading, navigate, location])

  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin'
      case 'seller':
        return '/seller'
      default:
        return '/dashboard'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user && userRole) {
    // Prevent rendering the login form if already authenticated
    return null
  }

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
