
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../../types';

const SolarSystemTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [timeScale, setTimeScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Planet stylistic properties based on index
  const planetConfigs = [
    { color: 'bg-stone-400', size: 'w-6 h-6', speed: 8, ring: false },    // Mercury-like
    { color: 'bg-orange-200', size: 'w-10 h-10', speed: 12, ring: false }, // Venus-like
    { color: 'bg-blue-500', size: 'w-12 h-12', speed: 16, ring: false },  // Earth-like
    { color: 'bg-red-500', size: 'w-8 h-8', speed: 20, ring: false },    // Mars-like
    { color: 'bg-amber-600', size: 'w-20 h-20', speed: 28, ring: true },  // Jupiter/Saturn-like
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#000510] text-blue-100 font-['Orbitron'] relative overflow-hidden flex items-center justify-center p-4"
    >
      {/* Background: Starfield and Deep Space Nebula */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0a1a3a_0%,_transparent_100%)] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Central Star: The Sun */}
      <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-[0_0_80px_rgba(234,179,8,0.6)] animate-pulse" />
        <div className="absolute inset-[-20px] bg-yellow-400/20 rounded-full blur-2xl animate-ping" />
        
        <div className="relative z-20 text-center pointer-events-none select-none">
          <h1 className="text-xl md:text-2xl font-black text-white drop-shadow-lg tracking-widest uppercase">
            HELIOS_DB
          </h1>
          <p className="text-[8px] md:text-[10px] text-yellow-200 opacity-60 font-mono tracking-tighter">SOL_SYSTEM_ACTIVE</p>
        </div>
      </div>

      {/* Planetary Orbits Container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {data.map((item, idx) => {
          const config = planetConfigs[idx % planetConfigs.length];
          const orbitDistance = 180 + idx * 80;
          const orbitDuration = config.speed / timeScale;

          return (
            <div 
              key={item.id}
              className="absolute rounded-full border border-blue-900/20"
              style={{
                width: `${orbitDistance * 2}px`,
                height: `${orbitDistance * 2}px`,
              }}
            >
              {/* The Planet itself */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  animation: `celestial-orbit ${orbitDuration}s linear infinite`,
                }}
              >
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Planet Body */}
                  <div className={`relative ${config.size} ${config.color} rounded-full shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 overflow-hidden`}>
                    {/* Surface Texture Simulation */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] animate-[spin_10s_linear_infinite]" />
                    
                    {/* Planet Rings (if applicable) */}
                    {config.ring && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[30%] border-[4px] border-white/20 rounded-full rotate-[20deg]" />
                    )}
                  </div>

                  {/* Identification Label */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-400 whitespace-nowrap opacity-40 group-hover:opacity-100 transition-opacity">
                    {item.title.split(' ')[0]} // {item.id}
                  </div>

                  {/* Planet Details Card (Hover state) */}
                  <div className={`absolute left-full ml-6 top-1/2 -translate-y-1/2 w-72 p-6 bg-blue-950/80 border border-blue-500/30 backdrop-blur-xl transition-all duration-500 pointer-events-none ${hoveredItem === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Celestial Body Detected</span>
                      <span className={`text-[9px] font-bold px-1 rounded ${item.status === 'CRITICAL' ? 'bg-red-900 text-white' : 'bg-blue-900 text-blue-200'}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-blue-200/60 font-sans italic mb-4 leading-relaxed">
                      "{item.description}"
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-blue-800/50 text-[8px] font-mono uppercase tracking-widest text-blue-400">
                      <div>Category: {item.category}</div>
                      <div className="text-right">Epoch: {item.timestamp.split('T')[0]}</div>
                    </div>

                    {/* Scientific Analysis Visual */}
                    <div className="mt-4 h-1 w-full bg-blue-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 animate-[analysis-bar_2s_ease-in-out_infinite]" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Controls UI */}
      <div className="fixed bottom-32 left-8 z-50 bg-black/40 border border-blue-500/20 backdrop-blur-md p-6 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Orbital Velocity</span>
          <span className="text-xs text-blue-100 font-mono">x{timeScale.toFixed(1)}</span>
        </div>
        <input 
          type="range" 
          min="0.2" 
          max="5" 
          step="0.1" 
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          className="w-40 h-1 bg-blue-900 appearance-none cursor-pointer accent-blue-400"
        />
        <div className="flex justify-between text-[8px] font-bold text-blue-800 uppercase">
          <span>Stagnant</span>
          <span>Accelerated</span>
        </div>
      </div>

      {/* Decorative Radar Sweep */}
      <div className="fixed bottom-8 right-8 z-50 text-right font-mono text-[9px] text-blue-500/40 select-none">
        <div>UPLINK: ACTIVE</div>
        <div>SCAN_RADAR: 360_OMEGA</div>
        <div className="text-blue-400">LATENCY: 0.042ms</div>
      </div>

      <style>{`
        @keyframes celestial-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes analysis-bar {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          background: #60a5fa;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
        }
      `}</style>
    </div>
  );
};

export default SolarSystemTheme;
