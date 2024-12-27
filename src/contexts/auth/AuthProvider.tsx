import { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
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
  const { toast } = useToast()
  const navigate = useNavigate()

  // Use custom hooks for auth logic
  useAuthSession({ setUser, setSession, setUserRole, setLoading })
  useAuthRedirect({ user, userRole, navigate })

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
      setUserRole(null)
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
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