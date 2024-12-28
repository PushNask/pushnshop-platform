import React, { useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

type UserRole = Database['public']['Enums']['user_role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
  loadingComponent
}) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  const handleAccessDenied = useCallback((reason: 'auth' | 'role') => {
    toast({
      variant: 'destructive',
      title: 'Access Denied',
      description: reason === 'auth'
        ? 'Please sign in to continue.'
        : "You don't have permission to access this page."
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        handleAccessDenied('auth');
      } else if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
        handleAccessDenied('role');
      }
    }
  }, [loading, user, userRole, allowedRoles, handleAccessDenied]);

  if (loading) {
    return loadingComponent || (
      <LoadingSpinner 
        size="md"
        fullScreen={true}
      />
    );
  }

  if (!user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;