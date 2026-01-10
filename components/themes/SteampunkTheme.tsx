
import React from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const SteampunkTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  return (
    <div className="min-h-screen bg-[#2c1b0e] text-[#d4af37] font-['Playfair_Display'] p-10 md:p-20 relative">
      {/* Ornate Background Overlay */}
      {/* ... decor ... */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 w-48 h-48 border-[10px] border-[#d4af37] rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <div className="w-4 h-32 bg-[#d4af37]" />
          <div className="w-32 h-4 bg-[#d4af37]" />
        </div>
        <div className="absolute bottom-10 right-10 w-64 h-64 border-[15px] border-[#d4af37] rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
          <div className="w-8 h-48 bg-[#d4af37]" />
          <div className="w-48 h-8 bg-[#d4af37]" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12 border-[20px] border-double border-[#8b4513] p-8 bg-[#f4e4bc] text-[#2c1b0e] shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]">

        {/* Navigation - Physical Switch Style */}
        {/* Navigation - Physical Switch Style */}
        <div className="flex flex-col md:flex-row justify-center items-center border-b-2 border-[#8b4513] pb-8 mb-4 gap-8">
          <div className="flex gap-1 bg-[#8b4513] p-1 rounded-sm shadow-xl shrink-0">
            {['Archives', 'Engine', 'Gallery', 'Logbook'].map(tab => (
              <button key={tab} className="px-6 py-2 bg-[#f4e4bc] border border-[#8b4513] hover:bg-[#d4af37] transition-colors font-bold uppercase text-xs tracking-widest shadow-inner">
                {tab}
              </button>
            ))}
          </div>
        </div>

        <header className="flex flex-col items-center gap-12 text-center pb-8">
          <div className="shrink-0 scale-100 md:scale-110 hover:sepia transition-all">
            <ThemedProfile profile={profile} onEdit={onEditProfile} theme="STEAMPUNK" />
          </div>

          <div>
            <h1 className="text-6xl font-black uppercase tracking-widest text-[#5d2e0a] border-y-4 border-[#8b4513] inline-block px-10 py-2 relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#d4af37] border-4 border-[#5d2e0a]" />
              {profile.name}'s Ledger
              <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#d4af37] border-4 border-[#5d2e0a]" />
            </h1>
            <p className="mt-6 text-sm italic font-serif opacity-80 max-w-lg mx-auto leading-relaxed underline decoration-[#d4af37]">
              "{profile.bio}"
            </p>
          </div>
        </header>

        {/* Rigid Schematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#8b4513]">
          {data.map((item, idx) => (
            <div
              key={item.id}
              className={`p-8 border-[#8b4513] relative group hover:bg-[#d4af37]/10 transition-colors h-full flex flex-col
                ${idx % 3 !== 2 ? 'md:border-r' : ''} 
                ${idx < data.length - (data.length % 3 === 0 ? 3 : data.length % 3) ? 'border-b' : ''}`}
            >
              {/* Rivet Corners */}
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8b4513] shadow-sm" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8b4513] shadow-sm" />
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#8b4513] shadow-sm" />
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#8b4513] shadow-sm" />

              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#8b4513] text-white px-2 py-0.5">
                    No. {item.id}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-serif leading-tight text-[#5d2e0a] group-hover:scale-105 transition-transform origin-left">
                  {item.title}
                </h3>

                <p className="text-sm italic leading-relaxed text-[#2c1b0e]/80">
                  {item.description}
                </p>

                <div className="mt-auto pt-6">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black text-[#8b4513]">
                    <span>Cat: {item.category}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onLinkClick(item.id)}
                      className="bg-[#f4e4bc] border border-[#8b4513] px-2 py-1 shadow-md hover:translate-y-[-2px] active:translate-y-[1px] cursor-pointer transition-all block"
                    >
                      Read Blueprint
                    </a>
                  </div>
                  <div className="mt-2 h-1 w-full bg-[#8b4513]/20 overflow-hidden">
                    <div className="h-full bg-[#d4af37] w-1/3 group-hover:w-full transition-all duration-1000" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integrated Guestbook Section */}
        <div className="mt-24 border-t-4 border-double border-[#8b4513] pt-16">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-black italic uppercase text-[#5d2e0a] text-center mb-8 tracking-[0.2em]">Public_Logbook</h3>
            <div className="bg-[#f4e4bc] border-4 border-[#8b4513] p-8 shadow-inner h-[600px] relative">
              {/* Ornate paper texture overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
              <div className="relative z-10 h-full">
                <Guestbook isInline />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">
          PROPRIETARY PROPERTY OF {profile.name.toUpperCase()} &copy; 1894
        </footer>
      </div>
    </div>
  );
};

export default SteampunkTheme;
