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

// ═══════════════════════════════════════════════════════════
// ROLES NAKAMA CON REQUISITOS DINÁMICOS
// ═══════════════════════════════════════════════════════════

interface NakamaRole {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  difficulty: 'Novato' | 'Experimentado' | 'Veterano' | 'Legendario';
  benefits: string[];
  emoji: string;
}

const NAKAMA_ROLES: NakamaRole[] = [
  // ROLES NOVATOS (Sin requisitos especiales)
  {
    id: 'grumete',
    name: 'Grumete',
    description: 'Aprendiz de marinero, primer paso en The Aetherius',
    requirements: ['Ganas de aprender', 'Actitud positiva'],
    difficulty: 'Novato',
    benefits: ['Acceso básico al OS', 'Puntos de bienvenida'],
    emoji: '🧑‍🚀'
  },
  {
    id: 'marinero',
    name: 'Marinero',
    description: 'Tripulante básico con conocimientos fundamentales',
    requirements: ['Experiencia básica en crypto', 'Conocimiento de Discord/Telegram'],
    difficulty: 'Novato',
    benefits: ['Acceso a chat grupal', 'Notificaciones prioritarias'],
    emoji: '⚓'
  },
  {
    id: 'cocinero',
    name: 'Cocinero',
    description: 'Encargado de mantener la moral alta con buena comida',
    requirements: ['Habilidades de community management', 'Experiencia en redes sociales'],
    difficulty: 'Novato',
    benefits: ['Acceso a herramientas de contenido', 'Rol especial en Discord'],
    emoji: '👨‍🍳'
  },

  // ROLES EXPERIMENTADOS
  {
    id: 'navegante',
    name: 'Navegante',
    description: 'Experto en rutas digitales y estrategias de navegación',
    requirements: ['Portfolio de proyectos crypto', 'Experiencia en DeFi (6+ meses)', 'Conocimiento de análisis técnico'],
    difficulty: 'Experimentado',
    benefits: ['Acceso a señales de trading', 'Dashboard avanzado', 'Grupo VIP'],
    emoji: '🧭'
  },
  {
    id: 'contramaestre',
    name: 'Contramaestre',
    description: 'Líder de equipo y organizador de operaciones',
    requirements: ['Experiencia liderando equipos', 'Historial en proyectos Web3', 'Referencias verificables'],
    difficulty: 'Experimentado',
    benefits: ['Acceso a herramientas de gestión', 'Comisiones por referidos', 'Voto en decisiones'],
    emoji: '👨‍✈️'
  },
  {
    id: 'artillero',
    name: 'Artillero',
    description: 'Especialista en seguridad y defensa digital',
    requirements: ['Conocimientos de ciberseguridad', 'Experiencia en auditorías', 'Certificaciones técnicas'],
    difficulty: 'Experimentado',
    benefits: ['Acceso a herramientas de seguridad', 'Bounties por vulnerabilidades', 'Rol de moderador'],
    emoji: '💥'
  },
  {
    id: 'musico',
    name: 'Músico',
    description: 'Artista que aporta cultura y entretenimiento',
    requirements: ['Portfolio musical', 'Presencia en plataformas digitales', 'Experiencia en NFTs musicales'],
    difficulty: 'Experimentado',
    benefits: ['Acceso prioritario a TUNOVA.IO', 'Herramientas de creación', 'Revenue share'],
    emoji: '🎵'
  },

  // ROLES VETERANOS
  {
    id: 'cartografo',
    name: 'Cartógrafo',
    description: 'Analista de mercados y creador de estrategias',
    requirements: ['Experiencia en análisis de mercados (2+ años)', 'Historial de predicciones exitosas', 'Conocimiento avanzado de DeFi'],
    difficulty: 'Veterano',
    benefits: ['Acceso a datos premium', 'Herramientas de análisis', 'Comisiones por insights'],
    emoji: '🗺️'
  },
  {
    id: 'timonel',
    name: 'Timonel',
    description: 'Piloto experto que guía el rumbo del proyecto',
    requirements: ['Experiencia en desarrollo blockchain', 'Participación en DAOs', 'Historial de contribuciones open source'],
    difficulty: 'Veterano',
    benefits: ['Acceso a repositorios privados', 'Voto ponderado en governance', 'Tokens de recompensa'],
    emoji: '🚢'
  },
  {
    id: 'medico',
    name: 'Médico',
    description: 'Especialista en resolver problemas y crisis',
    requirements: ['Experiencia en resolución de conflictos', 'Conocimiento legal en crypto', 'Historial de mediación'],
    difficulty: 'Veterano',
    benefits: ['Acceso a canales de crisis', 'Herramientas de mediación', 'Compensación por resoluciones'],
    emoji: '⚕️'
  },

  // ROLES LEGENDARIOS
  {
    id: 'capitan-puerto',
    name: 'Capitán de Puerto',
    description: 'Autoridad máxima en operaciones portuarias',
    requirements: ['Experiencia fundando proyectos crypto', 'Red de contactos verificada', 'Inversión mínima de $10K', 'Referencias de otros capitanes'],
    difficulty: 'Legendario',
    benefits: ['Acceso completo al ecosistema', 'Revenue share del 2%', 'Voto ejecutivo', 'NFT exclusivo'],
    emoji: '🏴‍☠️'
  },
  {
    id: 'explorador',
    name: 'Explorador',
    description: 'Pionero que descubre nuevas oportunidades',
    requirements: ['Historial de early adoption', 'Participación en 5+ proyectos exitosos', 'Reputación on-chain verificable'],
    difficulty: 'Legendario',
    benefits: ['Acceso a oportunidades pre-launch', 'Allocations garantizadas', 'Asesoría directa del equipo'],
    emoji: '🔍'
  },
  {
    id: 'oficial',
    name: 'Oficial',
    description: 'Miembro del consejo directivo del proyecto',
    requirements: ['Experiencia C-level en crypto', 'Inversión mínima de $25K', 'Aprobación del consejo actual', 'KYC completo'],
    difficulty: 'Legendario',
    benefits: ['Participación en decisiones estratégicas', 'Revenue share del 5%', 'Acceso a información privilegiada', 'NFT de fundador'],
    emoji: '⭐'
  }
];

export function WaitlistApp() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'welcome' | 'username' | 'email' | 'role' | 'role_details' | 'requirements' | 'referral' | 'complete'>('welcome');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    roleId: '',
    referralCode: '',
    requirementsConfirmed: false
  });
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(-1);
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
        text: '████████╗██╗██████╗ ███████╗██╗      █████╗ ██████╗ ███████╗',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '2',
        text: '╚══██╔══╝██║██╔══██╗██╔════╝██║     ██╔══██╗██╔══██╗██╔════╝',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '3',
        text: '   ██║   ██║██║  ██║█████╗  ██║     ███████║██████╔╝███████╗',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '4',
        text: '   ██║   ██║██║  ██║██╔══╝  ██║     ██╔══██║██╔══██╗╚════██║',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '5',
        text: '   ██║   ██║██████╔╝███████╗███████╗██║  ██║██████╔╝███████║',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '6',
        text: '   ╚═╝   ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '7',
        text: '',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '8',
        text: 'TIDElabs OS v1.0 - NAKAMA Registration System',
        type: 'info',
        timestamp: new Date()
      },
      {
        id: '9',
        text: 'Copyright (C) 2024 TIDElabs Corp. All rights reserved.',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '10',
        text: '═══════════════════════════════════════════════════════════════════════════════',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '11',
        text: '',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '12',
        text: 'Ahoy, future NAKAMA! Welcome to The Aetherius crew registration.',
        type: 'info',
        timestamp: new Date()
      },
      {
        id: '13',
        text: 'Join our waitlist and earn points by referring other pirates.',
        type: 'info',
        timestamp: new Date()
      },
      {
        id: '14',
        text: '',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '15',
        text: 'Available commands:',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '16',
        text: '  REGISTER - Start registration process',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '17',
        text: '  HELP     - Show available commands',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '18',
        text: '  ROLES    - View all available crew positions',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '19',
        text: '  STATUS   - Check system statistics',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '20',
        text: '  CLEAR    - Clear screen',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: '21',
        text: '',
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
      case 'role_details':
        await handleRoleDetailsInput(command.trim());
        break;
      case 'requirements':
        await handleRequirementsInput(command.trim());
        break;
      case 'referral':
        await handleReferralInput(command.trim());
        break;
    }
  };

  const handleWelcomeCommands = async (cmd: string) => {
    switch (cmd) {
      case 'REGISTER':
        addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
        addLine('                        NAKAMA REGISTRATION INITIATED', 'success');
        addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
        addLine('', 'system');
        addLine('Step 1/5: Username Configuration', 'info');
        addLine('Enter your NAKAMA username (no spaces, 3-20 characters):', 'system');
        setCurrentStep('username');
        break;
      
      case 'HELP':
        addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
        addLine('                              HELP SYSTEM', 'info');
        addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
        addLine('Available commands:', 'system');
        addLine('  REGISTER - Start NAKAMA registration process', 'system');
        addLine('  ROLES    - Display all crew positions with requirements', 'system');
        addLine('  STATUS   - Show system statistics and metrics', 'system');
        addLine('  CLEAR    - Clear terminal screen', 'system');
        addLine('  HELP     - Display this help information', 'system');
        addLine('', 'system');
        break;

      case 'ROLES':
        await showAllRoles();
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
        addLine(`[ERROR] Unknown command: ${cmd}`, 'error');
        addLine('Type "HELP" to see available commands.', 'system');
    }
  };

  const showAllRoles = async () => {
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('                        THE AETHERIUS CREW POSITIONS', 'info');
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('', 'system');

    const rolesByDifficulty = {
      'Novato': NAKAMA_ROLES.filter(r => r.difficulty === 'Novato'),
      'Experimentado': NAKAMA_ROLES.filter(r => r.difficulty === 'Experimentado'),
      'Veterano': NAKAMA_ROLES.filter(r => r.difficulty === 'Veterano'),
      'Legendario': NAKAMA_ROLES.filter(r => r.difficulty === 'Legendario')
    };

    Object.entries(rolesByDifficulty).forEach(([difficulty, roles]) => {
      const difficultyColor = difficulty === 'Novato' ? 'success' : 
                             difficulty === 'Experimentado' ? 'info' :
                             difficulty === 'Veterano' ? 'system' : 'error';
      
      addLine(`▓▓▓ ${difficulty.toUpperCase()} LEVEL ▓▓▓`, difficultyColor);
      roles.forEach((role, index) => {
        addLine(`${role.emoji} ${role.name} - ${role.description}`, 'system');
      });
      addLine('', 'system');
    });

    addLine('Use "REGISTER" to start the application process.', 'info');
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
      addLine('[ERROR] Invalid email format.', 'error');
      addLine('Please enter a valid email address:', 'system');
      return;
    }

    setFormData(prev => ({ ...prev, email }));
    addLine(`[SUCCESS] Email registered: ${email}`, 'success');
    addLine('', 'system');
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('Step 3/5: Crew Position Selection', 'info');
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('', 'system');
    addLine('Select your preferred role by entering the number:', 'system');
    addLine('', 'system');
    
    NAKAMA_ROLES.forEach((role, index) => {
      const difficultyColor = role.difficulty === 'Novato' ? 'success' : 
                             role.difficulty === 'Experimentado' ? 'info' :
                             role.difficulty === 'Veterano' ? 'system' : 'error';
      addLine(`${index + 1}. ${role.emoji} ${role.name} [${role.difficulty}]`, difficultyColor);
    });
    
    addLine('', 'system');
    addLine('Type the number of your desired position:', 'system');
    setCurrentStep('role');
  };

  const handleRoleInput = async (input: string) => {
    const roleIndex = parseInt(input) - 1;
    
    if (isNaN(roleIndex) || roleIndex < 0 || roleIndex >= NAKAMA_ROLES.length) {
      addLine(`[ERROR] Invalid selection. Enter a number from 1 to ${NAKAMA_ROLES.length}.`, 'error');
      return;
    }

    const selectedRole = NAKAMA_ROLES[roleIndex];
    setSelectedRoleIndex(roleIndex);
    
    addLine(`[SELECTED] ${selectedRole.emoji} ${selectedRole.name}`, 'success');
    addLine('', 'system');
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('                           ROLE INFORMATION', 'info');
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('', 'system');
    addLine(`Position: ${selectedRole.name} ${selectedRole.emoji}`, 'system');
    addLine(`Difficulty: ${selectedRole.difficulty}`, selectedRole.difficulty === 'Novato' ? 'success' : 
                                                      selectedRole.difficulty === 'Experimentado' ? 'info' :
                                                      selectedRole.difficulty === 'Veterano' ? 'system' : 'error');
    addLine(`Description: ${selectedRole.description}`, 'system');
    addLine('', 'system');
    addLine('Benefits:', 'info');
    selectedRole.benefits.forEach(benefit => {
      addLine(`  ✓ ${benefit}`, 'success');
    });
    addLine('', 'system');
    addLine('Type "ACCEPT" to proceed with this role or "BACK" to choose another:', 'system');
    setCurrentStep('role_details');
  };

  const handleRoleDetailsInput = async (input: string) => {
    const cmd = input.toUpperCase();
    
    if (cmd === 'ACCEPT') {
      const selectedRole = NAKAMA_ROLES[selectedRoleIndex];
      addLine(`[CONFIRMED] Role accepted: ${selectedRole.name}`, 'success');
      addLine('', 'system');
      addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
      addLine('Step 4/5: Requirements Verification', 'info');
      addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
      addLine('', 'system');
      addLine(`Requirements for ${selectedRole.name}:`, 'system');
      addLine('', 'system');
      selectedRole.requirements.forEach((req, index) => {
        addLine(`${index + 1}. ${req}`, 'system');
      });
      addLine('', 'system');
      addLine('Do you meet all these requirements?', 'info');
      addLine('Type "YES" to confirm or "NO" to select a different role:', 'system');
      setCurrentStep('requirements');
    } else if (cmd === 'BACK') {
      addLine('Returning to role selection...', 'info');
      addLine('', 'system');
      addLine('Select your preferred role by entering the number:', 'system');
      addLine('', 'system');
      
      NAKAMA_ROLES.forEach((role, index) => {
        const difficultyColor = role.difficulty === 'Novato' ? 'success' : 
                               role.difficulty === 'Experimentado' ? 'info' :
                               role.difficulty === 'Veterano' ? 'system' : 'error';
        addLine(`${index + 1}. ${role.emoji} ${role.name} [${role.difficulty}]`, difficultyColor);
      });
      
      addLine('', 'system');
      setCurrentStep('role');
    } else {
      addLine('[ERROR] Invalid command. Type "ACCEPT" or "BACK".', 'error');
    }
  };

  const handleRequirementsInput = async (input: string) => {
    const cmd = input.toUpperCase();
    
    if (cmd === 'YES') {
      const selectedRole = NAKAMA_ROLES[selectedRoleIndex];
      setFormData(prev => ({ 
        ...prev, 
        role: selectedRole.name,
        roleId: selectedRole.id,
        requirementsConfirmed: true 
      }));
      
      addLine('[SUCCESS] Requirements confirmed!', 'success');
      addLine('', 'system');
      addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
      addLine('Step 5/5: Referral Code (Optional)', 'info');
      addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
      addLine('', 'system');
      addLine('If you have a referral code, enter it now.', 'system');
      addLine('If not, type "SKIP" to complete registration:', 'system');
      setCurrentStep('referral');
    } else if (cmd === 'NO') {
      addLine('Requirements not met. Please select a different role.', 'error');
      addLine('', 'system');
      addLine('Returning to role selection...', 'info');
      addLine('', 'system');
      
      NAKAMA_ROLES.forEach((role, index) => {
        const difficultyColor = role.difficulty === 'Novato' ? 'success' : 
                               role.difficulty === 'Experimentado' ? 'info' :
                               role.difficulty === 'Veterano' ? 'system' : 'error';
        addLine(`${index + 1}. ${role.emoji} ${role.name} [${role.difficulty}]`, difficultyColor);
      });
      
      addLine('', 'system');
      setCurrentStep('role');
    } else {
      addLine('[ERROR] Invalid response. Type "YES" or "NO".', 'error');
    }
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
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('                        PROCESSING REGISTRATION', 'info');
    addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
    addLine('', 'system');
    addLine('Validating data...', 'info');

    try {
      const selectedRole = NAKAMA_ROLES.find(r => r.id === formData.roleId);
      
      const { error } = await supabase
        .from('waitlist_entries')
        .insert({
          wallet_address: walletAddress,
          email: formData.email,
          username: formData.username,
          selected_role: formData.role,
          role_id: formData.roleId,
          role_difficulty: selectedRole?.difficulty || 'Novato',
          requirements_confirmed: formData.requirementsConfirmed,
          referral_code: formData.referralCode || null,
          referred_by: formData.referralCode || null,
          registration_date: new Date().toISOString(),
        });

      if (error) throw error;

      addLine('[SUCCESS] Data validated and stored.', 'success');

      // Process referral if provided
      if (formData.referralCode && walletAddress) {
        try {
          addLine('Processing referral bonus...', 'info');
          await pointsApi.processReferral(walletAddress, formData.referralCode);
          addLine('[SUCCESS] Referral bonus processed.', 'success');
        } catch (referralError) {
          console.error('Error processing referral:', referralError);
          addLine('[WARNING] Referral processing failed.', 'error');
        }
      }

      addLine('', 'system');
      addLine('█████████████████████████████████████████████████████████████████████████████', 'success');
      addLine('                    REGISTRATION COMPLETED SUCCESSFULLY!', 'success');
      addLine('█████████████████████████████████████████████████████████████████████████████', 'success');
      addLine('', 'system');
      addLine('NAKAMA Profile Summary:', 'info');
      addLine('═══════════════════════════════════════════════════════════════════════════════', 'system');
      addLine(`Username: ${formData.username}`, 'system');
      addLine(`Email: ${formData.email}`, 'system');
      addLine(`Position: ${selectedRole?.emoji} ${formData.role}`, 'system');
      addLine(`Difficulty Level: ${selectedRole?.difficulty}`, selectedRole?.difficulty === 'Novato' ? 'success' : 
                                                                selectedRole?.difficulty === 'Experimentado' ? 'info' :
                                                                selectedRole?.difficulty === 'Veterano' ? 'system' : 'error');
      addLine(`Requirements: CONFIRMED`, 'success');
      if (formData.referralCode) {
        addLine(`Referred by: ${formData.referralCode}`, 'success');
      }
      addLine(`Registration ID: NAKAMA-${Date.now().toString().slice(-6)}`, 'info');
      addLine('', 'system');
      addLine('Next Steps:', 'info');
      addLine('1. Check your email for confirmation', 'system');
      addLine('2. Join our Discord community', 'system');
      addLine('3. Wait for The Aetherius launch notification', 'system');
      addLine('', 'system');
      addLine('Welcome aboard The Aetherius, NAKAMA! 🏴‍☠️', 'success');
      addLine('', 'system');
      
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error completing registration:', error);
      addLine('[ERROR] Registration failed.', 'error');
      addLine('Please try again later or contact support.', 'system');
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
      case 'user': return 'text-green-200 font-bold';
      case 'success': return 'text-green-400 font-semibold';
      case 'error': return 'text-red-400 font-semibold animate-pulse';
      case 'info': return 'text-green-300 font-semibold';
      default: return 'text-green-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-300 font-mono" style={{ fontFamily: 'Courier New, monospace' }}>
      {/* MS-DOS Header */}
      <div className="bg-black text-green-300 p-2 flex items-center gap-2 border-b border-green-600">
        <Terminal size={16} className="text-green-400" />
        <span className="text-sm font-bold tracking-wider">MS-DOS 6.22 - WAITLIST.SH</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs">ONLINE</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 space-y-0 text-sm leading-tight bg-black"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#22c55e #000000'
        }}
      >
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`${getLineColor(line.type)} whitespace-pre-wrap leading-tight`}
              style={{ 
                textShadow: '0 0 5px currentColor',
                letterSpacing: '0.5px'
              }}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {loading && (
          <motion.div 
            className="text-green-400 font-bold animate-pulse flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            PROCESSING...
          </motion.div>
        )}
      </div>

      {/* Command Input */}
      <div className="border-t border-green-600 p-4 bg-black">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-green-400 font-bold tracking-wider">C:\TIDELABS&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 bg-transparent text-green-300 outline-none font-mono font-bold tracking-wide"
            style={{ 
              textShadow: '0 0 5px #22c55e',
              caretColor: '#22c55e'
            }}
            disabled={loading || currentStep === 'complete'}
            autoComplete="off"
            placeholder={currentStep === 'complete' ? 'Registration complete' : 'Enter command...'}
          />
          <div 
            className="w-2 h-4 bg-green-400 animate-pulse"
            style={{ 
              boxShadow: '0 0 10px #22c55e'
            }}
          />
        </form>
      </div>

      {/* MS-DOS Status Bar */}
      <div className="bg-black text-green-300 p-2 text-xs flex justify-between items-center border-t border-green-600">
        <div className="flex items-center gap-4 font-bold">
          <span className="tracking-wider">TIDElabs OS v1.0</span>
          {walletAddress && (
            <span className="flex items-center gap-1 text-green-400">
              <User size={12} />
              <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </span>
          )}
          <span className="text-green-500">
            Step: {currentStep === 'welcome' ? 'READY' : 
                   currentStep === 'username' ? '1/5' :
                   currentStep === 'email' ? '2/5' :
                   currentStep === 'role' ? '3/5' :
                   currentStep === 'role_details' ? '3/5' :
                   currentStep === 'requirements' ? '4/5' :
                   currentStep === 'referral' ? '5/5' : 'COMPLETE'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-bold">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="tracking-wider">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}