
import React, { useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const PetalCanvas: React.FC = () => {
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

    const petals: any[] = [];
    for (let i = 0; i < 40; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 1 + 1,
        r: Math.random() * 360,
        rs: Math.random() * 2 - 1,
        sx: Math.random() * 1 - 0.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r * Math.PI / 180);
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.y += p.s;
        p.x += p.sx;
        p.r += p.rs;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const ValentineTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#fff5f5] text-[#ff6b6b] font-['Playfair_Display'] p-8 md:p-16 relative overflow-hidden">
      <PetalCanvas />
      
      {/* Background Bokeh */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-red-400 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-16">
        <header className="text-center">
          <h1 className="text-7xl font-serif italic mb-2">Love Letters</h1>
          <p className="text-sm tracking-widest uppercase opacity-60">Correspondence from the Heart</p>
        </header>

        <div className="flex flex-col gap-12">
          {data.map((item, idx) => (
            <div key={item.id} className="relative group">
              <div className="absolute inset-0 bg-red-100 -rotate-1 rounded-sm shadow-xl" />
              <div className="relative bg-white border border-red-100 p-10 flex flex-col md:flex-row gap-8 items-center rotate-1 group-hover:rotate-0 transition-transform">
                <div className="w-24 h-24 bg-red-50 flex items-center justify-center text-5xl rounded-full shrink-0 animate-pulse">
                  💌
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold text-red-300">Section: {item.category}</span>
                    <span className="text-xs italic text-red-200">Dearest Reader...</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                  <p className="text-base leading-relaxed italic text-gray-600 opacity-90">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValentineTheme;
