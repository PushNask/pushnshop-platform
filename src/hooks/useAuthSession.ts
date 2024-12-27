import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { AuthState } from './useAuthState'

type UseAuthSessionProps = {
  updateState: (state: Partial<AuthState>) => void
}

export const useAuthSession = ({ updateState }: UseAuthSessionProps) => {
  useEffect(() => {
    console.log('Setting up auth listeners...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateState({
          user: session.user,
          loading: true
        })
        fetchUserRole(session.user.id)
      } else {
        updateState({ loading: false })
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
      
      if (session?.user) {
        updateState({
          user: session.user,
          loading: true
        })
        await fetchUserRole(session.user.id)
      } else {
        updateState({
          user: null,
          userRole: null,
          loading: false
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [updateState])

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error

      updateState({
        userRole: data.role,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching user role:', error)
      updateState({
        error: error as Error,
        loading: false
      })
    }
  }
}