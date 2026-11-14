import type { PortfolioData } from '../../app/types/portfolio'

export type Database = {
  public: {
    Tables: {
      portfolio_admins: {
        Row: {
          user_id: string
        }
        Insert: {
          user_id: string
        }
        Update: {
          user_id?: string
        }
        Relationships: []
      }
      portfolio_content: {
        Row: {
          id: string
          data: PortfolioData
          updated_at: string
        }
        Insert: {
          id: string
          data: PortfolioData
          updated_at?: string
        }
        Update: {
          id?: string
          data?: PortfolioData
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
