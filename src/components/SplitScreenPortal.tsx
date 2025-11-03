/**
 * TIDElabs - El Portal de Bienvenida
 * La bifurcación hacia RAZA o AZAR
 */

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface SplitScreenPortalProps {
  onSelectRaza: () => void;
  onSelectAzar: () => void;
  onEnterGaleon: () => void;
}

export function SplitScreenPortal({
  onSelectRaza,
  onSelectAzar,
  onEnterGaleon,
}: SplitScreenPortalProps) {
  return (
    <div className="w-screen h-screen flex relative overflow-hidden bg-black">
      {/* RAZA Side - El Orden */}
      <motion.div
        className="w-1/2 h-full relative group cursor-pointer"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
        onClick={onSelectRaza}
      >
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <div className="text-center space-y-8">
            <motion.h1
              className="text-[120px] tracking-tighter text-black font-brutalist"
              whileHover={{ scale: 1.1 }}
            >
              RAZA
            </motion.h1>
            <p className="text-black font-win95 uppercase tracking-widest">
              El Atelier • Orden • Brutalismo Elegante
            </p>
            <div className="flex items-center justify-center gap-2 text-[var(--color-raza-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-brutalist">Entrar</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 border-r-4 border-[var(--color-raza-accent)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>

      {/* AZAR Side - El Caos */}
      <motion.div
        className="w-1/2 h-full relative group cursor-pointer"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
        onClick={onSelectAzar}
      >
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center space-y-8">
            <motion.h1
              className="text-[120px] tracking-tighter text-white font-brutalist glitch-text"
              whileHover={{ scale: 1.1 }}
            >
              AZAR
            </motion.h1>
            <p className="text-[var(--color-azar-cyan)] font-win95 uppercase tracking-widest">
              El Mercado Negro • Caos • Generativo
            </p>
            <div className="flex items-center justify-center gap-2 text-[var(--color-azar-magenta)] opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-brutalist">Entrar</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 border-l-4 border-[var(--color-azar-magenta)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>

      {/* Línea divisoria central */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-raza-accent)] transform -translate-x-1/2" />

      {/* Logo central flotante - enlaza al The Aetherius */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ scale: 1.1 }}
        onClick={onEnterGaleon}
      >
        <motion.button
          className="relative group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Botón de Encendido Retro */}
          <div className="relative w-24 h-24">
            {/* Base del botón (hundida) */}
            <div className="absolute inset-0 rounded-full bg-[#C0C0C0] shadow-[inset_0_2px_2px_#808080,inset_0_-2px_2px_#FFFFFF] border-2 border-[#808080]" />
            
            {/* Botón pulsable (elevado) */}
            <motion.div
              className="absolute inset-2 rounded-full bg-[#E0E0E0] shadow-[0_2px_2px_#808080,inset_0_2px_2px_#FFFFFF,inset_0_-2px_2px_#808080] flex items-center justify-center"
              whileTap={{ 
                scale: 0.95, 
                boxShadow: "inset 0 2px 2px #808080, inset 0 -2px 2px #FFFFFF" 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Símbolo de Power */}
              <div className="w-10 h-10 border-4 border-[#FF0000] rounded-full flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-[#FF0000]" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-[#FF0000] rounded-full" style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} />
              </div>
            </motion.div>
            
            {/* LED de Encendido (verde) */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14] animate-pulse" />
          </div>
          
          {/* Texto debajo del botón */}
          <div className="mt-3 text-center">
            <p className="text-[#FF0000] font-brutalist text-sm neon-glow group-hover:text-[#FF0000] transition-colors tracking-wider">
              POWER ON
            </p>
            <p className="text-[var(--color-raza-gray)] font-win95 text-[10px] mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
              TIDElabs OS v1.0
            </p>
          </div>
        </motion.button>
      </motion.div>

      {/* Instrucciones en la parte inferior */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p className="text-[var(--color-raza-gray)] font-brutalist text-sm">
          Elige tu camino o ingresa al Santuario
        </p>
      </motion.div>
    </div>
  );
}
