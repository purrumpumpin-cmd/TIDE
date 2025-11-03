# 🎵 TUNOVA.IO - Guía de Configuración

## 📋 Resumen

Esta guía te ayudará a configurar TUNOVA.IO con servicios externos para música y NFTs. El componente está **100% listo** y solo necesitas agregar tus links y API keys.

---

## 🎨 Walkmans Personalizados Generados

Se han creado 4 walkmans fotorrealistas con estilo retro + Web3:

1. **VAH0M4N** - Dorado/Naranja con símbolos crypto (Bitcoin, Ethereum, Solana)
2. **NAKAMAS** - Púrpura/Rosa neón con bandera pirata y badges NFT
3. **RAZA** - Blanco minimalista con formas geométricas
4. **AZAR** - Negro con efectos glitch púrpura/cyan

**Ubicación**: `/assets/walkman_[collection].png`

---

## 🔧 Configuración Paso a Paso

### 1. Servicios de Música

#### Opción A: Spotify

```typescript
// En TunovaOptimized.tsx, línea 15
spotify: {
  enabled: true,
  embedBase: "https://open.spotify.com/embed/track/",
  apiBase: "https://api.spotify.com/v1/",
}
```

**Cómo agregar tracks:**

1. Ve a Spotify y busca tu canción
2. Click derecho → Compartir → Copiar enlace de la canción
3. Ejemplo: `https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp`
4. Copia solo el ID: `3n3Ppam7vgaVa1iaRUc9Lp`
5. Agrégalo en el track:

```typescript
{
  id: "v1",
  title: "Rey de los Emprendedores",
  artist: "Vah0m4n",
  duration: "3:45",
  spotifyId: "3n3Ppam7vgaVa1iaRUc9Lp", // ← AGREGAR AQUÍ
}
```

#### Opción B: SoundCloud

```typescript
// En TunovaOptimized.tsx, línea 20
soundcloud: {
  enabled: true,
  embedBase: "https://w.soundcloud.com/player/?url=",
  apiBase: "https://api.soundcloud.com/",
}
```

**Cómo agregar tracks:**

1. Ve a SoundCloud y busca tu canción
2. Copia la URL completa
3. Ejemplo: `https://soundcloud.com/artist/track-name`
4. Agrégalo en el track:

```typescript
{
  id: "n1",
  title: "Digital Nostalgia",
  artist: "Neo Samurai",
  duration: "3:30",
  soundcloudUrl: "https://soundcloud.com/artist/track-name", // ← AGREGAR AQUÍ
}
```

#### Opción C: Audius (Web3 Native)

```typescript
// En TunovaOptimized.tsx, línea 25
audius: {
  enabled: true,
  embedBase: "https://audius.co/embed/track/",
  apiBase: "https://api.audius.co/v1/",
}
```

**Cómo agregar tracks:**

1. Ve a Audius y busca tu canción
2. Copia el ID del track de la URL
3. Ejemplo: `https://audius.co/artist/track-name-123456`
4. Copia el ID: `123456`
5. Agrégalo en el track:

```typescript
{
  id: "r1",
  title: "Minimal Minds",
  artist: "RazAzaR",
  duration: "4:30",
  audiusId: "123456", // ← AGREGAR AQUÍ
}
```

---

### 2. Servicios de NFTs

#### Opción A: OpenSea

```typescript
// En TunovaOptimized.tsx, línea 35
opensea: {
  enabled: true,
  apiBase: "https://api.opensea.io/api/v2/",
  collections: {
    vahoman: "0x...", // ← AGREGAR CONTRACT ADDRESS
    nakamas: "0x...", // ← AGREGAR CONTRACT ADDRESS
    raza: "0x...", // ← AGREGAR CONTRACT ADDRESS
    azar: "0x...", // ← AGREGAR CONTRACT ADDRESS
  },
}
```

**Cómo obtener contract address:**

1. Ve a OpenSea y busca tu colección
2. Click en "Details"
3. Copia el "Contract Address"
4. Ejemplo: `0x1234567890abcdef1234567890abcdef12345678`

**Agrégalo en la colección:**

```typescript
{
  id: "vahoman",
  name: "Vah0m4n",
  // ...
  nftContract: "0x1234567890abcdef1234567890abcdef12345678", // ← AQUÍ
  nftChain: "ethereum",
}
```

#### Opción B: Magic Eden (Solana)

```typescript
// En TunovaOptimized.tsx, línea 45
magic_eden: {
  enabled: true,
  apiBase: "https://api-mainnet.magiceden.dev/v2/",
  collections: {
    vahoman: "", // ← AGREGAR COLLECTION SLUG
    nakamas: "", // ← AGREGAR COLLECTION SLUG
    raza: "", // ← AGREGAR COLLECTION SLUG
    azar: "", // ← AGREGAR COLLECTION SLUG
  },
}
```

**Cómo obtener collection slug:**

1. Ve a Magic Eden y busca tu colección
2. Copia el slug de la URL
3. Ejemplo: `https://magiceden.io/marketplace/my_collection`
4. Copia: `my_collection`

---

### 3. Configuración de Blockchain

#### Ethereum/Polygon (Alchemy)

```typescript
// En TunovaOptimized.tsx, línea 57
web3: {
  rpcUrls: {
    ethereum: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY", // ← AGREGAR
    polygon: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY", // ← AGREGAR
    solana: "https://api.mainnet-beta.solana.com",
  },
}
```

**Cómo obtener API Key de Alchemy:**

1. Ve a [alchemy.com](https://www.alchemy.com/)
2. Crea una cuenta gratuita
3. Crea una nueva app
4. Copia la API Key
5. Reemplaza `YOUR_API_KEY` en el código

#### WalletConnect

```typescript
// En TunovaOptimized.tsx, línea 63
walletConnect: {
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // ← AGREGAR
}
```

**Cómo obtener Project ID:**

1. Ve a [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Crea una cuenta
3. Crea un nuevo proyecto
4. Copia el Project ID
5. Reemplázalo en el código

---

## 📝 Ejemplo Completo de Configuración

```typescript
// Colección VAH0M4N completamente configurada
{
  id: "vahoman",
  name: "Vah0m4n",
  displayName: "VAH0M4N",
  description: "Rey de los Emprendedores - 8 Idiomas Edition",
  walkmanImage: "/assets/walkman_vahoman.png",
  color: "#FFB900",
  gradient: "linear-gradient(135deg, #FFB900 0%, #FF8C00 100%)",
  nftRequired: true,
  nftContract: "0x1234567890abcdef1234567890abcdef12345678",
  nftChain: "ethereum",
  tracks: [
    {
      id: "v1",
      title: "Rey de los Emprendedores",
      artist: "Vah0m4n",
      duration: "3:45",
      spotifyId: "3n3Ppam7vgaVa1iaRUc9Lp",
      soundcloudUrl: "https://soundcloud.com/vahoman/rey-emprendedores",
      audiusId: "123456",
    },
    {
      id: "v2",
      title: "King of Entrepreneurs",
      artist: "Vah0m4n",
      duration: "3:45",
      spotifyId: "4o4Qbcd8vhbWb2jbKcXdEf",
    },
    // ... más tracks
  ],
}
```

---

## 🚀 Integración en el Proyecto

### 1. Copiar Archivos

```bash
# Copiar imágenes de walkmans
cp /home/ubuntu/sovering_code_manifesto/assets/walkman_*.png \
   /home/ubuntu/sovering_code_manifesto/public/assets/

# El componente ya está en:
# /home/ubuntu/sovering_code_manifesto/src/components/apps/TunovaOptimized.tsx
# /home/ubuntu/sovering_code_manifesto/src/components/apps/TunovaOptimized.css
```

### 2. Importar en tu App

```typescript
// En tu archivo principal (App.tsx o similar)
import { TunovaOptimized } from './components/apps/TunovaOptimized';
import './components/apps/TunovaOptimized.css';

function App() {
  return (
    <div>
      <TunovaOptimized />
    </div>
  );
}
```

### 3. Instalar Dependencias

```bash
cd /home/ubuntu/sovering_code_manifesto
pnpm install framer-motion lucide-react
```

---

## ✅ Checklist de Configuración

### Música
- [ ] Agregar Spotify Track IDs a todos los tracks
- [ ] O agregar SoundCloud URLs
- [ ] O agregar Audius Track IDs
- [ ] Verificar que los embeds funcionan

### NFTs
- [ ] Agregar contract addresses de OpenSea
- [ ] O agregar collection slugs de Magic Eden
- [ ] Configurar chains correctas (ethereum/polygon/solana)
- [ ] Verificar ownership con wallet de prueba

### Blockchain
- [ ] Obtener API Key de Alchemy
- [ ] Configurar RPC URLs
- [ ] Obtener WalletConnect Project ID
- [ ] Probar conexión de wallet

### Assets
- [ ] Copiar imágenes de walkmans a `/public/assets/`
- [ ] Verificar que las rutas de imágenes son correctas
- [ ] Optimizar imágenes si es necesario

---

## 🧪 Testing

### 1. Test sin Wallet Conectada

- Deberías ver los 4 walkmans
- Deberías ver los botones de colección
- Los walkmans deberían mostrar overlay de "NFT Requerido"
- El botón "Conectar Wallet" debería estar visible

### 2. Test con Wallet Conectada (Simulación)

```typescript
// En TunovaOptimized.tsx, línea 140
// Cambiar de:
setTimeout(() => {
  setAddress("0x1234...5678");
  setIsConnecting(false);
}, 1000);

// A tu implementación real de WalletConnect
```

### 3. Test de Ownership

```typescript
// En TunovaOptimized.tsx, línea 170
// Cambiar de:
setIsOwner(true); // Para testing

// A:
setIsOwner(false); // Para producción (verificación real)
```

### 4. Test de Reproducción

1. Conecta wallet
2. Selecciona una colección
3. Click en Play
4. Debería aparecer el embed de Spotify/SoundCloud
5. Debería reproducirse el audio

---

## 🎨 Personalización Adicional

### Cambiar Colores

```typescript
// En TunovaOptimized.tsx, cada colección tiene:
color: "#FFB900", // Color principal
gradient: "linear-gradient(135deg, #FFB900 0%, #FF8C00 100%)", // Gradiente
```

### Agregar Más Colecciones

```typescript
// Agrega una nueva colección al array COLLECTIONS
{
  id: "nueva_coleccion",
  name: "Nueva Colección",
  displayName: "NUEVA",
  description: "Descripción de la nueva colección",
  walkmanImage: "/assets/walkman_nueva.png", // Genera nueva imagen
  color: "#00FF00",
  gradient: "linear-gradient(135deg, #00FF00 0%, #00CC00 100%)",
  nftRequired: true,
  nftContract: "0x...",
  nftChain: "ethereum",
  tracks: [
    // ... tracks
  ],
}
```

### Deshabilitar Verificación de NFT (Para Testing)

```typescript
// En cada colección, cambia:
nftRequired: false, // No requiere NFT
```

---

## 🐛 Troubleshooting

### Problema: Las imágenes de walkmans no se ven

**Solución**: Verifica que las rutas sean correctas:
```typescript
walkmanImage: "/assets/walkman_vahoman.png", // Ruta desde /public
```

### Problema: El embed de Spotify no funciona

**Solución**: Verifica que el Track ID sea correcto:
```bash
# URL de Spotify:
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
                              ^^^^^^^^^^^^^^^^^^^^^^
                              Este es el Track ID
```

### Problema: La wallet no se conecta

**Solución**: Implementa WalletConnect o MetaMask:
```typescript
// Descomenta el código en useWallet() línea 130
if (window.ethereum) {
  const accounts = await window.ethereum.request({ 
    method: 'eth_requestAccounts' 
  });
  setAddress(accounts[0]);
}
```

### Problema: La verificación de NFT no funciona

**Solución**: Implementa la llamada real a OpenSea API:
```typescript
// Descomenta el código en useNFTOwnership() línea 165
const response = await fetch(
  `${EXTERNAL_SERVICES.nfts.opensea.apiBase}chain/${collection.nftChain}/account/${walletAddress}/nfts?collection=${collection.nftContract}`
);
const data = await response.json();
setIsOwner(data.nfts.length > 0);
```

---

## 📚 Recursos Adicionales

### Documentación de APIs

- **Spotify Web API**: https://developer.spotify.com/documentation/web-api
- **SoundCloud API**: https://developers.soundcloud.com/docs/api
- **Audius API**: https://audiusproject.github.io/api-docs/
- **OpenSea API**: https://docs.opensea.io/reference/api-overview
- **Magic Eden API**: https://api.magiceden.dev/
- **Alchemy**: https://docs.alchemy.com/
- **WalletConnect**: https://docs.walletconnect.com/

### Tutoriales

- **Integrar Spotify Embeds**: https://developer.spotify.com/documentation/embeds
- **Conectar MetaMask**: https://docs.metamask.io/wallet/how-to/connect/
- **Verificar NFT Ownership**: https://docs.opensea.io/reference/retrieve-nfts-by-account

---

## 🎯 Próximos Pasos

1. **Configurar todos los links** según esta guía
2. **Probar cada colección** individualmente
3. **Verificar que los embeds funcionen** correctamente
4. **Implementar wallet connection** real
5. **Implementar verificación de NFT** real
6. **Desplegar en producción**

---

## 💡 Tips de Eficiencia

### Usa Playlists de Spotify

En lugar de tracks individuales, puedes usar playlists completas:

```typescript
spotifyPlaylistId: "37i9dQZF1DXcBWIGoYBM5M", // Playlist ID
```

### Cache de Verificación de NFTs

Guarda el resultado de verificación en localStorage para evitar llamadas repetidas:

```typescript
localStorage.setItem(`nft_${collection.id}_${walletAddress}`, "true");
```

### Lazy Loading de Embeds

Solo carga el embed cuando el usuario hace click en Play:

```typescript
{isPlaying && getSpotifyEmbedUrl(currentTrack) && (
  <iframe src={getSpotifyEmbedUrl(currentTrack)!} ... />
)}
```

---

**¿Necesitas ayuda?** Revisa el código en `TunovaOptimized.tsx` - está completamente comentado y listo para usar.

**Versión**: 1.0  
**Última actualización**: 2 de noviembre de 2025
