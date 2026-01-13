
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ThemeType } from '../types';

const VisitorCounter: React.FC<{ theme?: ThemeType }> = ({ theme }) => {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const incrementAndFetch = async () => {
            // 1. Increment visit count (Simple RPC or upsert)
            // Since we don't have an RPC yet, we'll try to fetch and increment
            // In production, an RPC is much better to avoid race conditions.

            const { data, error } = await supabase
                .from('analytics')
                .select('count')
                .eq('key', 'total_visits')
                .single();

            let currentCount = 0;
            if (data) {
                currentCount = data.count;
            }

            const newCount = currentCount + 1;
            setCount(newCount);

            await supabase
                .from('analytics')
                .upsert({ key: 'total_visits', count: newCount }, { onConflict: 'key' });
        };

        incrementAndFetch();
    }, []);

    if (count === null) return null;

    if (theme === ThemeType.BLOOD_STAIN) {
        return (
            <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 px-4 py-2 bg-black border border-red-900/30 text-red-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-sm">
                <span className="text-sm animate-pulse filter drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">🩸</span>
                <span className="font-['Playfair_Display'] uppercase tracking-widest text-xs font-bold">Souls_Captured:</span>
                <span className="font-bold text-red-500 text-sm font-mono">{count.toLocaleString()}</span>
            </div>
        );
    }

    if (theme === ThemeType.CELESTIAL_EMPIRE) {
        return (
            <div className="fixed bottom-6 left-6 z-50 group">
                {/* Decorative Plaque Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-black/80 to-red-950/80 backdrop-blur-md border border-[#D4AF37]/50 skew-x-12 transform transition-transform group-hover:skew-x-0" />

                {/* Inner Content */}
                <div className="relative flex items-center gap-4 px-6 py-2">
                    {/* Pulsing Orb/Eye */}
                    <div className="relative w-3 h-3">
                        <div className="absolute inset-0 bg-[#FFD700] rounded-full animate-ping opacity-75" />
                        <div className="relative w-3 h-3 bg-gradient-to-br from-[#FFD700] to-[#FF4500] rounded-full shadow-[0_0_10px_#FFA500]" />
                    </div>

                    <div className="flex flex-col items-start leading-none">
                        <span className="font-['Cinzel'] text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Realm Spirits</span>
                        <span className="font-['Cinzel'] font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {count.toLocaleString()}
                        </span>
                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FFD700]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FFD700]" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-white/60">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="uppercase tracking-tighter">Live_Visitors:</span>
            <span className="text-white font-bold">{count.toLocaleString()}</span>
        </div>
    );
};

export default VisitorCounter;
