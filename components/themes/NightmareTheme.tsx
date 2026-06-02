
import React, { useState, useEffect } from 'react';
import { ContentItem, UserProfile, ThemeType } from '../../types';
import ThemedProfile from '../ThemedProfile';

const NightmareTheme: React.FC<{ data: ContentItem[]; profile: UserProfile; onEditProfile: () => void; }> = ({ data, profile, onEditProfile }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);

    // Periodic random glitches
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-black text-white p-6 md:p-16 relative overflow-hidden font-mono select-none ${glitch ? 'grayscale invert' : ''}`}>

      {/* CCTV Filter Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
      <div className="fixed inset-0 pointer-events-none z-[101] animate-cctv-scanline opacity-[0.05] bg-gradient-to-b from-white to-transparent h-2" />

      {/* Claustrophobic Flashlight */}
      <div
        className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-20">
        <header className="flex flex-col items-center gap-12 border-b border-white/10 pb-10">
          {/* Profile Injection */}
          <div className="relative z-50 hover:brightness-125 transition-all duration-150">
            <ThemedProfile theme={ThemeType.NIGHTMARE} profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="flex justify-between items-end w-full max-w-2xl px-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <h1 className="text-2xl font-black uppercase tracking-[0.5em] animate-pulse">REC: {new Date().toLocaleTimeString()}</h1>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest italic">Signal Strength: Weak (4%)</p>
            </div>
            <div className="text-right font-bold text-[10px] opacity-30">
              CAM_04 // BASEMENT_LEVEL
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          {data.map((item, idx) => (
            <div
              key={item.id}
              className="relative group cursor-none"
              style={{ transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 2}deg)` }}
            >
              {/* Ghostly Figure in Darkness (Outside Flashlight) */}
              <div className="absolute -top-10 -left-10 text-8xl opacity-0 group-hover:opacity-10 transition-opacity duration-[2000ms] pointer-events-none scale-150 rotate-12 blur-md filter grayscale invert">
                👤
              </div>

              <div className="bg-[#050505] border border-white/5 p-8 shadow-2xl relative overflow-hidden transition-all duration-700 group-hover:border-red-900/50 group-hover:bg-[#0a0000]">
                {/* Visual Disturbance */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                  <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] animate-cctv-noise" />
                </div>

                <div className="flex justify-between items-center mb-6 text-[9px] uppercase font-bold text-white/20">
                  <span>File: {item.id}</span>
                  <span className="group-hover:text-red-600 group-hover:animate-pulse">Status: {item.status}</span>
                </div>

                <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter group-hover:animate-glitch-text">
                  {item.title}
                </h3>

                <p className="text-xs leading-relaxed text-white/40 italic mb-8 group-hover:text-white/60 transition-colors">
                  "{item.description}"
                </p>

                <div className="flex flex-col gap-2 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-[8px] font-bold text-white/10 uppercase tracking-[0.2em]">
                    <span>Category: {item.category}</span>
                    <span>Epoch: {item.timestamp.split('T')[0]}</span>
                  </div>
                  <button className="mt-4 py-2 border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-red-950 hover:text-white hover:border-red-600 transition-all">
                    Acknowledge...
                  </button>
                </div>

                {/* Secret Redacted Message */}
                <div className="absolute bottom-1 right-1 text-[7px] text-red-900/0 group-hover:text-red-900/40 transition-all font-sans uppercase">
                  They are watching you
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Randomized Peripheral Jump Scares */}
      <div className="fixed bottom-10 right-10 text-9xl opacity-0 animate-nightmare-flash pointer-events-none select-none filter blur-lg">
        🩸
      </div>
      <div className="fixed top-1/2 left-10 text-9xl opacity-0 animate-nightmare-flash-alt pointer-events-none select-none filter blur-sm grayscale">
        👁️
      </div>

      <style>{`
        @keyframes cctv-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes nightmare-flash {
          0%, 98%, 100% { opacity: 0; }
          99% { opacity: 0.05; transform: scale(1.5) rotate(5deg); }
        }
        @keyframes nightmare-flash-alt {
          0%, 94%, 96%, 100% { opacity: 0; }
          95% { opacity: 0.08; transform: translateX(-20px); }
        }
        @keyframes glitch-text {
          0% { transform: translate(0); text-shadow: 2px 0 red, -2px 0 blue; }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); text-shadow: -2px 0 red, 2px 0 blue; }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-cctv-scanline {
          animation: cctv-scanline 8s linear infinite;
        }
        .animate-nightmare-flash {
          animation: nightmare-flash 15s infinite;
        }
        .animate-nightmare-flash-alt {
          animation: nightmare-flash-alt 23s infinite;
        }
        .animate-glitch-text {
          animation: glitch-text 0.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default NightmareTheme;
