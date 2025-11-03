/**
 * TIDElabs - TUNOVA.IO
 * Sistema de Walkmans NFT Coleccionables con Radio Pirata
 */

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio, ChevronsUp, Award, Zap, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ═══════════════════════════════════════════════════════════
// TIPOS Y ESTRUCTURAS DE DATOS
// ═══════════════════════════════════════════════════════════

interface Track {
  id: string;
  title: string;
  artist: string;
  language?: string;
  duration: string;
  audioUrl: string; // ← AQUÍ SE AGREGA EL LINK DE SPOTIFY/SOUNDCLOUD
}

interface Cassette {
  id: string;
  name: string;
  type: "vah0m4n" | "nakamas" | "razazar-raza" | "razazar-azar" | "radio";
  description: string;
  artwork: string;
  color: string;
  accentColor: string;
  tracks: Track[];
  isNFT: boolean;
  requiredNFT?: string;
  isOwned?: boolean;
}

// ═══════════════════════════════════════════════════════════
// CASETES COLECCIONABLES - GENESIS COLLECTION
// ═══════════════════════════════════════════════════════════

const CASSETTES: Cassette[] = [
  // 1. REY DE LOS EMPRENDEDORES - Vah0m4n (8 idiomas)
  {
    id: "vah0m4n-rey",
    name: "Rey de los Emprendedores",
    type: "vah0m4n",
    description: "Vah0m4n - 8 Idiomas Edition",
    artwork: "👑",
    color: "from-yellow-600 to-orange-600",
    accentColor: "#FFB900",
    isNFT: true,
    requiredNFT: "Vah0m4n Genesis NFT",
    isOwned: true, // ← Cambiar según wallet conectado
    tracks: [
      {
        id: "vah0m4n-es",
        title: "Rey de los Emprendedores",
        artist: "Vah0m4n",
        language: "🇪🇸 Español",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-en",
        title: "King of Entrepreneurs",
        artist: "Vah0m4n",
        language: "🇺🇸 English",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-fr",
        title: "Roi des Entrepreneurs",
        artist: "Vah0m4n",
        language: "🇫🇷 Français",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-de",
        title: "König der Unternehmer",
        artist: "Vah0m4n",
        language: "🇩🇪 Deutsch",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-it",
        title: "Re degli Imprenditori",
        artist: "Vah0m4n",
        language: "🇮🇹 Italiano",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-pt",
        title: "Rei dos Empreendedores",
        artist: "Vah0m4n",
        language: "🇵🇹 Português",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-ja",
        title: "起業家の王",
        artist: "Vah0m4n",
        language: "🇯🇵 日本語",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "vah0m4n-zh",
        title: "企业家之王",
        artist: "Vah0m4n",
        language: "🇨🇳 中文",
        duration: "3:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
    ],
  },

  // 2. NAKAMAS CREW - Genesis Vol.1 (10-12 artistas)
  {
    id: "nakamas-vol1",
    name: "NAKAMAS CREW Genesis Vol.1",
    type: "nakamas",
    description: "Compilado del Ecosistema TUNOVA",
    artwork: "🏴‍☠️",
    color: "from-purple-600 to-pink-600",
    accentColor: "#FF00FF",
    isNFT: true,
    requiredNFT: "Nakamas Genesis NFT",
    isOwned: true,
    tracks: [
      {
        id: "nakamas-01",
        title: "Digital Nostalgia",
        artist: "Neo Samurai",
        duration: "3:30",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-02",
        title: "Pirate's Anthem",
        artist: "Digital Pirates",
        duration: "4:12",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-03",
        title: "Sunset Drive",
        artist: "Retro Dreamers",
        duration: "5:30",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-04",
        title: "System Override",
        artist: "Binary Beats",
        duration: "3:20",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-05",
        title: "Neon Lights",
        artist: "Neon Ninjas",
        duration: "4:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-06",
        title: "Cyber Dreams",
        artist: "Tokyo Drift",
        duration: "3:55",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-07",
        title: "Bass Odyssey",
        artist: "Sub Frequency",
        duration: "4:20",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-08",
        title: "Glitch Paradise",
        artist: "Error404",
        duration: "3:40",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-09",
        title: "Retro Wave",
        artist: "80s Forever",
        duration: "4:00",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "nakamas-10",
        title: "Blockchain Beats",
        artist: "Crypto Vibes",
        duration: "3:25",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      // Opcional: agregar hasta 12 artistas
    ],
  },

  // 3. RazAzaR - Versión RAZA (Brutalismo Elegante)
  {
    id: "razazar-raza",
    name: "RazAzaR: RAZA Edition",
    type: "razazar-raza",
    description: "Brutalismo Elegante",
    artwork: "⚪",
    color: "from-white to-gray-200",
    accentColor: "#39FF14",
    isNFT: true,
    requiredNFT: "RazAzaR RAZA NFT",
    isOwned: true,
    tracks: [
      {
        id: "raza-01",
        title: "Minimal Minds",
        artist: "RazAzaR",
        duration: "4:30",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "raza-02",
        title: "Clean Lines",
        artist: "RazAzaR",
        duration: "3:50",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "raza-03",
        title: "Elegant Brutalism",
        artist: "RazAzaR",
        duration: "5:10",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "raza-04",
        title: "White Space",
        artist: "RazAzaR",
        duration: "4:00",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
    ],
  },

  // 4. RazAzaR - Versión AZAR (Caos Generativo)
  {
    id: "razazar-azar",
    name: "RazAzaR: AZAR Edition",
    type: "razazar-azar",
    description: "Caos Generativo",
    artwork: "⚫",
    color: "from-black via-purple-900 to-black",
    accentColor: "#00FFFF",
    isNFT: true,
    requiredNFT: "RazAzaR AZAR NFT",
    isOwned: true,
    tracks: [
      {
        id: "azar-01",
        title: "Chaos Theory",
        artist: "RazAzaR",
        duration: "4:45",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "azar-02",
        title: "Glitch Reality",
        artist: "RazAzaR",
        duration: "3:30",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "azar-03",
        title: "Random Access",
        artist: "RazAzaR",
        duration: "5:20",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
      {
        id: "azar-04",
        title: "Digital Entropy",
        artist: "RazAzaR",
        duration: "4:15",
        audioUrl: "", // ← AGREGAR LINK AQUÍ
      },
    ],
  },

  // 5. Radio Pirata (Gratis - Con Recompensas)
  {
    id: "radio-pirata",
    name: "Radio Pirata 24/7",
    type: "radio",
    description: "Escucha y gana puntos para el Airdrop",
    artwork: "📻",
    color: "from-green-600 to-cyan-600",
    accentColor: "#39FF14",
    isNFT: false,
    isOwned: true,
    tracks: [
      {
        id: "radio-mix",
        title: "Live Mix - TUNOVA Ecosystem",
        artist: "Radio Pirata",
        duration: "∞",
        audioUrl: "", // ← AGREGAR LINK DE STREAM AQUÍ
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

interface TunovaAppProps {
  userNFTs?: string[];
  walletAddress?: string;
}

export function TunovaApp({ userNFTs = [], walletAddress }: TunovaAppProps) {
  // Estado del Walkman
  const [selectedCassette, setSelectedCassette] = useState<Cassette | null>(null);
  const [isInserted, setIsInserted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCollection, setShowCollection] = useState(true);

  // Sistema de Recompensas (Radio Pirata)
  const [listeningPoints, setListeningPoints] = useState(0);
  const [listeningTime, setListeningTime] = useState(0); // en segundos
  const [showRewards, setShowRewards] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Verificar ownership de casetes
  const getOwnedCassettes = () => {
    return CASSETTES.map(cassette => ({
      ...cassette,
      isOwned: !cassette.isNFT || cassette.requiredNFT === undefined || userNFTs.includes(cassette.requiredNFT)
    }));
  };

  const ownedCassettes = getOwnedCassettes();

  // Sistema de puntos para Radio Pirata
  useEffect(() => {
    if (isPlaying && selectedCassette?.type === "radio") {
      const pointsInterval = setInterval(() => {
        setListeningTime(prev => prev + 1);
        
        // Ganar 1 punto cada 60 segundos
        if (listeningTime % 60 === 0 && listeningTime > 0) {
          setListeningPoints(prev => prev + 1);
          setShowRewards(true);
          setTimeout(() => setShowRewards(false), 3000);
          
          // Guardar puntos en el backend (si hay wallet conectado)
          if (walletAddress) {
            savePointsToBackend(1, 60);
          }
        }
      }, 1000);

      return () => clearInterval(pointsInterval);
    }
  }, [isPlaying, selectedCassette, listeningTime, walletAddress]);

  const savePointsToBackend = async (points: number, time: number) => {
    try {
      const sessionToken = localStorage.getItem('tidelabs_session');
      if (!sessionToken) return;

      const { tunovaApi } = await import("../../utils/api");
      await tunovaApi.addPoints(points, time, selectedCassette?.id || "radio-pirata", sessionToken);
      console.log(`✅ ${points} puntos guardados en el backend`);
    } catch (error) {
      console.error("Error guardando puntos:", error);
    }
  };

  // Simulación de progreso
  useEffect(() => {
    if (isPlaying && isInserted && selectedCassette && selectedCassette.type !== "radio") {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isInserted, selectedCassette]);

  const handleInsertCassette = (cassette: Cassette) => {
    if (!cassette.isOwned) {
      alert(`Necesitas el NFT: ${cassette.requiredNFT}`);
      return;
    }

    setSelectedCassette(cassette);
    setIsInserted(true);
    setCurrentTrack(0);
    setCurrentTime(0);
    setShowCollection(false);
    
    // Auto-play para radio
    if (cassette.type === "radio") {
      setTimeout(() => setIsPlaying(true), 500);
    }
  };

  const handleEjectCassette = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setIsInserted(false);
      setSelectedCassette(null);
      setCurrentTime(0);
      setShowCollection(true);
    }, 500);
  };

  const handlePlayPause = () => {
    if (!isInserted || !selectedCassette) return;
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!selectedCassette || selectedCassette.type === "radio") return;
    setCurrentTrack((prev) => (prev + 1) % selectedCassette.tracks.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    if (!selectedCassette || selectedCassette.type === "radio") return;
    setCurrentTrack((prev) => (prev - 1 + selectedCassette.tracks.length) % selectedCassette.tracks.length);
    setCurrentTime(0);
  };

  const currentTrackData = selectedCassette?.tracks[currentTrack];

  return (
    <div className="h-full flex bg-gradient-to-br from-black via-gray-900 to-black text-white font-win95 overflow-hidden">
      {/* Colección de Casetes */}
      <AnimatePresence>
        {showCollection && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 border-r-2 border-[var(--color-raza-accent)] p-4 overflow-auto bg-black/80"
          >
            <div className="mb-4">
              <h3 className="font-brutalist text-lg text-[var(--color-raza-accent)] mb-1 flex items-center gap-2">
                📼 MI COLECCIÓN
              </h3>
              <p className="text-xs text-[var(--color-raza-gray)]">
                {ownedCassettes.filter(c => c.isOwned).length} / {ownedCassettes.length} casetes
              </p>
            </div>

            <div className="space-y-3">
              {ownedCassettes.map((cassette) => (
                <motion.button
                  key={cassette.id}
                  onClick={() => handleInsertCassette(cassette)}
                  disabled={!cassette.isOwned}
                  whileHover={{ scale: cassette.isOwned ? 1.05 : 1 }}
                  whileTap={{ scale: cassette.isOwned ? 0.95 : 1 }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    cassette.isOwned
                      ? `bg-gradient-to-r ${cassette.color} border-[var(--color-raza-accent)] hover:shadow-lg hover:shadow-[var(--color-raza-accent)]/50`
                      : "bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{cassette.artwork}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-brutalist text-sm truncate">{cassette.name}</h4>
                        {cassette.isNFT && (
                          cassette.isOwned ? (
                            <Unlock size={12} className="text-[var(--color-raza-accent)]" />
                          ) : (
                            <Lock size={12} className="text-red-500" />
                          )
                        )}
                      </div>
                      <p className="text-xs opacity-80 mb-2">{cassette.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-azar-cyan)]">
                          {cassette.tracks.length} {cassette.type === "radio" ? "Stream" : "tracks"}
                        </span>
                        {cassette.type === "radio" && (
                          <span className="bg-[var(--color-raza-accent)] text-black px-2 py-0.5 rounded">
                            GRATIS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info de Recompensas */}
            <div className="mt-6 p-4 bg-gradient-to-br from-green-900/50 to-cyan-900/50 rounded-lg border-2 border-[var(--color-raza-accent)]">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-[var(--color-raza-accent)]" size={20} />
                <h4 className="font-brutalist text-sm">AIRDROP POINTS</h4>
              </div>
              <p className="text-2xl font-brutalist text-[var(--color-raza-accent)] mb-1">
                {listeningPoints} pts
              </p>
              <p className="text-xs text-[var(--color-raza-gray)]">
                Escucha Radio Pirata para ganar puntos
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Walkman Principal */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Notificación de Recompensa */}
        <AnimatePresence>
          {showRewards && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-8 bg-gradient-to-r from-green-500 to-cyan-500 p-4 rounded-lg shadow-2xl z-50"
            >
              <div className="flex items-center gap-3">
                <Zap className="text-yellow-300" size={32} />
                <div>
                  <p className="font-brutalist text-lg">+1 Punto!</p>
                  <p className="text-xs">Sigue escuchando...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón para mostrar/ocultar colección */}
        {!showCollection && (
          <button
            onClick={() => setShowCollection(true)}
            className="absolute top-4 left-4 win95-bevel-out bg-[var(--color-win95-face)] p-2 hover:win95-bevel-in z-10"
          >
            <span className="text-xl">📼</span>
          </button>
        )}

        {/* Walkman 3D */}
        <div className="relative">
          {/* Cuerpo del Walkman */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[450px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-gray-700"
          >
            {/* Logo TUNOVA */}
            <div className="text-center mb-6">
              <h2 className="font-brutalist text-2xl text-[var(--color-raza-accent)] neon-glow">
                TUNOVA.IO
              </h2>
              <p className="text-xs text-[var(--color-raza-gray)]">Walkman Genesis Edition</p>
            </div>

            {/* Compartimento del Casete */}
            <div className="relative h-48 mb-6">
              <div className="absolute inset-0 bg-black rounded-2xl border-4 border-gray-600 overflow-hidden">
                {/* Ventana transparente */}
                <div className="absolute inset-4 bg-gray-900/50 border-2 border-gray-500 rounded-lg backdrop-blur-sm">
                  <AnimatePresence>
                    {isInserted && selectedCassette ? (
                      <motion.div
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -200, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`w-full h-full bg-gradient-to-br ${selectedCassette.color} rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden`}
                      >
                        {/* Artwork del Casete */}
                        <div className="text-6xl mb-2">{selectedCassette.artwork}</div>
                        <h3 className="font-brutalist text-sm text-center mb-1 text-white drop-shadow-lg">
                          {selectedCassette.name}
                        </h3>
                        
                        {/* Cinta rodando */}
                        {isPlaying && (
                          <>
                            <div className="absolute bottom-8 left-1/4 w-8 h-8 rounded-full border-4 border-black animate-spin" />
                            <div className="absolute bottom-8 right-1/4 w-8 h-8 rounded-full border-4 border-black animate-spin" />
                          </>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <p className="text-[var(--color-raza-gray)] text-sm text-center">
                          Inserta un casete<br />de tu colección
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Display LCD */}
            <div className="bg-green-900/30 border-2 border-green-700 rounded-lg p-3 mb-4 font-mono text-green-400">
              {isInserted && currentTrackData ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>TRACK {currentTrack + 1}/{selectedCassette?.tracks.length}</span>
                    <span>{isPlaying ? "▶" : "⏸"}</span>
                  </div>
                  <div className="text-sm truncate">{currentTrackData.title}</div>
                  <div className="text-xs truncate text-green-500">{currentTrackData.artist}</div>
                  {currentTrackData.language && (
                    <div className="text-xs">{currentTrackData.language}</div>
                  )}
                  {selectedCassette?.type === "radio" && (
                    <div className="text-xs text-[var(--color-raza-accent)]">
                      ⚡ {Math.floor(listeningTime / 60)}:{(listeningTime % 60).toString().padStart(2, '0')} | {listeningPoints} pts
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-sm">
                  NO CASSETTE
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="space-y-4">
              {/* Botones principales */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={!isInserted || selectedCassette?.type === "radio"}
                  className="w-12 h-12 win95-bevel-out bg-gray-700 flex items-center justify-center hover:win95-bevel-in disabled:opacity-30"
                >
                  <SkipBack size={20} />
                </button>

                <button
                  onClick={handlePlayPause}
                  disabled={!isInserted}
                  className="w-16 h-16 win95-bevel-out bg-gradient-to-br from-[var(--color-raza-accent)] to-[var(--color-azar-cyan)] flex items-center justify-center hover:win95-bevel-in disabled:opacity-30 shadow-lg"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isInserted || selectedCassette?.type === "radio"}
                  className="w-12 h-12 win95-bevel-out bg-gray-700 flex items-center justify-center hover:win95-bevel-in disabled:opacity-30"
                >
                  <SkipForward size={20} />
                </button>

                <button
                  onClick={handleEjectCassette}
                  disabled={!isInserted}
                  className="w-12 h-12 win95-bevel-out bg-red-700 flex items-center justify-center hover:win95-bevel-in disabled:opacity-30"
                  title="Expulsar casete"
                >
                  <ChevronsUp size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              {isInserted && selectedCassette?.type !== "radio" && (
                <div className="px-2">
                  <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-gray-600">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--color-raza-accent)] to-[var(--color-azar-cyan)]"
                      style={{ width: `${currentTime}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-[var(--color-raza-gray)]">
                    <span>0:00</span>
                    <span>{currentTrackData?.duration}</span>
                  </div>
                </div>
              )}

              {/* Volume */}
              <div className="flex items-center gap-3 px-2">
                <Volume2 size={16} className="text-[var(--color-raza-accent)]" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-raza-accent)]"
                />
                <span className="text-xs w-8 text-right">{volume}</span>
              </div>
            </div>
          </motion.div>

          {/* Auriculares decorativos */}
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-8 -right-8 text-6xl opacity-50"
          >
            🎧
          </motion.div>
        </div>

        {/* Info de Colaboraciones (Solo para NAKAMAS) */}
        {selectedCassette?.type === "nakamas" && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-8 right-8 bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-4 rounded-lg border-2 border-[var(--color-azar-magenta)] max-w-xs"
          >
            <h4 className="font-brutalist text-sm mb-2 flex items-center gap-2">
              <MessageCircle size={16} />
              ¿Eres artista?
            </h4>
            <p className="text-xs mb-2">
              Abre MSN.CHAT para colaborar con los artistas del ecosistema NAKAMAS CREW.
            </p>
            <button className="w-full bg-[var(--color-azar-magenta)] text-black px-3 py-1 rounded text-xs font-brutalist hover:bg-[var(--color-azar-cyan)]">
              Abrir MSN.CHAT
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
