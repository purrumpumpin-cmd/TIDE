/**
 * 🏴‍☠️ TIDElabs OS - Servicio de APIs
 * Implementaciones listas para usar con las APIs finales
 */

import { 
  OPENROUTER_CONFIG, 
  ALCHEMY_CONFIG, 
  COINGECKO_CONFIG, 
  SPOTIFY_CONFIG,
  APIResponse,
  NFTMetadata,
  CryptoPrice,
  SpotifyTrack
} from '../config/apis'

// ═══════════════════════════════════════════════════════════
// 🤖 SERVICIO DE IA (OpenRouter)
// ═══════════════════════════════════════════════════════════
export class OpenRouterService {
  private static instance: OpenRouterService
  
  static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService()
    }
    return OpenRouterService.instance
  }

  async chatCompletion(
    messages: Array<{role: string, content: string}>,
    model: keyof typeof OPENROUTER_CONFIG.models = 'free'
  ): Promise<APIResponse<string>> {
    try {
      if (!OPENROUTER_CONFIG.apiKey) {
        return {
          success: false,
          error: 'OpenRouter API key no configurada',
          timestamp: Date.now()
        }
      }

      const response = await fetch(`${OPENROUTER_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'TIDElabs OS'
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.models[model],
          messages,
          max_tokens: OPENROUTER_CONFIG.maxTokens,
          temperature: OPENROUTER_CONFIG.temperature
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data: data.choices[0]?.message?.content || 'Sin respuesta',
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: Date.now()
      }
    }
  }

  // Método específico para las mascotas IA
  async askPet(petName: string, userMessage: string, petPersonality: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: `Eres ${petName}, una mascota IA del sistema operativo pirata TIDElabs OS. ${petPersonality}. Responde de manera breve, divertida y útil. Usa emojis piratas ocasionalmente. Máximo 150 palabras.`
      },
      {
        role: 'user',
        content: userMessage
      }
    ]

    const response = await this.chatCompletion(messages, 'free')
    return response.success ? response.data || 'Arrr... no pude procesar tu mensaje, NAKAMA 🏴‍☠️' : 'Error de conexión con la IA'
  }
}

// ═══════════════════════════════════════════════════════════
// 🌐 SERVICIO WEB3 (Alchemy)
// ═══════════════════════════════════════════════════════════
export class AlchemyService {
  private static instance: AlchemyService
  
  static getInstance(): AlchemyService {
    if (!AlchemyService.instance) {
      AlchemyService.instance = new AlchemyService()
    }
    return AlchemyService.instance
  }

  async getUserNFTs(walletAddress: string, network: keyof typeof ALCHEMY_CONFIG.networks = 'ethereum'): Promise<APIResponse<NFTMetadata[]>> {
    try {
      const baseUrl = ALCHEMY_CONFIG.networks[network]
      const response = await fetch(`${baseUrl}/getNFTs?owner=${walletAddress}&withMetadata=true`)
      
      if (!response.ok) {
        throw new Error(`Alchemy API error: ${response.status}`)
      }

      const data = await response.json()
      
      const nfts: NFTMetadata[] = data.ownedNfts?.map((nft: any) => ({
        name: nft.metadata?.name || 'NFT Sin Nombre',
        description: nft.metadata?.description || 'Sin descripción',
        image: nft.metadata?.image || '/placeholder-nft.png',
        attributes: nft.metadata?.attributes || [],
        external_url: nft.metadata?.external_url
      })) || []

      return {
        success: true,
        data: nfts,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: Date.now()
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 💰 SERVICIO DE CRIPTOMONEDAS (CoinGecko)
// ═══════════════════════════════════════════════════════════
export class CoinGeckoService {
  private static instance: CoinGeckoService
  private cache: Map<string, { data: any, timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 60000 // 1 minuto

  static getInstance(): CoinGeckoService {
    if (!CoinGeckoService.instance) {
      CoinGeckoService.instance = new CoinGeckoService()
    }
    return CoinGeckoService.instance
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key)
    return cached ? (Date.now() - cached.timestamp) < this.CACHE_DURATION : false
  }

  async getCryptoPrices(coins: string[] = COINGECKO_CONFIG.supportedCoins.slice(0, 5)): Promise<APIResponse<CryptoPrice[]>> {
    const cacheKey = `prices_${coins.join(',')}`
    
    if (this.isValidCache(cacheKey)) {
      return {
        success: true,
        data: this.cache.get(cacheKey)!.data,
        timestamp: Date.now()
      }
    }

    try {
      const coinsParam = coins.join(',')
      const response = await fetch(
        `${COINGECKO_CONFIG.baseURL}${COINGECKO_CONFIG.endpoints.prices}?ids=${coinsParam}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      )
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data = await response.json()
      
      const prices: CryptoPrice[] = Object.entries(data).map(([id, info]: [string, any]) => ({
        id,
        symbol: id,
        current_price: info.usd || 0,
        price_change_24h: info.usd_24h_change || 0,
        price_change_percentage_24h: info.usd_24h_change || 0,
        market_cap: info.usd_market_cap || 0,
        volume_24h: info.usd_24h_vol || 0
      }))

      // Guardar en cache
      this.cache.set(cacheKey, { data: prices, timestamp: Date.now() })

      return {
        success: true,
        data: prices,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: Date.now()
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 🚀 INSTANCIAS GLOBALES (Singleton)
// ═══════════════════════════════════════════════════════════
export const openRouterService = OpenRouterService.getInstance()
export const alchemyService = AlchemyService.getInstance()
export const coinGeckoService = CoinGeckoService.getInstance()

// ═══════════════════════════════════════════════════════════
// 🔧 UTILIDADES
// ═══════════════════════════════════════════════════════════
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price)
}

export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(2)}%`
}

export const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}