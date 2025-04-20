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
      employee_requests: {
        Row: {
          employee_id: string
          employee_name: string
          id: string
          notes: string | null
          request_date: string
          request_type: string
          status: string
        }
        Insert: {
          employee_id: string
          employee_name: string
          id?: string
          notes?: string | null
          request_date?: string
          request_type: string
          status?: string
        }
        Update: {
          employee_id?: string
          employee_name?: string
          id?: string
          notes?: string | null
          request_date?: string
          request_type?: string
          status?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          recipient_id: string
          request_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          recipient_id: string
          request_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          recipient_id?: string
          request_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "registration_requests"
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
      system_settings: {
        Row: {
          category: string
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      system_settings_audit: {
        Row: {
          category: string
          changed_at: string | null
          changed_by: string | null
          id: string
          key: string
          new_value: Json | null
          old_value: Json | null
          setting_id: string
        }
        Insert: {
          category: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          key: string
          new_value?: Json | null
          old_value?: Json | null
          setting_id: string
        }
        Update: {
          category?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          key?: string
          new_value?: Json | null
          old_value?: Json | null
          setting_id?: string
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
      create_notification: {
        Args: {
          p_recipient_id: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_title: string
          p_message: string
          p_metadata?: Json
          p_request_id?: string
        }
        Returns: string
      }
      update_setting: {
        Args: { p_category: string; p_key: string; p_value: Json }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      notification_type:
        | "request_submitted"
        | "request_approved"
        | "request_rejected"
        | "id_generated"
        | "missing_documents"
        | "document_rejected"
        | "admin_alert"
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
      notification_type: [
        "request_submitted",
        "request_approved",
        "request_rejected",
        "id_generated",
        "missing_documents",
        "document_rejected",
        "admin_alert",
      ],
      request_status: ["pending", "approved", "rejected"],
    },
  },
} as const
