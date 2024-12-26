import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, Eye, Info, Link } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

const PermanentLinkDetails = () => {
  const { linkNumber } = useParams()

  const { data: linkData, isLoading } = useQuery({
    queryKey: ['permanent-link', linkNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
          listing:listings!permanent_link_id (
            product:products (
              *,
              seller:users (
                full_name,
                whatsapp_number
              ),
              images:product_images (
                url,
                alt
              )
            )
          )
        `)
        .eq('id', linkNumber)
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!linkData || !linkData.listing?.product) {
    return <div className="flex justify-center p-8">Product not found</div>
  }

  const product = linkData.listing.product

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {product.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link className="h-4 w-4" />
              <span>Link #{linkNumber}</span>
              <Eye className="h-4 w-4 ml-2" />
              <span>Score: {linkData.performance_score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.images && product.images[0] && (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span>{product.price} {product.currency}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.seller && (
            <Button
              className="w-full"
              onClick={() => {
                if (product.seller?.whatsapp_number) {
                  window.open(
                    `https://wa.me/${product.seller.whatsapp_number}`,
                    '_blank'
                  )
                }
              }}
            >
              Contact Seller on WhatsApp
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PermanentLinkDetails