import { useQuery } from '@tanstack/react-query'
import { linkService } from '@/services/linkService'
import ProductCard from '@/components/products/ProductCard'
import { useToast } from '@/hooks/use-toast'

const HomePage = () => {
  const { toast } = useToast()
  
  const { data: links, error } = useQuery({
    queryKey: ['active-permanent-links'],
    queryFn: linkService.getActivePermanentLinks,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load products"
    })
  }

  // Separate featured (top 12) from remaining products
  const featuredProducts = links?.slice(0, 12) || []
  const remainingProducts = links?.slice(12) || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((link) => (
            <ProductCard
              key={link.id}
              id={link.product.id}
              title={link.product.title}
              description={link.product.description}
              price={link.product.price}
              currency={link.product.currency}
              imageUrl={link.product.images?.[0]?.url}
              whatsappNumber={link.product.seller?.whatsapp_number}
              linkId={link.id}
            />
          ))}
        </div>
      </section>

      {/* Remaining Products */}
      {remainingProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">More Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {remainingProducts.map((link) => (
              <ProductCard
                key={link.id}
                id={link.product.id}
                title={link.product.title}
                description={link.product.description}
                price={link.product.price}
                currency={link.product.currency}
                imageUrl={link.product.images?.[0]?.url}
                whatsappNumber={link.product.seller?.whatsapp_number}
                linkId={link.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage