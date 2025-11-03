/**
 * TIDElabs - El Marco del Recuerdo
 * Contenedor Win95 para las aplicaciones del Galeón
 */

import { X, Minimize2, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  onFocus?: () => void;
  isMinimized?: boolean;
}

export function WindowFrame({
  title,
  children,
  onClose,
  onMinimize,
  initialX = 100,
  initialY = 100,
  width = 600,
  height = 400,
  zIndex = 1,
  onFocus,
  isMinimized = false,
}: WindowFrameProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: initialX, y: initialY });
  const [previousSize, setPreviousSize] = useState({ width, height });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onFocus) onFocus();
    
    // No arrastrar si está maximizado
    if (isMaximized) return;
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      // Guardar posición y tamaño actual
      setPreviousPosition(position);
      setPreviousSize({ width, height });
    } else {
      // Restaurar posición y tamaño anterior
      setPosition(previousPosition);
    }
    setIsMaximized(!isMaximized);
  };

  const handleMinimizeClick = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleWindowClick = () => {
    if (onFocus) onFocus();
  };

  if (isMinimized) {
    return null;
  }

  const windowStyle = isMaximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 48px)", zIndex }
    : {
        top: position.y,
        left: position.x,
        width: width,
        height: height,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="fixed win95-bevel-out bg-[var(--color-win95-face)] flex flex-col"
      style={windowStyle}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div
        className="win95-titlebar flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="font-win95 px-1 select-none">{title}</span>
        <div className="flex gap-[2px]">
          <button
            className="w-4 h-4 bg-[var(--color-win95-face)] win95-bevel-out flex items-center justify-center hover:win95-bevel-in active:win95-bevel-in"
            onClick={handleMinimizeClick}
            aria-label="Minimize"
          >
            <Minimize2 size={10} className="text-black" />
          </button>
          <button
            className="w-4 h-4 bg-[var(--color-win95-face)] win95-bevel-out flex items-center justify-center hover:win95-bevel-in active:win95-bevel-in"
            onClick={handleMaximize}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            <Square size={10} className="text-black" />
          </button>
          {onClose && (
            <button
              className="w-4 h-4 bg-[var(--color-win95-face)] win95-bevel-out flex items-center justify-center hover:win95-bevel-in active:win95-bevel-in"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={10} className="text-black" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-2 bg-white win95-bevel-in">
        {children}
      </div>
    </div>
  );
}
