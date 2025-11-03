/**
 * TIDElabs - ARCADE.EXE
 * Área Recreativa Épica - Saca el niño interior
 */

import { useState, useEffect } from 'react';
import { Gamepad2, ExternalLink, Plus, Star, Clock } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface ArcadeSuggestion {
  id: string;
  username: string;
  suggestion_title: string;
  suggestion_url: string;
  suggestion_description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function ArcadeApp() {
  const [activeTab, setActiveTab] = useState<'games' | 'suggest'>('games');
  const [suggestions, setSuggestions] = useState<ArcadeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletAddress] = useState<string | null>(localStorage.getItem('tidelabs_wallet'));

  // Form state for suggestions
  const [suggestionForm, setSuggestionForm] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    loadApprovedSuggestions();
  }, []);

  const loadApprovedSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('arcade_suggestions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const submitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert('Conecta tu wallet para enviar sugerencias');
      return;
    }

    if (!suggestionForm.title || !suggestionForm.url) {
      alert('Título y URL son requeridos');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('arcade_suggestions')
        .insert({
          wallet_address: walletAddress,
          username: `NAKAMA-${walletAddress.slice(-6).toUpperCase()}`,
          suggestion_title: suggestionForm.title,
          suggestion_url: suggestionForm.url,
          suggestion_description: suggestionForm.description,
          status: 'pending'
        });

      if (error) throw error;

      // Reset form
      setSuggestionForm({ title: '', url: '', description: '' });
      alert('¡Sugerencia enviada! Será revisada por los moderadores.');
      
      // Add points for suggestion
      // TODO: Call points API
      
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Error al enviar sugerencia');
    } finally {
      setLoading(false);
    }
  };

  const defaultGames = [
    {
      title: 'Floor796',
      url: 'https://floor796.com/',
      description: 'Un mundo pixelado infinito lleno de referencias y easter eggs',
      icon: '🏢'
    },
    {
      title: 'EmuOS',
      url: 'https://emupedia.net/beta/emuos/',
      description: 'Emulador de sistemas operativos retro con juegos clásicos',
      icon: '💾'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white font-win95">
      {/* Header */}
      <div className="bg-[var(--color-win95-titlebar)] text-white p-4 win95-bevel-out">
        <div className="flex items-center gap-3">
          <Gamepad2 size={24} />
          <div>
            <h2 className="font-brutalist tracking-wider">ARCADE.EXE</h2>
            <p className="text-xs mt-1">Área Recreativa Épica</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[var(--color-win95-shadow)]">
        <button
          onClick={() => setActiveTab('games')}
          className={`px-6 py-3 font-brutalist text-sm ${
            activeTab === 'games'
              ? 'bg-white win95-bevel-out'
              : 'bg-[var(--color-win95-face)] hover:bg-white'
          }`}
        >
          🎮 JUEGOS
        </button>
        <button
          onClick={() => setActiveTab('suggest')}
          className={`px-6 py-3 font-brutalist text-sm ${
            activeTab === 'suggest'
              ? 'bg-white win95-bevel-out'
              : 'bg-[var(--color-win95-face)] hover:bg-white'
          }`}
        >
          💡 SUGERIR
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'games' && (
          <div className="space-y-6">
            {/* Default Games */}
            <div>
              <h3 className="font-brutalist text-lg mb-4 flex items-center gap-2">
                <Star className="text-yellow-500" size={20} />
                JUEGOS DESTACADOS
              </h3>
              <div className="grid gap-4">
                {defaultGames.map((game, index) => (
                  <div key={index} className="win95-bevel-out bg-white p-4 hover:win95-bevel-in transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{game.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-brutalist text-lg mb-2">{game.title}</h4>
                        <p className="text-sm text-[var(--color-raza-gray)] mb-3">
                          {game.description}
                        </p>
                        <div className="flex gap-2">
                          <a
                            href={game.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="win95-bevel-out bg-[var(--color-raza-accent)] text-white px-4 py-2 font-brutalist text-sm hover:win95-bevel-in flex items-center gap-2"
                          >
                            <ExternalLink size={16} />
                            JUGAR
                          </a>
                          <button
                            onClick={() => {
                              // Open in iframe modal
                              const iframe = document.createElement('iframe');
                              iframe.src = game.url;
                              iframe.style.width = '100%';
                              iframe.style.height = '600px';
                              iframe.style.border = 'none';
                              
                              const modal = document.createElement('div');
                              modal.style.position = 'fixed';
                              modal.style.top = '0';
                              modal.style.left = '0';
                              modal.style.width = '100%';
                              modal.style.height = '100%';
                              modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                              modal.style.zIndex = '9999';
                              modal.style.display = 'flex';
                              modal.style.alignItems = 'center';
                              modal.style.justifyContent = 'center';
                              modal.style.padding = '20px';
                              
                              const container = document.createElement('div');
                              container.style.backgroundColor = 'white';
                              container.style.width = '90%';
                              container.style.height = '90%';
                              container.style.border = '2px solid #000';
                              container.style.position = 'relative';
                              
                              const closeBtn = document.createElement('button');
                              closeBtn.textContent = '✕';
                              closeBtn.style.position = 'absolute';
                              closeBtn.style.top = '10px';
                              closeBtn.style.right = '10px';
                              closeBtn.style.zIndex = '10000';
                              closeBtn.style.background = 'red';
                              closeBtn.style.color = 'white';
                              closeBtn.style.border = 'none';
                              closeBtn.style.padding = '5px 10px';
                              closeBtn.style.cursor = 'pointer';
                              closeBtn.onclick = () => document.body.removeChild(modal);
                              
                              container.appendChild(closeBtn);
                              container.appendChild(iframe);
                              modal.appendChild(container);
                              document.body.appendChild(modal);
                            }}
                            className="win95-bevel-out bg-[var(--color-win95-face)] px-4 py-2 font-brutalist text-sm hover:win95-bevel-in"
                          >
                            VENTANA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h3 className="font-brutalist text-lg mb-4 flex items-center gap-2">
                  <Plus className="text-green-500" size={20} />
                  SUGERENCIAS NAKAMA
                </h3>
                <div className="grid gap-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="win95-bevel-out bg-white p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">🎯</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-brutalist text-lg">{suggestion.suggestion_title}</h4>
                            <span className="text-xs bg-green-200 px-2 py-1 rounded">
                              por {suggestion.username}
                            </span>
                          </div>
                          {suggestion.suggestion_description && (
                            <p className="text-sm text-[var(--color-raza-gray)] mb-3">
                              {suggestion.suggestion_description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-[var(--color-raza-gray)]">
                            <Clock size={12} />
                            {new Date(suggestion.created_at).toLocaleDateString()}
                          </div>
                          <div className="mt-3">
                            <a
                              href={suggestion.suggestion_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="win95-bevel-out bg-[var(--color-raza-accent)] text-white px-4 py-2 font-brutalist text-sm hover:win95-bevel-in inline-flex items-center gap-2"
                            >
                              <ExternalLink size={16} />
                              PROBAR
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggest' && (
          <div className="max-w-2xl">
            <h3 className="font-brutalist text-lg mb-4">SUGERIR NUEVO JUEGO</h3>
            
            {!walletAddress ? (
              <div className="win95-bevel-in bg-[var(--color-win95-face)] p-6 text-center">
                <Gamepad2 size={48} className="mx-auto mb-4 opacity-50" />
                <p className="mb-4">Conecta tu wallet para sugerir juegos</p>
                <p className="text-sm text-[var(--color-raza-gray)]">
                  Ganarás +25 puntos por cada sugerencia aprobada
                </p>
              </div>
            ) : (
              <form onSubmit={submitSuggestion} className="space-y-4">
                <div className="win95-bevel-out bg-white p-4">
                  <label className="block font-brutalist text-sm mb-2">
                    TÍTULO DEL JUEGO *
                  </label>
                  <input
                    type="text"
                    value={suggestionForm.title}
                    onChange={(e) => setSuggestionForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full win95-bevel-in p-2 font-win95"
                    placeholder="ej: Super Mario Bros Online"
                    required
                  />
                </div>

                <div className="win95-bevel-out bg-white p-4">
                  <label className="block font-brutalist text-sm mb-2">
                    URL DEL JUEGO *
                  </label>
                  <input
                    type="url"
                    value={suggestionForm.url}
                    onChange={(e) => setSuggestionForm(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full win95-bevel-in p-2 font-win95"
                    placeholder="https://ejemplo.com/juego"
                    required
                  />
                </div>

                <div className="win95-bevel-out bg-white p-4">
                  <label className="block font-brutalist text-sm mb-2">
                    DESCRIPCIÓN
                  </label>
                  <textarea
                    value={suggestionForm.description}
                    onChange={(e) => setSuggestionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full win95-bevel-in p-2 font-win95 h-24 resize-none"
                    placeholder="Describe brevemente el juego..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="win95-bevel-out bg-[var(--color-raza-accent)] text-white px-6 py-3 font-brutalist hover:win95-bevel-in disabled:opacity-50"
                  >
                    {loading ? 'ENVIANDO...' : 'ENVIAR SUGERENCIA'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestionForm({ title: '', url: '', description: '' })}
                    className="win95-bevel-out bg-[var(--color-win95-face)] px-6 py-3 font-brutalist hover:win95-bevel-in"
                  >
                    LIMPIAR
                  </button>
                </div>

                <div className="win95-bevel-in bg-[var(--color-win95-face)] p-4 text-sm">
                  <p className="font-brutalist mb-2">📋 REGLAS PARA SUGERENCIAS:</p>
                  <ul className="text-xs space-y-1 text-[var(--color-raza-gray)]">
                    <li>• El juego debe ser gratuito y accesible desde navegador</li>
                    <li>• No contenido NSFW o violento extremo</li>
                    <li>• Preferiblemente juegos retro o indie</li>
                    <li>• Las sugerencias son revisadas por moderadores</li>
                    <li>• Ganarás +25 puntos si tu sugerencia es aprobada</li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}