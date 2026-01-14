
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import Guestbook from '../Guestbook';

// --- PROPS ---
interface YinYangThemeProps {
    data: any[];
    profile: any;
    onLinkClick: (id: string) => void;
    onEditProfile: (newProfile: any) => void;
}

const YinYangTheme: React.FC<YinYangThemeProps> = ({ data, profile, onLinkClick }) => {
    const [balance, setBalance] = useState(50); // 0 (Yin) - 100 (Yang)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isIntro, setIsIntro] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    // Integrated States
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [reactions, setReactions] = useState<Record<string, number>>({});
    const [userReacted, setUserReacted] = useState<string | null>(null);

    const activeEmojis = ['☯️', '🌀', '🌑', '🌌', '🧬', '📡'];

    // --- INTRO SEQUENCE ---
    useEffect(() => {
        const timer = setTimeout(() => setIsIntro(false), 2400);
        return () => clearTimeout(timer);
    }, []);

    // --- INTERACTION HANDLERS ---
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            const xPct = (e.clientX / window.innerWidth) * 100;
            setBalance(prev => prev + (xPct - prev) * 0.1);
        };

        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // --- DATA INTEGRATION (Visitors & Reactions) ---
    useEffect(() => {
        const fetchData = async () => {
            // Visitors
            const { data: visData } = await supabase.from('analytics').select('count').eq('key', 'total_visits').single();
            if (visData) setVisitorCount(visData.count);

            // Reactions
            const { data: reactData } = await supabase.from('reactions').select('*');
            if (reactData) {
                const counts: Record<string, number> = {};
                reactData.forEach(r => counts[r.emoji] = r.count);
                setReactions(counts);
            }
        };

        fetchData();

        const channel = supabase.channel('singularity-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics' }, fetchData)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleReact = async (emoji: string) => {
        if (userReacted === emoji) return;
        const currentCount = reactions[emoji] || 0;
        const { error } = await supabase.from('reactions').upsert({ emoji, count: currentCount + 1 }, { onConflict: 'emoji' });
        if (!error) {
            setUserReacted(emoji);
            setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
        }
    };

    // --- CANVAS ENGINE ---
    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        let frame = 0;
        const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
        for (let i = 0; i < 200; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: Math.random() * 2
            });
        }

        const animate = () => {
            frame++;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvasRef.current!.width = w;
            canvasRef.current!.height = h;

            const splitX = (balance / 100) * w;

            // BACKGROUND: Pure Yin (Black) and Pure Yang (White)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, splitX, h);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(splitX, 0, w - splitX, h);

            // FLUID LIQUID DIVIDER
            ctx.beginPath();
            ctx.moveTo(splitX, 0);
            for (let y = 0; y <= h; y += 10) {
                const noise = Math.sin(y * 0.01 + frame * 0.02) * 40;
                const distToMouse = Math.abs(y - mousePos.y);
                const repel = distToMouse < 240 ? (1 - distToMouse / 240) * (mousePos.x - splitX) * 0.4 : 0;
                ctx.lineTo(splitX + noise + repel, y);
            }
            ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // PARTICLES (Inverting based on side)
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                ctx.fillStyle = p.x < splitX ? '#FFFFFF' : '#000000';
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [balance, mousePos]);

    if (isIntro) {
        return (
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 overflow-hidden font-mono">
                <div className="relative w-48 h-48 border border-white/10 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white]" />
                    <div className="text-white text-[8px] tracking-[0.5em] uppercase">Initializing...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden font-sans selection:bg-white selection:text-black">
            {/* The World Layer */}
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

            {/* The Lens (Cursor) */}
            <div
                className="fixed z-[100] pointer-events-none mix-blend-difference flex items-center justify-center transition-transform duration-75"
                style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
            >
                <div className="w-10 h-10 rounded-full border border-white opacity-50" />
                <div className="absolute w-1 h-1 bg-white rounded-full" />
            </div>

            {/* MAIN CONTENT WRAPPER - Apply Difference Mode here */}
            <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row" style={{ mixBlendMode: 'difference' }}>

                {/* YIN COLUMN (ORIGIN) */}
                <section className="flex-1 flex flex-col justify-center p-8 lg:p-24 h-screen lg:h-auto pointer-events-none">
                    <div className="max-w-xl transition-all duration-700 delay-100 pointer-events-auto" style={{ opacity: Math.max(0.4, (100 - balance) / 100) }}>
                        <h2 className="text-white/50 text-[10px] font-mono tracking-[0.6em] mb-4 uppercase">IDENTITY_FRAGMENT</h2>
                        <h1 className="text-white text-7xl lg:text-9xl font-black tracking-tighter mb-4 leading-none uppercase">
                            {profile.name.split(' ')[0]}<br />
                            <span className="opacity-30">{profile.name.split(' ')[1] || ''}</span>
                        </h1>
                        <p className="text-white text-xl lg:text-2xl font-serif italic leading-relaxed mb-12 opacity-90">
                            {profile.bio}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-12">
                            {Object.entries(profile.socials || {})
                                .filter(([_, value]) => value && typeof value === 'string' && value.trim() !== '')
                                .map(([k, v]) => (
                                    <a
                                        key={k}
                                        className="px-8 py-3 bg-white text-black font-mono text-[9px] uppercase tracking-[0.2em] font-bold hover:scale-110 hover:shadow-[0_0_20px_white] transition-all cursor-pointer pointer-events-auto"
                                        href={v as string}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        [{k}]
                                    </a>
                                ))}
                        </div>

                        {/* NEW REACTIONS BAR */}
                        <div className="mt-16 pt-8 border-t border-white/5">
                            <h2 className="text-white/30 text-[9px] font-mono tracking-[0.4em] mb-6 uppercase">Resonating_Frequencies</h2>
                            <div className="flex gap-4">
                                {activeEmojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleReact(emoji)}
                                        className={`flex flex-col items-center gap-2 group transition-all duration-500 ${userReacted === emoji ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
                                    >
                                        <span className={`text-2xl transition-transform duration-500 group-hover:scale-125 ${userReacted === emoji ? 'drop-shadow-[0_0_10px_white]' : ''}`}>{emoji}</span>
                                        <span className="text-[10px] font-mono text-white/50">{reactions[emoji] || 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* YANG COLUMN (ARCHIVE) */}
                <section className="flex-1 flex flex-col justify-center p-8 lg:p-24 h-screen lg:h-auto items-end text-right overflow-y-auto pointer-events-none">
                    <div className="w-full max-w-xl transition-all duration-700 pointer-events-auto" style={{ opacity: Math.max(0.4, balance / 100) }}>
                        <h2 className="text-white/50 text-[10px] font-mono tracking-[0.6em] mb-8 uppercase">SYSTEM_ARCHIVE</h2>
                        <div className="space-y-12 lg:space-y-16">
                            {data.map((item, i) => (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block border-b border-white/10 pb-10 hover:border-white transition-all cursor-pointer pointer-events-auto no-underline"
                                    onClick={(e) => {
                                        // We let the link work normally, but call the tracking func
                                        onLinkClick(item.id);
                                    }}
                                >
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-[10px] font-mono text-white/30 tracking-widest group-hover:text-white transition-colors">0{i + 1}_LOG</span>
                                        <h3 className="text-white text-4xl lg:text-7xl font-black tracking-tighter transition-all group-hover:italic group-hover:-translate-x-6">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-white text-sm opacity-0 group-hover:opacity-60 transition-all duration-500 max-w-sm ml-auto font-mono uppercase tracking-tight">
                                        {item.description}
                                    </p>
                                </a>
                            ))}
                        </div>

                        {/* INTEGRATED GUESTBOOK */}
                        <div className="mt-32 pt-16 border-t border-white/5">
                            <h2 className="text-white/30 text-[9px] font-mono tracking-[0.4em] mb-12 uppercase">Temporal_Transmissions</h2>
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/5 p-8 rounded-sm">
                                <Guestbook isInline theme="YIN_YANG" />
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* HUD OVERLAY */}
            <div className="fixed bottom-12 left-12 mix-blend-difference text-white/20 text-[9px] font-mono tracking-[0.5em] z-50 pointer-events-none hidden lg:block">
                SYSTEM_STABLE // POS_{Math.round(balance)}% // VISITORS_{visitorCount.toLocaleString()} // V_9.3
            </div>

            <div className="fixed top-8 left-1/2 -translate-x-1/2 mix-blend-difference text-white/20 text-[10px] font-mono tracking-[1.5em] z-50 pointer-events-none uppercase">
                SINGULARITY
            </div>
        </div>
    );
};

export default YinYangTheme;
