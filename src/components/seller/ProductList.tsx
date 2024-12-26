import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'

const ProductList = () => {
  console.log('Rendering ProductList')
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['sellerProducts'],
    queryFn: async () => {
      console.log('Fetching seller products')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }
      
      console.log('Products fetched:', data)
      return data
    }
  })

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (error) {
    console.error('Error in ProductList:', error)
    return <div>Error loading products</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products?.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">
              {product.price} {product.currency}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ProductList