import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../supabase';
import Guestbook from '../Guestbook';
import { SplineScene } from '../ui/spline';
import { Spotlight } from '../ui/spotlight';

interface JujutsuThemeProps {
    data: any[];
    profile: any;
    onLinkClick: (id: string) => void;
    onEditProfile: (newProfile: any) => void;
    isAdmin?: boolean;
}

type JujutsuCharacter = 'YUJI' | 'SUKUNA' | 'CHOSO';

const JUJUTSU_CHARS: Record<JujutsuCharacter, {
    name: string;
    kanji: string;
    designation: string;
    quote: string;
    color: string;
    glow: string;
    particles: 'CURSED' | 'SLASHES' | 'BLOOD';
    accent: string;
    image: string;
    scene: string;
}> = {
    YUJI: {
        name: 'Yuji Itadori',
        kanji: '虎杖 悠仁',
        designation: 'Vessel of Sukuna',
        quote: 'I don\'t know how I\'ll feel when I\'m dead, but I don\'t want to regret the way I lived.',
        color: '#0ea5e9', // Cursed blue energy
        glow: 'rgba(14,165,233,0.3)',
        accent: '#f43f5e', // Pink hair accent
        particles: 'CURSED',
        image: '/yuji_illustration.png',
        scene: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
    },
    SUKUNA: {
        name: 'Ryomen Sukuna',
        kanji: '両面 宿儺',
        designation: 'King of Curses',
        quote: 'Know your place, fool. Any hierarchy other than strength is boring.',
        color: '#dc2626', // Blood crimson
        glow: 'rgba(220,38,38,0.4)',
        accent: '#7c1a22',
        particles: 'SLASHES',
        image: '/sukuna_illustration.png',
        scene: 'https://prod.spline.design/p8Fp0lG-5lS7f4uC/scene.splinecode'
    },
    CHOSO: {
        name: 'Choso',
        kanji: '脹相',
        designation: 'Death Painting Womb',
        quote: 'I am the oldest of the ten brothers. I must protect them.',
        color: '#991b1b', // Dried blood maroon
        glow: 'rgba(153,27,27,0.35)',
        accent: '#facc15', // Purple-yellow blood manipulation accent
        particles: 'BLOOD',
        image: '/choso_illustration.png',
        scene: 'https://prod.spline.design/6Wq1Q7YRyKZo-3x5/scene.splinecode'
    }
};

const JujutsuTheme: React.FC<JujutsuThemeProps> = ({ data, profile, onLinkClick }) => {
    const [isIntro, setIsIntro] = useState(true);
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [reactions, setReactions] = useState<Record<string, number>>({});
    const [userReacted, setUserReacted] = useState<string | null>(null);
    const [selectedChar, setSelectedChar] = useState<JujutsuCharacter>('YUJI');
    const [blackFlashStrike, setBlackFlashStrike] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const lookOffset = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number>();

    // 3D Card Hover Perspective states
    const cardRef = useRef<HTMLDivElement>(null);
    const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
    const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

    const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;

        // Pitch & Yaw tilt angles
        const rotX = ((y - height / 2) / (height / 2)) * -12; 
        const rotY = ((x - width / 2) / (width / 2)) * 12;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`,
            transition: 'transform 0.08s ease-out'
        });

        // Specular glow reflection coordinates
        const pctX = (x / width) * 100;
        const pctY = (y / height) * 100;

        setGlareStyle({
            opacity: 0.18,
            background: `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            transition: 'opacity 0.08s ease-out'
        });
    };

    const handleMouseLeaveCard = () => {
        setTiltStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.5s ease-out'
        });
        setGlareStyle({
            opacity: 0,
            transition: 'all 0.5s ease-out'
        });
    };
    
    // Emojis for JJK
    const jjkEmojis = ['🤞', '👹', '💀', '🔥', '🩸', '🥋'];

    // --- CURSOR AND MOVEMENT TRACKING ---
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // --- INTRO DISPLAY ---
    useEffect(() => {
        const timer = setTimeout(() => setIsIntro(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // --- FETCH SYNCED METRICS ---
    useEffect(() => {
        const fetchData = async () => {
            const { data: visData } = await supabase.from('analytics').select('count').eq('key', 'total_visits').maybeSingle();
            if (visData) setVisitorCount(visData.count);

            const { data: reactData } = await supabase.from('reactions').select('*');
            if (reactData) {
                const counts: Record<string, number> = {};
                reactData.forEach(r => counts[r.emoji] = r.count);
                setReactions(counts);
            }
        };

        fetchData();
        const channel = supabase.channel('jjk-theme-sync')
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

    // --- RENDERING CANVAS ENGINE ---
    useEffect(() => {
        if (!canvasRef.current || isIntro) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        let lastTime = performance.now();

        // 1. Setup Yuji's Cursed Particles
        const yujiParticles: any[] = [];
        for (let i = 0; i < 60; i++) {
            yujiParticles.push({
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + Math.random() * 200,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2.0 - 0.5,
                r: Math.random() * 3.0 + 1.5,
                o: Math.random() * 0.4 + 0.1,
                growth: Math.random() * 0.02 - 0.01
            });
        }

        // 2. Setup Sukuna's Slash markers
        const slashCuts: any[] = [];
        const initSlash = () => ({
            x1: Math.random() * window.innerWidth,
            y1: Math.random() * window.innerHeight,
            angle: Math.random() * Math.PI * 2,
            length: Math.random() * 120 + 60,
            progress: 0,
            speed: Math.random() * 5 + 3,
            opacity: Math.random() * 0.6 + 0.2,
            glow: Math.random() > 0.4
        });
        for (let i = 0; i < 8; i++) slashCuts.push(initSlash());

        // 3. Setup Choso's Blood cells
        const bloodCells: any[] = [];
        for (let i = 0; i < 70; i++) {
            bloodCells.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 1.2 + 0.8,
                r: Math.random() * 4.0 + 2.0,
                pulse: Math.random() * Math.PI
            });
        }

        // 4. Black Flash strike lightning renderer helper
        const renderLightning = (x: number, y: number, color: string) => {
            ctx.save();
            ctx.shadowBlur = 35;
            ctx.shadowColor = '#000000';
            
            // Draw central Black Flash core
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x, y);

            let curX = x;
            let curY = y;
            const segments = 12;
            const stepY = (window.innerHeight - y) / segments;

            for (let i = 1; i <= segments; i++) {
                curX += (Math.random() - 0.5) * 110;
                curY += stepY;
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();

            // Glow outlines (flashing red and cyan)
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.stroke();

            ctx.restore();
        };

        const renderFrame = (currentTime: number) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
            lastTime = currentTime;

            const w = window.innerWidth;
            const h = window.innerHeight;

            // Clear Screen
            ctx.fillStyle = '#020205';
            ctx.fillRect(0, 0, w, h);

            if (selectedChar === 'YUJI') {
                // Render Cursed Energy updrift
                ctx.save();
                yujiParticles.forEach(p => {
                    p.y += p.vy * 50 * dt;
                    p.x += p.vx * 30 * dt;
                    p.r = Math.max(0.5, p.r + p.growth);

                    if (p.y < -20) {
                        p.y = h + Math.random() * 100;
                        p.x = Math.random() * w;
                        p.r = Math.random() * 3.0 + 1.5;
                    }

                    // Draw blue flame circles
                    ctx.fillStyle = '#0ea5e9';
                    ctx.globalAlpha = p.o * (1 - p.y / h);
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#0284c7';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.restore();

                // Draw Black Flash lightning strike if clicked
                if (blackFlashStrike.active) {
                    renderLightning(blackFlashStrike.x, blackFlashStrike.y, '#f43f5e');
                }
            } 
            else if (selectedChar === 'SUKUNA') {
                // Render Cleave & Dismantle slice scars
                ctx.save();
                slashCuts.forEach((s, idx) => {
                    s.progress += s.speed * dt;
                    if (s.progress >= 1) {
                        slashCuts[idx] = initSlash();
                        return;
                    }

                    const startX = s.x1;
                    const startY = s.y1;
                    const endX = s.x1 + Math.cos(s.angle) * s.length;
                    const endY = s.y1 + Math.sin(s.angle) * s.length;

                    const curCutX = startX + (endX - startX) * s.progress;
                    const curCutY = startY + (endY - startY) * s.progress;

                    // Slashing red slash line
                    ctx.strokeStyle = '#dc2626';
                    ctx.lineWidth = s.glow ? 2.0 : 1.0;
                    ctx.globalAlpha = s.opacity * (1 - s.progress);
                    if (s.glow) {
                        ctx.shadowBlur = 12;
                        ctx.shadowColor = '#dc2626';
                    }
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(curCutX, curCutY);
                    ctx.stroke();
                });
                ctx.restore();
            } 
            else if (selectedChar === 'CHOSO') {
                // Render Blood Manipulation cell drift
                ctx.save();
                bloodCells.forEach(cell => {
                    cell.pulse += dt * 3.5;

                    // Compute vector towards cursor to gravitate cells
                    const dx = mouseRef.current.x - cell.x;
                    const dy = mouseRef.current.y - cell.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 280) {
                        const strength = (1 - dist / 280) * 70;
                        cell.x += (dx / dist) * strength * dt;
                        cell.y += (dy / dist) * strength * dt;
                    }

                    // Default vertical blood drop flow
                    cell.y += cell.vy * 40 * dt;
                    cell.x += cell.vx * 20 * dt;

                    if (cell.y > h + 10) {
                        cell.y = -20;
                        cell.x = Math.random() * w;
                    }

                    const size = cell.r + Math.sin(cell.pulse) * 1.2;

                    // Draw organic red cell
                    ctx.fillStyle = '#7f1d1d';
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = '#991b1b';
                    ctx.globalAlpha = 0.50;
                    ctx.beginPath();
                    ctx.arc(cell.x, cell.y, size, 0, Math.PI * 2);
                    ctx.fill();

                    // Inner highlight
                    ctx.fillStyle = '#b91c1c';
                    ctx.globalAlpha = 0.7;
                    ctx.beginPath();
                    ctx.arc(cell.x - size * 0.25, cell.y - size * 0.25, size * 0.35, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.restore();
            }

            requestRef.current = requestAnimationFrame(renderFrame);
        };

        requestRef.current = requestAnimationFrame(renderFrame);
        return () => {
            cancelAnimationFrame(requestRef.current!);
            window.removeEventListener('resize', handleResize);
        };
    }, [isIntro, selectedChar, blackFlashStrike]);

    // Handle clicks to trigger divergent/black flash bursts
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (selectedChar !== 'YUJI') return;
        setBlackFlashStrike({ x: e.clientX, y: e.clientY, active: true });
        setTimeout(() => setBlackFlashStrike(prev => ({ ...prev, active: false })), 600);
    };

    if (isIntro) {
        return (
            <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
                <div className="relative animate-pulse mb-8">
                    <span className="text-[120px] font-black text-red-600 opacity-20 antialiased font-serif">呪術廻戦</span>
                </div>
                <h1 className="text-white text-[9px] font-mono tracking-[2em] uppercase opacity-40">Cursed Energy Manifestation</h1>
            </div>
        );
    }

    const currentChar = JUJUTSU_CHARS[selectedChar];

    return (
        <div 
            className="relative min-h-screen w-full bg-[#020205] overflow-x-hidden text-neutral-100 font-serif selection:bg-red-600 selection:text-white cursor-none"
            style={{ '--theme-color': currentChar.color } as any}
            onClick={handleCanvasClick}
        >
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

            {/* CHARACTER SELECTOR SIDEBAR */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
                {Object.keys(JUJUTSU_CHARS).map((key) => {
                    const char = JUJUTSU_CHARS[key as JujutsuCharacter];
                    const active = selectedChar === key;
                    return (
                        <button
                            key={key}
                            onClick={(e) => { e.stopPropagation(); setSelectedChar(key as JujutsuCharacter); }}
                            className={`group relative w-12 h-12 rounded-sm border transition-all duration-300 bg-zinc-950/80 flex items-center justify-center ${active ? 'scale-110 shadow-[0_0_15px_var(--theme-color)]' : 'opacity-40 hover:opacity-100'}`}
                            style={{ borderColor: active ? currentChar.color : 'rgba(255,255,255,0.08)' }}
                        >
                            <span className="text-xl select-none" style={{ color: char.color }}>{key[0]}</span>
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-950/95 border px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap" style={{ borderColor: `${char.color}30` }}>
                                {char.name} <span className="text-[7px] text-white/30">({char.designation})</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* CINEMATIC BARS */}
            <div className="fixed top-0 left-0 w-full h-12 bg-black/90 backdrop-blur-md z-50 border-b flex items-center px-8 lg:px-12 justify-between" style={{ borderColor: `${currentChar.color}15` }}>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono tracking-[0.8em] uppercase italic" style={{ color: currentChar.color }}>
                        {currentChar.name} // {currentChar.designation}
                    </span>
                    {selectedChar === 'YUJI' && <span className="text-[7px] font-mono text-white/30 tracking-[0.1em] animate-pulse">[CLICK BACKGROUND FOR BLACK FLASH]</span>}
                </div>
                <span className="text-[9px] font-mono tracking-[0.8em] opacity-50 uppercase hidden md:inline">SYSTEM: {profile.name}</span>
            </div>

            <div className="fixed bottom-0 left-0 w-full h-12 bg-black/90 backdrop-blur-md z-50 border-t flex items-center px-8 lg:px-12 justify-between" style={{ borderColor: `${currentChar.color}15` }}>
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase italic truncate max-w-2xl text-white/60" style={{ borderLeftColor: currentChar.color }}>"{currentChar.quote}"</span>
                <span className="text-[9px] font-mono font-black uppercase tracking-wider hidden sm:inline" style={{ color: currentChar.color }}>JUJUTSU_VESSEL</span>
            </div>

            {/* MAIN TWO-COLUMN CONTENT LAYER WITH MOTION */}
            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 pointer-events-none">
                
                {/* Left Section: Info Cards, Socials, Links (Staggered Animation) */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-1/2 space-y-12 pointer-events-auto text-left select-text"
                >
                    <header className="space-y-6">
                        <div className="relative inline-block">
                            <span className="text-7xl lg:text-[110px] font-sans font-black text-white/5 select-none absolute -top-8 -left-4 whitespace-nowrap tracking-widest">{currentChar.kanji}</span>
                            <h1 className="text-5xl lg:text-7xl font-sans font-black italic tracking-tighter uppercase leading-[0.9] relative text-white">
                                {profile.name}
                            </h1>
                        </div>
                        
                        <p className="text-lg lg:text-2xl font-light italic text-neutral-400 font-serif leading-relaxed">
                            "{profile.bio}"
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            {Object.entries(profile.socials || {})
                                .filter(([_, val]) => val && typeof val === 'string' && val.trim() !== '')
                                .map(([key, val]) => (
                                    <a 
                                        key={key} 
                                        href={val as string} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="group relative px-6 py-2.5 bg-black/85 border border-white/5 overflow-hidden transition-all duration-300 rounded-sm"
                                    >
                                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ backgroundColor: `${currentChar.color}15` }} />
                                        <span className="relative text-[9px] font-mono tracking-[0.3em] uppercase font-bold text-neutral-400 group-hover:text-white transition-colors">{key}</span>
                                    </a>
                                ))}
                        </div>
                    </header>

                    {/* Pathways list */}
                    <div className="space-y-6">
                        <h2 className="text-[10px] font-mono tracking-[1.2em] text-zinc-500 uppercase font-black border-b border-white/5 pb-3">Cursed_Pathways</h2>
                        <div className="space-y-4">
                            {data.map((item, i) => (
                                <a
                                    key={item.id} 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={() => onLinkClick(item.id)}
                                    className="group block relative overflow-hidden bg-zinc-950/40 border border-white/5 rounded-sm hover:border-cyan-500/30 transition-all duration-300"
                                    style={{ hoverBorderColor: `${currentChar.color}40` } as any}
                                >
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" style={{ backgroundColor: `${currentChar.color}05` }} />
                                    <div className="relative p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                        <div className="text-3xl font-sans font-black italic opacity-5 group-hover:opacity-20 transition-all" style={{ color: currentChar.color }}>0{i + 1}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl lg:text-3xl font-sans font-black italic uppercase tracking-tight text-neutral-300 group-hover:text-white transition-colors">
                                                    {item.title}
                                                </h3>
                                                <span className="text-[8px] font-mono px-2 py-0.5 border border-white/10 text-white/30 tracking-widest uppercase">{item.category}</span>
                                            </div>
                                            <p className="mt-2 text-zinc-500 group-hover:text-zinc-300 transition-colors font-serif italic text-xs lg:text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="text-2xl opacity-20 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300" style={{ color: currentChar.color }}>🤞</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Section: Large Character Visual Projection (Framer Motion spring switch) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center h-[55vh] lg:h-[75vh] min-h-[400px] relative pointer-events-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedChar}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -40, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            className="relative w-full max-w-[380px] aspect-[3/4] flex items-center justify-center"
                        >
                            {/* Colorful background radial aura glow */}
                            <div 
                                className="absolute inset-0 rounded-full blur-[100px] opacity-25 animate-pulse transition-colors duration-500" 
                                style={{ backgroundColor: currentChar.color }} 
                            />

                            {/* Framing box outline (Tilting container) */}
                            <div 
                                ref={cardRef}
                                onMouseMove={handleMouseMoveCard}
                                onMouseLeave={handleMouseLeaveCard}
                                style={tiltStyle}
                                className="border border-white/10 bg-black/80 backdrop-blur-sm rounded-sm relative group overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] w-full h-full flex items-center justify-center select-none"
                            >
                                {/* Aceternity/Ibelick Mouse-tracking Spotlight */}
                                <Spotlight 
                                    className="-top-40 left-0 md:left-24 md:-top-20"
                                    size={350}
                                />

                                {/* Cyber corner angles */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 z-10" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 z-10" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 z-10" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 z-10" />

                                {/* 3D Spline Scene or Sketchfab Embed overlay */}
                                <div className="w-full h-full z-0 p-2">
                                    {selectedChar === 'CHOSO' ? (
                                        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-sm bg-transparent">
                                            <iframe 
                                                title="Choso | Jujutsu Kaisen"
                                                className="w-full h-[calc(100%+80px)] -mt-[40px] border-0 pointer-events-auto"
                                                src="https://sketchfab.com/models/c07a003fa3ea4be98db98ad8e4e68506/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_watermark=0&ui_stop=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_ar=0&ui_help=0&dnt=1" 
                                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                                xr-spatial-tracking="true"
                                                execution-while-out-of-viewport="true"
                                                execution-while-not-rendered="true"
                                            />
                                        </div>
                                    ) : (
                                        <SplineScene 
                                            scene={currentChar.scene}
                                            className="w-full h-full"
                                        />
                                    )}
                                </div>

                                {/* Specular holographic sheen glare */}
                                <div 
                                    style={glareStyle}
                                    className="absolute inset-0 pointer-events-none z-20 mix-blend-color-dodge"
                                />

                                {/* Matrix scanning grid overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />
                            </div>

                            {/* Kanji visual element floating dynamically behind/near */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 0.15, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -bottom-6 -left-6 text-7xl font-sans font-black pointer-events-none tracking-widest select-none"
                                style={{ color: currentChar.color }}
                            >
                                {currentChar.kanji}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* DATA STATISTICS SECTION */}
            <div className="relative z-20 container mx-auto px-6">
                <div className="mb-32 grid grid-cols-2 lg:grid-cols-4 gap-8 text-left border-y border-white/5 py-10 w-full max-w-4xl mx-auto">
                    {[
                        { label: 'Visits Synced', val: visitorCount.toLocaleString() },
                        { label: 'Cursed Classification', val: currentChar.designation },
                        { label: 'Domain Mode', val: selectedChar === 'YUJI' ? 'DIVERGENT_FIST' : selectedChar === 'SUKUNA' ? 'MALEVOLENT_SHRINE' : 'BLOOD_MANIPULATION' },
                        { label: 'Vessel Identity', val: profile.name }
                    ].map(s => (
                        <div key={s.label}>
                            <div className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">{s.label}</div>
                            <div className="text-base font-bold tracking-tight uppercase transition-colors font-sans" style={{ color: currentChar.color }}>{s.val}</div>
                        </div>
                    ))}
                </div>

                {/* REACTIONS GRID & GUESTBOOK INLINE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto text-left pb-32 pointer-events-auto">
                    <div>
                        <div className="mb-10">
                            <h2 className="text-[10px] font-mono tracking-[0.8em] text-zinc-500 uppercase mb-4 font-black">Cursed_Resonance</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            {jjkEmojis.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={(e) => { e.stopPropagation(); handleReact(emoji); }}
                                    className={`group flex flex-col items-center justify-center p-6 bg-zinc-950/60 border border-white/5 transition-all duration-300 relative overflow-hidden rounded-sm ${userReacted === emoji ? 'shadow-[0_0_20px_var(--theme-color)]' : 'hover:border-white/10'}`}
                                    style={{ borderColor: userReacted === emoji ? currentChar.color : 'rgba(255,255,255,0.04)' }}
                                >
                                    <span className={`text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 ${userReacted === emoji ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-90'}`}>{emoji}</span>
                                    <span className="text-[10px] font-mono font-black text-neutral-500 group-hover:text-white" style={{ color: userReacted === emoji ? currentChar.color : 'inherit' }}>{reactions[emoji] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-white/5 p-8 lg:p-12 shadow-2xl border-t-2 transition-all duration-300 rounded-sm" style={{ borderTopColor: currentChar.color }}>
                        <h2 className="text-[10px] font-mono tracking-[0.8em] text-neutral-300 uppercase mb-8 font-black">Curse_Transmissions</h2>
                        <Guestbook isInline theme="JUJUTSU" />
                    </div>
                </div>
            </div>

            {/* HIGH-TECH CURSOR */}
            <div
                ref={cursorRef}
                className="fixed z-[100] pointer-events-none mix-blend-difference will-change-transform hidden lg:block"
                style={{ left: 0, top: 0, transform: 'translate3d(-100px, -100px, 0)' }}
            >
                <div className="relative w-12 h-12 border border-white/10 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite]">
                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_var(--theme-color)]" style={{ backgroundColor: currentChar.color }} />
                    <div className="absolute w-2 h-2 border-t-2 border-r-2 rounded-sm" style={{ borderColor: currentChar.color, transform: 'translateY(-20px) rotate(45deg)' }} />
                    <div className="absolute w-2 h-2 border-b-2 border-l-2 rounded-sm" style={{ borderColor: currentChar.color, transform: 'translateY(20px) rotate(45deg)' }} />
                </div>
            </div>

            <style>{`
                @keyframes ripple {
                    from { width: 0; height: 0; transform: translate(-50%, -50%); opacity: 1; }
                    to { width: 1500px; height: 1500px; transform: translate(-50%, -50%); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default JujutsuTheme;
