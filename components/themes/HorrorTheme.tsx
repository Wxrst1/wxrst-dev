
import React, { useState } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const HorrorTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-red-800 font-['Special_Elite'] p-8 md:p-24 relative overflow-hidden">
      {/* Creepy Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-900/40 rounded-full blur-[150px] animate-pulse" />
        {/* Grainy effect overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto">
        {/* Hidden Nav - Creaky Door Interaction */}
        <div
          className="fixed top-0 left-0 h-full w-12 hover:w-64 transition-all duration-700 bg-black/80 border-r border-red-950 flex flex-col overflow-hidden group"
          onMouseEnter={() => setIsNavOpen(true)}
          onMouseLeave={() => setIsNavOpen(false)}
        >
          <div className="p-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-10">
            <h2 className="text-3xl font-['UnifrakturMaguntia'] text-red-600">Gateways</h2>
            <ul className="flex flex-col gap-6 text-lg">
              <li className="hover:text-red-400 cursor-pointer italic">The Abyss</li>
              <li className="hover:text-red-400 cursor-pointer italic">Forgotten Souls</li>
              <li className="hover:text-red-400 cursor-pointer italic">Sacrifice</li>
              <li className="hover:text-red-400 cursor-pointer italic">Escape</li>
            </ul>
            <div className="mt-auto opacity-20 text-[10px] uppercase tracking-widest">
              Identity_Locked_In_Void
            </div>
          </div>
          {!isNavOpen && <div className="h-full flex items-center justify-center writing-mode-vertical uppercase tracking-widest text-[10px] text-red-900">REVEAL_IDENTITY</div>}
        </div>

        <header className="text-center mb-32 flex flex-col items-center gap-12 pt-10">
          <div className="shrink-0 scale-100 md:scale-110 hover:brightness-125 transition-all">
            <ThemedProfile theme="HORROR" profile={profile} onEdit={onEditProfile} />
          </div>
          <div>
            <h1 className="text-7xl md:text-8xl font-['UnifrakturMaguntia'] text-red-950 drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)] animate-pulse">
              {profile.name} Fragmented
            </h1>
            <p className="mt-6 text-xs tracking-[0.5em] uppercase italic opacity-60">" {profile.bio} "</p>
          </div>
        </header>

        {/* Scattered Polaroid/Torn Paper Layout */}
        <div className="relative flex flex-wrap justify-center gap-20">
          {data.map((item, idx) => {
            const rotation = (idx % 2 === 0 ? -1 : 1) * (Math.random() * 8 + 2);
            const offset = (idx % 3 === 0 ? 'translate-y-4' : '-translate-y-4');

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick(item.id)}
                style={{ transform: `rotate(${rotation}deg)` }}
                className={`w-full max-w-sm bg-[#ddd] p-6 shadow-[10px_10px_30px_rgba(0,0,0,0.8)] border border-gray-400 group cursor-pointer hover:scale-105 transition-transform duration-500 block ${offset}`}
              >
                {/* Photo area mockup */}
                <div className="w-full aspect-square bg-[#111] mb-6 overflow-hidden relative border-4 border-white shadow-inner">
                  <img
                    src={`https://picsum.photos/seed/${item.id}/400/400?grayscale`}
                    alt="grainy"
                    className="w-full h-full object-cover opacity-50 sepia group-hover:opacity-80 transition-opacity contrast-125"
                  />
                  <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply" />
                  <div className="absolute bottom-2 left-2 text-[10px] bg-white/10 px-2 py-1 text-white">ID: {item.id}</div>
                </div>

                <div className="text-black space-y-4">
                  <h3 className="text-2xl font-bold leading-none border-b border-black/10 pb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed italic opacity-80">
                    "{item.description}"
                  </p>
                  <div className="pt-4 border-t border-red-900/20 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-red-900">
                    <span>Evidence Category: {item.category}</span>
                    <span className="animate-pulse">Status: {item.status}</span>
                  </div>
                </div>

                {/* Blood stain decoration */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-900/40 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>

        {/* Integrated Guestbook Section */}
        <div className="mt-40 border-t-2 border-red-950/20 pt-20">
          <h2 className="text-5xl font-['UnifrakturMaguntia'] text-center mb-12 text-red-950">Whispers_From_The_Void</h2>
          <div className="max-w-3xl mx-auto bg-black border border-red-950 p-8 shadow-[0_0_50px_rgba(127,29,29,0.3)] h-[600px]">
            <Guestbook isInline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorrorTheme;
