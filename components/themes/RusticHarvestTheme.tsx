
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ContentItem } from '../../types';

interface TilledPatch {
  id: number;
  x: number;
  y: number;
  stage: number; // 0: Tilled, 1: Sprouted, 2: Growing, 3: Mature
}

const RusticHarvestTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilledPatches, setTilledPatches] = useState<TilledPatch[]>([]);
  const [harvestCount, setHarvestCount] = useState(0);
  const nextId = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleTill = (e: React.MouseEvent) => {
    const newPatch: TilledPatch = {
      id: nextId.current++,
      x: e.clientX,
      y: e.clientY,
      stage: 0
    };
    setTilledPatches(prev => [...prev, newPatch].slice(-15)); // Keep latest 15
  };

  // Age the crops
  useEffect(() => {
    const interval = setInterval(() => {
      setTilledPatches(prev => prev.map(p => ({
        ...p,
        stage: Math.min(p.stage + 1, 3)
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#4d3a2b] text-[#fef3c7] font-serif p-8 md:p-16 relative overflow-hidden cursor-none select-none"
      onMouseMove={handleMouseMove}
      onClick={handleTill}
    >
      {/* Background Field Rows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#3d2b1f_0px,#3d2b1f_40px,#4d3a2b_40px,#4d3a2b_80px)] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c1b0e] via-transparent to-[#7dd3fc]/10" />
      </div>

      {/* Interactive Tilled Patches */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {tilledPatches.map(patch => (
          <div 
            key={patch.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{ left: patch.x, top: patch.y }}
          >
            {/* Dark Dirt Patch */}
            <div className="w-24 h-12 bg-[#2c1b0e] rounded-[100%] blur-sm opacity-60 scale-x-125" />
            
            {/* Growth Stages */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl transition-all duration-500">
              {patch.stage === 0 && <span className="opacity-0">🌱</span>}
              {patch.stage === 1 && <span className="animate-bounce">🌱</span>}
              {patch.stage === 2 && <span className="animate-pulse">🌿</span>}
              {patch.stage === 3 && <span className="scale-125 drop-shadow-md">🌽</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto flex flex-col gap-12">
        <header className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-8xl font-['Permanent_Marker'] text-[#facc15] drop-shadow-[0_4px_0_#854d0e] uppercase tracking-tight -rotate-2">
              The Harvest Logs
            </h1>
            <div className="absolute -top-6 -right-12 text-5xl animate-sway">☀️</div>
          </div>
          <p className="mt-6 text-xs font-bold tracking-[0.5em] text-white/40 uppercase">Tilling the Data of the Old Earth</p>
        </header>

        {/* Silo Counter */}
        <div className="fixed top-8 left-8 bg-[#854d0e] border-4 border-[#3d2b1f] p-4 shadow-xl z-50 rounded-sm">
          <div className="text-[10px] font-black uppercase text-[#fef3c7]/60">Silo Capacity</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2">
             <span>🌾</span> {harvestCount}
          </div>
          <div className="w-full h-1 bg-black/20 mt-2">
            <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${(harvestCount % 10) * 10}%` }} />
          </div>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((item, idx) => (
            <div 
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setHarvestCount(prev => prev + 1);
              }}
              className="group relative h-full flex flex-col perspective-1000 cursor-pointer"
            >
              {/* Wooden Crate Card */}
              <div className="relative bg-[#fef3c7] text-[#3d2b1f] p-8 flex-1 flex flex-col shadow-[10px_10px_0_rgba(0,0,0,0.2)] border-[10px] border-double border-[#854d0e] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                
                {/* Burlap Texture Overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#854d0e]">Batch_{item.id}</span>
                    <span className="text-[8px] opacity-60 italic font-mono">{item.timestamp.split('T')[0]}</span>
                  </div>
                  <div className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">🥕</div>
                </div>

                <h3 className="text-2xl font-['Permanent_Marker'] mb-4 leading-none text-[#166534] border-b-2 border-black/5 pb-2">
                  {item.title}
                </h3>

                <p className="text-sm italic leading-relaxed text-[#4d3a2b] mb-8 font-serif">
                  "{item.description}"
                </p>

                {item.codeSnippet && (
                  <div className="mt-auto bg-[#d9c5b2] p-3 border-x-4 border-[#854d0e] font-mono text-[9px] mb-6 relative">
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#854d0e] rounded-full" />
                    {item.codeSnippet}
                  </div>
                )}

                <div className="pt-4 border-t border-[#854d0e]/20 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <div className="flex flex-col">
                      <span className="opacity-40">Crop Vitality</span>
                      <span className={item.status === 'CRITICAL' ? 'text-red-600 animate-pulse' : 'text-green-700'}>
                        {item.status}
                      </span>
                   </div>
                   <button className="px-4 py-2 bg-[#166534] text-white hover:bg-[#14532d] transition-colors shadow-md active:scale-95 rounded-full font-bold">
                     REAP
                   </button>
                </div>

                {/* Corner Decoration: Wheat */}
                <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-4xl">🌾</span>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      <footer className="mt-32 text-center pb-24 relative z-20">
        <div className="inline-block px-10 py-4 border-t-2 border-b-2 border-[#854d0e]/30">
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#fef3c7]/40">
            Cultivated by the Hands of the Algorithm
          </p>
        </div>
      </footer>

      {/* The Hoe Tool (Cursor) */}
      <div 
        className="fixed pointer-events-none z-[100] transition-transform duration-75"
        style={{ left: mousePos.x, top: mousePos.y }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-lg -rotate-45">
          <rect x="45" y="0" width="10" height="80" fill="#8b4513" rx="2" />
          <path d="M30 80 L70 80 L70 100 L30 100 Z" fill="#5d5d5d" />
          <circle cx="50" cy="85" r="2" fill="white" opacity="0.5" />
        </svg>
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RusticHarvestTheme;
