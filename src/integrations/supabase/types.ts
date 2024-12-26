export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      payments: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string | null
          currency: CurrencyType
          id: string
          product_id: string
          status: PaymentStatus
          updated_at: string | null
          verification_notes: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string | null
          currency?: CurrencyType
          id?: string
          product_id: string
          status?: PaymentStatus
          updated_at?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string | null
          currency?: CurrencyType
          id?: string
          product_id?: string
          status?: PaymentStatus
          updated_at?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
      }
      permanent_links: PermanentLinksTable
      product_images: ProductImagesTable
      products: ProductsTable
      system_settings: SystemSettingsTable
      users: UsersTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Split into separate interfaces for better organization
interface PermanentLinksTable {
  Row: {
    created_at: string | null
    id: number
    performance_score: number | null
    product_id: string | null
    status: PermanentLinkStatus | null
  }
  Insert: {
    created_at?: string | null
    id?: number
    performance_score?: number | null
    product_id?: string | null
    status?: PermanentLinkStatus | null
  }
  Update: {
    created_at?: string | null
    id?: number
    performance_score?: number | null
    product_id?: string | null
    status?: PermanentLinkStatus | null
  }
}

interface ProductImagesTable {
  Row: {
    alt: string | null
    created_at: string | null
    id: string
    product_id: string | null
    url: string
  }
  Insert: {
    alt?: string | null
    created_at?: string | null
    id?: string
    product_id?: string | null
    url: string
  }
  Update: {
    alt?: string | null
    created_at?: string | null
    id?: string
    product_id?: string | null
    url?: string
  }
}

interface ProductsTable {
  Row: {
    created_at: string | null
    currency: CurrencyType | null
    description: string
    id: string
    price: number
    seller_id: string
    title: string
    status: string
  }
  Insert: {
    created_at?: string | null
    currency?: CurrencyType | null
    description: string
    id?: string
    price: number
    seller_id: string
    title: string
    status?: string
  }
  Update: {
    created_at?: string | null
    currency?: CurrencyType | null
    description?: string
    id?: string
    price?: number
    seller_id?: string
    title?: string
    status?: string
  }
}

interface SystemSettingsTable {
  Row: {
    commission_rate: number
    default_duration_hours: number
    id: number
    max_product_price: number
    min_product_price: number
    updated_at: string | null
    updated_by: string | null
  }
  Insert: {
    commission_rate?: number
    default_duration_hours?: number
    id?: number
    max_product_price?: number
    min_product_price?: number
    updated_at?: string | null
    updated_by?: string | null
  }
  Update: {
    commission_rate?: number
    default_duration_hours?: number
    id?: number
    max_product_price?: number
    min_product_price?: number
    updated_at?: string | null
    updated_by?: string | null
  }
}

interface UsersTable {
  Row: {
    created_at: string | null
    full_name: string | null
    id: string
    role: UserRole | null
    whatsapp_number: string | null
  }
  Insert: {
    created_at?: string | null
    full_name?: string | null
    id: string
    role?: UserRole | null
    whatsapp_number?: string | null
  }
  Update: {
    created_at?: string | null
    full_name?: string | null
    id?: string
    role?: UserRole | null
    whatsapp_number?: string | null
  }
}

interface DatabaseFunctions {
  get_admin_dashboard_metrics: {
    Args: {
      time_range: string
    }
    Returns: Json
  }
  get_system_metrics: {
    Args: Record<PropertyKey, never>
    Returns: Json
  }
  get_system_settings: {
    Args: Record<PropertyKey, never>
    Returns: Json
  }
  increment_link_analytics: {
    Args: {
      p_link_id: number
      p_column: string
    }
    Returns: undefined
  }
  increment_rotation_count: {
    Args: {
      link_id: number
    }
    Returns: undefined
  }
  update_system_settings: {
    Args: {
      p_commission_rate?: number
      p_min_product_price?: number
      p_max_product_price?: number
      p_default_duration_hours?: number
    }
    Returns: Json
  }
}

interface DatabaseEnums {
  currency_type: CurrencyType
  payment_status: PaymentStatus
  permanent_link_status: PermanentLinkStatus
  user_role: UserRole
}

export type CurrencyType = "XAF" | "USD"
export type PaymentStatus = "pending" | "verified" | "rejected"
export type PermanentLinkStatus = "active" | "available"
export type UserRole = "admin" | "seller" | "buyer"

// Helper types for table operations
export type Tables<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Row']

export type TablesInsert<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Insert']

export type TablesUpdate<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Update']