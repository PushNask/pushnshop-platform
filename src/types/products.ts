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