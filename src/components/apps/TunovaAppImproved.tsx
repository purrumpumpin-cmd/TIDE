/**
 * TUNOVA.IO - Versión Mejorada
 * Plataforma Musical Web3 con Walkman Fotorrealista
 * Basado en wireframes de alta fidelidad - Fase 1
 */

import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Square,
  Volume2, 
  Award, 
  Zap,
  Lock, 
  Unlock 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import "./TunovaStyles.css";

// ═══════════════════════════════════════════════════════════
// TIPOS Y ESTRUCTURAS DE DATOS
// ═══════════════════════════════════════════════════════════

interface Track {
  id: string;
  title: string;
  artist: string;
  language?: string;
  duration: string;
  audioUrl: string;
}

interface Cassette {
  id: string;
  name: string;
  type: "vahoman" | "nakamas" | "raza" | "azar" | "radio";
  description: string;
  artwork: string;
  color: string;
  tracks: Track[];
  isNFT: boolean;
  requiredNFT?: string;
  isOwned?: boolean;
}

type CollectionType = "vahoman" | "nakamas" | "raza" | "azar";

interface WalkmanCollection {
  id: CollectionType;
  name: string;
  displayName: string;
  color: string;
  gradient: string;
}

// ═══════════════════════════════════════════════════════════
// COLECCIONES DE WALKMANS
// ═══════════════════════════════════════════════════════════

const WALKMAN_COLLECTIONS: WalkmanCollection[] = [
  {
    id: "vahoman",
    name: "Vah0m4n",
    displayName: "VAH0M4N",
    color: "#FFB900",
    gradient: "from-yellow-600 to-orange-600"
  },
  {
    id: "nakamas",
    name: "NAKAMAS",
    displayName: "NAKAMAS",
    color: "#FF00FF",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    id: "raza",
    name: "RazAzaR RAZA",
    displayName: "RAZAR",
    color: "#FFFFFF",
    gradient: "from-white to-gray-200"
  },
  {
    id: "azar",
    name: "RazAzaR AZAR",
    displayName: "RAZAR",
    color: "#00FFFF",
    gradient: "from-black via-purple-900 to-black"
  }
];

// ═══════════════════════════════════════════════════════════
// CASETES COLECCIONABLES
// ═══════════════════════════════════════════════════════════

const CASSETTES: Cassette[] = [
  // Vah0m4n - 8 idiomas
  {
    id: "vahoman-rey",
    name: "Rey de los Emprendedores",
    type: "vahoman",
    description: "8 Idiomas Edition",
    artwork: "👑",
    color: "var(--tunova-vahoman-gradient)",
    isNFT: true,
    requiredNFT: "Vah0m4n Genesis NFT",
    isOwned: true,
    tracks: [
      { id: "v1", title: "Rey de los Emprendedores", artist: "Vah0m4n", language: "🇪🇸 Español", duration: "3:45", audioUrl: "" },
      { id: "v2", title: "King of Entrepreneurs", artist: "Vah0m4n", language: "🇺🇸 English", duration: "3:45", audioUrl: "" },
      { id: "v3", title: "Roi des Entrepreneurs", artist: "Vah0m4n", language: "🇫🇷 Français", duration: "3:45", audioUrl: "" },
      { id: "v4", title: "König der Unternehmer", artist: "Vah0m4n", language: "🇩🇪 Deutsch", duration: "3:45", audioUrl: "" },
      { id: "v5", title: "Re degli Imprenditori", artist: "Vah0m4n", language: "🇮🇹 Italiano", duration: "3:45", audioUrl: "" },
      { id: "v6", title: "Rei dos Empreendedores", artist: "Vah0m4n", language: "🇵🇹 Português", duration: "3:45", audioUrl: "" },
      { id: "v7", title: "起業家の王", artist: "Vah0m4n", language: "🇯🇵 日本語", duration: "3:45", audioUrl: "" },
      { id: "v8", title: "企业家之王", artist: "Vah0m4n", language: "🇨🇳 中文", duration: "3:45", audioUrl: "" },
    ],
  },
  
  // NAKAMAS - 10 artistas
  {
    id: "nakamas-vol1",
    name: "NAKAMAS CREW Vol.1",
    type: "nakamas",
    description: "Compilado del Ecosistema",
    artwork: "🏴‍☠️",
    color: "var(--tunova-nakamas-gradient)",
    isNFT: true,
    requiredNFT: "Nakamas Genesis NFT",
    isOwned: true,
    tracks: [
      { id: "n1", title: "Digital Nostalgia", artist: "Neo Samurai", duration: "3:30", audioUrl: "" },
      { id: "n2", title: "Pirate's Anthem", artist: "Digital Pirates", duration: "4:12", audioUrl: "" },
      { id: "n3", title: "Sunset Drive", artist: "Retro Dreamers", duration: "5:30", audioUrl: "" },
      { id: "n4", title: "System Override", artist: "Binary Beats", duration: "3:20", audioUrl: "" },
      { id: "n5", title: "Neon Lights", artist: "Neon Ninjas", duration: "4:45", audioUrl: "" },
      { id: "n6", title: "Cyber Dreams", artist: "Tokyo Drift", duration: "3:55", audioUrl: "" },
      { id: "n7", title: "Bass Odyssey", artist: "Sub Frequency", duration: "4:20", audioUrl: "" },
      { id: "n8", title: "Glitch Paradise", artist: "Error404", duration: "3:40", audioUrl: "" },
      { id: "n9", title: "Retro Wave", artist: "80s Forever", duration: "4:00", audioUrl: "" },
      { id: "n10", title: "Blockchain Beats", artist: "Crypto Vibes", duration: "3:25", audioUrl: "" },
    ],
  },
  
  // RazAzaR RAZA - 4 tracks
  {
    id: "raza-edition",
    name: "RazAzaR: RAZA",
    type: "raza",
    description: "Brutalismo Elegante",
    artwork: "⚪",
    color: "var(--tunova-raza-gradient)",
    isNFT: true,
    requiredNFT: "RazAzaR RAZA NFT",
    isOwned: true,
    tracks: [
      { id: "r1", title: "Minimal Minds", artist: "RazAzaR", duration: "4:30", audioUrl: "" },
      { id: "r2", title: "Clean Lines", artist: "RazAzaR", duration: "3:50", audioUrl: "" },
      { id: "r3", title: "Elegant Brutalism", artist: "RazAzaR", duration: "5:10", audioUrl: "" },
      { id: "r4", title: "White Space", artist: "RazAzaR", duration: "4:00", audioUrl: "" },
    ],
  },
  
  // RazAzaR AZAR - 4 tracks
  {
    id: "azar-edition",
    name: "RazAzaR: AZAR",
    type: "azar",
    description: "Caos Generativo",
    artwork: "⚫",
    color: "var(--tunova-azar-gradient)",
    isNFT: true,
    requiredNFT: "RazAzaR AZAR NFT",
    isOwned: true,
    tracks: [
      { id: "a1", title: "Chaos Theory", artist: "RazAzaR", duration: "4:45", audioUrl: "" },
      { id: "a2", title: "Glitch Reality", artist: "RazAzaR", duration: "3:30", audioUrl: "" },
      { id: "a3", title: "Random Access", artist: "RazAzaR", duration: "5:20", audioUrl: "" },
      { id: "a4", title: "Digital Entropy", artist: "RazAzaR", duration: "4:15", audioUrl: "" },
    ],
  },
  
  // Radio Pirata - Gratis
  {
    id: "radio-pirata",
    name: "Radio Pirata 24/7",
    type: "radio",
    description: "Gana puntos escuchando",
    artwork: "📻",
    color: "linear-gradient(135deg, #00AA00 0%, #00CCCC 100%)",
    isNFT: false,
    isOwned: true,
    tracks: [
      { id: "radio", title: "Live Mix - TUNOVA Ecosystem", artist: "Radio Pirata", duration: "∞", audioUrl: "" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

interface TunovaAppImprovedProps {
  userNFTs?: string[];
  walletAddress?: string;
}

export function TunovaAppImproved({ 
  userNFTs = [], 
  walletAddress 
}: TunovaAppImprovedProps) {
  // Estado de la colección activa
  const [activeCollection, setActiveCollection] = useState<CollectionType>("vahoman");
  
  // Estado del Walkman
  const [selectedCassette, setSelectedCassette] = useState<Cassette | null>(null);
  const [isInserted, setIsInserted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  
  // Sistema de Recompensas
  const [listeningPoints, setListeningPoints] = useState(0);
  const [listeningTime, setListeningTime] = useState(0);
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  
  // Visualizador
  const [visualizerBars, setVisualizerBars] = useState<number[]>(
    Array(50).fill(0).map(() => Math.random() * 100)
  );
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Filtrar casetes por colección activa
  const getFilteredCassettes = (): Cassette[] => {
    return CASSETTES.filter(c => {
      if (c.type === "radio") return true; // Radio siempre visible
      return c.type === activeCollection;
    }).map(cassette => ({
      ...cassette,
      isOwned: !cassette.isNFT || 
               cassette.requiredNFT === undefined || 
               userNFTs.includes(cassette.requiredNFT)
    }));
  };
  
  const filteredCassettes = getFilteredCassettes();
  
  // Sistema de puntos para Radio Pirata
  useEffect(() => {
    if (isPlaying && selectedCassette?.type === "radio") {
      const interval = setInterval(() => {
        setListeningTime(prev => prev + 1);
        
        // Ganar 1 punto cada 60 segundos
        if (listeningTime > 0 && listeningTime % 60 === 0) {
          setListeningPoints(prev => prev + 1);
          setShowRewardNotification(true);
          setTimeout(() => setShowRewardNotification(false), 3000);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, listeningTime, selectedCassette]);
  
  // Visualizador animado
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVisualizerBars(prev => 
          prev.map(() => Math.random() * 100)
        );
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);
  
  // Handlers
  const handleInsertCassette = (cassette: Cassette) => {
    if (!cassette.isOwned) {
      alert(`Necesitas el NFT: ${cassette.requiredNFT}`);
      return;
    }
    
    setSelectedCassette(cassette);
    setIsInserted(true);
    setCurrentTrack(0);
    
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
    }, 500);
  };
  
  const handlePlayPause = () => {
    if (!isInserted || !selectedCassette) return;
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (!selectedCassette || selectedCassette.type === "radio") return;
    setCurrentTrack((prev) => (prev + 1) % selectedCassette.tracks.length);
  };
  
  const handlePrev = () => {
    if (!selectedCassette || selectedCassette.type === "radio") return;
    setCurrentTrack((prev) => 
      (prev - 1 + selectedCassette.tracks.length) % selectedCassette.tracks.length
    );
  };
  
  const currentTrackData = selectedCassette?.tracks[currentTrack];
  
  return (
    <div className="tunova-container">
      {/* Header - Navegación */}
      <header className="tunova-header">
        <div className="tunova-logo">TUNOVA.IO</div>
        
        <nav className="tunova-collection-nav">
          {WALKMAN_COLLECTIONS.map((collection) => (
            <button
              key={collection.id}
              className={`tunova-collection-btn ${
                activeCollection === collection.id ? "active" : ""
              }`}
              onClick={() => setActiveCollection(collection.id)}
            >
              {collection.displayName}
            </button>
          ))}
        </nav>
      </header>
      
      {/* Contenido Principal */}
      <main className="tunova-main">
        {/* Estantería de Casetes */}
        <aside className="tunova-shelf-container">
          <div className="tunova-shelf-header">
            <h3 className="tunova-shelf-title">
              📼 MI COLECCIÓN
            </h3>
            <p className="tunova-shelf-count">
              {filteredCassettes.filter(c => c.isOwned).length} / {filteredCassettes.length} casetes
            </p>
          </div>
          
          <div className="tunova-cassettes-grid">
            {filteredCassettes.map((cassette) => (
              <motion.button
                key={cassette.id}
                onClick={() => handleInsertCassette(cassette)}
                disabled={!cassette.isOwned}
                whileHover={{ scale: cassette.isOwned ? 1.05 : 1 }}
                whileTap={{ scale: cassette.isOwned ? 0.95 : 1 }}
                className={`tunova-cassette-card ${!cassette.isOwned ? "locked" : ""}`}
                style={{ 
                  background: cassette.isOwned 
                    ? `linear-gradient(135deg, ${cassette.color})` 
                    : undefined 
                }}
              >
                <div className="tunova-nft-badge">
                  {cassette.isNFT && (
                    cassette.isOwned ? (
                      <Unlock size={16} color="var(--tunova-accent-neon-green)" />
                    ) : (
                      <Lock size={16} color="#FF4444" />
                    )
                  )}
                </div>
                
                <div className="tunova-cassette-artwork">
                  {cassette.artwork}
                </div>
                
                <div className="tunova-cassette-info">
                  <h4 className="tunova-cassette-name">{cassette.name}</h4>
                  <p className="tunova-cassette-desc">{cassette.description}</p>
                  
                  <div className="tunova-cassette-meta">
                    <span className="tunova-cassette-tracks">
                      {cassette.tracks.length} {cassette.type === "radio" ? "Stream" : "tracks"}
                    </span>
                    {cassette.type === "radio" && (
                      <span className="tunova-cassette-badge">GRATIS</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </aside>
        
        {/* Walkman Principal */}
        <div className="tunova-walkman-container">
          <div className="tunova-walkman">
            {/* Header del Walkman */}
            <div className="tunova-walkman-header">
              <h2 className="tunova-walkman-logo">TUNOVA.IO</h2>
              <p className="tunova-walkman-subtitle">Walkman Genesis Edition</p>
            </div>
            
            {/* Compartimento del Casete */}
            <div className="tunova-cassette-compartment">
              <div className="tunova-cassette-window">
                <AnimatePresence>
                  {isInserted && selectedCassette ? (
                    <motion.div
                      initial={{ y: -200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -200, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="tunova-cassette-inserted"
                      style={{ background: selectedCassette.color }}
                    >
                      <div className="tunova-cassette-inserted-artwork">
                        {selectedCassette.artwork}
                      </div>
                      <h3 className="tunova-cassette-inserted-name">
                        {selectedCassette.name}
                      </h3>
                      
                      {/* Carretes girando */}
                      {isPlaying && (
                        <div className="tunova-cassette-reels">
                          <div className="tunova-reel spinning" />
                          <div className="tunova-reel spinning" />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="tunova-empty-message"
                    >
                      Inserta un casete<br />de tu colección
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Display LCD */}
            <div className="tunova-lcd-display">
              {isInserted && currentTrackData ? (
                <>
                  <div className="tunova-lcd-header">
                    <span>TRACK {currentTrack + 1}/{selectedCassette?.tracks.length}</span>
                    <span>{isPlaying ? "▶" : "⏸"}</span>
                  </div>
                  <div className="tunova-lcd-title">{currentTrackData.title}</div>
                  <div className="tunova-lcd-artist">{currentTrackData.artist}</div>
                  {currentTrackData.language && (
                    <div className="tunova-lcd-language">{currentTrackData.language}</div>
                  )}
                  {selectedCassette?.type === "radio" && (
                    <div className="tunova-lcd-rewards">
                      <Zap size={14} />
                      <span>
                        {Math.floor(listeningTime / 60)}:{(listeningTime % 60).toString().padStart(2, '0')} | {listeningPoints} pts
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="tunova-lcd-empty">NO CASSETTE</div>
              )}
            </div>
            
            {/* Controles */}
            <div className="tunova-controls">
              <div className="tunova-controls-buttons">
                <button
                  onClick={handlePrev}
                  disabled={!isInserted || selectedCassette?.type === "radio"}
                  className="tunova-control-btn"
                  title="Previous"
                >
                  <SkipBack size={20} />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  disabled={!isInserted}
                  className="tunova-control-btn play-pause"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!isInserted || selectedCassette?.type === "radio"}
                  className="tunova-control-btn"
                  title="Next"
                >
                  <SkipForward size={20} />
                </button>
                
                <button
                  onClick={handleEjectCassette}
                  disabled={!isInserted}
                  className="tunova-control-btn eject"
                  title="Eject"
                >
                  <Square size={20} />
                </button>
              </div>
              
              {/* Control de Volumen */}
              <div className="tunova-volume-control">
                <Volume2 size={20} className="tunova-volume-icon" />
                <div className="tunova-volume-slider">
                  <div 
                    className="tunova-volume-fill" 
                    style={{ width: `${volume}%` }}
                  >
                    <div className="tunova-volume-thumb" />
                  </div>
                </div>
                <span className="tunova-volume-value">{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer - Visualizador */}
      <footer className="tunova-footer">
        <div className="tunova-visualizer">
          {visualizerBars.map((height, index) => (
            <div
              key={index}
              className={`tunova-visualizer-bar ${isPlaying ? "active" : ""}`}
              style={{ height: isPlaying ? `${height}%` : "10%" }}
            />
          ))}
        </div>
      </footer>
      
      {/* Panel de Recompensas */}
      <div className="tunova-rewards-panel">
        <div className="tunova-rewards-header">
          <Award size={24} className="tunova-rewards-icon" />
          <h4 className="tunova-rewards-title">Airdrop Points</h4>
        </div>
        <div className="tunova-rewards-points">{listeningPoints} pts</div>
        <p className="tunova-rewards-desc">
          Escucha Radio Pirata para ganar puntos
        </p>
      </div>
      
      {/* Notificación de Recompensa */}
      <AnimatePresence>
        {showRewardNotification && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="tunova-reward-notification"
          >
            <Zap size={32} className="tunova-reward-notification-icon" />
            <div>
              <div className="tunova-reward-notification-text">+1 Punto!</div>
              <div className="tunova-reward-notification-subtext">Sigue escuchando...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
