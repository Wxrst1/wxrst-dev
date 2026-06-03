
import React, { useRef, useEffect } from 'react';
import { ThemeType } from '../types';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      name: 'Featured',
      themes: [
        { type: ThemeType.YIN_YANG, label: 'The Balance', icon: '☯' },
        { type: ThemeType.AKATSUKI, label: 'The Dawn', icon: '☁️' },
        { type: ThemeType.CELESTIAL_EMPIRE, label: 'Imperial', icon: '🐉' },
        { type: ThemeType.JUJUTSU, label: 'Jujutsu', icon: '🤞' },
      ]
    },
    {
      name: 'Gameplay',
      themes: [
        { type: ThemeType.THE_MUSEUM, label: 'Museum', icon: '🖼️' },
        { type: ThemeType.THE_HEIST, label: 'Heist', icon: '🕵️' },
        { type: ThemeType.LABYRINTH, label: 'Maze', icon: '🏛️' },
        { type: ThemeType.GAMING_PRO, label: 'eSports', icon: '🎮' },
        { type: ThemeType.SHOOTING, label: 'Tactical', icon: '🔫' },
      ]
    },
    {
      name: 'Sci-Fi',
      themes: [
        { type: ThemeType.NEURAL_CANVAS, label: 'Neural', icon: '🎨' },
        { type: ThemeType.QUANTUM_NEXUS, label: 'Nexus', icon: '🌌' },
        { type: ThemeType.AETHER_QUANTUM, label: 'Aether', icon: '✨' },
        { type: ThemeType.SINGULARITY, label: 'Singularity', icon: '🕳️' },
        { type: ThemeType.SOLAR_SYSTEM, label: 'Solar', icon: '☀️' },
        { type: ThemeType.MATRIX, label: 'Matrix', icon: '⌨️' },
        { type: ThemeType.CYBERPUNK, label: 'Cyber', icon: '🌃' },
      ]
    },
    {
      name: 'Cinematic',
      themes: [
        { type: ThemeType.INTERROGATION_ROOM, label: 'The Room', icon: '🔦' },
        { type: ThemeType.BANK, label: 'Vault', icon: '🏦' },
        { type: ThemeType.MEDICAL, label: 'Surgery', icon: '❤️' },
        { type: ThemeType.PIRATE, label: 'Pirate', icon: '🏴‍☠️' },
        { type: ThemeType.STEAMPUNK, label: 'Steam', icon: '⚙️' },
        { type: ThemeType.FBI_INVESTIGATION, label: 'Bureau', icon: '👮' },
        { type: ThemeType.DRUG_DEALER, label: 'Connect', icon: '💊' },
      ]
    },
    {
      name: 'Atmospheric',
      themes: [
        { type: ThemeType.THE_CORRUPTION, label: 'Entropy', icon: '☣️' },
        { type: ThemeType.VOID_COMMERCE, label: 'The Void', icon: '🕳️' },
        { type: ThemeType.INVESTIGATIVE_HORROR, label: 'REC', icon: '📹' },
        { type: ThemeType.ALCHEMIST, label: 'Magus', icon: '🔮' },
        { type: ThemeType.RUSTIC_HARVEST, label: 'Harvest', icon: '🚜' },
        { type: ThemeType.BLOOD_STAIN, label: 'Visceral', icon: '🩸' },
        { type: ThemeType.HORROR, label: 'Horror', icon: '👻' },
        { type: ThemeType.THE_EXORCISM, label: 'Exorcism', icon: '†' },
        { type: ThemeType.NIGHTMARE, label: 'Night', icon: '🔪' },
        { type: ThemeType.SERIAL_KILLER, label: 'Case', icon: '🕵️' },
        { type: ThemeType.WAR, label: 'War', icon: '🪖' },
      ]
    },
    {
      name: 'Seasonal',
      themes: [
        { type: ThemeType.CHRISTMAS, label: 'Xmas', icon: '🎄' },
        { type: ThemeType.NEW_YEAR, label: 'NYE', icon: '🎆' },
        { type: ThemeType.HALLOWEEN, label: 'Spooky', icon: '🎃' },
        { type: ThemeType.VALENTINE, label: 'Love', icon: '💝' },
        { type: ThemeType.EASTER, label: 'Bunny', icon: '🐰' },
        { type: ThemeType.SAO_JOAO, label: 'Festa', icon: '🔥' },
        { type: ThemeType.AUTUMN, label: 'Fall', icon: '🍂' },
        { type: ThemeType.CARNIVAL, label: 'Mask', icon: '🎭' },
      ]
    }
  ];

  const allThemes = categories.flatMap(c => c.themes);

  const handleRandom = () => {
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    onThemeChange(randomTheme.type);
  };

  // Scroll to active theme on change
  useEffect(() => {
    if (isOpen) {
      const activeBtn = scrollRef.current?.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentTheme, isOpen]);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[9999] px-4 pointer-events-none flex justify-center">
      <div
        className={`bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl pointer-events-auto transition-all duration-300 ease-bun overflow-hidden ${isOpen ? 'rounded-2xl max-w-[95vw] md:max-w-5xl w-full' : 'rounded-full w-auto'
          }`}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">🎨</span>
            <span className="text-xs font-bold uppercase tracking-widest">Change Theme</span>
          </button>
        ) : (
          <div className="flex flex-col">
            {/* Header / Controls */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-white/50 pl-2">Theme Control</span>
                <button
                  onClick={handleRandom}
                  className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all text-[10px] text-white/70 hover:text-white uppercase font-bold tracking-wider"
                >
                  <span>🎲</span> Randomize
                </button>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable List */}
            <div
              ref={scrollRef}
              className="flex items-start gap-8 overflow-x-auto p-6 no-scrollbar"
            >
              {categories.map((cat) => (
                <div key={cat.name} className="shrink-0 flex flex-col gap-3 min-w-[120px]">
                  <span className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] border-b border-white/5 pb-2 block">
                    {cat.name}
                  </span>
                  <div className="flex flex-col gap-1">
                    {cat.themes.map((t) => (
                      <button
                        key={t.type}
                        data-active={currentTheme === t.type}
                        onClick={() => {
                          onThemeChange(t.type);
                        }}
                        className={`
                          group relative px-3 py-2 rounded-lg transition-all flex items-center gap-3 text-left w-full
                          ${currentTheme === t.type
                            ? 'bg-white text-black shadow-lg translate-x-1'
                            : 'text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1'
                          }
                        `}
                      >
                        <span className="text-sm shrink-0 w-5 text-center">{t.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .ease-bun { transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default ThemeSwitcher;
