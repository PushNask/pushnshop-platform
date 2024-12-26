export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      permanent_links: {
        Row: {
          id: number
          product_id: string | null
          status: 'active' | 'available'
          performance_score: number
          created_at: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string | null
          url: string
          alt: string | null
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          currency: 'XAF' | 'USD'
          seller_id: string
          created_at: string
        }
      }
      users: {
        Row: {
          id: string
          full_name: string | null
          whatsapp_number: string | null
          created_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}