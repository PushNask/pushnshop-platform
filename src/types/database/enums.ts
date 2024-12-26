import type { Database } from '@/integrations/supabase/types'

export type CurrencyType = Database['public']['Enums']['currency_type']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type UserRole = Database['public']['Enums']['user_role']
export type PermanentLinkStatus = Database['public']['Enums']['permanent_link_status']