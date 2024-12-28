import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { linkService } from '@/services/linkService';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ShoppingBag, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const FEATURED_PRODUCTS_COUNT = 12;

const HeroSection: React.FC = () => (
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
);

const ProductsSection: React.FC<{ links: PermanentLink[] }> = ({ links = [] }) => {
  const { featuredProducts, remainingProducts } = useMemo(() => ({
    featuredProducts: links.slice(0, FEATURED_PRODUCTS_COUNT),
    remainingProducts: links.slice(FEATURED_PRODUCTS_COUNT)
  }), [links]);

  return (
    <>
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
    </>
  );
};

const HomePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: links, error, isLoading } = useQuery({
    queryKey: ['active-permanent-links'],
    queryFn: linkService.getActivePermanentLinks,
    staleTime: 60000, // 1 minute
    retry: 2,
    meta: {
      errorHandler: (error: Error) => {
        console.error('Error fetching products:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load products. Please try again later.'
        });
      }
    }
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <HeroSection />
        
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Features grid */}
            </div>
          </div>
        </section>

        <ProductsSection links={links} />
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;