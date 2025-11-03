import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseKey = publicAnonKey

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database tables
export interface UserProfile {
  id: string
  wallet_address: string
  username?: string
  role?: string
  created_at: string
  updated_at: string
}

export interface UserPoints {
  id: string
  wallet_address: string
  points_balance: number
  referral_code: string
  airdrop_status: string
  referred_by?: string
  created_at: string
  updated_at: string
}

export interface NakamaStatus {
  id: string
  wallet_address: string
  username: string
  status: string
  status_message?: string
  last_seen: string
  is_online: boolean
}

export interface NakamaMessage {
  id: string
  sender_wallet: string
  sender_username: string
  message: string
  message_type: 'text' | 'buzz'
  created_at: string
}

export interface CrowdfundContribution {
  id: string
  wallet_address: string
  amount: number
  crypto_type: string
  transaction_hash?: string
  airdrop_guaranteed: number
  created_at: string
}

export interface ArcadeSuggestion {
  id: string
  wallet_address: string
  username: string
  suggestion_title: string
  suggestion_url: string
  suggestion_description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface WaitlistEntry {
  id: string
  wallet_address?: string
  email?: string
  username: string
  selected_role: string
  referral_code?: string
  referred_by?: string
  created_at: string
}