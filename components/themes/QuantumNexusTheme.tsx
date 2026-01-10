
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentItem } from '../../types';

enum SubDimension {
  NEON = 'NEON',
  OCEAN = 'OCEAN',
  COSMIC = 'COSMIC',
  GLITCH = 'GLITCH',
  CRYSTAL = 'CRYSTAL'
}

const DIMENSION_CONFIG = {
  [SubDimension.NEON]: { name: 'Cyberpunk Neon', icon: '🌃', color: '#ff00ff', bg: 'bg-[#050505]' },
  [SubDimension.OCEAN]: { name: 'Bioluminescent', icon: '🌊', color: '#00ffff', bg: 'bg-[#001219]' },
  [SubDimension.COSMIC]: { name: 'Cosmic Temple', icon: '🕉️', color: '#d4af37', bg: 'bg-[#0f0714]' },
  [SubDimension.GLITCH]: { name: 'Glitch Void', icon: '👾', color: '#ff3333', bg: 'bg-[#000000]' },
  [SubDimension.CRYSTAL]: { name: 'Prismatic Dream', icon: '💎', color: '#ffffff', bg: 'bg-[#f0f9ff]' },
};

const QuantumCanvas: React.FC<{ dimension: SubDimension }> = ({ dimension }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const init = () => {
      particles = [];
      const count = dimension === SubDimension.OCEAN ? 40 : 100;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (dimension === SubDimension.GLITCH ? 5 : 1),
          vy: (Math.random() - 0.5) * (dimension === SubDimension.GLITCH ? 5 : 1),
          size: Math.random() * (dimension === SubDimension.OCEAN ? 20 : 3) + 1,
          opacity: Math.random() * 0.5 + 0.1,
          color: DIMENSION_CONFIG[dimension].color
        });
      }
    };
    init();

    const draw = () => {
      ctx.fillStyle = dimension === SubDimension.CRYSTAL ? 'rgba(240, 249, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (dimension === SubDimension.COSMIC) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.size * 5, p.y + p.size * 5);
          ctx.strokeStyle = p.color;
          ctx.stroke();
        } else if (dimension === SubDimension.CRYSTAL) {
          ctx.beginPath();
          ctx.rect(p.x, p.y, p.size * 10, p.size * 10);
          ctx.strokeStyle = p.color;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        if (dimension === SubDimension.GLITCH && Math.random() > 0.99) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, [dimension]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const QuantumNexusTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [dimension, setDimension] = useState<SubDimension>(SubDimension.NEON);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleDimensionShift = (dim: SubDimension) => {
    if (dim === dimension) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setDimension(dim);
      setIsTransitioning(false);
    }, 600);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 overflow-x-hidden select-none ${DIMENSION_CONFIG[dimension].bg} ${dimension === SubDimension.CRYSTAL ? 'text-blue-900' : 'text-white'}`}
      onMouseMove={handleMouseMove}
    >
      <QuantumCanvas dimension={dimension} />
      
      {/* Reality Barrier Overlay */}
      <div className={`fixed inset-0 pointer-events-none z-[60] transition-all duration-700 ${isTransitioning ? 'bg-white opacity-100 backdrop-blur-3xl' : 'opacity-0'}`} />
      
      {/* Dimension Shifter HUD */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex gap-2 bg-black/40 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl">
        {Object.values(SubDimension).map(dim => (
          <button
            key={dim}
            onClick={() => handleDimensionShift(dim)}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-500
              ${dimension === dim ? 'scale-125 bg-white text-black shadow-[0_0_20px_white]' : 'opacity-40 hover:opacity-100 hover:scale-110'}
            `}
            title={DIMENSION_CONFIG[dim].name}
          >
            {DIMENSION_CONFIG[dim].icon}
          </button>
        ))}
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto pt-32 pb-40 px-6 transition-all duration-1000 ${isTransitioning ? 'scale-90 opacity-0 blur-lg' : 'scale-100 opacity-100 blur-0'}`}>
        
        <header className="text-center mb-24 relative">
          <div className="inline-block relative">
            {/* Holographic Header Effect */}
            <div className={`absolute -inset-10 blur-[100px] opacity-20 animate-pulse transition-colors duration-1000`} style={{ backgroundColor: DIMENSION_CONFIG[dimension].color }} />
            
            <h1 className={`text-6xl md:text-9xl font-black uppercase italic tracking-tighter transition-all duration-700 ${
              dimension === SubDimension.COSMIC ? "font-['UnifrakturMaguntia']" : 
              dimension === SubDimension.GLITCH ? "font-mono" : "font-['Orbitron']"
            }`}>
              {dimension === SubDimension.GLITCH ? 'QU4NTUM_NX' : 'Quantum Nexus'}
            </h1>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold tracking-[0.5em] opacity-40 uppercase">Dimensional Layer: {DIMENSION_CONFIG[dimension].name}</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((item, idx) => {
            // Dimensional Warping styles
            const warpX = (mousePos.x - window.innerWidth / 2) * 0.01;
            const warpY = (mousePos.y - window.innerHeight / 2) * 0.01;

            return (
              <div 
                key={item.id}
                className={`group relative h-[500px] transition-all duration-500 ${dimension === SubDimension.OCEAN ? 'animate-float' : ''}`}
                style={{
                  transform: dimension === SubDimension.COSMIC 
                    ? `perspective(1000px) rotateY(${warpX}deg) rotateX(${-warpY}deg)`
                    : 'none'
                }}
              >
                {/* Dimensional Wrapper */}
                <div className={`
                  relative h-full p-8 flex flex-col transition-all duration-700 shadow-2xl border backdrop-blur-md overflow-hidden
                  ${dimension === SubDimension.NEON ? 'bg-white/5 border-fuchsia-500/30 hover:shadow-[0_0_30px_#ff00ff22]' : ''}
                  ${dimension === SubDimension.OCEAN ? 'bg-cyan-900/10 border-cyan-400/20 rounded-[40px_10px_40px_10px]' : ''}
                  ${dimension === SubDimension.COSMIC ? 'bg-[#1a0b1e]/60 border-[#d4af37]/20 border-double border-4' : ''}
                  ${dimension === SubDimension.GLITCH ? 'bg-red-900/10 border-red-500/10 font-mono italic skew-x-[-2deg] skew-y-[1deg]' : ''}
                  ${dimension === SubDimension.CRYSTAL ? 'bg-white/60 border-blue-100 text-blue-900 shadow-xl' : ''}
                `}>
                  
                  {/* Glitch Overlay for GLITCH dimension */}
                  {dimension === SubDimension.GLITCH && (
                    <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-10 animate-cctv-noise" />
                  )}

                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-40`}>FRAG_{item.id}</span>
                      <span className="text-[8px] opacity-20">{item.timestamp}</span>
                    </div>
                    <div className={`text-2xl transition-transform duration-500 group-hover:scale-150`}>
                      {dimension === SubDimension.OCEAN ? '🪼' : 
                       dimension === SubDimension.COSMIC ? '☸️' : 
                       dimension === SubDimension.CRYSTAL ? '🔮' : '⚡'}
                    </div>
                  </div>

                  <h3 className={`text-3xl font-black uppercase tracking-tighter mb-4 leading-none transition-all ${
                    dimension === SubDimension.CRYSTAL ? 'text-blue-900' : 'text-white'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-sm italic leading-relaxed mb-8 transition-opacity duration-700 ${
                    dimension === SubDimension.GLITCH ? 'opacity-40 group-hover:opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`}>
                    "{item.description}"
                  </p>

                  {item.codeSnippet && (
                    <div className={`mt-auto p-4 font-mono text-[10px] mb-6 relative transition-colors ${
                      dimension === SubDimension.CRYSTAL ? 'bg-blue-50 border-blue-200' : 'bg-black/40 border-white/5'
                    } border`}>
                      {item.codeSnippet}
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <div className="flex flex-col gap-1">
                      <span className="opacity-40">Dimensional Pulse</span>
                      <span className={item.status === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-green-500'}>
                        {item.status}
                      </span>
                    </div>
                    <button className={`
                      px-6 py-2 transition-all duration-300 relative group/btn
                      ${dimension === SubDimension.CRYSTAL ? 'bg-blue-600 text-white rounded-lg' : 'bg-white/10 border border-white/20'}
                    `}>
                      Shift Fragment
                    </button>
                  </div>

                  {/* Dimension-specific Refractions */}
                  {dimension === SubDimension.CRYSTAL && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-blue-500/5 to-white/30 rotate-45 scale-150" />
                  )}
                </div>
              </div>
            );
          })}
        </main>

        <footer className="mt-40 text-center pb-40">
           <div className="inline-flex flex-col items-center gap-4">
              <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center animate-spin-slow transition-colors`} style={{ borderColor: DIMENSION_CONFIG[dimension].color }}>
                 <span className="text-xl">🕳️</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[1em] opacity-20">Singularity Synchronized</p>
           </div>
        </footer>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QuantumNexusTheme;
