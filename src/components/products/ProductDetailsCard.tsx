import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Eye, Info, Link } from 'lucide-react';
import ShareProduct from '@/components/products/ShareProduct';
import type { BaseProduct } from '@/types/products';

type ProductDetailsCardProps = {
  product: BaseProduct;
  linkId?: string;
  linkScore?: number;
};

export const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({ 
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