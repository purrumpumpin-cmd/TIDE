/**
 * TIDElabs - El The Aetherius Digital
 * Sistema Operativo del Santuario - VERSIÓN MEJORADA
 */

import { useState, useEffect, useRef } from "react";
import { Menu, Power, Folder, MessageSquare, DollarSign, Package, Music, BookOpen, Mail, HelpCircle, Settings, Info, Sparkles, Zap, Gamepad2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WindowFrame } from "./WindowFrame";
import { WalletConnectButton } from "./WalletConnectButton";
import { CrowdfundApp } from "./apps/CrowdfundApp";
import { MSNChatApp } from "./apps/MSNChatApp";
import { ExplorerApp } from "./apps/ExplorerApp";
import { RazaAzarPortalApp } from "./apps/RazaAzarPortalApp";
import { TunovaApp } from "./apps/TunovaApp";
import { TunovaLeaderboard } from "./apps/TunovaLeaderboard";
import { TideLabsCoreApp } from "./apps/TideLabsCoreApp";
import { WaitlistApp } from "./apps/WaitlistApp";
import { HelpApp } from "./apps/HelpApp";
import { SettingsApp } from "./apps/SettingsApp";
import { GenesisApp } from "./apps/GenesisApp";
import { ArcadeApp } from "./apps/ArcadeApp";
import { AIPetsApp } from "./apps/AIPetsApp";
import { authApi } from "../utils/api";

interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  initialX: number;
  initialY: number;
}

interface DesktopIcon {
  id: string;
  x: number;
  y: number;
}

const APPS: App[] = [
  {
    id: "help",
    name: "HELP.TXT",
    icon: <HelpCircle size={32} />,
    component: HelpApp,
    initialX: 50,
    initialY: 50,
  },
  {
    id: "tidelabscore",
    name: "TIDELABS.CORE",
    icon: <BookOpen size={32} />,
    component: TideLabsCoreApp,
    initialX: 80,
    initialY: 70,
  },
  {
    id: "crowdfund",
    name: "CROWDFUND.WEB3",
    icon: <DollarSign size={32} />,
    component: CrowdfundApp,
    initialX: 110,
    initialY: 90,
  },
  {
    id: "msnchat",
    name: "MSN.CHAT",
    icon: <MessageSquare size={32} />,
    component: MSNChatApp,
    initialX: 140,
    initialY: 110,
  },
  {
    id: "explorer",
    name: "EXPLORER.EXE",
    icon: <Package size={32} />,
    component: ExplorerApp,
    initialX: 170,
    initialY: 130,
  },
  {
    id: "tunova",
    name: "TUNOVA.IO",
    icon: <Music size={32} />,
    component: TunovaApp,
    initialX: 200,
    initialY: 150,
  },
  {
    id: "leaderboard",
    name: "LEADERBOARD",
    icon: <span className="text-2xl">🏆</span>,
    component: TunovaLeaderboard,
    initialX: 220,
    initialY: 160,
  },
  {
    id: "waitlist",
    name: "WAITLIST.SH",
    icon: <Mail size={32} />,
    component: WaitlistApp,
    initialX: 230,
    initialY: 170,
  },
  {
    id: "settings",
    name: "SETTINGS.SYS",
    icon: <Settings size={32} />,
    component: SettingsApp,
    initialX: 260,
    initialY: 190,
  },
  {
    id: "razaazar",
    name: "RAZA.AZAR",
    icon: <Folder size={32} />,
    component: RazaAzarPortalApp,
    initialX: 290,
    initialY: 210,
  },
  {
    id: "arcade",
    name: "ARCADE.EXE",
    icon: <Gamepad2 size={32} />,
    component: ArcadeApp,
    initialX: 320,
    initialY: 230,
  },
  {
    id: "aipets",
    name: "AI.PETS",
    icon: <Bot size={32} />,
    component: AIPetsApp,
    initialX: 350,
    initialY: 250,
  },
  {
    id: "genesis",
    name: "GENESIS",
    icon: <span className="text-2xl">🏴‍☠️</span>,
    component: GenesisApp,
    initialX: 50,
    initialY: 400,
  },
];

interface TIDELabsDesktopProps {
  onNavigateRaza?: () => void;
  onNavigateAzar?: () => void;
  onNavigateHome?: () => void;
}

export function TIDELabsDesktop({
  onNavigateRaza,
  onNavigateAzar,
  onNavigateHome,
}: TIDELabsDesktopProps) {
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string>("none");
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [userNFTs, setUserNFTs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inicializar posiciones de iconos
  useEffect(() => {
    const savedPositions = localStorage.getItem('tidelabs_icon_positions');
    if (savedPositions) {
      setIconPositions(JSON.parse(savedPositions));
    } else {
      // Posiciones iniciales en grid
      const initialPositions: Record<string, { x: number; y: number }> = {};
      APPS.forEach((app, index) => {
        const col = Math.floor(index / 5);
        const row = index % 5;
        initialPositions[app.id] = {
          x: 20 + col * 90,
          y: 20 + row * 90,
        };
      });
      setIconPositions(initialPositions);
    }
  }, []);

  // Guardar posiciones cuando cambian
  useEffect(() => {
    if (Object.keys(iconPositions).length > 0) {
      localStorage.setItem('tidelabs_icon_positions', JSON.stringify(iconPositions));
    }
  }, [iconPositions]);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedSession = localStorage.getItem('tidelabs_session');
    if (savedSession) {
      validateSession(savedSession);
    }

    // Abrir HELP.TXT en la primera visita
    const hasVisited = localStorage.getItem('tidelabs_visited');
    if (!hasVisited) {
      setTimeout(() => {
        openApp('help');
        localStorage.setItem('tidelabs_visited', 'true');
      }, 500);
    }
  }, []);

  const validateSession = async (token: string) => {
    try {
      const response = await authApi.getSession(token);
      if (response.success) {
        setWalletAddress(response.user.address);
        setSessionToken(token);
        setUserTier(response.user.nakama_tier || "none");
        setUserNFTs(response.user.nfts || []);
        console.log("Sesión restaurada:", response.user);
      }
    } catch (error) {
      console.error("Error validating session:", error);
      localStorage.removeItem('tidelabs_session');
    }
  };

  const handleWalletConnect = async (address: string, signature: string, message: string) => {
    try {
      const response = await authApi.verifySIWE(address, signature, message);
      if (response.success) {
        setWalletAddress(response.user.address);
        setSessionToken(response.sessionToken);
        setUserTier(response.user.nakama_tier || "none");
        setUserNFTs(response.user.nfts || []);
        localStorage.setItem('tidelabs_session', response.sessionToken);
        console.log("Usuario conectado:", response.user);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const openApp = (appId: string) => {
    if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
    }
    // Si estaba minimizado, restaurarlo
    if (minimizedApps.includes(appId)) {
      setMinimizedApps(minimizedApps.filter(id => id !== appId));
    }
    bringToFront(appId);
  };

  const closeApp = (appId: string) => {
    setOpenApps(openApps.filter((id) => id !== appId));
    setMinimizedApps(minimizedApps.filter(id => id !== appId));
  };

  const minimizeApp = (appId: string) => {
    if (!minimizedApps.includes(appId)) {
      setMinimizedApps([...minimizedApps, appId]);
    }
  };

  const bringToFront = (appId: string) => {
    const newMaxZIndex = maxZIndex + 1;
    setMaxZIndex(newMaxZIndex);
    setZIndexes({ ...zIndexes, [appId]: newMaxZIndex });
  };

  // Manejo del clic derecho
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Easter Egg: Konami Code
  useEffect(() => {
    let konamiIndex = 0;
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowEasterEgg(true);
          setTimeout(() => setShowEasterEgg(false), 5000);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Drag & Drop de iconos
  const handleIconDragStart = (e: React.DragEvent, appId: string) => {
    setDraggingIcon(appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleIconDragEnd = (e: React.DragEvent) => {
    if (draggingIcon && desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left - 32, rect.width - 64));
      const y = Math.max(0, Math.min(e.clientY - rect.top - 32, rect.height - 96));
      
      setIconPositions({
        ...iconPositions,
        [draggingIcon]: { x, y },
      });
    }
    setDraggingIcon(null);
  };

  const handleShutdown = () => {
    setStartMenuOpen(false);
    // Animación de apagado
    const shutdownDiv = document.createElement('div');
    shutdownDiv.className = 'fixed inset-0 bg-black z-[99999] flex items-center justify-center';
    shutdownDiv.innerHTML = `
      <div class="text-white font-win95 text-center">
        <p class="text-2xl mb-4">Apagando TIDElabs...</p>
        <p class="text-sm">Es seguro apagar el sistema</p>
      </div>
    `;
    document.body.appendChild(shutdownDiv);
    
    setTimeout(() => {
      if (onNavigateHome) {
        onNavigateHome();
      }
    }, 2000);
  };

  return (
    <div 
      ref={desktopRef}
      className="w-screen h-screen bg-[#008080] relative overflow-hidden flex flex-col"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      {/* Desktop Icons */}
      <div className="flex-1 relative">
        {APPS.map((app) => {
          const position = iconPositions[app.id] || { x: 20, y: 20 };
          return (
            <motion.div
              key={app.id}
              draggable
              onDragStart={(e) => handleIconDragStart(e as any, app.id)}
              onDragEnd={(e) => handleIconDragEnd(e as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute flex flex-col items-center gap-2 cursor-pointer select-none"
              style={{
                left: position.x,
                top: position.y,
              }}
              onDoubleClick={() => openApp(app.id)}
            >
              <div className="w-16 h-16 bg-[var(--color-win95-face)] win95-bevel-out flex items-center justify-center">
                {app.icon}
              </div>
              <span className="text-white text-xs font-win95 text-center text-shadow max-w-[80px] break-words">
                {app.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Open Windows */}
      {openApps.map((appId) => {
        const app = APPS.find((a) => a.id === appId);
        if (!app) return null;

        const AppComponent = app.component;
        const appProps =
          app.id === "msnchat"
            ? { userTier, walletAddress, sessionToken }
            : app.id === "explorer"
            ? { walletAddress, sessionToken }
            : app.id === "razaazar"
            ? { onNavigateRaza, onNavigateAzar }
            : app.id === "crowdfund"
            ? { sessionToken, userTier }
            : app.id === "tunova"
            ? { userNFTs, walletAddress }
            : {};

        return (
          <WindowFrame
            key={appId}
            title={app.name}
            onClose={() => closeApp(appId)}
            onMinimize={() => minimizeApp(appId)}
            initialX={app.initialX}
            initialY={app.initialY}
            width={700}
            height={500}
            zIndex={zIndexes[appId] || 1}
            onFocus={() => bringToFront(appId)}
            isMinimized={minimizedApps.includes(appId)}
          >
            <AppComponent {...appProps} />
          </WindowFrame>
        );
      })}

      {/* Taskbar */}
      <div className="h-12 bg-[var(--color-win95-face)] win95-bevel-out border-t-2 border-white flex items-center px-2 gap-2 z-[9998]">
        {/* Start Button */}
        <button
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className={`win95-bevel-out bg-[var(--color-win95-face)] px-3 py-1 font-win95 hover:win95-bevel-in active:win95-bevel-in flex items-center gap-2 ${
            startMenuOpen ? "win95-bevel-in" : ""
          }`}
        >
          <Menu size={16} />
          <span>Iniciar</span>
        </button>

        {/* Separator */}
        <div className="w-[2px] h-8 bg-[var(--color-win95-shadow)]" />

        {/* Open Apps Buttons */}
        {openApps.map((appId) => {
          const app = APPS.find((a) => a.id === appId);
          if (!app) return null;
          const isMinimized = minimizedApps.includes(appId);
          return (
            <button
              key={appId}
              onClick={() => {
                if (isMinimized) {
                  setMinimizedApps(minimizedApps.filter(id => id !== appId));
                }
                bringToFront(appId);
              }}
              className={`${
                isMinimized ? "win95-bevel-out" : "win95-bevel-in"
              } bg-white px-3 py-1 font-win95 text-sm hover:win95-bevel-out max-w-[150px] truncate`}
              title={app.name}
            >
              {app.name}
            </button>
          );
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Wallet Button */}
        <WalletConnectButton onConnect={handleWalletConnect} />

        {/* Clock */}
        <div className="win95-bevel-in px-3 py-1 font-win95 text-sm">
          {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-12 left-2 w-72 bg-[var(--color-win95-face)] win95-bevel-out z-[9999] shadow-2xl"
            >
              <div className="bg-gradient-to-r from-[var(--color-win95-titlebar)] to-purple-900 text-white p-3 font-brutalist flex items-center gap-2">
                <Sparkles size={20} />
                <div>
                  <div className="text-lg">TIDElabs</div>
                  <div className="text-xs opacity-80">El The Aetherius Digital v1.0</div>
                </div>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="mb-2">
                  <div className="text-xs font-win95 text-gray-600 px-2 py-1">Aplicaciones</div>
                  {APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        openApp(app.id);
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-2 hover:bg-[var(--color-win95-titlebar)] hover:text-white flex items-center gap-3 rounded transition-colors"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">{app.icon}</div>
                      <span className="font-win95 text-sm">{app.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t-2 border-[var(--color-win95-shadow)] my-2" />
                <button 
                  onClick={handleShutdown}
                  className="w-full text-left px-2 py-2 hover:bg-red-600 hover:text-white flex items-center gap-3 rounded transition-colors"
                >
                  <Power size={16} />
                  <span className="font-win95 text-sm">Apagar Sistema</span>
                </button>
              </div>
            </motion.div>

            {/* Overlay para cerrar el menú */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setStartMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Context Menu (Clic Derecho) */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bg-[var(--color-win95-face)] win95-bevel-out z-[10000] min-w-[200px] shadow-xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                setIconPositions({});
                localStorage.removeItem('tidelabs_icon_positions');
                closeContextMenu();
                window.location.reload();
              }}
              className="w-full text-left px-3 py-2 hover:bg-[var(--color-win95-titlebar)] hover:text-white flex items-center gap-2"
            >
              <Zap size={14} />
              <span className="font-win95 text-sm">Reorganizar Iconos</span>
            </button>
            <button
              onClick={() => {
                openApp('settings');
                closeContextMenu();
              }}
              className="w-full text-left px-3 py-2 hover:bg-[var(--color-win95-titlebar)] hover:text-white flex items-center gap-2"
            >
              <Settings size={14} />
              <span className="font-win95 text-sm">Propiedades</span>
            </button>
            <div className="border-t border-[var(--color-win95-shadow)] my-1" />
            <button
              onClick={() => {
                openApp('help');
                closeContextMenu();
              }}
              className="w-full text-left px-3 py-2 hover:bg-[var(--color-win95-titlebar)] hover:text-white flex items-center gap-2"
            >
              <Info size={14} />
              <span className="font-win95 text-sm">Acerca de TIDElabs</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg: Konami Code */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none"
          >
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 p-8 rounded-lg shadow-2xl border-4 border-white">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🏴‍☠️</div>
                <h2 className="font-brutalist text-4xl text-white mb-2 neon-glow">
                  ¡NAKAMA SECRETO!
                </h2>
                <p className="text-white text-xl">
                  Has desbloqueado el código pirata
                </p>
                <p className="text-yellow-300 text-sm mt-2">
                  Eres un verdadero navegante del The Aetherius
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
