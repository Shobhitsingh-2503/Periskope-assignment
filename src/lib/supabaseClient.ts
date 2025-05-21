import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  content: string
  created_at: string
  read: boolean
}

export type Conversation = {
  id: string
  name: string
  last_message: string
  last_message_time: string
  participants: string[]
  unread_count: number
  type: "demo" | "internal" | "contact" | ""
  tags: string[]
}

export type User = {
  id: string
  name: string
  avatar_url: string
  phone: string
}
