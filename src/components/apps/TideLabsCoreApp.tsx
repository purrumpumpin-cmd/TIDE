/**
 * TIDElabs - TIDELABS.CORE
 * Información del proyecto y manifiesto
 */

import { BookOpen, Users, Target, Zap } from "lucide-react";
import { motion } from "motion/react";

export function TideLabsCoreApp() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white font-win95 overflow-auto">
      {/* Header */}
      <div className="bg-[var(--color-raza-accent)] text-black p-4 win95-bevel-out sticky top-0 z-10">
        <h2 className="font-brutalist tracking-wider text-xl">TIDELABS.CORE</h2>
        <p className="text-xs mt-1">El Manifiesto del The Aetherius</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-5xl font-brutalist mb-4 neon-glow">
            TIDElabs
          </h1>
          <p className="text-xl text-[var(--color-raza-accent)] font-brutalist mb-2">
            Devolviendo el Alma a la Tecnología
          </p>
          <p className="text-sm text-[var(--color-raza-gray)] max-w-2xl mx-auto">
            Un ecosistema digital donde cada píxel tiene intención y cada línea de código
            resuena con gloria mítica.
          </p>
        </motion.div>

        {/* Mission Blocks */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="win95-bevel-out bg-[var(--color-win95-face)] p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[var(--color-raza-accent)] flex items-center justify-center">
                <Target size={20} className="text-black" />
              </div>
              <h3 className="font-brutalist text-black">MISIÓN</h3>
            </div>
            <p className="text-sm text-black leading-relaxed">
              Crear experiencias digitales que fusionen la nostalgia analógica con la
              innovación Web3, construyendo un ecosistema donde arte, tecnología y comunidad
              convergen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="win95-bevel-out bg-[var(--color-win95-face)] p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[var(--color-azar-cyan)] flex items-center justify-center">
                <Zap size={20} className="text-black" />
              </div>
              <h3 className="font-brutalist text-black">VISIÓN</h3>
            </div>
            <p className="text-sm text-black leading-relaxed">
              Un futuro donde la tecnología no es fría y corporativa, sino cálida y mítica.
              Donde cada usuario es un nakama, un compañero en la odisea digital.
            </p>
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="win95-bevel-in bg-black p-6 border-2 border-[var(--color-raza-accent)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={24} className="text-[var(--color-raza-accent)]" />
            <h3 className="font-brutalist text-xl">LA FILOSOFÍA</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-brutalist text-[var(--color-raza-accent)] mb-2">
                Retro-Kaidoku (解読)
              </h4>
              <p className="text-[var(--color-raza-gray)] leading-relaxed">
                Un sistema visual que fusiona la nostalgia analógica (manga 80s/90s, ciberpunk)
                con la estética digital contemporánea. Cada obra se siente como un artefacto
                recuperado de un futuro olvidado.
              </p>
            </div>
            <div>
              <h4 className="font-brutalist text-[var(--color-raza-accent)] mb-2">
                Brutalismo Cinético
              </h4>
              <p className="text-[var(--color-raza-gray)] leading-relaxed">
                La unión del Brutalismo Web (estructura honesta, función sobre forma) con la
                Cinética Digital (movimiento narrativo, experiencias WebGL). No creamos webs
                retro; creamos webs modernas con textura nostálgica.
              </p>
            </div>
            <div>
              <h4 className="font-brutalist text-[var(--color-raza-accent)] mb-2">
                La Dualidad: RAZA y AZAR
              </h4>
              <p className="text-[var(--color-raza-gray)] leading-relaxed">
                <strong>RAZA (Orden):</strong> Precisión, líneas limpias, belleza de
                ingeniería. <br />
                <strong>AZAR (Caos):</strong> Imperfección, glitch estético, belleza de
                entropía.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="win95-bevel-out bg-[var(--color-win95-face)] p-4 text-center">
            <Users size={32} className="mx-auto mb-2 text-black" />
            <p className="text-2xl font-brutalist text-black">∞</p>
            <p className="text-xs text-black mt-1">Nakamas</p>
          </div>
          <div className="win95-bevel-out bg-[var(--color-win95-face)] p-4 text-center">
            <Target size={32} className="mx-auto mb-2 text-black" />
            <p className="text-2xl font-brutalist text-black">100</p>
            <p className="text-xs text-black mt-1">ETH Goal</p>
          </div>
          <div className="win95-bevel-out bg-[var(--color-win95-face)] p-4 text-center">
            <Zap size={32} className="mx-auto mb-2 text-black" />
            <p className="text-2xl font-brutalist text-black">v1.0</p>
            <p className="text-xs text-black mt-1">Genesis</p>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8"
        >
          <p className="text-lg font-brutalist text-[var(--color-raza-accent)] mb-2">
            "No construimos componentes; forjamos artefactos."
          </p>
          <p className="text-sm text-[var(--color-raza-gray)]">
            — Sovering Code
          </p>
        </motion.div>
      </div>
    </div>
  );
}
