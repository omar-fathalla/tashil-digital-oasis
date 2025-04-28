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
      activity_log: {
        Row: {
          action: string | null
          created_at: string | null
          details: Json | null
          id: string
          target: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          file_name: string
          file_url: string
          id: string
          related_request: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_url: string
          id?: string
          related_request?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_url?: string
          id?: string
          related_request?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_related_request_fkey"
            columns: ["related_request"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_files: {
        Row: {
          description: string | null
          file_data: Json
          file_name: string
          file_type: string
          id: string
          table_name: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          description?: string | null
          file_data: Json
          file_name: string
          file_type: string
          id?: string
          table_name: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          description?: string | null
          file_data?: Json
          file_name?: string
          file_type?: string
          id?: string
          table_name?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string
          commercial_register_url: string
          company_name: string
          company_number: string
          created_at: string | null
          id: string
          register_number: string
          tax_card_number: string
          tax_card_url: string
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string
          commercial_register_url?: string
          company_name: string
          company_number?: string
          created_at?: string | null
          id?: string
          register_number?: string
          tax_card_number?: string
          tax_card_url?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          commercial_register_url?: string
          company_name?: string
          company_number?: string
          created_at?: string | null
          id?: string
          register_number?: string
          tax_card_number?: string
          tax_card_url?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_registrations: {
        Row: {
          address: string | null
          commercial_register_number: string | null
          company_name: string
          company_number: string | null
          created_at: string | null
          id: string
          tax_card_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          commercial_register_number?: string | null
          company_name: string
          company_number?: string | null
          created_at?: string | null
          id?: string
          tax_card_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          commercial_register_number?: string | null
          company_name?: string
          company_number?: string | null
          created_at?: string | null
          id?: string
          tax_card_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_users: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      document_access_logs: {
        Row: {
          action: string
          details: Json | null
          document_id: string
          id: string
          ip_address: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          document_id: string
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          document_id?: string
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_permissions: {
        Row: {
          can_delete: boolean
          can_edit: boolean
          can_share: boolean
          can_view: boolean
          created_at: string
          document_id: string
          id: string
          role_id: string
          updated_at: string
        }
        Insert: {
          can_delete?: boolean
          can_edit?: boolean
          can_share?: boolean
          can_view?: boolean
          created_at?: string
          document_id: string
          id?: string
          role_id: string
          updated_at?: string
        }
        Update: {
          can_delete?: boolean
          can_edit?: boolean
          can_share?: boolean
          can_view?: boolean
          created_at?: string
          document_id?: string
          id?: string
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      document_types: {
        Row: {
          created_at: string | null
          id: string
          instructions: string | null
          name: string
          required: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instructions?: string | null
          name: string
          required?: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instructions?: string | null
          name?: string
          required?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string
          document_id: string
          file_size: number
          file_url: string
          id: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by: string
          document_id: string
          file_size: number
          file_url: string
          id?: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string
          document_id?: string
          file_size?: number
          file_url?: string
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_encrypted: boolean
          keywords: string[] | null
          metadata: Json
          name: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_encrypted?: boolean
          keywords?: string[] | null
          metadata?: Json
          name: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_encrypted?: boolean
          keywords?: string[] | null
          metadata?: Json
          name?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_registrations: {
        Row: {
          area: string | null
          collected_at: string | null
          collector_name: string | null
          company_id: string | null
          employee_id: string
          first_name: string
          full_name: string
          id: string
          insurance_number: string | null
          last_name: string
          mid_name: string | null
          photo_url: string | null
          position: string | null
          printed: boolean | null
          printed_at: string | null
          request_type: string | null
          sex: string | null
          status: string | null
          submission_date: string | null
          user_id: string | null
        }
        Insert: {
          area?: string | null
          collected_at?: string | null
          collector_name?: string | null
          company_id?: string | null
          employee_id: string
          first_name: string
          full_name: string
          id?: string
          insurance_number?: string | null
          last_name: string
          mid_name?: string | null
          photo_url?: string | null
          position?: string | null
          printed?: boolean | null
          printed_at?: string | null
          request_type?: string | null
          sex?: string | null
          status?: string | null
          submission_date?: string | null
          user_id?: string | null
        }
        Update: {
          area?: string | null
          collected_at?: string | null
          collector_name?: string | null
          company_id?: string | null
          employee_id?: string
          first_name?: string
          full_name?: string
          id?: string
          insurance_number?: string | null
          last_name?: string
          mid_name?: string | null
          photo_url?: string | null
          position?: string | null
          printed?: boolean | null
          printed_at?: string | null
          request_type?: string | null
          sex?: string | null
          status?: string | null
          submission_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      employee_requests: {
        Row: {
          commercial_register_number: string | null
          company_id: string | null
          company_name: string | null
          company_number: string | null
          employee_id: string
          employee_name: string
          id: string
          notes: string | null
          request_date: string | null
          request_type: string
          status: string | null
          tax_card_number: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          commercial_register_number?: string | null
          company_id?: string | null
          company_name?: string | null
          company_number?: string | null
          employee_id: string
          employee_name: string
          id?: string
          notes?: string | null
          request_date?: string | null
          request_type: string
          status?: string | null
          tax_card_number?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          commercial_register_number?: string | null
          company_id?: string | null
          company_name?: string | null
          company_number?: string | null
          employee_id?: string
          employee_name?: string
          id?: string
          notes?: string | null
          request_date?: string | null
          request_type?: string
          status?: string | null
          tax_card_number?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      form_fields: {
        Row: {
          id: string
          is_required: boolean | null
          name: string
          position: string | null
          type: string
        }
        Insert: {
          id?: string
          is_required?: boolean | null
          name: string
          position?: string | null
          type: string
        }
        Update: {
          id?: string
          is_required?: boolean | null
          name?: string
          position?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_position_fkey"
            columns: ["position"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          read: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          id: string
          key: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      position_types: {
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
      positions: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      project_activities: {
        Row: {
          action: string
          description: string
          id: string
          project_id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action: string
          description: string
          id?: string
          project_id: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action?: string
          description?: string
          id?: string
          project_id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_backups: {
        Row: {
          created_at: string | null
          created_by: string
          data: Json
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          data: Json
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          data?: Json
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_backups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      regions: {
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
      registration_requests: {
        Row: {
          documents: Json | null
          full_name: string | null
          id: string
          national_id: string | null
          status: string | null
          submission_date: string | null
        }
        Insert: {
          documents?: Json | null
          full_name?: string | null
          id: string
          national_id?: string | null
          status?: string | null
          submission_date?: string | null
        }
        Update: {
          documents?: Json | null
          full_name?: string | null
          id?: string
          national_id?: string | null
          status?: string | null
          submission_date?: string | null
        }
        Relationships: []
      }
      representatives: {
        Row: {
          company_id: string | null
          created_at: string | null
          employee_id: string | null
          full_name: string
          id: string
          photo_url: string | null
          type: string
          value: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          full_name: string
          id?: string
          photo_url?: string | null
          type: string
          value: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          full_name?: string
          id?: string
          photo_url?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "representatives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      request_documents: {
        Row: {
          id: string
          request_id: string | null
          status: string | null
          submitted_at: string | null
          template_id: string | null
        }
        Insert: {
          id?: string
          request_id?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: string | null
        }
        Update: {
          id?: string
          request_id?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created_at: string | null
          id: string
          request_type: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          request_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
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
        Relationships: [
          {
            foreignKeyName: "system_settings_audit_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_audit_setting_id_fkey"
            columns: ["setting_id"]
            isOneToOne: false
            referencedRelation: "system_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_approved_requests: {
        Args: { limit_count?: number }
        Returns: {
          documents: Json | null
          full_name: string | null
          id: string
          national_id: string | null
          status: string | null
          submission_date: string | null
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_print_request_by_id: {
        Args: { request_id: string }
        Returns: {
          documents: Json | null
          full_name: string | null
          id: string
          national_id: string | null
          status: string | null
          submission_date: string | null
        }
      }
      get_table_indexes: {
        Args: { target_table?: string }
        Returns: {
          name: string
          table_name: string
          index_type: string
          is_unique: boolean
          is_primary: boolean
          columns: string[]
        }[]
      }
      get_user_permissions: {
        Args: { user_id: string }
        Returns: {
          permission_key: string
          permission_name: string
        }[]
      }
      has_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
