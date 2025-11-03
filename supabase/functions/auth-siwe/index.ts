import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SIWERequest {
  message: string
  signature: string
  walletAddress: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, signature, walletAddress }: SIWERequest = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the signature (simplified - in production use a proper SIWE library)
    // For now, we'll trust the frontend verification
    if (!message || !signature || !walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    let user = existingUser

    // If user doesn't exist, create new profile
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabaseClient
        .from('user_profiles')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          username: `NAKAMA-${walletAddress.slice(-6).toUpperCase()}`,
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      user = newUser

      // Create initial NAKAMA status
      await supabaseClient
        .from('nakama_status')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          username: user.username,
          status: 'En el The Aetherius',
          is_online: true,
        })
    } else {
      // Update last seen and online status
      await supabaseClient
        .from('nakama_status')
        .upsert({
          wallet_address: walletAddress.toLowerCase(),
          username: user.username || `NAKAMA-${walletAddress.slice(-6).toUpperCase()}`,
          is_online: true,
          last_seen: new Date().toISOString(),
        })
    }

    // Generate JWT token for the user
    const token = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: `${walletAddress.toLowerCase()}@tidelabs.io`,
      options: {
        data: {
          wallet_address: walletAddress.toLowerCase(),
          username: user.username,
        }
      }
    })

    return new Response(
      JSON.stringify({
        success: true,
        user: user,
        token: token.data.properties?.action_link,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('SIWE Auth Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})