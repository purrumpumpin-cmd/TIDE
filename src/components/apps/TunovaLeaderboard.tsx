/**
 * TIDElabs - TUNOVA Leaderboard
 * Ranking de puntos para el Airdrop
 */

import { useState, useEffect } from "react";
import { Trophy, Award, Zap, Radio } from "lucide-react";
import { motion } from "motion/react";
import { tunovaApi } from "../../utils/api";

interface LeaderboardEntry {
  address: string;
  total: number;
  listeningTime: number;
  rank?: number;
}

export function TunovaLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [globalPoints, setGlobalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await tunovaApi.getLeaderboard();
      
      if (response.success) {
        const rankedLeaderboard = response.leaderboard.map((entry: LeaderboardEntry, index: number) => ({
          ...entry,
          rank: index + 1,
        }));
        
        setLeaderboard(rankedLeaderboard);
        setGlobalPoints(response.globalPoints || 0);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-400";
      case 2: return "text-gray-400";
      case 3: return "text-orange-600";
      default: return "text-white";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-black via-purple-900/20 to-black text-white font-win95">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-raza-accent)] to-[var(--color-azar-cyan)] p-4 win95-bevel-out">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-brutalist tracking-wider text-xl flex items-center gap-2">
              <Trophy size={24} />
              TUNOVA LEADERBOARD
            </h2>
            <p className="text-xs mt-1 text-black">Ranking de Puntos para el Airdrop</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-black">PUNTOS GLOBALES</p>
            <p className="font-brutalist text-2xl text-black">{globalPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-black/50">
        <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-3 rounded-lg border border-yellow-600">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-xs">Top 10</span>
          </div>
          <p className="font-brutalist text-lg text-yellow-400">
            {leaderboard.slice(0, 10).reduce((sum, entry) => sum + entry.total, 0).toLocaleString()}
          </p>
          <p className="text-xs text-yellow-600">puntos combinados</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-cyan-900/50 p-3 rounded-lg border border-[var(--color-raza-accent)]">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-[var(--color-raza-accent)]" />
            <span className="text-xs">Participantes</span>
          </div>
          <p className="font-brutalist text-lg text-[var(--color-raza-accent)]">
            {leaderboard.length}
          </p>
          <p className="text-xs text-green-600">usuarios activos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-3 rounded-lg border border-[var(--color-azar-magenta)]">
          <div className="flex items-center gap-2 mb-1">
            <Radio size={16} className="text-[var(--color-azar-magenta)]" />
            <span className="text-xs">Tiempo Total</span>
          </div>
          <p className="font-brutalist text-lg text-[var(--color-azar-magenta)]">
            {formatTime(leaderboard.reduce((sum, entry) => sum + entry.listeningTime, 0))}
          </p>
          <p className="text-xs text-pink-600">de escucha</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">📻</div>
              <p className="text-[var(--color-raza-gray)]">Cargando ranking...</p>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Radio size={64} className="mx-auto mb-4 text-[var(--color-raza-gray)]" />
              <h3 className="font-brutalist text-xl mb-2">¡Sé el Primero!</h3>
              <p className="text-[var(--color-raza-gray)]">
                Escucha Radio Pirata para aparecer en el leaderboard
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-r ${
                  entry.rank === 1
                    ? "from-yellow-900/50 to-orange-900/50 border-yellow-600"
                    : entry.rank === 2
                    ? "from-gray-700/50 to-gray-800/50 border-gray-500"
                    : entry.rank === 3
                    ? "from-orange-900/50 to-red-900/50 border-orange-600"
                    : "from-black/50 to-gray-900/50 border-gray-700"
                } border-2 rounded-lg p-3 hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-12 text-center font-brutalist text-2xl ${getRankColor(entry.rank || 0)}`}>
                    {getRankIcon(entry.rank || 0)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                    {entry.rank && entry.rank <= 3 ? "🏴‍☠️" : "👤"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm truncate">
                        {formatAddress(entry.address)}
                      </span>
                      {entry.rank && entry.rank <= 10 && (
                        <Award size={14} className="text-[var(--color-raza-accent)]" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-raza-gray)]">
                      {formatTime(entry.listeningTime)} escuchado
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-brutalist text-xl text-[var(--color-raza-accent)]">
                      {entry.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--color-raza-gray)]">puntos</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-gradient-to-r from-green-900/50 to-cyan-900/50 border-t-2 border-[var(--color-raza-accent)]">
        <div className="flex items-center gap-3">
          <Radio className="text-[var(--color-raza-accent)]" size={24} />
          <div className="flex-1">
            <p className="text-sm font-brutalist">¿Cómo Ganar Puntos?</p>
            <p className="text-xs text-[var(--color-raza-gray)]">
              Escucha Radio Pirata y gana 1 punto cada 60 segundos. Los puntos se suman para el Airdrop final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
