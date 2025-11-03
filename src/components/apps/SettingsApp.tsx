/**
 * TIDElabs - SETTINGS.SYS
 * Configuración del sistema
 */

import { useState, useEffect } from "react";
import { Settings, Volume2, VolumeX, Zap, Eye } from "lucide-react";
import { PointsDashboard } from "../PointsDashboard";

export function SettingsApp() {
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('tidelabs_sound') !== 'false'
  );
  const [crtEnabled, setCrtEnabled] = useState(
    localStorage.getItem('tidelabs_crt') !== 'false'
  );
  const [animationsEnabled, setAnimationsEnabled] = useState(
    localStorage.getItem('tidelabs_animations') !== 'false'
  );
  const [walletAddress, setWalletAddress] = useState<string | null>(
    localStorage.getItem('tidelabs_wallet')
  );

  useEffect(() => {
    localStorage.setItem('tidelabs_sound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('tidelabs_crt', crtEnabled.toString());
    // Toggle CRT effect class on body
    if (crtEnabled) {
      document.body.classList.remove('no-crt');
    } else {
      document.body.classList.add('no-crt');
    }
  }, [crtEnabled]);

  useEffect(() => {
    localStorage.setItem('tidelabs_animations', animationsEnabled.toString());
    if (animationsEnabled) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  }, [animationsEnabled]);

  const clearData = () => {
    if (confirm('¿Estás seguro? Esto cerrará tu sesión y borrará todos los datos locales.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <h2 className="font-brutalist tracking-wider">SETTINGS.SYS</h2>
        <p className="text-xs mt-1">Configuración del Sistema</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Points Dashboard */}
        <div className="win95-bevel-out bg-white p-4">
          <PointsDashboard walletAddress={walletAddress} />
        </div>
        {/* Visual Settings */}
        <div className="win95-bevel-out bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye size={24} />
            <h3 className="font-brutalist">EFECTOS VISUALES</h3>
          </div>

          <div className="space-y-4">
            {/* CRT Effect */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-brutalist text-sm mb-1">Efecto CRT</p>
                <p className="text-xs text-[var(--color-raza-gray)]">
                  Scanlines y phosphor glow nostálgico
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={crtEnabled}
                  onChange={(e) => setCrtEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 win95-bevel-in peer-checked:bg-[var(--color-raza-accent)] peer-checked:win95-bevel-out transition-all" />
              </label>
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-brutalist text-sm mb-1">Animaciones</p>
                <p className="text-xs text-[var(--color-raza-gray)]">
                  Transiciones y movimientos suaves
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 win95-bevel-in peer-checked:bg-[var(--color-raza-accent)] peer-checked:win95-bevel-out transition-all" />
              </label>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="win95-bevel-out bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            <h3 className="font-brutalist">AUDIO</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-brutalist text-sm mb-1">Sonidos del Sistema</p>
              <p className="text-xs text-[var(--color-raza-gray)]">
                Feedback auditivo retro para interacciones
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 win95-bevel-in peer-checked:bg-[var(--color-raza-accent)] peer-checked:win95-bevel-out transition-all" />
            </label>
          </div>
        </div>

        {/* Performance */}
        <div className="win95-bevel-out bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} />
            <h3 className="font-brutalist">RENDIMIENTO</h3>
          </div>

          <div className="win95-bevel-in bg-[#F0F0F0] p-3 text-xs space-y-1">
            <p><strong>Tip:</strong> Si experimentas lag, desactiva el efecto CRT y las animaciones.</p>
            <p><strong>Navegador:</strong> {navigator.userAgent.split(' ').slice(-1)[0]}</p>
            <p><strong>Resolución:</strong> {window.innerWidth} x {window.innerHeight}</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="win95-bevel-out bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={24} />
            <h3 className="font-brutalist">DATOS</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Sesión activa:</p>
              <p className="text-xs text-[var(--color-raza-gray)] font-brutalist">
                {localStorage.getItem('tidelabs_session') ? 'Sí' : 'No'}
              </p>
            </div>

            <button
              onClick={clearData}
              className="w-full win95-bevel-out bg-red-200 py-3 font-brutalist hover:win95-bevel-in text-red-800"
            >
              [BORRAR TODOS LOS DATOS]
            </button>

            <p className="text-xs text-[var(--color-raza-gray)] text-center">
              Esto cerrará tu sesión y reiniciará la aplicación
            </p>
          </div>
        </div>

        {/* About */}
        <div className="text-center py-4 border-t-2 border-[var(--color-raza-gray)]">
          <p className="font-brutalist mb-1">TIDElabs v1.0</p>
          <p className="text-xs text-[var(--color-raza-gray)]">
            Powered by React, Supabase & Web3
          </p>
        </div>
      </div>
    </div>
  );
}
