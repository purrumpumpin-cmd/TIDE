# 🏴‍☠️ TIDElabs - Atajos y Secretos del Sistema

## ⌨️ Atajos de Teclado

### 🎮 Easter Egg: Código Konami
**Secuencia:** ↑ ↑ ↓ ↓ ← → ← → B A

Desbloquea un mensaje secreto de los NAKAMAS piratas. Solo los verdaderos navegantes del Galeón conocen este código.

---

## 🖱️ Funciones del Ratón

### Doble Clic
- **En iconos del escritorio**: Abre la aplicación
- **En barra de título**: Maximiza/Restaura ventana (futuro)

### Clic Derecho (Menú Contextual)
Haz clic derecho en cualquier parte del escritorio para abrir el menú contextual:

#### Opciones Disponibles:
- ⚡ **Reorganizar Iconos**: Resetea todas las posiciones al grid original
- ⚙️ **Propiedades**: Abre el panel de configuración del sistema
- ℹ️ **Acerca de TIDElabs**: Muestra información del Galeón

### Arrastrar y Soltar
- **Iconos del escritorio**: Arrastra cualquier icono a cualquier posición
- **Posiciones guardadas**: Las posiciones se guardan automáticamente en localStorage
- **Ventanas**: Arrastra desde la barra de título para mover ventanas

---

## 🪟 Gestión de Ventanas

### Botones de Control (Esquina Superior Derecha)

1. **Minimizar** (─): Minimiza la ventana a la barra de tareas
2. **Maximizar** (□): Expande la ventana a pantalla completa
3. **Cerrar** (✕): Cierra la aplicación

### Barra de Tareas

#### Comportamiento:
- **Ventana Normal**: Botón con borde hundido (presionado)
- **Ventana Minimizada**: Botón con borde elevado
- **Clic en botón minimizado**: Restaura la ventana
- **Clic en botón activo**: Trae la ventana al frente

#### Elementos:
- 🚀 **Botón Iniciar**: Abre el menú de aplicaciones
- 📱 **Apps Abiertas**: Muestra todas las ventanas activas
- 💼 **Wallet**: Conectar/Desconectar wallet Web3
- 🕐 **Reloj**: Hora actual (actualizado cada segundo)

---

## 🎯 Menú Iniciar

### Estructura:
```
┌─ TIDElabs El Galeón Digital v1.0 ─┐
│                                    │
│  📱 Aplicaciones                   │
│  ├─ HELP.TXT                       │
│  ├─ TIDELABS.CORE                  │
│  ├─ CROWDFUND.WEB3                 │
│  ├─ MSN.CHAT                       │
│  ├─ EXPLORER.EXE                   │
│  ├─ TUNOVA.IO                      │
│  ├─ LEADERBOARD                    │
│  ├─ WAITLIST.SH                    │
│  ├─ SETTINGS.SYS                   │
│  └─ RAZA.AZAR                      │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                    │
│  🔴 Apagar Sistema                 │
│                                    │
└────────────────────────────────────┘
```

### Apagar Sistema
Al hacer clic en **"Apagar Sistema"**:
1. Se cierra el menú Iniciar
2. Aparece pantalla de apagado (2 segundos)
3. Vuelve a la pantalla principal (SplitScreenPortal)

---

## 🎨 Personalización

### Iconos Arrastrables
Cada icono del escritorio se puede arrastrar libremente:

1. **Haz clic y mantén** sobre un icono
2. **Arrastra** a la nueva posición
3. **Suelta** para colocar
4. **Posición guardada** automáticamente

### Restablecer Posiciones
Clic derecho → **"Reorganizar Iconos"** → Recarga la página

---

## 🔐 Sistema de Sesiones

### Persistencia
- La sesión Web3 se guarda en `localStorage`
- Se restaura automáticamente al recargar
- Incluye: wallet, tier, NFTs, session token

### Cerrar Sesión
1. Abre **SETTINGS.SYS**
2. Botón "Desconectar Wallet"
3. O borra `localStorage` desde DevTools

---

## 🏴‍☠️ Secretos y Huevos de Pascua

### 1. Código Konami 🎮
Ya mencionado arriba. Prueba diferentes secuencias...

### 2. Posiciones Únicas ⚡
Cada usuario puede tener su propio layout de escritorio personalizado.

### 3. Z-Index Inteligente 🪟
Las ventanas se ordenan automáticamente. La última ventana clickeada siempre está al frente.

### 4. Reloj en Tiempo Real 🕐
El reloj de la barra de tareas se actualiza cada segundo con la hora local.

### 5. Animaciones Ocultas ✨
- Menú Iniciar tiene animación de entrada/salida
- Menú contextual aparece con scale y fade
- Easter Egg tiene animación de bounce
- Apagado tiene transición suave

---

## 🎭 Modos Especiales

### Modo "Primera Visita"
Si es tu primera vez:
- **HELP.TXT** se abre automáticamente después de 500ms
- Explica cómo usar el sistema
- Se marca como visitado en `localStorage`

### Modo "Sesión Activa"
Si tienes wallet conectado:
- Acceso completo a MSN.CHAT
- Desbloqueo de casetes NFT en TUNOVA
- Participación en crowdfunding
- Chat exclusivo de NAKAMAS

---

## 🛠️ Trucos de Desarrollo

### Acceso Rápido a Apps
```javascript
// En la consola del navegador
localStorage.setItem('tidelabs_visited', 'false'); // Resetear primera visita
localStorage.removeItem('tidelabs_icon_positions'); // Resetear iconos
localStorage.removeItem('tidelabs_session'); // Cerrar sesión
```

### Forzar Easter Egg
```javascript
// Código Konami programático
const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
// Repetir secuencia: ↑ ↑ ↓ ↓ ← → ← → b a
```

---

## 📋 Checklist de Funcionalidades

### ✅ Implementado:
- [x] Iconos arrastrables con guardar posiciones
- [x] Minimizar/Maximizar/Cerrar ventanas
- [x] Barra de tareas funcional
- [x] Menú Iniciar completo
- [x] Apagar sistema con animación
- [x] Menú contextual (clic derecho)
- [x] Easter Egg (Código Konami)
- [x] Reloj en tiempo real
- [x] Z-index automático de ventanas
- [x] Persistencia de sesión
- [x] Primera visita con tutorial

### 🚀 Próximas Mejoras Posibles:
- [ ] Más códigos secretos
- [ ] Temas personalizables
- [ ] Fondos de pantalla cambiables
- [ ] Sonidos del sistema
- [ ] Widgets adicionales
- [ ] Dock/acceso rápido
- [ ] Atajos de teclado (Ctrl+Alt+Del)

---

## 🎯 Comandos del Sistema

### Teclado (Futuro)
- `Ctrl + Alt + T`: Abrir TUNOVA
- `Ctrl + Alt + C`: Abrir MSN.CHAT
- `Ctrl + Alt + H`: Abrir HELP
- `Alt + F4`: Cerrar ventana activa
- `Win + D`: Minimizar todas las ventanas

### Gestos (Futuro)
- **Triple Clic**: Abrir app secreta
- **Shake**: Reorganizar ventanas
- **Swipe**: Cambiar entre apps

---

## 💎 Filosofía del Sistema

### Sovering Code
- **Brutalismo Cinético**: Todo es funcional, directo
- **Nostalgia Sublime**: Win95 con poder Web3
- **Interactividad Total**: Cada elemento responde

### Detalles que Importan
- Iconos se pueden arrastrar (como Win95 real)
- Ventanas tienen z-index inteligente
- Barra de tareas refleja estado real
- Menús se cierran al hacer clic afuera
- Animaciones suaves pero rápidas

---

## 🏴‍☠️ ¡Descubre Más!

El Galeón está lleno de secretos. Explora cada rincón, prueba combinaciones, arrastra elementos... ¿Qué más encontrarás?

**Tip Final**: Algunos secretos solo se revelan a los verdaderos NAKAMAS. 👀

---

## 📞 Sistema de Ayuda

¿Perdido? Abre **HELP.TXT** desde:
- Doble clic en el icono del escritorio
- Menú Iniciar → HELP.TXT
- Clic derecho → Acerca de TIDElabs

---

**El Galeón espera. ¿Estás listo para navegar? 🏴‍☠️⚓**
