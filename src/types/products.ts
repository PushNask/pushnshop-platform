export type BaseProduct = {
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

// Export Product type for broader use
export type Product = BaseProduct & {
  status: 'draft' | 'pending' | 'active' | 'expired';
  seller_id: string;
  expires_at: string | null;
  deleted_at: string | null;
};