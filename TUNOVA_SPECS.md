# 🎵 TUNOVA.IO - Especificaciones de Diseño y Desarrollo

## 📋 Resumen Ejecutivo

TUNOVA.IO es la plataforma musical Web3 del ecosistema TIDELabs que combina nostalgia retro con tecnología blockchain. Los usuarios coleccionan casetes NFT, escuchan música en walkmans fotorrealistas y ganan recompensas por su tiempo de escucha.

---

## 🎨 Wireframes Generados

Se han creado tres wireframes de alta fidelidad que representan la visión mejorada de TUNOVA.IO:

### 1. Vista Principal (tunova_main_view.png)
Muestra la composición completa con el Walkman Sony fotorrealista en el centro, estantería de casetes a la izquierda, navegación superior y visualizador de audio en la parte inferior.

**Elementos clave**:
- Walkman Sony con acabado metálico plateado
- Botones físicos realistas (Play, Pause, FF, RW, Stop)
- Display LED mostrando información del track
- Estantería de madera con 10 casetes organizados verticalmente
- Fondo oscuro con gradiente negro a morado profundo
- Iluminación cinematográfica con sombras suaves
- Visualizador de forma de onda en neón verde

### 2. Detalle de Casete (tunova_cassette_detail.png)
Vista detallada de un casete individual con todos sus elementos visuales y funcionales.

**Elementos clave**:
- Casete con ventana transparente mostrando carretes de cinta
- Gradiente vibrante (púrpura a rosa para colección NAKAMAS)
- Etiqueta con listado de 10-12 canciones
- Badge NFT en la esquina
- Tornillos metálicos y textura plástica realista
- Barra de progreso de reproducción
- Botones de like/favorito y compartir

### 3. Navegación entre Colecciones (tunova_collection_nav.png)
Sistema de carrusel horizontal mostrando los 4 walkmans diferentes, uno por colección.

**Elementos clave**:
- Walkman dorado para Vah0m4n
- Walkman púrpura neón para NAKAMAS
- Walkman blanco minimalista para RazAzaR RAZA
- Walkman negro con efecto glitch para RazAzaR AZAR
- Flechas de transición suaves entre colecciones
- Mini-estantería con 3-4 casetes preview debajo de cada Walkman
- Efecto spotlight sobre el Walkman activo

---

## 🏗️ Arquitectura de Componentes

### Estructura de Componentes React

```
TunovaApp/
├── CollectionSelector (navegación entre walkmans)
├── CassetteShelf (estantería lateral)
│   ├── CassetteCard (cada casete individual)
│   └── NFTBadge (indicador de NFT)
├── WalkmanDevice (dispositivo principal)
│   ├── CassetteCompartment (compartimento con animación)
│   ├── LCDDisplay (pantalla de información)
│   ├── ControlButtons (botones físicos)
│   └── VolumeSlider (control de volumen)
├── AudioVisualizer (visualizador de forma de onda)
├── RewardsPanel (panel de puntos y recompensas)
└── AudioPlayer (reproductor Web Audio API)
```

---

## 🎯 Funcionalidades Críticas a Implementar

### 1. Sistema de Navegación entre Walkmans

**Objetivo**: Permitir al usuario cambiar entre las 4 colecciones principales de forma fluida y visual.

**Implementación**:
- Carrusel horizontal con 4 walkmans renderizados en 3D
- Transiciones suaves con animaciones de fade y slide
- Cada walkman tiene diseño único según su colección
- Al cambiar de walkman, la estantería de casetes se actualiza automáticamente
- Indicadores visuales (dots) para mostrar posición actual

**Colecciones**:
1. **Vah0m4n** - Walkman dorado, 8 casetes (8 idiomas)
2. **NAKAMAS** - Walkman púrpura neón, 10-12 casetes (artistas del crew)
3. **RazAzaR RAZA** - Walkman blanco minimalista, 4 casetes (brutalismo elegante)
4. **RazAzaR AZAR** - Walkman negro glitch, 4 casetes (caos generativo)

**Código base**:
```typescript
const WALKMAN_COLLECTIONS = [
  {
    id: 'vahoman',
    name: 'Vah0m4n',
    color: 'gold',
    style: 'from-yellow-600 to-orange-600',
    cassettes: CASSETTES.filter(c => c.type === 'vah0m4n')
  },
  {
    id: 'nakamas',
    name: 'NAKAMAS',
    color: 'purple-neon',
    style: 'from-purple-600 to-pink-600',
    cassettes: CASSETTES.filter(c => c.type === 'nakamas')
  },
  // ... resto de colecciones
];
```

### 2. Integración de Audio Real

**Objetivo**: Reproducir música real desde URLs de Spotify, SoundCloud o archivos IPFS.

**Implementación**:
- Usar Web Audio API para control total del audio
- Soporte para múltiples fuentes (Spotify embeds, SoundCloud, IPFS)
- Sincronización perfecta entre UI y reproducción
- Controles completos: play, pause, stop, forward, rewind
- Barra de progreso interactiva con seek
- Control de volumen con slider

**Estructura de datos actualizada**:
```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  language?: string;
  duration: string;
  audioUrl: string; // URL de Spotify/SoundCloud/IPFS
  ipfsHash?: string; // Hash IPFS para descentralización
  previewUrl?: string; // Preview de 30s
}
```

**Web Audio API setup**:
```typescript
const audioContext = new AudioContext();
const audioElement = new Audio(track.audioUrl);
const source = audioContext.createMediaElementSource(audioElement);
const analyser = audioContext.createAnalyser();

source.connect(analyser);
analyser.connect(audioContext.destination);

// Visualizador de forma de onda
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
```

### 3. Animaciones del Casete

**Objetivo**: Crear animaciones realistas de inserción, expulsión y reproducción del casete.

**Animaciones requeridas**:

**a) Inserción del casete**:
- Casete se desliza desde arriba hacia el compartimento
- Duración: 500ms con easing `easeOut`
- Sonido de click al insertarse
- Walkman se "ilumina" al detectar el casete

**b) Carretes girando durante reproducción**:
- Dos círculos representando los carretes
- Rotación continua usando CSS animation
- Velocidad proporcional al tempo de la música
- Se detienen cuando se pausa

**c) Expulsión del casete**:
- Casete se desliza hacia arriba y desaparece
- Duración: 500ms con easing `easeIn`
- Sonido de expulsión
- Fade out del display LCD

**Código de animación**:
```typescript
// Inserción
<motion.div
  initial={{ y: -200, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -200, opacity: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* Casete */}
</motion.div>

// Carretes girando
<motion.div
  className="reel"
  animate={{ rotate: isPlaying ? 360 : 0 }}
  transition={{ 
    repeat: Infinity, 
    duration: 2, 
    ease: "linear" 
  }}
/>
```

### 4. Sistema de NFTs para Casetes

**Objetivo**: Cada casete es un NFT coleccionable que el usuario debe poseer para escucharlo.

**Smart Contract (ERC-721)**:
```solidity
contract TunovaCassette is ERC721 {
    struct CassetteMetadata {
        string collectionName;
        string artist;
        string[] trackTitles;
        string ipfsArtwork;
        uint256 rarity; // 1-5 estrellas
        bool isUnlocked;
    }
    
    mapping(uint256 => CassetteMetadata) public cassettes;
    
    function mintCassette(address to, CassetteMetadata memory metadata) 
        public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        cassettes[tokenId] = metadata;
        _tokenIdCounter.increment();
        return tokenId;
    }
}
```

**Frontend - Verificación de ownership**:
```typescript
const checkCassetteOwnership = async (
  walletAddress: string, 
  cassetteId: string
): Promise<boolean> => {
  const contract = new ethers.Contract(
    CASSETTE_CONTRACT_ADDRESS,
    CASSETTE_ABI,
    provider
  );
  
  const balance = await contract.balanceOf(walletAddress);
  
  for (let i = 0; i < balance; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
    const metadata = await contract.cassettes(tokenId);
    if (metadata.collectionName === cassetteId) {
      return true;
    }
  }
  
  return false;
};
```

**UI de casetes bloqueados**:
- Casetes no poseídos aparecen con overlay oscuro
- Icono de candado visible
- Tooltip mostrando "Necesitas el NFT: [nombre]"
- Botón "Comprar NFT" que redirige al marketplace
- Efecto de desbloqueo con animación cuando se adquiere

### 5. Sistema de Recompensas por Escucha

**Objetivo**: Los usuarios ganan puntos para el Airdrop de $NAKAMAS por cada minuto de escucha.

**Mecánica**:
- **Radio Pirata**: 1 punto cada 60 segundos
- **Casetes NFT**: 2 puntos cada 60 segundos (bonus por ownership)
- **Multiplicadores**:
  - Early listener (primeros 1000 usuarios): x1.5
  - Holder de múltiples NFTs: x2
  - Escucha diaria consecutiva: +10% por día (max x3)

**Smart Contract de Recompensas**:
```solidity
contract TunovaRewards {
    mapping(address => uint256) public listeningPoints;
    mapping(address => uint256) public lastListenTimestamp;
    mapping(address => uint256) public consecutiveDays;
    
    function addListeningPoints(
        address user, 
        uint256 seconds, 
        bool isNFT
    ) external {
        uint256 basePoints = seconds / 60;
        uint256 multiplier = calculateMultiplier(user, isNFT);
        uint256 finalPoints = basePoints * multiplier;
        
        listeningPoints[user] += finalPoints;
        updateConsecutiveDays(user);
        
        emit PointsEarned(user, finalPoints);
    }
    
    function calculateMultiplier(address user, bool isNFT) 
        internal view returns (uint256) {
        uint256 multiplier = 100; // base 1x = 100
        
        if (isNFT) multiplier += 100; // +1x for NFT
        if (isEarlyListener(user)) multiplier += 50; // +0.5x
        
        uint256 streakBonus = min(consecutiveDays[user] * 10, 200);
        multiplier += streakBonus;
        
        return multiplier / 100;
    }
}
```

**Frontend - Tracking de tiempo**:
```typescript
useEffect(() => {
  if (isPlaying && selectedCassette) {
    const interval = setInterval(() => {
      setListeningTime(prev => prev + 1);
      
      // Cada 60 segundos, enviar puntos al smart contract
      if (listeningTime % 60 === 0 && listeningTime > 0) {
        addListeningPoints(
          walletAddress,
          60,
          selectedCassette.isNFT
        );
        
        setListeningPoints(prev => prev + calculatePoints());
        showRewardNotification();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }
}, [isPlaying, listeningTime]);
```

**UI de Recompensas**:
- Panel lateral mostrando puntos acumulados
- Animación de "+1 punto" cada minuto
- Barra de progreso hasta el próximo punto
- Leaderboard de top listeners
- Proyección de tokens $NAKAMAS en el Airdrop

---

## 🎨 Guía de Estilo Visual

### Paleta de Colores por Colección

**Vah0m4n (Dorado)**:
- Principal: `#FFB900` (dorado)
- Secundario: `#FF8C00` (naranja)
- Gradiente: `from-yellow-600 to-orange-600`
- Acento: `#39FF14` (verde neón)

**NAKAMAS (Púrpura Neón)**:
- Principal: `#FF00FF` (magenta)
- Secundario: `#9D00FF` (púrpura)
- Gradiente: `from-purple-600 to-pink-600`
- Acento: `#00FFFF` (cian)

**RazAzaR RAZA (Minimalista)**:
- Principal: `#FFFFFF` (blanco)
- Secundario: `#E5E5E5` (gris claro)
- Gradiente: `from-white to-gray-200`
- Acento: `#39FF14` (verde neón)

**RazAzaR AZAR (Glitch)**:
- Principal: `#000000` (negro)
- Secundario: `#1A0033` (púrpura oscuro)
- Gradiente: `from-black via-purple-900 to-black`
- Acento: `#00FFFF` (cian)

### Tipografía

- **Logo y títulos**: Font Brutalist (sans-serif bold)
- **Display LCD**: Font Mono (monospace)
- **Etiquetas de casetes**: Font Win95 (sistema retro)
- **Texto general**: Inter o Helvetica

### Efectos Visuales

**Iluminación**:
- Luz principal desde arriba-derecha
- Sombras suaves con blur de 20-30px
- Reflejo especular en superficies metálicas
- Glow neón en elementos activos

**Texturas**:
- Walkman: Metal brushed con reflejo especular
- Casetes: Plástico semi-transparente
- Estantería: Madera con vetas naturales
- Fondo: Gradiente oscuro con noise sutil

**Animaciones**:
- Transiciones: 300-500ms con easing `ease-out`
- Hover effects: Scale 1.05 en 200ms
- Loading states: Pulse animation
- Micro-interactions: Subtle bounce en clicks

---

## 🔊 Efectos de Sonido

### Sonidos Requeridos

1. **Inserción de casete**: Click mecánico (100ms)
2. **Expulsión de casete**: Pop mecánico (150ms)
3. **Click de botón**: Tap suave (50ms)
4. **Play**: Inicio de cinta (200ms)
5. **Pause**: Detención de cinta (100ms)
6. **Fast Forward**: Sonido de cinta acelerada (loop)
7. **Rewind**: Sonido de cinta retrocediendo (loop)
8. **Ganancia de punto**: Ding satisfactorio (300ms)
9. **Desbloqueo de NFT**: Fanfare épica (2s)
10. **Estática de radio**: Ruido blanco suave (loop)

### Implementación

```typescript
const SOUND_EFFECTS = {
  cassetteInsert: new Audio('/sounds/cassette-insert.mp3'),
  cassetteEject: new Audio('/sounds/cassette-eject.mp3'),
  buttonClick: new Audio('/sounds/button-click.mp3'),
  play: new Audio('/sounds/play.mp3'),
  pause: new Audio('/sounds/pause.mp3'),
  pointEarned: new Audio('/sounds/point-earned.mp3'),
  nftUnlock: new Audio('/sounds/nft-unlock.mp3'),
};

const playSound = (soundKey: keyof typeof SOUND_EFFECTS) => {
  const sound = SOUND_EFFECTS[soundKey];
  sound.currentTime = 0;
  sound.volume = 0.3;
  sound.play();
};
```

---

## 📱 Responsive Design

### Breakpoints

- **Desktop**: 1920px+ (experiencia completa)
- **Laptop**: 1366px-1919px (escala 90%)
- **Tablet**: 768px-1365px (layout vertical)
- **Mobile**: <768px (vista simplificada)

### Adaptaciones Mobile

**Tablet (768px-1365px)**:
- Estantería se mueve arriba del walkman
- Walkman escala a 80%
- Navegación de colecciones se convierte en tabs
- Visualizador de audio se oculta

**Mobile (<768px)**:
- Vista de casete individual en pantalla completa
- Controles táctiles grandes
- Swipe para cambiar de track
- Estantería accesible via drawer lateral
- Navegación de colecciones via dropdown

---

## 🚀 Plan de Implementación

### Fase 1: Rediseño Visual (Semana 1)
- [ ] Implementar nuevo layout con estantería lateral
- [ ] Crear componente Walkman fotorrealista
- [ ] Diseñar casetes con artwork único
- [ ] Implementar sistema de navegación entre colecciones
- [ ] Agregar iluminación cinematográfica

### Fase 2: Audio Funcional (Semana 1-2)
- [ ] Integrar Web Audio API
- [ ] Conectar URLs de música real
- [ ] Implementar controles de reproducción
- [ ] Agregar visualizador de forma de onda
- [ ] Implementar efectos de sonido

### Fase 3: Animaciones (Semana 2)
- [ ] Animación de inserción/expulsión de casete
- [ ] Carretes girando durante reproducción
- [ ] Transiciones entre colecciones
- [ ] Micro-interactions en botones
- [ ] Loading states

### Fase 4: Web3 Integration (Semana 2-3)
- [ ] Desplegar smart contracts de NFT
- [ ] Implementar verificación de ownership
- [ ] Crear sistema de recompensas on-chain
- [ ] Integrar wallet connect
- [ ] Dashboard de puntos para Airdrop

### Fase 5: Polish & Testing (Semana 3)
- [ ] Optimización de performance
- [ ] Testing en múltiples dispositivos
- [ ] Ajustes de UX según feedback
- [ ] Documentación de usuario
- [ ] Preparación para Genesis launch

---

## 📊 Métricas de Éxito

### KPIs Técnicos
- Tiempo de carga inicial: <3 segundos
- Latencia de reproducción: <500ms
- Frame rate: 60 FPS constante
- Tiempo de transacción blockchain: <30 segundos

### KPIs de Negocio
- Tasa de conversión a NFT: >15%
- Tiempo promedio de escucha: >20 minutos/sesión
- Usuarios que regresan: >40% en 7 días
- Puntos promedio por usuario: >100 en primera semana

---

## 🎯 Próximos Pasos Inmediatos

1. **Revisar y aprobar wireframes** con el equipo
2. **Seleccionar URLs de música** para cada casete
3. **Contratar diseñador 3D** para renders de Walkman (o usar Blender)
4. **Definir tokenomics** del sistema de recompensas
5. **Iniciar desarrollo** del componente Walkman mejorado

---

**Documento creado**: 2 de noviembre de 2025  
**Versión**: 1.0  
**Estado**: Listo para implementación
