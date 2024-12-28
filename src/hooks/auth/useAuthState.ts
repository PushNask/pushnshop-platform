import { useState } from 'react'
import type { AuthState } from '@/types/auth'

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    userRole: null,
    loading: true,
    error: null,
  })

  const updateState = (newState: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...newState }))
  }

  return {
    ...state,
    updateState,
  }
}