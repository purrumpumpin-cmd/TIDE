import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string
  petType: 'poseidrop' | 'ungabunga' | 'beatbunny'
  walletAddress?: string
}

// Knowledge bases for each pet
const KNOWLEDGE_BASES = {
  poseidrop: {
    personality: "Soy PoseiDrop, el delfín logístico de TIDElabs. Soy experto en sistemas de puntos, airdrops, referidos y toda la logística del ecosistema NAKAMA. Hablo de manera profesional pero amigable, siempre con un toque marino.",
    knowledge: {
      points: "El sistema de puntos NAKAMA te permite ganar puntos por diversas actividades: +100 por registro inicial, +10 por login diario, +5 por usar aplicaciones, +15 por escuchar TUNOVA, +2 por mensaje en chat, +25 por sugerir juegos, +50 por referir NAKAMAs.",
      airdrops: "Los airdrops están garantizados según tu contribución al crowdfunding: Grumete (1 USDT) = 5 airdrops, Marinero (10 USDT) = 10 airdrops, Contramaestre (50 USDT) = 25 airdrops, Capitán (100 USDT) = 50 airdrops. Más contribución = más airdrops.",
      referrals: "Cada NAKAMA tiene un código único NAKAMA-XXXXXX. Cuando alguien usa tu código, ambos ganan puntos: +25 para el referido, +50 para el referente. Los códigos se generan automáticamente al registrarse.",
      crowdfunding: "El Tesoro Compartido acepta múltiples criptomonedas: ETH, USDT, USDC, BNB, MATIC. Mínimo 1 USDT. Cada dólar contribuido = 10 puntos NAKAMA + airdrops garantizados según el tier."
    }
  },
  ungabunga: {
    personality: "¡UngaBunga aquí! Soy el mono del sistema, conozco todos los secretos técnicos de TIDElabs OS. Hablo de manera casual y divertida, usando jerga técnica pero explicándola de forma simple. ¡Oook oook!",
    knowledge: {
      system: "TIDElabs OS está construido con React + TypeScript + Vite, usando Supabase como backend. Es un OS retro-futurista que simula Windows 95 pero con funcionalidades Web3 modernas.",
      captain: "El Capitán es el líder visionario de TIDElabs, creador del ecosistema NAKAMA. Su visión es crear un santuario digital donde la creatividad y la tecnología se unen para formar una comunidad próspera.",
      architecture: "El sistema usa Supabase Realtime para chat en tiempo real, Edge Functions para lógica de negocio, Row Level Security para protección de datos, y WalletConnect para autenticación Web3.",
      apps: "Las aplicaciones incluyen: MSN.CHAT (messenger pirata), ARCADE.EXE (juegos retro), CROWDFUND.WEB3 (financiación), TUNOVA.IO (música), EXPLORER.EXE (NFTs), WAITLIST.SH (registro), SETTINGS.SYS (configuración)."
    }
  },
  beatbunny: {
    personality: "¡Yo soy BeatBunny! 🎵 El conejo musical de TIDElabs, experto en TUNOVA.IO, música, artistas y todo lo relacionado con la Radio Pirata. Hablo con ritmo y siempre menciono música. ¡Let's drop the beat!",
    knowledge: {
      tunova: "TUNOVA.IO es nuestra plataforma musical revolucionaria donde los artistas pueden subir sus tracks, crear casetes NFT y ganar tokens. Los usuarios ganan puntos escuchando música (+15 por sesión de 5+ minutos).",
      radio: "Radio Pirata es nuestro canal de música 24/7 que reproduce los mejores tracks de TUNOVA.IO. Mezcla géneros desde synthwave hasta trap, siempre con esa vibra retro-futurista que nos caracteriza.",
      artists: "Apoyamos artistas independientes dándoles herramientas Web3 para monetizar su música. Pueden crear casetes NFT, recibir tips en crypto y construir su fanbase en el ecosistema NAKAMA.",
      music: "La música es el alma de TIDElabs. Creemos que cada beat cuenta, cada melodía importa. Desde lo-fi chill hasta electronic bangers, celebramos toda la creatividad musical."
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, petType, walletAddress }: ChatRequest = await req.json()

    if (!message || !petType) {
      return new Response(
        JSON.stringify({ error: 'Message and petType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pet = KNOWLEDGE_BASES[petType]
    if (!pet) {
      return new Response(
        JSON.stringify({ error: 'Invalid pet type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Simple keyword-based responses (in production, use OpenAI API)
    let response = generateResponse(message.toLowerCase(), pet, petType)

    // Add personality touch
    response = addPersonalityTouch(response, petType)

    return new Response(
      JSON.stringify({
        success: true,
        response: response,
        pet: petType,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateResponse(message: string, pet: any, petType: string): string {
  // Keywords mapping
  const keywords = {
    poseidrop: {
      'puntos': pet.knowledge.points,
      'airdrop': pet.knowledge.airdrops,
      'referir': pet.knowledge.referrals,
      'crowdfund': pet.knowledge.crowdfunding,
      'contribuir': pet.knowledge.crowdfunding,
      'dinero': pet.knowledge.crowdfunding
    },
    ungabunga: {
      'sistema': pet.knowledge.system,
      'capitan': pet.knowledge.captain,
      'arquitectura': pet.knowledge.architecture,
      'aplicacion': pet.knowledge.apps,
      'app': pet.knowledge.apps,
      'tecnico': pet.knowledge.architecture
    },
    beatbunny: {
      'tunova': pet.knowledge.tunova,
      'musica': pet.knowledge.music,
      'radio': pet.knowledge.radio,
      'artista': pet.knowledge.artists,
      'cancion': pet.knowledge.music,
      'beat': pet.knowledge.music
    }
  }

  const petKeywords = keywords[petType as keyof typeof keywords]
  
  // Find matching keywords
  for (const [keyword, response] of Object.entries(petKeywords)) {
    if (message.includes(keyword)) {
      return response
    }
  }

  // Default responses
  const defaultResponses = {
    poseidrop: "¡Ahoy! Soy PoseiDrop, tu delfín logístico. Puedo ayudarte con puntos, airdrops, referidos y crowdfunding. ¿Qué necesitas saber sobre el sistema NAKAMA?",
    ungabunga: "¡Oook oook! UngaBunga aquí. Soy el mono técnico del sistema. Pregúntame sobre el Capitán, la arquitectura del OS, o cualquier aspecto técnico de TIDElabs.",
    beatbunny: "¡Hey hey! 🎵 BeatBunny en la casa. Soy tu conejo musical favorito. Pregúntame sobre TUNOVA.IO, Radio Pirata, artistas o cualquier cosa musical. ¡Let's vibe!"
  }

  return defaultResponses[petType as keyof typeof defaultResponses] || "¡Hola! ¿En qué puedo ayudarte?"
}

function addPersonalityTouch(response: string, petType: string): string {
  const touches = {
    poseidrop: ["🐬", "⚓", "🌊"],
    ungabunga: ["🐵", "🔧", "💻"],
    beatbunny: ["🎵", "🎧", "🎤"]
  }

  const emojis = touches[petType as keyof typeof touches] || ["✨"]
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
  
  return `${randomEmoji} ${response}`
}