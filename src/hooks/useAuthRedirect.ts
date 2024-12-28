import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { toast } from '@/hooks/use-toast'
import { logError } from '@/utils/errorLogger'
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
        // If we're still loading user data, don't do anything yet.
        if (loading) return

        const isAuthRoute = ['/login', '/signup', '/reset-password'].includes(location.pathname)

        /**
         * AUTHENTICATED USER ON AUTH ROUTE
         * e.g., user tries to visit /login but they're already authenticated.
         */
        if (isAuthRoute && user && userRole) {
          console.log('Authenticated user on auth route, redirecting to dashboard', {
            userId: user.id,
            role: userRole,
            from: location.pathname,
          })

          // Dynamically set a dashboard path based on role
          let dashboardPath = '/'
          switch (userRole) {
            case 'admin':
              dashboardPath = '/admin'
              break
            case 'seller':
              dashboardPath = '/seller'
              break
            default:
              dashboardPath = '/'
          }

          navigate(dashboardPath, { replace: true })
          toast({
            title: 'Welcome back!',
            description: `You've been redirected to your ${userRole} dashboard.`,
          })
          return
        }

        /**
         * UNAUTHENTICATED USER ON PROTECTED ROUTE
         * e.g., user tries to visit /admin but is not authenticated.
         */
        if (!isAuthRoute && !user) {
          console.log('Unauthenticated user on protected route, redirecting to login', {
            from: location.pathname,
          })

          navigate('/login', {
            replace: true,
            state: { from: location.pathname },
          })

          toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'Please sign in to continue.',
          })
        }
      } catch (error) {
        logError(error, 'Auth redirect error', user?.id)
        toast({
          variant: 'destructive',
          title: 'Navigation Error',
          description: 'Failed to redirect. Please try again.',
        })
      }
    }

    // Invoke the redirect logic whenever relevant dependencies change
    handleRedirect()
  }, [user, userRole, loading, location.pathname, navigate])
}
