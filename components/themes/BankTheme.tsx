
import React, { useState, useEffect } from 'react';
import { ContentItem } from '../../types';

const BankTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [combination, setCombination] = useState<number[]>([]);
  const [rotation, setRotation] = useState(0);

  const handleUnlock = () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    // Simulate dial spinning
    setRotation(720);
    setTimeout(() => {
      setIsUnlocked(true);
    }, 1500);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
        {/* The Vault Door Container */}
        <div className={`relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#333] rounded-full border-[10px] border-[#555] shadow-2xl transition-all duration-1000 transform ${isUnlocking ? 'scale-110' : ''}`}>
          
          {/* Inner Door */}
          <div className={`absolute inset-0 bg-[#444] rounded-full border-8 border-[#222] flex items-center justify-center transition-transform duration-1000 ${isUnlocking ? 'scale-90 opacity-0' : ''}`}>
            
            {/* Spinning Dial Handle */}
            <div 
              className="relative w-32 h-32 md:w-64 md:h-64 bg-[#666] rounded-full shadow-inner cursor-pointer active:scale-95 transition-transform"
              style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 1.5s cubic-bezier(0.65, 0, 0.35, 1)' }}
              onClick={handleUnlock}
            >
              {/* Dial Spokes */}
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute top-1/2 left-1/2 w-full h-4 md:h-8 bg-[#333] -translate-x-1/2 -translate-y-1/2" 
                  style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg)` }}
                />
              ))}
              <div className="absolute inset-8 md:inset-16 bg-[#222] rounded-full border-4 border-[#888] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs md:text-sm tracking-widest uppercase">Rotate to Open</span>
              </div>
            </div>

            {/* Rivets */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-4 h-4 bg-[#222] rounded-full shadow-md"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-135px)`
                }}
              />
            ))}
          </div>

          {/* Background Revealed Behind Door */}
          {isUnlocking && (
             <div className="absolute inset-0 flex items-center justify-center bg-black animate-pulse">
                <div className="w-1/2 h-1/2 bg-yellow-500/20 blur-3xl rounded-full" />
             </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-black text-white tracking-[0.4em] uppercase opacity-40">Secure Access Point</h2>
          <p className="text-[#888] text-xs font-mono mt-2">ENCRYPTION_LAYER_8_ACTIVE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1f1a] text-[#d4af37] font-['Playfair_Display'] p-6 md:p-12 relative overflow-hidden animate-in fade-in zoom-in duration-1000">
      
      {/* Background Decor: Marble Pillars & Gold Lustre */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4af37 0, #d4af37 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
        {/* Floating Money Dust Particles */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col md:flex-row justify-between items-end border-b-4 border-double border-[#d4af37]/30 pb-8 gap-6">
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-[#d4af37] to-[#8b4513]">
              Private_Vault
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] font-bold tracking-[0.5em] text-[#d4af37]/60 uppercase italic">Established 1892</span>
              <div className="h-px flex-1 bg-[#d4af37]/20" />
            </div>
          </div>
          
          <div className="flex gap-10 items-center">
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Secured Assets</div>
              <div className="text-3xl font-bold text-white tracking-tighter">$842,912,000.00</div>
            </div>
            <div className="w-12 h-12 border-2 border-[#d4af37] rounded-full flex items-center justify-center bg-black/40 shadow-xl shadow-yellow-500/10">
              <span className="text-2xl animate-pulse">👑</span>
            </div>
          </div>
        </header>

        {/* The Dashboard - Gold Bar / Ledger Style */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Bank Stats */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-black/60 border border-[#d4af37]/20 p-6 flex flex-col gap-4 backdrop-blur-md">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]/60">Vault_Vitals</h4>
              <div className="space-y-4">
                {['Security_Lock', 'Oxygen_Level', 'Lobby_Status'].map((stat, i) => (
                  <div key={stat} className="flex justify-between items-center text-xs">
                    <span className="opacity-60">{stat}</span>
                    <span className={`font-bold ${i === 2 ? 'text-green-500' : 'text-white'}`}>
                      {i === 2 ? 'SECURE' : '100%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#d4af37] text-black p-6 flex flex-col gap-2 shadow-2xl">
              <span className="text-[9px] font-black uppercase">Transaction_Authorization</span>
              <p className="text-sm font-bold leading-none italic">"Your wealth is our priority."</p>
              <button className="mt-4 w-full py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Request Export
              </button>
            </div>
          </div>

          {/* Main Grid: Data Fragments */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((item, idx) => (
              <div 
                key={item.id}
                className="group relative bg-[#050505] border border-[#d4af37]/10 p-8 flex flex-col gap-6 transition-all duration-500 hover:border-[#d4af37] hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]"
              >
                {/* Gold bar accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#d4af37] opacity-20 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-[#d4af37]/40 tracking-widest">Safe_Box_{item.id}</span>
                      <span className="text-[8px] opacity-20 italic font-mono">{item.timestamp}</span>
                   </div>
                   <div className="text-2xl opacity-10 group-hover:opacity-100 group-hover:animate-bounce transition-all">💰</div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold uppercase text-white group-hover:text-[#d4af37] transition-colors leading-none">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#d4af37]/60 italic font-serif">
                    "{item.description}"
                  </p>
                </div>

                {item.codeSnippet && (
                  <div className="bg-[#111] p-3 border-l-2 border-[#d4af37] text-[9px] font-mono text-white/40 overflow-hidden">
                    {item.codeSnippet}
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-[#d4af37]/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <div className="flex flex-col">
                      <span className="opacity-20">Appraisal</span>
                      <span className={item.status === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}>
                        {item.status}
                      </span>
                   </div>
                   <button className="px-6 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all">
                     Audit
                   </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="mt-32 text-center pb-20 relative opacity-40">
        <div className="inline-block px-12 py-4 border-t-2 border-b-2 border-[#d4af37]/20">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-[#d4af37]">
            Member FDIC / Secured by Global Ledger
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BankTheme;
