// Database types for Supabase
// Generated based on our schema design

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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired'
          total_amount: number
          content: Json | null
          template_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired'
          total_amount?: number
          content?: Json | null
          template_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired'
          total_amount?: number
          content?: Json | null
          template_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json | null
          category: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: Json | null
          category?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json | null
          category?: string | null
          is_public?: boolean
          created_at?: string
        }
      }
      recipients: {
        Row: {
          id: string
          document_id: string
          email: string
          name: string | null
          role: 'signer' | 'approver' | 'cc'
          order_index: number
          status: 'pending' | 'viewed' | 'signed'
          signed_at: string | null
          signature_data: Json | null
        }
        Insert: {
          id?: string
          document_id: string
          email: string
          name?: string | null
          role?: 'signer' | 'approver' | 'cc'
          order_index?: number
          status?: 'pending' | 'viewed' | 'signed'
          signed_at?: string | null
          signature_data?: Json | null
        }
        Update: {
          id?: string
          document_id?: string
          email?: string
          name?: string | null
          role?: 'signer' | 'approver' | 'cc'
          order_index?: number
          status?: 'pending' | 'viewed' | 'signed'
          signed_at?: string | null
          signature_data?: Json | null
        }
      }
      fields: {
        Row: {
          id: string
          document_id: string
          recipient_id: string | null
          type: 'text' | 'signature' | 'initials' | 'date' | 'checkbox' | 'radio' | 'dropdown' | 'file'
          block_id: string | null
          label: string | null
          required: boolean
          value: Json | null
          position: Json | null
        }
        Insert: {
          id?: string
          document_id: string
          recipient_id?: string | null
          type: 'text' | 'signature' | 'initials' | 'date' | 'checkbox' | 'radio' | 'dropdown' | 'file'
          block_id?: string | null
          label?: string | null
          required?: boolean
          value?: Json | null
          position?: Json | null
        }
        Update: {
          id?: string
          document_id?: string
          recipient_id?: string | null
          type?: 'text' | 'signature' | 'initials' | 'date' | 'checkbox' | 'radio' | 'dropdown' | 'file'
          block_id?: string | null
          label?: string | null
          required?: boolean
          value?: Json | null
          position?: Json | null
        }
      }
      activity_log: {
        Row: {
          id: string
          document_id: string
          user_id: string | null
          action: 'created' | 'edited' | 'sent' | 'viewed' | 'signed' | 'completed' | 'expired'
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id?: string | null
          action: 'created' | 'edited' | 'sent' | 'viewed' | 'signed' | 'completed' | 'expired'
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string | null
          action?: 'created' | 'edited' | 'sent' | 'viewed' | 'signed' | 'completed' | 'expired'
          details?: Json | null
          created_at?: string
        }
      }
      content_library: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'text' | 'image' | 'block'
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: 'text' | 'image' | 'block'
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'text' | 'image' | 'block'
          content?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired'
      recipient_role: 'signer' | 'approver' | 'cc'
      recipient_status: 'pending' | 'viewed' | 'signed'
      field_type: 'text' | 'signature' | 'initials' | 'date' | 'checkbox' | 'radio' | 'dropdown' | 'file'
      activity_action: 'created' | 'edited' | 'sent' | 'viewed' | 'signed' | 'completed' | 'expired'
      content_library_type: 'text' | 'image' | 'block'
    }
  }
}
