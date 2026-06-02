
import React, { useState, useEffect, useCallback } from 'react';
import { ContentItem } from '../../types';

// 10x10 Maze Grid (0 = Path, 1 = Wall)
const MAZE_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const LabyrinthTheme: React.FC<{ data: ContentItem[] }> = ({ data }) => {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());

  const movePlayer = useCallback((dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Check bounds and walls
    if (
      newY >= 0 && newY < MAZE_GRID.length &&
      newX >= 0 && newX < MAZE_GRID[0].length &&
      MAZE_GRID[newY][newX] === 0
    ) {
      setPlayerPos({ x: newX, y: newY });
      
      // Check for items at this position
      const item = data.find(i => i.mazePos?.x === newX && i.mazePos?.y === newY);
      if (item) {
        setActiveItem(item);
        setDiscoveredIds(prev => new Set([...prev, item.id]));
      } else {
        setActiveItem(null);
      }
    }
  }, [playerPos, data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="min-h-screen bg-[#0a0a05] text-[#d4d4aa] font-serif p-4 md:p-12 flex flex-col items-center relative overflow-hidden">
      {/* Ambience: Flickering Light */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-40 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle 350px at ${playerPos.x * 10 + 5}% ${playerPos.y * 10 + 5}%, rgba(255, 200, 50, 0.4) 0%, transparent 100%)`,
          transition: 'background 0.1s ease-out'
        }}
      />
      
      <header className="text-center mb-8 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-[#8b7d6b] drop-shadow-lg">
          The Forgotten Maze
        </h1>
        <p className="mt-2 text-xs italic opacity-60">Use ARROWS or WASD to navigate. Find the 5 lost manuscripts.</p>
      </header>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start relative z-10">
        {/* Game Viewport */}
        <div className="relative bg-[#1a1a10] border-8 border-[#2c2c1a] p-2 shadow-2xl rounded-sm shrink-0 mx-auto">
          <div 
            className="grid gap-0" 
            style={{ 
              gridTemplateColumns: `repeat(${MAZE_GRID[0].length}, 40px)`,
              gridTemplateRows: `repeat(${MAZE_GRID.length}, 40px)` 
            }}
          >
            {MAZE_GRID.map((row, y) => 
              row.map((cell, x) => {
                const isWall = cell === 1;
                const isPlayer = playerPos.x === x && playerPos.y === y;
                const itemAtPos = data.find(i => i.mazePos?.x === x && i.mazePos?.y === y);
                const isDiscovered = itemAtPos && discoveredIds.has(itemAtPos.id);

                return (
                  <div 
                    key={`${x}-${y}`} 
                    className={`w-10 h-10 relative flex items-center justify-center transition-colors duration-300 ${
                      isWall ? 'bg-[#2c2c1a] shadow-[inset_0_0_10px_black]' : 'bg-[#15150a]'
                    }`}
                  >
                    {isWall && <div className="absolute inset-1 border border-[#3d3d24] opacity-30" />}
                    {isPlayer && (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full shadow-[0_0_20px_#eab308] animate-pulse z-20 flex items-center justify-center">
                        <span className="text-[10px]">🔥</span>
                      </div>
                    )}
                    {itemAtPos && (
                      <div className={`text-xl transition-all duration-500 ${isDiscovered ? 'opacity-30 scale-75 grayscale' : 'animate-bounce'}`}>
                        📜
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Content Details Sidebar */}
        <div className="flex-1 w-full min-h-[400px] bg-[#1a1a10] border-4 border-[#2c2c1a] p-8 shadow-inner relative">
          <div className="absolute top-0 right-0 p-4 text-[10px] uppercase font-bold text-[#8b7d6b] opacity-40">
            Progress: {discoveredIds.size} / {data.length}
          </div>

          {activeItem ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-[10px] uppercase font-black text-yellow-600/60 mb-2 block tracking-widest">
                Recovered Fragment: {activeItem.category}
              </span>
              <h2 className="text-3xl font-bold text-[#e0e0c0] mb-4 border-b border-[#2c2c1a] pb-2">
                {activeItem.title}
              </h2>
              <p className="text-lg italic leading-relaxed text-[#a0a080] mb-8">
                "{activeItem.description}"
              </p>
              
              {activeItem.codeSnippet && (
                <div className="bg-black/40 p-4 border border-[#2c2c1a] rounded-sm font-mono text-xs text-yellow-500/80 mb-6">
                   {activeItem.codeSnippet}
                </div>
              )}

              <div className="flex gap-4">
                <button className="px-6 py-2 bg-[#2c2c1a] hover:bg-[#3d3d24] text-xs font-bold uppercase transition-all border border-[#8b7d6b]/20">
                  Analyze Script
                </button>
                <button className="px-6 py-2 bg-yellow-900/20 hover:bg-yellow-900/40 text-xs font-bold uppercase text-yellow-600 transition-all border border-yellow-900/40">
                  Seal Scroll
                </button>
              </div>
            </div>
          ) : discoveredIds.size === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 italic">
              <div className="text-6xl mb-4">🕯️</div>
              <p>The hallways are dark and cold... Move to find the scattered knowledge.</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 italic">
              <p>Keep exploring the shadows. There are more fragments to be found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-1/2 left-4 -translate-y-1/2 text-9xl opacity-[0.02] pointer-events-none select-none">🪨</div>
      <div className="fixed bottom-4 right-4 text-9xl opacity-[0.02] pointer-events-none select-none rotate-12">🧱</div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LabyrinthTheme;
