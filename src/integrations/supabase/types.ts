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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
