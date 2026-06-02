
import React from 'react';
import { ContentItem } from '../../types';

const EasterTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#e0f2fe] text-[#0369a1] font-['Playfair_Display'] p-8 md:p-16 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed -bottom-10 left-0 w-full flex justify-around opacity-20 pointer-events-none">
        <span className="text-9xl">🌿</span>
        <span className="text-9xl">🐰</span>
        <span className="text-9xl">🌸</span>
        <span className="text-9xl">🌿</span>
      </div>

      <header className="relative z-10 text-center mb-16">
        <h1 className="text-6xl font-bold text-[#0369a1] drop-shadow-lg">
          Spring Harvest
        </h1>
        <p className="mt-4 text-sm font-bold tracking-widest uppercase opacity-60">Seek and You Shall Find</p>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {data.map((item) => (
          <div key={item.id} className="group relative">
            {/* Egg-shaped Card */}
            <div className="w-full aspect-[4/5] bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-2xl p-12 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 hover:-rotate-3 overflow-hidden border-8 border-dashed border-sky-100">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-sky-50 opacity-50 pointer-events-none" />
              
              <div className="text-4xl mb-4 group-hover:animate-bounce">🥚</div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter text-sky-900">{item.title}</h3>
              <p className="text-xs italic text-gray-500 line-clamp-3 mb-6">
                {item.description}
              </p>
              
              <button className="mt-auto px-6 py-2 rounded-full border-2 border-sky-400 text-sky-400 text-[10px] font-bold uppercase hover:bg-sky-400 hover:text-white transition-all">
                Crack Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EasterTheme;
