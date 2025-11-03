/**
 * TIDElabs - AI.PETS
 * Centro de Mascotas IA
 */

import { useState } from 'react';
import { Bot, MessageCircle, Info, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { AIPetChat } from '../AIPetChat';

interface AIPet {
  id: string;
  name: string;
  type: 'poseidrop' | 'ungabunga' | 'beatbunny';
  avatar: string;
  color: string;
  specialty: string;
  description: string;
  expertise: string[];
}

const AI_PETS: AIPet[] = [
  {
    id: 'poseidrop',
    name: 'PoseiDrop',
    type: 'poseidrop',
    avatar: '🐬',
    color: 'bg-blue-500',
    specialty: 'Logística & Airdrops',
    description: 'El delfín experto en sistemas de puntos, airdrops y toda la logística del ecosistema NAKAMA.',
    expertise: ['Sistema de Puntos', 'Airdrops Garantizados', 'Códigos de Referido', 'Crowdfunding', 'Tiers NAKAMA']
  },
  {
    id: 'ungabunga',
    name: 'UngaBunga',
    type: 'ungabunga',
    avatar: '🐵',
    color: 'bg-green-500',
    specialty: 'Sistema & Arquitectura',
    description: 'El mono técnico que conoce todos los secretos del TIDElabs OS y su arquitectura.',
    expertise: ['Arquitectura del Sistema', 'Historia del Capitán', 'Aplicaciones', 'Tecnología Web3', 'Desarrollo']
  },
  {
    id: 'beatbunny',
    name: 'BeatBunny',
    type: 'beatbunny',
    avatar: '🎵',
    color: 'bg-purple-500',
    specialty: 'Música & TUNOVA.IO',
    description: 'El conejo musical experto en TUNOVA.IO, artistas y todo lo relacionado con la Radio Pirata.',
    expertise: ['TUNOVA.IO', 'Radio Pirata', 'Artistas', 'Casetes NFT', 'Música Retro-Futurista']
  }
];

export function AIPetsApp() {
  const [selectedPet, setSelectedPet] = useState<AIPet | null>(null);
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));

  if (selectedPet) {
    return (
      <AIPetChat
        petType={selectedPet.type}
        petName={selectedPet.name}
        petAvatar={selectedPet.avatar}
        petColor={selectedPet.color}
        onClose={() => setSelectedPet(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <div className="flex items-center gap-3">
          <Bot size={24} />
          <div>
            <h2 className="font-brutalist tracking-wider">AI.PETS</h2>
            <p className="text-xs mt-1">Centro de Asistentes IA</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Introduction */}
        <div className="win95-bevel-out bg-white p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} className="text-[var(--color-raza-accent)]" />
            <h3 className="font-brutalist text-lg">ASISTENTES IA DE TIDELABS</h3>
          </div>
          <p className="text-sm text-[var(--color-raza-gray)] mb-4">
            Conoce a nuestras mascotas IA, cada una especializada en diferentes aspectos del ecosistema NAKAMA. 
            Están aquí para ayudarte con cualquier pregunta que tengas.
          </p>
          {!walletAddress && (
            <div className="win95-bevel-in bg-yellow-100 p-3 text-sm">
              <strong>Tip:</strong> Conecta tu wallet para obtener respuestas personalizadas basadas en tu perfil NAKAMA.
            </div>
          )}
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_PETS.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ scale: 1.02 }}
              className="win95-bevel-out bg-white p-6 cursor-pointer hover:win95-bevel-in transition-all"
              onClick={() => setSelectedPet(pet)}
            >
              {/* Pet Avatar */}
              <div className={`${pet.color} text-white p-4 rounded-lg mb-4 text-center`}>
                <div className="text-4xl mb-2">{pet.avatar}</div>
                <h4 className="font-brutalist text-lg">{pet.name}</h4>
                <p className="text-xs opacity-90">{pet.specialty}</p>
              </div>

              {/* Pet Description */}
              <p className="text-sm text-[var(--color-raza-gray)] mb-4">
                {pet.description}
              </p>

              {/* Expertise */}
              <div className="mb-4">
                <h5 className="font-brutalist text-xs mb-2 text-[var(--color-win95-text)]">
                  ESPECIALIDADES:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {pet.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[var(--color-win95-face)] px-2 py-1 rounded border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat Button */}
              <button className={`w-full ${pet.color} text-white py-2 font-brutalist win95-bevel-out hover:win95-bevel-in flex items-center justify-center gap-2`}>
                <MessageCircle size={16} />
                CHATEAR CON {pet.name.toUpperCase()}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Usage Tips */}
        <div className="win95-bevel-out bg-white p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Info size={24} className="text-blue-500" />
            <h3 className="font-brutalist text-lg">CONSEJOS DE USO</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4">
              <h4 className="font-brutalist text-blue-500 mb-2">🐬 PoseiDrop</h4>
              <ul className="space-y-1 text-xs">
                <li>• "¿Cómo gano más puntos?"</li>
                <li>• "¿Cuántos airdrops tengo?"</li>
                <li>• "¿Cómo funciona el crowdfunding?"</li>
                <li>• "¿Qué es un código de referido?"</li>
              </ul>
            </div>
            <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4">
              <h4 className="font-brutalist text-green-500 mb-2">🐵 UngaBunga</h4>
              <ul className="space-y-1 text-xs">
                <li>• "¿Quién es el Capitán?"</li>
                <li>• "¿Cómo funciona el sistema?"</li>
                <li>• "¿Qué tecnología usan?"</li>
                <li>• "¿Cómo se hizo TIDElabs OS?"</li>
              </ul>
            </div>
            <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4">
              <h4 className="font-brutalist text-purple-500 mb-2">🎵 BeatBunny</h4>
              <ul className="space-y-1 text-xs">
                <li>• "¿Qué es TUNOVA.IO?"</li>
                <li>• "¿Cómo funciona Radio Pirata?"</li>
                <li>• "¿Cómo subo mi música?"</li>
                <li>• "¿Qué son los casetes NFT?"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="win95-bevel-in bg-black p-4 mt-6 text-green-400 font-mono text-xs">
          <div className="mb-1">AI.PETS STATUS: ONLINE</div>
          <div className="mb-1">MODELS: GPT-4.1-MINI COMPATIBLE</div>
          <div className="mb-1">KNOWLEDGE BASE: UPDATED</div>
          {walletAddress && (
            <div>USER: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
          )}
        </div>
      </div>
    </div>
  );
}