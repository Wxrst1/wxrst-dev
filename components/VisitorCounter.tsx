
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

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-white/60">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="uppercase tracking-tighter">Live_Visitors:</span>
            <span className="text-white font-bold">{count.toLocaleString()}</span>
        </div>
    );
};

export default VisitorCounter;
