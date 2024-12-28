import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Please sign in to continue.',
        })
      } else if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: "You don't have permission to access this page.",
        })
      }
    }
  }, [loading, user, userRole, allowedRoles])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
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