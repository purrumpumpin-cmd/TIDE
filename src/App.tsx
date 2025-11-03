/**
 * TIDElabs - El Galeón Digital
 * La Forja del Ecosistema
 */

import { useState, useEffect } from "react";
import { CRTEffect } from "./components/CRTEffect";
import { WindowsStyleBootAnimation } from "./components/WindowsStyleBootAnimation";
import { BootSequence } from "./components/BootSequence";
import { SplitScreenPortal } from "./components/SplitScreenPortal";
import { TIDELabsDesktop } from "./components/TIDELabsDesktop";
import { RazaAtelier } from "./components/RazaAtelier";
import { AzarMercado } from "./components/AzarMercado";
import { productsApi } from "./utils/api";

type AppView = "splash" | "windows-boot" | "boot" | "portal" | "galeon" | "raza" | "azar";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("splash");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar productos (seed)
    initializeProducts();
    
    // Verificar sesión guardada
    const savedSession = localStorage.getItem('tidelabs_session');
    if (savedSession) {
      setSessionToken(savedSession);
    }
  }, []);

  const initializeProducts = async () => {
    try {
      // Verificar si ya existen productos
      const existing = await productsApi.list();
      if (existing.products.length === 0) {
        console.log("Seeding products...");
        await productsApi.seed();
        console.log("Products seeded successfully");
      }
    } catch (error) {
      console.error("Error initializing products:", error);
    }
  };

  const handleWindowsBootComplete = () => {
    setCurrentView("boot");
  };

  const handleBootComplete = () => {
    setCurrentView("galeon");
  };

  const handleSelectRaza = () => {
    setCurrentView("raza");
  };

  const handleSelectAzar = () => {
    setCurrentView("azar");
  };

  const handleEnterGaleon = () => {
    setCurrentView("windows-boot");
  };

  const renderView = () => {
    switch (currentView) {
      case "splash":
        return (
          <SplitScreenPortal
            onSelectRaza={handleSelectRaza}
            onSelectAzar={handleSelectAzar}
            onEnterGaleon={handleEnterGaleon}
          />
        );

      case "windows-boot":
        return <WindowsStyleBootAnimation onComplete={handleWindowsBootComplete} />;
      
      case "boot":
        return <BootSequence onComplete={handleBootComplete} />;
      
      case "portal":
        return (
          <SplitScreenPortal
            onSelectRaza={handleSelectRaza}
            onSelectAzar={handleSelectAzar}
            onEnterGaleon={handleEnterGaleon}
          />
        );
      
      case "galeon":
        return (
          <TIDELabsDesktop
            onNavigateRaza={handleSelectRaza}
            onNavigateAzar={handleSelectAzar}
            onNavigateHome={() => setCurrentView("splash")}
          />
        );
      
      case "raza":
        return (
          <RazaAtelier
            onBack={() => setCurrentView("portal")}
            sessionToken={sessionToken}
          />
        );
      
      case "azar":
        return (
          <AzarMercado
            onBack={() => setCurrentView("portal")}
            sessionToken={sessionToken}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <CRTEffect />
      {renderView()}
    </>
  );
}
