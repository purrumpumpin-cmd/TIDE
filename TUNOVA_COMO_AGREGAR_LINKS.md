# 🎵 TUNOVA.IO - Guía para Agregar Links de Música

## 📋 Resumen

TUNOVA.IO está completamente funcional con los 4 walkmans y sistema de likes. Solo necesitas agregar los links de las canciones para que los usuarios puedan escucharlas.

---

## 🎨 Colecciones Implementadas

### 1. VAH0M4N (1 track)
- **Rey de los Emprendedores** - Vah0m4n (3:45)

### 2. NAKAMAS CREW (12 tracks)
- **NAKAMAS CREW Génesis Vol.1 - Track 1** - Ecosistema TUNOVA (3:30)
- **NAKAMAS CREW Génesis Vol.1 - Track 2** - Ecosistema TUNOVA (3:45)
- **NAKAMAS CREW Génesis Vol.1 - Track 3** - Ecosistema TUNOVA (4:00)
- **NAKAMAS CREW Génesis Vol.1 - Track 4** - Ecosistema TUNOVA (3:20)
- **NAKAMAS CREW Génesis Vol.1 - Track 5** - Ecosistema TUNOVA (3:55)
- **NAKAMAS CREW Génesis Vol.1 - Track 6** - Ecosistema TUNOVA (4:10)
- **NAKAMAS CREW Génesis Vol.1 - Track 7** - Ecosistema TUNOVA (3:40)
- **NAKAMAS CREW Génesis Vol.1 - Track 8** - Ecosistema TUNOVA (3:25)
- **NAKAMAS CREW Génesis Vol.1 - Track 9** - Ecosistema TUNOVA (4:05)
- **NAKAMAS CREW Génesis Vol.1 - Track 10** - Ecosistema TUNOVA (3:50)
- **NAKAMAS CREW Génesis Vol.1 - Track 11** - Ecosistema TUNOVA (3:35)
- **NAKAMAS CREW Génesis Vol.1 - Track 12** - Ecosistema TUNOVA (4:15)

### 3. RAZA (1 track)
- **La Dualidad de Tunova - ORDEN** - RazAzaR (4:30)

### 4. AZAR (1 track)
- **La Dualidad de Tunova - CAOS** - RazAzaR (4:30)

---

## 🔧 Cómo Agregar los Links

### Paso 1: Abrir el archivo HTML

Abre el archivo `/home/ubuntu/sovering_code_manifesto/tunova_functional.html` en tu editor de código.

### Paso 2: Buscar la sección de datos

Busca la línea que dice `// Data structure for collections` (aproximadamente línea 360).

### Paso 3: Agregar los links

Reemplaza los campos `link: ''` con las URLs de las canciones. Ejemplos:

#### VAH0M4N
```javascript
vahoman: {
  name: 'VAH0M4N',
  tracks: [
    { 
      id: 'v1', 
      title: 'Rey de los Emprendedores', 
      artist: 'Vah0m4n', 
      duration: '3:45', 
      link: 'https://open.spotify.com/track/TU_TRACK_ID' // ← AGREGAR AQUÍ
    }
  ]
},
```

#### NAKAMAS CREW (Ejemplo para Track 1)
```javascript
nakamas: {
  name: 'NAKAMAS CREW',
  tracks: [
    { 
      id: 'n1', 
      title: 'NAKAMAS CREW Génesis Vol.1 - Track 1', 
      artist: 'Ecosistema TUNOVA', 
      duration: '3:30', 
      link: 'https://soundcloud.com/artista/track-1' // ← AGREGAR AQUÍ
    },
    // ... repetir para los otros 11 tracks
  ]
},
```

#### RAZA
```javascript
raza: {
  name: 'RAZA',
  tracks: [
    { 
      id: 'r1', 
      title: 'La Dualidad de Tunova - ORDEN', 
      artist: 'RazAzaR', 
      duration: '4:30', 
      link: 'https://audius.co/razazar/orden' // ← AGREGAR AQUÍ
    }
  ]
},
```

#### AZAR
```javascript
azar: {
  name: 'AZAR',
  tracks: [
    { 
      id: 'a1', 
      title: 'La Dualidad de Tunova - CAOS', 
      artist: 'RazAzaR', 
      duration: '4:30', 
      link: 'https://audius.co/razazar/caos' // ← AGREGAR AQUÍ
    }
  ]
}
```

### Paso 4: Guardar y recargar

1. Guarda el archivo
2. Copia el archivo actualizado al directorio build:
   ```bash
   cp /home/ubuntu/sovering_code_manifesto/tunova_functional.html /home/ubuntu/sovering_code_manifesto/build/
   ```
3. Recarga la página en el navegador

---

## 🎯 Tipos de Links Soportados

Puedes usar links de cualquier plataforma:

- **Spotify**: `https://open.spotify.com/track/ID`
- **SoundCloud**: `https://soundcloud.com/artista/track`
- **Audius**: `https://audius.co/artista/track`
- **YouTube**: `https://youtube.com/watch?v=ID`
- **Bandcamp**: `https://artista.bandcamp.com/track/nombre`
- **IPFS**: `https://ipfs.io/ipfs/HASH`
- **Cualquier URL directa a MP3/WAV**

---

## 💡 Consejos

### Para Spotify
1. Abre la canción en Spotify
2. Click derecho → Compartir → Copiar enlace de la canción
3. Pega el link en el campo `link`

### Para SoundCloud
1. Abre la canción en SoundCloud
2. Click en "Share" → Copia el link
3. Pega el link en el campo `link`

### Para Audius
1. Abre la canción en Audius
2. Copia la URL de la barra de direcciones
3. Pega el link en el campo `link`

---

## 🏆 Sistema de Likes

El sistema de likes ya está funcionando:

- Los usuarios pueden dar like a cualquier track
- Los likes se guardan en localStorage del navegador
- El ranking "TOP TRACKS - FINANCIAMIENTO PARA VIDEOCLIPS" se actualiza automáticamente
- Los tracks con más likes aparecen primero
- Los 3 primeros tienen medallas: 🥇 🥈 🥉

---

## 📊 Actualizar Nombres de Artistas (NAKAMAS CREW)

Cuando tengas los nombres de los artistas para NAKAMAS CREW, actualiza el campo `artist`:

```javascript
{ 
  id: 'n1', 
  title: 'NAKAMAS CREW Génesis Vol.1 - Track 1', 
  artist: 'Nombre del Artista Real', // ← CAMBIAR AQUÍ
  duration: '3:30', 
  link: 'https://...'
}
```

---

## 🚀 Resultado Final

Una vez agregados todos los links:

1. Los usuarios podrán hacer clic en "🎵 Escuchar Ahora" en cada casete
2. Se abrirá el link en una nueva pestaña
3. Podrán dar like a sus tracks favoritos
4. Los más votados aparecerán en el ranking de financiamiento

---

## 📝 Plantilla Rápida

Copia esta plantilla para organizar tus links antes de agregarlos:

```
VAH0M4N:
- Rey de los Emprendedores: [LINK AQUÍ]

NAKAMAS CREW:
- Track 1: [LINK AQUÍ]
- Track 2: [LINK AQUÍ]
- Track 3: [LINK AQUÍ]
- Track 4: [LINK AQUÍ]
- Track 5: [LINK AQUÍ]
- Track 6: [LINK AQUÍ]
- Track 7: [LINK AQUÍ]
- Track 8: [LINK AQUÍ]
- Track 9: [LINK AQUÍ]
- Track 10: [LINK AQUÍ]
- Track 11: [LINK AQUÍ]
- Track 12: [LINK AQUÍ]

RAZA:
- La Dualidad de Tunova - ORDEN: [LINK AQUÍ]

AZAR:
- La Dualidad de Tunova - CAOS: [LINK AQUÍ]
```

---

## ⏱️ Tiempo Estimado

- **Agregar 1 link**: 30 segundos
- **Agregar 15 links totales**: ~10 minutos
- **Probar todo**: 5 minutos

**Total**: 15 minutos aproximadamente

---

¡Listo! Una vez agregues los links, TUNOVA.IO estará completamente funcional para que los usuarios escuchen música y voten por sus tracks favoritos. 🎵🏴‍☠️
