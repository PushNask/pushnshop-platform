import type { Database } from '@/integrations/supabase/types'

// Table types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export type PermanentLink = Database['public']['Tables']['permanent_links']['Row'] & {
  product: {
    id: string
    title: string
    description: string
    price: number
    currency: Database['public']['Enums']['currency_type']
    images: { url: string }[]
    seller: {
      whatsapp_number: string | null
    }
  }
}

export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type SystemMetrics = Database['public']['Tables']['system_metrics']['Row']
export type SystemSettings = Database['public']['Tables']['system_settings']['Row']