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
      csrf_tokens: {
        Row: {
          created_at: string
          expires_at: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          id: string
          product_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          verification_notes: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          product_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          product_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_links: {
        Row: {
          created_at: string | null
          id: number
          performance_score: number | null
          product_id: string | null
          status: Database["public"]["Enums"]["permanent_link_status"] | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          performance_score?: number | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["permanent_link_status"] | null
        }
        Update: {
          created_at?: string | null
          id?: number
          performance_score?: number | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["permanent_link_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "permanent_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
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
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string
          expires_at: string | null
          id: string
          price: number
          seller_id: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description: string
          expires_at?: string | null
          id?: string
          price: number
          seller_id: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string
          expires_at?: string | null
          id?: string
          price?: number
          seller_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          active_users: number
          cpu_usage: number
          created_at: string
          error_rate: number
          id: number
          memory_usage: number
          response_time: number
        }
        Insert: {
          active_users?: number
          cpu_usage?: number
          created_at?: string
          error_rate?: number
          id?: number
          memory_usage?: number
          response_time?: number
        }
        Update: {
          active_users?: number
          cpu_usage?: number
          created_at?: string
          error_rate?: number
          id?: number
          memory_usage?: number
          response_time?: number
        }
        Relationships: []
      }
      system_settings: {
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
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_login_attempts: {
        Args: {
          p_email: string
          p_window_minutes?: number
          p_max_attempts?: number
        }
        Returns: boolean
      }
      cleanup_expired_csrf_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: {
          p_max_inactive_hours?: number
        }
        Returns: undefined
      }
      generate_csrf_token: {
        Args: {
          p_user_id: string
        }
        Returns: { token: string }
      }
      validate_csrf_token: {
        Args: {
          p_token: string
          p_user_id: string
        }
        Returns: boolean
      }
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
      is_super_admin_email: {
        Args: {
          email: string
        }
        Returns: boolean
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
    Enums: {
      currency_type: "XAF" | "USD"
      payment_status: "pending" | "verified" | "rejected"
      permanent_link_status: "active" | "available"
      user_role: "admin" | "seller" | "buyer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
