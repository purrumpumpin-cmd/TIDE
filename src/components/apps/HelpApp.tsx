/**
 * TIDElabs - HELP.TXT
 * Guía de uso del Galeón Digital
 */

import { HelpCircle, Zap, ShoppingBag, MessageSquare, Wallet } from "lucide-react";
import { motion } from "motion/react";

export function HelpApp() {
  return (
    <div className="h-full flex flex-col bg-white font-win95 overflow-auto">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out sticky top-0 z-10">
        <h2 className="font-brutalist tracking-wider">HELP.TXT</h2>
        <p className="text-xs mt-1">Guía del Galeón Digital</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <HelpCircle size={48} className="mx-auto mb-4 text-[var(--color-raza-accent)]" />
          <h3 className="text-2xl font-brutalist mb-2">Bienvenido a TIDElabs</h3>
          <p className="text-sm text-[var(--color-raza-gray)]">
            Un ecosistema digital donde el arte, la tecnología y la comunidad convergen.
          </p>
        </motion.div>

        {/* Secciones de ayuda */}
        <div className="space-y-4">
          <HelpSection
            icon={<Wallet size={24} />}
            title="1. Conecta tu Wallet"
            description="Haz clic en '[Conectar Alma]' en la barra de tareas inferior. Necesitarás MetaMask u otro wallet compatible con Web3."
          />

          <HelpSection
            icon={<Zap size={24} />}
            title="2. Únete como Nakama"
            description="Abre CROWDFUND.WEB3 y elige tu tier (Grumete, Marinero o Capitán). Tu contribución desbloquea beneficios exclusivos."
          />

          <HelpSection
            icon={<MessageSquare size={24} />}
            title="3. Accede al Chat"
            description="Una vez que eres Nakama, MSN.CHAT se activa. Conecta con otros miembros de la tripulación en tiempo real."
          />

          <HelpSection
            icon={<ShoppingBag size={24} />}
            title="4. Explora RAZA y AZAR"
            description="Usa el portal RAZA.AZAR para navegar entre las dos tiendas. RAZA es orden y precisión; AZAR es caos y sorpresa."
          />
        </div>

        {/* Aplicaciones */}
        <div className="win95-bevel-in bg-[#F0F0F0] p-4">
          <h4 className="font-brutalist mb-3">APLICACIONES DISPONIBLES</h4>
          <ul className="space-y-2 text-sm">
            <li><strong>TIDELABS.CORE:</strong> Información sobre el proyecto y filosofía</li>
            <li><strong>CROWDFUND.WEB3:</strong> Sistema de crowdfunding y tiers de Nakama</li>
            <li><strong>MSN.CHAT:</strong> Chat exclusivo para miembros (requiere tier)</li>
            <li><strong>EXPLORER.EXE:</strong> Visualiza tus NFTs y activos</li>
            <li><strong>TUNOVA.IO:</strong> Reproductor de música con NFT-gating</li>
            <li><strong>WAITLIST.SH:</strong> Únete a la lista para futuros lanzamientos</li>
            <li><strong>RAZA.AZAR:</strong> Portal a las tiendas de comercio</li>
          </ul>
        </div>

        {/* Atajos de teclado */}
        <div className="win95-bevel-in bg-[#F0F0F0] p-4">
          <h4 className="font-brutalist mb-3">CONTROLES</h4>
          <ul className="space-y-2 text-sm">
            <li><strong>Doble clic en icono:</strong> Abre una aplicación desde el escritorio</li>
            <li><strong>Arrastrar icono:</strong> Mueve iconos libremente (¡se guardan!)</li>
            <li><strong>Arrastrar ventana:</strong> Mueve ventanas por el escritorio</li>
            <li><strong>Clic derecho:</strong> Menú contextual con opciones</li>
            <li><strong>Menú Iniciar:</strong> Acceso rápido a todas las apps</li>
            <li><strong>Minimizar (─):</strong> Envía la ventana a la barra de tareas</li>
            <li><strong>Maximizar (□):</strong> Expande la ventana a pantalla completa</li>
            <li><strong>Cerrar (✕):</strong> Cierra la ventana activa</li>
            <li><strong>Apagar Sistema:</strong> Vuelve a la pantalla principal</li>
          </ul>
        </div>

        {/* Secretos */}
        <div className="win95-bevel-in bg-gradient-to-r from-purple-900 to-pink-900 text-white p-4">
          <h4 className="font-brutalist mb-3">🏴‍☠️ SECRETOS DEL GALEÓN</h4>
          <ul className="space-y-2 text-sm">
            <li><strong>Código Konami:</strong> ↑ ↑ ↓ ↓ ← → ← → B A para desbloquear sorpresa</li>
            <li><strong>Reorganizar Iconos:</strong> Clic derecho → Reorganizar Iconos</li>
            <li><strong>Barra de Tareas:</strong> Clic en apps minimizadas para restaurar</li>
            <li><strong>Reloj en Tiempo Real:</strong> Se actualiza automáticamente</li>
          </ul>
        </div>

        {/* RAZA vs AZAR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="win95-bevel-out bg-white p-4">
            <h4 className="font-brutalist mb-2 text-center">RAZA</h4>
            <p className="text-xs mb-3 text-center text-[var(--color-raza-gray)]">
              El Orden
            </p>
            <ul className="space-y-1 text-xs">
              <li>• Productos curados</li>
              <li>• Navegación limpia</li>
              <li>• Brutalismo elegante</li>
              <li>• Experiencia directa</li>
            </ul>
          </div>

          <div className="win95-bevel-out bg-black text-white p-4">
            <h4 className="font-brutalist mb-2 text-center">AZAR</h4>
            <p className="text-xs mb-3 text-center text-[var(--color-azar-cyan)]">
              El Caos
            </p>
            <ul className="space-y-1 text-xs">
              <li>• Descubrimiento aleatorio</li>
              <li>• Terminal interactiva</li>
              <li>• Estética glitch</li>
              <li>• Sorpresas continuas</li>
            </ul>
          </div>
        </div>

        {/* Soporte */}
        <div className="text-center py-4 border-t-2 border-[var(--color-raza-gray)]">
          <p className="text-sm text-[var(--color-raza-gray)] mb-2">
            ¿Necesitas más ayuda?
          </p>
          <p className="text-xs text-[var(--color-raza-gray)]">
            Únete a MSN.CHAT como Nakama para obtener soporte de la comunidad.
          </p>
        </div>
      </div>
    </div>
  );
}

function HelpSection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="win95-bevel-out bg-white p-4 flex gap-4"
    >
      <div className="w-12 h-12 bg-[var(--color-raza-accent)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-brutalist mb-2">{title}</h4>
        <p className="text-sm text-[var(--color-raza-gray)] leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
