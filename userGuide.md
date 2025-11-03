# Guía de Usuario - Sovering Code Manifesto

## Descripción del Proyecto

**Sovering Code Manifesto** es una aplicación web interactiva desarrollada con React, Vite y TypeScript. El proyecto presenta una experiencia inmersiva con efectos visuales tipo CRT y una interfaz dividida que representa dos mundos conceptuales: RAZA y AZAR.

## Características Principales

### Pantalla de Inicio (SplitScreenPortal)
- **Pantalla dividida**: Lado izquierdo (RAZA) con estética minimalista blanca, lado derecho (AZAR) con estética oscura
- **RAZA**: "El Atelier • Orden • Brutalismo Elegante"
- **AZAR**: "El Mercado Negro • Caos • Generativo"
- **Botón central**: Acceso al sistema TIDElabs OS v1.0

### Componentes del Sistema
1. **CRTEffect**: Efecto visual de pantalla CRT retro
2. **WindowsStyleBootAnimation**: Animación de arranque estilo Windows
3. **BootSequence**: Secuencia de arranque del sistema
4. **TIDELabsDesktop**: Escritorio principal del sistema
5. **RazaAtelier**: Sección dedicada a RAZA
6. **AzarMercado**: Sección dedicada a AZAR (mercado)

## Tecnologías Utilizadas

- **React 18.3.1**: Framework de interfaz de usuario
- **Vite 6.3.5**: Herramienta de construcción y desarrollo
- **TypeScript**: Lenguaje de programación tipado
- **Radix UI**: Componentes de interfaz accesibles
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Iconos
- **Motion**: Animaciones

## Instalación y Ejecución

### Requisitos Previos
- Node.js (versión 20 o superior)
- pnpm (gestor de paquetes)

### Pasos para Ejecutar

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   pnpm run dev
   ```

3. **Construir para producción**:
   ```bash
   pnpm run build
   ```

## Estructura del Proyecto

```
sovering_code_manifesto/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes de UI (Radix)
│   │   ├── apps/            # Aplicaciones del sistema
│   │   ├── figma/           # Componentes de Figma
│   │   ├── AzarMercado.tsx
│   │   ├── BootSequence.tsx
│   │   ├── CRTEffect.tsx
│   │   ├── RazaAtelier.tsx
│   │   ├── SplitScreenPortal.tsx
│   │   ├── TIDELabsDesktop.tsx
│   │   └── WindowsStyleBootAnimation.tsx
│   ├── utils/               # Utilidades y API
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## URL de Acceso

El sitio está desplegado en:
**https://3000-ixzinafkzrfhcrod63ndr-bf354bd2.manusvm.computer**

## Notas Importantes

- El proyecto utiliza efectos visuales avanzados que pueden requerir un navegador moderno
- La aplicación está optimizada para experiencias de escritorio
- El sistema incluye integración con Supabase para funcionalidades backend

## Soporte y Contacto

Para más información sobre el diseño original, visita:
https://www.figma.com/design/H1L5m6c9D9k6UykLaWTjPx/Sovering-Code-Manifesto
