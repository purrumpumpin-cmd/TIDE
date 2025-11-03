# 🎵 TUNOVA - Guía de Configuración de Música

## 📼 Cómo Agregar Links de Música

Todos los casetes están configurados en `/components/apps/TunovaApp.tsx`. Busca la sección `CASSETTES` y agrega los links en el campo `audioUrl` de cada track.

---

## 1️⃣ REY DE LOS EMPRENDEDORES - Vah0m4n

**8 Idiomas - 8 Tracks**

```typescript
// Línea ~50 en TunovaApp.tsx
tracks: [
  {
    id: "vah0m4n-es",
    title: "Rey de los Emprendedores",
    artist: "Vah0m4n",
    language: "🇪🇸 Español",
    audioUrl: "TU_LINK_SPOTIFY_O_SOUNDCLOUD_AQUÍ",
  },
  // ... más idiomas
]
```

### Formatos Soportados:
- ✅ Spotify: `https://open.spotify.com/track/...`
- ✅ SoundCloud: `https://soundcloud.com/...`
- ✅ YouTube: `https://www.youtube.com/watch?v=...`
- ✅ Direct MP3/WAV: `https://tudominio.com/audio.mp3`

---

## 2️⃣ NAKAMAS CREW Genesis Vol.1

**10-12 Artistas del Ecosistema**

```typescript
// Línea ~100 en TunovaApp.tsx
tracks: [
  {
    id: "nakamas-01",
    title: "Digital Nostalgia",
    artist: "Neo Samurai",
    audioUrl: "", // ← AGREGAR LINK AQUÍ
  },
  // ... más artistas (hasta 12)
]
```

### Colaboraciones:
Los artistas pueden colaborar a través del **MSN.CHAT**. El casete incluye un botón para abrir el chat directamente.

---

## 3️⃣ RazAzaR - Versión RAZA

**Brutalismo Elegante**

```typescript
// Línea ~150 en TunovaApp.tsx
tracks: [
  {
    id: "raza-01",
    title: "Minimal Minds",
    artist: "RazAzaR",
    audioUrl: "", // ← AGREGAR LINK AQUÍ
  },
]
```

---

## 4️⃣ RazAzaR - Versión AZAR

**Caos Generativo**

```typescript
// Línea ~180 en TunovaApp.tsx
tracks: [
  {
    id: "azar-01",
    title: "Chaos Theory",
    artist: "RazAzaR",
    audioUrl: "", // ← AGREGAR LINK AQUÍ
  },
]
```

---

## 5️⃣ Radio Pirata 24/7

**Stream en Vivo con Recompensas**

```typescript
// Línea ~210 en TunovaApp.tsx
tracks: [
  {
    id: "radio-mix",
    title: "Live Mix - TUNOVA Ecosystem",
    artist: "Radio Pirata",
    duration: "∞",
    audioUrl: "", // ← AGREGAR LINK DE STREAM AQUÍ (Icecast, Mixlr, etc.)
  },
]
```

### Sistema de Recompensas:
- 🎧 **1 punto cada 60 segundos** de escucha
- ⚡ Los puntos se guardan automáticamente en el backend
- 🏆 Leaderboard disponible en `/tunova/leaderboard`

---

## 🎨 Personalización de Casetes

Cada casete tiene propiedades personalizables:

```typescript
{
  id: "id-unico",
  name: "Nombre del Casete",
  type: "vah0m4n" | "nakamas" | "razazar-raza" | "razazar-azar" | "radio",
  description: "Descripción corta",
  artwork: "🎨", // Emoji para el casete
  color: "from-yellow-600 to-orange-600", // Gradient de Tailwind
  accentColor: "#FFB900", // Color de acento
  isNFT: true, // Si requiere NFT para desbloquear
  requiredNFT: "Nombre del NFT", // Nombre del NFT requerido
  isOwned: true, // Si el usuario lo posee (cambiar según wallet)
  tracks: [...]
}
```

---

## 🔐 Sistema de NFT Gating

Para configurar qué usuarios tienen acceso a cada casete:

1. **Conectar Wallet**: El usuario debe conectar su wallet
2. **Verificar NFTs**: El componente recibe `userNFTs` como prop
3. **Validar Ownership**: 
   ```typescript
   isOwned: !cassette.isNFT || userNFTs.includes(cassette.requiredNFT)
   ```

### Ejemplo de NFTs:
- `"Vah0m4n Genesis NFT"`
- `"Nakamas Genesis NFT"`
- `"RazAzaR RAZA NFT"`
- `"RazAzaR AZAR NFT"`

---

## 📊 Backend - API de Puntos

### Agregar Puntos
```typescript
POST /tunova/points/add
{
  points: 1,
  listeningTime: 60,
  cassetteId: "radio-pirata"
}
```

### Obtener Puntos del Usuario
```typescript
GET /tunova/points
```

### Leaderboard
```typescript
GET /tunova/leaderboard
```

---

## 🚀 Ejemplo Completo

```typescript
{
  id: "vah0m4n-rey",
  name: "Rey de los Emprendedores",
  type: "vah0m4n",
  description: "Vah0m4n - 8 Idiomas Edition",
  artwork: "👑",
  color: "from-yellow-600 to-orange-600",
  accentColor: "#FFB900",
  isNFT: true,
  requiredNFT: "Vah0m4n Genesis NFT",
  isOwned: true,
  tracks: [
    {
      id: "vah0m4n-es",
      title: "Rey de los Emprendedores",
      artist: "Vah0m4n",
      language: "🇪🇸 Español",
      duration: "3:45",
      audioUrl: "https://open.spotify.com/track/ABC123", // ✅ LINK AQUÍ
    },
  ],
}
```

---

## 🎧 Testing

Para probar sin NFTs, cambia temporalmente:
```typescript
isOwned: true, // Todos los casetes desbloqueados
```

Para probar con NFTs específicos, pasa el array:
```typescript
<TunovaApp 
  userNFTs={["Vah0m4n Genesis NFT", "Nakamas Genesis NFT"]}
  walletAddress="0x..."
/>
```

---

## 📝 Notas Importantes

1. **Radio Pirata es GRATIS** - No requiere NFT
2. **Los puntos se guardan automáticamente** cada minuto
3. **El sistema soporta múltiples formatos** de audio
4. **Los casetes se pueden agregar/editar** sin afectar la funcionalidad
5. **La colección es extensible** - Puedes agregar más casetes en el futuro

---

## 🏴‍☠️ ¡Listo para Navegar!

Una vez agregados los links, los usuarios podrán:
- 📼 Insertar casetes en el Walkman
- 🎵 Reproducir las canciones
- ⚡ Ganar puntos (Radio Pirata)
- 🏆 Competir en el leaderboard
- 🤝 Colaborar con artistas (MSN.CHAT)

**El ecosistema TUNOVA está listo para el Genesis! 🚀**
