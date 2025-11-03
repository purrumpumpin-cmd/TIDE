/**
 * TIDElabs - Secuencia de Arranque Pirata
 * "Izar las velas del The Aetherius Digital"
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BootSequenceProps {
  onComplete: () => void;
}

const SHARK_FLAG_URL = "/assets/shark_flag.png";
const BOOT_STAGES = [
  {
    phase: "BIOS",
    messages: [
      "TIDELABS BIOS v3.14159 (C) 2025 Sovering Code",
      "CPU: Web3-Core @ 2.5GHz | RAM: 256MB Blockchain Memory",
      "Checking NVRAM... OK",
      "Initializing Pirate Protocol... OK",
    ],
    delay: 400,
  },
  {
    phase: "POST",
    messages: [
      "",
      "⚓ POST: Power-On Self Test",
      "Testing Smart Contracts............. [ OK ]",
      "Testing SIWE Auth Module............ [ OK ]",
      "Testing Wallet Connection........... [ OK ]",
      "Testing Supabase Backend............ [ OK ]",
      "Testing RAZA/AZAR Portals........... [ OK ]",
    ],
    delay: 300,
  },
  {
    phase: "LOADING",
    messages: [
      "",
      "🏴‍☠️ Izando las velas del The Aetherius Digital...",
      "Loading RAZA.sys [Brutalismo Elegante]",
      "Loading AZAR.sys [Caos Generativo]",
      "Loading NAKAMA.chat [Sistema de Tripulación]",
      "Loading CROWDFUND.web3 [Tesoro Compartido]",
      "",
    ],
    delay: 250,
  },
  {
    phase: "FLAG",
    messages: [
      "",
      "🏴‍☠️ Bandera del The Aetherius Digital izada...",
      "Sovering Code Manifesto",
      "",
    ],
    delay: 800,
  },
  {
    phase: "WELCOME",
    messages: [
      "⚡ Sistema operativo cargado exitosamente",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  TIDElabs OS v1.0 - Sovering Code Edition",
      "  'El código es ley, la libertad es eterna'",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "Bienvenido al The Aetherius Digital, Nakama...",
    ],
    delay: 400,
  },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStage >= BOOT_STAGES.length) {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(finalTimer);
    }

    const stage = BOOT_STAGES[currentStage];

    if (currentLine < stage.messages.length) {
      const timer = setTimeout(() => {
        setDisplayedMessages([...displayedMessages, stage.messages[currentLine]]);
        setCurrentLine(currentLine + 1);
        
        // Update progress
        const totalLines = BOOT_STAGES.reduce((sum, s) => sum + s.messages.length, 0);
        const currentTotal = BOOT_STAGES.slice(0, currentStage).reduce((sum, s) => sum + s.messages.length, 0) + currentLine + 1;
        setProgress((currentTotal / totalLines) * 100);
      }, stage.delay);

      return () => clearTimeout(timer);
    } else {
      const stageTimer = setTimeout(() => {
        setCurrentStage(currentStage + 1);
        setCurrentLine(0);
      }, stage.delay);

      return () => clearTimeout(stageTimer);
    }
  }, [currentStage, currentLine, displayedMessages, onComplete]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col p-8 overflow-hidden relative">
      {/* CRT Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,255,0,0.03)] to-transparent animate-scan" />
        <div className="absolute inset-0" style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px)",
        }} />
      </div>

      {/* Header */}
      <div className="mb-6 border-b border-[var(--color-raza-accent)] pb-2">
        <p className="text-[var(--color-raza-accent)] font-win95 text-xs">
          TIDELABS BOOT LOADER v1.0
        </p>
      </div>

      {/* Boot Messages */}
      <div className="flex-1 overflow-auto font-win95 text-sm space-y-1">
        <AnimatePresence>
          {displayedMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`${
                message.includes("OK") || message.includes("✓")
                  ? "text-[var(--color-raza-accent)]"
                  : message.includes("⚓") || message.includes("🏴‍☠️") || message.includes("⚡")
                  ? "text-[var(--color-azar-cyan)]"
                  : message.includes("━") || message.includes("GALEÓN")
                  ? "text-[var(--color-raza-accent)] neon-glow"
                  : message === ""
                  ? ""
                  : "text-[var(--color-raza-gray)]"
              }`}
              style={{ whiteSpace: "pre" }}
            >
              {message || "\u00A0"}
            </motion.div>
          ))}
          {/* Integración de la imagen de la bandera en la fase final */}
          {currentStage === BOOT_STAGES.findIndex(s => s.phase === "FLAG") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex justify-center my-8"
            >
              <img 
                src={SHARK_FLAG_URL} 
                alt="Bandera del The Aetherius Digital" 
                className="w-48 h-48 filter invert sepia hue-rotate-100 saturate-200 contrast-200" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cursor parpadeante */}
        {currentStage < BOOT_STAGES.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="text-[var(--color-raza-accent)]"
          >
            █
          </motion.span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 border-t border-[var(--color-raza-accent)] pt-4">
        <div className="flex items-center gap-3">
          <span className="text-[var(--color-raza-gray)] font-win95 text-xs">
            LOADING:
          </span>
          <div className="flex-1 h-4 border border-[var(--color-raza-accent)] bg-black relative overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-raza-accent)] relative"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </motion.div>
          </div>
          <span className="text-[var(--color-raza-accent)] font-win95 text-xs w-12 text-right">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
