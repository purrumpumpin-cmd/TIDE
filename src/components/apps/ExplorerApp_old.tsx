/**
 * TIDElabs - EXPLORER.EXE
 * Tu Bóveda de Activos NFT
 */

import { Package, Image, FileText, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface NFTAsset {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  type: "nft" | "token";
}

const MOCK_ASSETS: NFTAsset[] = [
  {
    id: "1",
    name: "Casete Genesis #001",
    collection: "TIDElabs Music",
    imageUrl: "https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=400",
    type: "nft",
  },
  {
    id: "2",
    name: "Nakama Badge - Grumete",
    collection: "TIDElabs Membership",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
    type: "nft",
  },
];

interface ExplorerAppProps {
  walletAddress?: string;
}

export function ExplorerApp({ walletAddress }: ExplorerAppProps) {
  if (!walletAddress) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white font-win95 p-8 text-center">
        <Package size={64} className="text-[var(--color-raza-gray)] mb-4" />
        <h3 className="font-brutalist text-xl mb-2">Wallet No Conectada</h3>
        <p className="text-[var(--color-raza-gray)]">
          Conecta tu wallet para ver tus activos NFT.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <h2 className="font-brutalist tracking-wider">EXPLORER.EXE</h2>
        <p className="text-xs mt-1">Tu Bóveda de Activos</p>
      </div>

      {/* Wallet Info */}
      <div className="p-4 border-b-2 border-[var(--color-raza-gray)] flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--color-raza-gray)]">Wallet Conectada</p>
          <p className="font-brutalist text-sm text-[var(--color-raza-accent)]">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
        <button className="win95-bevel-out bg-[var(--color-win95-face)] px-3 py-1 text-xs hover:win95-bevel-in flex items-center gap-2">
          <ExternalLink size={12} />
          Ver en Etherscan
        </button>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <h3 className="font-brutalist mb-2 flex items-center gap-2">
            <Image size={16} />
            NFTs Coleccionables
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {MOCK_ASSETS.map((asset, idx) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="win95-bevel-out bg-white overflow-hidden cursor-pointer hover:win95-bevel-in"
            >
              <div className="aspect-square bg-[var(--color-raza-gray)] relative overflow-hidden">
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="font-brutalist text-xs mb-1">{asset.name}</p>
                <p className="text-[10px] text-[var(--color-raza-gray)]">{asset.collection}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {MOCK_ASSETS.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="text-[var(--color-raza-gray)] mx-auto mb-4" />
            <p className="text-[var(--color-raza-gray)]">No tienes NFTs en tu wallet.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t-2 border-[var(--color-raza-gray)] text-center">
        <p className="text-xs text-[var(--color-raza-gray)]">
          Total de activos: {MOCK_ASSETS.length}
        </p>
      </div>
    </div>
  );
}
