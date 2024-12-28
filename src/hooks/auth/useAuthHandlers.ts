import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { AuthState, UserRole } from '@/types/auth'

export const useAuthHandlers = (updateState: (state: Partial<AuthState>) => void) => {
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data?.role || null
    } catch (error) {
      console.error('Error fetching user role:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch user role. Please try again.',
      })
      return null
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      updateState({ loading: true, error: null })

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
    } catch (err) {
      console.error('Sign in error:', err)
      updateState({ error: err as Error })
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: err instanceof Error ? err.message : 'Failed to sign in',
      })
      throw err
    } finally {
      updateState({ loading: false })
    }
  }, [updateState])

  const signOut = useCallback(async () => {
    try {
      updateState({ loading: true, error: null })

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      updateState({
        user: null,
        session: null,
        userRole: null,
      })

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
    } catch (err) {
      console.error('Sign out error:', err)
      updateState({ error: err as Error })
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: err instanceof Error ? err.message : 'Failed to sign out',
      })
      throw err
    } finally {
      updateState({ loading: false })
    }
  }, [updateState])

  return {
    fetchUserRole,
    signIn,
    signOut,
  }
}