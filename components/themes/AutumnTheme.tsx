
import React, { useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const LeafCanvas: React.FC = () => {
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
    resize();
    window.addEventListener('resize', resize);

    const leafCount = 30;
    const leaves: any[] = [];
    const colors = ['#8b4513', '#a52a2a', '#d2691e', '#cd853f', '#deb887'];

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 2 + 1,
        r: Math.random() * 360,
        rs: Math.random() * 2 - 1,
        c: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      leaves.forEach(l => {
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate((l.r * Math.PI) / 180);
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        l.y += l.s;
        l.x += Math.sin(l.y / 50) * 1;
        l.r += l.rs;

        if (l.y > canvas.height) {
          l.y = -10;
          l.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 opacity-60" />;
};

const AutumnTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#2c1b0e] text-[#deb887] p-8 md:p-20 relative font-['Playfair_Display'] overflow-hidden">
      <LeafCanvas />
      
      <div className="relative z-20 max-w-4xl mx-auto flex flex-col gap-16">
        <header className="text-center">
          <h1 className="text-7xl italic font-serif text-[#a52a2a]">Harvest Archives</h1>
          <p className="mt-4 text-xs tracking-widest uppercase opacity-60">Gathering the fallen fragments of time</p>
        </header>

        <div className="flex flex-col gap-24">
          {data.map((item, idx) => (
            <div 
              key={item.id} 
              className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 bg-white/5 -rotate-3 scale-105 rounded-sm" />
                <div className="relative bg-[#f4e4bc] text-[#2c1b0e] p-10 shadow-2xl border-l-8 border-[#a52a2a] rotate-1 group hover:rotate-0 transition-transform">
                  <span className="text-[10px] font-black uppercase opacity-40 mb-2 block">{item.timestamp.split('T')[0]} // {item.category}</span>
                  <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                  <p className="text-sm italic leading-relaxed">{item.description}</p>
                  <div className="mt-8 pt-4 border-t border-black/10 flex justify-between items-center text-[10px] font-bold">
                    <span>STATE: {item.status}</span>
                    <button className="text-[#a52a2a] underline decoration-double">Archived Details</button>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left opacity-20 text-9xl select-none">
                {idx % 2 === 0 ? '🍂' : '🍁'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutumnTheme;
