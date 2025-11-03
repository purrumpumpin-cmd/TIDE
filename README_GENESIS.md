# 🏴‍☠️ TIDElabs OS - Genesis Release (v1.0)

## 🎯 Estado del Proyecto: 80% Funcionalidad Completada

TIDElabs OS ha alcanzado el estado **Genesis** con todas las funcionalidades principales implementadas y funcionando. Este es un sistema operativo retro-futurista Web3 completo para la comunidad NAKAMA.

## ✅ Funcionalidades Implementadas

### 🔐 Web3 Core & Autenticación
- **WalletConnect Integration**: Conexión segura de wallets
- **Sign-In with Ethereum (SIWE)**: Autenticación sin contraseña
- **Persistencia de Sesión**: Gestión de sesiones con Supabase Auth
- **Multi-wallet Support**: Compatible con MetaMask, WalletConnect, etc.

### 💰 Sistema de Puntos (Airdrop Ready)
- **Dashboard de Puntos**: Visualización completa en SETTINGS.SYS
- **Sistema de Niveles**: Common, Uncommon, Rare, Epic, Legendary
- **Códigos de Referido**: Generación automática NAKAMA-XXXXXX
- **Actividades Gamificadas**: Puntos por login, chat, música, etc.
- **Airdrop Calculator**: Cálculo automático de airdrops garantizados

### 🎮 Área Recreativa Épica (ARCADE.EXE)
- **Juegos Integrados**: Floor796.com y EmuOS embebidos
- **Sistema de Sugerencias**: Los NAKAMAS pueden sugerir nuevos juegos
- **Moderación**: Sistema de aprobación para sugerencias
- **Ventanas Emergentes**: Juegos en iframes con controles nativos
- **Puntos por Sugerencias**: +25 puntos por sugerencia aprobada

### 💬 MSN.CHAT Pirata (Tiempo Real)
- **Chat en Tiempo Real**: Supabase Realtime WebSockets
- **Estados Piratas**: "En el Galeón", "Izando la Bandera", etc.
- **Función Zumbido**: Efecto visual y sonoro como MSN clásico
- **Lista de NAKAMAS**: Usuarios online con estados
- **Puntos por Mensaje**: +2 puntos por cada mensaje enviado

### 💎 Crowdfunding Web3 (Tesoro Compartido)
- **Múltiples Criptomonedas**: ETH, USDT, USDC, BNB, MATIC
- **Sistema de Tiers**: Grumete, Marinero, Contramaestre, Capitán
- **Airdrops Garantizados**: 5-50 airdrops según contribución
- **Tracking de Contribuciones**: Historial completo por wallet
- **Multiplicadores**: Hasta 10x en airdrops para Capitanes

### 🖥️ Waitlist MS-DOS (Sistema de Referidos)
- **Terminal Auténtica**: Interfaz MS-DOS completa
- **Comandos Interactivos**: REGISTER, HELP, STATUS, CLEAR
- **Selección de Roles**: 15 roles piratas diferentes
- **Sistema de Referidos**: Códigos únicos con tracking
- **Validación en Tiempo Real**: Verificación de códigos de referido

### 🤖 Mascotas IA (PoseiDrop, UngaBunga, BeatBunny)
- **PoseiDrop** 🐬: Experto en logística, puntos y airdrops
- **UngaBunga** 🐵: Mono técnico del sistema y arquitectura
- **BeatBunny** 🎵: Conejo musical de TUNOVA.IO y Radio Pirata
- **Chat Inteligente**: Respuestas contextuales por mascota
- **Bases de Conocimiento**: Especialización por área de expertise

### 🎨 Drops de Raza/Azar NFT (EXPLORER.EXE)
- **Visualización de NFTs**: Galería completa con filtros
- **Colecciones RAZA/AZAR**: Drops exclusivos del ecosistema
- **Sistema de Rareza**: Common, Rare, Epic, Legendary
- **Modal de Detalles**: Información completa de cada NFT
- **Integración de Compra**: Preparado para smart contracts

## 🛠️ Arquitectura Técnica

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Win95 Theme**
- **Framer Motion** para animaciones
- **Lucide React** para iconografía

### Backend
- **Supabase** como BaaS completo
- **PostgreSQL** con Row Level Security
- **Supabase Realtime** para chat en tiempo real
- **Edge Functions** para lógica de negocio

### Web3
- **WalletConnect v2** para conexión de wallets
- **Ethers.js v6** para interacciones blockchain
- **SIWE** para autenticación descentralizada

### Base de Datos
```sql
-- Tablas principales implementadas:
- user_profiles: Perfiles de usuario
- user_points: Sistema de puntos y referidos
- nakama_status: Estados de chat en tiempo real
- nakama_messages: Mensajes del chat
- crowdfund_contributions: Contribuciones al tesoro
- waitlist_entries: Lista de espera con roles
- arcade_suggestions: Sugerencias de juegos
```

## 🚀 Cómo Ejecutar

### Desarrollo
```bash
npm install
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

### Supabase Setup
```bash
# Ejecutar el script SQL en tu proyecto Supabase
supabase/supabase_setup.sql

# Desplegar Edge Functions
supabase functions deploy auth-siwe
supabase functions deploy points-manager
supabase functions deploy ai-chat
```

## 🎮 Aplicaciones Disponibles

1. **HELP.TXT** - Guía de usuario
2. **TIDELABS.CORE** - Información del proyecto
3. **CROWDFUND.WEB3** - Sistema de crowdfunding
4. **MSN.CHAT** - Messenger pirata en tiempo real
5. **EXPLORER.EXE** - Bóveda de NFTs y drops
6. **TUNOVA.IO** - Plataforma musical
7. **LEADERBOARD** - Rankings de la comunidad
8. **WAITLIST.SH** - Terminal de registro
9. **SETTINGS.SYS** - Configuración y puntos
10. **RAZA.AZAR** - Portal de colecciones NFT
11. **ARCADE.EXE** - Área recreativa
12. **AI.PETS** - Asistentes IA
13. **GENESIS** - Estado del proyecto

## 🔮 Próximos Pasos (20% Restante)

### Integraciones Pendientes
- [ ] **OpenAI API**: Integración real para mascotas IA
- [ ] **Moralis/Alchemy**: API real para NFTs
- [ ] **Smart Contracts**: Contratos para crowdfunding y NFTs
- [ ] **IPFS**: Almacenamiento descentralizado
- [ ] **Token $NAKAMAS**: Implementación del token nativo

### Optimizaciones
- [ ] **Code Splitting**: Reducir bundle size
- [ ] **PWA**: Aplicación web progresiva
- [ ] **Mobile Responsive**: Optimización móvil
- [ ] **Performance**: Lazy loading y optimizaciones
- [ ] **Testing**: Suite de tests completa

### Funcionalidades Adicionales
- [ ] **Notificaciones Push**: Sistema de notificaciones
- [ ] **Marketplace**: Intercambio de NFTs
- [ ] **Governance**: Sistema de votación DAO
- [ ] **Staking**: Staking de tokens $NAKAMAS
- [ ] **Analytics**: Dashboard de métricas

## 🏴‍☠️ Comunidad NAKAMA

- **Discord**: [Próximamente]
- **Twitter**: [Próximamente]
- **Telegram**: [Próximamente]
- **Website**: [TIDElabs.io]

## 📄 Licencia

Copyright (C) 2024 TIDElabs. Todos los derechos reservados.

---

**¡Ahoy, NAKAMA! El Galeón Digital está listo para zarpar. ¡Únete a la aventura!** 🏴‍☠️⚓🌊