import type { Database } from '@/integrations/supabase/types'

export type CsrfToken = Database['public']['Tables']['csrf_tokens']['Row']
export type CsrfTokenInsert = Database['public']['Tables']['csrf_tokens']['Insert']
export type CsrfTokenUpdate = Database['public']['Tables']['csrf_tokens']['Update']