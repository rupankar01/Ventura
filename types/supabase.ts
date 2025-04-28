export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          last_login: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          last_login?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          last_login?: string | null
          created_at?: string | null
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject: string | null
          session_name: string | null
          start_time: string
          end_time: string | null
          duration: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          subject?: string | null
          session_name?: string | null
          start_time: string
          end_time?: string | null
          duration?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string | null
          session_name?: string | null
          start_time?: string
          end_time?: string | null
          duration?: number | null
          created_at?: string | null
        }
      }
      study_rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          is_private: boolean | null
          room_code: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          is_private?: boolean | null
          room_code?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          is_private?: boolean | null
          room_code?: string | null
          created_at?: string | null
        }
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          joined_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          message: string
          created_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          message: string
          created_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          message?: string
          created_at?: string | null
        }
      }
      study_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number | null
          longest_streak: number | null
          last_study_date: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number | null
          longest_streak?: number | null
          last_study_date?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number | null
          longest_streak?: number | null
          last_study_date?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string | null
          name: string | null
          avatar_url: string | null
          total_study_time: number | null
          total_sessions: number | null
          current_streak: number | null
          longest_streak: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
