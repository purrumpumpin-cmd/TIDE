/**
 * TIDElabs - RAZA.AZAR Portal
 * Portal a los subdominios de comercio
 */

import { ExternalLink, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface RazaAzarPortalAppProps {
  onNavigateRaza?: () => void;
  onNavigateAzar?: () => void;
}

export function RazaAzarPortalApp({
  onNavigateRaza,
  onNavigateAzar,
}: RazaAzarPortalAppProps) {
  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <h2 className="font-brutalist tracking-wider">RAZA.AZAR</h2>
        <p className="text-xs mt-1">Portal de Comercio TIDElabs</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-4">
        {/* RAZA Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="win95-bevel-out bg-white p-6 cursor-pointer"
          onClick={onNavigateRaza}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <ShoppingBag size={24} className="text-[var(--color-raza-accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-brutalist text-lg mb-2 flex items-center gap-2">
                RAZA - El Atelier
                <ExternalLink size={16} />
              </h3>
              <p className="text-sm text-[var(--color-raza-gray)] mb-3">
                Brutalismo Elegante. Productos curados con precisión. Experiencia de compra
                ordenada y directa.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-black text-white font-brutalist">
                  ORDEN
                </span>
                <span className="text-xs px-2 py-1 bg-[var(--color-raza-accent)] text-black font-brutalist">
                  LIMPIO
                </span>
                <span className="text-xs px-2 py-1 bg-white border border-black text-black font-brutalist">
                  PRECISO
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AZAR Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="win95-bevel-out bg-black p-6 cursor-pointer border-2 border-[var(--color-azar-magenta)]"
          onClick={onNavigateAzar}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white flex items-center justify-center">
              <Sparkles size={24} className="text-[var(--color-azar-magenta)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-brutalist text-lg mb-2 flex items-center gap-2 text-white glitch-text">
                AZAR - El Mercado Negro
                <ExternalLink size={16} />
              </h3>
              <p className="text-sm text-[var(--color-azar-cyan)] mb-3">
                Caos Generativo. Experiencia experimental. Los productos te encuentran a ti. Un
                laberinto digital de descubrimiento.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--color-azar-magenta)] text-black font-brutalist">
                  CAOS
                </span>
                <span className="text-xs px-2 py-1 bg-[var(--color-azar-cyan)] text-black font-brutalist">
                  GLITCH
                </span>
                <span className="text-xs px-2 py-1 bg-white text-black font-brutalist">
                  SORPRESA
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <div className="win95-bevel-in bg-[#F0F0F0] p-4">
          <p className="text-xs text-[var(--color-raza-gray)]">
            <strong className="font-brutalist">Nota:</strong> Tu sesión se mantiene activa entre
            dominios. Una vez autenticado aquí, estarás automáticamente autenticado en RAZA y
            AZAR.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t-2 border-[var(--color-raza-gray)] text-center">
        <p className="text-xs text-[var(--color-raza-gray)] font-brutalist">
          La Sesión Soberana está activa
        </p>
      </div>
    </div>
  );
}
