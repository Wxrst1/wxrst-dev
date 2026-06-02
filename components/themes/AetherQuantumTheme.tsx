
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const CinematicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const count = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.8 ? '#ffcc33' : '#00ffff'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const AetherQuantumTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(winScroll / height);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020204] text-white font-['Orbitron'] p-8 md:p-16 relative overflow-x-hidden">
      <CinematicParticles />

      {/* Dynamic Lens Flare */}
      <div
        className="fixed pointer-events-none z-50 w-screen h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-md opacity-20"
        style={{ top: mousePos.y, transition: 'top 0.2s ease-out' }}
      />
      <div
        className="fixed pointer-events-none z-50 w-[2px] h-screen bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent blur-md opacity-10"
        style={{ left: mousePos.x, transition: 'left 0.2s ease-out' }}
      />

      {/* Parallax Depth Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_70%)] opacity-40 scale-150 transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px) rotate(${scrollProgress * 20}deg)` }}
        />
        <svg className="absolute top-1/4 left-1/4 w-[600px] h-[600px] blur-[150px] opacity-20 animate-pulse fill-indigo-900">
          <circle cx="300" cy="300" r="200" />
        </svg>
        <svg className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] blur-[180px] opacity-10 animate-pulse fill-cyan-900">
          <circle cx="400" cy="400" r="300" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-24">
        <header className="flex flex-col items-center pt-20 gap-16 text-center">
          <div className="shrink-0 scale-90 md:scale-110 hover:scale-125 transition-transform duration-500">
            <ThemedProfile theme="AETHER_QUANTUM" profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="inline-block relative group">
            <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-300 to-fuchsia-600 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              {profile.name.split(' ')[0]}_Quantum
            </h1>
            <div className="flex justify-center gap-12 mt-6 px-2">
              <span className="text-[10px] font-bold tracking-[0.8em] text-cyan-500 uppercase">Resonance Enabled</span>
              <span className="text-[10px] font-bold tracking-[0.8em] text-fuchsia-500 uppercase">Sync: {Math.floor(Math.random() * 10) + 90}%</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 perspective-2000">
          {data.map((item, idx) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick(item.id)}
              className="group relative h-[450px] transition-all duration-700 hover:z-50 block"
              style={{
                transform: `translateY(${Math.sin(scrollProgress * 10 + idx) * 20}px) rotateY(${(mousePos.x / window.innerWidth - 0.5) * 10}deg) rotateX(${(mousePos.y / window.innerHeight - 0.5) * -10}deg)`
              }}
            >
              {/* The "Holographic" Card */}
              <div className="relative w-full h-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-cyan-500/50 hover:bg-white/[0.08] overflow-hidden">

                {/* Internal HUD Elements */}
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-hud-line" />
                </div>

                {/* Animated Scanning Bar */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-1/4 -translate-y-full group-hover:animate-scan-fast" />

                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black tracking-widest text-cyan-400">CORE_SEQ_{item.id}</span>
                    <span className="text-[8px] opacity-40 font-mono tracking-tighter uppercase">{item.timestamp}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs text-white/20 group-hover:text-cyan-400 group-hover:border-cyan-400 transition-all">
                    {idx + 1}
                  </div>
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-cyan-300 transition-colors leading-none">
                  {item.title}
                </h3>

                <p className="text-sm italic leading-relaxed text-white/50 mb-8 flex-1 group-hover:text-white/80 transition-colors">
                  "{item.description}"
                </p>

                {item.codeSnippet && (
                  <div className="bg-black/40 p-3 border border-white/5 font-mono text-[9px] mb-6 relative overflow-hidden group-hover:border-cyan-500/20">
                    <div className="absolute top-0 right-0 w-1 h-1 bg-cyan-500 animate-pulse" />
                    {item.codeSnippet}
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <div className="flex flex-col gap-1">
                    <span className="opacity-30">Status</span>
                    <span className={item.status === 'CRITICAL' ? 'text-fuchsia-500 animate-pulse' : 'text-cyan-500'}>
                      {item.status}
                    </span>
                  </div>
                  <div className="relative px-6 py-2 overflow-hidden group/btn">
                    <div className="absolute inset-0 bg-white/5 group-hover/btn:bg-cyan-500 transition-colors duration-500 skew-x-[-20deg]" />
                    <span className="relative z-10 text-white group-hover/btn:text-black transition-colors">Observe</span>
                  </div>
                </div>
              </div>

              {/* Depth Shadow / Lighting */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/0 via-transparent to-fuchsia-500/0 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl pointer-events-none" />
            </a>
          ))}
        </main>

        {/* Integrated Guestbook Section */}
        <div className="mt-40 border-t border-white/5 pt-24">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12 flex items-center gap-6">
            <span className="w-12 h-[2px] bg-cyan-500" />
            Quantum_Transmissions
          </h2>
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 shadow-2xl h-[600px] relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-20" />
            <Guestbook isInline />
          </div>
        </div>

        <footer className="mt-40 text-center pb-40 relative">
          <div className="inline-flex flex-col items-center gap-6">
            <div className="w-px h-24 bg-gradient-to-b from-cyan-500 to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20">Aether Architecture Registered</p>
            <div className="flex gap-4 opacity-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-12 h-[1px] bg-white" />
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes scan-fast { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(400%); opacity: 0; } }
        @keyframes hud-line { 0%, 100% { transform: scaleX(0.5); opacity: 0.2; } 50% { transform: scaleX(1); opacity: 0.8; } }
        .animate-scan-fast { animation: scan-fast 2s ease-in-out infinite; }
        .animate-hud-line { animation: hud-line 3s ease-in-out infinite; }
        .perspective-2000 { perspective: 2000px; }
      `}</style>
    </div>
  );
};

export default AetherQuantumTheme;
