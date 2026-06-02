
import React, { useState, useEffect } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const SeaWaves: React.FC = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute bottom-0 left-0 w-[200%] h-64 bg-[#004d4d] opacity-40 animate-wave-slow blur-xl" style={{ borderRadius: '43%' }} />
    <div className="absolute bottom-[-50px] left-[-25%] w-[150%] h-80 bg-[#002b2b] opacity-60 animate-wave-fast blur-lg" style={{ borderRadius: '38%' }} />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#006666_0%,_transparent_70%)] opacity-30" />
  </div>
);

const PirateTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [activeCompass, setActiveCompass] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCompass(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#001a1a] text-[#e8d5b5] font-['Special_Elite'] p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
      <SeaWaves />

      {/* Parallax Floating Gold Particles */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-yellow-500 rounded-full blur-[1px] animate-float-slow"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's'
            }}
          />
        ))}
      </div>

      <header className="relative z-20 w-full max-w-7xl flex flex-col items-center mb-16 gap-12 text-center animate-sway">
        <div className="shrink-0 scale-95 md:scale-110 hover:scale-105 transition-transform">
          <ThemedProfile theme="PIRATE" profile={profile} onEdit={onEditProfile} />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 border-8 border-[#3e1e1e] rounded-full flex items-center justify-center bg-[#5d2e0a] shadow-2xl relative overflow-hidden shrink-0">
            <div className="absolute inset-0 border-[4px] border-double border-[#d4af37]/30 rounded-full" />
            <span className="text-4xl animate-[spin_10s_linear_infinite]">☸️</span>
          </div>
          <div>
            <h1 className="text-6xl md:text-7xl font-['Pirata_One'] text-[#d4af37] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] uppercase tracking-widest leading-none">
              The Captain's Ledger
            </h1>
            <p className="mt-2 text-xs italic tracking-[0.3em] opacity-60">LOGGING THE TREASURES OF THE DATA SEAS</p>
          </div>
        </div>
      </header>

      <main className="relative z-20 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-sway-delayed">
        {data.map((item, idx) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick(item.id)}
            className="group perspective-1000 block"
          >
            {/* Weathered Parchment Card */}
            <div className="relative h-full bg-[#e8d5b5] text-[#2c1b0e] p-8 min-h-[400px] shadow-[10px_10px_40px_rgba(0,0,0,0.5)] border-2 border-[#c2a679] transition-all duration-500 group-hover:rotate-1 group-hover:scale-105 overflow-hidden flex flex-col">

              {/* Burnt Edges Effect */}
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-black/20 to-transparent" />
              <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-black/20 to-transparent" />

              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Entry No. {item.id}</span>
                  <span className="text-[9px] font-bold text-[#8b4513]">{item.timestamp.split('T')[0]}</span>
                </div>
                <div className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">⚓</div>
              </div>

              <h3 className="text-3xl font-['Pirata_One'] mb-4 leading-none border-b-2 border-[#2c1b0e]/10 pb-2">
                {item.title}
              </h3>

              <div className="relative">
                <p className="text-sm italic leading-relaxed mb-8 opacity-80 font-serif">
                  "{item.description}"
                </p>

                {/* Secret Invisible Ink Overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-yellow-400/5 transition-colors pointer-events-none" />
              </div>

              {item.codeSnippet && (
                <div className="bg-[#d4c3a3] p-4 border border-[#8b4513]/20 rounded-sm font-mono text-[10px] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.codeSnippet}
                </div>
              )}

              <div className="mt-auto pt-4 flex justify-between items-center border-t border-[#2c1b0e]/20">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black tracking-widest text-[#8b4513]">Notoriety Status</span>
                  <span className={`text-[10px] font-black ${item.status === 'CRITICAL' ? 'text-red-800 animate-pulse' : 'text-green-800'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="px-4 py-2 bg-[#3e1e1e] text-[#d4af37] text-[10px] font-black uppercase tracking-widest hover:bg-[#5d2e0a] hover:scale-110 transition-all shadow-lg active:scale-95">
                  Claim Bounty
                </div>
              </div>

              {/* Wax Seal Decor */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-red-900 rounded-full flex items-center justify-center shadow-lg border-2 border-red-950 opacity-40 rotate-12 group-hover:opacity-100 transition-opacity">
                <span className="text-white/40 text-xs font-black">X</span>
              </div>
            </div>
          </a>
        ))}
      </main>

      {/* Integrated Guestbook Section */}
      <div className="mt-32 w-full max-w-4xl relative z-20">
        <h2 className="text-4xl font-['Pirata_One'] text-[#d4af37] mb-8 text-center uppercase tracking-widest">
          🏴‍☠️ Ship's Log & Messages
        </h2>
        <div className="bg-[#e8d5b5] p-1 border-4 border-[#3e1e1e] shadow-2xl">
          <div className="bg-[#1a0f00]/5 p-8 border-2 border-dashed border-[#8b4513]/20">
            <Guestbook isInline />
          </div>
        </div>
      </div>

      <footer className="mt-20 relative z-20 flex flex-col items-center gap-4 pb-32 opacity-40 hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 border-4 border-[#d4af37] rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
          <div className="w-1 h-full bg-[#d4af37]" />
          <div className="w-full h-1 bg-[#d4af37] absolute" />
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.5em]">Charted by the Aether Pirate Guild</p>
      </footer>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(-10%) rotate(0deg); }
          50% { transform: translateX(10%) rotate(2deg); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-0.5deg) translateY(0); }
          50% { transform: rotate(0.5deg) translateY(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-wave-slow { animation: wave 15s ease-in-out infinite; }
        .animate-wave-fast { animation: wave 10s ease-in-out infinite reverse; }
        .animate-sway { animation: sway 8s ease-in-out infinite; }
        .animate-sway-delayed { animation: sway 8s ease-in-out infinite -4s; }
        .animate-float-slow { animation: float 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PirateTheme;