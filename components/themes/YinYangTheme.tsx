
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ThemeType } from '../../types';

// --- PROPS ---
interface YinYangThemeProps {
    data: any[];
    profile: any;
    onLinkClick: (id: string) => void;
    onEditProfile: (newProfile: any) => void;
}

// --- CONSTANTS ---
const HISTORY_KEY = 'radical_yin_yang_memory';

const YinYangTheme: React.FC<YinYangThemeProps> = ({ data, profile, onLinkClick }) => {
    // --- STATE ---
    // The system decides what to show based on behavior, not clicks.
    const [mode, setMode] = useState<'NEUTRAL' | 'YIN' | 'YANG' | 'CHAOS'>('NEUTRAL');
    const [memory, setMemory] = useState<string>(''); // Permanent history
    const [profileVisible, setProfileVisible] = useState(false);

    // --- REFS (The Physics Engine) ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();

    // System Variables (Mutable for performance)
    const sys = useRef({
        energy: 0,        // 0 to 100 (Instant velocity)
        focus: 0,         // 0 to 100 (Accumulated stillness)
        entropy: 0,       // 0 to 1000 (Total chaos caused)
        mouse: { x: 0, y: 0, lx: 0, ly: 0 },
        scroll: { y: 0, ly: 0 },
        time: 0
    });

    // --- INITIALIZATION ---
    useEffect(() => {
        // Check for permanent scars
        const saved = localStorage.getItem(HISTORY_KEY);
        if (saved) setMemory(saved);
    }, []);

    // --- INPUT LISTENERS ---
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            sys.current.mouse.x = e.clientX;
            sys.current.mouse.y = e.clientY;

            // Interaction destroys Focus
            sys.current.focus = Math.max(0, sys.current.focus - 5);
        };

        const handleScroll = () => {
            sys.current.scroll.y = window.scrollY;
            // Scroll builds Energy
            sys.current.energy = Math.min(100, sys.current.energy + 5);
            sys.current.focus = 0;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // --- THE CORE LOOP (The Negotiator) ---
    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        let frame = 0;

        const loop = () => {
            frame++;
            const s = sys.current;
            s.time++;

            // 1. CALCULATE DERIVATIVES
            const dx = s.mouse.x - s.mouse.lx;
            const dy = s.mouse.y - s.mouse.ly;
            const mouseSpeed = Math.sqrt(dx * dx + dy * dy);

            const dyScroll = Math.abs(s.scroll.y - s.scroll.ly);

            // 2. UPDATE SYSTEM STATE
            // Energy decays; Movement adds Energy
            s.energy = s.energy * 0.95 + (mouseSpeed * 0.5 + dyScroll * 2);
            s.energy = Math.min(100, s.energy); // Cap

            // Focus builds slowly if Energy is low
            if (s.energy < 5) s.focus = Math.min(100, s.focus + 0.5);
            else s.focus = Math.max(0, s.focus - 2);

            // Entropy builds with excessive Energy
            if (s.energy > 80) s.entropy++;

            // Update Previous
            s.mouse.lx = s.mouse.x;
            s.mouse.ly = s.mouse.y;
            s.scroll.ly = s.scroll.y;


            // 3. REACT (Determine Mode)
            // This drives the React UI updates, throttled
            if (frame % 10 === 0) {
                if (s.energy > 60) setMode('YANG'); // Fast, Aggressive
                else if (s.focus > 50) setMode('YIN'); // Still, Deep
                else if (s.entropy > 500) setMode('CHAOS'); // Broken
                else setMode('NEUTRAL'); // Waiting

                // Content Visibility Threshold
                if (s.focus > 20 || s.energy > 20) setProfileVisible(true);
            }

            // 4. RENDER (The Entity)
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvasRef.current!.width = w;
            canvasRef.current!.height = h;

            // Background
            // If YANG: Flash White. If YIN: Deep Black.
            const bgIntensity = s.energy / 100;
            const bgLight = Math.floor(bgIntensity * 255);

            // But we want restraint. No gradients.
            // Just subtle noise or lines.
            ctx.fillStyle = s.energy > 80 ? '#fff' : '#050505';
            ctx.fillRect(0, 0, w, h);

            // THE NEGOTIATION LINE
            // A single line that divides the screen.
            // Yin: Vertical, curved, organic.
            // Yang: Horizontalish, jagged, glitchy.

            ctx.beginPath();
            ctx.strokeStyle = s.energy > 80 ? '#000' : '#fff';
            ctx.lineWidth = 1 + (s.energy * 0.1);

            // The line changes orientation based on energy
            // Low Energy (Yin) = Vertical division (Balance)
            // High Energy (YANG) = Horizontal cuts (Speed)

            const startX = w / 2;
            const startY = 0;

            if (s.energy > 50) {
                // YANG: Chaos Lines
                ctx.moveTo(0, h / 2);
                for (let x = 0; x < w; x += 10) {
                    const jitter = (Math.random() - 0.5) * s.energy * 2;
                    ctx.lineTo(x, h / 2 + jitter);
                }
            } else {
                // YIN: The Thread
                ctx.moveTo(w / 2, 0);
                for (let y = 0; y < h; y += 10) {
                    // It breathes
                    const breathe = Math.sin(frame * 0.05) * s.focus;
                    // It reacts to mouse proximity
                    const distMouse = s.mouse.y - y;
                    const repel = Math.abs(distMouse) < 200 ? (s.mouse.x - w / 2) * 0.5 : 0;

                    ctx.lineTo(w / 2 + breathe - repel, y);
                }
            }
            ctx.stroke();

            // EASTER EGG: PERMANENT SCAR
            // If entropy broke the system, draw the crack
            if (memory === 'BROKEN' || s.entropy > 1000) {
                if (s.entropy > 1000 && memory !== 'BROKEN') {
                    localStorage.setItem(HISTORY_KEY, 'BROKEN');
                    setMemory('BROKEN');
                }

                ctx.strokeStyle = '#ff0000';
                ctx.beginPath();
                ctx.moveTo(w * 0.8, 0);
                ctx.lineTo(w * 0.2, h);
                ctx.stroke();
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current!);

    }, [memory]);


    // --- UI RENDERING ---
    // The UI is subtle. It fades in/out based on Mode.

    return (
        <div className="relative min-h-[300vh] cursor-none overflow-hidden font-sans selection:bg-white selection:text-black">

            {/* CANVAS LAYER */}
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

            {/* FLOATING HUD (The Observer) */}
            <div className="fixed top-8 left-8 z-50 text-[10px] font-mono mix-blend-difference text-white opacity-50">
                <div>SYS.ENERGY: {mode === 'YANG' ? 'CRITICAL' : 'STABLE'}</div>
                <div>SYS.FOCUS: {mode === 'YIN' ? 'LOCKED' : 'DRIFTING'}</div>
                {memory === 'BROKEN' && <div className="text-red-500">STATUS: FRACTURED</div>}
            </div>

            {/* CONTENT LAYER */}
            {/* Content reveals itself only when the user commits to a state */}

            {/* YIN STATE REVEAL (Stillness) */}
            {/* Shows deep philosophy, biography, "The Creator" */}
            <div className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${mode === 'YIN' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="max-w-2xl p-12 text-center mix-blend-difference text-white">
                    <div className="w-1 bg-white h-24 mx-auto mb-8 animate-[growHeight_2s_ease-out]" />
                    <h1 className="text-4xl font-serif italic mb-6">"Stillness reveals what speed conceals."</h1>
                    <p className="text-sm font-mono leading-relaxed opacity-70 mb-12">{profile.bio}</p>

                    <div className="grid grid-cols-2 gap-8 text-left pointer-events-auto">
                        {data.slice(0, 4).map(item => (
                            <div key={item.id} className="cursor-pointer group" onClick={() => onLinkClick(item.url)}>
                                <div className="text-xs border-b border-white/20 pb-2 mb-2 group-hover:border-white transition-colors">{item.title}</div>
                                <div className="text-[10px] opacity-0 group-hover:opacity-50 transition-opacity">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* YANG STATE REVEAL (Velocity) */}
            {/* Shows data, hard facts, "The Architect" */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-200 ${mode === 'YANG' ? 'opacity-100' : 'opacity-0'}`}>
                {/* Visual Noise Overlay */}
                <div className="absolute inset-0 bg-white mix-blend-overlay opacity-10" />

                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden mix-blend-difference text-white">
                    <h1 className="text-[20vw] font-black leading-none whitespace-nowrap animate-[scrollLeft_2s_linear_infinite]">
                        VELOCITY VELOCITY VELOCITY {profile.name.toUpperCase()} SYSTEM ACTIVE
                    </h1>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
                    <div className="grid grid-cols-1 gap-4 w-full max-w-4xl text-right mix-blend-difference text-white">
                        {data.map((item, i) => (
                            <div key={item.id}
                                className="border-b-2 border-black/0 hover:border-white transition-all cursor-pointer p-4 flex justify-between items-baseline group"
                                onClick={() => onLinkClick(item.url)}
                            >
                                <span className="text-4xl font-black group-hover:tracking-widest transition-all duration-300">{item.title}</span>
                                <span className="font-mono text-xs">0{i} // ACTIVATE</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEUTRAL STATE (The Void) */}
            {/* Minimalist prompt to explore */}
            <div className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${mode === 'NEUTRAL' && !profileVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center mix-blend-difference text-white">
                    <div className="mb-4 text-xs font-mono uppercase tracking-[0.5em] animate-pulse">Waiting for Input</div>
                    <div className="w-2 h-2 bg-white mx-auto rounded-full" />
                </div>
            </div>


            {/* PERMANENT ALTERATION (Easter Egg) */}
            {memory === 'BROKEN' && (
                <div className="fixed bottom-4 right-4 font-mono text-[8px] text-red-500 opacity-50">
                    ERR_SYSTEM_FRACTURED
                </div>
            )}

            {/* MOUSE CURSOR (Reacts to Energy) */}
            <div className="fixed z-[9999] pointer-events-none mix-blend-difference text-white transition-transform duration-75"
                style={{ left: sys.current.mouse.x, top: sys.current.mouse.y, transform: 'translate(-50%, -50%)' }}>
                <div className={`border border-white transition-all duration-300 ${mode === 'YANG' ? 'w-24 h-2 rounded-none rotate-45 bg-white' : 'w-4 h-4 rounded-full'}`} />
            </div>

            <style>{`
                @keyframes growHeight { 0% { height: 0; } 100% { height: 6rem; } }
                @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `}</style>
        </div>
    );
};

export default YinYangTheme;
