import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { NavigateFunction } from 'react-router-dom'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

type UseAuthRedirectProps = {
  user: User | null
  userRole: UserRole | null
  navigate: NavigateFunction
}

export const useAuthRedirect = ({ user, userRole, navigate }: UseAuthRedirectProps) => {
  useEffect(() => {
    if (user && userRole) {
      const dashboardPath = getDashboardPath(userRole)
      navigate(dashboardPath)
    }
  }, [user, userRole, navigate])
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