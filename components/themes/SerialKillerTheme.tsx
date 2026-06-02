
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';

const RedactedText: React.FC<{ text: string }> = ({ text }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      className={`relative inline-block cursor-help transition-all duration-300 ${revealed ? 'bg-transparent text-red-900' : 'bg-black text-black select-none'}`}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      {text}
      {!revealed && <span className="absolute inset-0 bg-black opacity-100 mix-blend-multiply" />}
    </span>
  );
};

const SerialKillerTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinPositions, setPinPositions] = useState<{ [key: string]: { x: number, y: number } }>({});

  // Calculate random offsets for the "Scattered" look
  const cardStyles = useRef(data.map(() => ({
    rotate: (Math.random() * 10 - 5),
    offsetX: (Math.random() * 40 - 20),
    offsetY: (Math.random() * 40 - 20),
  }))).current;

  useEffect(() => {
    const updatePins = () => {
      const pins: { [key: string]: { x: number, y: number } } = {};
      data.forEach((item) => {
        const el = document.getElementById(`pin-${item.id}`);
        if (el && containerRef.current) {
          const rect = el.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          pins[item.id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
          };
        }
      });
      setPinPositions(pins);
    };

    updatePins();
    window.addEventListener('resize', updatePins);
    return () => window.removeEventListener('resize', updatePins);
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#3d2b1f] p-8 md:p-20 relative overflow-hidden font-['Special_Elite'] text-[#222]"
      style={{
        backgroundImage: `url('https://www.transparenttextures.com/patterns/cork-board.png')`,
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Red Strings SVG Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        {Object.keys(pinPositions).map((id, idx, arr) => {
          if (idx === arr.length - 1) return null;
          const start = pinPositions[id];
          const end = pinPositions[arr[idx + 1]];
          if (!start || !end) return null;

          const isRelated = hoveredId === id || hoveredId === arr[idx + 1];

          return (
            <line
              key={`string-${id}`}
              x1={start.x} y1={start.y}
              x2={end.x} y2={end.y}
              stroke="#8b0000"
              strokeWidth={isRelated ? "3" : "1.5"}
              strokeOpacity={isRelated ? "1" : "0.6"}
              className="transition-all duration-300"
              style={{ filter: isRelated ? 'drop-shadow(0 0 5px rgba(139,0,0,0.8))' : 'none' }}
            />
          );
        })}
        {/* Additional "Crazy" strings to random points */}
        <line x1="0" y1="0" x2={pinPositions[data[0]?.id]?.x} y2={pinPositions[data[0]?.id]?.y} stroke="#8b0000" strokeWidth="1" strokeOpacity="0.3" />
      </svg>

      <div className="relative z-20 max-w-6xl mx-auto">
        <header className="mb-20 flex flex-col items-center gap-12 text-center">
          <div className="shrink-0 scale-100 md:scale-110 hover:skew-x-2 transition-all duration-500">
            <ThemedProfile theme="SERIAL_KILLER" profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-yellow-400 text-black font-['Permanent_Marker'] px-8 py-2 -rotate-1 shadow-lg text-2xl mb-4 border-2 border-black border-dashed">
              CRIME SCENE - DO NOT CROSS
            </div>
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] text-center">
              CASE FILE: <span className="text-red-700">UNSUB-092</span>
            </h1>
            <p className="text-white/60 text-xs mt-4 uppercase tracking-[0.4em]">Federal Bureau of Investigation // Behavioral Analysis Unit</p>
          </div>
        </header>

        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {data.map((item, idx) => (
            <div
              key={item.id}
              id={`card-${item.id}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group transition-transform duration-500 hover:z-30"
              style={{
                transform: `rotate(${cardStyles[idx].rotate}deg) translate(${cardStyles[idx].offsetX}px, ${cardStyles[idx].offsetY}px)`,
              }}
            >
              {/* The Pin */}
              <div
                id={`pin-${item.id}`}
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-red-900 shadow-md z-40 animate-pulse"
              />

              {/* Evidence Polaroid */}
              <div className="bg-[#eee] p-4 pb-12 shadow-[5px_5px_15px_rgba(0,0,0,0.4)] w-64 md:w-72 border border-gray-300">
                <div className="bg-black w-full aspect-square mb-4 overflow-hidden relative">
                  <img
                    src={`https://picsum.photos/seed/${item.id}noir/400/400?grayscale`}
                    alt="Evidence"
                    className="w-full h-full object-cover opacity-70 contrast-150 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] px-1 font-bold">EXHIBIT {item.id}</div>
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold uppercase leading-tight border-b border-black/10 pb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] leading-tight italic opacity-90">
                    <RedactedText text={item.description} />
                  </p>

                  <div className="pt-4 flex flex-col gap-1 text-[9px] font-bold uppercase text-red-900">
                    <div className="flex justify-between">
                      <span>Cat: {item.category}</span>
                      <span>{item.status}</span>
                    </div>
                    <div className="text-[8px] opacity-50 font-sans tracking-tighter">TIMESTAMP: {item.timestamp}</div>
                  </div>
                </div>

                {/* Handwritten Note Sticky */}
                <div className="absolute -bottom-4 -right-8 w-24 h-24 bg-yellow-200 shadow-md rotate-6 p-2 flex items-center justify-center text-center font-['Permanent_Marker'] text-[10px] text-blue-900 group-hover:rotate-0 transition-transform">
                  "Check the logs!"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Ambience */}
      <div className="fixed top-10 right-10 opacity-10 pointer-events-none text-9xl transform rotate-12">🔍</div>
      <div className="fixed bottom-20 left-10 opacity-10 pointer-events-none text-9xl transform -rotate-12">👣</div>

      {/* Flashlight Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-soft-light opacity-30 bg-[radial-gradient(circle_at_var(--x)_var(--y),_rgba(255,255,255,0.8)_0%,_transparent_50%)]" />

      <style>{`
        :root {
          --x: 50%;
          --y: 50%;
        }
        @keyframes pin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <script>{`
        window.addEventListener('mousemove', e => {
          document.documentElement.style.setProperty('--x', e.clientX + 'px');
          document.documentElement.style.setProperty('--y', e.clientY + 'px');
        });
      `}</script>
    </div>
  );
};

export default SerialKillerTheme;
