import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth()
  const location = useLocation()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please sign in to continue."
        })
      } else if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page."
        })
      }
    }
  }, [loading, user, userRole, allowedRoles, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to home if user doesn't have required role
  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}