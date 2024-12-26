import { supabase } from '@/integrations/supabase/client'

export const linkService = {
  async getActivePermanentLinks() {
    const { data, error } = await supabase
      .from('permanent_links')
      .select(`
        id,
        performance_score,
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
    return data
  }
}