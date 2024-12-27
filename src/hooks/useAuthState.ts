import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

export type AuthState = {
  user: User | null
  userRole: UserRole | null
  loading: boolean
  error: Error | null
}

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userRole: null,
    loading: true,
    error: null
  })

  const updateState = (newState: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...newState }))
  }

  return {
    ...state,
    updateState
  }
}