import type { Database as GeneratedDatabase } from '@/integrations/supabase/types'

export type Database = GeneratedDatabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type CurrencyType = Database['public']['Enums']['currency_type']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type UserRole = Database['public']['Enums']['user_role']
export type PermanentLinkStatus = Database['public']['Enums']['permanent_link_status']