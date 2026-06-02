
import React, { useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const SnowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; r: number; d: number }[] = [];
    const mp = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < mp; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 1,
        d: Math.random() * mp
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
    };

    let angle = 0;
    const update = () => {
      angle += 0.01;
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;
        if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
          if (i % 3 > 0) {
            particles[i] = { x: Math.random() * canvas.width, y: -10, r: p.r, d: p.d };
          } else {
            if (Math.sin(angle) > 0) {
              particles[i] = { x: -5, y: Math.random() * canvas.height, r: p.r, d: p.d };
            } else {
              particles[i] = { x: canvas.width + 5, y: Math.random() * canvas.height, r: p.r, d: p.d };
            }
          }
        }
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

const ChristmasTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#0a2e12] text-white p-8 md:p-16 relative overflow-hidden font-serif">
      <SnowCanvas />
      
      {/* Fireplace Background Element */}
      <div className="fixed bottom-0 left-0 w-full h-48 bg-gradient-to-t from-orange-900/40 to-transparent pointer-events-none" />
      
      <header className="relative z-10 text-center mb-16">
        <h1 className="text-6xl font-bold text-red-600 drop-shadow-[0_4px_4px_rgba(255,255,255,0.2)]">
          Winter Chronicles
        </h1>
        <div className="mt-4 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`w-4 h-4 rounded-full ${i % 2 === 0 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-yellow-400 shadow-[0_0_10px_yellow] animate-pulse'}`} />
          ))}
        </div>
      </header>

      <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {data.map((item) => (
          <div key={item.id} className="group relative">
            {/* The "Gift" Card */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-600 rotate-45 z-20 shadow-xl border-2 border-yellow-500" />
            <div className="relative bg-white text-gray-900 p-8 rounded-sm shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-1 border-t-8 border-red-700">
              {/* Ribbon Overlay */}
              <div className="absolute inset-0 border-x-[20px] border-red-700/10 pointer-events-none" />
              <div className="absolute inset-0 border-y-[20px] border-red-700/10 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-700">{item.category}</span>
                <span className="text-xs text-green-800 font-bold">★ {item.status}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 border-b-2 border-red-100 pb-2">{item.title}</h3>
              <p className="text-sm italic text-gray-600 leading-relaxed mb-6">{item.description}</p>
              
              <button className="w-full py-2 bg-red-700 text-white font-bold uppercase tracking-tighter hover:bg-green-700 transition-colors">
                Unwrap Details
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Decorative Corner Trees */}
      <div className="fixed -bottom-10 -left-10 text-8xl opacity-20 pointer-events-none">🎄</div>
      <div className="fixed -bottom-10 -right-10 text-8xl opacity-20 pointer-events-none">🎄</div>
    </div>
  );
};

export default ChristmasTheme;
