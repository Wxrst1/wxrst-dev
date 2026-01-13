import React, { useEffect, useRef, useState } from 'react';
import { ContentItem, UserProfile, ThemeType } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

// --- Assets & Constants ---
// Using Google Fonts via style injection for Orbitron and Playfair Display

// --- Utilities ---
const useMousePosition = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0, speed: 0 });
    const lastMouse = useRef({ x: 0, y: 0, ts: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const now = Date.now();
            const dt = now - lastMouse.current.ts;
            const dist = Math.sqrt(Math.pow(e.clientX - lastMouse.current.x, 2) + Math.pow(e.clientY - lastMouse.current.y, 2));
            const speed = dt > 0 ? dist / dt : 0;

            lastMouse.current = { x: e.clientX, y: e.clientY, ts: now };
            setMouse({ x: e.clientX, y: e.clientY, speed });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    return mouse;
};

const ZenParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const particles = Array.from({ length: 150 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            size: Math.random() * 3 + 1,
            phase: Math.random() * Math.PI * 2
        }));

        let frameId: number;
        let time = 0;
        const render = () => {
            time += 0.005;
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#ffffff';

            particles.forEach(p => {
                const angle = (p.x * 0.001) + (p.y * 0.001) + time;
                const speed = 0.5 + Math.sin(time + p.phase) * 0.2;

                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed + 0.5;

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                const pulse = 0.5 + Math.sin(time * 2 + p.phase) * 0.3;
                ctx.globalAlpha = pulse;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // Z-index 5: Above Background (0), Below Content (10). Mix-blend-difference allows auto-inversion against bg.
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-5 mix-blend-difference opacity-50" />;
};

// --- Main Theme Component ---
const YinYangTheme: React.FC<{
    data: ContentItem[];
    profile: UserProfile;
    onEditProfile: () => void;
    onLinkClick: (id: string) => void;
    isAdmin?: boolean;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
    const mouse = useMousePosition();
    const [time, setTime] = useState(0);
    const [ripple, setRipple] = useState<{ x: number, y: number, active: boolean }>({ x: 0, y: 0, active: false });
    const [inkDrops, setInkDrops] = useState<{ id: number, x: number, y: number, color: string, size: number }[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    // Animation Loop for Curve and Ripple
    useEffect(() => {
        let frameId: number;
        const animate = () => {
            setTime(t => t + 0.05);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const handleInteraction = (e: React.MouseEvent) => {
        // Ripple
        setRipple({ x: e.clientX, y: e.clientY, active: true });
        setTimeout(() => setRipple(prev => ({ ...prev, active: false })), 1000);

        // Ink Splat Logic
        const y = e.clientY;
        const amplitude = 180 + mouse.speed * 40;
        const frequency = 0.002;
        const phase = time * 0.5 + (e.clientX / width) * 2;
        const xBase = width / 2 + (e.clientX - width / 2) * 0.35;
        const xOffset = Math.sin(y * frequency + phase) * amplitude;
        const mouseDist = Math.abs(y - e.clientY); // 0 at click
        const warp = 0; // At mouse Y, dist is 0, so warp is max? Wait warp logic: (1 - 0/600) * ... 

        // Simplified boundary check
        const curveX = xBase + xOffset;
        const isBlackSide = e.clientX > curveX;

        const newDrop = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            color: isBlackSide ? '#ffffff' : '#000000', // Inverted ink
            size: Math.random() * 50 + 20
        };

        setInkDrops(prev => [...prev, newDrop]);
    };

    // Calculate Dynamic S-Curve Path
    // Dividing viewport into Left (White) and Right (Black)
    // Curve oscillates based on mouse X and time
    // Base X is 50vw. Offsets vary by Y.
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // SVG Path Generation for the "Black" side (Right side fill)
    // We draw a path that follows the right edge, bottom edge, top edge, and then creates the curve on the left edge.
    const getCurvePath = (closed: boolean) => {
        const segments = 40;
        const amplitude = 180 + mouse.speed * 40;
        const frequency = 0.002;
        const phase = time * 0.5 + (mouse.x / width) * 2;

        let curvePoints = '';

        for (let y = height + 50; y >= -50; y -= height / segments) {
            // God Tier Parallax
            const xBase = width / 2 + (mouse.x - width / 2) * 0.35;
            const xOffset = Math.sin(y * frequency + phase) * amplitude;
            // Organic warping
            const mouseDist = Math.abs(y - mouse.y);
            const warp = Math.max(0, 1 - mouseDist / 600) * (mouse.x - width / 2) * 0.25;
            const x = xBase + xOffset + warp;

            if (curvePoints === '') curvePoints = `L ${x} ${y}`;
            else curvePoints += ` L ${x} ${y}`;
        }

        if (closed) {
            return `M ${width} -50 L ${width} ${height + 50} ${curvePoints} Z`;
        } else {
            return curvePoints.replace('L', 'M');
        }
    };

    const generateCurve = () => {
        const points = [];
        const segments = 20;
        const amplitude = 150 + mouse.speed * 30; // Reacts to movement intensity
        const frequency = 0.003;
        const phase = time * 0.5 + (mouse.x / width) * 2; // Mouse influence on phase

        // Start Top-Center (ish)
        // M width, 0 (Top-Right)
        // L width, height (Bottom-Right)
        // L 0, height ?? No, we want to fill the RIGHT side with black.
        // So we need to trace the CURVE from Top to Bottom approximately at x=width/2.

        // Start Path at Top Edge, X calculated by Sine
        let d = `M ${width} 0 L ${width} ${height} `; // Right Wall and Bottom Corner

        // Now trace from Bottom to Top along the curve
        // i goes from height to 0
        for (let y = height; y >= 0; y -= height / segments) {
            const xBase = width / 2;
            const xOffset = Math.sin(y * frequency + phase) * amplitude;
            // Add subtle mouse warping
            const mouseDist = Math.abs(y - mouse.y);
            const warp = Math.max(0, 1 - mouseDist / 500) * (mouse.x - width / 2) * 0.2;

            d += `L ${xBase + xOffset + warp} ${y} `;
        }

        d += `Z`; // Close back to Top-Right (implicitly via Start)
        return d;
    };

    return (
        <div
            className="relative min-h-screen w-full overflow-hidden bg-white cursor-none selection:bg-black selection:text-white"
            onClick={handleInteraction}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
            `}</style>

            {/* --- Zen Particles --- */}
            <ZenParticles />

            {/* --- The Dividing Veil (Background Layer) --- */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {/* Black Fill */}
                <path
                    d={getCurvePath(true)}
                    fill="#0a0a0a"
                    className="transition-all duration-75 ease-linear"
                />
                {/* Kintsugi Gold Stroke */}
                <path
                    d={getCurvePath(false)}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#gold-glow)"
                    className="transition-all duration-75 ease-linear opacity-80"
                />
            </svg>

            {/* --- Interactive Ripple (Equilibrium Pulse) --- */}
            {ripple.active && (
                <div
                    className="fixed rounded-full bg-neutral-500/50 pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2 animate-[ping_1s_ease-out_forwards]"
                    style={{ left: ripple.x, top: ripple.y, width: '200vmax', height: '200vmax' }}
                />
            )}

            {/* --- Ink Splats (God Tier Interaction) --- */}
            {inkDrops.map(drop => (
                <div
                    key={drop.id}
                    className="fixed rounded-full pointer-events-none z-[5] transform -translate-x-1/2 -translate-y-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_forwards] opacity-80"
                    style={{
                        left: drop.x,
                        top: drop.y,
                        width: drop.size + 'px',
                        height: drop.size + 'px',
                        backgroundColor: drop.color,
                        filter: 'blur(1px)'
                    }}
                />
            ))}

            {/* --- Custom Zen Cursor --- */}
            <div
                className="fixed pointer-events-none z-[100] mix-blend-difference"
                style={{
                    left: mouse.x,
                    top: mouse.y,
                    transform: `translate(-50%, -50%) rotate(${time * (10 + mouse.speed * 2)}deg)`
                }}
            >
                <div className="w-8 h-8 rounded-full bg-white border border-black relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-4 h-8 bg-black"></div>
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2"></div>
                    <div className="absolute top-1.5 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 z-10"></div>
                    <div className="absolute bottom-1.5 left-1/2 w-1 h-1 bg-black rounded-full -translate-x-1/2 z-10"></div>
                </div>
            </div>

            {/* --- Content Layer (Inverted Polarity) --- */}
            {/* mix-blend-mode: difference combined with white text ensures:
                - Over White Bg: White - White = Black Text
                - Over Black Bg: White - Black = White Text
            */}
            <div className="relative z-10 w-full min-h-screen text-white mix-blend-difference pointer-events-none">
                {/* 
                     NOTE: 'pointer-events-none' on wrapper allows clicks to pass to background,
                     BUT we need interaction on children. 
                     So children must strictly have 'pointer-events-auto'.
                 */}

                <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-16 pointer-events-auto">

                    {/* Header */}
                    <header className="text-center space-y-4 pt-12 animate-in fade-in slide-in-from-top-10 duration-1000">
                        <div className="w-20 h-20 mx-auto rounded-full border-4 border-white flex items-center justify-center animate-[spin_20s_linear_infinite]">
                            <span className="text-4xl font-black font-['Orbitron']">☯</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-['Orbitron'] tracking-tighter uppercase whitespace-nowrap">
                            Dualistic<br />Balance
                        </h1>
                        <div className="w-32 h-1 bg-white mx-auto" />
                    </header>

                    {/* Profile Section - Taijitu Style */}
                    <div className="perspective-1000">
                        <ThemedProfile theme={ThemeType.YIN_YANG} profile={profile} onEdit={onEditProfile} />
                    </div>

                    {/* Meditative Mird (Cards) */}
                    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                        {data.map((item, i) => (
                            <div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault(); // Add preventDefault just in case
                                    onLinkClick(item.id);
                                    if (item.url) window.open(item.url, '_blank');
                                }}
                                className="group h-[300px] perspective-1000 cursor-pointer relative z-50 pointer-events-auto" // Explicit z-index and pointer-events
                            >
                                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 shadow-2xl">

                                    {/* Front Side: Split Shard */}
                                    <div className="absolute inset-0 backface-hidden bg-white border-2 border-white overflow-hidden flex flex-col">
                                        {/* Diagonal Split Background */}
                                        <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>

                                        <div className="relative z-10 flex-1 p-6 flex flex-col justify-between mix-blend-difference text-white">
                                            <div className="flex justify-between items-start">
                                                <span className="font-['Orbitron'] text-xs font-bold tracking-widest">{item.category}</span>
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-['Playfair_Display'] font-bold italic mb-2 leading-tight">
                                                    {item.title}
                                                </h3>
                                                <div className="h-px w-12 bg-white/50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side: Inverted Info */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black border-2 border-white flex flex-col p-8 justify-center text-center items-center">
                                        <p className="font-['Playfair_Display'] text-lg leading-relaxed italic text-white/90">
                                            "{item.description}"
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onLinkClick(item.id);
                                                if (item.url) window.open(item.url, '_blank');
                                            }}
                                            className="mt-6 px-6 py-2 border border-white font-['Orbitron'] text-xs hover:bg-white hover:text-black transition-colors uppercase tracking-widest cursor-pointer relative z-50 hover:scale-105 active:scale-95"
                                        >
                                            Access Node
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </main>

                    {/* Inline Guestbook */}
                    <div className="w-full max-w-4xl mt-12 bg-black border border-white/20 p-8 rounded-none relative overflow-hidden group">
                        {/* Subtle Grain */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

                        <Guestbook theme={ThemeType.YIN_YANG} isInline={true} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default YinYangTheme;
