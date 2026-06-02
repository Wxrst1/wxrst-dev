
import React, { useState, useEffect } from 'react';
import { ContentItem } from '../../types';

const EncryptionStatic: React.FC = () => (
  <div className="absolute inset-0 z-10 opacity-20 pointer-events-none overflow-hidden">
    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6-static.png')] animate-pulse" />
  </div>
);

const DrugDealerTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [paranoia, setParanoia] = useState(0);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setParanoia(p => Math.min(p + 1, 100));
    }, 1000);
    const reset = () => setParanoia(0);
    window.addEventListener('mousemove', reset);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', reset);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-[#4ade80] font-mono p-4 md:p-12 relative overflow-hidden">
      {/* Paranoia Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-1000"
        style={{ 
          background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,${paranoia / 100}) 100%)`,
          opacity: paranoia > 50 ? 1 : 0 
        }}
      />

      {/* Background Matrix of Money/Data */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none select-none text-[8px] leading-none overflow-hidden whitespace-pre font-bold">
        {Array(100).fill(0).map((_, i) => (
          <div key={i} className="animate-marquee-slow">
            $99,234.00 BTC_SEND_SUCCESS {Math.random().toString(16)} RECV_PORT_8080 {Math.random().toString(36)}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b-2 border-[#166534] pb-6 bg-[#020617]/80 backdrop-blur-xl p-4 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#166534] text-white flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(22,101,52,0.4)]">
              <span className="text-2xl">💼</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">THE CONNECT <span className="text-[#4ade80]">v2.1</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Signal Encrypted // Proxy: Moscow/77.102</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Balance</div>
              <div className="text-xl font-black text-white">$4,289,102.44</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#166534] flex items-center justify-center animate-pulse">
              <span className="text-xs">📶</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, idx) => (
            <div 
              key={item.id}
              className="group relative bg-slate-900/40 border border-slate-800 hover:border-[#4ade80]/50 transition-all duration-500 p-1 flex flex-col overflow-hidden shadow-2xl"
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className="bg-black/80 p-4 h-full flex flex-col gap-4 relative">
                {activeItem !== item.id && <EncryptionStatic />}
                
                <div className="flex justify-between items-start">
                  <div className="px-2 py-0.5 bg-[#166534]/30 border border-[#166534] text-[9px] font-black uppercase text-[#4ade80]">
                    Shipment #{item.id}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-[#4ade80]" />
                    <div className="w-1 h-1 bg-[#4ade80]" />
                    <div className="w-1 h-1 bg-[#166534]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#4ade80] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                    <span>Origin: {item.category}</span>
                    <span className="text-[#166534]">/</span>
                    <span className={item.status === 'CRITICAL' ? 'text-red-500' : 'text-[#4ade80]'}>Purity: {item.status}</span>
                  </div>
                </div>

                <div className="relative flex-1">
                   <p className={`text-[11px] leading-relaxed italic transition-all duration-1000 ${activeItem === item.id ? 'opacity-100 blur-0' : 'opacity-20 blur-md'}`}>
                    "{item.description}"
                  </p>
                  {activeItem !== item.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] uppercase font-black tracking-widest bg-black px-2 py-1 border border-slate-800">Verify Contents</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-slate-800/50">
                  <div className="flex justify-between items-end">
                    <div className="text-[8px] font-bold text-slate-600 uppercase">Est. Street Value</div>
                    <div className="text-sm font-black text-white">$450,000</div>
                  </div>
                  <button className="w-full py-2 bg-[#166534] hover:bg-[#15803d] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <span className="group-hover/btn:animate-bounce">🔒</span> MOVE STOCK
                  </button>
                </div>
                
                {/* Visual Distortion Stripe */}
                <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-[#4ade80]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </main>

        <footer className="mt-10 border-t border-slate-800 pt-6 flex flex-col gap-4">
           <div className="overflow-hidden bg-black/50 p-2 border border-slate-800">
            <div className="flex gap-10 whitespace-nowrap animate-marquee text-[10px] font-bold text-slate-500">
              <span>SCANNING FREQUENCIES...</span>
              <span className="text-red-900">[!] DISPATCH REPORT: SECTOR 4 CLEAR</span>
              <span>INBOUND COURIER ARRIVING AT 0400...</span>
              <span className="text-[#4ade80]">ENCRYPTION LAYER 4 ACTIVE</span>
              <span>MARKET VOLATILITY: +14.2%</span>
            </div>
          </div>
          <p className="text-center text-[8px] uppercase tracking-widest text-slate-700 font-bold">
            Destroy this session after use. Logs are not persistent.
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-slow {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default DrugDealerTheme;
