import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PointsRequest {
  action: 'add' | 'get' | 'referral'
  walletAddress: string
  points?: number
  activity?: string
  referralCode?: string
}

const POINT_VALUES = {
  'welcome': 100,
  'daily_login': 10,
  'app_usage': 5,
  'tunova_listen': 15,
  'chat_message': 2,
  'arcade_suggestion': 25,
  'referral_bonus': 50,
  'referred_bonus': 25,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, walletAddress, points, activity, referralCode }: PointsRequest = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'get':
        // Get user points
        const { data: userPoints, error: getError } = await supabaseClient
          .from('user_points')
          .select('*')
          .eq('wallet_address', walletAddress.toLowerCase())
          .single()

        if (getError) {
          throw getError
        }

        return new Response(
          JSON.stringify({ success: true, points: userPoints }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'add':
        // Add points for activity
        const pointsToAdd = activity ? POINT_VALUES[activity as keyof typeof POINT_VALUES] || points || 0 : points || 0

        const { data: updatedPoints, error: addError } = await supabaseClient
          .from('user_points')
          .update({
            points_balance: supabaseClient.raw(`points_balance + ${pointsToAdd}`),
            updated_at: new Date().toISOString(),
          })
          .eq('wallet_address', walletAddress.toLowerCase())
          .select()
          .single()

        if (addError) {
          throw addError
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            points: updatedPoints,
            pointsAdded: pointsToAdd,
            activity: activity 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'referral':
        // Handle referral system
        if (!referralCode) {
          return new Response(
            JSON.stringify({ error: 'Referral code required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Find the referrer
        const { data: referrer, error: referrerError } = await supabaseClient
          .from('user_points')
          .select('*')
          .eq('referral_code', referralCode)
          .single()

        if (referrerError || !referrer) {
          return new Response(
            JSON.stringify({ error: 'Invalid referral code' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update referred user
        const { error: referredError } = await supabaseClient
          .from('user_points')
          .update({
            referred_by: referralCode,
            points_balance: supabaseClient.raw(`points_balance + ${POINT_VALUES.referred_bonus}`),
          })
          .eq('wallet_address', walletAddress.toLowerCase())

        if (referredError) {
          throw referredError
        }

        // Update referrer
        const { error: referrerUpdateError } = await supabaseClient
          .from('user_points')
          .update({
            points_balance: supabaseClient.raw(`points_balance + ${POINT_VALUES.referral_bonus}`),
          })
          .eq('wallet_address', referrer.wallet_address)

        if (referrerUpdateError) {
          throw referrerUpdateError
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Referral processed successfully',
            referredBonus: POINT_VALUES.referred_bonus,
            referrerBonus: POINT_VALUES.referral_bonus
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Points Manager Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})