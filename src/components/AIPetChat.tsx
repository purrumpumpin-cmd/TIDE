/**
 * TIDElabs - AI Pet Chat
 * Sistema de chat con mascotas IA
 */

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'pet';
  timestamp: Date;
}

interface AIPetChatProps {
  petType: 'poseidrop' | 'ungabunga' | 'beatbunny';
  petName: string;
  petAvatar: string;
  petColor: string;
  onClose?: () => void;
}

export function AIPetChat({ petType, petName, petAvatar, petColor, onClose }: AIPetChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessages = {
      poseidrop: "¡Ahoy! Soy PoseiDrop 🐬, tu delfín logístico. Pregúntame sobre puntos, airdrops, referidos y crowdfunding.",
      ungabunga: "¡Oook oook! UngaBunga aquí 🐵. Soy el mono técnico. Pregúntame sobre el sistema, el Capitán o la arquitectura.",
      beatbunny: "¡Hey hey! BeatBunny en la casa 🎵. Soy tu conejo musical. Pregúntame sobre TUNOVA.IO, Radio Pirata o música."
    };

    const welcomeMessage: ChatMessage = {
      id: '1',
      text: welcomeMessages[petType],
      sender: 'pet',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [petType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
      // Call AI chat API
      const response = await fetch(`https://qtkhggoaoeoicqaunrwc.supabase.co/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tidelabs_session') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2hnZ29hb2VvaWNxYXVucndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODcwNzQsImV4cCI6MjA3NzQ2MzA3NH0.qVx5fstQMUevse4cGhKKYDQxAk2CSxrmruG5OxLpD_M'}`
        },
        body: JSON.stringify({
          message: userMessage.text,
          petType: petType,
          walletAddress: walletAddress
        })
      });

      const data = await response.json();

      if (data.success) {
        const petMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'pet',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, petMessage]);
      } else {
        throw new Error(data.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "¡Oops! Parece que tengo problemas de conexión. Intenta de nuevo en un momento.",
        sender: 'pet',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className={`${petColor} text-white p-4 win95-bevel-out`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{petAvatar}</div>
            <div>
              <h3 className="font-brutalist tracking-wider">{petName}</h3>
              <p className="text-xs mt-1">Asistente IA</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="win95-bevel-out bg-red-500 text-white px-3 py-1 text-xs font-brutalist hover:win95-bevel-in"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-white">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-[var(--color-raza-accent)] text-white'
                  : `${petColor} text-white win95-bevel-out`
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'pet' ? (
                    <span className="text-xs">{petAvatar}</span>
                  ) : (
                    <User size={12} />
                  )}
                  <span className="text-xs font-brutalist">
                    {message.sender === 'pet' ? petName : 'Tú'}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {message.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start">
            <div className={`${petColor} text-white px-3 py-2 rounded-lg win95-bevel-out`}>
              <div className="flex items-center gap-2">
                <span className="text-xs">{petAvatar}</span>
                <span className="text-xs font-brutalist">{petName}</span>
              </div>
              <div className="text-sm animate-pulse">
                Escribiendo...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-[var(--color-win95-shadow)] p-4 bg-[var(--color-win95-face)]">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={`Pregúntale a ${petName}...`}
            className="flex-1 win95-bevel-in p-2 font-win95"
            maxLength={500}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!currentMessage.trim() || loading}
            className={`${petColor} text-white px-4 py-2 font-brutalist win95-bevel-out hover:win95-bevel-in disabled:opacity-50 flex items-center gap-2`}
          >
            <Send size={16} />
            ENVIAR
          </button>
        </form>
        <div className="flex justify-between items-center mt-2 text-xs text-[var(--color-raza-gray)]">
          <span>Pregunta sobre {petType === 'poseidrop' ? 'logística' : petType === 'ungabunga' ? 'sistema' : 'música'}</span>
          <span>{currentMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
}