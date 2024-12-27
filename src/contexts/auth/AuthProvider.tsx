import { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'
import { checkRateLimit } from '@/utils/security'

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user role:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user role. Please try again."
        })
        setLoading(false)
        return
      }

      if (!data) {
        console.log('No user profile found, creating one...')
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.user_metadata) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              full_name: user.user_metadata.full_name,
              whatsapp_number: user.user_metadata.whatsapp_number,
              role: user.user_metadata.role || 'buyer'
            })

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to create user profile. Please try again."
            })
            setLoading(false)
            return
          }

          setUserRole(user.user_metadata.role as UserRole || 'buyer')
        }
      } else {
        console.log('User role found:', data.role)
        setUserRole(data.role)
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Check rate limiting
      const isAllowed = await checkRateLimit(email)
      if (!isAllowed) {
        throw new Error('Too many login attempts. Please try again later.')
      }

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
