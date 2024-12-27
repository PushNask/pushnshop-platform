import { useQuery } from '@tanstack/react-query'
import { linkService } from '@/services/linkService'
import ProductCard from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ArrowRight, ShoppingBag, Shield, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { PermanentLink } from '@/types/database/tables'

const HomePage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const { data: links, error } = useQuery({
    queryKey: ['active-permanent-links'],
    queryFn: linkService.getActivePermanentLinks,
    // Remove any auth requirements
    meta: {
      errorHandler: (error: Error) => {
        console.error('Error fetching products:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load products'
        })
      }
    }
  })

  if (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to load products'
    })
  }

  // Separate featured (top 12) from remaining products
  const featuredProducts = links?.slice(0, 12) || []
  const remainingProducts = links?.slice(12) || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary text-white px-4">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Your Local Marketplace
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Quick and trusted transactions with verified local sellers
          </p>
          <Button 
            size="lg" 
            className="animate-fade-up hover:scale-105 transition-transform"
            style={{ animationDelay: '0.4s' }}
            onClick={() => navigate('/signup')}
          >
            Start Selling
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Browse Products</h3>
              <p className="text-muted-foreground">
                Find great local deals from verified sellers
              </p>
            </div>
            <div className="text-center space-y-4">
              <Shield className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Contact Seller</h3>
              <p className="text-muted-foreground">
                Connect directly via WhatsApp with sellers
              </p>
            </div>
            <div className="text-center space-y-4">
              <Clock className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Quick Deals</h3>
              <p className="text-muted-foreground">
                Meet locally and complete your transaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
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
        </div>
      </section>

      {/* Remaining Products */}
      {remainingProducts.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">More Products</h2>
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
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage