
import React from 'react';
import { ContentItem } from '../../types';

const SaoJoaoTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#3d1a04] text-[#ffd700] p-6 md:p-12 relative overflow-hidden font-['Playfair_Display']">
      {/* Decorative Flags (Bandeirinhas) */}
      <div className="absolute top-0 left-0 w-full flex justify-around gap-2 px-4 z-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`w-8 h-12 clip-path-flag animate-sway`}
            style={{ 
              backgroundColor: ['#e11d48', '#2563eb', '#16a34a', '#facc15'][i % 4],
              animationDelay: `${i * 0.1}s`
            }} 
          />
        ))}
      </div>

      <header className="relative z-10 text-center mt-12 mb-20">
        <h1 className="text-6xl font-black uppercase text-orange-500 drop-shadow-[0_2px_0_white]">
          Arraiá Data
        </h1>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-2" />
      </header>

      {/* Rustic Grid Layout */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((item) => (
          <div key={item.id} className="bg-[#fde68a]/10 border-4 border-dashed border-orange-800 p-8 flex flex-col md:flex-row gap-6 hover:bg-orange-900/20 transition-all group">
            <div className="w-20 h-20 bg-orange-700 flex items-center justify-center text-4xl shadow-xl rounded-sm shrink-0">
              🔥
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-black bg-orange-600 text-white px-2 py-0.5">ID: {item.id}</span>
                <span className="italic text-xs opacity-60">{item.category}</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:underline underline-offset-8 decoration-orange-500">
                {item.title}
              </h3>
              <p className="text-sm text-orange-200/80 leading-relaxed italic">
                {item.description}
              </p>
              <div className="mt-6 flex gap-4">
                <button className="px-4 py-1 bg-orange-800 text-white text-xs font-bold uppercase hover:bg-orange-500 transition-all">Colher Dados</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .clip-path-flag {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%);
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          50% { transform: rotate(5deg) translateY(5px); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SaoJoaoTheme;
