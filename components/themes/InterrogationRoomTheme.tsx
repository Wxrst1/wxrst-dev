
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

enum Phase {
  OPENING = 'OPENING',
  INTERROGATION = 'INTERROGATION',
  PROFILING = 'PROFILING',
  REVEAL = 'REVEAL'
}

const QUESTIONS = [
  "Please, sit down. Why are you really here?",
  "Tell me the truth. What are you hiding behind that screen?",
  "We know what you've seen. What are you afraid of?",
  "Final question. Are you ready to face the evidence?"
];

const InterrogationRoomTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [phase, setPhase] = useState<Phase>(Phase.OPENING);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [input, setInput] = useState('');
  const [cooperation, setCooperation] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);
  const [pinPositions, setPinPositions] = useState<Record<string, { x: number; y: number }>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Opening sequence
  useEffect(() => {
    if (phase === Phase.OPENING) {
      const timer = setTimeout(() => setPhase(Phase.INTERROGATION), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle Input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Track Cooperation (Length + Keywords)
    const bonus = input.length > 20 ? 10 : 2;
    setCooperation(prev => prev + bonus);

    if (questionIdx < QUESTIONS.length - 1) {
      setQuestionIdx(prev => prev + 1);
      setInput('');
      // Subtle flash
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    } else {
      setPhase(Phase.REVEAL);
    }
  };

  // Mouse Lighting Effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Calculate Pin Positions for Evidence Board
  useEffect(() => {
    if (phase === Phase.REVEAL) {
      const updatePins = () => {
        const pins: Record<string, { x: number; y: number }> = {};
        data.forEach(item => {
          const el = document.getElementById(`pin-${item.id}`);
          if (el && containerRef.current) {
            const rect = el.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            pins[item.id] = {
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top + rect.height / 2
            };
          }
        });
        setPinPositions(pins);
      };
      // Slight delay to allow render
      setTimeout(updatePins, 1000);
      window.addEventListener('resize', updatePins);
      return () => window.removeEventListener('resize', updatePins);
    }
  }, [phase, data]);

  if (phase !== Phase.REVEAL) {
    return (
      <div className={`min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 ${glitch ? 'invert contrast-200' : ''}`}>
        {/* Grain & Scanline */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        <div className="absolute inset-0 scanline-overlay pointer-events-none z-[60] opacity-5" />

        {/* Flickering Spotlight */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle 300px at 50% 50%, rgba(255,255,255,${0.05 + cooperation / 500}) 0%, transparent 100%)`
          }}
        />

        {/* Interrogation HUD */}
        <div className="relative z-20 max-w-2xl w-full px-8 text-center">
          {phase === Phase.OPENING ? (
            <h1 className="text-4xl font-black uppercase tracking-[0.5em] animate-pulse">
              Please, sit down.
            </h1>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block animate-pulse">
                  Signal: Active // Interrogation in progress
                </span>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {QUESTIONS[questionIdx]}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="relative group">
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your statement..."
                  className="w-full bg-white/5 border-b-2 border-white/20 px-4 py-3 outline-none text-xl focus:border-red-600 transition-colors text-center font-serif italic"
                />
                <div className="mt-4 text-[9px] opacity-20 uppercase tracking-widest">Press Enter to Confirm</div>
              </form>
            </div>
          )}
        </div>

        {/* Peripheral Shadows */}
        <div className="absolute top-8 left-8 text-[10px] font-bold opacity-10 tracking-[0.5em]">
          DET_FILE_9921_B
        </div>
      </div>
    );
  }

  // Phase: REVEAL (Evidence Board)
  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#3d2b1f] font-['Special_Elite'] p-12 md:p-24 relative overflow-hidden animate-in zoom-in fade-in duration-1000"
      style={{
        backgroundImage: `url('https://www.transparenttextures.com/patterns/cork-board.png')`,
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Dynamic Red String Logic */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        {Object.keys(pinPositions).map((id, idx, arr) => {
          if (idx === arr.length - 1) return null;
          const start = pinPositions[id];
          const end = pinPositions[arr[idx + 1]];
          if (!start || !end) return null;
          return (
            <line 
              key={`string-${id}`}
              x1={start.x} y1={start.y} 
              x2={end.x} y2={end.y} 
              stroke="#8b0000" 
              strokeWidth="2" 
              strokeOpacity="0.8"
              className="animate-pulse"
              style={{ filter: 'drop-shadow(0 0 2px rgba(139,0,0,0.5))' }}
            />
          );
        })}
      </svg>

      <div className="relative z-20 max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col items-center">
          <div className="bg-yellow-400 text-black px-8 py-2 border-2 border-black border-dashed -rotate-1 shadow-lg mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Verified Subject Dossier</h2>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] text-center font-['Playfair_Display']">
            Case Files: <span className="text-red-700">Revealed</span>
          </h1>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Psychological Profile: {cooperation > 40 ? 'COOPERATIVE' : 'SUSPECTED'}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
          {data.map((item, idx) => {
            const rotation = (idx % 2 === 0 ? -2 : 2) * (Math.random() * 2 + 1);
            return (
              <div 
                key={item.id}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="group relative"
              >
                {/* The Pin Point */}
                <div 
                  id={`pin-${item.id}`}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-red-900 shadow-md z-40"
                />

                {/* Case Folder Card */}
                <div className="bg-[#eee] p-6 pb-12 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 hover:z-50 border border-gray-300">
                  
                  {/* Evidence Photo */}
                  <div className="bg-black w-full aspect-square mb-6 relative overflow-hidden border-b-2 border-black/10">
                     <img 
                      src={`https://picsum.photos/seed/${item.id}noir/500/500?grayscale`} 
                      alt="evidence" 
                      className="w-full h-full object-cover opacity-50 contrast-150 sepia group-hover:opacity-100 group-hover:sepia-0 transition-all duration-1000"
                    />
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] font-black px-1">EXHIBIT_{item.id}</div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-black border-b border-black/10 pb-2 font-serif">
                      {item.title}
                    </h3>
                    
                    <div className="relative">
                      <p className="text-sm leading-relaxed text-black/70 italic">
                        "{item.description}"
                      </p>
                      {/* Redacted lines logic */}
                      {idx % 2 === 0 && (
                        <div className="mt-2 h-4 w-2/3 bg-black opacity-100 mix-blend-multiply" />
                      )}
                    </div>

                    <div className="pt-6 flex flex-col gap-2">
                       <div className="flex justify-between items-end text-[10px] font-black uppercase text-red-900">
                          <span>Sector: {item.category}</span>
                          <span className="animate-pulse">{item.status}</span>
                       </div>
                       <button className="w-full py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
                         Open Confidential File
                       </button>
                    </div>
                  </div>

                  {/* Coffee Stain Decor */}
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-[10px] border-brown-900/10 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-40 text-center pb-40">
           <div className="inline-block relative">
             <div className="text-[10px] font-black uppercase tracking-[1em] text-white/20">Case Closed // Access Granted</div>
             <div className="mt-8 opacity-20 text-7xl">🔍</div>
           </div>
        </footer>
      </div>

      <style>{`
        .scanline-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          position: absolute;
          inset: 0;
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default InterrogationRoomTheme;
