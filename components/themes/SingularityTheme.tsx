
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const SingularityTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dilation, setDilation] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#020008] text-indigo-100 font-['Orbitron'] relative overflow-hidden flex items-center justify-center"
    >
      {/* Starfield Parallax */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
          style={{ transform: `translate(${(mousePos.x - window.innerWidth/2) * 0.02}px, ${(mousePos.y - window.innerHeight/2) * 0.02}px)` }}
        />
        <div 
          className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"
          style={{ transform: `translate(${(mousePos.x - window.innerWidth/2) * -0.01}px, ${(mousePos.y - window.innerHeight/2) * -0.01}px)` }}
        />
      </div>

      {/* The Singularity (Event Horizon) */}
      <div 
        className="relative z-0 w-[400px] h-[400px] rounded-full flex items-center justify-center group"
      >
        <div className="absolute inset-0 bg-black rounded-full shadow-[0_0_100px_rgba(79,70,229,0.4),_inset_0_0_100px_rgba(0,0,0,1)] border border-indigo-500/20" />
        
        {/* Accretion Disk */}
        <div className="absolute inset-[-50%] rounded-full border-[1px] border-indigo-400/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-[-30%] rounded-full border-[1px] border-purple-400/5 animate-[spin_45s_linear_infinite_reverse]" />
        
        {/* Gravitational Lensing Halo */}
        <div 
          className="absolute inset-[-100px] rounded-full blur-[60px] opacity-30 bg-gradient-to-tr from-indigo-900 via-transparent to-purple-900 animate-pulse"
        />

        {/* Central Core Text */}
        <div className="relative z-10 text-center select-none pointer-events-none">
          <h1 className="text-4xl font-black tracking-[0.5em] text-white opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
            NULL_POINT
          </h1>
          <p className="text-[10px] uppercase tracking-[0.8em] text-indigo-400 opacity-10">Entropy: Stable</p>
        </div>
      </div>

      {/* Orbiting Content Nodes */}
      <div className="fixed inset-0 pointer-events-none">
        {data.map((item, idx) => {
          const orbitRadius = 350 + idx * 60;
          const speed = 20 + idx * 10;
          
          return (
            <div 
              key={item.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${orbitRadius * 2}px`,
                height: `${orbitRadius * 2}px`,
                animation: `spin ${speed * dilation}s linear infinite`,
              }}
            >
              <div 
                className="pointer-events-auto absolute top-0 left-1/2 -translate-x-1/2 group"
                style={{ transform: `rotate(${-idx * 72}deg)` }}
              >
                {/* The "Spaghettified" Node */}
                <div className="relative cursor-pointer transition-all duration-700 group-hover:scale-125">
                  <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] group-hover:bg-indigo-600 transition-all overflow-hidden">
                    <span className="text-xs group-hover:hidden">0{idx+1}</span>
                    <span className="hidden group-hover:block text-[10px] font-black">VIEW</span>
                  </div>

                  {/* Expansion Detail (Hover) */}
                  <div className="absolute left-16 top-0 w-64 p-6 bg-black/80 border border-indigo-500/30 backdrop-blur-3xl opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                    <div className="text-[9px] uppercase tracking-widest text-indigo-400 mb-1">{item.category} // {item.status}</div>
                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight leading-none">{item.title}</h3>
                    <p className="text-xs text-indigo-100/60 leading-relaxed font-sans italic">"{item.description}"</p>
                    <div className="mt-4 flex gap-2">
                       <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-2/3 animate-[pulse_2s_infinite]" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Dilation Control (UI Interaction) */}
      <div className="fixed bottom-32 left-12 z-50 flex flex-col gap-4 bg-white/5 p-4 border border-white/10 backdrop-blur-lg">
        <label className="text-[9px] uppercase font-bold tracking-widest text-indigo-400">Time Dilation</label>
        <input 
          type="range" 
          min="0.1" 
          max="4" 
          step="0.1"
          value={dilation}
          onChange={(e) => setDilation(parseFloat(e.target.value))}
          className="w-32 h-1 bg-indigo-900 appearance-none cursor-pointer accent-indigo-400"
        />
        <div className="flex justify-between text-[8px] font-mono text-white/30">
          <span>INSTANT</span>
          <span>VOID</span>
        </div>
      </div>

      {/* Decorative Warp Lines */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: '2px',
              height: `${Math.random() * 100}px`,
              transform: `rotate(${Math.atan2(mousePos.y - window.innerHeight/2, mousePos.x - window.innerWidth/2)}rad)`,
              opacity: Math.random() * 0.2
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type='range']::-webkit-slider-runnable-track {
          background: #312e81;
          height: 2px;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          background: #818cf8;
          border-radius: 50%;
          margin-top: -5px;
          box-shadow: 0 0 10px #818cf8;
        }
      `}</style>
    </div>
  );
};

export default SingularityTheme;
