
import React, { useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const TacticalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Init smoke particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const draw = () => {
      ctx.fillStyle = '#1a1c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw tactical grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw radar sweep
      ctx.fillStyle = 'rgba(100, 120, 80, 0.1)';
      ctx.fillRect(0, scanY, canvas.width, 100);
      scanY = (scanY + 2) % canvas.height;

      // Draw smoke/embers
      ctx.fillStyle = '#ff4500';
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.05) * 0.5;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1.0;

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const WarTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  return (
    <div className="min-h-screen bg-[#1a1c14] text-[#d2b48c] p-8 md:p-16 relative overflow-hidden font-mono">
      <TacticalBackground />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">
        <header className="border-b-4 border-[#3d402e] pb-10 flex flex-col items-center gap-10 text-center">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="flex gap-2 bg-[#0a0b08] p-4 border border-[#3d402e] shadow-xl h-fit">
              <div className="w-8 h-8 bg-red-900 animate-pulse border border-red-500" title="Threat High" />
              <div className="w-8 h-8 bg-[#3d402e]" />
              <div className="w-8 h-8 bg-[#3d402e]" />
            </div>
            <div className="shrink-0 scale-100 md:scale-110 hover:brightness-125 transition-all">
              <ThemedProfile theme="WAR" profile={profile} onEdit={onEditProfile} />
            </div>
          </div>

          <div className="flex flex-col gap-1 items-center">
            <h1 className="text-5xl md:text-7xl font-['Black_Ops_One'] uppercase text-orange-600 tracking-tighter drop-shadow-lg leading-none">
              CENTCOM Intelligence
            </h1>
            <div className="mt-2 flex gap-6 text-[11px] uppercase font-bold text-[#647850]">
              <span>Uplink: Secure</span>
              <span>Coordinates: 38.8977° N</span>
              <span className="animate-pulse text-red-500">DEFCON 2</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick(item.id)}
              className="relative group cursor-crosshair block"
            >
              {/* Target Crosshair Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-600 group-hover:w-full group-hover:h-full transition-all duration-300" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-600 group-hover:w-full group-hover:h-full transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-600 group-hover:w-full group-hover:h-full transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-600 group-hover:w-full group-hover:h-full transition-all duration-300" />

              <div className="h-full bg-[#2a2d21] p-8 border border-[#3d402e] shadow-2xl relative overflow-hidden group-hover:bg-[#343829] transition-colors flex flex-col">
                {/* Dossier Aesthetic */}
                <div className="absolute top-0 right-0 px-4 py-1 bg-black text-[10px] font-bold tracking-[0.2em] border-l border-b border-[#3d402e] text-orange-500 uppercase">
                  Classified
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full ${item.status === 'CRITICAL' ? 'bg-red-600 animate-ping' :
                    item.status === 'STABLE' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#647850]">File {item.id}</span>
                </div>

                <h3 className="text-2xl font-['Black_Ops_One'] uppercase mb-4 text-[#eee]">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#d2b48c]/80 italic mb-6 border-l-2 border-orange-600/30 pl-4">
                  "{item.description}"
                </p>

                <div className="mt-auto flex justify-between items-center text-[10px] uppercase font-bold pt-4 border-t border-[#3d402e]">
                  <span>Unit: {item.category}</span>
                  <div className="px-3 py-1 bg-orange-700 text-black group-hover:bg-orange-500 transition-colors">Authorize Scan</div>
                </div>

                {/* Diagonal TOP SECRET Stamp */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-45deg] select-none text-8xl font-black">
                  SECRET
                </div>
              </div>
            </a>
          ))}
        </main>

        {/* Integrated Guestbook Section */}
        <div className="mt-32 border-t-2 border-[#3d402e] pt-20">
          <h2 className="text-4xl font-['Black_Ops_One'] text-orange-600 mb-12 flex items-center gap-6 uppercase">
            Comms Channel // Open
          </h2>
          <div className="bg-[#0a0b08] border border-[#3d402e] p-10 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-600/20 animate-pulse" />
            <Guestbook isInline />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default WarTheme;
