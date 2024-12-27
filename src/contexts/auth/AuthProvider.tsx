import { createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useAuthState } from '@/hooks/useAuthState'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

type AuthContextType = {
  user: User | null
  session: Session | null
  userRole: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    userRole,
    loading,
    error,
    updateState
  } = useAuthState()

  // Use custom hooks for auth logic
  useAuthSession({ updateState })
  useAuthRedirect({ user, userRole, loading })

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      updateState({ loading: true, error: null })
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) throw signInError
      
      // Role will be fetched by useAuthSession hook
      console.log('Sign in successful for:', email)
    } catch (error) {
      console.error('Sign in error:', error)
      updateState({ error: error as Error })
      throw error
    }
  }

  const signOut = async () => {
    try {
      updateState({ loading: true, error: null })
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      updateState({
        user: null,
        userRole: null,
        loading: false
      })
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      })
    } catch (error) {
      console.error('Sign out error:', error)
      updateState({ error: error as Error })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null, // Handled by useAuthSession
        userRole,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)