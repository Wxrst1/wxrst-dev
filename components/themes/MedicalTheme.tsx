
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const BloodCellCanvas: React.FC = () => {
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

    const particles: any[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 5,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        type: Math.random() > 0.8 ? 'white' : 'red'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.type === 'red' ? `rgba(239, 68, 68, ${p.opacity})` : `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += Math.sin(p.y / 100) * 0.5;
        if (p.y < -p.size) p.y = canvas.height + p.size;
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />;
};

const HeartSVG: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => {
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-1000 transform-gpu ${isOpen ? 'scale-[2.5] md:scale-[3.5]' : 'scale-100 hover:scale-110'}`}
      onClick={onClick}
    >
      <div className={`relative flex items-center justify-center animate-heart-beat ${isOpen ? 'animate-none' : ''}`}>
        {/* Left Half */}
        <div className={`transition-all duration-1000 transform-gpu ${isOpen ? '-translate-x-12 -rotate-12 opacity-0' : 'translate-x-0 rotate-0'}`}>
          <svg width="120" height="150" viewBox="0 0 120 150">
            <path d="M120 150 C 120 150, 0 120, 0 60 C 0 30, 30 0, 60 0 C 90 0, 120 30, 120 60 Z" fill="#ef4444" />
            <path d="M120 60 C 120 60, 40 50, 40 30" fill="none" stroke="white" strokeWidth="2" opacity="0.2" />
          </svg>
        </div>
        {/* Right Half */}
        <div className={`transition-all duration-1000 transform-gpu ${isOpen ? 'translate-x-12 rotate-12 opacity-0' : 'translate-x-0 rotate-0'}`}>
          <svg width="120" height="150" viewBox="0 0 120 150">
            <path d="M0 150 C 0 150, 120 120, 120 60 C 120 30, 90 0, 60 0 C 30 0, 0 30, 0 60 Z" fill="#dc2626" />
            <path d="M0 60 C 0 60, 80 50, 80 30" fill="none" stroke="white" strokeWidth="2" opacity="0.2" />
          </svg>
        </div>
        
        {/* Internal Core Glowing revealed when open */}
        {isOpen && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 bg-cyan-400 rounded-full blur-2xl opacity-60" />
            <div className="absolute text-[8px] font-black text-cyan-400 uppercase tracking-widest text-center">
              CORE_SEQ_STABLE<br/>98.4%
            </div>
          </div>
        )}
      </div>
      {!isOpen && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
          Click to Incise
        </div>
      )}
    </div>
  );
};

const MedicalTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans p-4 md:p-12 relative overflow-hidden">
      <BloodCellCanvas />
      
      {/* HUD Overlays */}
      <div className="fixed inset-0 pointer-events-none z-10 border-[16px] border-slate-200/20" />
      <div className="fixed top-8 left-8 z-20 flex flex-col gap-1">
        <div className="text-[10px] font-black text-cyan-600 uppercase tracking-tighter">System.VitalManager</div>
        <div className="text-2xl font-black text-slate-900 leading-none">VITAL_SCAN v4.2</div>
      </div>
      
      <div className="fixed top-8 right-8 z-20 text-right">
        <div className="text-[10px] font-black text-slate-400 uppercase">Hospital Proxy</div>
        <div className="text-xs font-mono font-bold text-red-600">ALERT: {isOpen ? 'SURGERY_IN_PROGRESS' : 'MONITORING'}</div>
      </div>

      <main className="relative z-20 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Central Anatomical Focus */}
        <div className={`transition-all duration-1000 ${isOpen ? 'mb-20' : 'mb-0'}`}>
          <HeartSVG isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </div>

        {/* Content Portal revealed after incision */}
        <div className={`w-full max-w-6xl transition-all duration-1000 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-10 invisible'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-white/80 backdrop-blur-xl border border-slate-200 p-6 flex flex-col gap-4 shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/50 transition-all duration-500"
                onMouseEnter={() => setActiveItem(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded">DNA_{item.id}</span>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <h3 className="text-lg font-black uppercase text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 italic">
                  "{item.description}"
                </p>

                <div className="mt-auto pt-4 flex justify-between items-end">
                   <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Sequencing</span>
                      <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-2/3 group-hover:w-full transition-all duration-1000" />
                      </div>
                   </div>
                   <button className="text-[9px] font-black text-cyan-600 uppercase hover:text-cyan-400 transition-colors">
                     Extract Biometry
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* EKG Monitor Footer */}
      <footer className="fixed bottom-0 left-0 w-full h-24 bg-slate-900 z-50 overflow-hidden border-t-4 border-cyan-500/30">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M 0 50 L 50 50 L 60 20 L 70 80 L 80 50 L 150 50 L 160 10 L 170 90 L 180 50 L 300 50 L 310 30 L 320 70 L 330 50 L 500 50 L 510 20 L 520 80 L 530 50 L 1000 50"
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="2" 
            className="animate-ekg-scroll"
            style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-between px-12 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-cyan-500/50 uppercase">Heart Rate</span>
            <span className="text-3xl font-black text-cyan-400 font-mono">72 <span className="text-xs">BPM</span></span>
          </div>
          <div className="flex gap-10">
            {['Blood', 'Temp', 'O2'].map(stat => (
              <div key={stat} className="flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-500 uppercase">{stat}</span>
                <span className="text-lg font-black text-slate-400 font-mono">--.-</span>
              </div>
            ))}
          </div>
        </div>
      </footer >

      <style>{`
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          5% { transform: scale(1.15); }
          10% { transform: scale(1); }
          15% { transform: scale(1.1); }
          20% { transform: scale(1); }
        }
        @keyframes ekg-scroll {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .animate-heart-beat {
          animation: heart-beat 1.5s ease-in-out infinite;
        }
        .animate-ekg-scroll {
          animation: ekg-scroll 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MedicalTheme;
