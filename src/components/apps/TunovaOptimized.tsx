/**
 * TUNOVA.IO - Versión Optimizada con Integraciones Externas
 * Walkmans Retro + Web3 listos para agregar links
 */

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Square, Volume2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN DE SERVICIOS EXTERNOS
// ═══════════════════════════════════════════════════════════

const EXTERNAL_SERVICES = {
  // 🎵 MÚSICA - Agrega tus links aquí
  music: {
    spotify: {
      enabled: true,
      embedBase: "https://open.spotify.com/embed/track/", // + TRACK_ID
      apiBase: "https://api.spotify.com/v1/",
      // Ejemplo: "3n3Ppam7vgaVa1iaRUc9Lp" para un track
    },
    soundcloud: {
      enabled: true,
      embedBase: "https://w.soundcloud.com/player/?url=", // + TRACK_URL
      apiBase: "https://api.soundcloud.com/",
    },
    audius: {
      enabled: true,
      embedBase: "https://audius.co/embed/track/", // + TRACK_ID
      apiBase: "https://api.audius.co/v1/",
    },
  },
  
  // 🖼️ NFTs - Agrega tus contratos aquí
  nfts: {
    opensea: {
      enabled: true,
      apiBase: "https://api.opensea.io/api/v2/",
      // Ejemplo de colección: "0x..." (contract address)
      collections: {
        vahoman: "", // AGREGAR CONTRACT ADDRESS
        nakamas: "", // AGREGAR CONTRACT ADDRESS
        raza: "", // AGREGAR CONTRACT ADDRESS
        azar: "", // AGREGAR CONTRACT ADDRESS
      },
    },
    magic_eden: {
      enabled: true,
      apiBase: "https://api-mainnet.magiceden.dev/v2/",
      collections: {
        vahoman: "", // AGREGAR COLLECTION SLUG
        nakamas: "", // AGREGAR COLLECTION SLUG
        raza: "", // AGREGAR COLLECTION SLUG
        azar: "", // AGREGAR COLLECTION SLUG
      },
    },
  },
  
  // 🔗 BLOCKCHAIN
  web3: {
    rpcUrls: {
      ethereum: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY", // AGREGAR API KEY
      polygon: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY", // AGREGAR API KEY
      solana: "https://api.mainnet-beta.solana.com",
    },
    walletConnect: {
      projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // AGREGAR PROJECT ID
    },
  },
};

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  // Links externos
  spotifyId?: string;
  soundcloudUrl?: string;
  audiusId?: string;
  ipfsHash?: string;
}

interface Collection {
  id: "vahoman" | "nakamas" | "raza" | "azar";
  name: string;
  displayName: string;
  description: string;
  walkmanImage: string;
  color: string;
  gradient: string;
  tracks: Track[];
  // NFT Config
  nftRequired: boolean;
  nftContract?: string;
  nftChain?: "ethereum" | "polygon" | "solana";
}

// ═══════════════════════════════════════════════════════════
// COLECCIONES CON WALKMANS PERSONALIZADOS
// ═══════════════════════════════════════════════════════════

const COLLECTIONS: Collection[] = [
  {
    id: "vahoman",
    name: "Vah0m4n",
    displayName: "VAH0M4N",
    description: "Rey de los Emprendedores - 8 Idiomas Edition",
    walkmanImage: "/assets/walkman_vahoman.png",
    color: "#FFB900",
    gradient: "linear-gradient(135deg, #FFB900 0%, #FF8C00 100%)",
    nftRequired: true,
    nftContract: "", // AGREGAR CONTRACT ADDRESS
    nftChain: "ethereum",
    tracks: [
      {
        id: "v1",
        title: "Rey de los Emprendedores",
        artist: "Vah0m4n",
        duration: "3:45",
        spotifyId: "", // AGREGAR SPOTIFY TRACK ID
        soundcloudUrl: "", // AGREGAR SOUNDCLOUD URL
      },
      // ... más tracks
    ],
  },
  {
    id: "nakamas",
    name: "NAKAMAS",
    displayName: "NAKAMAS",
    description: "Compilado del Ecosistema - 10 Artistas",
    walkmanImage: "/assets/walkman_nakamas.png",
    color: "#FF00FF",
    gradient: "linear-gradient(135deg, #9D00FF 0%, #FF00FF 100%)",
    nftRequired: true,
    nftContract: "", // AGREGAR CONTRACT ADDRESS
    nftChain: "polygon",
    tracks: [
      {
        id: "n1",
        title: "Digital Nostalgia",
        artist: "Neo Samurai",
        duration: "3:30",
        spotifyId: "", // AGREGAR SPOTIFY TRACK ID
      },
      // ... más tracks
    ],
  },
  {
    id: "raza",
    name: "RazAzaR RAZA",
    displayName: "RAZA",
    description: "Brutalismo Elegante - 4 Tracks",
    walkmanImage: "/assets/walkman_raza.png",
    color: "#FFFFFF",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, #E5E5E5 100%)",
    nftRequired: true,
    nftContract: "", // AGREGAR CONTRACT ADDRESS
    nftChain: "ethereum",
    tracks: [
      {
        id: "r1",
        title: "Minimal Minds",
        artist: "RazAzaR",
        duration: "4:30",
        spotifyId: "", // AGREGAR SPOTIFY TRACK ID
      },
      // ... más tracks
    ],
  },
  {
    id: "azar",
    name: "RazAzaR AZAR",
    displayName: "AZAR",
    description: "Caos Generativo - 4 Tracks",
    walkmanImage: "/assets/walkman_azar.png",
    color: "#00FFFF",
    gradient: "linear-gradient(135deg, #000000 0%, #1A0033 50%, #00FFFF 100%)",
    nftRequired: true,
    nftContract: "", // AGREGAR CONTRACT ADDRESS
    nftChain: "solana",
    tracks: [
      {
        id: "a1",
        title: "Chaos Theory",
        artist: "RazAzaR",
        duration: "4:45",
        spotifyId: "", // AGREGAR SPOTIFY TRACK ID
      },
      // ... más tracks
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// HOOKS PERSONALIZADOS
// ═══════════════════════════════════════════════════════════

/**
 * Hook para conectar wallet
 */
function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implementar WalletConnect o MetaMask
      // if (window.ethereum) {
      //   const accounts = await window.ethereum.request({ 
      //     method: 'eth_requestAccounts' 
      //   });
      //   setAddress(accounts[0]);
      // }
      
      // Simulación para demo
      setTimeout(() => {
        setAddress("0x1234...5678");
        setIsConnecting(false);
      }, 1000);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  return { address, isConnecting, connect, disconnect };
}

/**
 * Hook para verificar ownership de NFT
 */
function useNFTOwnership(collection: Collection, walletAddress: string | null) {
  const [isOwner, setIsOwner] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!walletAddress || !collection.nftContract) {
      setIsOwner(false);
      return;
    }

    const checkOwnership = async () => {
      setIsChecking(true);
      try {
        // TODO: Implementar verificación real con OpenSea API o Web3
        // const response = await fetch(
        //   `${EXTERNAL_SERVICES.nfts.opensea.apiBase}chain/${collection.nftChain}/account/${walletAddress}/nfts?collection=${collection.nftContract}`
        // );
        // const data = await response.json();
        // setIsOwner(data.nfts.length > 0);
        
        // Simulación para demo
        setTimeout(() => {
          setIsOwner(true); // Para testing, cambiar a false en producción
          setIsChecking(false);
        }, 500);
      } catch (error) {
        console.error("Error checking NFT ownership:", error);
        setIsOwner(false);
        setIsChecking(false);
      }
    };

    checkOwnership();
  }, [walletAddress, collection]);

  return { isOwner, isChecking };
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function TunovaOptimized() {
  const [activeCollection, setActiveCollection] = useState<Collection>(COLLECTIONS[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  
  const { address, isConnecting, connect, disconnect } = useWallet();
  const { isOwner, isChecking } = useNFTOwnership(activeCollection, address);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = activeCollection.tracks[currentTrackIndex];

  // Handlers
  const handlePlayPause = () => {
    if (!isOwner && activeCollection.nftRequired) {
      alert(`Necesitas el NFT de ${activeCollection.name} para escuchar esta colección`);
      return;
    }
    
    setIsPlaying(!isPlaying);
    
    // TODO: Implementar reproducción real
    // if (audioRef.current) {
    //   if (isPlaying) {
    //     audioRef.current.pause();
    //   } else {
    //     audioRef.current.play();
    //   }
    // }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % activeCollection.tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(
      (prev) => (prev - 1 + activeCollection.tracks.length) % activeCollection.tracks.length
    );
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTrackIndex(0);
  };

  // Construir URL del embed de Spotify si está disponible
  const getSpotifyEmbedUrl = (track: Track) => {
    if (track.spotifyId && EXTERNAL_SERVICES.music.spotify.enabled) {
      return `${EXTERNAL_SERVICES.music.spotify.embedBase}${track.spotifyId}`;
    }
    return null;
  };

  return (
    <div className="tunova-optimized">
      {/* Header */}
      <header className="tunova-header">
        <div className="tunova-logo">
          <h1>TUNOVA.IO</h1>
          <p>Web3 Music Platform</p>
        </div>

        <div className="tunova-wallet">
          {address ? (
            <button onClick={disconnect} className="tunova-wallet-btn connected">
              <Wallet size={20} />
              <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
            </button>
          ) : (
            <button 
              onClick={connect} 
              className="tunova-wallet-btn"
              disabled={isConnecting}
            >
              <Wallet size={20} />
              <span>{isConnecting ? "Conectando..." : "Conectar Wallet"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Collection Selector */}
      <nav className="tunova-collection-nav">
        {COLLECTIONS.map((collection) => (
          <button
            key={collection.id}
            onClick={() => {
              setActiveCollection(collection);
              setCurrentTrackIndex(0);
              setIsPlaying(false);
            }}
            className={`tunova-collection-btn ${
              activeCollection.id === collection.id ? "active" : ""
            }`}
            style={{
              background: activeCollection.id === collection.id ? collection.gradient : undefined,
            }}
          >
            {collection.displayName}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="tunova-main">
        {/* Walkman Display */}
        <div className="tunova-walkman-container">
          <motion.div
            key={activeCollection.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="tunova-walkman"
          >
            <img
              src={activeCollection.walkmanImage}
              alt={`${activeCollection.name} Walkman`}
              className="tunova-walkman-image"
            />
            
            {/* Overlay de bloqueo si no tiene NFT */}
            {activeCollection.nftRequired && !isOwner && (
              <div className="tunova-walkman-locked">
                <div className="tunova-lock-icon">🔒</div>
                <p>NFT Requerido</p>
                <button onClick={connect} className="tunova-unlock-btn">
                  {address ? "Verifica tu NFT" : "Conectar Wallet"}
                </button>
              </div>
            )}
          </motion.div>

          {/* Collection Info */}
          <div className="tunova-collection-info">
            <h2>{activeCollection.name}</h2>
            <p>{activeCollection.description}</p>
            <div className="tunova-nft-status">
              {isChecking ? (
                <span className="tunova-status checking">Verificando NFT...</span>
              ) : isOwner ? (
                <span className="tunova-status owned">✓ NFT Verificado</span>
              ) : (
                <span className="tunova-status locked">🔒 NFT Requerido</span>
              )}
            </div>
          </div>
        </div>

        {/* Track Info & Controls */}
        <div className="tunova-player">
          {/* Current Track */}
          <div className="tunova-track-info">
            <div className="tunova-track-number">
              TRACK {currentTrackIndex + 1} / {activeCollection.tracks.length}
            </div>
            <h3 className="tunova-track-title">{currentTrack.title}</h3>
            <p className="tunova-track-artist">{currentTrack.artist}</p>
            <p className="tunova-track-duration">{currentTrack.duration}</p>
          </div>

          {/* Spotify Embed (si está disponible) */}
          {getSpotifyEmbedUrl(currentTrack) && isOwner && (
            <div className="tunova-embed-container">
              <iframe
                src={getSpotifyEmbedUrl(currentTrack)!}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${currentTrack.title} - ${currentTrack.artist}`}
              />
            </div>
          )}

          {/* Controls */}
          <div className="tunova-controls">
            <button
              onClick={handlePrev}
              className="tunova-control-btn"
              disabled={!isOwner && activeCollection.nftRequired}
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={handlePlayPause}
              className="tunova-control-btn play-pause"
              disabled={!isOwner && activeCollection.nftRequired}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button
              onClick={handleNext}
              className="tunova-control-btn"
              disabled={!isOwner && activeCollection.nftRequired}
            >
              <SkipForward size={24} />
            </button>

            <button
              onClick={handleStop}
              className="tunova-control-btn stop"
              disabled={!isOwner && activeCollection.nftRequired}
            >
              <Square size={24} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="tunova-volume-control">
            <Volume2 size={20} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="tunova-volume-slider"
              disabled={!isOwner && activeCollection.nftRequired}
            />
            <span className="tunova-volume-value">{volume}%</span>
          </div>
        </div>

        {/* Tracklist */}
        <div className="tunova-tracklist">
          <h4>Tracklist</h4>
          <div className="tunova-tracks">
            {activeCollection.tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  if (isOwner || !activeCollection.nftRequired) {
                    setCurrentTrackIndex(index);
                    setIsPlaying(false);
                  }
                }}
                className={`tunova-track-item ${
                  index === currentTrackIndex ? "active" : ""
                } ${!isOwner && activeCollection.nftRequired ? "locked" : ""}`}
              >
                <span className="tunova-track-num">{index + 1}</span>
                <div className="tunova-track-details">
                  <span className="tunova-track-name">{track.title}</span>
                  <span className="tunova-track-artist-small">{track.artist}</span>
                </div>
                <span className="tunova-track-time">{track.duration}</span>
                {!isOwner && activeCollection.nftRequired && (
                  <span className="tunova-track-lock">🔒</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="tunova-footer">
        <div className="tunova-links">
          <a href="#" target="_blank" rel="noopener noreferrer">OpenSea</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Magic Eden</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
        <p className="tunova-copyright">
          © 2025 TUNOVA.IO - Web3 Music Platform
        </p>
      </footer>

      {/* Audio Element (oculto) */}
      <audio ref={audioRef} />
    </div>
  );
}
