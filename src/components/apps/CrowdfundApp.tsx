/**
 * TIDElabs - CROWDFUND.WEB3
 * Tesoro Compartido - Sistema de Crowdfunding Web3
 */

import { useState, useEffect } from "react";
import { DollarSign, Users, Anchor, Crown, Coins, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../utils/supabase/client";
import { pointsApi } from "../../utils/api";

interface CrowdfundTier {
  name: string;
  minAmount: number;
  icon: React.ReactNode;
  airdropMultiplier: number;
  benefits: string[];
  color: string;
}

interface Contribution {
  id: string;
  wallet_address: string;
  amount: number;
  crypto_type: string;
  transaction_hash?: string;
  airdrop_guaranteed: number;
  created_at: string;
}

const CROWDFUND_TIERS: CrowdfundTier[] = [
  {
    name: "Grumete",
    minAmount: 1,
    icon: <Users size={24} />,
    airdropMultiplier: 1,
    benefits: [
      "5 Airdrops garantizados",
      "Acceso al MSN.CHAT",
      "Newsletter exclusiva",
      "Voto en decisiones menores"
    ],
    color: "bg-gray-500"
  },
  {
    name: "Marinero",
    minAmount: 10,
    icon: <Anchor size={24} />,
    airdropMultiplier: 2,
    benefits: [
      "10 Airdrops garantizados",
      "Todos los beneficios de Grumete",
      "NFT de Membresía",
      "Early access a productos RAZA",
      "Descuentos en TUNOVA.IO"
    ],
    color: "bg-blue-500"
  },
  {
    name: "Contramaestre",
    minAmount: 50,
    icon: <Crown size={24} />,
    airdropMultiplier: 5,
    benefits: [
      "25 Airdrops garantizados",
      "Todos los beneficios de Marinero",
      "Acceso VIP a lanzamientos AZAR",
      "Participación en gobernanza",
      "Casete Genesis NFT",
      "Llamadas privadas con el equipo"
    ],
    color: "bg-purple-500"
  },
  {
    name: "Capitán",
    minAmount: 100,
    icon: <DollarSign size={24} />,
    airdropMultiplier: 10,
    benefits: [
      "50 Airdrops garantizados",
      "Todos los beneficios de Contramaestre",
      "Co-ownership en decisiones estratégicas",
      "NFT Capitán exclusivo",
      "Revenue sharing del ecosistema",
      "Acceso a alpha testing"
    ],
    color: "bg-yellow-500"
  }
];

const SUPPORTED_CRYPTOS = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x...', network: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether USD', address: '0x...', network: 'Ethereum' },
  { symbol: 'USDC', name: 'USD Coin', address: '0x...', network: 'Ethereum' },
  { symbol: 'BNB', name: 'Binance Coin', address: '0x...', network: 'BSC' },
  { symbol: 'MATIC', name: 'Polygon', address: '0x...', network: 'Polygon' },
];

export function CrowdfundApp() {
  const [selectedTier, setSelectedTier] = useState<CrowdfundTier | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState(SUPPORTED_CRYPTOS[1]); // Default to USDT
  const [amount, setAmount] = useState<string>('');
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(false);
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    try {
      const { data, error } = await supabase
        .from('crowdfund_contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContributions(data || []);
      
      // Calculate total raised
      const total = data?.reduce((sum, contrib) => sum + contrib.amount, 0) || 0;
      setTotalRaised(total);
    } catch (error) {
      console.error('Error loading contributions:', error);
    }
  };

  const getTierForAmount = (amount: number): CrowdfundTier => {
    const sortedTiers = [...CROWDFUND_TIERS].sort((a, b) => b.minAmount - a.minAmount);
    return sortedTiers.find(tier => amount >= tier.minAmount) || CROWDFUND_TIERS[0];
  };

  const handleContribute = () => {
    if (!walletAddress) {
      alert('Conecta tu wallet para contribuir');
      return;
    }

    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount < 1) {
      alert('El monto mínimo es 1 USDT');
      return;
    }

    const tier = getTierForAmount(contributionAmount);
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const processContribution = async () => {
    if (!walletAddress || !amount || !transactionHash) return;

    try {
      setLoading(true);
      
      const contributionAmount = parseFloat(amount);
      const tier = getTierForAmount(contributionAmount);
      const airdropGuaranteed = Math.floor(contributionAmount / 10) * 5 + 5; // Base 5 + 5 per each 10 USDT

      const { error } = await supabase
        .from('crowdfund_contributions')
        .insert({
          wallet_address: walletAddress,
          amount: contributionAmount,
          crypto_type: selectedCrypto.symbol,
          transaction_hash: transactionHash,
          airdrop_guaranteed: airdropGuaranteed,
        });

      if (error) throw error;

      // Add points for contribution
      const pointsToAdd = Math.floor(contributionAmount * 10); // 10 points per USDT
      try {
        await pointsApi.addPoints(walletAddress, pointsToAdd, 'crowdfund_contribution');
      } catch (pointsError) {
        console.error('Error adding points:', pointsError);
      }

      // Reload contributions
      await loadContributions();
      
      // Reset form
      setAmount('');
      setTransactionHash('');
      setShowPaymentModal(false);
      setSelectedTier(null);
      
      alert(`¡Contribución registrada! Tier: ${tier.name}, Airdrops garantizados: ${airdropGuaranteed}`);
      
    } catch (error) {
      console.error('Error processing contribution:', error);
      alert('Error al procesar la contribución');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // TODO: Add toast notification
    console.log('Dirección copiada:', address);
  };

  const getUserContributions = () => {
    if (!walletAddress) return [];
    return contributions.filter(c => c.wallet_address === walletAddress);
  };

  const getUserTotalContribution = () => {
    return getUserContributions().reduce((sum, contrib) => sum + contrib.amount, 0);
  };

  const getUserCurrentTier = () => {
    const totalContribution = getUserTotalContribution();
    return getTierForAmount(totalContribution);
  };

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <div className="flex items-center gap-3">
          <DollarSign size={24} />
          <div>
            <h2 className="font-brutalist tracking-wider">CROWDFUND.WEB3</h2>
            <p className="text-xs mt-1">Tesoro Compartido de los NAKAMAS</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="win95-bevel-out bg-white p-4 text-center">
            <div className="text-2xl font-brutalist text-[var(--color-raza-accent)] mb-2">
              ${totalRaised.toLocaleString()}
            </div>
            <div className="text-sm text-[var(--color-raza-gray)]">Total Recaudado</div>
          </div>
          <div className="win95-bevel-out bg-white p-4 text-center">
            <div className="text-2xl font-brutalist text-[var(--color-raza-accent)] mb-2">
              {contributions.length}
            </div>
            <div className="text-sm text-[var(--color-raza-gray)]">Contribuciones</div>
          </div>
          <div className="win95-bevel-out bg-white p-4 text-center">
            <div className="text-2xl font-brutalist text-[var(--color-raza-accent)] mb-2">
              {new Set(contributions.map(c => c.wallet_address)).size}
            </div>
            <div className="text-sm text-[var(--color-raza-gray)]">NAKAMAS Únicos</div>
          </div>
        </div>

        {/* User Status */}
        {walletAddress && (
          <div className="win95-bevel-out bg-white p-4">
            <h3 className="font-brutalist text-lg mb-4">TU ESTATUS NAKAMA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-[var(--color-raza-gray)] mb-1">Contribución Total:</div>
                <div className="text-xl font-brutalist text-[var(--color-raza-accent)]">
                  ${getUserTotalContribution().toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-[var(--color-raza-gray)] mb-1">Tier Actual:</div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-white ${getUserCurrentTier().color}`}>
                  {getUserCurrentTier().icon}
                  <span className="font-brutalist">{getUserCurrentTier().name}</span>
                </div>
              </div>
            </div>
            {getUserContributions().length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-[var(--color-raza-gray)] mb-2">Tus Contribuciones:</div>
                <div className="space-y-2 max-h-32 overflow-auto">
                  {getUserContributions().map((contrib) => (
                    <div key={contrib.id} className="flex justify-between items-center text-xs bg-[var(--color-win95-face)] p-2 rounded">
                      <span>${contrib.amount} {contrib.crypto_type}</span>
                      <span>{contrib.airdrop_guaranteed} Airdrops</span>
                      <span>{new Date(contrib.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contribution Form */}
        <div className="win95-bevel-out bg-white p-6">
          <h3 className="font-brutalist text-lg mb-4">CONTRIBUIR AL TESORO</h3>
          
          {!walletAddress ? (
            <div className="text-center py-8">
              <Coins size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-4">Conecta tu wallet para contribuir</p>
              <p className="text-sm text-[var(--color-raza-gray)]">
                Apoya el proyecto y obtén Airdrops garantizados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block font-brutalist text-sm mb-2">
                  MONTO (mínimo 1 USDT)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="w-full win95-bevel-in p-3 font-win95 text-lg"
                  placeholder="0.00"
                />
              </div>

              {/* Crypto Selector */}
              <div>
                <label className="block font-brutalist text-sm mb-2">
                  CRIPTOMONEDA
                </label>
                <select
                  value={selectedCrypto.symbol}
                  onChange={(e) => setSelectedCrypto(SUPPORTED_CRYPTOS.find(c => c.symbol === e.target.value) || SUPPORTED_CRYPTOS[0])}
                  className="w-full win95-bevel-in p-3 font-win95"
                >
                  {SUPPORTED_CRYPTOS.map(crypto => (
                    <option key={crypto.symbol} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol}) - {crypto.network}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {amount && parseFloat(amount) >= 1 && (
                <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4">
                  <h4 className="font-brutalist text-sm mb-2">PREVIEW:</h4>
                  <div className="space-y-2 text-sm">
                    <div>Tier: <span className="font-brutalist">{getTierForAmount(parseFloat(amount)).name}</span></div>
                    <div>Airdrops garantizados: <span className="font-brutalist">{Math.floor(parseFloat(amount) / 10) * 5 + 5}</span></div>
                    <div>Puntos NAKAMA: <span className="font-brutalist">+{Math.floor(parseFloat(amount) * 10)}</span></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleContribute}
                disabled={!amount || parseFloat(amount) < 1}
                className="w-full win95-bevel-out bg-[var(--color-raza-accent)] text-white py-3 font-brutalist text-lg hover:win95-bevel-in disabled:opacity-50"
              >
                CONTRIBUIR AL TESORO
              </button>
            </div>
          )}
        </div>

        {/* Tiers */}
        <div className="win95-bevel-out bg-white p-6">
          <h3 className="font-brutalist text-lg mb-4">TIERS DE NAKAMAS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CROWDFUND_TIERS.map((tier) => (
              <div key={tier.name} className="win95-bevel-in bg-[var(--color-win95-face)] p-4">
                <div className={`${tier.color} text-white p-3 rounded mb-3 flex items-center justify-center`}>
                  {tier.icon}
                </div>
                <h4 className="font-brutalist text-center mb-2">{tier.name}</h4>
                <div className="text-center text-sm text-[var(--color-raza-gray)] mb-3">
                  Desde ${tier.minAmount}
                </div>
                <ul className="text-xs space-y-1">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contributions */}
        <div className="win95-bevel-out bg-white p-6">
          <h3 className="font-brutalist text-lg mb-4">CONTRIBUCIONES RECIENTES</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {contributions.slice(0, 10).map((contrib) => (
              <div key={contrib.id} className="flex justify-between items-center p-3 bg-[var(--color-win95-face)] rounded">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-brutalist">
                    {contrib.wallet_address.slice(0, 6)}...{contrib.wallet_address.slice(-4)}
                  </div>
                  <div className="text-xs text-[var(--color-raza-gray)]">
                    {new Date(contrib.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-brutalist text-[var(--color-raza-accent)]">
                    ${contrib.amount} {contrib.crypto_type}
                  </div>
                  <div className="text-xs text-[var(--color-raza-gray)]">
                    {contrib.airdrop_guaranteed} Airdrops
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white win95-bevel-out p-6 max-w-md w-full mx-4">
            <h3 className="font-brutalist text-lg mb-4">PROCESAR PAGO</h3>
            
            <div className="space-y-4">
              <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4">
                <div className="text-sm mb-2">
                  <strong>Monto:</strong> {amount} {selectedCrypto.symbol}
                </div>
                <div className="text-sm mb-2">
                  <strong>Tier:</strong> {selectedTier.name}
                </div>
                <div className="text-sm">
                  <strong>Airdrops:</strong> {Math.floor(parseFloat(amount) / 10) * 5 + 5}
                </div>
              </div>

              <div>
                <label className="block font-brutalist text-sm mb-2">
                  DIRECCIÓN DE PAGO ({selectedCrypto.network})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedCrypto.address}
                    readOnly
                    className="flex-1 win95-bevel-in p-2 font-mono text-xs"
                  />
                  <button
                    onClick={() => copyAddress(selectedCrypto.address)}
                    className="win95-bevel-out bg-[var(--color-win95-face)] p-2 hover:win95-bevel-in"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-brutalist text-sm mb-2">
                  HASH DE TRANSACCIÓN
                </label>
                <input
                  type="text"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  className="w-full win95-bevel-in p-2 font-mono text-xs"
                  placeholder="0x..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={processContribution}
                  disabled={loading || !transactionHash}
                  className="flex-1 win95-bevel-out bg-[var(--color-raza-accent)] text-white py-2 font-brutalist hover:win95-bevel-in disabled:opacity-50"
                >
                  {loading ? 'PROCESANDO...' : 'CONFIRMAR'}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 win95-bevel-out bg-[var(--color-win95-face)] py-2 font-brutalist hover:win95-bevel-in"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}