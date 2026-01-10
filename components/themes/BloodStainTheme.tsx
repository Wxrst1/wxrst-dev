
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

interface Splatter {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

const BloodStainTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
  isAdmin?: boolean;
}> = ({ data, profile, onEditProfile, onLinkClick, isAdmin }) => {
  const [splatters, setSplatters] = useState<Splatter[]>([]);
  const [pulse, setPulse] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const nextId = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  // Ambient Audio Logic
  useEffect(() => {
    if (audioEnabled) {
      // "Creepy Girl Singing" loop (Local File)
      const audio = new Audio('/creepy-girl.mp3');
      audio.loop = true;
      audio.volume = 0.6;
      audio.play().then(() => {
        audioRef.current = audio;
      }).catch(e => console.error("Audio playback error", e));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [audioEnabled]);

  const handleClick = (e: React.MouseEvent) => {
    const newSplatter: Splatter = {
      id: nextId.current++,
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 150 + 80,
      rotation: Math.random() * 360,
      opacity: 0.9,
    };
    setSplatters(prev => [...prev.slice(-25), newSplatter]);
  };

  return (
    <div
      className={`min-h-screen bg-[#050000] text-[#880808] font-['Special_Elite'] p-8 md:p-16 relative overflow-x-hidden cursor-crosshair select-none transition-colors duration-1000 ${pulse ? 'bg-[#0a0000]' : 'bg-[#050000]'}`}
      onClick={handleClick}
    >
      {/* Audio Toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); setAudioEnabled(!audioEnabled); }}
        className="fixed top-4 right-4 z-[60] bg-black/50 border border-red-900/40 px-3 py-1 text-[10px] uppercase tracking-widest text-[#880808] hover:bg-red-900/20 transition-colors"
      >
        [ AUDIO_{audioEnabled ? 'ON' : 'OFF'} ]
      </button>

      {/* Dramatic Silhouette Background */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img
          src="/silhouette-scary-zombie-with-dramatic-background.jpg"
          className="absolute w-full h-full object-cover opacity-60 mix-blend-hard-light animate-[pulse_10s_ease-in-out_infinite]"
          alt="Horror Silhouette"
        />
        {/* Dark Red Overlay to tint the image */}
        <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply" />
      </div>
      EMPTY

      {/* Vein Network Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M-100 200 C 200 100, 400 300, 600 100 S 1200 200, 1400 0" fill="none" stroke="#880808" strokeWidth="2" filter="url(#glow)" className="animate-[pulse_4s_infinite]" />
          <path d="M0 800 C 300 700, 600 900, 900 700 S 1500 800, 1800 600" fill="none" stroke="#4a0404" strokeWidth="3" filter="url(#glow)" className="animate-[pulse_6s_infinite]" />
          <path d="M400 -100 C 400 300, 500 500, 400 800 S 500 1200, 400 1500" fill="none" stroke="#660000" strokeWidth="2" filter="url(#glow)" className="animate-[pulse_5s_infinite]" />
          <path d="M1200 -100 C 1200 300, 1100 600, 1200 900 S 1100 1400, 1200 1600" fill="none" stroke="#550000" strokeWidth="2" filter="url(#glow)" className="animate-[pulse_7s_infinite]" />
          <path d="M100 0 Q 300 400 600 200 T 900 800" fill="none" stroke="#4a0404" strokeWidth="2" opacity="0.5" />
          {/* Occult symbols in background */}
          <text x="10%" y="20%" fontSize="100" fill="#200" opacity="0.3" className="font-serif rotate-180">†</text>
          <text x="80%" y="70%" fontSize="150" fill="#200" opacity="0.2" className="font-serif">⛧</text>
          <text x="50%" y="50%" fontSize="300" fill="#300" opacity="0.1" className="font-serif">🜏</text>
        </svg>
      </div>

      {/* Persistent Splatters */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {splatters.map(s => (
          <div
            key={s.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-blood-fade"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#4a0404] opacity-90 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
              <path d="M50 10 C 60 10 70 30 70 50 C 70 70 50 90 30 70 C 10 50 20 10 50 10 Z" />
              <circle cx="20" cy="30" r="5" />
              <circle cx="80" cy="60" r="8" />
              <circle cx="40" cy="85" r="4" />
              <path d="M50 50 L 50 120" stroke="#4a0404" strokeWidth="6" strokeLinecap="round" className="animate-drip" />
            </svg>
          </div>
        ))}
      </div>

      {/* Flickering Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-black animate-horror-flicker mix-blend-multiply opacity-30" />

      <div className="relative z-30 max-w-7xl mx-auto flex flex-col gap-24">
        <header className="flex flex-col items-center gap-20 pt-10 text-center">
          <div className="shrink-0 scale-95 md:scale-110 hover:brightness-150 transition-all duration-700">
            <ThemedProfile theme="BLOOD_STAIN" profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-['UnifrakturMaguntia'] text-[#880808] drop-shadow-[0_0_50px_rgba(0,0,0,1)] uppercase tracking-tighter italic leading-none">
              Sacrificial_Logs
            </h1>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 whitespace-nowrap">
              <span className="h-px w-24 bg-gradient-to-r from-transparent to-[#880808]" />
              <span className="text-[11px] font-black uppercase tracking-[0.8em] text-[#4a0404] animate-pulse">Ritual Protocol Active</span>
              <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#880808]" />
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {data.map((item, idx) => (
            <div
              key={item.id}
              className="group relative block perspective-1000"
            >
              {/* Flesh/Parchment Card */}
              <div className="relative h-full min-h-[450px] bg-black/80 text-[#880808] p-10 flex flex-col border-2 border-[#4a0404] overflow-hidden transition-all duration-700 group-hover:border-red-600 group-hover:-translate-y-4 hover:bg-black/90 backdrop-blur-sm">

                {/* Occult Seal Reveal */}
                <div className="absolute inset-0 bg-[#880808]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-center justify-center">
                  <div className="text-[200px] opacity-20 rotate-45 select-none">🜏</div>
                </div>

                {/* Bleeding Animation on edge */}
                <div className="absolute top-0 left-0 w-1 h-full bg-red-900/40 group-hover:h-full transition-all duration-1000" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-900">Mark_{item.id}</span>
                    <span className="text-[8px] opacity-30 italic font-mono uppercase">{item.timestamp.split('T')[0]}</span>
                  </div>
                  <div className="text-3xl opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all animate-pulse">🩸</div>
                </div>

                <h3 className="text-4xl font-['Playfair_Display'] font-black mb-6 leading-tight text-red-900 group-hover:text-red-600 transition-colors drop-shadow-lg">
                  {item.title}
                </h3>

                <p className="text-sm italic leading-relaxed text-red-950/80 mb-10 border-l-2 border-red-950/20 pl-6 group-hover:text-red-700 transition-colors font-serif">
                  "{item.description}"
                </p>

                {item.codeSnippet && (
                  <div className="mt-auto bg-black/60 p-5 border border-red-950/30 font-mono text-[9px] mb-8 relative group-hover:bg-red-950/20 transition-colors">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 animate-ping" />
                    <span className="text-red-900/40 block mb-2 font-black">ENCRYPTED_RITUAL:</span>
                    {item.codeSnippet}
                  </div>
                )}

                <div className="pt-6 border-t border-red-950/20 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="opacity-30">Corruption</span>
                    <span className={item.status === 'CRITICAL' ? 'text-red-600 animate-pulse' : 'text-orange-900'}>
                      {item.status}
                    </span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isAdmin) e.preventDefault();
                      onLinkClick(item.id);
                    }}
                    className={`px-6 py-2 bg-[#4a0404] text-white hover:bg-red-600 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-95 group-hover:shadow-[0_0_20px_rgba(136,8,8,0.4)] ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    CLAIM SOUL
                  </a>
                </div>

                {/* Handprint decoration (revealed on hover) */}
                <div className="absolute bottom-[-20%] right-[-10%] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 rotate-[-15deg]">
                  <svg width="200" height="200" viewBox="0 0 100 100" fill="#880808">
                    <path d="M50 80 C 30 80 20 60 20 40 C 20 20 30 10 50 10 C 70 10 80 20 80 40 C 80 60 70 80 50 80 Z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* Integrated Guestbook Section - "The Altar of Whispers" */}
        <div className="mt-40 border-t-2 border-[#4a0404]/30 pt-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12 bg-transparent text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            <h2 className="text-5xl font-['UnifrakturMaguntia'] text-[#880808] italic tracking-widest uppercase">
              The Altar of Whispers
            </h2>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-red-900/10 blur-xl rounded-full" />
            <div className="bg-zinc-950 border border-red-900/20 p-12 backdrop-blur-3xl shadow-[0_0_100px_rgba(74,4,4,0.2)]">
              <div className="flex justify-center mb-10 gap-8">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#4a0404] text-4xl animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}>†</span>
                ))}
              </div>
              <Guestbook isInline theme="BLOOD_STAIN" />
            </div>
          </div>
        </div>

        <footer className="mt-40 text-center pb-40 relative z-20">
          <div className="inline-block px-12 py-4 border-t-2 border-b-2 border-[#4a0404]/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-950/10 -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]" />
            <p className="text-[10px] font-black uppercase tracking-[1.5em] text-[#880808] animate-pulse">
              OMNIA EX EXITIO
            </p>
          </div>
          <div className="mt-10 flex justify-center gap-6 text-red-950/20 text-3xl">
            <span>☾</span> <span>⛧</span> <span>☽</span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes drip {
          0% { transform: translateY(-20px) scaleY(1); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; transform: translateY(100px) scaleY(1.5); }
          100% { transform: translateY(200px) scaleY(2); opacity: 0; }
        }
        @keyframes blood-fade {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          to { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes horror-flicker {
          0%, 100% { opacity: 0.2; }
          5%, 15%, 25% { opacity: 0.4; }
          10%, 20% { opacity: 0.1; }
          50% { opacity: 0.3; }
          95% { opacity: 0.5; }
        }
        .animate-drip { animation: drip 4s linear infinite; }
        .animate-blood-fade { animation: blood-fade 0.3s cubic-bezier(0.12, 0, 0.39, 0) forwards; }
        .animate-horror-flicker { animation: horror-flicker 10s step-end infinite; }
      `}</style>
    </div >
  );
};

export default BloodStainTheme;
