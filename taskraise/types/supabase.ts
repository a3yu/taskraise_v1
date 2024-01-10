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
      order_staffing: {
        Row: {
          assigned: string | null
          created_at: string
          id: number
          organization: number
        }
        Insert: {
          assigned?: string | null
          created_at?: string
          id?: number
          organization: number
        }
        Update: {
          assigned?: string | null
          created_at?: string
          id?: number
          organization?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_staffing_assigned_fkey"
            columns: ["assigned"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_staffing_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string
          customer_username: string
          details: string
          id: number
          org_id: number
          price: number
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          customer_username: string
          details: string
          id?: number
          org_id?: number
          price: number
          status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          customer_username?: string
          details?: string
          id?: number
          org_id?: number
          price?: number
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_username_fkey"
            columns: ["customer_username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string
          id: number
          org_name: string
          org_owner: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          org_name: string
          org_owner: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          org_name?: string
          org_owner?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_org_owner_fkey"
            columns: ["org_owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization: number | null
          username: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization?: number | null
          username?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      requests: {
        Row: {
          id: number
          inviter_name: string | null
          org_name: string | null
          user_invite: string
        }
        Insert: {
          id?: number
          inviter_name?: string | null
          org_name?: string | null
          user_invite: string
        }
        Update: {
          id?: number
          inviter_name?: string | null
          org_name?: string | null
          user_invite?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_inviter_name_fkey"
            columns: ["inviter_name"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "requests_org_name_fkey"
            columns: ["org_name"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["org_name"]
          },
          {
            foreignKeyName: "requests_user_invite_fkey"
            columns: ["user_invite"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          created_at: string
          id: number
          service_description: string
          service_title: string
        }
        Insert: {
          created_at?: string
          id?: number
          service_description: string
          service_title: string
        }
        Update: {
          created_at?: string
          id?: number
          service_description?: string
          service_title?: string
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
      order_status:
        | "REQUESTED"
        | "DISPUTED"
        | "COMPLETED"
        | "REJECTED"
        | "ONGOING"
      role: "GENERAL" | "MEMBER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
