/**
 * TIDElabs - WAITLIST.SH
 * Sistema de waitlist para futuros lanzamientos
 */

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function WaitlistApp() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus("error");
      setMessage("Por favor, ingresa un email válido");
      return;
    }

    setStatus("loading");
    
    // Simulación de envío
    setTimeout(() => {
      setStatus("success");
      setMessage("¡Te has unido al Galeón! Revisa tu email.");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <h2 className="font-brutalist tracking-wider">WAITLIST.SH</h2>
        <p className="text-xs mt-1">Únete a la Lista de Espera</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-[var(--color-raza-accent)] mx-auto mb-4 flex items-center justify-center">
              <Mail size={40} className="text-black" />
            </div>
            <h3 className="text-2xl font-brutalist mb-2">Próximos Lanzamientos</h3>
            <p className="text-sm text-[var(--color-raza-gray)] leading-relaxed">
              Sé el primero en enterarte de nuevos productos, drops exclusivos y eventos
              especiales del ecosistema TIDElabs.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 font-brutalist">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full win95-bevel-in p-3 font-win95 text-sm"
                disabled={status === "loading" || status === "success"}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full win95-bevel-out bg-[var(--color-win95-face)] py-3 font-brutalist hover:win95-bevel-in active:win95-bevel-in disabled:opacity-50"
            >
              {status === "loading" ? "Procesando..." : "[UNIRSE A LA LISTA]"}
            </button>
          </form>

          {/* Status Messages */}
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 win95-bevel-out bg-[var(--color-raza-accent)] p-4 flex items-start gap-3"
              >
                <CheckCircle size={20} className="text-black flex-shrink-0 mt-0.5" />
                <p className="text-sm text-black">{message}</p>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 win95-bevel-out bg-red-200 p-4 flex items-start gap-3"
              >
                <AlertCircle size={20} className="text-red-800 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Benefits */}
          <div className="mt-8 win95-bevel-in bg-[#F0F0F0] p-4">
            <h4 className="font-brutalist text-sm mb-3">BENEFICIOS</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-raza-accent)]">▸</span>
                <span>Early access a nuevos productos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-raza-accent)]">▸</span>
                <span>Descuentos exclusivos para miembros de la lista</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-raza-accent)]">▸</span>
                <span>Invitaciones a eventos virtuales y drops especiales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-raza-accent)]">▸</span>
                <span>Newsletter mensual con contenido detrás de escenas</span>
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-[var(--color-raza-gray)] text-center mt-6">
            Respetamos tu privacidad. Sin spam, solo contenido valioso.
          </p>
        </div>
      </div>
    </div>
  );
}
