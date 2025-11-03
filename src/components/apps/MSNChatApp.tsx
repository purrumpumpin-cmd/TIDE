/**
 * TIDElabs - MSN.CHAT
 * El Messenger Pirata con BeatBunny y UngaBunga
 */

import { useState, useEffect, useRef } from "react";
import { Send, Smile, Phone, Video, Settings, X, Minus, Maximize2, User, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Contact {
  id: string;
  name: string;
  status: "online" | "away" | "busy" | "offline";
  avatar: string;
  personalMessage: string;
  isAgent?: boolean;
  agentType?: "beatbunny" | "ungabunga";
}

interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: Date;
  sender: "me" | "them";
  emoji?: string;
}

interface ChatWindow {
  contactId: string;
  isMinimized: boolean;
}

const EMOTICONS = [
  { code: ":)", emoji: "😊" },
  { code: ":(", emoji: "😢" },
  { code: ":D", emoji: "😁" },
  { code: ";)", emoji: "😉" },
  { code: ":P", emoji: "😛" },
  { code: "(H)", emoji: "😎" },
  { code: "(Y)", emoji: "👍" },
  { code: "(N)", emoji: "👎" },
  { code: "<3", emoji: "❤️" },
  { code: "(music)", emoji: "🎵" },
];

const CONTACTS: Contact[] = [
  {
    id: "beatbunny",
    name: "BeatBunny",
    status: "online",
    avatar: "🐰",
    personalMessage: "🎵 Dropping beats & vibes! Let's vibe together! 🎧",
    isAgent: true,
    agentType: "beatbunny",
  },
  {
    id: "ungabunga",
    name: "UngaBunga",
    status: "online",
    avatar: "🦍",
    personalMessage: "UNGA BUNGA! 🍌 Me help you navigate jungle! 🌴",
    isAgent: true,
    agentType: "ungabunga",
  },
  {
    id: "nakama1",
    name: "CryptoNakama",
    status: "online",
    avatar: "👤",
    personalMessage: "Hodling to the moon! 🚀",
  },
  {
    id: "nakama2",
    name: "PirateInvestor",
    status: "away",
    avatar: "🏴‍☠️",
    personalMessage: "Navigating the Web3 seas...",
  },
];

export function MSNChatApp() {
  const [contacts] = useState<Contact[]>(CONTACTS);
  const [myStatus, setMyStatus] = useState<"online" | "away" | "busy">("online");
  const [myPersonalMessage, setMyPersonalMessage] = useState("¡Navegando el Galeón Digital!");
  const [openChats, setOpenChats] = useState<ChatWindow[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputTexts, setInputTexts] = useState<Record<string, string>>({});
  const [showEmoticons, setShowEmoticons] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);

  const openChat = (contactId: string) => {
    if (!openChats.find((c) => c.contactId === contactId)) {
      setOpenChats([...openChats, { contactId, isMinimized: false }]);
      
      // Mensaje de bienvenida del agente
      const contact = contacts.find((c) => c.id === contactId);
      if (contact?.isAgent) {
        setTimeout(() => {
          addAgentWelcomeMessage(contactId, contact.agentType!);
        }, 500);
      }
    }
  };

  const closeChat = (contactId: string) => {
    setOpenChats(openChats.filter((c) => c.contactId !== contactId));
  };

  const toggleMinimize = (contactId: string) => {
    setOpenChats(
      openChats.map((c) =>
        c.contactId === contactId ? { ...c, isMinimized: !c.isMinimized } : c
      )
    );
  };

  const addAgentWelcomeMessage = (contactId: string, agentType: "beatbunny" | "ungabunga") => {
    const welcomeMessages = {
      beatbunny: [
        "Yo yo yo! 🎵 BeatBunny in the house! What's good, fam?",
        "Ready to vibe with some sick TUNOVA tracks? 🎧",
        "I got the freshest beats from our ecosystem! Wanna hear something dope? 🔥",
      ],
      ungabunga: [
        "UNGA BUNGA! 🦍 UngaBunga say hello!",
        "You need help? UngaBunga smart monkey! Me know all about TIDElabs! 🌴",
        "Want banana wisdom? 🍌 Me tell you secrets of ecosystem!",
      ],
    };

    const messages = welcomeMessages[agentType];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    addMessage(contactId, randomMessage, "them");
  };

  const addMessage = (contactId: string, text: string, sender: "me" | "them", emoji?: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      contactId,
      text,
      timestamp: new Date(),
      sender,
      emoji,
    };

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage],
    }));

    // Respuesta automática del agente
    if (sender === "me") {
      const contact = contacts.find((c) => c.id === contactId);
      if (contact?.isAgent) {
        setTimeout(() => {
          generateAgentResponse(contactId, contact.agentType!, text);
        }, 1000 + Math.random() * 2000);
      }
    }
  };

  const generateAgentResponse = (contactId: string, agentType: "beatbunny" | "ungabunga", userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      beatbunny: {
        greetings: ["Yo! What's up? 🎵", "Hey hey! Ready to jam? 🎧", "Wassup! Let's vibe! 🔥"],
        music: ["Check out our TUNOVA radio! We got fire tracks! 🎵", "Our artists are SICK! You gotta hear them! 🎧", "Music is life, bro! Let me put you on to some heat! 🔥"],
        help: ["Need help? I gotchu fam! What you wanna know? 😎", "Ask me anything about music or the ecosystem! 🎵", "I'm here to help, let's figure this out together! 💪"],
        default: ["That's dope! 🔥", "For real? Tell me more! 🎵", "Yo that's interesting! 😎", "Keep the vibes coming! 🎧"],
      },
      ungabunga: {
        greetings: ["UNGA! Hello friend! 🦍", "BUNGA! UngaBunga happy see you! 🍌", "UNGA BUNGA! *beats chest* 💪"],
        help: ["UngaBunga help! What you need? 🌴", "Me smart monkey! Me explain! 🦍", "UngaBunga know much! Ask me! 🍌"],
        crowdfund: ["CROWDFUND good! You invest, you get banana! 🍌", "UngaBunga say: invest now, rich later! 💰", "Smart human invest in TIDElabs! UNGA! 🚀"],
        default: ["UNGA BUNGA! 🦍", "Me understand! *nods* 🍌", "BUNGA! That good! 👍", "UngaBunga think you smart! 🌴"],
      },
    };

    let response = "";
    const agentResponses = responses[agentType];

    if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hola")) {
      response = agentResponses.greetings[Math.floor(Math.random() * agentResponses.greetings.length)];
    } else if (agentType === "beatbunny" && (lowerMessage.includes("music") || lowerMessage.includes("song") || lowerMessage.includes("track"))) {
      response = agentResponses.music![Math.floor(Math.random() * agentResponses.music!.length)];
    } else if (lowerMessage.includes("help") || lowerMessage.includes("ayuda")) {
      response = agentResponses.help[Math.floor(Math.random() * agentResponses.help.length)];
    } else if (agentType === "ungabunga" && (lowerMessage.includes("crowdfund") || lowerMessage.includes("invest"))) {
      response = agentResponses.crowdfund![Math.floor(Math.random() * agentResponses.crowdfund!.length)];
    } else {
      response = agentResponses.default[Math.floor(Math.random() * agentResponses.default.length)];
    }

    addMessage(contactId, response, "them");
  };

  const sendMessage = (contactId: string) => {
    const text = inputTexts[contactId]?.trim();
    if (!text) return;

    // Convertir emoticones
    let processedText = text;
    EMOTICONS.forEach((emoticon) => {
      processedText = processedText.replace(new RegExp(emoticon.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emoticon.emoji);
    });

    addMessage(contactId, processedText, "me");
    setInputTexts({ ...inputTexts, [contactId]: "" });
    setShowEmoticons(null);
  };

  const insertEmoticon = (contactId: string, emoji: string) => {
    const currentText = inputTexts[contactId] || "";
    setInputTexts({ ...inputTexts, [contactId]: currentText + emoji });
    setShowEmoticons(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "#7FBA00";
      case "away": return "#FFB900";
      case "busy": return "#E81123";
      case "offline": return "#7A7A7A";
      default: return "#7A7A7A";
    }
  };

  return (
    <div className="h-full flex bg-white font-win95">
      {/* Contact List Panel */}
      <div className="w-64 border-r-2 border-[var(--color-raza-gray)] flex flex-col">
        {/* Header */}
        <div className="p-3 bg-gradient-to-r from-[#0078D4] to-[#50E6FF] text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🏴‍☠️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Circle size={8} fill={getStatusColor(myStatus)} stroke="none" />
                <span className="text-sm truncate">TIDElabs Nakama</span>
              </div>
              {editingStatus ? (
                <input
                  type="text"
                  value={myPersonalMessage}
                  onChange={(e) => setMyPersonalMessage(e.target.value)}
                  onBlur={() => setEditingStatus(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingStatus(false)}
                  className="text-xs bg-white/20 px-1 rounded w-full text-white"
                  autoFocus
                />
              ) : (
                <p
                  className="text-xs truncate cursor-pointer hover:underline"
                  onClick={() => setEditingStatus(true)}
                >
                  {myPersonalMessage}
                </p>
              )}
            </div>
          </div>
          
          {/* Status Selector */}
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setMyStatus("online")}
              className={`flex-1 px-2 py-1 rounded text-xs ${myStatus === "online" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
            >
              Disponible
            </button>
            <button
              onClick={() => setMyStatus("away")}
              className={`flex-1 px-2 py-1 rounded text-xs ${myStatus === "away" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
            >
              Ausente
            </button>
            <button
              onClick={() => setMyStatus("busy")}
              className={`flex-1 px-2 py-1 rounded text-xs ${myStatus === "busy" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
            >
              Ocupado
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-auto">
          <div className="p-2 bg-[#F3F3F3] text-xs border-b border-[var(--color-raza-gray)]">
            Contactos ({contacts.filter(c => c.status !== "offline").length})
          </div>
          <div className="divide-y divide-[var(--color-raza-gray)]">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => openChat(contact.id)}
                className="w-full p-2 hover:bg-[#E5F3FF] text-left flex items-start gap-2 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-xl">
                    {contact.avatar}
                  </div>
                  <Circle
                    size={10}
                    fill={getStatusColor(contact.status)}
                    stroke="white"
                    strokeWidth={2}
                    className="absolute -bottom-1 -right-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm truncate">
                      {contact.name}
                    </span>
                    {contact.isAgent && (
                      <span className="text-xs bg-[var(--color-raza-accent)] text-black px-1 rounded">AI</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-raza-gray)] truncate">
                    {contact.personalMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#E5F3FF] to-[#FFF5E5] p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="font-brutalist text-xl mb-2">MSN Messenger</h3>
          <p className="text-[var(--color-raza-gray)]">
            Selecciona un contacto para comenzar a chatear
          </p>
          <p className="text-sm text-[var(--color-raza-gray)] mt-2">
            🐰 BeatBunny y 🦍 UngaBunga están esperándote!
          </p>
        </div>
      </div>

      {/* Chat Windows */}
      <AnimatePresence>
        {openChats.map((chat, index) => {
          const contact = contacts.find((c) => c.id === chat.contactId);
          if (!contact) return null;

          const chatMessages = messages[chat.contactId] || [];

          return (
            <motion.div
              key={chat.contactId}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                height: chat.isMinimized ? "auto" : "500px"
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-0 win95-bevel-out bg-white shadow-2xl flex flex-col"
              style={{
                right: `${20 + index * 320}px`,
                width: "300px",
                zIndex: 1000 + index,
              }}
            >
              {/* Chat Window Header */}
              <div className="bg-gradient-to-r from-[#0078D4] to-[#50E6FF] text-white p-2 flex items-center justify-between cursor-move">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-sm">
                    {contact.avatar}
                  </div>
                  <span className="text-sm truncate">{contact.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleMinimize(chat.contactId)}
                    className="w-5 h-5 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    onClick={() => closeChat(chat.contactId)}
                    className="w-5 h-5 bg-white/20 hover:bg-red-500 rounded flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {!chat.isMinimized && (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-auto p-3 space-y-2 bg-white">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.sender === "me"
                              ? "bg-[#0078D4] text-white"
                              : "bg-[#F3F3F3] text-black"
                          }`}
                        >
                          <p className="break-words">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="border-t-2 border-[var(--color-raza-gray)] p-2">
                    {/* Emoticons Panel */}
                    {showEmoticons === chat.contactId && (
                      <div className="bg-white border-2 border-[var(--color-raza-gray)] p-2 mb-2 grid grid-cols-5 gap-1">
                        {EMOTICONS.map((emoticon) => (
                          <button
                            key={emoticon.code}
                            onClick={() => insertEmoticon(chat.contactId, emoticon.emoji)}
                            className="text-xl hover:bg-[#E5F3FF] p-1 rounded"
                            title={emoticon.code}
                          >
                            {emoticon.emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowEmoticons(showEmoticons === chat.contactId ? null : chat.contactId)}
                        className="win95-bevel-out bg-[var(--color-win95-face)] p-1 hover:win95-bevel-in"
                        title="Emoticones"
                      >
                        <Smile size={16} />
                      </button>
                      <input
                        type="text"
                        value={inputTexts[chat.contactId] || ""}
                        onChange={(e) => setInputTexts({ ...inputTexts, [chat.contactId]: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(chat.contactId)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 win95-bevel-in px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => sendMessage(chat.contactId)}
                        disabled={!inputTexts[chat.contactId]?.trim()}
                        className="win95-bevel-out bg-[var(--color-win95-face)] px-3 py-1 hover:win95-bevel-in disabled:opacity-50"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
