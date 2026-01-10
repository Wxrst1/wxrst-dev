
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const FloatingEmbers: React.FC = () => {
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

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#f59e0b' : '#7c3aed'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.001;

        if (p.y < -10 || p.opacity <= 0) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.5 + 0.2;
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const AlchemistTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [transmutingId, setTransmutingId] = useState<string | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleTransmute = (id: string) => {
    setTransmutingId(id);
    setTimeout(() => setTransmutingId(null), 1000);
  };

  return (
    <div className="min-h-screen bg-[#1a0f00] text-[#e2d1a7] font-serif p-8 md:p-16 relative overflow-hidden cursor-none">
      <FloatingEmbers />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#3b0764_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#451a03] blur-[150px] rounded-full" />
      </div>

      {/* Magic Cursor */}
      <div
        className="fixed pointer-events-none z-[100] transition-transform duration-75"
        style={{ left: mousePos.x, top: mousePos.y }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 border border-purple-500/50 rounded-full animate-spin flex items-center justify-center">
            <div className="w-8 h-8 border border-yellow-500/50 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_15px_white]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-20">
        <header className="flex flex-col items-center gap-16 pt-10 text-center">
          <div className="shrink-0 scale-95 md:scale-110 hover:rotate-1 transition-transform">
            <ThemedProfile theme="ALCHEMIST" profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-purple-600/10 blur-[80px] rounded-full animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-['UnifrakturMaguntia'] text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] tracking-tighter italic">
              The Alchemist's Study
            </h1>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[10px] font-black uppercase tracking-[1em] text-purple-400">Transmuting Data to Gold</span>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.map((item, idx) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onLinkClick(item.id);
                handleTransmute(item.id);
              }}
              className={`
                group relative min-h-[450px] transition-all duration-700 block
                ${transmutingId === item.id ? 'scale-95 brightness-150 rotate-3' : 'hover:-translate-y-2'}
              `}
            >
              {/* Parchment Scroll Card */}
              <div className={`
                relative h-full bg-[#fdf2d9] text-[#2c1b0e] p-8 flex flex-col shadow-[15px_15px_60px_-15px_rgba(0,0,0,0.9)] 
                border-x-[15px] border-[#c2a679] overflow-hidden transition-colors duration-1000
                ${transmutingId === item.id ? 'bg-yellow-400 border-[#d4af37]' : ''}
              `}>
                {/* Scroll Caps */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-[#8b4513] shadow-lg" />
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#8b4513] shadow-lg" />

                {/* Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8b4513]">ESSENCE_{item.id}</span>
                    <span className="text-[8px] opacity-40 italic font-mono uppercase">{item.category}</span>
                  </div>
                  <div className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity animate-bounce">🧪</div>
                </div>

                <h3 className="text-3xl font-['Pirata_One'] mb-4 leading-none text-[#4c1d95] group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm italic leading-relaxed text-[#2c1b0e]/80 mb-8 font-serif">
                  "{item.description}"
                </p>

                {item.codeSnippet && (
                  <div className="mt-auto bg-[#eaddc2] p-4 border-2 border-dashed border-[#8b4513]/20 font-mono text-[10px] mb-6 relative group-hover:border-purple-500/30">
                    <div className="absolute -top-2 -left-2 text-lg">🖋️</div>
                    {item.codeSnippet}
                  </div>
                )}

                <div className="pt-6 border-t border-[#8b4513]/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <div className="flex flex-col gap-1">
                    <span className="opacity-40">Stability</span>
                    <span className={item.status === 'CRITICAL' ? 'text-red-700 animate-pulse' : 'text-green-800'}>
                      {item.status}
                    </span>
                  </div>
                  <div className="relative px-6 py-2 overflow-hidden group/btn text-white">
                    <div className="absolute inset-0 bg-[#4c1d95] group-hover/btn:bg-yellow-600 transition-colors" />
                    <span className="relative z-10">TRANSMUTE</span>
                  </div>
                </div>

                {/* Magical Runes (revealed on hover) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                  <div className="text-8xl font-serif text-purple-900 rotate-45">⌘ ☤ ⚖ ⚛</div>
                </div>
              </div>
            </a>
          ))}
        </main>

        {/* Integrated Guestbook Section */}
        <div className="mt-20 border-t border-[#d4af37]/20 pt-20">
          <h2 className="text-4xl font-['UnifrakturMaguntia'] text-[#d4af37] mb-12 flex items-center gap-6">
            <span className="text-3xl animate-pulse">🔮</span>
            Whispers from the Void
          </h2>
          <div className="bg-[#1a0f00]/80 border border-purple-500/10 p-10 backdrop-blur-3xl shadow-[0_0_100px_rgba(76,29,149,0.1)]">
            <Guestbook isInline />
          </div>
        </div>

        <footer className="mt-20 text-center pb-40">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-2 border-[#d4af37]/30 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <span className="text-2xl text-[#d4af37]/50">⚖</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[1em] text-[#d4af37]/30">The Great Work Continues</p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes magic-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AlchemistTheme;
