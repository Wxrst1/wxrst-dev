
import React, { useState, useEffect } from 'react';
import { ContentItem } from '../../types';

const HalloweenTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-orange-500 p-8 md:p-24 relative overflow-hidden font-['Special_Elite']">
      {/* Flashlight/Fog Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 mix-blend-multiply"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`
        }}
      />

      <header className="relative z-10 text-center mb-24">
        <h1 className="text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-900 animate-pulse">
          Spectral Logs
        </h1>
        <p className="text-sm italic opacity-50 tracking-[0.5em] mt-4">ABANDON HOPE ALL YE WHO ENTER</p>
      </header>

      {/* Scattered Graveyard Layout */}
      <div className="relative z-10 flex flex-wrap justify-center gap-16">
        {data.map((item, idx) => (
          <div 
            key={item.id} 
            className="w-full max-w-xs transition-all duration-700 hover:scale-110"
            style={{ 
              marginTop: idx % 2 === 0 ? '0' : '100px',
              transform: `rotate(${(idx % 3 - 1) * 5}deg)`
            }}
          >
            {/* Tombstone Card */}
            <div className="relative bg-[#222] border-x-8 border-t-[40px] border-[#333] rounded-t-full p-8 pt-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-b-4 border-b-black group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">👻</div>
              
              <div className="text-center mb-6">
                <span className="text-[10px] bg-orange-900 text-black px-2 py-0.5 rounded font-bold">R.I.P</span>
                <p className="text-[10px] uppercase opacity-40 mt-1">{item.timestamp.split('T')[0]}</p>
              </div>

              <h3 className="text-2xl font-bold text-center leading-tight mb-4 group-hover:text-red-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-400 italic text-center line-clamp-3">
                "{item.description}"
              </p>

              <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-center uppercase tracking-widest opacity-30">
                {item.category} // {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-full flex justify-between opacity-10 pointer-events-none">
        <span className="text-9xl">🏚️</span>
        <span className="text-9xl">🦇</span>
        <span className="text-9xl">💀</span>
      </div>
    </div>
  );
};

export default HalloweenTheme;
