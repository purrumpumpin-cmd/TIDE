/**
 * 🏴‍☠️ TIDElabs OS - Configuración de APIs Finales
 * Configuración centralizada para todas las APIs externas
 */

// ═══════════════════════════════════════════════════════════
// 🤖 IA CONVERSACIONAL (OpenRouter)
// ═══════════════════════════════════════════════════════════
export const OPENROUTER_CONFIG = {
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  models: {
    free: 'meta-llama/llama-3.2-3b-instruct:free', // GRATIS
    cheap: 'microsoft/wizardlm-2-8x22b', // $0.63/1M tokens
    premium: 'anthropic/claude-3.5-sonnet', // $3/1M tokens
    coding: 'deepseek/deepseek-coder', // $0.14/1M tokens
  },
  maxTokens: 1000,
  temperature: 0.7,
}

// ═══════════════════════════════════════════════════════════
// 🌐 WEB3 & BLOCKCHAIN (Alchemy)
// ═══════════════════════════════════════════════════════════
export const ALCHEMY_CONFIG = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || 'demo',
  networks: {
    ethereum: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
    polygon: `https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
    arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
    optimism: `https://opt-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
  },
  endpoints: {
    getNFTs: '/getNFTs',
    getNFTMetadata: '/getNFTMetadata',
    getOwnersForToken: '/getOwnersForToken',
    getContractMetadata: '/getContractMetadata',
  }
}

// ═══════════════════════════════════════════════════════════
// 🔗 WALLETCONNECT
// ═══════════════════════════════════════════════════════════
export const WALLETCONNECT_CONFIG = {
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  metadata: {
    name: 'TIDElabs OS',
    description: 'Sistema Operativo Pirata Web3 - The Aetherius Digital',
    url: 'https://tidelabs.io',
    icons: ['https://tidelabs.io/icon-192.png']
  },
  chains: [1, 137, 42161, 10], // Ethereum, Polygon, Arbitrum, Optimism
  methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData_v4'],
  events: ['chainChanged', 'accountsChanged']
}

// ═══════════════════════════════════════════════════════════
// 💰 CRIPTOMONEDAS (CoinGecko)
// ═══════════════════════════════════════════════════════════
export const COINGECKO_CONFIG = {
  baseURL: 'https://api.coingecko.com/api/v3',
  endpoints: {
    prices: '/simple/price',
    trending: '/search/trending',
    markets: '/coins/markets',
    tokenInfo: '/coins',
  },
  supportedCoins: [
    'ethereum', 'bitcoin', 'polygon', 'arbitrum', 'optimism',
    'chainlink', 'uniswap', 'aave', 'compound', 'maker'
  ],
  currencies: ['usd', 'eur', 'btc', 'eth'],
  rateLimits: {
    free: 10, // requests per minute
    demo: 50,
  }
}

// ═══════════════════════════════════════════════════════════
// 🎵 SPOTIFY (Música)
// ═══════════════════════════════════════════════════════════
export const SPOTIFY_CONFIG = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '',
  redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/callback/spotify`,
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ],
  baseURL: 'https://api.spotify.com/v1',
  authURL: 'https://accounts.spotify.com/api/token',
  endpoints: {
    search: '/search',
    tracks: '/tracks',
    albums: '/albums',
    playlists: '/playlists',
    me: '/me',
  }
}

// ═══════════════════════════════════════════════════════════
// 🏷️ TIPOS DE TYPESCRIPT
// ═══════════════════════════════════════════════════════════
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
}

export interface CryptoPrice {
  id: string
  symbol: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

// ═══════════════════════════════════════════════════════════
// 🚀 FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════════════════════════
export const isAPIConfigured = (apiName: string): boolean => {
  const configs = {
    openrouter: !!OPENROUTER_CONFIG.apiKey,
    alchemy: !!ALCHEMY_CONFIG.apiKey && ALCHEMY_CONFIG.apiKey !== 'demo',
    walletconnect: !!WALLETCONNECT_CONFIG.projectId,
    spotify: !!SPOTIFY_CONFIG.clientId,
  }
  
  return configs[apiName as keyof typeof configs] || false
}

export const getAPIStatus = () => {
  return {
    openrouter: isAPIConfigured('openrouter'),
    alchemy: isAPIConfigured('alchemy'),
    walletconnect: isAPIConfigured('walletconnect'),
    spotify: isAPIConfigured('spotify'),
    coingecko: true, // No requiere API key
  }
}