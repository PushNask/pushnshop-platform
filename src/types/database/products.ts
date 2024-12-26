import type { Database } from '@/integrations/supabase/types'

export type Product = Database['public']['Tables']['products']['Row']

export type ProductWithRelations = Product & {
  images?: { url: string }[]
  seller?: {
    whatsapp_number: string | null
  }
}