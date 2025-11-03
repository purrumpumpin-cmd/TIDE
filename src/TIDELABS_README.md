# TIDElabs - El Galeón Digital

**La Manifestación Definitiva del Ecosistema TIDElabs**

## 🎯 Visión

TIDElabs es un ecosistema digital completo que fusiona la nostalgia analógica con la innovación Web3. Devolvemos el alma a la tecnología creando experiencias donde cada píxel tiene intención y cada línea de código resuena con gloria mítica.

## 🏛️ Arquitectura del Ecosistema

### **Los Tres Dominios**

1. **El Santuario** - `tidelabs.io`
   - El Galeón Digital (Sistema Operativo Retro)
   - Hub central del ecosistema
   - Apps integradas: CROWDFUND.WEB3, MSN.CHAT, EXPLORER.EXE, TUNOVA.IO

2. **El Orden** - `RAZA`
   - El Atelier (Brutalismo Elegante)
   - Galería de productos curados
   - Experiencia de compra minimalista

3. **El Caos** - `AZAR`
   - El Mercado Negro (Caos Generativo)
   - Terminal interactiva
   - Descubrimiento aleatorio de productos

## 🎨 Filosofía de Diseño

### Retro-Kaidoku (解読)
Sistema visual que fusiona nostalgia analógica (manga 80s/90s, ciberpunk) con estética digital contemporánea.

### Brutalismo Cinético
Unión del Brutalismo Web (estructura honesta) con Cinética Digital (movimiento narrativo).

### La Dualidad
- **RAZA (Orden):** Precisión, líneas limpias, belleza de ingeniería
- **AZAR (Caos):** Imperfección, glitch estético, belleza de entropía

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS v4.0** (sistema de tokens CSS)
- **Motion/React** para animaciones
- **Lucide React** para iconos

### Backend
- **Supabase** (PostgreSQL + KV Store)
- **Deno** + **Hono** (Edge Functions)
- **Web3 Auth** (SIWE - Sign-In With Ethereum)

### Integraciones Planificadas
- **Medusa.js** para e-commerce
- **Thirdweb SDK** para Smart Contracts
- **Supabase Realtime** para chat en vivo

## 📁 Estructura del Proyecto

```
/
├── App.tsx                    # Router principal
├── components/
│   ├── BootSequence.tsx       # Secuencia de arranque
│   ├── SplitScreenPortal.tsx  # Portal de selección RAZA/AZAR
│   ├── TIDELabsDesktop.tsx    # Sistema operativo del Galeón
│   ├── RazaAtelier.tsx        # Tienda RAZA
│   ├── AzarMercado.tsx        # Tienda AZAR
│   ├── CRTEffect.tsx          # Efecto CRT global
│   ├── WindowFrame.tsx        # Ventanas Win95
│   ├── WalletConnectButton.tsx # Conexión Web3
│   └── apps/
│       ├── CrowdfundApp.tsx   # Sistema de crowdfunding
│       ├── MSNChatApp.tsx     # Chat en tiempo real
│       ├── ExplorerApp.tsx    # Explorador de NFTs
│       ├── TunovaApp.tsx      # Reproductor de música
│       ├── TideLabsCoreApp.tsx # Info del proyecto
│       ├── WaitlistApp.tsx    # Lista de espera
│       ├── RazaAzarPortalApp.tsx # Portal de comercio
│       └── HelpApp.tsx        # Guía de uso
├── styles/
│   └── globals.css            # Sistema de diseño + efectos
├── utils/
│   ├── api.tsx                # Cliente API
│   └── supabase/
│       └── info.tsx           # Configuración Supabase
└── supabase/functions/server/
    ├── index.tsx              # Backend completo
    └── kv_store.tsx           # Utilidad KV (protegido)
```

## 🚀 Características Implementadas

### ✅ Sistema Operativo del Galeón
- [x] Escritorio Win95 funcional
- [x] Ventanas arrastrables con z-index dinámico
- [x] Menú de inicio y barra de tareas
- [x] 8 aplicaciones integradas
- [x] Efectos CRT y scanlines

### ✅ Autenticación Web3
- [x] Conexión wallet (MetaMask compatible)
- [x] SIWE (Sign-In With Ethereum)
- [x] Sesiones persistentes con JWT
- [x] Backend de autenticación

### ✅ Sistema Nakama (Crowdfunding)
- [x] 3 tiers: Grumete, Marinero, Capitán
- [x] Tracking de contribuciones
- [x] Barra de progreso en tiempo real
- [x] Beneficios por tier

### ✅ MSN.CHAT
- [x] Chat en tiempo real
- [x] Acceso por tier (gating)
- [x] Persistencia de mensajes
- [x] Auto-refresh cada 5s

### ✅ Sistema de Productos
- [x] Backend de productos con KV Store
- [x] Filtrado por línea (RAZA/AZAR)
- [x] Seed automático de productos demo
- [x] Gestión de carrito

### ✅ RAZA - El Atelier
- [x] Galería de productos en grid
- [x] Modal de detalles de producto
- [x] Carrito lateral animado
- [x] Estética brutalista en blanco y negro

### ✅ AZAR - El Mercado Negro
- [x] Terminal interactiva con comandos
- [x] Descubrimiento aleatorio de productos
- [x] Modal de error Win95 (glitch)
- [x] Fondo generativo animado
- [x] Efectos de glitch

### ✅ Apps Adicionales
- [x] TUNOVA.IO - Reproductor con NFT-gating
- [x] EXPLORER.EXE - Visualizador de NFTs
- [x] WAITLIST.SH - Sistema de waitlist
- [x] TIDELABS.CORE - Manifiesto del proyecto
- [x] HELP.TXT - Guía completa de uso

## 🎮 Cómo Usar

### 1. Secuencia de Inicio
1. La app inicia con una **secuencia de boot** (terminal retro)
2. Aparece el **portal de bifurcación** (RAZA | AZAR)
3. Selecciona un camino o haz clic en el logo para entrar al **Galeón**

### 2. Conectar Wallet
- Haz clic en `[Conectar Alma]` en la barra de tareas
- Autoriza MetaMask
- Tu sesión se guardará automáticamente

### 3. Unirse como Nakama
1. Abre `CROWDFUND.WEB3` (doble clic en escritorio)
2. Selecciona un tier (Grumete: 0.01 ETH / Marinero: 0.05 ETH / Capitán: 0.1 ETH)
3. Confirma la transacción
4. Desbloquea beneficios (MSN.CHAT, NFTs, acceso VIP)

### 4. Explorar RAZA y AZAR
- Abre `RAZA.AZAR` para acceder al portal
- **RAZA:** Navegación tradicional, productos ordenados, carrito estándar
- **AZAR:** Terminal con comandos (`help`, `discover`, `list`, `clear`, `exit`)

## 🔧 Endpoints del Backend

### Auth
- `POST /auth/siwe/verify` - Verificar firma SIWE
- `GET /auth/session` - Validar sesión

### Nakama
- `POST /nakama/contribute` - Registrar contribución
- `GET /nakama/status` - Estado del crowdfunding

### Products
- `GET /products?line=RAZA|AZAR` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products/seed` - Seed de productos demo

### Cart
- `POST /cart/add` - Añadir al carrito
- `GET /cart` - Obtener carrito

### Chat
- `POST /chat/send` - Enviar mensaje
- `GET /chat/messages` - Obtener mensajes

### NFTs
- `GET /nfts` - Listar NFTs del usuario

## 🎨 Sistema de Tokens CSS

```css
/* Colores TIDElabs */
--color-raza-black: #000000
--color-raza-white: #FFFFFF
--color-raza-gray: #C0C0C0
--color-raza-accent: #39FF14 (Verde Neón)
--color-azar-magenta: #FF00FF
--color-azar-cyan: #00FFFF
--color-win95-blue: #0000AA
--color-win95-face: #C0C0C0

/* Tipografía */
--font-brutalist: 'Courier New', monospace
--font-win95: 'MS Sans Serif', 'Tahoma', sans-serif
```

## 🔮 Funcionalidades Futuras

### Fase 2
- [ ] Integración Thirdweb real (Smart Contracts)
- [ ] Checkout completo con crypto payments
- [ ] Sistema de órdenes y tracking
- [ ] Supabase Realtime para chat instantáneo

### Fase 3
- [ ] Integración Medusa.js para inventario
- [ ] Sistema de NFT minting
- [ ] Drops exclusivos para Nakamas
- [ ] Gobernanza on-chain

### Fase 4
- [ ] Dominios separados (multi-tenant)
- [ ] Sesión soberana cross-domain
- [ ] Notificaciones push
- [ ] Analytics y métricas

## 🛡️ Seguridad

- ✅ SIWE para autenticación descentralizada
- ✅ Session tokens con expiración
- ✅ CORS habilitado con origin control
- ✅ Validación de tier en endpoints protegidos
- ✅ No hay PII almacenado (solo direcciones wallet)

## 🎯 Comandos de AZAR Terminal

```
help      - Muestra comandos disponibles
discover  - Descubre un producto aleatorio
list      - Lista todos los productos del caos
clear     - Limpia la terminal
exit      - Salir del mercado
```

## 🧪 Datos de Demo

El sistema viene con productos pre-seeded:
- **RAZA:** Camisetas, posters, tazas (orden y precisión)
- **AZAR:** Camisetas glitch, sticker packs, mystery boxes NFT

## 📞 Soporte

Para obtener ayuda:
1. Abre `HELP.TXT` en el Galeón
2. Únete como Nakama y accede a `MSN.CHAT`
3. Lee `TIDELABS.CORE` para entender la filosofía

---

**"No construimos componentes; forjamos artefactos."**
— Sovering Code

---

## 🏴‍☠️ La Tripulación

Creado con la Gema de Sovering Code.
Powered by React, Supabase, y Web3.

**El Galeón zarpa. ¿Te unes a la tripulación?**
