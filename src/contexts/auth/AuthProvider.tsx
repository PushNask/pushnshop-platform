import React, { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthHandlers } from '@/hooks/auth/useAuthHandlers';
import type { AuthContextType } from '@/types/auth';
import { logError } from '@/utils/errorLogger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (user: AuthContextType['user']) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onAuthStateChange
}) => {
  const {
    user,
    session,
    userRole,
    loading,
    error,
    updateState
  } = useAuthState();

  const mounted = useRef(false);
  const authInitialized = useRef(false);

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    if (mounted.current) {
      updateState({
        user: null,
        session: null,
        userRole: null,
        loading: false,
        error: null
      });
    }
  }, [updateState]);

  // Enhanced auth handlers with proper cleanup
  const {
    fetchUserRole,
    signIn,
    signOut: baseSignOut
  } = useAuthHandlers(updateState);

  // Enhanced signOut with proper cleanup
  const signOut = useCallback(async () => {
    try {
      // First cleanup existing state
      cleanup();
      
      // Perform Supabase signout
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      // Update state after successful signout
      updateState({
        user: null,
        session: null,
        userRole: null,
        loading: false
      });

      onAuthStateChange?.(null);
    } catch (err) {
      logError(err, 'SignOut error');
      updateState({
        error: err instanceof Error ? err : new Error('SignOut failed')
      });
    }
  }, [cleanup, updateState, onAuthStateChange]);

  const handleAuthStateChange = useCallback(async (
    event: string,
    session: AuthContextType['session']
  ) => {
    try {
      console.log('Auth state changed:', { event, userId: session?.user?.id });

      if (event === 'SIGNED_OUT') {
        cleanup();
        return;
      }

      if (session?.user) {
        updateState({
          user: session.user,
          session,
          loading: true,
        });

        const role = await fetchUserRole(session.user.id);
        
        if (mounted.current) {
          updateState({ userRole: role, loading: false });
          onAuthStateChange?.(session.user);
        }
      } else {
        if (mounted.current) {
          cleanup();
          onAuthStateChange?.(null);
        }
      }
    } catch (err) {
      logError(err, 'Auth state change error');
      if (mounted.current) {
        updateState({ 
          error: err instanceof Error ? err : new Error('Auth state change failed'),
          loading: false
        });
      }
    }
  }, [fetchUserRole, updateState, onAuthStateChange, cleanup]);

  useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      if (authInitialized.current) return;

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          updateState({
            user: sessionData.session.user,
            session: sessionData.session,
            loading: true,
          });

          const role = await fetchUserRole(sessionData.session.user.id);
          
          if (mounted.current) {
            updateState({ userRole: role, loading: false });
            onAuthStateChange?.(sessionData.session.user);
          }
        } else if (mounted.current) {
          updateState({ loading: false });
          onAuthStateChange?.(null);
        }

        authInitialized.current = true;
      } catch (err) {
        logError(err, 'Auth initialization error');
        if (mounted.current) {
          updateState({ 
            error: err instanceof Error ? err : new Error('Auth initialization failed'),
            loading: false 
          });
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted.current = false;
      authInitialized.current = false;
      subscription?.unsubscribe();
      cleanup();
    };
  }, [fetchUserRole, updateState, handleAuthStateChange, onAuthStateChange, cleanup]);

  const value = {
    user,
    session,
    userRole,
    loading,
    error,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};