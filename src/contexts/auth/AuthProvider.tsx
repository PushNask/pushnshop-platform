import React, { createContext, useContext, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuthState } from '@/hooks/auth/useAuthState'
import { useAuthHandlers } from '@/hooks/auth/useAuthHandlers'
import type { AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, session, userRole, loading, error, updateState } = useAuthState()
  const { fetchUserRole, signIn, signOut } = useAuthHandlers(updateState)

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user) {
        updateState({
          user: sessionData.session.user,
          session: sessionData.session,
          loading: true,
        })
        const role = await fetchUserRole(sessionData.session.user.id)
        updateState({ userRole: role, loading: false })
      } else {
        updateState({ loading: false })
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, userId: session?.user?.id })

      if (session?.user) {
        updateState({
          user: session.user,
          session,
          loading: true,
        })
        const role = await fetchUserRole(session.user.id)
        updateState({ userRole: role, loading: false })
      } else {
        updateState({
          user: null,
          session: null,
          userRole: null,
          loading: false,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserRole, updateState])

  const value = {
    user,
    session,
    userRole,
    loading,
    error,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}