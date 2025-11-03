/**
 * TIDElabs - Sistema de Sonidos Retro
 * Feedback auditivo para interacciones
 */

// Generador de sonidos retro usando Web Audio API
class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sonido de clic de botón Win95
  click() {
    this.playTone(800, 0.05);
  }

  // Sonido de abrir ventana
  windowOpen() {
    this.playTone(440, 0.1, 'sine');
    setTimeout(() => this.playTone(554, 0.1, 'sine'), 50);
  }

  // Sonido de cerrar ventana
  windowClose() {
    this.playTone(554, 0.1, 'sine');
    setTimeout(() => this.playTone(440, 0.1, 'sine'), 50);
  }

  // Sonido de notificación
  notification() {
    this.playTone(523, 0.1, 'sine');
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 200);
  }

  // Sonido de error
  error() {
    this.playTone(200, 0.2, 'sawtooth');
  }

  // Sonido de éxito
  success() {
    this.playTone(523, 0.1, 'sine');
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 80);
    setTimeout(() => this.playTone(784, 0.1, 'sine'), 160);
    setTimeout(() => this.playTone(1047, 0.2, 'sine'), 240);
  }

  // Sonido de hover
  hover() {
    this.playTone(1000, 0.03);
  }

  // Sonido de terminal
  terminal() {
    this.playTone(2000, 0.02, 'sine');
  }

  // Sonido de glitch (para AZAR)
  glitch() {
    const frequencies = [100, 200, 150, 300, 250];
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.05, 'sawtooth'), i * 30);
    });
  }
}

export const sounds = new SoundSystem();

// Hook para usar sonidos en componentes
export function useSounds() {
  return sounds;
}
