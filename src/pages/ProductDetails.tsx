import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Eye, Info, Link } from 'lucide-react';
import ShareProduct from '@/components/products/ShareProduct';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { withErrorBoundary } from '@/components/shared/ErrorBoundary';

type BaseProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  created_at: string;
  seller?: {
    whatsapp_number: string;
    full_name: string;
  };
  images?: Array<{
    url: string;
    alt: string;
  }>;
};

type ProductDetailsProps = {
  product: BaseProduct;
  linkId?: string;
  linkScore?: number;
};

const ProductDetailsCard: React.FC<ProductDetailsProps> = ({ 
  product, 
  linkId, 
  linkScore 
}) => {
  const handleContactSeller = () => {
    if (product.seller?.whatsapp_number) {
      const message = encodeURIComponent(`Hi, I'm interested in: ${product.title}`);
      window.open(
        `https://wa.me/${product.seller.whatsapp_number}?text=${message}`,
        '_blank'
      );
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {product.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {linkId && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link className="h-4 w-4" />
                <span>Link #{linkId}</span>
                {linkScore !== undefined && (
                  <>
                    <Eye className="h-4 w-4 ml-2" />
                    <span>Score: {linkScore}</span>
                  </>
                )}
              </div>
            )}
            {!linkId && <ShareProduct productId={product.id} title={product.title} />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {product.images?.[0] && (
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
            onClick={handleContactSeller}
          >
            Contact Seller on WhatsApp
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const ProductDetailsComponent = () => {
  const { id } = useParams();

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
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <div className="text-center p-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProductDetailsCard product={product} />
    </div>
  );
};

const PermanentLinkDetailsComponent = () => {
  const { linkNumber } = useParams();

  const { data: linkData, isLoading } = useQuery({
    queryKey: ['permanent-link', linkNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
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
        `)
        .eq('id', linkNumber)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!linkData?.product) {
    return <div className="text-center p-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProductDetailsCard 
        product={linkData.product}
        linkId={linkNumber}
        linkScore={linkData.performance_score}
      />
    </div>
  );
};

export const ProductDetails = withErrorBoundary(ProductDetailsComponent);
export const PermanentLinkDetails = withErrorBoundary(PermanentLinkDetailsComponent);

// Add default export for lazy loading
export default ProductDetails;