
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import Guestbook from '../Guestbook';
import { ThemeType } from '../../types';

interface AkatsukiThemeProps {
    data: any[];
    profile: any;
    onLinkClick: (id: string) => void;
    onEditProfile: (newProfile: any) => void;
}

type AkatsukiCharacter = 'ITACHI' | 'PAIN' | 'OBITO' | 'SASUKE' | 'MADARA';

const CHARACTERS: Record<AkatsukiCharacter, {
    name: string;
    eye: string;
    quote: string;
    rank: string;
    color: string;
    glow: string;
    trait: 'FEATHERS' | 'GRAVITY' | 'KAMUI' | 'CHIDORI' | 'EMBERS';
    offset?: { x: number; y: number };
    bloodline: string;
}> = {
    ITACHI: { name: 'Itachi Uchiha', eye: '/itachi_sharinga_15322269.png', quote: 'Forgive me, Sasuke. This is the end.', rank: 'S-Class', color: '#ff0000', glow: 'rgba(255,0,0,0.4)', trait: 'FEATHERS', bloodline: 'UCHIHA' },
    PAIN: { name: 'Pain', eye: '/pain_rinnegan.png', quote: 'The world shall know pain.', rank: 'God-Class', color: '#b8a1cf', glow: 'rgba(184,161,207,0.4)', trait: 'GRAVITY', bloodline: 'UZUMAKI' },
    OBITO: { name: 'Obito Uchiha', eye: '/obito_sharinga_15322269.png', quote: 'I am no one. I don\'t want to be anyone.', rank: 'S-Class', color: '#ff4d00', glow: 'rgba(255,77,0,0.4)', trait: 'KAMUI', bloodline: 'UCHIHA' },
    SASUKE: { name: 'Sasuke Uchiha', eye: '/sasuke_sharinga_15322269.png', quote: 'I have closed my eyes... My only goal is in the darkness.', rank: 'S-Class', color: '#ff0055', glow: 'rgba(255,0,85,0.4)', trait: 'CHIDORI', offset: { x: 0.12, y: 0.12 }, bloodline: 'UCHIHA' },
    MADARA: { name: 'Madara Uchiha', eye: '/madara_sharinga_12422269.png', quote: 'Wake up to reality.', rank: 'Legend-Class', color: '#880000', glow: 'rgba(136,0,0,0.4)', trait: 'EMBERS', bloodline: 'UCHIHA' },
};

const AkatsukiTheme: React.FC<AkatsukiThemeProps> = ({ data, profile, onLinkClick }) => {
    const [isIntro, setIsIntro] = useState(true);
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [reactions, setReactions] = useState<Record<string, number>>({});
    const [userReacted, setUserReacted] = useState<string | null>(null);
    const [ripple, setRipple] = useState<{ x: number, y: number, active: boolean }>({ x: 0, y: 0, active: false });
    const [selectedChar, setSelectedChar] = useState<AkatsukiCharacter>('ITACHI');
    const [sasukeEyeMode, setSasukeEyeMode] = useState<'SHARINGAN' | 'RINNEGAN'>('RINNEGAN');
    const sasukeModeRef = useRef<'SHARINGAN' | 'RINNEGAN'>('RINNEGAN');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const eyeImages = useRef<Record<string, HTMLImageElement>>({});
    const [imagesReady, setImagesReady] = useState(false);
    const mouseRef = useRef({ x: 0, y: 0 });
    const lookOffset = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number>();
    const activeEmojis = ['🌑', '👁️', '☁️', '📜', '💍', '叛'];

    // --- INPUT ENGINE (Movement & Toggles) ---
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'v') {
                const nextMode = sasukeModeRef.current === 'SHARINGAN' ? 'RINNEGAN' : 'SHARINGAN';
                sasukeModeRef.current = nextMode;
                setSasukeEyeMode(nextMode);
            }
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // --- ASSET LOADING (Robust) ---
    useEffect(() => {
        const keys = Object.keys(CHARACTERS);
        let loaded = 0;
        keys.forEach(key => {
            const img = new Image();
            img.src = CHARACTERS[key as AkatsukiCharacter].eye;
            img.onload = () => {
                eyeImages.current[key] = img;
                loaded++;
                if (loaded === keys.length) setImagesReady(true);
            };
            img.onerror = () => {
                loaded++;
                if (loaded === keys.length) setImagesReady(true);
            };
        });
    }, []);

    // --- INTRO ---
    useEffect(() => {
        const timer = setTimeout(() => setIsIntro(false), 3500);
        return () => clearTimeout(timer);
    }, []);

    // --- DATA ---
    useEffect(() => {
        const fetchData = async () => {
            const { data: visData } = await supabase.from('analytics').select('count').eq('key', 'total_visits').single();
            if (visData) setVisitorCount(visData.count);

            const { data: reactData } = await supabase.from('reactions').select('*');
            if (reactData) {
                const counts: Record<string, number> = {};
                reactData.forEach(r => counts[r.emoji] = r.count);
                setReactions(counts);
            }
        };
        fetchData();
        const channel = supabase.channel('akatsuki-hybrid-eyes')
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

    // --- CANVAS ENGINE (ULTRA-FLUID 144Hz+ ARCHITECTURE) ---
    useEffect(() => {
        if (!canvasRef.current || isIntro) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false }); // Performance optimization
        if (!ctx) return;

        // High-DPI Scaling Logic
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };
        handleResize();
        window.addEventListener('resize', handleResize, { passive: true });

        let lastTime = performance.now();
        let blinkProgress = 1;
        let blinkPhase: 'IDLE' | 'CLOSING' | 'OPENING' = 'IDLE';

        // Pre-generate physics objects
        const particles: any[] = [];
        const trait = CHARACTERS[selectedChar].trait;
        for (let i = 0; i < 60; i++) particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            s: Math.random() * 2 + 1,
            v: Math.random() * 80 + 40,
            a: Math.random() * Math.PI * 2,
            rot: Math.random() * 1.5 + 0.5
        });

        const rain: any[] = [];
        for (let i = 0; i < 120; i++) rain.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            l: Math.random() * 20 + 20,
            v: Math.random() * 700 + 400,
            o: Math.random() * 0.15 + 0.05,
            c: i % 12 === 0 ? CHARACTERS[selectedChar].color : '#ffffff'
        });

        const drawTomoe = (x: number, y: number, radius: number, rotation: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            // Tail
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.bezierCurveTo(radius, radius * 1.2, -radius * 0.4, radius * 1.8, -radius * 1.1, radius);
            ctx.bezierCurveTo(-radius * 0.8, radius * 0.5, 0, radius * 0.7, 0, 0);
            ctx.fill();
            ctx.restore();
        };

        const drawProceduralRinnegan = (baseSize: number, maxRadius: number, showTomoe: boolean) => {
            ctx.strokeStyle = '#000000';
            const spacing = baseSize * 0.35;
            const ringCount = Math.ceil(maxRadius / spacing);

            for (let i = 1; i <= ringCount; i++) {
                const ringRadius = spacing * i;
                ctx.lineWidth = baseSize * 0.045;
                ctx.globalAlpha = Math.max(0.1, 1 - (i * 0.08));
                ctx.beginPath();
                ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
                ctx.stroke();

                if (showTomoe && (i === 1 || i === 2)) {
                    const tomoeCount = 3;
                    for (let t = 0; t < tomoeCount; t++) {
                        const angle = (t * (Math.PI * 2) / tomoeCount) - (Math.PI / 2);
                        const tx = Math.cos(angle) * ringRadius;
                        const ty = Math.sin(angle) * ringRadius;
                        ctx.globalAlpha = 0.95;
                        drawTomoe(tx, ty, baseSize * 0.065, angle + Math.PI / 1.8);
                    }
                }
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#100c14';
            ctx.beginPath(); ctx.arc(0, 0, baseSize * 0.15, 0, Math.PI * 2); ctx.fill();
        };

        const drawUltimateEye = (x: number, y: number, size: number, opacity: number, blink: number, look: { x: number, y: number }) => {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.translate(x, y);

            const eyeW = size * 2.8;
            const eyeH = size * 1.4;
            const smoothedBlink = Math.sin(blink * Math.PI / 2);
            const currentH = eyeH * smoothedBlink;

            if (blink > 0.05) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(-eyeW, 0);
                ctx.quadraticCurveTo(0, -currentH, eyeW, 0);
                ctx.quadraticCurveTo(0, currentH, -eyeW, 0);
                ctx.clip();

                const isPain = selectedChar === 'PAIN';
                const isSasuke = selectedChar === 'SASUKE';
                const showSasukeRinnegan = isSasuke && sasukeModeRef.current === 'RINNEGAN';

                if (isPain || showSasukeRinnegan) {
                    const painGrad = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, eyeW);
                    painGrad.addColorStop(0, '#c7b3e0');
                    painGrad.addColorStop(1, '#a68fc7');
                    ctx.fillStyle = painGrad;
                    ctx.fillRect(-eyeW, -eyeH, eyeW * 2, eyeH * 2);
                } else {
                    const scleraGrad = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, eyeW);
                    scleraGrad.addColorStop(0, '#0a0808');
                    scleraGrad.addColorStop(1, '#020101');
                    ctx.fillStyle = scleraGrad;
                    ctx.fillRect(-eyeW, -eyeH, eyeW * 2, eyeH * 2);
                }

                ctx.save();
                ctx.translate(look.x * (eyeW * 0.32), look.y * (eyeH * 0.28));

                const img = eyeImages.current[selectedChar];

                if (isPain) {
                    drawProceduralRinnegan(size, eyeW * 1.5, false);
                } else if (showSasukeRinnegan) {
                    drawProceduralRinnegan(size, eyeW * 1.5, true);
                } else if (img && img.complete) {
                    const offX = (CHARACTERS[selectedChar].offset?.x || 0) * size;
                    const offY = (CHARACTERS[selectedChar].offset?.y || 0) * size;
                    ctx.drawImage(img, -size + offX, -size + offY, size * 2, size * 2);
                }

                // depth overlays (Batched)
                ctx.save();
                ctx.globalCompositeOperation = 'overlay';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.15;
                ctx.beginPath();
                for (let i = 0; i < 30; i++) {
                    const ang = (i / 30) * Math.PI * 2;
                    ctx.moveTo(Math.cos(ang) * size * 0.4, Math.sin(ang) * size * 0.4);
                    ctx.lineTo(Math.cos(ang) * size * 0.95, Math.sin(ang) * size * 0.95);
                }
                ctx.stroke();
                ctx.restore();

                // Surface Reflection
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.12;
                ctx.beginPath(); ctx.ellipse(-size * 0.4, -size * 0.4, size * 0.15, size * 0.25, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();

                ctx.restore(); // Irir pivot
                ctx.restore(); // Clipping
            }

            // Eyelid Outlines
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(-eyeW, 0); ctx.quadraticCurveTo(0, -currentH, eyeW, 0); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-eyeW, 0); ctx.quadraticCurveTo(0, currentH, eyeW, 0); ctx.stroke();

            ctx.restore();
        };

        const animate = (currentTime: number) => {
            const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05); // Cap delta to prevent jumps
            lastTime = currentTime;

            const w = window.innerWidth;
            const h = window.innerHeight;

            // Blink Logic
            if (blinkPhase === 'IDLE' && Math.random() < 0.003) blinkPhase = 'CLOSING';
            const blinkSpeed = 7.5;
            if (blinkPhase === 'CLOSING') {
                blinkProgress = Math.max(0, blinkProgress - blinkSpeed * deltaTime);
                if (blinkProgress === 0) blinkPhase = 'OPENING';
            } else if (blinkPhase === 'OPENING') {
                blinkProgress = Math.min(1, blinkProgress + blinkSpeed * deltaTime);
                if (blinkProgress === 1) blinkPhase = 'IDLE';
            }

            const centerX = w / 2;
            const centerY = h / 2 - 40;

            // Physics aware lerp for "Look"
            const targetLookX = (mouseRef.current.x - centerX) / centerX;
            const targetLookY = (mouseRef.current.y - centerY) / centerY;
            const lerpVal = 1 - Math.exp(-12 * deltaTime); // More responsive 12.0 constant
            lookOffset.current.x += (targetLookX - lookOffset.current.x) * lerpVal;
            lookOffset.current.y += (targetLookY - lookOffset.current.y) * lerpVal;

            // 1. CLEAR FRAME
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = '#010101';
            ctx.fillRect(0, 0, w, h);

            // 2. RENDER RAIN (BATCHED BY COLOR)
            const rainColor = CHARACTERS[selectedChar].color;
            const rainGroups: Record<string, any[]> = { '#ffffff': [], [rainColor]: [] };
            rain.forEach(r => {
                const color = r.c;
                if (!rainGroups[color]) rainGroups[color] = [];
                rainGroups[color].push(r);

                r.y += r.v * deltaTime;
                r.x -= (r.v * 0.12) * deltaTime;
                if (r.y > h) { r.y = -50; r.x = Math.random() * w; }
            });

            ctx.lineWidth = 1;
            Object.entries(rainGroups).forEach(([color, drops]) => {
                if (drops.length === 0) return;
                ctx.strokeStyle = color;
                ctx.beginPath();
                drops.forEach(r => {
                    ctx.globalAlpha = r.o; // Alpha change is cheap, stroke is expensive
                    ctx.moveTo(r.x, r.y);
                    ctx.lineTo(r.x - 2, r.y + r.l);
                });
                ctx.stroke();
            });

            // 3. RENDER PARTICLES (BATCHED)
            ctx.fillStyle = CHARACTERS[selectedChar].color;
            particles.forEach(p => {
                p.y -= p.v * deltaTime;
                p.a += p.rot * deltaTime;
                if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.a);
                ctx.globalAlpha = 0.25;

                if (trait === 'FEATHERS') {
                    ctx.beginPath(); ctx.ellipse(0, 0, p.s * 4, p.s, 0.4, 0, Math.PI * 2); ctx.fill();
                } else if (trait === 'EMBERS') {
                    ctx.beginPath(); ctx.arc(0, 0, p.s, 0, Math.PI * 2); ctx.fill();
                } else if (trait === 'KAMUI') {
                    ctx.beginPath(); ctx.moveTo(-p.s, -p.s); ctx.lineTo(p.s, 0); ctx.lineTo(0, p.s * 2); ctx.fill();
                } else if (trait === 'CHIDORI') {
                    ctx.fillStyle = '#a0c4ff'; ctx.fillRect(0, 0, p.s, p.s * 6);
                } else if (trait === 'GRAVITY') {
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.arc(0, 0, p.s * 5, 0, Math.PI * 2); ctx.stroke();
                }
                ctx.restore();
            });

            // 4. RENDER EYE
            const eyeSize = Math.min(w, h) * 0.28;
            drawUltimateEye(centerX, centerY, eyeSize, 0.22, blinkProgress, lookOffset.current);

            // 5. UPDATE CURSOR (MUST BE LAST FOR ZERO GAP)
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) translate(-50%, -50%)`;
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(requestRef.current!);
            window.removeEventListener('resize', handleResize);
        };
    }, [isIntro, selectedChar]);

    // --- RENDER MEMOIZATION (CRITICAL FOR 60FPS) ---
    const contentLayer = React.useMemo(() => {
        const currentChar = CHARACTERS[selectedChar];
        return (
            <div className="relative z-20 container mx-auto px-8 pt-40 pb-32 pointer-events-none children-auto-pointer">
                <header className="max-w-6xl mx-auto mb-48 flex flex-col items-center text-center">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 blur-[120px] opacity-20 animate-pulse transition-colors duration-1000" style={{ backgroundColor: currentChar.color }} />
                        <h1 className="text-8xl lg:text-[180px] font-black italic tracking-tighter uppercase leading-[0.8] relative text-white">
                            {profile.name}
                            <div className="absolute top-1/2 left-0 w-full h-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] -rotate-1 skew-x-12 animate-[scratch_3s_ease-in-out_infinite] transition-colors duration-500" style={{ backgroundColor: currentChar.color }} />
                        </h1>
                    </div>

                    <div className="max-w-3xl space-y-12">
                        <p className="text-2xl lg:text-4xl font-light italic text-neutral-400 font-serif leading-tight">
                            "{profile.bio}"
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 pointer-events-auto">
                            {Object.entries(profile.socials || {})
                                .filter(([_, value]) => value && typeof value === 'string' && value.trim() !== '')
                                .map(([k, v]) => (
                                    <a key={k} href={v as string} target="_blank" rel="noreferrer"
                                        className="group relative px-10 py-4 bg-zinc-950/50 border border-white/5 overflow-hidden transition-all duration-500"
                                    >
                                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ backgroundColor: `${currentChar.color}15` }} />
                                        <span className="relative text-[10px] font-mono tracking-[0.4em] uppercase font-bold text-neutral-400 group-hover:text-white transition-colors">{k}</span>
                                    </a>
                                ))}
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto mb-64 text-left">
                    <div className="mb-20 flex items-end justify-between border-b border-white/5 pb-8">
                        <h2 className="text-xs font-mono tracking-[1.5em] text-zinc-500 uppercase font-bold">Forbidden_Archive</h2>
                        <span className="text-6xl font-black text-white/5 select-none transition-colors" style={{ color: `${currentChar.color}05` }}>叛</span>
                    </div>

                    <div className="grid grid-cols-1 gap-12 pointer-events-auto">
                        {data.map((item, i) => (
                            <a
                                key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => onLinkClick(item.id)}
                                className="group block relative overflow-hidden"
                            >
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" style={{ backgroundColor: `${currentChar.color}08` }} />
                                <div className="relative p-12 border-l border-white/10 group-hover:border-theme transition-all duration-500 flex flex-col lg:flex-row items-center gap-12" style={{ borderLeftColor: 'rgba(255,255,255,0.1)' }}>
                                    <div className="text-4xl font-serif italic text-zinc-800 group-hover:text-theme transition-colors" style={{ color: 'rgba(255,255,255,0.05)' }}>0{i + 1}</div>
                                    <div className="flex-1">
                                        <h3 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-neutral-700 group-hover:text-white transition-all transform group-hover:skew-x-2">
                                            {item.title}
                                        </h3>
                                        <p className="mt-4 text-zinc-500 group-hover:text-zinc-300 transition-colors font-serif italic text-lg lg:text-xl">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="text-theme opacity-5 text-8xl transition-all duration-700 group-hover:opacity-100 group-hover:rotate-12 group-hover:scale-125" style={{ color: currentChar.color }}>📜</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </main>
            </div>
        );
    }, [profile, data, selectedChar, onLinkClick]);

    if (isIntro) {
        return (
            <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 overflow-hidden font-serif">
                <div className="relative animate-pulse mb-8">
                    <div className="text-[140px] font-black text-red-600 opacity-20 antialiased">暁</div>
                </div>
                <h1 className="text-white text-[10px] font-mono tracking-[2em] uppercase opacity-50">Justice Through Pain</h1>
            </div>
        );
    }

    const currentChar = CHARACTERS[selectedChar];

    return (
        <div
            className="relative min-h-screen w-full bg-[#010101] overflow-x-hidden text-neutral-100 font-serif selection:bg-red-600 selection:text-white cursor-none"
            style={{ '--theme-color': currentChar.color } as any}
            onClick={(e) => {
                setRipple({ x: e.clientX, y: e.clientY, active: true });
                setTimeout(() => setRipple(prev => ({ ...prev, active: false })), 1000);
            }}
        >
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

            {/* CHARACTER SELECTOR (SIDEBAR) */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-6">
                {Object.keys(CHARACTERS).map((key) => {
                    const char = CHARACTERS[key as AkatsukiCharacter];
                    const active = selectedChar === key;
                    return (
                        <button
                            key={key}
                            onClick={(e) => { e.stopPropagation(); setSelectedChar(key as AkatsukiCharacter); }}
                            className={`group relative w-12 h-12 rounded-full border transition-all duration-500 overflow-hidden bg-zinc-950 flex items-center justify-center ${active ? 'scale-125 shadow-[0_0_20px_var(--theme-color)]' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                            style={{ borderColor: active ? currentChar.color : 'rgba(255,255,255,0.1)' }}
                        >
                            <img src={char.eye} alt={char.name} className="w-full h-full object-cover transform scale-150" />
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/90 border px-3 py-1 text-[8px] font-mono uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap" style={{ borderColor: `${char.color}40` }}>
                                {char.name}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* CINEMATIC BARS */}
            <div className="fixed top-0 left-0 w-full h-12 bg-black z-50 border-b flex items-center px-12 justify-between" style={{ borderColor: `${currentChar.color}20` }}>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono tracking-[0.8em] uppercase italic" style={{ color: currentChar.color }}>
                        {selectedChar === 'SASUKE' ? `${sasukeEyeMode}_VISION_ACTIVE` : `${currentChar.name} vision_active`}
                    </span>
                    {selectedChar === 'SASUKE' && <span className="text-[8px] font-mono text-white/30 tracking-[0.2em] animate-pulse">[PRESS 'V' TO TOGGLE VISION]</span>}
                </div>
                <span className="text-[9px] font-mono tracking-[0.8em] opacity-50 uppercase">Agency: {profile.name}</span>
            </div>

            <div className="fixed bottom-0 left-0 w-full h-12 bg-black z-50 border-t flex items-center px-12 justify-between" style={{ borderColor: `${currentChar.color}20` }}>
                <span className="text-[9px] font-mono tracking-[0.8em] uppercase italic truncate max-w-lg" style={{ color: currentChar.color }}>{currentChar.quote}</span>
                <span className="text-[9px] font-mono font-black uppercase tracking-tighter" style={{ color: currentChar.color }}>{currentChar.rank}</span>
            </div>

            {/* CONTENT LAYER */}
            {contentLayer}

            {/* LIVE DATA OVERLAY (Independent Stats) */}
            <div className="relative z-20 container mx-auto px-8">
                <div className="mb-48 grid grid-cols-2 lg:grid-cols-4 gap-12 text-left border-y border-white/5 py-12 w-full max-w-4xl mx-auto">
                    {[
                        { label: 'Souls_Caught', val: visitorCount.toLocaleString() },
                        { label: 'Bloodline', val: currentChar.bloodline },
                        { label: 'Eye_Status', val: selectedChar === 'SASUKE' ? (sasukeEyeMode === 'RINNEGAN' ? 'SIX_PATHS' : 'SHARINGAN') : selectedChar },
                        { label: 'Power_Level', val: currentChar.rank }
                    ].map(s => (
                        <div key={s.label}>
                            <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mb-2">{s.label}</div>
                            <div className="text-xl font-bold tracking-tighter uppercase transition-colors" style={{ color: currentChar.color }}>{s.val}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start max-w-6xl mx-auto text-left pb-32">
                    <div>
                        <div className="mb-12">
                            <h2 className="text-xs font-mono tracking-[1em] text-zinc-500 uppercase mb-4 font-bold">Resonance</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            {activeEmojis.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={(e) => { e.stopPropagation(); handleReact(emoji); }}
                                    className={`group flex flex-col items-center justify-center p-8 bg-zinc-950/40 border border-white/5 transition-all duration-700 relative overflow-hidden ${userReacted === emoji ? 'shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'hover:border-white/20'}`}
                                    style={{ borderColor: userReacted === emoji ? currentChar.color : 'rgba(255,255,255,0.05)' }}
                                >
                                    <span className={`text-4xl mb-4 transition-transform duration-500 group-hover:scale-125 ${userReacted === emoji ? 'drop-shadow-[0_0_10px_red]' : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'}`}>{emoji}</span>
                                    <span className="text-[10px] font-mono font-black text-neutral-600 transition-colors group-hover:text-theme" style={{ color: userReacted === emoji ? currentChar.color : 'inherit' }}>{reactions[emoji] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/5 p-12 lg:p-16 relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-t-2 transition-all duration-500" style={{ borderTopColor: currentChar.color }}>
                        <h2 className="text-xs font-mono tracking-[1em] text-neutral-300 uppercase mb-12 font-bold">Public_Record</h2>
                        <Guestbook isInline theme="AKATSUKI" />
                    </div>
                </div>
            </div>

            {/* CURSOR */}
            <div
                ref={cursorRef}
                className="fixed z-[100] pointer-events-none mix-blend-difference will-change-transform"
                style={{ left: 0, top: 0, transform: 'translate3d(-100px, -100px, 0)' }}
            >
                <div className="relative w-16 h-16 border border-white/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="absolute inset-0 border border-white/20 rounded-full" style={{ transform: `scale(${0.3 + i * 0.3})` }} />
                    ))}
                    <div className="w-1.5 h-1.5 rounded-full transition-colors duration-500 shadow-[0_0_15px_red]" style={{ backgroundColor: currentChar.color }} />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="absolute w-1.5 h-1.5 rounded-lg transition-colors duration-500" style={{ transform: `rotate(${i * 120}deg) translateY(-24px)`, backgroundColor: currentChar.color }} />
                    ))}
                </div>
            </div>

            {/* RIPPLE */}
            {ripple.active && (
                <div
                    className="fixed z-[5] pointer-events-none border-4 rounded-full animate-[ripple_1s_ease-out_forwards]"
                    style={{ left: ripple.x, top: ripple.y, borderColor: `${currentChar.color}40` }}
                />
            )}
            <style>{`
                @keyframes scratch { 0%, 100% { transform: scaleX(1); opacity: 0.6; } 50% { transform: scaleX(1.1) rotate(-1.5deg); opacity: 1; } }
                @keyframes ripple {
                    from { width: 0; height: 0; transform: translate(-50%, -50%); opacity: 1; }
                    to { width: 1500px; height: 1500px; transform: translate(-50%, -50%); opacity: 0; }
                }
                .text-theme { color: var(--theme-color) !important; }
                .border-theme { border-color: var(--theme-color) !important; }
                .bg-theme { background-color: var(--theme-color) !important; }
                .children-auto-pointer * { pointer-events: auto; }
            `}</style>
        </div>
    );
};

export default AkatsukiTheme;
