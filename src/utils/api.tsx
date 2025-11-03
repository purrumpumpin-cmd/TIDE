/**
 * TIDElabs - API Client
 * Utilidad para comunicarse con el backend
 */

import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1`;

interface ApiOptions {
  method?: string;
  body?: unknown;
  sessionToken?: string | null;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, sessionToken } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken || publicAnonKey}`,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed [${method} ${endpoint}]:`, error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════

export const authApi = {
  async verifySIWE(walletAddress: string, signature: string, message: string) {
    return apiCall('/auth-siwe', {
      method: 'POST',
      body: { walletAddress, signature, message },
    });
  },

  async getSession(sessionToken: string) {
    return apiCall('/auth/session', {
      sessionToken,
    });
  },
};

// ═══════════════════════════════════════════════════════════
// POINTS API
// ═══════════════════════════════════════════════════════════

export const pointsApi = {
  async getPoints(walletAddress: string) {
    return apiCall('/points-manager', {
      method: 'POST',
      body: { action: 'get', walletAddress },
    });
  },

  async addPoints(walletAddress: string, points: number, activity?: string) {
    return apiCall('/points-manager', {
      method: 'POST',
      body: { action: 'add', walletAddress, points, activity },
    });
  },

  async processReferral(walletAddress: string, referralCode: string) {
    return apiCall('/points-manager', {
      method: 'POST',
      body: { action: 'referral', walletAddress, referralCode },
    });
  },
};

// ═══════════════════════════════════════════════════════════
// NAKAMA API
// ═══════════════════════════════════════════════════════════

export const nakamaApi = {
  async contribute(amount: number, txHash: string, sessionToken: string) {
    return apiCall('/nakama/contribute', {
      method: 'POST',
      body: { amount, txHash },
      sessionToken,
    });
  },

  async getStatus() {
    return apiCall('/nakama/status');
  },
};

// ═══════════════════════════════════════════════════════════
// PRODUCTS API
// ═══════════════════════════════════════════════════════════

export const productsApi = {
  async list(line?: 'RAZA' | 'AZAR') {
    const query = line ? `?line=${line}` : '';
    return apiCall(`/products${query}`);
  },

  async getById(id: string) {
    return apiCall(`/products/${id}`);
  },

  async seed() {
    return apiCall('/products/seed', {
      method: 'POST',
    });
  },
};

// ═══════════════════════════════════════════════════════════
// CART API
// ═══════════════════════════════════════════════════════════

export const cartApi = {
  async add(productId: string, quantity: number, sessionToken: string) {
    return apiCall('/cart/add', {
      method: 'POST',
      body: { productId, quantity },
      sessionToken,
    });
  },

  async get(sessionToken: string) {
    return apiCall('/cart', {
      sessionToken,
    });
  },
};

// ═══════════════════════════════════════════════════════════
// CHAT API
// ═══════════════════════════════════════════════════════════

export const chatApi = {
  async sendMessage(text: string, sessionToken: string) {
    return apiCall('/chat/send', {
      method: 'POST',
      body: { text },
      sessionToken,
    });
  },

  async getMessages(sessionToken: string) {
    return apiCall('/chat/messages', {
      sessionToken,
    });
  },
};

// ═══════════════════════════════════════════════════════════
// NFT API
// ═══════════════════════════════════════════════════════════

export const nftApi = {
  async list(sessionToken: string) {
    return apiCall('/nfts', {
      sessionToken,
    });
  },
};

// ═══════════════════════════════════════════════════════════
// TUNOVA API
// ═══════════════════════════════════════════════════════════

export const tunovaApi = {
  async addPoints(points: number, listeningTime: number, cassetteId: string, sessionToken: string) {
    return apiCall('/tunova/points/add', {
      method: 'POST',
      body: { points, listeningTime, cassetteId },
      sessionToken,
    });
  },

  async getPoints(sessionToken: string) {
    return apiCall('/tunova/points', {
      sessionToken,
    });
  },

  async getLeaderboard() {
    return apiCall('/tunova/leaderboard');
  },
};
