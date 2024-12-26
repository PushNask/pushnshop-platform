import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import ProductCard from '../products/ProductCard'
import type { ProductWithRelations } from '@/types/database/products'

const ProductList = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['sellerProducts'],
    queryFn: async () => {
      console.log('Fetching seller products')
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(url),
          seller:users!inner(
            full_name,
            whatsapp_number
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }
      
      console.log('Products fetched:', data)
      return data as ProductWithRelations[]
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error('Query error:', error)
      }
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Failed to load products. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  if (!products?.length) {
    return (
      <Alert className="my-4">
        <AlertDescription>
          You haven't created any products yet.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          description={product.description}
          price={Number(product.price)}
          currency={product.currency}
          imageUrl={product.images?.[0]?.url}
          whatsappNumber={product.seller?.whatsapp_number || ''}
          linkId={0}
          showActions={true}
        />
      ))}
    </div>
  )
}

export default ProductList