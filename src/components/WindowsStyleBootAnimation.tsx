/**
 * TIDElabs - Animación de Arranque Estilo Windows
 * La bandera pirata ondeando
 */

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface WindowsStyleBootAnimationProps {
  onComplete: () => void;
}

export function WindowsStyleBootAnimation({ onComplete }: WindowsStyleBootAnimationProps) {
  const [phase, setPhase] = useState<"waving" | "glow" | "complete">("waving");

  useEffect(() => {
    // Fase de ondear: 2.5 segundos
    const waveTimer = setTimeout(() => {
      setPhase("glow");
    }, 2500);

    // Fase de glow: 1 segundo
    const glowTimer = setTimeout(() => {
      setPhase("complete");
    }, 3500);

    // Completar: 0.5 segundos después del glow
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(waveTimer);
      clearTimeout(glowTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Efecto de fondo tipo CRT */}
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(0,255,0,0.03)] to-transparent" />
      
      {/* Grid de la bandera - 4 cuadrantes como Windows */}
      <div className="relative w-[400px] h-[400px]">
        {/* Cuadrante Superior Izquierdo - RAZA Blanco */}
        <motion.div
          className="absolute top-0 left-0 w-[190px] h-[190px] origin-bottom-right"
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{
            rotateY: phase === "waving" ? [0, -15, 0, -10, 0] : 0,
            opacity: 1,
            scale: phase === "glow" ? 1.05 : 1,
          }}
          transition={{
            rotateY: {
              duration: 2,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeInOut",
            },
            opacity: { duration: 0.3 },
            scale: { duration: 0.5 },
          }}
          style={{
            perspective: 1000,
          }}
        >
          <div className="w-full h-full bg-white border-4 border-[var(--color-raza-accent)] flex items-center justify-center relative overflow-hidden">
            {/* Tiburón Superior Izquierdo - Aleta */}
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <path
                d="M20,60 L30,30 L50,40 L40,70 Z"
                fill="var(--color-raza-accent)"
                className={phase === "glow" ? "neon-glow" : ""}
              />
            </svg>
            {phase === "glow" && (
              <div className="absolute inset-0 bg-[var(--color-raza-accent)] opacity-20 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Cuadrante Superior Derecho - AZAR Negro/Magenta */}
        <motion.div
          className="absolute top-0 right-0 w-[190px] h-[190px] origin-bottom-left"
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{
            rotateY: phase === "waving" ? [0, 15, 0, 10, 0] : 0,
            opacity: 1,
            scale: phase === "glow" ? 1.05 : 1,
          }}
          transition={{
            rotateY: {
              duration: 2,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeInOut",
            },
            opacity: { duration: 0.3, delay: 0.1 },
            scale: { duration: 0.5 },
          }}
          style={{
            perspective: 1000,
          }}
        >
          <div className="w-full h-full bg-black border-4 border-[var(--color-azar-magenta)] flex items-center justify-center relative overflow-hidden glitch-text">
            {/* Tiburón Superior Derecho - Cabeza */}
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="var(--color-azar-magenta)"
                className={phase === "glow" ? "neon-glow" : ""}
              />
              <circle cx="45" cy="45" r="5" fill="white" />
            </svg>
            {phase === "glow" && (
              <div className="absolute inset-0 bg-[var(--color-azar-magenta)] opacity-20 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Cuadrante Inferior Izquierdo - AZAR Cyan */}
        <motion.div
          className="absolute bottom-0 left-0 w-[190px] h-[190px] origin-top-right"
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{
            rotateY: phase === "waving" ? [0, -15, 0, -10, 0] : 0,
            opacity: 1,
            scale: phase === "glow" ? 1.05 : 1,
          }}
          transition={{
            rotateY: {
              duration: 2,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeInOut",
            },
            opacity: { duration: 0.3, delay: 0.2 },
            scale: { duration: 0.5 },
          }}
          style={{
            perspective: 1000,
          }}
        >
          <div className="w-full h-full bg-black border-4 border-[var(--color-azar-cyan)] flex items-center justify-center relative overflow-hidden">
            {/* Tiburón Inferior Izquierdo - Cola */}
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <path
                d="M30,50 L50,20 L60,30 L70,50 L50,70 Z"
                fill="var(--color-azar-cyan)"
                className={phase === "glow" ? "neon-glow" : ""}
              />
            </svg>
            {phase === "glow" && (
              <div className="absolute inset-0 bg-[var(--color-azar-cyan)] opacity-20 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Cuadrante Inferior Derecho - RAZA Verde */}
        <motion.div
          className="absolute bottom-0 right-0 w-[190px] h-[190px] origin-top-left"
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{
            rotateY: phase === "waving" ? [0, 15, 0, 10, 0] : 0,
            opacity: 1,
            scale: phase === "glow" ? 1.05 : 1,
          }}
          transition={{
            rotateY: {
              duration: 2,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeInOut",
            },
            opacity: { duration: 0.3, delay: 0.15 },
            scale: { duration: 0.5 },
          }}
          style={{
            perspective: 1000,
          }}
        >
          <div className="w-full h-full bg-white border-4 border-[var(--color-raza-accent)] flex items-center justify-center relative overflow-hidden">
            {/* Tiburón Inferior Derecho - Cuerpo */}
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <ellipse
                cx="50"
                cy="50"
                rx="35"
                ry="20"
                fill="var(--color-raza-accent)"
                className={phase === "glow" ? "neon-glow" : ""}
              />
            </svg>
            {phase === "glow" && (
              <div className="absolute inset-0 bg-[var(--color-raza-accent)] opacity-20 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Logo central - Aparece al final */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: phase === "glow" ? 1 : 0,
            scale: phase === "glow" ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black border-4 border-[var(--color-raza-accent)] px-6 py-4 rounded-lg shadow-[0_0_30px_var(--color-raza-accent)]">
            <h1 className="text-[var(--color-raza-accent)] font-brutalist neon-glow tracking-wider text-2xl">
              TIDElabs
            </h1>
            <p className="text-[var(--color-azar-cyan)] font-win95 text-xs text-center mt-1">
              Sovering Code
            </p>
          </div>
        </motion.div>
      </div>

      {/* Texto de carga debajo */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p className="text-[var(--color-raza-gray)] font-win95 text-sm text-center">
          Iniciando el Galeón Digital...
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <motion.span
            className="text-[var(--color-raza-accent)]"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            ⚓
          </motion.span>
          <motion.span
            className="text-[var(--color-azar-cyan)]"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }}
          >
            🏴‍☠️
          </motion.span>
          <motion.span
            className="text-[var(--color-azar-magenta)]"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }}
          >
            ⚡
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
