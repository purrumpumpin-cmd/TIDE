/**
 * TIDElabs - AZAR El Mercado Negro
 * Caos Generativo - Experiencia experimental
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, AlertTriangle, X, ArrowLeft } from "lucide-react";
import { productsApi, cartApi } from "../utils/api";

interface Product {
  id: string;
  line: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  sku: string;
  isNFT?: boolean;
}

interface AzarMercadoProps {
  onBack: () => void;
  sessionToken?: string | null;
}

const TERMINAL_COMMANDS = [
  { cmd: "help", desc: "Muestra comandos disponibles" },
  { cmd: "discover", desc: "Descubre un producto aleatorio" },
  { cmd: "list", desc: "Lista todos los productos del caos" },
  { cmd: "clear", desc: "Limpia la terminal" },
  { cmd: "exit", desc: "Salir del mercado" },
];

export function AzarMercado({ onBack, sessionToken }: AzarMercadoProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "> Sistema del Mercado Negro inicializado...",
    "> Bienvenido al Caos. Escribe 'help' para asistencia.",
    " ",
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
    // Efecto de glitch aleatorio
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    // Auto-scroll terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const loadProducts = async () => {
    try {
      const response = await productsApi.list('AZAR');
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addToHistory = (line: string) => {
    setTerminalHistory([...terminalHistory, line]);
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    addToHistory(`> ${cmd}`);

    switch (trimmedCmd) {
      case "help":
        addToHistory(" ");
        addToHistory("COMANDOS DISPONIBLES:");
        TERMINAL_COMMANDS.forEach((c) => {
          addToHistory(`  ${c.cmd.padEnd(12)} - ${c.desc}`);
        });
        addToHistory(" ");
        break;

      case "discover":
        if (products.length === 0) {
          addToHistory("[ERROR] No hay productos en el caos.");
        } else {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          addToHistory(`[DESCUBRIMIENTO] ${randomProduct.name} revelado...`);
          setTimeout(() => {
            setGlitchActive(true);
            setTimeout(() => {
              setSelectedProduct(randomProduct);
              setGlitchActive(false);
            }, 300);
          }, 500);
        }
        break;

      case "list":
        addToHistory(" ");
        addToHistory("PRODUCTOS EN EL MERCADO NEGRO:");
        products.forEach((p, idx) => {
          addToHistory(`  [${idx + 1}] ${p.name} - $${p.price}`);
        });
        addToHistory(" ");
        break;

      case "clear":
        setTerminalHistory(["> Terminal limpiada.", " "]);
        break;

      case "exit":
        addToHistory("[SISTEMA] Saliendo del Mercado Negro...");
        setTimeout(() => onBack(), 1000);
        break;

      default:
        if (trimmedCmd) {
          addToHistory(`[ERROR] Comando desconocido: '${cmd}'`);
          addToHistory("Escribe 'help' para ver comandos disponibles.");
          addToHistory(" ");
        }
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };

  const addToCart = async (productId: string) => {
    if (!sessionToken) {
      alert('[ERROR] Conecta tu wallet para añadir al carrito');
      return;
    }

    try {
      await cartApi.add(productId, 1, sessionToken);
      addToHistory(`[ÉXITO] Producto añadido al carrito.`);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      addToHistory('[ERROR] Fallo al añadir al carrito.');
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <GenerativeBackground />

      {/* Glitch Overlay */}
      {glitchActive && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-full bg-[var(--color-azar-magenta)] opacity-20 animate-pulse" />
        </div>
      )}

      {/* Header */}
      <header className="relative z-20 border-b-2 border-[var(--color-azar-cyan)] p-4 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--color-azar-cyan)] hover:text-[var(--color-azar-magenta)] transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-brutalist">ESCAPAR</span>
          </button>

          <div className="text-center">
            <h1 className="text-6xl tracking-tighter font-brutalist text-white glitch-text">
              AZAR
            </h1>
            <p className="text-sm tracking-widest mt-1 text-[var(--color-azar-cyan)]">
              EL MERCADO NEGRO
            </p>
          </div>

          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Terminal */}
      <main className="flex-1 relative z-20 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full border-2 border-[var(--color-azar-cyan)] bg-black/90 backdrop-blur flex flex-col">
          {/* Terminal Header */}
          <div className="border-b-2 border-[var(--color-azar-cyan)] p-3 flex items-center justify-between bg-[var(--color-azar-cyan)]/10">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-[var(--color-azar-cyan)]" />
              <span className="font-brutalist text-sm text-[var(--color-azar-cyan)]">
                TERMINAL v0.CHAOS
              </span>
            </div>
            <AlertTriangle size={16} className="text-[var(--color-azar-magenta)] animate-pulse" />
          </div>

          {/* Terminal Output */}
          <div
            ref={terminalRef}
            className="flex-1 overflow-auto p-4 font-brutalist text-sm text-[var(--color-azar-cyan)] space-y-1"
          >
            {terminalHistory.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                {line}
              </motion.div>
            ))}
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleSubmit} className="border-t-2 border-[var(--color-azar-cyan)] p-4">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-azar-magenta)] font-brutalist">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-azar-cyan)] font-brutalist"
                placeholder="Escribe un comando..."
                autoFocus
              />
            </div>
          </form>
        </div>
      </main>

      {/* Product Glitch Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Win95 Error Window Style */}
              <div className="win95-bevel-out bg-[var(--color-win95-face)]">
                {/* Title Bar */}
                <div className="bg-[var(--color-azar-magenta)] text-black p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span className="font-win95">¡ERROR CRÍTICO!</span>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-5 h-5 bg-[var(--color-win95-face)] win95-bevel-out flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-6 mb-6">
                    <div className="w-1/2">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full aspect-square object-cover border-2 border-[var(--color-azar-magenta)]"
                        style={{
                          filter: 'hue-rotate(45deg) saturate(1.5)',
                        }}
                      />
                    </div>
                    <div className="w-1/2 flex flex-col">
                      <h2 className="text-2xl font-brutalist mb-2 glitch-text">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-xl font-brutalist mb-4 text-[var(--color-azar-magenta)]">
                        ${selectedProduct.price}
                        {selectedProduct.isNFT && " ETH"}
                      </p>
                      <p className="text-sm mb-4 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                      <p className="text-xs text-[var(--color-raza-gray)] mb-4">
                        SKU: {selectedProduct.sku} | Stock: {selectedProduct.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => addToCart(selectedProduct.id)}
                      className="flex-1 win95-bevel-out bg-[var(--color-azar-cyan)] text-black py-3 font-brutalist hover:win95-bevel-in"
                    >
                      [CAPTURAR PRODUCTO]
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1 win95-bevel-out bg-[var(--color-win95-face)] py-3 font-brutalist hover:win95-bevel-in"
                    >
                      [RECHAZAR]
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente de fondo generativo animado
function GenerativeBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-full"
            style={{
              left: `${i * 5}%`,
              background: `linear-gradient(180deg, var(--color-azar-cyan) 0%, var(--color-azar-magenta) 100%)`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 scanline-bg opacity-10" />
    </div>
  );
}
