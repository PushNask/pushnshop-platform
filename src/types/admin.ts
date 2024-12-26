import type { Database } from '@/integrations/supabase/types'

type PaymentStatus = Database['public']['Enums']['payment_status']
type CurrencyType = Database['public']['Enums']['currency_type']

export interface SystemStatus {
  responseTime: number;
  errorRate: number;
}

export interface AdminMetrics {
  overview: {
    totalUsers: number;
    usersTrend: number;
    activeListings: number;
    listingsTrend: number;
    totalRevenue: number;
    revenueTrend: number;
    systemHealth: 'Excellent' | 'Good' | 'Warning';
    systemStatus: SystemStatus;
    pendingProducts: number;
    pendingPayments: number;
  };
  userMetrics: {
    growth: Array<{
      date: string;
      count: number;
    }>;
    demographics: Array<{
      role: string;
      count: number;
    }>;
  };
  productMetrics: {
    categories: Array<{
      status: string;
      count: number;
    }>;
  };
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
}

export interface Payment {
  id: string;
  amount: number;
  currency: CurrencyType;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  verification_notes: string | null;
  verified_by: string | null;
  buyer: {
    full_name: string | null;
  };
  product: {
    title: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: CurrencyType;
  created_at: string;
  status: string;
  seller: {
    full_name: string | null;
  };
}