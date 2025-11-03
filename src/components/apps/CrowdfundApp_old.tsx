/**
 * TIDElabs - CROWDFUND.WEB3
 * El Corazón Financiero del The Aetherius
 */

import { useState, useEffect } from "react";
import { DollarSign, Users, Anchor } from "lucide-react";
import { motion } from "motion/react";
import { nakamaApi } from "../../utils/api";

interface NakamaTier {
  name: string;
  minAmount: number;
  icon: React.ReactNode;
  benefits: string[];
}

const NAKAMA_TIERS: NakamaTier[] = [
  {
    name: "Grumete",
    minAmount: 0.01,
    icon: <Users size={24} />,
    benefits: ["Acceso al MSN.CHAT", "Newsletter exclusiva", "Voto en decisiones menores"],
  },
  {
    name: "Marinero",
    minAmount: 0.05,
    icon: <Anchor size={24} />,
    benefits: ["Todos los beneficios de Grumete", "NFT de Membresía", "Early access a productos RAZA"],
  },
  {
    name: "Capitán",
    minAmount: 0.1,
    icon: <DollarSign size={24} />,
    benefits: [
      "Todos los beneficios de Marinero",
      "Acceso VIP a lanzamientos AZAR",
      "Participación en gobernanza",
      "Casete Genesis NFT",
    ],
  },
];

interface CrowdfundAppProps {
  sessionToken?: string | null;
  userTier?: string;
}

export function CrowdfundApp({ sessionToken, userTier }: CrowdfundAppProps) {
  const [selectedTier, setSelectedTier] = useState<NakamaTier | null>(null);
  const [isContributing, setIsContributing] = useState(false);
  const [crowdfundStatus, setCrowdfundStatus] = useState<any>(null);

  useEffect(() => {
    loadCrowdfundStatus();
  }, []);

  const loadCrowdfundStatus = async () => {
    try {
      const status = await nakamaApi.getStatus();
      setCrowdfundStatus(status);
    } catch (error) {
      console.error("Error loading crowdfund status:", error);
    }
  };

  const handleContribute = async (tier: NakamaTier) => {
    if (!sessionToken) {
      alert("Por favor, conecta tu wallet primero");
      return;
    }

    setIsContributing(true);
    try {
      // Aquí iría la lógica de llamada al Smart Contract vía Thirdweb
      console.log("Contribuyendo al tier:", tier.name, "Cantidad:", tier.minAmount);
      
      // Simulación de transacción blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Registrar contribución en el backend
      const response = await nakamaApi.contribute(tier.minAmount, mockTxHash, sessionToken);
      
      if (response.success) {
        alert(`¡Bienvenido a la tripulación, ${response.newTier}!`);
        await loadCrowdfundStatus();
      }
    } catch (error) {
      console.error("Error al contribuir:", error);
      alert("Error al procesar la contribución. Por favor, intenta de nuevo.");
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <h2 className="font-brutalist tracking-wider">CROWDFUND.WEB3</h2>
        <p className="text-xs mt-1">Únete a la Tripulación del The Aetherius</p>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b-2 border-[var(--color-raza-gray)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Progreso de Financiamiento</span>
          <span className="font-brutalist text-[var(--color-raza-accent)]">
            {crowdfundStatus?.totalContributions.toFixed(2) || 0} ETH / {crowdfundStatus?.goal || 100} ETH
          </span>
        </div>
        <div className="w-full h-6 win95-bevel-in bg-white">
          <motion.div
            className="h-full bg-[var(--color-raza-accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${crowdfundStatus?.percentage || 0}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        {userTier && userTier !== "none" && (
          <div className="mt-2 text-xs text-center">
            <span className="bg-[var(--color-raza-accent)] text-black px-2 py-1 font-brutalist">
              Tu Tier: {userTier}
            </span>
          </div>
        )}
      </div>

      {/* Tiers Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {NAKAMA_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              className={`win95-bevel-out p-4 cursor-pointer ${
                selectedTier?.name === tier.name ? "bg-[var(--color-raza-accent)]/10" : "bg-white"
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTier(tier)}
            >
              <div className="flex items-start gap-4">
                <div className="text-[var(--color-raza-black)]">{tier.icon}</div>
                <div className="flex-1">
                  <h3 className="font-brutalist text-lg mb-1">{tier.name}</h3>
                  <p className="text-sm text-[var(--color-raza-gray)] mb-2">
                    Mín. {tier.minAmount} ETH
                  </p>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <span className="text-[var(--color-raza-accent)]">▸</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 border-t-2 border-[var(--color-raza-gray)]">
        <button
          onClick={() => selectedTier && handleContribute(selectedTier)}
          disabled={!selectedTier || isContributing}
          className="w-full win95-bevel-out bg-[var(--color-win95-face)] py-3 font-brutalist hover:win95-bevel-in active:win95-bevel-in disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isContributing
            ? "Procesando..."
            : selectedTier
            ? `[Contribuir ${selectedTier.minAmount} ETH - ${selectedTier.name}]`
            : "[Selecciona un Tier]"}
        </button>
      </div>
    </div>
  );
}
