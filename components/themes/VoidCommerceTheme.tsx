
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const VoidCommerceTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [trust, setTrust] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const [isConfident, setIsConfident] = useState(false);
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const lastMousePos = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  // Initialize offsets
  useEffect(() => {
    const initialOffsets: Record<string, { x: number; y: number }> = {};
    data.forEach(item => {
      initialOffsets[item.id] = { x: 0, y: 0 };
    });
    setOffsets(initialOffsets);
  }, [data]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const v = Math.sqrt(dx * dx + dy * dy);
      setVelocity(v);
      setMousePos({ x: e.clientX, y: e.clientY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // High velocity resets trust
      if (v > 40 && !isConfident) {
        setTrust(prev => Math.max(0, prev - 2));
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isConfident]);

  // Trust Builder Loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (velocity < 5 && !isConfident) {
        setTrust(prev => {
          const next = Math.min(100, prev + 1);
          if (next === 100) setIsConfident(true);
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [velocity, isConfident]);

  // Card Dodging Logic
  useEffect(() => {
    if (isConfident) return;

    const dodge = () => {
      const newOffsets = { ...offsets };
      data.forEach(item => {
        const el = document.getElementById(`void-card-${item.id}`);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mousePos.x - centerX;
        const dy = mousePos.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const dodgeRadius = 250 * (1 - trust / 100);
        if (dist < dodgeRadius) {
          const force = (dodgeRadius - dist) / dodgeRadius;
          const current = newOffsets[item.id] || { x: 0, y: 0 };
          newOffsets[item.id] = {
            x: current.x - (dx / dist) * force * 20,
            y: current.y - (dy / dist) * force * 20
          };
        } else {
          // Slowly return to center
          const current = newOffsets[item.id] || { x: 0, y: 0 };
          newOffsets[item.id] = {
            x: current.x * 0.95,
            y: current.y * 0.95
          };
        }
      });
      setOffsets(newOffsets);
      frameRef.current = requestAnimationFrame(dodge);
    };

    frameRef.current = requestAnimationFrame(dodge);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [mousePos, trust, isConfident, offsets, data]);

  return (
    <div className={`min-h-screen transition-all duration-1000 flex flex-col items-center ${isConfident ? 'bg-white text-black' : 'bg-black text-white cursor-crosshair'}`}>
      
      {/* Noise Filter Overlay (Diminishes with trust) */}
      {!isConfident && (
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.4]" style={{ opacity: 0.4 * (1 - trust / 100) }}>
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      )}

      {/* Trust Meter HUD */}
      {!isConfident && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Relationship Status</div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-white transition-all duration-500" style={{ width: `${trust}%` }} />
          </div>
          <div className="text-[9px] font-mono italic opacity-20">
            {trust < 30 ? "Website is terrified of you." : trust < 70 ? "Website is curious." : "Website is starting to trust you."}
          </div>
        </div>
      )}

      {/* Confident Mode Indicator */}
      {isConfident && (
        <div className="fixed top-8 right-8 z-[110] animate-in slide-in-from-right duration-1000">
          <div className="px-4 py-1 border border-black text-[10px] font-black uppercase tracking-widest">
            Confident State Active
          </div>
        </div>
      )}

      <div className={`relative z-10 w-full max-w-6xl py-32 px-6 flex flex-col gap-32 transition-transform duration-1000 ${isConfident ? 'scale-100' : 'scale-95'}`}>
        
        <header className="text-center flex flex-col items-center gap-4">
          <h1 className={`text-6xl md:text-9xl font-black uppercase tracking-tighter transition-all duration-1000 ${isConfident ? 'italic' : 'blur-xl scale-110 opacity-10 select-none'}`}>
            {isConfident ? 'A Real Website.' : 'DO NOT LOOK'}
          </h1>
          {!isConfident && (
             <div className="text-xs font-mono p-2 bg-red-900/20 border border-red-500/40 text-red-500 animate-pulse">
               ERROR 404: IDENTITY NOT FOUND
             </div>
          )}
          {isConfident && (
            <p className="text-sm font-serif italic max-w-lg opacity-60">
              "Thank you for being gentle. I didn't want to show this to just anyone."
            </p>
          )}
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-24 relative">
          {data.map((item, idx) => {
            const currentOffset = offsets[item.id] || { x: 0, y: 0 };
            
            return (
              <div 
                key={item.id}
                id={`void-card-${item.id}`}
                className="group relative"
                style={{ 
                  transform: isConfident 
                    ? 'none' 
                    : `translate(${currentOffset.x}px, ${currentOffset.y}px)` ,
                  transition: isConfident ? 'all 1s ease' : 'none'
                }}
              >
                <div className={`
                  relative p-12 transition-all duration-700 flex flex-col gap-6
                  ${isConfident ? 'bg-zinc-50 border border-zinc-200' : 'bg-zinc-900/80 backdrop-blur-3xl border border-white/5'}
                `}>
                  
                  {/* Blurry Shield */}
                  {!isConfident && (
                    <div className="absolute inset-0 z-20 backdrop-blur-lg flex items-center justify-center transition-opacity duration-700 opacity-100 group-hover:opacity-0 pointer-events-none">
                       <span className="text-[10px] font-black opacity-20 uppercase tracking-[1em]">Restricted</span>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isConfident ? 'text-zinc-400' : 'opacity-20'}`}>
                      {isConfident ? `Fragment #${item.id}` : 'REDACTED'}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${isConfident ? 'bg-zinc-200' : 'bg-red-900 animate-ping'}`} />
                  </div>

                  <h3 className={`text-4xl font-black uppercase tracking-tighter transition-all duration-700 ${!isConfident && 'blur-md'}`}>
                    {isConfident ? item.title : '########'}
                  </h3>

                  <p className={`text-sm leading-relaxed italic transition-all duration-1000 ${isConfident ? 'text-zinc-600' : 'opacity-10 blur-sm'}`}>
                    {item.description}
                  </p>

                  <div className={`pt-8 border-t transition-colors ${isConfident ? 'border-zinc-200' : 'border-white/5'} flex justify-between items-center`}>
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black opacity-40 uppercase">State</span>
                        <span className={`text-xs font-mono ${isConfident ? 'text-zinc-900' : 'text-red-900 animate-pulse'}`}>
                          {isConfident ? item.status : 'UNKNOWN'}
                        </span>
                     </div>
                     <button className={`
                       px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                       ${isConfident ? 'bg-black text-white hover:invert' : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black'}
                     `}>
                       {isConfident ? 'Execute' : 'DON\'T CLICK'}
                     </button>
                  </div>

                  {/* Anti-Look Decorations */}
                  {!isConfident && (
                    <div className="absolute -top-4 -left-4 text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                      🚫
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>

        <footer className="text-center flex flex-col items-center gap-12 pb-40">
           <div className={`h-px w-24 transition-colors ${isConfident ? 'bg-zinc-200' : 'bg-white/10'}`} />
           <p className={`text-[10px] font-black uppercase tracking-[1em] transition-opacity duration-1000 ${isConfident ? 'opacity-20' : 'opacity-5'}`}>
             {isConfident ? 'Architecture Finalized' : 'Nothing to see here'}
           </p>
           {!isConfident && (
             <button className="text-[9px] font-mono italic opacity-20 hover:opacity-100 transition-opacity underline decoration-dotted">
               Report Website Malfunction
             </button>
           )}
        </footer>
      </div>

      <style>{`
        .cursor-crosshair {
          cursor: crosshair;
        }
        @keyframes void-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default VoidCommerceTheme;
