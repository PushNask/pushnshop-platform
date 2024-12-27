import { useState, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { logError } from '@/utils/errorLogger'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

const MAX_ROLE_CHECK_ATTEMPTS = 5
const ROLE_CHECK_INTERVAL = 1000 // 1 second

export const useRoleManagement = () => {
  const [isCheckingRole, setIsCheckingRole] = useState(false)
  const roleCheckAttemptsRef = useRef(0)

  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      console.log('Fetching role for user:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error
      return data?.role || null
    } catch (error) {
      logError(error, 'Error fetching user role')
      return null
    }
  }

  const ensureUserRecord = async (userId: string, email: string | undefined) => {
    try {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email,
          role: 'seller', // Default role
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: true,
        })

      if (upsertError) throw upsertError
    } catch (error) {
      logError(error, 'Error ensuring user record')
      throw error
    }
  }

  const checkRoleWithRetry = async (userId: string, email: string | undefined): Promise<UserRole> => {
    setIsCheckingRole(true)
    roleCheckAttemptsRef.current = 0

    try {
      // First ensure the user record exists
      await ensureUserRecord(userId, email)

      while (roleCheckAttemptsRef.current < MAX_ROLE_CHECK_ATTEMPTS) {
        console.log(`Role check attempt ${roleCheckAttemptsRef.current + 1}/${MAX_ROLE_CHECK_ATTEMPTS}`)
        
        const role = await fetchUserRole(userId)
        if (role) {
          console.log('Role found:', role)
          return role
        }

        roleCheckAttemptsRef.current++
        if (roleCheckAttemptsRef.current < MAX_ROLE_CHECK_ATTEMPTS) {
          await new Promise(resolve => setTimeout(resolve, ROLE_CHECK_INTERVAL))
        }
      }

      throw new Error('Failed to get user role after multiple attempts')
    } catch (error) {
      logError(error, 'Role check failed')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get user role. Please try logging in again.',
      })
      await supabase.auth.signOut()
      throw error
    } finally {
      setIsCheckingRole(false)
    }
  }

  return {
    checkRoleWithRetry,
    isCheckingRole
  }
}