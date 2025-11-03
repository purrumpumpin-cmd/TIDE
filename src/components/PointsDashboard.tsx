/**
 * TIDElabs - Dashboard de Puntos NAKAMA
 * Sistema de puntos para Airdrop Ready
 */

import { useState, useEffect } from 'react';
import { Coins, Trophy, Users, Gift } from 'lucide-react';
import { pointsApi } from '../utils/api';

interface PointsData {
  id: string;
  wallet_address: string;
  points_balance: number;
  referral_code: string;
  airdrop_status: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

interface PointsDashboardProps {
  walletAddress?: string;
}

export function PointsDashboard({ walletAddress }: PointsDashboardProps) {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      loadPointsData();
    }
  }, [walletAddress]);

  const loadPointsData = async () => {
    if (!walletAddress) return;
    
    try {
      setLoading(true);
      const response = await pointsApi.getPoints(walletAddress);
      if (response.success) {
        setPointsData(response.points);
      } else {
        setError('Error al cargar puntos');
      }
    } catch (err) {
      console.error('Error loading points:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getAirdropLevel = (points: number) => {
    if (points >= 10000) return { level: 'LEGENDARY', multiplier: '10x', color: 'text-yellow-400' };
    if (points >= 5000) return { level: 'EPIC', multiplier: '5x', color: 'text-purple-400' };
    if (points >= 2500) return { level: 'RARE', multiplier: '3x', color: 'text-blue-400' };
    if (points >= 1000) return { level: 'UNCOMMON', multiplier: '2x', color: 'text-green-400' };
    return { level: 'COMMON', multiplier: '1x', color: 'text-gray-400' };
  };

  const copyReferralCode = () => {
    if (pointsData?.referral_code) {
      navigator.clipboard.writeText(pointsData.referral_code);
      // TODO: Add toast notification
      console.log('Código de referido copiado:', pointsData.referral_code);
    }
  };

  if (!walletAddress) {
    return (
      <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4 font-win95">
        <div className="text-center text-[var(--color-win95-text)]">
          <Coins size={48} className="mx-auto mb-4 opacity-50" />
          <p>Conecta tu wallet para ver tus puntos NAKAMA</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4 font-win95">
        <div className="text-center text-[var(--color-win95-text)]">
          <div className="animate-pulse">Cargando puntos...</div>
        </div>
      </div>
    );
  }

  if (error || !pointsData) {
    return (
      <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4 font-win95">
        <div className="text-center text-red-500">
          <p>{error || 'No se pudieron cargar los puntos'}</p>
          <button 
            onClick={loadPointsData}
            className="win95-bevel-out bg-[var(--color-win95-face)] px-3 py-1 mt-2 hover:win95-bevel-in"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const airdropInfo = getAirdropLevel(pointsData.points_balance);

  return (
    <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4 font-win95 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-win95-shadow)] pb-2">
        <Coins size={20} className="text-[var(--color-raza-accent)]" />
        <h3 className="font-brutalist text-[var(--color-win95-text)]">PUNTOS NAKAMA</h3>
      </div>

      {/* Points Balance */}
      <div className="text-center">
        <div className="text-3xl font-brutalist text-[var(--color-raza-accent)] mb-2">
          {pointsData.points_balance.toLocaleString()}
        </div>
        <div className="text-sm text-[var(--color-win95-text)]">Puntos Totales</div>
      </div>

      {/* Airdrop Status */}
      <div className="win95-bevel-in bg-[var(--color-win95-face)] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={16} className={airdropInfo.color} />
          <span className="font-brutalist text-sm">NIVEL AIRDROP</span>
        </div>
        <div className={`text-lg font-brutalist ${airdropInfo.color}`}>
          {airdropInfo.level}
        </div>
        <div className="text-xs text-[var(--color-win95-text)]">
          Multiplicador: {airdropInfo.multiplier}
        </div>
      </div>

      {/* Referral Code */}
      <div className="win95-bevel-in bg-[var(--color-win95-face)] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-[var(--color-raza-accent)]" />
          <span className="font-brutalist text-sm">CÓDIGO DE REFERIDO</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="bg-black text-green-400 px-2 py-1 text-sm font-mono flex-1">
            {pointsData.referral_code}
          </code>
          <button
            onClick={copyReferralCode}
            className="win95-bevel-out bg-[var(--color-win95-face)] px-2 py-1 text-xs hover:win95-bevel-in"
          >
            COPY
          </button>
        </div>
      </div>

      {/* Referred By */}
      {pointsData.referred_by && (
        <div className="win95-bevel-in bg-[var(--color-win95-face)] p-3">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={16} className="text-green-400" />
            <span className="font-brutalist text-sm">REFERIDO POR</span>
          </div>
          <code className="bg-black text-green-400 px-2 py-1 text-sm font-mono">
            {pointsData.referred_by}
          </code>
        </div>
      )}

      {/* Activities */}
      <div className="win95-bevel-in bg-[var(--color-win95-face)] p-3">
        <h4 className="font-brutalist text-sm mb-2 text-[var(--color-win95-text)]">
          ACTIVIDADES PARA GANAR PUNTOS
        </h4>
        <div className="text-xs text-[var(--color-win95-text)] space-y-1">
          <div>• Login diario: +10 puntos</div>
          <div>• Usar aplicaciones: +5 puntos</div>
          <div>• Escuchar TUNOVA: +15 puntos</div>
          <div>• Mensaje en chat: +2 puntos</div>
          <div>• Sugerir juego: +25 puntos</div>
          <div>• Referir NAKAMA: +50 puntos</div>
        </div>
      </div>

      {/* Airdrop Info */}
      <div className="win95-bevel-in bg-black p-3 text-green-400 font-mono text-xs">
        <div className="mb-1">STATUS: {pointsData.airdrop_status.toUpperCase()}</div>
        <div className="mb-1">WALLET: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
        <div>JOINED: {new Date(pointsData.created_at).toLocaleDateString()}</div>
      </div>
    </div>
  );
}