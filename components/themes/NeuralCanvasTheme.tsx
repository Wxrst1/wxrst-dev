
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentItem } from '../../types';

enum Mood {
  ZEN = 'ZEN',
  FRENZY = 'FRENZY',
  CURIOUS = 'CURIOUS',
  IDLE = 'IDLE'
}

enum RealityLayer {
  MASK = 'MASK',      // Professional
  PROCESS = 'PROCESS', // Wireframe/Sketch
  THOUGHT = 'THOUGHT'  // Abstract Neural
}

const NeuralCanvasTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [mood, setMood] = useState<Mood>(Mood.IDLE);
  const [layer, setLayer] = useState<RealityLayer>(RealityLayer.MASK);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<number | null>(null);

  // Ethereal Ghost Cursors
  const ghostCursors = useRef([...Array(3)].map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2
  }))).current;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const v = Math.sqrt(dx * dx + dy * dy);
      
      setVelocity(v);
      setMousePos({ x: e.clientX, y: e.clientY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (v > 50) setMood(Mood.FRENZY);
      else if (v > 10) setMood(Mood.CURIOUS);
      else setMood(Mood.ZEN);

      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setMood(Mood.IDLE), 3000);
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  // Generative Canvas Engine
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

    const draw = () => {
      // Create trailing paint effect
      ctx.fillStyle = mood === Mood.IDLE ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Ghost Cursors
      ghostCursors.forEach(gc => {
        gc.x += gc.vx;
        gc.y += gc.vy;
        if (gc.x < 0 || gc.x > canvas.width) gc.vx *= -1;
        if (gc.y < 0 || gc.y > canvas.height) gc.vy *= -1;

        ctx.beginPath();
        ctx.arc(gc.x, gc.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = layer === RealityLayer.THOUGHT ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,255,0.02)';
        ctx.fill();
      });

      // Mood-Based Generation
      if (mood !== Mood.IDLE) {
        ctx.beginPath();
        ctx.lineWidth = mood === Mood.FRENZY ? 40 : 10;
        ctx.strokeStyle = mood === Mood.FRENZY 
          ? `rgba(255, 50, 50, ${velocity / 100})` 
          : mood === Mood.CURIOUS 
            ? 'rgba(0, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.05)';
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.moveTo(lastMousePos.current.x, lastMousePos.current.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
      }

      // Layer 3: Neural thought patterns
      if (layer === RealityLayer.THOUGHT) {
        ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener('resize', resize);
  }, [mood, mousePos, layer, velocity]);

  return (
    <div className={`min-h-screen transition-colors duration-1000 bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500/30`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Reality Layer Control */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex gap-1 bg-white/5 backdrop-blur-3xl p-1 rounded-full border border-white/10">
        {(Object.values(RealityLayer) as RealityLayer[]).map(l => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
              layer === l ? 'bg-white text-black shadow-[0_0_20px_white]' : 'opacity-40 hover:opacity-100'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Sentiment HUD */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              mood === Mood.FRENZY ? 'bg-red-500 shadow-[0_0_10px_red]' : 
              mood === Mood.ZEN ? 'bg-green-400' : 'bg-cyan-400'
            }`} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Canvas_Mood: {mood}</span>
         </div>
         <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-300" style={{ width: `${Math.min(100, velocity)}%` }} />
         </div>
      </div>

      <main className={`relative z-10 max-w-7xl mx-auto pt-32 pb-40 px-6 transition-all duration-700 ${layer === RealityLayer.THOUGHT ? 'opacity-40 scale-105' : 'opacity-100'}`}>
        
        <header className="mb-32">
          <h1 className={`text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none transition-all duration-1000 ${
            layer === RealityLayer.PROCESS ? 'text-transparent border-white border-b-2' : ''
          }`}>
            Neural<br/>Canvas
          </h1>
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase opacity-20">Iteration</span>
              <span className="text-xl font-mono">v4.0.Art</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase opacity-20">Status</span>
               <span className="text-xl font-mono italic">Sentient</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, idx) => (
            <div 
              key={item.id}
              className={`
                group relative flex flex-col p-1 transition-all duration-700
                ${layer === RealityLayer.PROCESS ? 'border border-dashed border-white/20' : ''}
              `}
            >
              {/* Painting Canvas */}
              <div className={`
                relative flex flex-col p-8 transition-all duration-1000 overflow-hidden
                ${layer === RealityLayer.MASK ? 'bg-zinc-900 border border-white/5' : ''}
                ${layer === RealityLayer.PROCESS ? 'bg-transparent border border-white/10' : ''}
                ${layer === RealityLayer.THOUGHT ? 'bg-white/5 backdrop-blur-xl border border-white/20 rounded-full h-[400px] justify-center text-center' : 'min-h-[400px]'}
              `}>
                
                {/* Generative Background Art Piece for the Card */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                  <div 
                    className="absolute inset-0 animate-pulse bg-gradient-to-br" 
                    style={{ 
                      backgroundImage: `linear-gradient(${idx * 45}deg, transparent, ${mood === Mood.FRENZY ? '#ef4444' : '#06b6d4'})`
                    }} 
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Obj_{item.id}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] group-hover:scale-150 transition-transform">
                      {idx + 1}
                    </div>
                  </div>

                  <h3 className={`text-3xl font-black uppercase mb-4 leading-none transition-all duration-700 ${
                    layer === RealityLayer.PROCESS ? 'font-serif italic' : ''
                  }`}>
                    {item.title}
                  </h3>

                  <p className="text-sm font-light opacity-60 leading-relaxed italic mb-10 line-clamp-4">
                    "{item.description}"
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase opacity-20 mb-1">Stability</span>
                      <span className={`text-xs font-mono ${item.status === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`}>
                        {item.status}
                      </span>
                    </div>
                    <button className="px-6 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">
                      Evolve
                    </button>
                  </div>
                </div>

                {/* Brush Stroke Overlay on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Art Palette Elements */}
      <div className="fixed top-1/2 right-12 -translate-y-1/2 flex flex-col gap-4 opacity-20 hover:opacity-100 transition-opacity">
        {['#ef4444', '#06b6d4', '#8b5cf6', '#ffffff'].map(c => (
          <div key={c} className="w-3 h-3 rounded-full cursor-crosshair border border-white/20" style={{ backgroundColor: c }} />
        ))}
      </div>

      <style>{`
        @keyframes canvas-noise {
          0% { opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
        .animate-canvas-noise {
          animation: canvas-noise 2s infinite;
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default NeuralCanvasTheme;
