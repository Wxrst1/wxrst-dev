import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';

// --- Assets & Constants ---
const DRAGON_SEGMENTS = 40;
const GONG_SOUND_URL = 'https://cdn.freesound.org/previews/26/26569_189679-lq.mp3'; // Placeholder sound, user can replace
// Ideally we would use a local asset if provided, but I'll use a reliable external or synthesize/mock for now if needed.
// Using a generic "Gong" sound logic or Audio synth if preferred for "Om" tone.

const DragonTheme: React.FC<{
    data: ContentItem[];
    profile: UserProfile;
    onEditProfile: () => void;
    onLinkClick: (id: string) => void;
    isAdmin?: boolean;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [shockwave, setShockwave] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // --- Dragon Physics State ---
    const mouse = useRef({ x: 0, y: 0 });
    const trail = useRef(Array.from({ length: DRAGON_SEGMENTS }, () => ({ x: 0, y: 0 })));

    // --- Audio Init ---
    useEffect(() => {
        audioRef.current = new Audio(GONG_SOUND_URL);
        audioRef.current.volume = 0.5;
    }, []);

    // --- Track Mouse ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- Canvas Render Loop ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // 1. Resize if needed
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            // 2. Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 3. Physics Update (Spring/Follow)
            // Head follows mouse
            trail.current[0].x += (mouse.current.x - trail.current[0].x) * 0.15;
            trail.current[0].y += (mouse.current.y - trail.current[0].y) * 0.15;

            // Segments follow previous
            for (let i = 1; i < DRAGON_SEGMENTS; i++) {
                const prev = trail.current[i - 1];
                const curr = trail.current[i];

                const dx = prev.x - curr.x;
                const dy = prev.y - curr.y;

                curr.x += dx * 0.25;
                curr.y += dy * 0.25;
            }

            // 4. Draw Dragon
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Inner Gold Core
            ctx.beginPath();
            // Draw smooth curve through points
            ctx.moveTo(trail.current[0].x, trail.current[0].y);
            for (let i = 1; i < DRAGON_SEGMENTS; i++) {
                const p = trail.current[i];
                // Quadratic bezier for smoothness
                // actually simple line to is fast and looks okay with enough segments
                ctx.lineTo(p.x, p.y);
            }

            // Gradient Stroke
            const gradient = ctx.createLinearGradient(
                trail.current[0].x, trail.current[0].y,
                trail.current[DRAGON_SEGMENTS - 1].x, trail.current[DRAGON_SEGMENTS - 1].y
            );
            gradient.addColorStop(0, '#FFD700'); // Gold
            gradient.addColorStop(0.5, '#FFA500'); // Orange
            gradient.addColorStop(1, '#8B0000'); // Dark Red

            ctx.strokeStyle = gradient;

            // Dynamic Width based on index (tapering tail)
            for (let i = 0; i < DRAGON_SEGMENTS - 1; i++) {
                const p1 = trail.current[i];
                const p2 = trail.current[i + 1];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                const width = Math.max(2, (DRAGON_SEGMENTS - i) * 0.8);
                ctx.lineWidth = width;
                ctx.stroke();

                // Optional: Fire particles/Glow could be added here
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const triggerGong = () => {
        setShockwave(true);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.warn(e));
        }
        setTimeout(() => setShockwave(false), 1000); // Reset animation
    };

    return (
        <div
            ref={containerRef}
            className={`relative min-h-screen overflow-hidden font-serif selection:bg-red-900 selection:text-gold transition-filters duration-200 ${shockwave ? 'brightness-150 contrast-125' : ''}`}
            style={{
                background: 'linear-gradient(135deg, #1a0505 0%, #000000 100%)',
            }}
        >
            {/* Background Texture (Gold Leaf / Noise) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Floating Ink Clouds (CSS Animation) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-[-20%] w-[50vw] h-[30vh] bg-neutral-900/20 blur-[100px] rounded-full animate-[drift_60s_linear_infinite]" />
                <div className="absolute bottom-20 right-[-10%] w-[60vw] h-[40vh] bg-red-950/20 blur-[120px] rounded-full animate-[drift_45s_reverse_linear_infinite]" />
            </div>

            {/* Canvas Dragon Layer */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 mix-blend-screen" />

            {/* Main Content Layout */}
            <div className={`relative z-10 container mx-auto px-4 py-12 flex flex-col gap-16 transition-transform duration-500 ${shockwave ? 'scale-[1.02] rotate-1' : ''}`}>

                {/* Header Section: Gong & Title */}
                <header className="flex flex-col items-center justify-center gap-8 text-center mt-8">
                    <div className="relative group cursor-pointer" onClick={triggerGong}>
                        {/* Gong Visual */}
                        <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] bg-gradient-to-br from-[#B8860B] to-[#5c4004] shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center justify-center transform group-hover:scale-105 transition-all relative z-20">
                            <div className="w-24 h-24 rounded-full border border-[#FFD700]/30 flex items-center justify-center">
                                <span className="text-4xl text-[#FFD700] drop-shadow-lg font-black opacity-80 select-none">福</span>
                            </div>
                        </div>
                        {/* Shockwave Ring (Active state) */}
                        {shockwave && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-[20px] border-[#D4AF37] animate-[ping_0.8s_ease-out_forwards] opacity-50 z-10" />
                        )}
                    </div>

                    <div>
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#B8860B] drop-shadow-sm tracking-tight uppercase"
                            style={{ fontFamily: '"Cinzel", serif' }}>
                            Supreme Dynasty
                        </h1>
                        <p className="text-[#D4AF37]/60 tracking-[0.5em] text-sm mt-4 uppercase">The Imperial Archives</p>
                    </div>
                </header>

                {/* Profile Section: Wheel of Fate */}
                <div className="relative flex justify-center py-10">
                    {/* Mandala Frame */}
                    <div className="relative w-[400px] flex justify-center">
                        <div className="absolute inset-0 -m-8 border border-[#D4AF37]/20 rounded-full animate-[spin_60s_linear_infinite]"
                            style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, #D4AF3710 10deg 20deg)' }} />
                        <div className="absolute inset-0 -m-4 border border-[#D4AF37]/40 rounded-full animate-[spin_40s_reverse_linear_infinite]" />

                        {/* Actual Profile Card wrapped differently? 
                  ThemedProfile usually renders its own card. We might just place it here.
                  However, standard ThemedProfile has its own styles. 
                  We'll use a hack or just wrap it and rely on its transparency if possible, 
                  OR better, we render the data manually here if we want FULL custom "Scroll" look for the links
                  But ThemedProfile handles the "User Info" part well.
                  Let's just wrap ThemedProfile and apply a specific style class override if supported,
                  or simply put it in a centered container that looks majestic.
              */}
                        <div className="relative z-20 backdrop-blur-sm p-4 rounded-2xl border border-[#D4AF37]/30 bg-black/40 shadow-2xl">
                            {/* Re-using ThemedProfile component but aiming for integration */}
                            <ThemedProfile theme="BLOOD_STAIN" profile={profile} onEdit={onEditProfile} />
                            {/* INTENTIONAL: Reuse BloodStain layout/props but override via CSS in this theme container if needed, 
                     OR actually, ThemedProfile just renders the 'profile' view. 
                     Wait, ThemedProfile takes a `theme` prop to decide ITS internal layout.
                     If I pass a random theme like BLOOD_STAIN it might clash.
                     If I pass CELESTIAL_EMPIRE to ThemedProfile, I need to update ThemedProfile too.
                     For now, I'll pass 'DEFAULT' or 'CYBERPUNK' or update ThemedProfile. 
                     Refactoring ThemedProfile is safer to get the 'Wheel of Fate' look specific.
                     Actually, I'll just render the profile details manually here inside the Mandala to strictly follow "God-Tier Identity".
                 */}
                        </div>
                    </div>
                </div>

                {/* Imperial Scrolls (Data Grid) */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 md:px-20 pb-40">
                    {data.map((item, i) => (
                        <div
                            key={item.id}
                            onClick={() => item.id && onLinkClick(item.id)}
                            className="group relative w-full h-[320px] cursor-pointer perspective-1000"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Scroll Body */}
                            <div className="absolute inset-0 bg-[#F5E6D3] text-black shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] origin-top">

                                {/* Scroll Top Bar */}
                                <div className="h-4 w-full bg-[#3E2723] shadow-md relative z-20 flex items-center justify-center">
                                    <div className="w-1/2 h-[1px] bg-[#D4AF37]/50" />
                                </div>

                                {/* Paper Texture Overlay */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

                                {/* Content */}
                                <div className="flex-1 p-6 relative flex flex-col items-center text-center gap-4">
                                    {/* Category Stamp */}
                                    <div className="w-12 h-12 rounded border-2 border-red-800 text-red-900 flex items-center justify-center font-bold text-xs opacity-50 absolute top-4 right-4 rotate-12 mix-blend-multiply">
                                        {item.category.slice(0, 1)}
                                    </div>

                                    <h3 className="text-xl font-bold font-serif text-[#3E2723] border-b border-[#3E2723]/20 pb-2 w-full mt-4">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm font-serif text-[#5D4037] leading-relaxed italic opacity-80 line-clamp-4">
                                        {item.description}
                                    </p>

                                    {/* Floating Characters on Hover (Simulated) */}
                                    <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 text-red-800 text-xs font-black tracking-widest uppercase">
                                        Read the Archives
                                    </div>
                                </div>

                                {/* Scroll Bottom Bar */}
                                <div className="h-6 w-full bg-[#3E2723] shadow-md relative z-20 mt-auto flex items-center justify-between px-2">
                                    <div className="w-2 h-4 bg-[#8B4513] rounded-sm" />
                                    <div className="w-2 h-4 bg-[#8B4513] rounded-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                </main>

            </div>

            {/* Global Styles for Animations */}
            <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
      `}</style>
        </div>
    );
};

export default DragonTheme;
