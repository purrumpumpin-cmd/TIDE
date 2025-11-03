/**
 * TIDElabs Backend - El Corazón del The Aetherius
 * Backend unificado para autenticación SIWE, crowdfunding, productos y chat
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// ═══════════════════════════════════════════════════════════
// HEALTH & INFO
// ═══════════════════════════════════════════════════════════

app.get("/make-server-7bf7363c/health", (c) => {
  return c.json({ status: "ok", service: "TIDElabs Backend" });
});

// ═══════════════════════════════════════════════════════════
// AUTHENTICATION - SIWE (Sign-In With Ethereum)
// ═══════════════════════════════════════════════════════════

/**
 * POST /auth/siwe/verify
 * Verifica la firma SIWE y crea/retorna un usuario
 */
app.post("/make-server-7bf7363c/auth/siwe/verify", async (c) => {
  try {
    const { address, signature, message } = await c.req.json();

    if (!address || !signature || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    console.log("SIWE verification request:", { address, message });

    // En producción, aquí verificarías la firma con ethers.js
    // Por ahora, simulamos la verificación exitosa

    // Buscar o crear usuario
    const existingUser = await kv.get(`user:${address}`);
    
    let userData;
    if (!existingUser) {
      // Crear nuevo usuario
      userData = {
        address,
        nakama_tier: "none",
        contribution_amount: 0,
        created_at: new Date().toISOString(),
        nfts: [],
      };
      await kv.set(`user:${address}`, userData);
      console.log("New user created:", address);
    } else {
      userData = existingUser;
      console.log("Existing user authenticated:", address);
    }

    // Crear session token (en producción, usar JWT)
    const sessionToken = `session_${address}_${Date.now()}`;
    await kv.set(`session:${sessionToken}`, {
      address,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return c.json({
      success: true,
      user: userData,
      sessionToken,
    });
  } catch (error) {
    console.error("Error in SIWE verification:", error);
    return c.json({ error: "Authentication failed", details: String(error) }, 500);
  }
});

/**
 * GET /auth/session
 * Valida un session token y retorna datos del usuario
 */
app.get("/make-server-7bf7363c/auth/session", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "No session token provided" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid or expired session" }, 401);
    }

    const user = await kv.get(`user:${session.address}`);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      success: true,
      user,
      session,
    });
  } catch (error) {
    console.error("Error validating session:", error);
    return c.json({ error: "Session validation failed" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// NAKAMA - Crowdfunding & Tiers
// ═══════════════════════════════════════════════════════════

/**
 * POST /nakama/contribute
 * Registra una contribución y actualiza el tier del usuario
 */
app.post("/make-server-7bf7363c/nakama/contribute", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const { amount, txHash } = await c.req.json();

    if (!amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }

    // Obtener usuario
    const user = await kv.get(`user:${session.address}`);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Actualizar contribución
    const newTotalContribution = user.contribution_amount + amount;
    
    // Determinar tier
    let newTier = "none";
    if (newTotalContribution >= 0.1) {
      newTier = "Capitán";
    } else if (newTotalContribution >= 0.05) {
      newTier = "Marinero";
    } else if (newTotalContribution >= 0.01) {
      newTier = "Grumete";
    }

    // Actualizar usuario
    user.contribution_amount = newTotalContribution;
    user.nakama_tier = newTier;
    user.last_contribution = {
      amount,
      txHash,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`user:${session.address}`, user);

    // Registrar la contribución en el total
    const totalContributions = await kv.get("total_contributions") || 0;
    await kv.set("total_contributions", totalContributions + amount);

    console.log(`User ${session.address} contributed ${amount} ETH. New tier: ${newTier}`);

    return c.json({
      success: true,
      user,
      newTier,
      totalContribution: newTotalContribution,
    });
  } catch (error) {
    console.error("Error processing contribution:", error);
    return c.json({ error: "Contribution failed", details: String(error) }, 500);
  }
});

/**
 * GET /nakama/status
 * Obtiene el estado del crowdfunding
 */
app.get("/make-server-7bf7363c/nakama/status", async (c) => {
  try {
    const totalContributions = await kv.get("total_contributions") || 0;
    const goal = 100; // 100 ETH goal

    // Contar usuarios por tier
    const allUsers = await kv.getByPrefix("user:");
    const tierCounts = {
      Capitán: 0,
      Marinero: 0,
      Grumete: 0,
      none: 0,
    };

    allUsers.forEach((user: any) => {
      tierCounts[user.nakama_tier] = (tierCounts[user.nakama_tier] || 0) + 1;
    });

    return c.json({
      success: true,
      totalContributions,
      goal,
      percentage: (totalContributions / goal) * 100,
      tierCounts,
      totalBackers: allUsers.length,
    });
  } catch (error) {
    console.error("Error fetching nakama status:", error);
    return c.json({ error: "Failed to fetch status" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// PRODUCTS - Sistema de productos RAZA/AZAR
// ═══════════════════════════════════════════════════════════

/**
 * GET /products
 * Lista todos los productos (con filtro opcional por line)
 */
app.get("/make-server-7bf7363c/products", async (c) => {
  try {
    const line = c.req.query("line"); // "RAZA" or "AZAR"
    
    let products = await kv.getByPrefix("product:");
    
    if (line) {
      products = products.filter((p: any) => p.line === line);
    }

    return c.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

/**
 * GET /products/:id
 * Obtiene un producto específico
 */
app.get("/make-server-7bf7363c/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

/**
 * POST /products/seed
 * Seed inicial de productos para demo
 */
app.post("/make-server-7bf7363c/products/seed", async (c) => {
  try {
    const razaProducts = [
      {
        id: "raza-001",
        line: "RAZA",
        name: "Camiseta Brutalista Negra",
        price: 45,
        description: "Algodón orgánico. Tipografía monoespacio. Diseño minimal.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        stock: 50,
        sku: "RZ-BLK-001",
      },
      {
        id: "raza-002",
        line: "RAZA",
        name: "Poster 'System Error'",
        price: 30,
        description: "Impresión offset. 50x70cm. Papel mate premium.",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        stock: 100,
        sku: "RZ-PST-002",
      },
      {
        id: "raza-003",
        line: "RAZA",
        name: "Taza Terminal",
        price: 20,
        description: "Cerámica. Diseño de terminal monocromo.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
        stock: 75,
        sku: "RZ-MUG-003",
      },
    ];

    const azarProducts = [
      {
        id: "azar-001",
        line: "AZAR",
        name: "Camiseta Glitch Edition",
        price: 55,
        description: "Diseño generativo único. Cada pieza es diferente.",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
        stock: 25,
        sku: "AZ-GLT-001",
      },
      {
        id: "azar-002",
        line: "AZAR",
        name: "Sticker Pack Random",
        price: 15,
        description: "Pack sorpresa de 10 stickers. Colección aleatoria.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        stock: 200,
        sku: "AZ-STK-002",
      },
      {
        id: "azar-003",
        line: "AZAR",
        name: "NFT Mystery Box",
        price: 0.05,
        description: "Caja misteriosa con NFT aleatorio del ecosistema.",
        image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800",
        stock: 50,
        sku: "AZ-NFT-003",
        isNFT: true,
      },
    ];

    for (const product of [...razaProducts, ...azarProducts]) {
      await kv.set(`product:${product.id}`, product);
    }

    return c.json({
      success: true,
      message: "Products seeded successfully",
      count: razaProducts.length + azarProducts.length,
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return c.json({ error: "Failed to seed products" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// CART & ORDERS
// ═══════════════════════════════════════════════════════════

/**
 * POST /cart/add
 * Añade un producto al carrito del usuario
 */
app.post("/make-server-7bf7363c/cart/add", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const { productId, quantity = 1 } = await c.req.json();

    // Obtener carrito actual
    let cart = await kv.get(`cart:${session.address}`) || { items: [] };

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.updated_at = new Date().toISOString();
    await kv.set(`cart:${session.address}`, cart);

    return c.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return c.json({ error: "Failed to add to cart" }, 500);
  }
});

/**
 * GET /cart
 * Obtiene el carrito del usuario
 */
app.get("/make-server-7bf7363c/cart", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const cart = await kv.get(`cart:${session.address}`) || { items: [] };

    // Enriquecer con datos de productos
    const enrichedItems = await Promise.all(
      cart.items.map(async (item: any) => {
        const product = await kv.get(`product:${item.productId}`);
        return {
          ...item,
          product,
        };
      })
    );

    return c.json({
      success: true,
      cart: {
        ...cart,
        items: enrichedItems,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return c.json({ error: "Failed to fetch cart" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// CHAT MESSAGES (for MSN.CHAT)
// ═══════════════════════════════════════════════════════════

/**
 * POST /chat/send
 * Envía un mensaje al chat
 */
app.post("/make-server-7bf7363c/chat/send", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const user = await kv.get(`user:${session.address}`);
    if (!user || user.nakama_tier === "none") {
      return c.json({ error: "Access denied. Nakama tier required." }, 403);
    }

    const { text } = await c.req.json();

    if (!text || !text.trim()) {
      return c.json({ error: "Message cannot be empty" }, 400);
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      id: messageId,
      user: session.address,
      tier: user.nakama_tier,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    await kv.set(`message:${messageId}`, message);

    return c.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

/**
 * GET /chat/messages
 * Obtiene mensajes recientes del chat
 */
app.get("/make-server-7bf7363c/chat/messages", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const user = await kv.get(`user:${session.address}`);
    if (!user || user.nakama_tier === "none") {
      return c.json({ error: "Access denied. Nakama tier required." }, 403);
    }

    const messages = await kv.getByPrefix("message:");
    
    // Ordenar por timestamp (más recientes primero)
    messages.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limitar a los últimos 50 mensajes
    const recentMessages = messages.slice(0, 50).reverse();

    return c.json({
      success: true,
      messages: recentMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// NFT ASSETS (for EXPLORER.EXE)
// ═══════════════════════════════════════════════════════════

/**
 * GET /nfts
 * Obtiene los NFTs del usuario
 */
app.get("/make-server-7bf7363c/nfts", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const user = await kv.get(`user:${session.address}`);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      success: true,
      nfts: user.nfts || [],
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return c.json({ error: "Failed to fetch NFTs" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// TUNOVA - Sistema de Puntos para Airdrop
// ═══════════════════════════════════════════════════════════

/**
 * POST /tunova/points/add
 * Agrega puntos de escucha al usuario (Radio Pirata)
 */
app.post("/make-server-7bf7363c/tunova/points/add", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const { points, listeningTime, cassetteId } = await c.req.json();

    if (!points || points <= 0) {
      return c.json({ error: "Invalid points" }, 400);
    }

    // Obtener puntos actuales del usuario
    const userPointsKey = `tunova_points:${session.address}`;
    const currentPoints = await kv.get(userPointsKey) || {
      total: 0,
      listeningTime: 0,
      lastUpdated: new Date().toISOString(),
      history: [],
    };

    // Actualizar puntos
    currentPoints.total += points;
    currentPoints.listeningTime += listeningTime || 0;
    currentPoints.lastUpdated = new Date().toISOString();
    currentPoints.history.push({
      points,
      listeningTime,
      cassetteId,
      timestamp: new Date().toISOString(),
    });

    // Mantener solo los últimos 100 registros
    if (currentPoints.history.length > 100) {
      currentPoints.history = currentPoints.history.slice(-100);
    }

    await kv.set(userPointsKey, currentPoints);

    // Actualizar ranking global
    const globalPoints = await kv.get("tunova_global_points") || 0;
    await kv.set("tunova_global_points", globalPoints + points);

    console.log(`User ${session.address} earned ${points} TUNOVA points`);

    return c.json({
      success: true,
      points: currentPoints,
    });
  } catch (error) {
    console.error("Error adding TUNOVA points:", error);
    return c.json({ error: "Failed to add points", details: String(error) }, 500);
  }
});

/**
 * GET /tunova/points
 * Obtiene los puntos del usuario
 */
app.get("/make-server-7bf7363c/tunova/points", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const sessionToken = authHeader?.split(" ")[1];

    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await kv.get(`session:${sessionToken}`);
    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const userPointsKey = `tunova_points:${session.address}`;
    const points = await kv.get(userPointsKey) || {
      total: 0,
      listeningTime: 0,
      lastUpdated: null,
      history: [],
    };

    return c.json({
      success: true,
      points,
    });
  } catch (error) {
    console.error("Error fetching TUNOVA points:", error);
    return c.json({ error: "Failed to fetch points" }, 500);
  }
});

/**
 * GET /tunova/leaderboard
 * Obtiene el ranking de usuarios por puntos
 */
app.get("/make-server-7bf7363c/tunova/leaderboard", async (c) => {
  try {
    const allPoints = await kv.getByPrefix("tunova_points:");
    
    // Ordenar por puntos totales
    const leaderboard = allPoints
      .map((pointsData: any, index: number) => {
        // Extraer address del key
        const address = Object.keys(pointsData)[0]?.replace("tunova_points:", "") || `user_${index}`;
        return {
          address,
          total: pointsData.total || 0,
          listeningTime: pointsData.listeningTime || 0,
        };
      })
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 100); // Top 100

    const globalPoints = await kv.get("tunova_global_points") || 0;

    return c.json({
      success: true,
      leaderboard,
      globalPoints,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

console.log("TIDElabs Backend initialized. El The Aetherius está en línea.");

Deno.serve(app.fetch);
