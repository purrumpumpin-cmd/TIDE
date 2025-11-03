# Resumen Técnico - Sovering Code Manifesto

## Información General del Proyecto

El proyecto **Sovering Code Manifesto** es una aplicación web interactiva desarrollada con tecnologías modernas de frontend. Se trata de una experiencia inmersiva que presenta dos mundos conceptuales (RAZA y AZAR) con efectos visuales avanzados y una interfaz de usuario sofisticada.

## Arquitectura del Proyecto

La aplicación está construida sobre **React 18.3.1** utilizando **Vite 6.3.5** como herramienta de construcción y desarrollo. El proyecto utiliza **TypeScript** para proporcionar tipado estático y mejorar la mantenibilidad del código. La arquitectura sigue un patrón de componentes modulares con una clara separación de responsabilidades.

## Componentes Principales

El sistema cuenta con **73 componentes TypeScript** distribuidos en diferentes categorías. Los componentes principales incluyen el portal de entrada con pantalla dividida, secuencias de animación de arranque estilo Windows, un escritorio interactivo tipo sistema operativo, y secciones dedicadas para RAZA (El Atelier) y AZAR (El Mercado Negro). Además, se implementa un efecto visual CRT que proporciona una estética retro a toda la aplicación.

## Tecnologías y Librerías

El proyecto utiliza **Radix UI** como base para los componentes de interfaz de usuario, garantizando accesibilidad y funcionalidad robusta. Para los estilos se emplea **Tailwind CSS v4.1.3**, permitiendo un desarrollo rápido y consistente. Las animaciones se gestionan con la librería **Motion**, mientras que los iconos provienen de **Lucide React**. Para la gestión de formularios se utiliza **React Hook Form**, y para visualizaciones de datos se incluye **Recharts**.

## Configuración del Servidor

El servidor de desarrollo está configurado para ejecutarse en el **puerto 3000** y escuchar en todas las interfaces de red mediante la configuración `host: 0.0.0.0`. Se ha implementado una lista de hosts permitidos para garantizar la seguridad y el correcto funcionamiento con proxies externos. El servidor utiliza **Hot Module Replacement (HMR)** para proporcionar una experiencia de desarrollo fluida con recarga instantánea de cambios.

## Integración Backend

El proyecto incluye integración con **Supabase** para funcionalidades backend, permitiendo gestión de datos y autenticación de usuarios. Se implementa un sistema de sesiones con almacenamiento local y un API de productos con funcionalidad de inicialización (seed) automática.

## Estado Actual del Despliegue

El servidor de desarrollo está activo y funcionando correctamente en el puerto 3000. La aplicación es accesible públicamente a través del dominio proxy configurado. Todos los componentes principales han sido verificados y están operativos. El sistema de construcción está optimizado para desarrollo con tiempos de inicio rápidos (aproximadamente 160ms).

## Estructura de Directorios

El código fuente se organiza en el directorio `src` con subdirectorios para componentes de UI (basados en Radix), aplicaciones del sistema, componentes de Figma, y utilidades. Los archivos de configuración incluyen `vite.config.ts` para Vite, `tsconfig.json` para TypeScript, y archivos de gestión de dependencias con pnpm.

## Optimizaciones Implementadas

Se ha configurado el objetivo de construcción como `esnext` para aprovechar las características más modernas de JavaScript. El directorio de salida para producción está configurado como `build`. Se han establecido alias de módulos para simplificar las importaciones y mejorar la experiencia de desarrollo. La configuración de TypeScript incluye verificaciones estrictas y optimizaciones para el rendimiento.

## Próximos Pasos

El proyecto está listo para recibir mejoras iterativas según los requisitos del usuario. La arquitectura modular facilita la adición de nuevas funcionalidades y la modificación de componentes existentes sin afectar el resto del sistema.
