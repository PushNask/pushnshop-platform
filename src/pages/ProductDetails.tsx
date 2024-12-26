import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, Eye, Info, Link } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

const ProductDetails = () => {
  const { id } = useParams()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:users (
            full_name,
            whatsapp_number
          ),
          images:product_images (
            url,
            alt
          )
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!product) {
    return <div className="flex justify-center p-8">Product not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {product.title}
          </CardTitle>
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

export default ProductDetails