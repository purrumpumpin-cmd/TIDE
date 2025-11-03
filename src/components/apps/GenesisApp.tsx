/**
 * TIDElabs - GENESIS
 * Navegador Internet Explorer Retro para TUNOVA.IO + Radio Pirata
 */

import { useState } from "react";
import { Globe, Home, RefreshCw, X, Minimize, Maximize } from "lucide-react";

export const GenesisApp = () => {
  const [url, setUrl] = useState("tunova_con_radio_pirata.html");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (newUrl: string) => {
    setIsLoading(true);
    setUrl(newUrl);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8]">
      {/* IE Toolbar */}
      <div className="bg-gradient-to-b from-[#0055E5] to-[#003DB8] px-2 py-1 flex items-center gap-2 border-b-2 border-[#003DB8]">
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-bold">
            Archivo
          </button>
          <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-bold">
            Edición
          </button>
          <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-bold">
            Ver
          </button>
          <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-bold">
            Favoritos
          </button>
          <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-bold">
            Herramientas
          </button>
          <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-bold">
            Ayuda
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#F1EFE2] px-2 py-2 flex items-center gap-2 border-b border-gray-400">
        <button
          onClick={() => handleNavigate("tunova_con_radio_pirata.html")}
          className="p-1.5 bg-white border border-gray-400 rounded hover:bg-gray-100 transition-colors"
          title="Inicio"
        >
          <Home size={18} className="text-gray-700" />
        </button>
        <button
          onClick={handleRefresh}
          className="p-1.5 bg-white border border-gray-400 rounded hover:bg-gray-100 transition-colors"
          title="Actualizar"
        >
          <RefreshCw size={18} className={`text-gray-700 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <div className="h-6 w-px bg-gray-400 mx-1" />
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-400 px-2 py-1 rounded">
          <Globe size={16} className="text-gray-600" />
          <span className="text-sm text-gray-700 font-mono">
            https://tunova.io/{url}
          </span>
        </div>
        <button
          onClick={() => window.open(`/${url}`, '_blank')}
          className="px-3 py-1 bg-gradient-to-b from-[#0055E5] to-[#003DB8] text-white text-xs font-bold rounded border border-[#003DB8] hover:from-[#0066FF] hover:to-[#0044CC] transition-colors"
        >
          Ir
        </button>
      </div>

      {/* Status Bar */}
      <div className="bg-[#F1EFE2] px-2 py-1 flex items-center gap-2 border-b border-gray-400">
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-700 hover:underline">
            ← Atrás
          </button>
          <button className="text-xs text-gray-700 hover:underline">
            Adelante →
          </button>
        </div>
        <div className="h-4 w-px bg-gray-400 mx-1" />
        <div className="text-xs text-gray-700">
          🏴‍☠️ GENESIS - TUNOVA.IO + Radio Pirata
        </div>
      </div>

      {/* Content Area - iframe */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#0055E5] border-t-transparent rounded-full animate-spin" />
              <div className="text-sm text-gray-700 font-bold">
                Cargando TUNOVA.IO...
              </div>
            </div>
          </div>
        )}
        <iframe
          src={`/${url}`}
          className="w-full h-full border-none"
          title="GENESIS - TUNOVA.IO + Radio Pirata"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#F1EFE2] px-2 py-1 flex items-center justify-between border-t border-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white border border-gray-400 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <span className="text-xs text-gray-700">Listo</span>
          </div>
          <div className="text-xs text-gray-700">
            Internet Explorer Retro
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-700">
            🔒 Conexión segura
          </div>
          <div className="text-xs text-gray-700">
            🌐 tunova.io
          </div>
        </div>
      </div>

      {/* IE Classic Info Banner */}
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-t-2 border-yellow-400 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="text-lg">ℹ️</div>
          <div className="text-xs text-gray-800">
            <span className="font-bold">GENESIS</span> - Navegador retro para TUNOVA.IO + Radio Pirata 🏴‍☠️ | 
            <span className="ml-1">Explora las 4 colecciones de walkmans, vota por tus tracks favoritos y escucha la Radio Pirata</span>
          </div>
        </div>
      </div>
    </div>
  );
};
