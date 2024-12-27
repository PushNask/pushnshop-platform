import { useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { logError } from '@/utils/errorLogger'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

type UseAuthSessionProps = {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setUserRole: (role: UserRole | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthSession = ({
  setUser,
  setSession,
  setUserRole,
  setLoading
}: UseAuthSessionProps) => {
  useEffect(() => {
    console.log('Setting up auth listeners...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id)
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
      console.log('Auth state changed:', {
        event: _event,
        userId: session?.user?.id,
      })
      
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
  }, [setUser, setSession, setUserRole, setLoading])

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error

      console.log('User role found:', data?.role)
      setUserRole(data?.role ?? null)
    } catch (error) {
      logError(error, 'FetchUserRole', userId)
      setUserRole(null)
    } finally {
      setLoading(false)
    }
  }
}