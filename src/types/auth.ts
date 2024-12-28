import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

export type UserRole = Database['public']['Enums']['user_role']

export interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: UserRole | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export interface AuthState {
  user: User | null
  session: Session | null
  userRole: UserRole | null
  loading: boolean
  error: Error | null
}