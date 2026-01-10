
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ThemeType } from '../types';

const THEME_REACTIONS: Record<string, string[]> = {
    [ThemeType.MATRIX]: ['💊', '💾', '🕶️', '🟢', '🔌', '🔦'],
    [ThemeType.FBI_INVESTIGATION]: ['📂', '🚔', '🔍', '🚨', '💼', '🕵️'],
    [ThemeType.ALCHEMIST]: ['🧪', '🔮', '📖', '✨', '🌑', '🕯️'],
    [ThemeType.PIRATE]: ['🏴‍☠️', '⚓', '⚔️', '🪙', '🦜', '🗺️'],
    [ThemeType.WAR]: ['🚁', '🎖️', '💣', '🚩', '🦾', '🔥'],
    [ThemeType.GAMING_PRO]: ['🎮', '🖱️', '🎧', '🏆', '👾', '🔥'],
    [ThemeType.AETHER_QUANTUM]: ['⚛️', '🪐', '🌌', '🌠', '☄️', '🌀'],
    [ThemeType.HALLOWEEN]: ['🎃', '👻', '🦇', '💀', '🕸️', '⚰️'],
    [ThemeType.CHRISTMAS]: ['🎅', '🎄', '🎁', '❄️', '🦌', '🔔'],
    [ThemeType.VALENTINE]: ['❤️', '💖', '🌹', '🍫', '🧸', '🏹'],
    [ThemeType.CYBERPUNK]: ['🦾', '🤖', '🌃', '⚡', '🕶️', '💊'],
    [ThemeType.HORROR]: ['🩸', '🔪', '👁️', '🏚️', '👣', '🪦'],
    [ThemeType.THE_HEIST]: ['💰', '🎭', '🔦', '🚪', '🚠', '💎'],
    [ThemeType.THE_CORRUPTION]: ['🦠', '☣️', '☢️', '💀', '👁️', '🖤'],
    [ThemeType.THE_MUSEUM]: ['🖼️', '🗿', '🏛️', '🏺', '📜', '💎'],
    [ThemeType.STEAMPUNK]: ['⚙️', '🎩', '🚂', '🕰️', '⛽', '🏮'],
    [ThemeType.DRUG_DEALER]: ['💵', '💊', '⚖️', '🚬', '📦', '🚔'],
    [ThemeType.SINGULARITY]: ['🌀', '🌑', '🌌', '🧬', '📡', '🛸'],
    [ThemeType.SOLAR_SYSTEM]: ['☀️', '🌍', '🌙', '🚀', '🔭', '🛰️'],
    [ThemeType.MEDICAL]: ['🩺', '💉', '💊', '🚑', '🏥', '🧬'],
    [ThemeType.BLOOD_STAIN]: ['⛧', '🜏', '🍷', '🕯️', '🩸', '💀'],
    [ThemeType.SHOOTING]: ['🎯', '🔫', '🧨', '🛡️', '🚑', '🩸'],
    [ThemeType.RUSTIC_HARVEST]: ['🌾', '🍎', '🚜', '🧺', '🥧', '🧑‍🌾'],
    [ThemeType.BANK]: ['🏦', '💰', '💳', '🔒', '📑', '💼'],
    [ThemeType.INVESTIGATIVE_HORROR]: ['🔦', '👣', '🕵️', '🩸', '🏚️', '👻'],
    [ThemeType.QUANTUM_NEXUS]: ['💎', '🔌', '🌀', '📡', '⚛️', '⚡'],
    [ThemeType.NEURAL_CANVAS]: ['🧠', '🎨', '🖌️', '🧬', '🌈', '✨'],
    [ThemeType.VOID_COMMERCE]: ['📦', '💸', '🛸', '🌑', '⚖️', '🛒'],
    [ThemeType.INTERROGATION_ROOM]: ['💡', '📝', '👮', '🔦', '🚪', '🤐'],
    [ThemeType.SERIAL_KILLER]: ['🔪', '🩸', '📸', '🗝️', '🏚️', '👤'],
    [ThemeType.LABYRINTH]: ['🧭', '🧱', '🗝️', '👾', '🔦', '🚪'],
    [ThemeType.NIGHTMARE]: ['👹', '🛌', '💤', '👁️', '🌑', '🌫️'],
    [ThemeType.SAO_JOAO]: ['🌽', '🔥', '🪗', '🎈', '👒', '🎆'],
    [ThemeType.AUTUMN]: ['🍂', '🍁', '🎃', '🪵', '🧣', '☕'],
    [ThemeType.NEW_YEAR]: ['🍾', '🎆', '🥂', '🎊', '🕰️', '✨'],
    [ThemeType.CARNIVAL]: ['🎭', '🥁', '🎊', '🎷', '🍹', '🌈'],
    [ThemeType.EASTER]: ['🐰', '🥚', '🍫', '🧺', '🌷', '🐣'],
};

const DEFAULT_REACTIONS = ['🔥', '💻', '🔒', '⚡', '🤖', '🖤'];

interface QuickReactionsProps {
    theme?: ThemeType;
}

const QuickReactions: React.FC<QuickReactionsProps> = ({ theme }) => {
    const [reactions, setReactions] = useState<Record<string, number>>({});
    const [userReacted, setUserReacted] = useState<string | null>(null);

    const activeEmojis = (theme && THEME_REACTIONS[theme]) || DEFAULT_REACTIONS;

    useEffect(() => {
        fetchReactions();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('public:reactions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, () => {
                fetchReactions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchReactions = async () => {
        const { data, error } = await supabase
            .from('reactions')
            .select('*');

        if (data) {
            const counts: Record<string, number> = {};
            data.forEach(r => counts[r.emoji] = r.count);
            setReactions(counts);
        }
    };

    const handleReact = async (emoji: string) => {
        if (userReacted === emoji) return;

        const currentCount = reactions[emoji] || 0;
        const { error } = await supabase
            .from('reactions')
            .upsert({ emoji, count: currentCount + 1 }, { onConflict: 'emoji' });

        if (!error) {
            setUserReacted(emoji);
            setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
        }
    };

    return (
        <div className="fixed bottom-12 right-4 z-[99] flex flex-col gap-2 items-end">
            <div className="flex bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 gap-1.5 shadow-2xl">
                {activeEmojis.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => handleReact(emoji)}
                        className={`
                            flex flex-col items-center p-2 rounded-xl transition-all duration-300
                            ${userReacted === emoji ? 'bg-white/20 scale-110' : 'hover:bg-white/10 hover:scale-105'}
                        `}
                    >
                        <span className={`text-xl drop-shadow-md ${['⛧', '🜏'].includes(emoji) ? 'text-[#ff0000]' : ''}`}>{emoji}</span>
                        <span className="text-[10px] font-mono font-bold text-white/50">{reactions[emoji] || 0}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickReactions;
