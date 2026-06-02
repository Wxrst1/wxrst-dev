
import React, { useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles: any[] = [];
    const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 3 + 2,
        c: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 360
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r * Math.PI / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();

        p.y += p.s;
        p.r += 5;
        if (p.y > canvas.height) p.y = -10;
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const CarnivalTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#6d28d9] text-[#fbbf24] font-['Orbitron'] p-8 md:p-16 relative overflow-hidden">
      <ConfettiCanvas />
      
      <header className="relative z-10 text-center mb-16">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-pink-500 to-purple-800 animate-bounce">
          Carnaval!
        </h1>
        <p className="mt-4 text-xs font-bold tracking-[0.5em] text-white">RHYTHM OF THE DATA STREAM</p>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {data.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute inset-0 bg-yellow-400 rotate-2 translate-x-2 translate-y-2 group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            <div className="relative bg-white text-purple-900 p-8 border-4 border-purple-900 flex flex-col gap-4 shadow-2xl">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="bg-purple-900 text-white px-2 py-1">FLOAT: {item.id}</span>
                <span className="text-pink-600">★★★★★</span>
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b-4 border-yellow-400 pb-2">
                {item.title}
              </h3>
              <p className="text-sm font-bold font-sans opacity-80 leading-relaxed italic">
                "{item.description}"
              </p>
              <button className="mt-4 py-3 bg-purple-900 text-white font-black uppercase tracking-widest hover:bg-pink-600 transition-colors">
                JOIN PARADE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarnivalTheme;
