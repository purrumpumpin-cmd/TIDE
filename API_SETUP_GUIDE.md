# 🏴‍☠️ TIDElabs OS - Guía de Configuración de APIs

## 🚀 Configuración Rápida (5 minutos)

### 1. Copia el archivo de variables de entorno
```bash
cp .env.template .env
```

### 2. Configura las APIs más importantes

#### 🤖 **OpenRouter (IA para mascotas) - GRATIS**
1. Ve a https://openrouter.ai/
2. Regístrate con GitHub/Google
3. Ve a "Keys" y crea una nueva API key
4. En `.env` agrega:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui
```

#### 🌐 **Alchemy (Web3/NFTs) - GRATIS hasta 300M requests**
1. Ve a https://www.alchemy.com/
2. Crea una cuenta gratuita
3. Crea una nueva app (Ethereum Mainnet)
4. Copia la API Key
5. En `.env` agrega:
```env
VITE_ALCHEMY_API_KEY=tu-alchemy-key-aqui
```

#### 🔗 **WalletConnect - GRATIS**
1. Ve a https://cloud.walletconnect.com/
2. Crea un proyecto
3. Copia el Project ID
4. En `.env` agrega:
```env
VITE_WALLETCONNECT_PROJECT_ID=tu-project-id-aqui
```

### 3. Reinicia el servidor
```bash
npm run dev
```

## 📊 Estado de APIs por Funcionalidad

### ✅ **Funcionan SIN configuración**
- **CoinGecko** (precios crypto) - Tier gratuito sin API key
- **Supabase** (ya configurado)
- **Todas las aplicaciones básicas**

### 🔧 **Requieren configuración para funcionalidad completa**
- **AI.PETS** → OpenRouter (mascotas responden realmente)
- **EXPLORER.EXE** → Alchemy (NFTs reales del usuario)
- **Wallet Connect** → WalletConnect Project ID
- **TUNOVA.IO** → Spotify (música real)

## 🎯 Prioridad de Configuración

### **Nivel 1: Crítico (Impacto Visual Alto)**
1. **OpenRouter** - Las mascotas IA funcionarán realmente
2. **WalletConnect** - Conexión de wallet funcional
3. **Alchemy** - NFTs reales en EXPLORER.EXE

### **Nivel 2: Importante (Funcionalidad Completa)**
4. **Spotify** - Música real en TUNOVA.IO
5. **Coinbase Commerce** - Pagos crypto reales

### **Nivel 3: Opcional (Mejoras)**
6. **Unsplash** - Imágenes dinámicas
7. **OpenWeather** - Efectos ambientales
8. **EmailJS** - Notificaciones

## 💰 Costos Estimados

### **Mes 1-3: GRATIS**
- OpenRouter: Modelo gratuito (Llama 3.2)
- Alchemy: 300M requests gratis
- WalletConnect: Gratis
- CoinGecko: Gratis
- **Total: $0**

### **Mes 4+: Escalado**
- OpenRouter: ~$2-5/mes (uso moderado)
- Alchemy: Sigue gratis (muy generoso)
- Spotify: Gratis (con límites)
- **Total: $2-5/mes**

### **Producción Completa**
- OpenRouter Premium: ~$10-20/mes
- Alchemy Pro: $49/mes (solo si necesitas más)
- Coinbase Commerce: Gratis + fees
- **Total: $10-70/mes**

## 🔧 Configuración Avanzada

### **Spotify (Música Real)**
```env
VITE_SPOTIFY_CLIENT_ID=tu-client-id
VITE_SPOTIFY_CLIENT_SECRET=tu-client-secret
```

### **Coinbase Commerce (Pagos Crypto)**
```env
VITE_COINBASE_COMMERCE_API_KEY=tu-api-key
```

### **Unsplash (Imágenes)**
```env
VITE_UNSPLASH_ACCESS_KEY=tu-access-key
```

## 🚨 Troubleshooting

### **Error: "OpenRouter API key no configurada"**
- Verifica que la variable `VITE_OPENROUTER_API_KEY` esté en `.env`
- Reinicia el servidor de desarrollo

### **Error: "Alchemy API error: 401"**
- Verifica que la API key de Alchemy sea correcta
- Asegúrate de que la app esté configurada para Mainnet

### **Error: "WalletConnect connection failed"**
- Verifica el Project ID de WalletConnect
- Asegúrate de que el dominio esté configurado en el proyecto

## 🎮 Testing de APIs

### **Probar OpenRouter (AI.PETS)**
1. Abre AI.PETS en el desktop
2. Habla con cualquier mascota
3. Debería responder con IA real (no placeholder)

### **Probar Alchemy (EXPLORER.EXE)**
1. Conecta tu wallet
2. Abre EXPLORER.EXE
3. Deberías ver tus NFTs reales

### **Probar CoinGecko (CROWDFUND.WEB3)**
1. Abre CROWDFUND.WEB3
2. Los precios de crypto deberían ser reales y actualizados

## 📝 Notas Importantes

1. **Variables VITE_**: Solo estas son accesibles en el frontend
2. **Nunca commitees** el archivo `.env` al repositorio
3. **Para producción**: Configura estas variables en tu hosting (Vercel, Netlify, etc.)
4. **Rate Limits**: Las APIs gratuitas tienen límites, pero son generosos
5. **Fallbacks**: El sistema funciona sin APIs, solo con funcionalidad reducida

## 🏴‍☠️ ¡Listo para Navegar!

Con estas configuraciones, TIDElabs OS tendrá **100% de funcionalidad** y las mascotas IA, NFTs reales, y todas las características premium funcionarán perfectamente.

**¡Bienvenido a bordo de The Aetherius, NAKAMA! ⚓**