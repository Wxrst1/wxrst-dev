
import React from 'react';
import { ContentItem, UserProfile } from '../../types';
import Guestbook from '../Guestbook';
import ThemedProfile from '../ThemedProfile';

const CyberpunkTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Orbitron'] p-6 md:p-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            perspective: '1000px',
            transform: 'rotateX(60deg) translateY(-20%) scale(2)'
          }}
        />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-fuchsia-600 rounded-full blur-[180px] opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600 rounded-full blur-[180px] opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col items-center gap-12 text-center pb-10 border-b-2 border-fuchsia-500/20">
          <div className="shrink-0 scale-95 md:scale-110 hover:brightness-125 transition-all">
            <ThemedProfile profile={profile} onEdit={onEditProfile} theme="CYBERPUNK" />
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-white to-cyan-400 drop-shadow-[0_0_20px_rgba(255,0,255,0.3)]">
              Neural_Net
            </h1>
            <p className="text-cyan-400 font-bold tracking-[0.3em] text-xs uppercase mt-4 bg-cyan-900/20 px-4 py-1 rounded-full border border-cyan-500/30">VIRTUAL OVERLAY 1.8.3_BETA</p>
          </div>
        </header>

        {/* Asymmetric Overlapping Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
          {data.map((item, idx) => {
            const spans = [
              'md:col-span-3 md:row-span-1',
              'md:col-span-3 md:row-span-2',
              'md:col-span-4 md:row-span-1',
              'md:col-span-2 md:row-span-1',
              'md:col-span-6 md:row-span-1',
            ];
            const spanClass = spans[idx % spans.length];

            return (
              <div
                key={item.id}
                className={`${spanClass} relative group perspective-1000 h-full`}
              >
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-4 transition-all duration-500 hover:bg-white/10 hover:border-cyan-500/50 hover:-translate-y-2 hover:translate-x-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(255,0,255,0.2)] h-full">
                  {/* Glitch Overlay Decorations */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-fuchsia-500 font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded-sm">
                      {item.id} / {item.category}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  </div>

                  <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-400 group-hover:to-cyan-400 transition-all">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-400 leading-relaxed font-sans font-medium">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500 to-transparent opacity-30" />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onLinkClick(item.id)}
                      className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2 group/btn"
                    >
                      Access Data <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrated Guestbook Section */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mb-8 border-b border-fuchsia-500/20 pb-4">
              Local_Node_Transmissions
            </h3>
            <div className="bg-white/5 border border-white/5 p-8 backdrop-blur-3xl h-[600px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <Guestbook isInline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkTheme;
