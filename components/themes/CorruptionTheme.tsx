
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

enum DecayStage {
  PRISTINE = 0,    // Pure minimalism
  FLICKER = 1,     // Subtle glitches
  UNSTABLE = 2,    // Inversions & Drifting
  FAILURE = 3,     // Physics collapse & Zalgo
  SHATTERED = 4,   // Fragmented puzzle
  RECONSTRUCT = 5, // Rebuilding...
  SCARRED = 6      // Final form
}

const ZALGO_CHARS = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u033c', '\u0345', '\u0347'];

const CorruptionTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [stage, setStage] = useState<DecayStage>(DecayStage.PRISTINE);
  const [decayProgress, setDecayProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Progressive Decay Timer
  useEffect(() => {
    if (stage >= DecayStage.SHATTERED) return;

    const interval = setInterval(() => {
      setDecayProgress(p => {
        const next = p + 0.5;
        if (next >= 100) setStage(DecayStage.SHATTERED);
        else if (next > 75) setStage(DecayStage.FAILURE);
        else if (next > 50) setStage(DecayStage.UNSTABLE);
        else if (next > 25) setStage(DecayStage.FLICKER);
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [stage]);

  const corruptText = useCallback((text: string) => {
    if (!text) return '';
    if (stage < DecayStage.UNSTABLE) return text;
    if (stage >= DecayStage.SCARRED) return text;
    return text.split('').map(char => {
      if (Math.random() > (1.1 - decayProgress / 100)) {
        return char + ZALGO_CHARS[Math.floor(Math.random() * ZALGO_CHARS.length)];
      }
      return char;
    }).join('');
  }, [stage, decayProgress]);

  const handleRebuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === 'Y') {
      setStage(DecayStage.RECONSTRUCT);
      setTimeout(() => setStage(DecayStage.SCARRED), 3000);
    }
  };

  const getCardStyle = (idx: number) => {
    if (stage === DecayStage.FAILURE) {
      return {
        transform: `translateY(${decayProgress * 2}px) rotate(${idx * 15}deg)`,
        opacity: 1 - (decayProgress - 75) / 25,
        transition: 'all 2s ease-in'
      };
    }
    if (stage === DecayStage.UNSTABLE) {
      return {
        transform: `translate(${Math.sin(decayProgress + idx) * 10}px, ${Math.cos(decayProgress + idx) * 10}px)`,
        filter: `invert(${Math.random() > 0.9 ? 1 : 0})`
      };
    }
    return {};
  };

  if (stage === DecayStage.RECONSTRUCT) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-white">
        <div className="text-xl animate-pulse mb-8">RECONSTRUCTING {profile.name.toUpperCase()}_ID...</div>
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-reconstruct-progress" />
        </div>
      </div>
    );
  }

  if (stage === DecayStage.SHATTERED) {
    return (
      <div className="min-h-screen bg-black overflow-hidden relative font-mono text-red-500 p-12">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="whitespace-nowrap animate-marquee-fast" style={{ top: `${i * 5}%` }}>
              FATAL_ERROR MEMORY_CORRUPTION_AT_ADDR_{Math.random().toString(16).slice(2, 10).toUpperCase()} NULL_POINTER_EXCEPTION REALITY_UNSTABLE
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-12 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase animate-glitch-text">{profile.name} COLLAPSE</h1>
            <p className="text-white font-bold opacity-60">The entity "{profile.name}" has been fragmented.</p>
          </div>

          <form onSubmit={handleRebuild} className="space-y-4 bg-red-950/20 p-8 border border-red-500/30 backdrop-blur-xl">
            <div className="text-xl">RECOVER IDENTITY? [Y/N]</div>
            <input
              autoFocus
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              className="bg-transparent border-b-2 border-red-500 text-center outline-none text-4xl w-24 uppercase"
              maxLength={1}
            />
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-1000 relative overflow-x-hidden
        ${stage === DecayStage.PRISTINE ? 'bg-white text-black' : ''}
        ${stage >= DecayStage.FLICKER && stage < DecayStage.SHATTERED ? 'bg-zinc-100 text-black' : ''}
        ${stage === DecayStage.SCARRED ? 'bg-[#fafafa] text-black selection:bg-red-500/30' : ''}
      `}
    >
      {stage === DecayStage.SCARRED && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] mix-blend-difference" />
      )}

      <div className={`
        min-h-screen p-8 md:p-24 transition-all duration-700
        ${stage === DecayStage.UNSTABLE ? 'aberration-active' : ''}
        ${stage === DecayStage.FLICKER ? 'animate-subtle-flicker' : ''}
      `}>
        <div className="max-w-6xl mx-auto space-y-32">

          <header className="relative flex flex-col items-center gap-16 text-center">
            <div className={`transition-all duration-1000 ${stage >= DecayStage.UNSTABLE && stage < DecayStage.SCARRED ? 'blur-md grayscale' : ''}`}>
              <ThemedProfile theme="THE_CORRUPTION" profile={profile} onEdit={onEditProfile} />
            </div>

            <div className="flex flex-col items-center max-w-4xl">
              {stage === DecayStage.SCARRED && (
                <div className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase rotate-[-2deg] w-fit mb-4">Recovered_Subject_{profile.name.replace(/\s/g, '_')}</div>
              )}
              <h1 className={`text-7xl md:text-9xl font-black uppercase tracking-tighter transition-all duration-500 ${stage === DecayStage.SCARRED ? 'italic' : ''} break-all`}>
                {corruptText(stage === DecayStage.SCARRED ? profile.name : 'Entity_X')}
              </h1>
              <div className={`h-1 bg-black transition-all duration-1000 mt-4 ${stage === DecayStage.SCARRED ? 'w-32 bg-red-600' : 'w-64'}`} />
              <p className="mt-8 text-xl opacity-60 max-w-xl italic leading-relaxed">{corruptText(profile.bio)}</p>
            </div>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {data.map((item, idx) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick(item.id)}
                style={getCardStyle(idx)}
                className={`group relative flex flex-col gap-6 p-8 transition-all duration-300 block
                  ${stage === DecayStage.PRISTINE ? 'border border-transparent hover:border-black/10' : ''}
                  ${stage === DecayStage.SCARRED ? 'bg-white shadow-[10px_10px_0_rgba(0,0,0,0.02)] border border-black/5 hover:border-red-500/20' : ''}
                `}
              >
                {stage === DecayStage.SCARRED && idx === 0 && (
                  <div className="absolute top-0 right-0 w-24 h-4 bg-black animate-pulse opacity-10 -translate-y-2" />
                )}

                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-20">0{idx + 1}</span>
                  <div className={`w-2 h-2 rounded-full transition-colors ${stage === DecayStage.SCARRED ? 'bg-red-500 animate-ping' : 'bg-black'}`} />
                </div>

                <h3 className="text-4xl font-black uppercase leading-none tracking-tighter">
                  {corruptText(item.title)}
                </h3>

                <p className={`text-sm leading-relaxed transition-opacity duration-500 ${stage === DecayStage.SCARRED ? 'opacity-60 italic' : 'opacity-80'}`}>
                  {corruptText(item.description)}
                </p>

                {stage === DecayStage.SCARRED && item.codeSnippet && (
                  <div className="bg-zinc-50 p-4 border-l-2 border-red-500 font-mono text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                    {item.codeSnippet}
                  </div>
                )}

                <div className="mt-auto pt-8 border-t border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span>{corruptText(item.category)}</span>
                  <span className={`px-6 py-2 transition-all duration-500
                    ${stage === DecayStage.SCARRED ? 'bg-black text-white hover:bg-red-600' : 'bg-zinc-100 hover:bg-black hover:text-white'}
                   `}>
                    {stage === DecayStage.SCARRED ? 'Examine Fragment' : 'View Project'}
                  </span>
                </div>
              </a>
            ))}
          </main>

          {/* Integrated Guestbook Section (Only visible in SCARRED stage for narrative effect) */}
          {stage === DecayStage.SCARRED && (
            <div className="mt-40 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12 flex items-center gap-4">
                <span className="w-8 h-1 bg-red-600" />
                Corrupted_Transmissions
              </h2>
              <div className="bg-white border border-black/5 p-8 shadow-2xl h-[600px] relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')]" />
                <Guestbook isInline />
              </div>
            </div>
          )}

          <footer className="py-40 text-center flex flex-col items-center gap-8">
            <div className={`text-[10px] font-black uppercase tracking-[1em] transition-opacity duration-1000 ${stage === DecayStage.SCARRED ? 'text-red-600' : 'opacity-20'}`}>
              {stage === DecayStage.SCARRED ? 'End of reconstruction' : 'Keep Scrolling'}
            </div>
            {stage === DecayStage.SCARRED && (
              <button
                onClick={() => { setStage(DecayStage.PRISTINE); setDecayProgress(0); }}
                className="text-[9px] font-black uppercase tracking-widest underline decoration-red-500 underline-offset-4 opacity-40 hover:opacity-100 transition-opacity"
              >
                Re-break session
              </button>
            )}
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes subtle-flicker { 0%, 100% { opacity: 1; } 95% { opacity: 1; } 96% { opacity: 0.8; } 97% { opacity: 1; } 98% { opacity: 0.9; } 99% { opacity: 1; } }
        .aberration-active { filter: contrast(1.1); text-shadow: 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,0,255,0.5); }
        @keyframes glitch-text { 0% { transform: translate(0); text-shadow: 2px 2px red; } 20% { transform: translate(-2px, 2px); text-shadow: -2px -2px blue; } 40% { transform: translate(-2px, -2px); text-shadow: 2px -2px green; } 60% { transform: translate(2px, 2px); text-shadow: -2px 2px yellow; } 80% { transform: translate(2px, -2px); text-shadow: 2px 2px red; } 100% { transform: translate(0); } }
        @keyframes reconstruct-progress { from { width: 0; } to { width: 100%; } }
        .animate-reconstruct-progress { animation: reconstruct-progress 3s linear forwards; }
        @keyframes marquee-fast { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .animate-marquee-fast { animation: marquee-fast 5s linear infinite; }
        .animate-glitch-text { animation: glitch-text 0.1s infinite; }
      `}</style>
    </div>
  );
};

export default CorruptionTheme;
