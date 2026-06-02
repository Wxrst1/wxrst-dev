
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentItem, UserProfile, ThemeType } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

enum HeistState {
  BRIEFING = 'BRIEFING',
  INFILTRATION = 'INFILTRATION',
  VAULT = 'VAULT',
  MINIGAME = 'MINIGAME',
  ESCAPE = 'ESCAPE',
  SUCCESS = 'SUCCESS',
  PORTFOLIO = 'PORTFOLIO'
}

const HeistTheme: React.FC<{ data: ContentItem[]; profile: UserProfile; onEditProfile: () => void; onLinkClick: (id: string) => void }> = ({ data, profile, onEditProfile, onLinkClick }) => {
  // ... existing state and logic ...
  // (I will use multi_replace if I need to skip the middle, but for now I'll just replace the relevant part)
  const [state, setState] = useState<HeistState>(HeistState.BRIEFING);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [timer, setTimer] = useState(60);
  const [camAngle, setCamAngle] = useState(0);
  const [combinationAngle, setCombinationAngle] = useState(0);
  const [isLockUnlocked, setIsLockUnlocked] = useState(false);
  const [stareProgress, setStareProgress] = useState(0);
  const [briefingStep, setBriefingStep] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const isDraggingLock = useRef(false);

  useEffect(() => {
    if (state === HeistState.BRIEFING) {
      const interval = setInterval(() => {
        setBriefingStep(s => {
          if (s >= 4) {
            clearInterval(interval);
            return s;
          }
          return s + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    if (state === HeistState.ESCAPE) {
      const interval = setInterval(() => {
        setTimer(t => (t <= 0 ? 0 : t - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    if (state === HeistState.VAULT) {
      const interval = setInterval(() => {
        setCamAngle(a => (a + 1.5) % 360);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
      if (state === HeistState.MINIGAME) {
        const dx = e.clientX - window.innerWidth / 2;
        const dy = e.clientY - window.innerHeight / 2;
        if (Math.sqrt(dx * dx + dy * dy) < 40) setStareProgress(p => Math.min(100, p + 1));
        else setStareProgress(0);
      }
    }
    if (state === HeistState.INFILTRATION && isDraggingLock.current && dialRef.current) {
      const dialRect = dialRef.current.getBoundingClientRect();
      const angle = Math.atan2(e.clientY - (dialRect.top + dialRect.height / 2), e.clientX - (dialRect.left + dialRect.width / 2)) * (180 / Math.PI);
      const normalizedAngle = (angle + 360 + 90) % 360;
      setCombinationAngle(normalizedAngle);
      setIsLockUnlocked(normalizedAngle > 175 && normalizedAngle < 185);
    }
  }, [state]);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', () => { isDraggingLock.current = false; });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [handleGlobalMouseMove]);

  useEffect(() => {
    if (stareProgress === 100) setState(HeistState.ESCAPE);
  }, [stareProgress]);

  return (
    <div ref={containerRef} className={`min-h-screen bg-black text-white font-['Orbitron'] relative overflow-hidden select-none transition-colors duration-500 ${alarmTriggered ? 'bg-red-950/80' : ''} ${state === HeistState.ESCAPE ? 'animate-pulse bg-red-900/10' : ''}`}>
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
      <div className="fixed inset-0 pointer-events-none z-[201] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')]" />

      {state === HeistState.BRIEFING && (
        <div className="relative z-10 h-screen flex items-center justify-center p-8 bg-zinc-950">
          <div className="max-w-4xl w-full flex flex-col items-center gap-12 text-center">
            <div className={`transition-all duration-1000 ${briefingStep >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <ThemedProfile theme={ThemeType.THE_HEIST} profile={profile} onEdit={onEditProfile} />
            </div>
            <div className="flex-1 font-mono text-cyan-400 space-y-6 max-w-2xl">
              <div className="border-y-4 border-cyan-500 py-6">
                <div className={`transition-opacity duration-500 ${briefingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>[ CLASSIFIED // EYES ONLY ]</div>
                <div className={`text-4xl font-black uppercase tracking-tighter ${briefingStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>Operation: Deep_Extract</div>
              </div>
              <div className={`space-y-4 text-sm leading-relaxed ${briefingStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <p>{">"} Agent Identification: {profile.name}</p>
                <p>{">"} Objective: Extract all 5 encrypted project fragments from the core vault.</p>
              </div>
            </div>
            {briefingStep >= 4 && (
              <button onClick={() => setState(HeistState.INFILTRATION)} className="mt-8 px-10 py-4 bg-cyan-600 text-black font-black uppercase italic tracking-widest hover:bg-white transition-all animate-pulse">Accept Mission</button>
            )}
          </div>
        </div>
      )}

      {state === HeistState.INFILTRATION && (
        <div className="relative z-10 h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center mb-12"><h2 className="text-4xl italic font-black uppercase">Crack the Mechanical Lock</h2></div>
          <div ref={dialRef} onMouseDown={() => { isDraggingLock.current = true; }} className={`relative w-80 h-80 rounded-full border-8 border-white/10 bg-zinc-900 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 ${isLockUnlocked ? 'border-green-500 shadow-[0_0_60px_rgba(34,197,94,0.4)]' : ''}`} style={{ transform: `rotate(${combinationAngle}deg)` }}>
            {[...Array(12)].map((_, i) => <div key={i} className="absolute w-1 h-4 bg-white/20" style={{ transform: `rotate(${i * 30}deg) translateY(-140px)` }} />)}
            <div className="absolute w-16 h-16 bg-zinc-800 rounded-full border-2 border-white/20 shadow-inner" />
          </div>
          <div className="mt-16 flex flex-col items-center gap-4">
            <button disabled={!isLockUnlocked} onClick={() => setState(HeistState.VAULT)} className={`px-12 py-4 font-black uppercase italic tracking-widest transition-all duration-500 ${isLockUnlocked ? 'bg-green-600 text-white scale-110 shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Unlock Vault</button>
          </div>
        </div>
      )}

      {state === HeistState.VAULT && (
        <div className="relative z-10 h-screen cursor-none flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-12 left-12 flex flex-col gap-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Agent_Ghost Status: ACTIVE</span>
          </div>
          <div className="absolute top-1/4 left-1/4 pointer-events-none"><div className="w-96 h-96 bg-red-600/10 origin-top-left" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)', transform: `rotate(${Math.sin(camAngle / 20) * 40}deg) scale(1.5)`, filter: 'blur(30px)' }} /></div>
          <div onClick={() => setState(HeistState.MINIGAME)} className="w-64 h-64 border-4 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center group hover:border-cyan-400 transition-all cursor-pointer z-[60]">
            <div className="text-center space-y-2 group-hover:scale-110 transition-transform"><span className="text-6xl">🔒</span><div className="text-[10px] uppercase text-cyan-400">Vault Core</div></div>
          </div>
          <div className="fixed pointer-events-none z-[100] transition-transform duration-75" style={{ left: mousePos.x, top: mousePos.y }}><div className="relative -translate-x-1/2 -translate-y-1/2"><div className="w-10 h-10 border border-cyan-500 rotate-45 flex items-center justify-center"><div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" /></div></div></div>
        </div>
      )}

      {state === HeistState.MINIGAME && (
        <div className="relative z-10 h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-black italic uppercase mb-20">Biometric Verification</h2>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-cyan-500 rounded-full transition-all duration-300" style={{ clipPath: `inset(${100 - stareProgress}% 0 0 0)` }} />
            <div className="w-24 h-24 bg-zinc-900 rounded-full shadow-[0_0_20px_cyan]" />
          </div>
        </div>
      )}

      {state === HeistState.ESCAPE && (
        <div className="relative z-10 h-screen flex flex-col items-center justify-center bg-red-950/20 p-8 text-center space-y-8">
          <h1 className="text-9xl font-black italic text-red-600 uppercase">ESCAPE!</h1>
          <div className="text-6xl font-black tabular-nums">00:{timer.toString().padStart(2, '0')}</div>
          <button onClick={() => setState(HeistState.SUCCESS)} className="px-20 py-8 bg-white text-black text-2xl font-black uppercase tracking-widest hover:scale-110 transition-transform">Dive to Exit</button>
        </div>
      )}

      {state === HeistState.SUCCESS && (
        <div className="relative z-10 h-screen flex items-center justify-center bg-[#111] p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-[#f4f1ea] text-black p-12 shadow-2xl rotate-1 space-y-12">
            <header className="border-b-4 border-black pb-8 text-center uppercase">
              <h1 className="text-6xl md:text-8xl font-serif font-black leading-none tracking-tighter">THE GHOST STRIKES</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-serif">
              <div>
                <img src={profile.avatarUrl} className="w-full aspect-square object-cover grayscale brightness-50" alt="identity" />
                <h3 className="text-2xl font-bold mt-4 italic">Lead Suspect: {profile.name}</h3>
              </div>
              <div className="space-y-6">
                <p className="leading-relaxed">A professional raid on the central data vault has left the architecture fragmented. Authorities are looking for a figure known as the {profile.title}.</p>
                <button onClick={() => setState(HeistState.PORTFOLIO)} className="w-full py-4 bg-black text-white font-black uppercase text-[10px] tracking-[0.5em] hover:bg-red-700 transition-colors">View Loot</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === HeistState.PORTFOLIO && (
        <div className="relative z-10 min-h-screen bg-[#050505] p-8 md:p-24 font-['Black_Ops_One']">
          <header className="mb-24 flex flex-col items-center gap-12 text-center pt-10">
            <div className="shrink-0 scale-110 hover:brightness-125 transition-all">
              <ThemedProfile theme={ThemeType.THE_HEIST} profile={profile} onEdit={onEditProfile} />
            </div>
            <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter uppercase text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">Mission_Loot</h1>
          </header>
          <div className="relative flex flex-wrap justify-center gap-12">
            {data.map((item, idx) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick(item.id)}
                className="group relative w-72 bg-white p-4 pb-12 shadow-2xl rotate-1 transition-all hover:z-50 hover:scale-105 cursor-pointer block"
              >
                <div className="bg-black w-full aspect-square relative overflow-hidden"><img src={`https://picsum.photos/seed/${item.id}/400/400?grayscale`} className="w-full h-full object-cover opacity-60" /><div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold px-1 uppercase tracking-widest">Asset_Frag_{item.id}</div></div>
                <div className="space-y-2 text-black font-sans mt-4"><h3 className="text-xl font-black uppercase border-b-2 border-black/10 pb-2">{item.title}</h3><p className="text-[11px] leading-relaxed italic opacity-70">"{item.description}"</p></div>
              </a>
            ))}
          </div>

          {/* Integrated Guestbook Section */}
          <div className="mt-32 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black italic uppercase text-red-600 mb-8 border-b border-red-900 pb-4">Public_Transmissions</h2>
            <div className="bg-zinc-900/50 border border-white/5 p-8 backdrop-blur-md h-[600px]">
              <Guestbook isInline />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanline { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
        .animate-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default HeistTheme;
