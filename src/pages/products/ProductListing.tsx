import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { supabase } from '@/integrations/supabase/client'
import ProductCard from '@/components/products/ProductCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { Product } from '@/types/products'

const ProductListing = () => {
  const { user } = useAuth()

  const { data: products, error, isLoading } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)

      if (error) throw error
      return data
    },
    enabled: !!user?.id, // Only run the query if the user is logged in
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
          Failed to load products. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products?.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          description={product.description}
          price={Number(product.price)}
          currency={product.currency}
          linkId={0}
          showActions={true}
        />
      ))}
    </div>
  )
}

export default ProductListing