
import React, { useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const FireworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let fw: any[] = [];
    let pt: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number; y: number; vx: number; vy: number; alpha: number; color: string;
      constructor(x: number, y: number, color: string) {
        this.x = x; this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += 0.05; // gravity
        this.alpha -= 0.01;
      }
      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const launch = () => {
      const x = Math.random() * canvas.width;
      const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      const y = canvas.height;
      fw.push({ x, y, ty: Math.random() * (canvas.height * 0.5), color });
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) launch();

      fw = fw.filter(f => {
        f.y -= 8;
        ctx.fillStyle = f.color;
        ctx.beginPath(); ctx.arc(f.x, f.y, 3, 0, Math.PI * 2); ctx.fill();
        if (f.y <= f.ty) {
          for (let i = 0; i < 40; i++) pt.push(new Particle(f.x, f.y, f.color));
          return false;
        }
        return true;
      });

      pt = pt.filter(p => {
        p.update(); p.draw();
        return p.alpha > 0;
      });

      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const NewYearTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-black text-white font-['Orbitron'] p-8 md:p-16 relative overflow-hidden">
      <FireworkCanvas />
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-16">
        <header className="text-center">
          <h1 className="text-7xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-400 drop-shadow-2xl animate-pulse" style={{ backgroundImage: 'linear-gradient(45deg, #d4af37, #fff, #d4af37)' }}>
            CHRONOS 2025
          </h1>
          <p className="mt-4 text-xs font-bold tracking-[0.6em] text-yellow-500 uppercase">Reseting the Universal Epoch</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <div key={item.id} className="relative group overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:border-yellow-500 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase">ID: {item.id}</span>
                <span className="text-xs font-black">STABLE</span>
              </div>

              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed italic">{item.description}</p>
              
              <div className="mt-8 flex items-end justify-between">
                <div className="text-[40px] font-black opacity-10 leading-none">00</div>
                <button className="px-4 py-1 border border-yellow-500 text-yellow-500 text-[10px] font-bold uppercase hover:bg-yellow-500 hover:text-black transition-all">Launch Event</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewYearTheme;
