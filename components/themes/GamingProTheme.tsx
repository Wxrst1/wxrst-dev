
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const rarities = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
const rarityColors: Record<string, string> = {
  COMMON: 'text-slate-400 border-slate-700 bg-slate-900/40 shadow-slate-500/10',
  RARE: 'text-blue-400 border-blue-700 bg-blue-900/40 shadow-blue-500/20',
  EPIC: 'text-purple-400 border-purple-700 bg-purple-900/40 shadow-purple-500/30',
  LEGENDARY: 'text-yellow-400 border-yellow-700 bg-yellow-900/40 shadow-yellow-500/40'
};

const GamingProTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [streak, setStreak] = useState(0);
  const [hp, setHp] = useState(100);
  const [showVictory, setShowVictory] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFiring, setIsFiring] = useState(false);
  const [killFeed, setKillFeed] = useState<string[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleAction = (title: string, id: string) => {
    onLinkClick(id);
    setIsFiring(true);
    setStreak(prev => prev + 1);
    setKillFeed(prev => [`NEUTRALIZED: ${title}`, ...prev].slice(0, 4));

    if (streak + 1 >= data.length) {
      setShowVictory(true);
    }

    setTimeout(() => setIsFiring(false), 100);
  };

  useEffect(() => {
    if (showVictory) {
      const timer = setTimeout(() => setShowVictory(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showVictory]);

  return (
    <div
      className={`min-h-screen bg-[#020202] text-white font-['Orbitron'] p-8 md:p-16 relative overflow-hidden cursor-none select-none ${isFiring ? 'animate-screen-shake' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_70%)] opacity-50" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

        <div
          className="absolute bottom-0 left-0 w-full h-[50vh] bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"
          style={{ transform: 'perspective(500px) rotateX(60deg) translateY(50%)' }}
        />
      </div>

      {/* Victory Banner */}
      {showVictory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative text-center animate-bounce">
            <div className="absolute inset-[-100px] bg-yellow-400 blur-[150px] opacity-20" />
            <h2 className="text-8xl md:text-9xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-white to-yellow-600 drop-shadow-[0_10px_30px_rgba(234,179,8,0.5)]">
              Victory_Royale
            </h2>
            <p className="mt-4 text-xl font-bold tracking-[0.8em] text-white">CHAMPION STATUS ATTAINED</p>
          </div>
        </div>
      )}

      {/* HUD Content */}
      <div className="fixed inset-0 pointer-events-none z-50 p-6 md:p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 p-2 text-orange-400 text-[10px] font-black uppercase animate-pulse w-fit pointer-events-auto">
            <span className="text-base">🔥</span> STREAK: {streak}
          </div>

          <div className="w-32 h-32 md:w-48 md:h-48 bg-black/60 border-2 border-slate-700 rounded-full relative overflow-hidden backdrop-blur-md flex items-center justify-center">
            <div className="absolute inset-4 border border-cyan-500/10 rounded-full" />
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]" />
            <span className="text-[8px] font-bold text-slate-500 absolute bottom-2">SECTOR_D7</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1 max-w-xs">
            {killFeed.map((msg, i) => (
              <div key={i} className="bg-black/40 border-l-2 border-cyan-500 px-3 py-1 text-[9px] font-black text-white italic uppercase animate-in slide-in-from-left fade-in">
                {msg}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-cyan-400 uppercase">Shield</span>
              <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 animate-pulse" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-white uppercase italic">Health</span>
              <div className="w-64 h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500" style={{ width: `${hp}%` }} />
              </div>
              <span className="text-2xl font-black italic">{hp}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-30 max-w-7xl mx-auto pt-24 pb-40">
        <header className="flex flex-col items-center gap-12 text-center mb-20 pt-10">
          <div className="shrink-0 scale-100 md:scale-110 hover:brightness-125 transition-all pointer-events-auto">
            <ThemedProfile theme="GAMING_PRO" profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="inline-block relative">
            <div className="absolute -inset-10 bg-cyan-500 blur-[80px] opacity-10 animate-pulse" />
            <h1 className="text-7xl md:text-9xl font-['Black_Ops_One'] uppercase italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Data_Ops
            </h1>
            <p className="mt-4 text-[11px] font-black tracking-[1em] text-cyan-400 opacity-40 uppercase">Operation: Silent_Void</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, idx) => {
            const rarity = rarities[idx % rarities.length];
            const colorClass = rarityColors[rarity];

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAction(item.title, item.id)}
                className={`
                  group relative flex flex-col p-8 border-t-4 shadow-2xl transition-all duration-500 perspective-1000 block
                  hover:-translate-y-2 hover:rotate-1 active:scale-95
                  ${colorClass}
                `}
              >
                <div className="absolute top-2 right-2 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-white/20 group-hover:bg-cyan-500 transition-colors" />
                  ))}
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">ID_{item.id}</span>
                    <span className="text-[8px] font-bold text-white/40">{item.category}</span>
                  </div>
                  <div className="text-[10px] font-black italic px-2 py-0.5 bg-white/5 border border-white/10">
                    {rarity}
                  </div>
                </div>

                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-[11px] leading-relaxed text-slate-400 font-sans font-medium mb-8">
                  "{item.description}"
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <div className="flex flex-col gap-1">
                    <span className="opacity-20">Link_Status</span>
                    <span className={item.status === 'CRITICAL' ? 'text-red-500' : 'text-cyan-400'}>
                      {item.status}
                    </span>
                  </div>
                  <div className="px-6 py-2 bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all font-black uppercase tracking-tighter italic">
                    COLLECT
                  </div>
                </div>

                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-skin-inspect" />
              </a>
            );
          })}
        </div>

        <div className="mt-32 border-t border-white/5 pt-20">
          <h2 className="text-4xl font-['Black_Ops_One'] text-white mb-12 flex items-center gap-6 italic tracking-tighter uppercase">
            Comms History // Channel.01
          </h2>
          <div className="bg-zinc-950/80 border border-cyan-500/10 p-10 backdrop-blur-3xl shadow-[0_0_100px_rgba(6,182,212,0.05)]">
            <Guestbook isInline />
          </div>
        </div>
      </main>

      <div
        className="fixed pointer-events-none z-[100] transition-transform duration-75"
        style={{ left: mousePos.x, top: mousePos.y }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <svg width="40" height="40" viewBox="0 0 40 40" className={`${isFiring ? 'scale-150 text-red-500' : 'scale-100 text-cyan-400'}`}>
            <path d="M20 0 L20 10 M20 30 L20 40 M0 20 L10 20 M30 20 L40 20" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="20" r="1.5" fill="currentColor" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="animate-spin-slow" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes skin-inspect {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-skin-inspect { animation: skin-inspect 0.8s ease-in-out infinite; }
        .animate-screen-shake { animation: screen-shake 0.1s linear infinite; }
        .animate-spin-slow { animation: spin-slow 5s linear infinite; }
      `}</style>
    </div>
  );
};

export default GamingProTheme;
