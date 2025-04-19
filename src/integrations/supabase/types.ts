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
      applications: {
        Row: {
          created_at: string | null
          employee_id: string
          employee_name: string
          id: string
          notes: string | null
          request_date: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          employee_name: string
          id: string
          notes?: string | null
          request_date?: string | null
          status: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          employee_name?: string
          id?: string
          notes?: string | null
          request_date?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string
          commercial_register_number: string
          commercial_register_url: string | null
          company_name: string
          company_number: string
          created_at: string
          id: string
          tax_card_number: string
          tax_card_url: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          address: string
          commercial_register_number: string
          commercial_register_url?: string | null
          company_name: string
          company_number: string
          created_at?: string
          id?: string
          tax_card_number: string
          tax_card_url?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          address?: string
          commercial_register_number?: string
          commercial_register_url?: string | null
          company_name?: string
          company_number?: string
          created_at?: string
          id?: string
          tax_card_number?: string
          tax_card_url?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      draws: {
        Row: {
          draw_time: string | null
          gift_id: string | null
          id: string
          site_id: string | null
          user_email: string | null
        }
        Insert: {
          draw_time?: string | null
          gift_id?: string | null
          id?: string
          site_id?: string | null
          user_email?: string | null
        }
        Update: {
          draw_time?: string | null
          gift_id?: string | null
          id?: string
          site_id?: string | null
          user_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draws_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draws_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_registrations: {
        Row: {
          area: string | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          employee_id: string
          first_name: string
          full_name: string
          id: string
          insurance_number: string | null
          last_name: string
          mid_name: string | null
          national_id: string | null
          photo_url: string | null
          position: string | null
          printed: boolean | null
          printed_at: string | null
          request_type: string | null
          sex: string | null
          status: string | null
          submission_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          area?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          employee_id: string
          first_name: string
          full_name: string
          id?: string
          insurance_number?: string | null
          last_name: string
          mid_name?: string | null
          national_id?: string | null
          photo_url?: string | null
          position?: string | null
          printed?: boolean | null
          printed_at?: string | null
          request_type?: string | null
          sex?: string | null
          status?: string | null
          submission_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          area?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          employee_id?: string
          first_name?: string
          full_name?: string
          id?: string
          insurance_number?: string | null
          last_name?: string
          mid_name?: string | null
          national_id?: string | null
          photo_url?: string | null
          position?: string | null
          printed?: boolean | null
          printed_at?: string | null
          request_type?: string | null
          sex?: string | null
          status?: string | null
          submission_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gifts: {
        Row: {
          created_at: string | null
          gift_name: string
          id: string
          site_id: string | null
          stock: number | null
        }
        Insert: {
          created_at?: string | null
          gift_name: string
          id?: string
          site_id?: string | null
          stock?: number | null
        }
        Update: {
          created_at?: string | null
          gift_name?: string
          id?: string
          site_id?: string | null
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gifts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          created_at: string | null
          documents: Json | null
          employee_details: Json | null
          full_name: string
          id: string
          national_id: string
          status: Database["public"]["Enums"]["request_status"] | null
          submission_date: string | null
          submission_history: Json[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          documents?: Json | null
          employee_details?: Json | null
          full_name: string
          id?: string
          national_id: string
          status?: Database["public"]["Enums"]["request_status"] | null
          submission_date?: string | null
          submission_history?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          documents?: Json | null
          employee_details?: Json | null
          full_name?: string
          id?: string
          national_id?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          submission_date?: string | null
          submission_history?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
      request_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      request_status: ["pending", "approved", "rejected"],
    },
  },
} as const
