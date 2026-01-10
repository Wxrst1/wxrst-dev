
import React, { useState, useEffect } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const FBITheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [scanning, setScanning] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthorized(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#000a1a] flex flex-col items-center justify-center font-mono text-cyan-400">
        <div className="w-24 h-24 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin mb-8" />
        <h2 className="text-xl tracking-[0.5em] animate-pulse">INITIATING SECURE UPLINK...</h2>
        <div className="mt-4 text-[10px] opacity-40 uppercase">Fingerprint Auth: REQUIRED</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000d1a] text-slate-300 font-['Fira_Code'] p-6 md:p-12 relative overflow-hidden">
      {/* Background Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 animate-fbi-scan" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Government Header */}
        <header className="flex flex-col items-center border-b-2 border-slate-700 pb-12 gap-10 text-center">
          <div className="shrink-0 scale-100 md:scale-110 hover:brightness-110 transition-all">
            <ThemedProfile theme="FBI_INVESTIGATION" profile={profile} onEdit={onEditProfile} />
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <span className="text-4xl">⚖️</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                  Federal Bureau <span className="text-cyan-500 italic">of Intelligence</span>
                </h1>
                <p className="mt-2 text-[10px] tracking-[0.4em] text-slate-500 font-bold">DEPARTMENT OF JUSTICE // CENTRAL RECORDS</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex gap-4 items-center bg-slate-900/80 p-4 border border-slate-800 backdrop-blur-md shrink-0">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Threat Level</span>
                  <div className="flex gap-1">
                    <div className="w-6 h-2 bg-green-500 opacity-20" />
                    <div className="w-6 h-2 bg-yellow-500 opacity-20" />
                    <div className="w-6 h-2 bg-orange-500" />
                    <div className="w-6 h-2 bg-red-500 animate-pulse" />
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-800 mx-2" />
                <div className="text-right">
                  <div className="text-xs font-bold text-cyan-400">ENC-AES-256</div>
                  <div className="text-[9px] text-slate-500 uppercase">Status: Secure</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Intelligence Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick(item.id)}
              className="group relative bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 p-6 flex flex-col gap-4 shadow-xl overflow-hidden block"
              onMouseEnter={() => setScanning(item.id)}
              onMouseLeave={() => setScanning(null)}
            >
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-[9px] font-black tracking-widest text-slate-500 border-l border-b border-slate-700">
                CASE #{item.id}
              </div>

              <div className="w-full aspect-video bg-black relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <img
                  src={`https://picsum.photos/seed/${item.id}fbi/600/400?grayscale`}
                  alt="Subject"
                  className="w-full h-full object-cover opacity-60 contrast-125 group-hover:opacity-100 transition-opacity"
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/40 pointer-events-none group-hover:border-cyan-400 transition-colors">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                  <div className="absolute -bottom-6 left-0 bg-cyan-500 text-black text-[8px] font-black px-1 leading-tight uppercase group-hover:animate-flicker">
                    Match: 98.4% // Known Alias
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-1 animate-fbi-item-scan" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  {item.title}
                </h3>
                <div className="flex gap-2 text-[8px] uppercase font-bold text-slate-500">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded">Cat: {item.category}</span>
                  <span className={`${item.status === 'CRITICAL' ? 'text-red-500' : 'text-cyan-600'}`}>Status: {item.status}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400 italic font-sans py-2">
                  "{item.description}"
                </p>
              </div>

              <div className="mt-auto space-y-1">
                <div className="flex justify-between text-[7px] text-slate-600 font-bold uppercase tracking-widest">
                  <span>Intelligence Sync</span>
                  <span>{scanning === item.id ? '100%' : '74%'}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-cyan-500 transition-all duration-1000 ${scanning === item.id ? 'w-full' : 'w-3/4'}`}
                  />
                </div>
              </div>

              <div className="w-full py-2 bg-slate-800 group-hover:bg-cyan-900 group-hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-slate-700 group-hover:border-cyan-500/50 text-center">
                View Intelligence Dossier
              </div>
            </a>
          ))}
        </main>

        {/* Integrated Guestbook Section */}
        <div className="mt-24 border-t border-slate-700 pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-8 flex items-center gap-4">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            DCN_Communication_Logs
          </h2>
          <div className="bg-slate-900/50 border border-slate-800 p-8 shadow-2xl h-[600px] relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <Guestbook isInline />
          </div>
        </div>
      </div>

      {/* Foreground UI Elements */}
      <div className="fixed top-4 left-4 text-[10px] text-cyan-400/20 uppercase font-mono pointer-events-none z-50">
        Lat: 38.8943 N // Lon: 77.0245 W
      </div>
      <div className="fixed bottom-4 right-4 text-[10px] text-cyan-400/20 uppercase font-mono pointer-events-none z-50">
        Uptime: {Math.floor(performance.now() / 1000)}s
      </div>

      <style>{`
        @keyframes fbi-scan { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
        @keyframes fbi-item-scan { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes flicker { 0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; } 20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0; } }
        .animate-fbi-scan { animation: fbi-scan 10s linear infinite; }
        .animate-fbi-item-scan { animation: fbi-item-scan 3s ease-in-out infinite; }
        .animate-flicker { animation: flicker 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default FBITheme;
