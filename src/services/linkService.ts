import { supabase } from '@/integrations/supabase/client'
import type { PermanentLink } from '@/types/database/tables'

export const linkService = {
  async getActivePermanentLinks(): Promise<PermanentLink[]> {
    const { data, error } = await supabase
      .from('permanent_links')
      .select(`
        *,
        product:products (
          id,
          title,
          description,
          price,
          currency,
          images:product_images (
            url
          ),
          seller:users (
            whatsapp_number
          )
        )
      `)
      .eq('status', 'active')
      .order('performance_score', { ascending: false })

    if (error) throw error
    
    // Transform the data to match PermanentLink type
    return (data || []).map(link => ({
      ...link,
      product: {
        ...link.product,
        images: link.product.images || [],
        seller: link.product.seller || { whatsapp_number: null }
      }
    }))
  }
}