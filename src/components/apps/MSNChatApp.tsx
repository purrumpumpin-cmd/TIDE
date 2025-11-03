/**
 * TIDElabs - MSN.CHAT Pirata
 * El Messenger de los NAKAMAS con funcionalidad en tiempo real
 */

import { useState, useEffect, useRef } from "react";
import { Send, Smile, Zap, User, Circle, Anchor, Compass, Skull, Crown, Ship, Waves } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../utils/supabase/client";
import { pointsApi } from "../../utils/api";

interface NakamaUser {
  id: string;
  wallet_address: string;
  username: string;
  status: string;
  status_message?: string;
  last_seen: string;
  is_online: boolean;
}

interface ChatMessage {
  id: string;
  sender_wallet: string;
  sender_username: string;
  message: string;
  message_type: 'text' | 'buzz';
  created_at: string;
}

const PIRATE_STATUSES = [
  { id: 'En el The Aetherius', label: 'En el The Aetherius', icon: <Ship size={16} />, color: 'text-green-500' },
  { id: 'Izando la Bandera', label: 'Izando la Bandera', icon: <Crown size={16} />, color: 'text-yellow-500' },
  { id: 'Navegando', label: 'Navegando', icon: <Compass size={16} />, color: 'text-blue-500' },
  { id: 'Buscando Tesoro', label: 'Buscando Tesoro', icon: <Skull size={16} />, color: 'text-purple-500' },
  { id: 'En la Taberna', label: 'En la Taberna', icon: <Anchor size={16} />, color: 'text-orange-500' },
  { id: 'Perdido en el Mar', label: 'Perdido en el Mar', icon: <Waves size={16} />, color: 'text-gray-500' },
];

export function MSNChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nakamas, setNakamas] = useState<NakamaUser[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState('En el The Aetherius');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));
  const [username, setUsername] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (walletAddress) {
      initializeChat();
      subscribeToMessages();
      subscribeToNakamaStatus();
    }
  }, [walletAddress]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      
      // Get or create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      const userUsername = profile?.username || `NAKAMA-${walletAddress.slice(-6).toUpperCase()}`;
      setUsername(userUsername);

      // Update or create NAKAMA status
      await supabase
        .from('nakama_status')
        .upsert({
          wallet_address: walletAddress,
          username: userUsername,
          status: currentStatus,
          status_message: statusMessage,
          is_online: true,
          last_seen: new Date().toISOString(),
        });

      // Load recent messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('nakama_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Load online NAKAMAs
      const { data: nakamasData, error: nakamasError } = await supabase
        .from('nakama_status')
        .select('*')
        .eq('is_online', true)
        .order('last_seen', { ascending: false });

      if (nakamasError) throw nakamasError;
      setNakamas(nakamasData || []);

    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('nakama_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'nakama_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Buzz effect for buzz messages
          if (newMessage.message_type === 'buzz' && newMessage.sender_wallet !== walletAddress) {
            triggerBuzzEffect();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToNakamaStatus = () => {
    const channel = supabase
      .channel('nakama_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nakama_status',
        },
        async () => {
          // Reload NAKAMAs list
          const { data: nakamasData } = await supabase
            .from('nakama_status')
            .select('*')
            .eq('is_online', true)
            .order('last_seen', { ascending: false });

          setNakamas(nakamasData || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !walletAddress || !username) return;

    try {
      const { error } = await supabase
        .from('nakama_messages')
        .insert({
          sender_wallet: walletAddress,
          sender_username: username,
          message: currentMessage.trim(),
          message_type: 'text',
        });

      if (error) throw error;

      // Add points for chat message
      try {
        await pointsApi.addPoints(walletAddress, 0, 'chat_message');
      } catch (pointsError) {
        console.error('Error adding points:', pointsError);
      }

      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendBuzz = async () => {
    if (!walletAddress || !username) return;

    try {
      const { error } = await supabase
        .from('nakama_messages')
        .insert({
          sender_wallet: walletAddress,
          sender_username: username,
          message: '¡ZUMBIDO!',
          message_type: 'buzz',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending buzz:', error);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!walletAddress || !username) return;

    try {
      setCurrentStatus(newStatus);
      
      const { error } = await supabase
        .from('nakama_status')
        .update({
          status: newStatus,
          status_message: statusMessage,
          last_seen: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const triggerBuzzEffect = () => {
    // Visual buzz effect
    const chatWindow = document.querySelector('.msn-chat-window');
    if (chatWindow) {
      chatWindow.classList.add('animate-pulse');
      setTimeout(() => {
        chatWindow.classList.remove('animate-pulse');
      }, 1000);
    }

    // Audio buzz effect
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play().catch(() => {
        // Fallback if audio fails
        console.log('Buzz effect triggered!');
      });
    } catch (error) {
      console.log('Buzz effect triggered!');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusInfo = (status: string) => {
    return PIRATE_STATUSES.find(s => s.id === status) || PIRATE_STATUSES[0];
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!walletAddress) {
    return (
      <div className="h-full flex flex-col bg-white font-win95">
        <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
          <h2 className="font-brutalist tracking-wider">MSN.CHAT</h2>
          <p className="text-xs mt-1">El Messenger Pirata</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <User size={64} className="mx-auto mb-4 opacity-50" />
            <p className="font-brutalist mb-2">Conecta tu wallet para unirte al chat</p>
            <p className="text-sm text-[var(--color-raza-gray)]">
              Chatea con otros NAKAMAS en tiempo real
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white font-win95">
        <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
          <h2 className="font-brutalist tracking-wider">MSN.CHAT</h2>
          <p className="text-xs mt-1">El Messenger Pirata</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Conectando al chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white font-win95 msn-chat-window">
      {/* Sidebar - NAKAMAs List */}
      <div className="w-64 border-r-2 border-[var(--color-win95-shadow)] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-win95-titlebar)] text-white p-3 win95-bevel-out">
          <h3 className="font-brutalist text-sm">NAKAMAS ONLINE</h3>
          <p className="text-xs opacity-75">{nakamas.length} conectados</p>
        </div>

        {/* Status Selector */}
        <div className="win95-bevel-in bg-[var(--color-win95-face)] p-3 border-b">
          <div className="mb-2">
            <label className="text-xs font-brutalist">MI ESTADO:</label>
            <select
              value={currentStatus}
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full win95-bevel-in p-1 text-xs mt-1"
            >
              {PIRATE_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {getStatusInfo(currentStatus).icon}
            <span className="text-xs font-brutalist">{username}</span>
          </div>
        </div>

        {/* NAKAMAs List */}
        <div className="flex-1 overflow-auto">
          {nakamas.map((nakama) => {
            const statusInfo = getStatusInfo(nakama.status);
            return (
              <div key={nakama.id} className="p-2 border-b border-[var(--color-win95-shadow)] hover:bg-[var(--color-win95-face)]">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Circle size={12} className={`${statusInfo.color} fill-current`} />
                    {statusInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-brutalist truncate">
                      {nakama.username}
                    </div>
                    <div className="text-xs text-[var(--color-raza-gray)] truncate">
                      {nakama.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-brutalist tracking-wider">CHAT GENERAL</h2>
              <p className="text-xs mt-1">Canal principal de los NAKAMAS</p>
            </div>
            <button
              onClick={sendBuzz}
              className="win95-bevel-out bg-yellow-500 text-black px-3 py-1 text-xs font-brutalist hover:win95-bevel-in flex items-center gap-1"
            >
              <Zap size={12} />
              ZUMBIDO
            </button>
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
                className={`flex ${message.sender_wallet === walletAddress ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.sender_wallet === walletAddress
                    ? 'bg-[var(--color-raza-accent)] text-white'
                    : message.message_type === 'buzz'
                    ? 'bg-yellow-200 border-2 border-yellow-400 animate-pulse'
                    : 'bg-[var(--color-win95-face)] win95-bevel-in'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-brutalist">
                      {message.sender_username}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    message.message_type === 'buzz' ? 'font-brutalist text-center' : ''
                  }`}>
                    {message.message_type === 'buzz' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Zap size={16} className="text-yellow-600" />
                        {message.message}
                        <Zap size={16} className="text-yellow-600" />
                      </div>
                    ) : (
                      message.message
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t-2 border-[var(--color-win95-shadow)] p-4 bg-[var(--color-win95-face)]">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 win95-bevel-in p-2 font-win95"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!currentMessage.trim()}
              className="win95-bevel-out bg-[var(--color-raza-accent)] text-white px-4 py-2 font-brutalist hover:win95-bevel-in disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={16} />
              ENVIAR
            </button>
          </form>
          <div className="flex justify-between items-center mt-2 text-xs text-[var(--color-raza-gray)]">
            <span>Ganas +2 puntos por mensaje</span>
            <span>{currentMessage.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
}