import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

type UseAuthRedirectProps = {
  user: User | null
  userRole: UserRole | null
  loading: boolean
}

export const useAuthRedirect = ({ user, userRole, loading }: UseAuthRedirectProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        if (loading) return

        const isAuthRoute = ['/login', '/signup', '/reset-password'].includes(location.pathname)
        
        // If on auth route but already authenticated, redirect to appropriate dashboard
        if (isAuthRoute && user && userRole) {
          console.log('Authenticated user on auth route, redirecting to dashboard', {
            userId: user.id,
            role: userRole,
            from: location.pathname,
          })
          
          const dashboardPath = getDashboardPath(userRole)
          navigate(dashboardPath, { replace: true })
          return
        }

        // If not on auth route and not authenticated, redirect to login
        if (!isAuthRoute && !user) {
          console.log('Unauthenticated user on protected route, redirecting to login', {
            from: location.pathname,
          })
          
          navigate('/login', {
            replace: true,
            state: { from: location.pathname }
          })
          
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please sign in to continue."
          })
          return
        }
      } catch (error) {
        console.error('Auth redirect error:', error)
        toast({
          variant: "destructive",
          title: "Navigation Error",
          description: "Failed to redirect. Please try again."
        })
      }
    }

    handleRedirect()
  }, [user, userRole, loading, location.pathname, navigate])
}

const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'seller':
      return '/seller'
    default:
      return '/'
  }
}