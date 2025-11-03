/**
 * TIDElabs - La Llave Maestra
 * Botón de conexión Web3 (SIWE - Sign-In With Ethereum)
 */

import { useState } from "react";
import { Wallet } from "lucide-react";
import { authApi } from "../utils/api";

interface WalletConnectButtonProps {
  onConnect?: (address: string, sessionToken: string) => void;
}

export function WalletConnectButton({ onConnect }: WalletConnectButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Verificar si existe MetaMask u otro proveedor Web3
      if (typeof window.ethereum !== "undefined") {
        // Solicitar acceso a la cuenta
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        
        const userAddress = accounts[0];
        
        // Crear mensaje SIWE
        const message = `Iniciar sesión en TIDElabs\nAddress: ${userAddress}\nNonce: ${Date.now()}`;
        
        // Solicitar firma (en producción, se usaría la biblioteca SIWE completa)
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, userAddress],
        }) as string;
        
        // Verificar con backend
        const response = await authApi.verifySIWE(userAddress, signature, message);
        
        if (response.success) {
          setAddress(userAddress);
          
          // Guardar session token en localStorage
          localStorage.setItem('tidelabs_session', response.token || '');
          localStorage.setItem('tidelabs_wallet', userAddress);
          
          if (onConnect) {
            onConnect(userAddress, response.token || '');
          }
          
          console.log("Wallet conectada y autenticada:", userAddress);
          console.log("Usuario:", response.user);
        }
      } else {
        alert(
          "No se detectó un proveedor Web3. Por favor, instala MetaMask o un wallet compatible."
        );
      }
    } catch (error) {
      console.error("Error al conectar wallet:", error);
      alert("Error al conectar wallet. Por favor, intenta de nuevo.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    localStorage.removeItem('tidelabs_session');
    localStorage.removeItem('tidelabs_wallet');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (address) {
    return (
      <button
        onClick={disconnectWallet}
        className="win95-bevel-out bg-[var(--color-win95-face)] px-4 py-2 font-win95 hover:win95-bevel-in active:win95-bevel-in flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-[var(--color-raza-accent)] rounded-full animate-pulse" />
        <span className="font-brutalist">{formatAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="win95-bevel-out bg-[var(--color-win95-face)] px-4 py-2 font-win95 hover:win95-bevel-in active:win95-bevel-in flex items-center gap-2 disabled:opacity-50"
    >
      <Wallet size={16} className="text-[var(--color-raza-black)]" />
      <span>{isConnecting ? "Conectando..." : "[Conectar Alma]"}</span>
    </button>
  );
}

// Declaración de tipo para window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
