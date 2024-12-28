import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

// Define the UserRole type based on your Supabase database enums
type UserRole = Database['public']['Enums']['user_role']

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * Fetches the user role from the 'users' table based on user ID.
   */
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (roleError) {
        throw roleError
      }

      return data.role as UserRole
    } catch (roleError) {
      console.error('Error fetching user role:', roleError)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch user role. Please try again.',
      })
      return null
    }
  }, [])

  /**
   * Handles authentication state changes.
   */
  const handleAuthChange = useCallback(
    async (event: AuthChangeEvent, sessionData: Session | null) => {
      console.log('Auth state changed:', { event, userId: sessionData?.user?.id })

      setSession(sessionData)

      if (sessionData?.user) {
        setUser(sessionData.user)
        setLoading(true)

        const role = await fetchUserRole(sessionData.user.id)
        setUserRole(role)
        setLoading(false)
      } else {
        setUser(null)
        setUserRole(null)
        setLoading(false)
      }
    },
    [fetchUserRole]
  )

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession()
      await handleAuthChange('INITIAL_SESSION', data.session)
    }

    initializeAuth()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [handleAuthChange])

  /**
   * Signs in the user with email and password.
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      setLoading(true)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      console.log('Sign in successful for:', email)
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
    } catch (err) {
      console.error('Sign in error:', err)
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: err instanceof Error ? err.message : 'Failed to sign in',
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Signs out the current user.
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      console.log('Signed out successfully')
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
    } catch (err) {
      console.error('Sign out error:', err)
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: err instanceof Error ? err.message : 'Failed to sign out',
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Memoize the context value to optimize performance
  const contextValue = useMemo(
    () => ({
      user,
      session,
      userRole,
      loading,
      signIn,
      signOut,
    }),
    [user, session, userRole, loading, signIn, signOut]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to access the authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}