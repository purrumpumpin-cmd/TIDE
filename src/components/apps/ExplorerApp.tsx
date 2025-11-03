/**
 * TIDElabs - EXPLORER.EXE
 * Tu Bóveda de Activos NFT y Drops de Raza/Azar
 */

import { useState, useEffect } from "react";
import { Package, Image, ExternalLink, Eye, Coins, Star, Clock, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NFTAsset {
  id: string;
  name: string;
  description?: string;
  collection: string;
  imageUrl: string;
  type: "nft" | "token";
  contractAddress?: string;
  tokenId?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  opensea_url?: string;
}

interface RazaAzarDrop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: "raza" | "azar";
  price?: number;
  currency?: string;
  available: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Mock data for Raza/Azar drops
const RAZA_AZAR_DROPS: RazaAzarDrop[] = [
  {
    id: "raza-001",
    name: "Capitán Pirata Genesis",
    description: "El primer NFT de la colección RAZA, representa el espíritu pionero de los NAKAMAS.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    collection: "raza",
    price: 0.1,
    currency: "ETH",
    available: true,
    rarity: "legendary",
    attributes: [
      { trait_type: "Tipo", value: "Capitán" },
      { trait_type: "Rareza", value: "Legendario" },
      { trait_type: "Poder", value: "100" },
      { trait_type: "Elemento", value: "Agua" }
    ]
  },
  {
    id: "azar-001",
    name: "Casete Synthwave #001",
    description: "Casete musical NFT con tracks exclusivos de artistas NAKAMA.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    collection: "azar",
    price: 0.05,
    currency: "ETH",
    available: true,
    rarity: "epic",
    attributes: [
      { trait_type: "Género", value: "Synthwave" },
      { trait_type: "Duración", value: "45 min" },
      { trait_type: "Artista", value: "NAKAMA Collective" },
      { trait_type: "Año", value: "2024" }
    ]
  },
  {
    id: "raza-002",
    name: "Navegante Místico",
    description: "Un navegante experto en los mares digitales del metaverso.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    collection: "raza",
    price: 0.08,
    currency: "ETH",
    available: false,
    rarity: "rare",
    attributes: [
      { trait_type: "Tipo", value: "Navegante" },
      { trait_type: "Rareza", value: "Raro" },
      { trait_type: "Poder", value: "75" },
      { trait_type: "Elemento", value: "Viento" }
    ]
  }
];

export function ExplorerApp() {
  const [userNFTs, setUserNFTs] = useState<NFTAsset[]>([]);
  const [selectedTab, setSelectedTab] = useState<'owned' | 'drops'>('drops');
  const [selectedNFT, setSelectedNFT] = useState<NFTAsset | RazaAzarDrop | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'raza' | 'azar'>('all');
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));

  useEffect(() => {
    if (walletAddress && selectedTab === 'owned') {
      loadUserNFTs();
    }
  }, [walletAddress, selectedTab]);

  const loadUserNFTs = async () => {
    setLoading(true);
    try {
      // In production, use Moralis/Alchemy API to fetch real NFTs
      // For now, simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUserNFTs: NFTAsset[] = [
        {
          id: "user-1",
          name: "NAKAMA Badge - Grumete",
          description: "Badge de membresía para el tier Grumete",
          collection: "TIDElabs Membership",
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
          type: "nft",
          rarity: "common",
          attributes: [
            { trait_type: "Tier", value: "Grumete" },
            { trait_type: "Fecha", value: "2024" }
          ]
        }
      ];
      
      setUserNFTs(mockUserNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-100';
      case 'epic': return 'text-purple-500 bg-purple-100';
      case 'rare': return 'text-blue-500 bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getFilteredDrops = () => {
    if (filter === 'all') return RAZA_AZAR_DROPS;
    return RAZA_AZAR_DROPS.filter(drop => drop.collection === filter);
  };

  const handlePurchase = (drop: RazaAzarDrop) => {
    if (!walletAddress) {
      alert('Conecta tu wallet para comprar NFTs');
      return;
    }
    
    // In production, integrate with smart contract
    alert(`Funcionalidad de compra para ${drop.name} será implementada próximamente`);
  };

  if (!walletAddress && selectedTab === 'owned') {
    return (
      <div className="h-full flex flex-col bg-white font-win95">
        <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
          <h2 className="font-brutalist tracking-wider">EXPLORER.EXE</h2>
          <p className="text-xs mt-1">Tu Bóveda de Activos NFT</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <Package size={64} className="text-[var(--color-raza-gray)] mb-4 mx-auto" />
            <h3 className="font-brutalist text-xl mb-2">Wallet No Conectada</h3>
            <p className="text-[var(--color-raza-gray)] mb-4">
              Conecta tu wallet para ver tus activos NFT.
            </p>
            <button
              onClick={() => setSelectedTab('drops')}
              className="win95-bevel-out bg-[var(--color-raza-accent)] text-white px-4 py-2 font-brutalist hover:win95-bevel-in"
            >
              VER DROPS DISPONIBLES
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <h2 className="font-brutalist tracking-wider">EXPLORER.EXE</h2>
        <p className="text-xs mt-1">Bóveda NFT & Drops de Raza/Azar</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[var(--color-win95-shadow)]">
        <button
          onClick={() => setSelectedTab('drops')}
          className={`px-6 py-3 font-brutalist text-sm ${
            selectedTab === 'drops'
              ? 'bg-white win95-bevel-out'
              : 'bg-[var(--color-win95-face)] hover:bg-white'
          }`}
        >
          🎯 DROPS RAZA/AZAR
        </button>
        <button
          onClick={() => setSelectedTab('owned')}
          className={`px-6 py-3 font-brutalist text-sm ${
            selectedTab === 'owned'
              ? 'bg-white win95-bevel-out'
              : 'bg-[var(--color-win95-face)] hover:bg-white'
          }`}
        >
          📦 MIS NFTs
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {selectedTab === 'drops' && (
          <div>
            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span className="font-brutalist text-sm">FILTRAR:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'TODOS' },
                  { id: 'raza', label: 'RAZA' },
                  { id: 'azar', label: 'AZAR' }
                ].map(filterOption => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id as any)}
                    className={`px-3 py-1 text-xs font-brutalist ${
                      filter === filterOption.id
                        ? 'bg-[var(--color-raza-accent)] text-white win95-bevel-out'
                        : 'bg-[var(--color-win95-face)] win95-bevel-out hover:win95-bevel-in'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {getFilteredDrops().map((drop) => (
                  <motion.div
                    key={drop.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="win95-bevel-out bg-white p-4 hover:win95-bevel-in transition-all cursor-pointer"
                    onClick={() => setSelectedNFT(drop)}
                  >
                    {/* Image */}
                    <div className="relative mb-3">
                      <img
                        src={drop.imageUrl}
                        alt={drop.name}
                        className="w-full h-48 object-cover win95-bevel-in"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-brutalist ${getRarityColor(drop.rarity)}`}>
                        {drop.rarity.toUpperCase()}
                      </div>
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-brutalist ${
                        drop.collection === 'raza' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {drop.collection.toUpperCase()}
                      </div>
                    </div>

                    {/* Info */}
                    <h4 className="font-brutalist text-sm mb-2">{drop.name}</h4>
                    <p className="text-xs text-[var(--color-raza-gray)] mb-3 line-clamp-2">
                      {drop.description}
                    </p>

                    {/* Price & Status */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Coins size={12} />
                        <span className="text-sm font-brutalist">
                          {drop.price} {drop.currency}
                        </span>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        drop.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {drop.available ? 'DISPONIBLE' : 'AGOTADO'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {selectedTab === 'owned' && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">Cargando tus NFTs...</div>
              </div>
            ) : userNFTs.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-brutalist mb-2">No tienes NFTs aún</p>
                <p className="text-sm text-[var(--color-raza-gray)] mb-4">
                  Compra tu primer NFT en la sección de Drops
                </p>
                <button
                  onClick={() => setSelectedTab('drops')}
                  className="win95-bevel-out bg-[var(--color-raza-accent)] text-white px-4 py-2 font-brutalist hover:win95-bevel-in"
                >
                  VER DROPS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNFTs.map((nft) => (
                  <div
                    key={nft.id}
                    className="win95-bevel-out bg-white p-4 hover:win95-bevel-in transition-all cursor-pointer"
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-48 object-cover win95-bevel-in mb-3"
                    />
                    <h4 className="font-brutalist text-sm mb-2">{nft.name}</h4>
                    <p className="text-xs text-[var(--color-raza-gray)]">{nft.collection}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white win95-bevel-out p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-brutalist text-lg">{selectedNFT.name}</h3>
              <button
                onClick={() => setSelectedNFT(null)}
                className="win95-bevel-out bg-red-500 text-white px-3 py-1 text-xs font-brutalist hover:win95-bevel-in"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedNFT.imageUrl}
              alt={selectedNFT.name}
              className="w-full h-64 object-cover win95-bevel-in mb-4"
            />

            <div className="space-y-4">
              <div>
                <h4 className="font-brutalist text-sm mb-2">DESCRIPCIÓN</h4>
                <p className="text-xs text-[var(--color-raza-gray)]">
                  {selectedNFT.description || 'Sin descripción disponible'}
                </p>
              </div>

              {'collection' in selectedNFT && (
                <div>
                  <h4 className="font-brutalist text-sm mb-2">COLECCIÓN</h4>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-brutalist ${
                    selectedNFT.collection === 'raza' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {selectedNFT.collection.toUpperCase()}
                  </div>
                </div>
              )}

              {selectedNFT.attributes && (
                <div>
                  <h4 className="font-brutalist text-sm mb-2">ATRIBUTOS</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNFT.attributes.map((attr, index) => (
                      <div key={index} className="win95-bevel-in bg-[var(--color-win95-face)] p-2">
                        <div className="text-xs font-brutalist">{attr.trait_type}</div>
                        <div className="text-xs text-[var(--color-raza-gray)]">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {'price' in selectedNFT && selectedNFT.available && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePurchase(selectedNFT as RazaAzarDrop)}
                    className="flex-1 win95-bevel-out bg-[var(--color-raza-accent)] text-white py-2 font-brutalist hover:win95-bevel-in"
                  >
                    COMPRAR {selectedNFT.price} {selectedNFT.currency}
                  </button>
                  <button className="win95-bevel-out bg-[var(--color-win95-face)] px-3 py-2 hover:win95-bevel-in">
                    <Eye size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}