import { createContext, useContext, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
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
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  // Use custom hooks for auth logic
  useAuthSession({ setUser, setSession, setUserRole, setLoading })
  useAuthRedirect({ user, userRole, loading })

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      console.log('Sign in successful for:', email)
      toast({
        title: "Welcome back!",
        description: "Successfully signed in."
      })
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in. Please check your credentials."
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user:', user?.id)
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
      setUserRole(null)
      
      console.log('Sign out successful')
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      })
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again."
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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