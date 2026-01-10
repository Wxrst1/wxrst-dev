
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentItem, UserProfile, ThemeType } from '../../types';
import ThemedProfile from '../ThemedProfile';

interface Decal {
  id: number;
  x: number;
  y: number;
}

const ShootingTheme: React.FC<{ data: ContentItem[]; profile: UserProfile; onEditProfile: () => void; }> = ({ data, profile, onEditProfile }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFiring, setIsFiring] = useState(false);
  const [ammo, setAmmo] = useState(30);
  const [decals, setDecals] = useState<Decal[]>([]);
  const [neutralized, setNeutralized] = useState<string[]>([]);
  const [killfeed, setKillfeed] = useState<string[]>([]);
  const nextId = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const shoot = useCallback((e: React.MouseEvent) => {
    if (ammo <= 0) return;

    setIsFiring(true);
    setAmmo(prev => prev - 1);

    // Add bullet hole decal
    const newDecal = { id: nextId.current++, x: e.clientX, y: e.clientY };
    setDecals(prev => [...prev, newDecal].slice(-20)); // Keep last 20

    // Muzzle flash duration
    setTimeout(() => setIsFiring(false), 50);
  }, [ammo]);

  const handleNeutralize = (id: string, title: string) => {
    if (!neutralized.includes(id)) {
      setNeutralized(prev => [...prev, id]);
      setKillfeed(prev => [`CONFIRMED: ${title}`, ...prev].slice(0, 5));
    }
  };

  const reload = () => {
    setAmmo(30);
  };

  return (
    <div
      className={`min-h-screen bg-[#050505] text-[#f97316] font-mono p-8 md:p-16 relative overflow-hidden cursor-none select-none ${isFiring ? 'animate-screen-shake' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseDown={shoot}
    >
      {/* Gritty Tactical Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent" />
      </div>

      {/* Bullet Hole Decals */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {decals.map(d => (
          <div
            key={d.id}
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
            style={{ left: d.x, top: d.y }}
          >
            <div className="w-full h-full bg-slate-800 rounded-full border border-black shadow-[inset_0_0_5px_black]" />
            <div className="absolute inset-[-10px] border border-orange-500/20 rounded-full animate-ping" />
          </div>
        ))}
      </div>

      {/* Muzzle Flash Overlay */}
      {isFiring && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-white/10 mix-blend-overlay animate-muzzle-flash" />
      )}

      {/* Tactical HUD Layers */}
      <div className="fixed inset-0 pointer-events-none z-40 p-8 border-[2px] border-orange-500/10 rounded-[40px] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
        {/* Top Left: Scan Intel */}
        <div className="absolute top-12 left-12 flex flex-col gap-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500/50">Tactical_OS v7.2</div>
          <div className="text-xl font-['Black_Ops_One'] tracking-widest">SECTOR_O7</div>
          <div className="flex gap-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-1 h-4 ${i < 3 ? 'bg-orange-500' : 'bg-orange-900 animate-pulse'}`} />
            ))}
          </div>
        </div>

        {/* Top Right: Compass/Coordinates */}
        <div className="absolute top-12 right-12 text-right flex flex-col gap-1">
          <div className="text-[10px] font-black opacity-40">GRID: 34.22 // -118.44</div>
          <div className="text-sm font-bold tracking-widest">N 35° 42' 1.2"</div>
          <div className="w-32 h-1 bg-orange-900 mt-1 relative overflow-hidden">
            <div className="absolute h-full bg-orange-500 animate-[hud-scroll_4s_linear_infinite]" style={{ width: '40px' }} />
          </div>
        </div>

        {/* Bottom Left: Killfeed */}
        <div className="absolute bottom-32 left-12 flex flex-col gap-2 max-w-xs">
          {killfeed.map((msg, i) => (
            <div key={i} className="text-[10px] font-black bg-orange-500/10 border-l-2 border-orange-500 px-2 py-1 animate-in slide-in-from-left-4 fade-in">
              {msg}
            </div>
          ))}
        </div>

        {/* Bottom Right: Ammo/Weapon Status */}
        <div className="absolute bottom-12 right-12 flex items-end gap-6 bg-black/40 p-6 border-r-4 border-orange-500">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black opacity-40">ENERGY_CELLS</span>
            <span className={`text-5xl font-['Black_Ops_One'] ${ammo < 5 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
              {ammo.toString().padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); reload(); }}
            className="pointer-events-auto h-12 px-4 bg-orange-500 text-black font-black uppercase tracking-tighter hover:bg-white transition-colors"
          >
            Reload
          </button>
        </div>
      </div>

      <main className="relative z-30 max-w-7xl mx-auto flex flex-col gap-12 pt-20">
        <header className="flex flex-col items-center gap-10 text-center mb-16">
          <div className="shrink-0 scale-95 md:scale-100 hover:brightness-125 transition-all duration-300">
            <ThemedProfile theme={ThemeType.SHOOTING} profile={profile} onEdit={onEditProfile} />
          </div>
          <div>
            <h1 className="text-7xl md:text-9xl font-['Black_Ops_One'] uppercase tracking-tighter italic text-orange-500 drop-shadow-[0_10px_20px_rgba(249,115,22,0.3)]">
              STRIKE_DATA
            </h1>
            <p className="mt-4 text-[11px] font-black tracking-[1em] text-white opacity-40 uppercase">Identify and Neutralize HVTs</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => {
            const isNeutralized = neutralized.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNeutralize(item.id, item.title);
                }}
                className={`
                  group relative h-full flex flex-col bg-orange-500/5 border border-orange-500/20 p-8 
                  transition-all duration-500 overflow-hidden perspective-1000
                  ${isNeutralized ? 'grayscale opacity-30 brightness-50' : 'hover:border-orange-500/50 hover:bg-orange-500/10'}
                `}
              >
                {/* Target Brackets (Hover) */}
                {!isNeutralized && (
                  <>
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}

                {isNeutralized && (
                  <div className="absolute inset-0 flex items-center justify-center z-50">
                    <span className="text-4xl font-['Black_Ops_One'] border-4 border-red-600 px-4 py-2 rotate-12 text-red-600 opacity-80">NEUTRALIZED</span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-orange-400">HVT_SPEC_{item.id}</span>
                    <span className="text-[8px] opacity-40">{item.category}</span>
                  </div>
                  <div className="w-3 h-3 border border-orange-500 group-hover:animate-spin" />
                </div>

                <h3 className="text-2xl font-['Black_Ops_One'] uppercase mb-4 leading-none text-white group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400 font-mono italic">
                  "{item.description}"
                </p>

                <div className="mt-auto pt-8 flex items-center justify-between border-t border-orange-500/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black opacity-40 uppercase">Signal Stability</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-1 ${i < 3 ? 'bg-orange-500' : 'bg-orange-950'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase text-orange-500">
                    {isNeutralized ? 'SECURED' : 'TARGET_LOCKED'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* The Tactical Reticle */}
      <div
        className="fixed pointer-events-none z-[100] transition-transform duration-75"
        style={{ left: mousePos.x, top: mousePos.y }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className={`${isFiring ? 'scale-150 text-white' : 'scale-100 text-orange-500'}`}>
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          <path d="M30 0 L 30 10 M 30 50 L 30 60 M 0 30 L 10 30 M 50 30 L 60 30" stroke="currentColor" strokeWidth="2" />
          <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="animate-spin-slow" />
          <path d="M20 30 L 25 30 M 35 30 L 40 30 M 30 20 L 30 25 M 30 35 L 30 40" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <style>{`
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0) rotate(0); }
          25% { transform: translate(-4px, 4px) rotate(-1deg); }
          50% { transform: translate(4px, -4px) rotate(1deg); }
          75% { transform: translate(-4px, -4px) rotate(-1deg); }
        }
        @keyframes muzzle-flash {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes hud-scroll {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-screen-shake {
          animation: screen-shake 0.1s ease-in-out;
        }
        .animate-muzzle-flash {
          animation: muzzle-flash 0.05s ease-out;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ShootingTheme;
