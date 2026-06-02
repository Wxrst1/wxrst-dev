
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const InvestigativeHorrorTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nightVision, setNightVision] = useState(false);
  const [battery, setBattery] = useState(84);
  const [glitch, setGlitch] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);

    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    const batteryTimer = setInterval(() => setBattery(prev => Math.max(0, prev - 1)), 60000);
    
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 120);
      }
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(timer);
      clearInterval(batteryTimer);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-black text-white font-['Special_Elite'] p-6 md:p-16 relative overflow-hidden select-none transition-all duration-700 ${nightVision ? 'night-vision' : ''} ${glitch ? 'glitch-active' : ''}`}>
      
      {/* Camcorder CRT Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        <div className="absolute inset-0 scanlines" />
      </div>

      {/* Body Cam HUD */}
      <div className="fixed inset-0 pointer-events-none z-[110] p-8 md:p-12 flex flex-col justify-between border-[2px] border-white/5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 drop-shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]" />
              <span className="text-xl font-bold tracking-widest uppercase">REC</span>
            </div>
            <div className="text-[10px] opacity-60 font-mono">CHANNEL_01 // BODY_CAM_8</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <div className="text-xs font-bold uppercase">{battery}%</div>
              <div className="w-10 h-4 border border-white p-0.5 relative">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${battery}%` }} />
                <div className="absolute -right-1 top-1 w-1 h-2 bg-white" />
              </div>
            </div>
            <div className="text-[10px] font-mono opacity-40">ISO 1600 // 1/60s</div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
             <div className="text-2xl font-bold tracking-tighter tabular-nums">{time}</div>
             <div className="text-[10px] font-mono opacity-40 uppercase">Memory: 24.2GB Left</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              className="pointer-events-auto px-4 py-1 border border-white/20 text-[10px] uppercase font-bold hover:bg-white hover:text-black transition-all"
              onClick={() => setNightVision(!nightVision)}
            >
              Toggle NV: {nightVision ? 'ON' : 'OFF'}
            </button>
            <div className="flex gap-1 h-6 items-end">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-white/40" 
                  style={{ height: `${Math.random() * 100}%`, transition: 'height 0.1s linear' }} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Claustrophobic Flashlight - Only if NOT Night Vision */}
      {!nightVision && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`
          }}
        />
      )}

      {/* Distorted Perspective Container */}
      <div className="relative z-10 max-w-6xl mx-auto py-24 px-4 flex flex-col gap-24 body-cam-perspective">
        
        <header className="flex flex-col gap-4 text-left border-l-4 border-white/10 pl-8">
           <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-2xl">
              Subject_Observation
           </h1>
           <div className="flex gap-4 text-xs font-bold uppercase tracking-widest opacity-40 italic">
             <span>Case_File: #8801-B</span>
             <span>Location: Abandoned_Wing_C</span>
           </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
          {data.map((item, idx) => (
            <div 
              key={item.id}
              className="group relative h-full flex flex-col transition-all duration-500 hover:-translate-y-2"
              style={{ transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 1}deg)` }}
            >
              {/* Evidence Folder Design */}
              <div className="relative bg-[#d1c2a8] text-[#2c2c2c] p-8 flex flex-col shadow-[20px_20px_40px_rgba(0,0,0,0.9)] border-l-[12px] border-[#8b7d6b] overflow-hidden group-hover:bg-[#e2d6c1] transition-colors">
                
                {/* Texture: Coffee Stains / Wear */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black text-[#d1c2a8] px-2 py-0.5 inline-block">Evidence #{item.id}</span>
                    <span className="text-[8px] font-mono opacity-40 italic font-black">{item.timestamp}</span>
                  </div>
                  <div className="w-12 h-12 border-2 border-black/10 rounded flex items-center justify-center grayscale opacity-40 group-hover:opacity-100 transition-opacity">
                    <img 
                      src={`https://picsum.photos/seed/${item.id}/100/100?grayscale`} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                <h3 className="text-3xl font-bold uppercase mb-4 leading-none tracking-tighter border-b border-black/20 pb-2">
                  {item.title}
                </h3>

                <p className="text-sm italic leading-relaxed text-black/70 mb-8 font-serif">
                  "{item.description}"
                </p>

                {item.codeSnippet && (
                  <div className="mt-auto bg-black/5 p-4 border border-black/10 font-mono text-[10px] mb-8 relative group-hover:border-black/30">
                     <div className="absolute -top-3 -left-1 text-[8px] font-black bg-black text-white px-2">DEC_FRAGMENT</div>
                     {item.codeSnippet}
                  </div>
                )}

                <div className="pt-6 border-t border-black/20 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <div className="flex flex-col gap-1">
                      <span className="opacity-40">Observation Status</span>
                      <span className={item.status === 'CRITICAL' ? 'text-red-700 animate-pulse' : 'text-slate-900'}>
                        {item.status}
                      </span>
                   </div>
                   <button className="px-6 py-2 bg-black text-white hover:bg-red-950 transition-colors uppercase tracking-widest font-black text-[9px] shadow-lg">
                     Tag as Evidence
                   </button>
                </div>

                {/* Secret Disturbance (revealed on Night Vision) */}
                {nightVision && (
                  <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 rotate-12 pointer-events-none select-none filter blur-sm">
                    👁️
                  </div>
                )}
              </div>
              
              {/* Polaroid Decoration pinned to the folder */}
              <div className="absolute -top-6 -right-4 w-32 h-32 bg-white p-2 shadow-xl rotate-12 transition-transform group-hover:rotate-6 pointer-events-none">
                <div className="w-full h-3/4 bg-black overflow-hidden relative">
                  <img src={`https://picsum.photos/seed/${item.id}polaroid/300/300?grayscale`} className="w-full h-full object-cover opacity-50 contrast-150" />
                  <div className="absolute inset-0 bg-red-950/10 mix-blend-multiply" />
                </div>
                <div className="text-[8px] font-bold text-black text-center mt-2 font-mono">IMG_REF_{item.id}</div>
              </div>
            </div>
          ))}
        </main>
      </div>

      <style>{`
        .night-vision {
          background-color: #031003 !important;
          filter: sepia(1) hue-rotate(90deg) brightness(0.6) contrast(1.8) !important;
        }
        .night-vision .scanlines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 3px 100%;
          position: absolute;
          inset: 0;
        }
        .scanlines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
          background-size: 100% 4px;
          position: absolute;
          inset: 0;
        }
        .body-cam-perspective {
          perspective: 1500px;
        }
        .glitch-active {
          filter: contrast(2) brightness(1.2) hue-rotate(180deg) !important;
          transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) !important;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default InvestigativeHorrorTheme;
