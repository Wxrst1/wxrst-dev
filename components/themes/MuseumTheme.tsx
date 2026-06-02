
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const MuseumTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isIntro, setIsIntro] = useState(true);
  const [isDaylight, setIsDaylight] = useState(false);
  const [keysFound, setKeysFound] = useState<Set<string>>(new Set());
  const [inspectedCount, setInspectedCount] = useState<Set<string>>(new Set());
  const [time, setTime] = useState('11:47 PM');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Time Simulation
  useEffect(() => {
    if (isIntro || isDaylight) return;
    const interval = setInterval(() => {
      setTime(prev => {
        if (inspectedCount.size === data.length) {
          setIsDaylight(true);
          return '06:00 AM';
        }
        return prev; // Static until all checked for this demo
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [inspectedCount, data.length, isIntro, isDaylight]);

  const handleExhibitHover = (id: string) => {
    if (isDaylight) return;
    setInspectedCount(prev => new Set([...prev, id]));
    // Random chance to find a key
    if (Math.random() > 0.7 && keysFound.size < 3 && !keysFound.has(id)) {
      setKeysFound(prev => new Set([...prev, id]));
    }
  };

  const SlitherCode: React.FC<{ code: string }> = ({ code }) => (
    <div className="absolute inset-0 pointer-events-none opacity-0 group-data-[alive=true]:opacity-20 transition-opacity duration-1000">
      {code.split(' ').slice(0, 5).map((word, i) => (
        <span
          key={i}
          className="absolute font-mono text-[8px] text-cyan-400 animate-slither"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );

  if (isIntro) {
    return (
      <div
        className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-serif"
        onClick={() => setIsIntro(false)}
      >
        <div className="max-w-xl w-full space-y-8 animate-in fade-in duration-1000">
          <ThemedProfile theme="THE_MUSEUM" profile={profile} onEdit={onEditProfile} />
          <div className="border-l-2 border-white/20 pl-8 space-y-4">
            <div className="text-xs uppercase tracking-[0.5em] text-white/40">Museum Audio Log // 23:47</div>
            <p className="text-xl italic text-white/80 leading-relaxed">
              "All exhibits secured. The Portrait Hall is locked.
              Watch out for the 'Whispering Shadows' in the Restricted Section.
              {profile.name} is scheduled for final inspection.
              Begin your rounds. Don't let the light fail."
            </p>
          </div>
          <button className="group relative px-12 py-4 border border-white/20 hover:border-white transition-all overflow-hidden w-full">
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 text-xs uppercase tracking-[0.5em] group-hover:text-black">Begin Rounds</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-all duration-[3000ms] relative overflow-x-hidden font-['Playfair_Display']
        ${isDaylight ? 'bg-[#f4f1ea] text-zinc-900' : 'bg-black text-white cursor-none'}
      `}
    >
      {/* Flashlight Mask Overlay */}
      {!isDaylight && (
        <div
          className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`
          }}
        />
      )}

      {/* HUD */}
      <div className={`fixed top-12 left-12 right-12 z-[100] flex justify-between items-start pointer-events-none transition-opacity duration-1000 ${isDaylight ? 'opacity-20' : 'opacity-100'}`}>
        <div className="flex flex-col gap-1">
          <div className="text-[10px] uppercase tracking-[0.8em] text-white/40">Security Post A-1 // {profile.name}</div>
          <div className="text-4xl font-black italic tracking-tighter tabular-nums">{time}</div>
        </div>
        <div className="text-right flex flex-col items-end gap-4">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rotate-45 border border-white/20 flex items-center justify-center ${keysFound.size > i ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_10px_yellow]' : ''}`}>
                {keysFound.size > i && <span className="text-[6px] text-black">🔑</span>}
              </div>
            ))}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-white/20">Keys Collected</div>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto py-40 px-6 space-y-40">

        <section className="space-y-24">
          <header className="border-b border-white/10 pb-8 flex justify-between items-end">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">The Portrait Hall</h2>
              <p className="text-sm opacity-40 mt-4 tracking-[0.3em] uppercase">Observation by Curatorial Lead {profile.name}</p>
            </div>
            {isDaylight && <ThemedProfile theme="THE_MUSEUM" profile={profile} onEdit={onEditProfile} />}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
            {data.slice(0, 4).map((item, idx) => {
              const el = containerRef.current?.querySelector(`#exhibit-${item.id}`);
              const rect = el?.getBoundingClientRect();
              const isLit = rect &&
                mousePos.x > rect.left - 100 && mousePos.x < rect.right + 100 &&
                mousePos.y + window.scrollY > rect.top + window.scrollY - 100 && mousePos.y + window.scrollY < rect.bottom + window.scrollY + 100;

              return (
                <div
                  key={item.id}
                  id={`exhibit-${item.id}`}
                  data-alive={isLit || isDaylight}
                  onMouseEnter={() => handleExhibitHover(item.id)}
                  className="group relative"
                >
                  <div className={`relative bg-zinc-900 p-8 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] border-[12px] border-double transition-all duration-700
                    ${isDaylight ? 'border-zinc-300 bg-white' : 'border-zinc-800 group-data-[alive=true]:border-yellow-900 group-data-[alive=true]:shadow-yellow-900/10'}
                  `}>
                    <div className="aspect-[3/4] bg-black overflow-hidden relative">
                      <img
                        src={`https://picsum.photos/seed/${item.id}museum/600/800?grayscale`}
                        alt="exhibit"
                        className={`w-full h-full object-cover transition-all duration-[2000ms]
                          ${isLit || isDaylight ? 'opacity-80 scale-110 grayscale-0' : 'opacity-20 scale-100 grayscale'}
                        `}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                      {item.codeSnippet && <SlitherCode code={item.codeSnippet} />}
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Fragment {item.id}</span>
                        <h3 className={`text-2xl font-black uppercase tracking-tight transition-all duration-1000 ${isLit || isDaylight ? (isDaylight ? 'text-zinc-900' : 'text-white') : 'text-white/20'}`}>
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className={`mt-8 space-y-4 transition-all duration-1000 ${isLit || isDaylight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <p className="text-sm italic leading-relaxed opacity-60">"{item.description}"</p>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-yellow-600">{item.category}</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => onLinkClick(item.id)}
                          className={`px-4 py-1 border transition-colors ${isDaylight ? 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white' : 'border-white/20 hover:bg-white hover:text-black'}`}
                        >
                          Examine
                        </a>
                      </div>
                    </div>
                  </div>
                  {keysFound.has(item.id) && !isDaylight && (
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl animate-bounce shadow-lg z-50">🔑</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative">
          <div className={`transition-all duration-1000 ${keysFound.size < 3 && !isDaylight ? 'blur-xl grayscale scale-95 opacity-20' : 'opacity-100 scale-100'}`}>
            <header className="border-b border-white/10 pb-8 mb-24">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-red-900 group-data-[alive=true]:text-red-600 transition-colors">The Restricted Wing</h2>
              <p className="text-sm opacity-40 mt-4 tracking-[0.3em] uppercase italic">Forbidden Fragments // High Volatility</p>
            </header>

            <div className="flex flex-col gap-32">
              {data.slice(4).map(item => (
                <div key={item.id} className="max-w-4xl mx-auto w-full group" onMouseEnter={() => handleExhibitHover(item.id)}>
                  <div className={`relative border p-12 flex flex-col md:flex-row gap-12 items-center transition-colors duration-1000 ${isDaylight ? 'bg-white border-zinc-200 shadow-xl' : 'bg-zinc-950 border-red-950/20'}`}>
                    <div className="w-64 h-64 bg-red-950/20 shrink-0 relative overflow-hidden flex items-center justify-center">
                      <span className="text-8xl opacity-10 group-hover:scale-150 group-hover:opacity-40 transition-all duration-1000">⚠️</span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.5em]">Anomaly Detected</div>
                      <h3 className={`text-4xl font-black uppercase italic tracking-tighter ${isDaylight ? 'text-zinc-900' : 'text-white'}`}>{item.title}</h3>
                      <p className="text-sm italic opacity-40 leading-relaxed">"{item.description}"</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onLinkClick(item.id)}
                        className="px-8 py-3 bg-red-950 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all block text-center"
                      >
                        Breach File
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {keysFound.size < 3 && !isDaylight && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-12 bg-black/40 backdrop-blur-sm">
              <div className="w-32 h-32 border-4 border-dashed border-white/20 rounded-full flex items-center justify-center mb-8 animate-spin-slow">
                <span className="text-5xl">🔒</span>
              </div>
              <h4 className="text-2xl font-black uppercase tracking-[0.4em]">Sector Locked</h4>
              <p className="text-xs opacity-40 mt-4 max-w-xs uppercase font-bold tracking-widest font-serif">Find the 3 missing security fragments in the Portrait Hall to proceed.</p>
            </div>
          )}
        </section>

        {/* Integrated Guestbook Section */}
        <section className="mt-40 border-t border-zinc-200/20 pt-24">
          <h2 className={`text-5xl font-black italic uppercase text-center mb-16 tracking-widest ${isDaylight ? 'text-zinc-900' : 'text-white'}`}>Visitor_Archives</h2>
          <div className={`max-w-4xl mx-auto border p-8 h-[600px] shadow-2xl transition-colors duration-1000 ${isDaylight ? 'bg-white border-zinc-200' : 'bg-black border-zinc-800'}`}>
            <div className="h-full relative overflow-hidden">
              {/* Old paper texture overlay for daylight */}
              {isDaylight && <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />}
              <Guestbook isInline />
            </div>
          </div>
        </section>

        <footer className="mt-60 text-center pb-40">
          <div className={`transition-opacity duration-1000 ${isDaylight ? 'opacity-100' : 'opacity-10'}`}>
            <p className="text-[10px] font-black uppercase tracking-[1.5em] mb-4">Museum of the Eternal Return // Curated by {profile.name}</p>
            <p className="text-xs italic opacity-40">"Everything is frozen. Until we look closer."</p>
          </div>
        </footer>
      </main>

      {/* Daylight Overlay Transition */}
      {isDaylight && <div className="fixed inset-0 pointer-events-none z-[200] animate-dawn-flash" />}

      <style>{`
        @keyframes slither { 0% { transform: translate(0, 0) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(50px, -30px) rotate(10deg); opacity: 0; } }
        .animate-slither { animation: slither 4s linear infinite; }
        @keyframes dawn-flash { 0% { background: transparent; } 10% { background: white; } 100% { background: transparent; } }
        .animate-dawn-flash { animation: dawn-flash 4s ease-out forwards; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MuseumTheme;
