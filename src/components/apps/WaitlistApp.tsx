/**
 * TIDElabs - WAITLIST.SH
 * Terminal de Registro estilo MS-DOS con Sistema de Referidos
 */

import { useState, useEffect, useRef } from "react";
import { Terminal, User, Users, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../utils/supabase/client";
import { pointsApi } from "../../utils/api";

interface TerminalLine {
  id: string;
  text: string;
  type: 'system' | 'user' | 'success' | 'error' | 'info';
  timestamp: Date;
}

const NAKAMA_ROLES = [
  'Navegante', 'Contramaestre', 'Artillero', 'Vigía', 'Cocinero',
  'Carpintero', 'Médico', 'Músico', 'Cartógrafo', 'Timonel',
  'Grumete', 'Marinero', 'Oficial', 'Capitán de Puerto', 'Explorador'
];

export function WaitlistApp() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'welcome' | 'username' | 'email' | 'role' | 'referral' | 'complete'>('welcome');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeTerminal();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const initializeTerminal = () => {
    const welcomeLines: TerminalLine[] = [
      {
        id: '1',
        text: 'TIDElabs OS v1.0 - Sistema de Registro NAKAMA',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '2',
        text: 'Copyright (C) 2024 TIDElabs. Todos los derechos reservados.',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '3',
        text: '',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '4',
        text: '¡Ahoy, futuro NAKAMA! Bienvenido al proceso de registro.',
        type: 'info',
        timestamp: new Date()
      },
      {
        id: '5',
        text: 'Únete a la lista de espera y obtén puntos por referir a otros.',
        type: 'info',
        timestamp: new Date()
      },
      {
        id: '6',
        text: '',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '7',
        text: 'Escribe "REGISTER" para comenzar o "HELP" para ver comandos disponibles.',
        type: 'system',
        timestamp: new Date()
      }
    ];
    setLines(welcomeLines);
  };

  const addLine = (text: string, type: TerminalLine['type'] = 'system') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const processCommand = async (command: string) => {
    const cmd = command.toUpperCase().trim();
    
    // Add user input to terminal
    addLine(`C:\\TIDELABS> ${command}`, 'user');

    switch (currentStep) {
      case 'welcome':
        await handleWelcomeCommands(cmd);
        break;
      case 'username':
        await handleUsernameInput(command.trim());
        break;
      case 'email':
        await handleEmailInput(command.trim());
        break;
      case 'role':
        await handleRoleInput(command.trim());
        break;
      case 'referral':
        await handleReferralInput(command.trim());
        break;
    }
  };

  const handleWelcomeCommands = async (cmd: string) => {
    switch (cmd) {
      case 'REGISTER':
        addLine('Iniciando proceso de registro...', 'success');
        addLine('', 'system');
        addLine('Paso 1/4: Nombre de usuario', 'info');
        addLine('Ingresa tu nombre de usuario NAKAMA (sin espacios):', 'system');
        setCurrentStep('username');
        break;
      
      case 'HELP':
        addLine('Comandos disponibles:', 'info');
        addLine('  REGISTER - Iniciar proceso de registro', 'system');
        addLine('  HELP     - Mostrar esta ayuda', 'system');
        addLine('  CLEAR    - Limpiar pantalla', 'system');
        addLine('  STATUS   - Ver estadísticas del sistema', 'system');
        break;
      
      case 'CLEAR':
        setLines([]);
        setTimeout(() => {
          initializeTerminal();
        }, 100);
        break;
      
      case 'STATUS':
        await showSystemStatus();
        break;
      
      default:
        addLine(`Comando no reconocido: ${cmd}`, 'error');
        addLine('Escribe "HELP" para ver comandos disponibles.', 'system');
    }
  };

  const handleUsernameInput = async (username: string) => {
    if (!username) {
      addLine('Error: El nombre de usuario no puede estar vacío.', 'error');
      return;
    }

    if (username.includes(' ')) {
      addLine('Error: El nombre de usuario no puede contener espacios.', 'error');
      return;
    }

    if (username.length < 3) {
      addLine('Error: El nombre de usuario debe tener al menos 3 caracteres.', 'error');
      return;
    }

    setFormData(prev => ({ ...prev, username }));
    addLine(`Usuario registrado: ${username}`, 'success');
    addLine('', 'system');
    addLine('Paso 2/4: Email', 'info');
    addLine('Ingresa tu dirección de email:', 'system');
    setCurrentStep('email');
  };

  const handleEmailInput = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      addLine('Error: Formato de email inválido.', 'error');
      return;
    }

    setFormData(prev => ({ ...prev, email }));
    addLine(`Email registrado: ${email}`, 'success');
    addLine('', 'system');
    addLine('Paso 3/4: Rol en el Galeón', 'info');
    addLine('Selecciona tu rol preferido escribiendo el número:', 'system');
    
    NAKAMA_ROLES.forEach((role, index) => {
      addLine(`  ${index + 1}. ${role}`, 'system');
    });
    
    setCurrentStep('role');
  };

  const handleRoleInput = async (input: string) => {
    const roleIndex = parseInt(input) - 1;
    
    if (isNaN(roleIndex) || roleIndex < 0 || roleIndex >= NAKAMA_ROLES.length) {
      addLine('Error: Selección inválida. Ingresa un número del 1 al 15.', 'error');
      return;
    }

    const selectedRole = NAKAMA_ROLES[roleIndex];
    setFormData(prev => ({ ...prev, role: selectedRole }));
    addLine(`Rol seleccionado: ${selectedRole}`, 'success');
    addLine('', 'system');
    addLine('Paso 4/4: Código de Referido (Opcional)', 'info');
    addLine('Si tienes un código de referido, ingrésalo ahora.', 'system');
    addLine('Si no tienes uno, escribe "SKIP" para continuar:', 'system');
    setCurrentStep('referral');
  };

  const handleReferralInput = async (input: string) => {
    const referralCode = input.trim().toUpperCase();
    
    if (referralCode === 'SKIP') {
      await completeRegistration();
      return;
    }

    if (referralCode.startsWith('NAKAMA-') && referralCode.length > 7) {
      // Validate referral code
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('referral_code')
          .eq('referral_code', referralCode)
          .single();

        if (error || !data) {
          addLine('Error: Código de referido inválido.', 'error');
          addLine('Escribe "SKIP" para continuar sin código de referido:', 'system');
          return;
        }

        setFormData(prev => ({ ...prev, referralCode }));
        addLine(`Código de referido válido: ${referralCode}`, 'success');
        addLine('¡Recibirás puntos bonus por ser referido!', 'info');
      } catch (error) {
        addLine('Error al validar código de referido.', 'error');
        addLine('Escribe "SKIP" para continuar sin código de referido:', 'system');
        return;
      }
    } else {
      addLine('Error: Formato de código inválido. Debe ser NAKAMA-XXXXXX', 'error');
      addLine('Escribe "SKIP" para continuar sin código de referido:', 'system');
      return;
    }

    await completeRegistration();
  };

  const completeRegistration = async () => {
    setLoading(true);
    addLine('Procesando registro...', 'info');

    try {
      const { error } = await supabase
        .from('waitlist_entries')
        .insert({
          wallet_address: walletAddress,
          email: formData.email,
          username: formData.username,
          selected_role: formData.role,
          referral_code: formData.referralCode || null,
          referred_by: formData.referralCode || null,
        });

      if (error) throw error;

      // Process referral if provided
      if (formData.referralCode && walletAddress) {
        try {
          await pointsApi.processReferral(walletAddress, formData.referralCode);
          addLine('Puntos de referido procesados exitosamente.', 'success');
        } catch (referralError) {
          console.error('Error processing referral:', referralError);
        }
      }

      addLine('', 'system');
      addLine('¡REGISTRO COMPLETADO EXITOSAMENTE!', 'success');
      addLine('', 'system');
      addLine('Resumen de tu registro:', 'info');
      addLine(`  Usuario: ${formData.username}`, 'system');
      addLine(`  Email: ${formData.email}`, 'system');
      addLine(`  Rol: ${formData.role}`, 'system');
      if (formData.referralCode) {
        addLine(`  Referido por: ${formData.referralCode}`, 'system');
      }
      addLine('', 'system');
      addLine('Te notificaremos cuando el sistema esté listo.', 'info');
      addLine('¡Bienvenido a bordo, NAKAMA!', 'success');
      
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error completing registration:', error);
      addLine('Error: No se pudo completar el registro.', 'error');
      addLine('Por favor, intenta nuevamente más tarde.', 'system');
    } finally {
      setLoading(false);
    }
  };

  const showSystemStatus = async () => {
    try {
      const { data: waitlistData } = await supabase
        .from('waitlist_entries')
        .select('id');

      const { data: contributionsData } = await supabase
        .from('crowdfund_contributions')
        .select('amount');

      const totalWaitlist = waitlistData?.length || 0;
      const totalRaised = contributionsData?.reduce((sum, c) => sum + c.amount, 0) || 0;

      addLine('Estado del Sistema TIDElabs:', 'info');
      addLine(`  NAKAMAs en waitlist: ${totalWaitlist}`, 'system');
      addLine(`  Fondos recaudados: $${totalRaised.toLocaleString()}`, 'system');
      addLine(`  Estado: OPERATIVO`, 'success');
    } catch (error) {
      addLine('Error al obtener estadísticas del sistema.', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !loading) {
      processCommand(currentInput);
      setCurrentInput('');
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'user': return 'text-white';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-cyan-400';
      default: return 'text-green-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-300 font-mono">
      {/* Header */}
      <div className="bg-gray-800 text-white p-2 flex items-center gap-2 border-b border-gray-600">
        <Terminal size={16} />
        <span className="text-sm font-bold">WAITLIST.SH - MS-DOS Terminal</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 space-y-1 text-sm"
      >
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${getLineColor(line.type)} whitespace-pre-wrap`}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {loading && (
          <div className="text-yellow-400 animate-pulse">
            Procesando...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-600 p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-green-300">C:\TIDELABS&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 bg-transparent text-green-300 outline-none font-mono"
            disabled={loading || currentStep === 'complete'}
            autoComplete="off"
          />
          <div className="w-2 h-4 bg-green-300 animate-pulse" />
        </form>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 text-white p-2 text-xs flex justify-between items-center border-t border-gray-600">
        <div className="flex items-center gap-4">
          <span>TIDElabs OS v1.0</span>
          {walletAddress && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}