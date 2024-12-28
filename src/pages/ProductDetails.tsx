import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductDetailsCard } from '@/components/products/ProductDetailsCard';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { withErrorBoundary } from '@/components/shared/ErrorBoundary';
import type { BaseProduct } from '@/types/products';

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
      return data as BaseProduct;
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

// Default export for lazy loading
export default ProductDetails;