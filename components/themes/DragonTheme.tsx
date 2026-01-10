import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';

// --- Assets & Constants ---
const DRAGON_SEGMENTS = 50;
const GONG_SOUND_URL = 'https://cdn.freesound.org/previews/26/26569_189679-lq.mp3';

// --- Particle System ---
const SakuraParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; size: number; speedX: number; speedY: number; rotation: number; rotationSpeed: number; opacity: number }[] = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 5 + 2,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 + 0.5,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;

                // Draw Petal
                ctx.fillStyle = '#ffb7b2'; // Sakura Pink
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-1 mix-blend-screen opacity-60" />;
};


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
    const dragonHeadImg = useRef<HTMLImageElement | null>(null);
    const lastAngle = useRef(0);

    // --- Audio Init ---
    useEffect(() => {
        audioRef.current = new Audio(GONG_SOUND_URL);
        audioRef.current.volume = 0.5;
    }, []);

    // --- Track Mouse & Fire State ---
    const isBreathingFire = useRef(false);
    const fireParticles = useRef<{ x: number, y: number, vx: number, vy: number, life: number, size: number, color: string }[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };
        const handleMouseDown = () => { isBreathingFire.current = true; };
        const handleMouseUp = () => { isBreathingFire.current = false; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // --- Loading State for Theme ---
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate theme asset loading (e.g. dragon head, fonts)
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // --- Canvas Render Loop ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.05;
            // 1. Resize if needed
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            // 2. Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 3. Physics Update (Spring/Follow)
            // Head follows mouse with some floaty sine wave offset
            const targetX = mouse.current.x + Math.sin(time) * 20;
            const targetY = mouse.current.y + Math.cos(time) * 20;

            trail.current[0].x += (targetX - trail.current[0].x) * 0.1;
            trail.current[0].y += (targetY - trail.current[0].y) * 0.1;

            // Segments follow previous
            for (let i = 1; i < DRAGON_SEGMENTS; i++) {
                const prev = trail.current[i - 1];
                const curr = trail.current[i];

                const dx = prev.x - curr.x;
                const dy = prev.y - curr.y;

                curr.x += dx * 0.2 + Math.sin(time + i * 0.1) * 0.5; // Add undulation
                curr.y += dy * 0.2 + Math.cos(time + i * 0.1) * 0.5;
            }

            // 4. Draw Dragon Body (Updated Colors)
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Shadow Blur
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#FF4500'; // Orange Red Shadow

            // Gradient Stroke - Matching Head (Red -> Gold -> Blue accent)
            const gradient = ctx.createLinearGradient(
                trail.current[0].x, trail.current[0].y,
                trail.current[DRAGON_SEGMENTS - 1].x, trail.current[DRAGON_SEGMENTS - 1].y
            );
            gradient.addColorStop(0, '#B22222'); // Fire Brick Red (Neck)
            gradient.addColorStop(0.2, '#FFD700'); // Gold Body
            gradient.addColorStop(0.5, '#D62828'); // Red Scales
            gradient.addColorStop(0.8, '#4682B4'); // Steel Blue (Tail Tip accent)
            gradient.addColorStop(1, '#FFD700'); // Gold Tip

            ctx.strokeStyle = gradient;

            // Dynamic Width based on index (tapering tail)
            // Increased initial width to match huge head image
            for (let i = 0; i < DRAGON_SEGMENTS - 1; i++) {
                const p1 = trail.current[i];
                const p2 = trail.current[i + 1];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                // Thicker body to match 180px head
                const width = Math.max(4, (DRAGON_SEGMENTS - i) * 1.8 * (1 + Math.sin(time * 5 + i) * 0.1));
                ctx.lineWidth = width;
                ctx.stroke();
            }

            // Draw Pngtree Dragon Head Image
            const head = trail.current[0];
            const neck = trail.current[2] || trail.current[1];

            // Anti-Spin Logic: Only update angle if moving
            const dx = head.x - neck.x;
            const dy = head.y - neck.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 2) {
                lastAngle.current = Math.atan2(dy, dx);
            }

            const angle = lastAngle.current;

            ctx.save();
            ctx.translate(head.x, head.y);
            ctx.rotate(angle);

            // Correct Logic:
            // 1. Source is Left-Facing. We want Right-Facing standard. -> Always Flip X (-1, 1).
            // 2. Standard Sprite Rotation puts Left Move Upside Down. -> Flip Y (1, -1) if Left.
            // Combined: X always -1. Y is -1 if Left, 1 if Right.
            const isLeft = Math.abs(angle) > Math.PI / 2;
            ctx.scale(-1, isLeft ? -1 : 1);

            // Draw the image if loaded
            if (dragonHeadImg.current) {
                // Adjust scale and offset as needed based on the image dimensions
                const size = 180;
                // Offset calculation to align neck to body point (trail[0])
                // Assuming neck is at right side of the image (since it points left)
                // We draw centered at -size/2 ? No.
                // If source points Left, Neck is likely on the Right edge?
                // Let's rely on standard centering first, maybe tweak X offset if needed.
                ctx.drawImage(dragonHeadImg.current, -size * 0.6, -size / 2, size, size);
            }

            ctx.restore();

            // 5. Fire Breath System
            // 5. Fire Breath System
            if (isBreathingFire.current) {
                // Spawn Fire Particles
                // Calculate Mouth Position (Offset from center to mouth)
                // Head angle points forward.
                // We need to move Forward (to snout) and Down (to mouth/jaw).
                const fwdOffset = 60;
                const sideOffset = 25; // Positive = Down relative to head direction

                const mouthX = head.x + Math.cos(angle) * fwdOffset - Math.sin(angle) * sideOffset;
                const mouthY = head.y + Math.sin(angle) * fwdOffset + Math.cos(angle) * sideOffset;

                // Spawn multiple particles per frame for density
                for (let k = 0; k < 5; k++) {
                    const spread = (Math.random() - 0.5) * 0.4;
                    const speed = Math.random() * 12 + 8; // Faster fire
                    fireParticles.current.push({
                        x: mouthX + (Math.random() - 0.5) * 15,
                        y: mouthY + (Math.random() - 0.5) * 15,
                        vx: Math.cos(angle + spread) * speed,
                        vy: Math.sin(angle + spread) * speed,
                        life: 1.0,
                        size: Math.random() * 15 + 8, // Bigger particles
                        color: Math.random() > 0.4 ? '#FF4500' : '#FFD700'
                    });
                }
            }

            // Update & Draw Fire Particles with intense glow
            ctx.globalCompositeOperation = 'screen';
            for (let i = fireParticles.current.length - 1; i >= 0; i--) {
                const p = fireParticles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.025;
                p.size += 0.6;
                p.vx *= 0.96;
                p.vy *= 0.96;

                if (p.life <= 0) {
                    fireParticles.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                // More intense opacity
                grad.addColorStop(0, `rgba(255, 255, 220, ${p.life})`);
                grad.addColorStop(0.3, p.color === '#FFD700' ? `rgba(255, 215, 0, ${p.life * 0.9})` : `rgba(255, 69, 0, ${p.life * 0.9})`);
                grad.addColorStop(1, `rgba(50, 0, 0, 0)`);

                ctx.fillStyle = grad;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over'; // Reset blend mode

            animationFrameId = requestAnimationFrame(render);
        };

        // Preload Dragon Head Image
        const img = new Image();
        img.src = '/—Pngtree—dragon head festival dragon head_7213886.png';
        img.onload = () => {
            dragonHeadImg.current = img;
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
        setTimeout(() => setShockwave(false), 1000);
    };

    return (
        <div
            ref={containerRef}
            className={`relative min-h-screen overflow-hidden font-serif selection:bg-red-900 selection:text-gold transition-filters duration-200 ${shockwave ? 'brightness-150 contrast-125' : ''}`}
            style={{
                background: 'radial-gradient(circle at 50% 50%, #2a0a0a 0%, #000000 100%)',
            }}
        >
            {/* Background Texture Scale Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/black-scales.png")` }}
            />

            {/* Floating Ink Clouds (CSS Animation) - Enhanced */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-[-20%] w-[50vw] h-[30vh] bg-neutral-900/30 blur-[100px] rounded-full animate-[drift_60s_linear_infinite]" />
                <div className="absolute bottom-20 right-[-10%] w-[60vw] h-[40vh] bg-red-950/30 blur-[120px] rounded-full animate-[drift_45s_reverse_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[#D4AF37]/5 blur-[150px] rounded-full mix-blend-overlay animate-pulse" />
            </div>

            <SakuraParticles />

            {/* --- Loading Screen Overlay --- */}
            <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="relative">
                    {/* Outer Spinner */}
                    <div className="w-48 h-48 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                    {/* Inner Spinner */}
                    <div className="absolute inset-4 border-2 border-[#8B0000]/30 border-b-[#8B0000] rounded-full animate-[spin_3s_reverse_linear_infinite]" />
                    {/* Center Emblem */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl animate-pulse">🐲</span>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-['Cinzel'] text-[#D4AF37] tracking-[0.2em] font-bold uppercase animate-pulse">
                        Imperial Archives
                    </h2>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent" />
                    <p className="text-[#a3bfa8] font-serif italic text-sm">Summoning the Eternal Dragon...</p>
                </div>
            </div>

            {/* Canvas Dragon Layer - Z-index fix to allow clicks on content */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 mix-blend-screen" />

            {/* Main Content Layout */}
            <div className={`relative z-30 container mx-auto px-4 py-12 flex flex-col gap-16 transition-transform duration-500 ${shockwave ? 'scale-[1.02] rotate-1 blur-sm' : ''}`}>

                {/* Header Section: Gong & Title */}
                <header className="flex flex-col items-center justify-center gap-8 text-center mt-8 relative">
                    <div className="relative group cursor-pointer" onClick={triggerGong}>
                        {/* Gong Visual */}
                        <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] bg-gradient-to-br from-[#B8860B] to-[#5c4004] shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center justify-center transform group-hover:scale-105 transition-all relative z-20 overflow-hidden">
                            <div className="absolute inset-0 bg-[repeating-conic-gradient(#5c4004_0deg_10deg,#B8860B_10deg_20deg)] opacity-10 animate-[spin_20s_linear_infinite]" />
                            <div className="w-24 h-24 rounded-full border border-[#FFD700]/30 flex items-center justify-center z-10 relative">
                                <span className="text-4xl text-[#FFD700] drop-shadow-lg font-black opacity-80 select-none group-hover:scale-110 transition-transform">福</span>
                            </div>
                        </div>
                        {/* Shockwave Rings (Active state) */}
                        {shockwave && (
                            <>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-[2px] border-[#FFD700] animate-[ping_1s_ease-out_infinite] opacity-80 z-10" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border-[10px] border-[#D4AF37] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40 z-0" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-[#D4AF37]/20 blur-xl animate-[ping_2s_ease-out_forwards] z-0" />
                            </>
                        )}
                    </div>

                    <div>
                        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] via-[#FFA500] to-[#B8860B] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight uppercase transform scale-y-110"
                            style={{ fontFamily: '"Cinzel", serif' }}>
                            Supreme Dynasty
                        </h1>
                        <p className="text-[#D4AF37] tracking-[0.8em] text-sm mt-4 uppercase border-y border-[#D4AF37]/30 py-2 w-fit mx-auto px-8 backdrop-blur-sm">The Imperial Archives</p>
                    </div>
                </header>

                {/* Profile Section: Wheel of Fate */}
                <div className="relative flex justify-center py-10 perspective-1000">
                    {/* Mandala Frame */}
                    <div className="relative w-[500px] flex justify-center z-20">
                        {/* Outer Slow Rotating Rings */}
                        <div className="absolute inset-0 -m-16 border border-[#D4AF37]/10 rounded-full animate-[spin_60s_linear_infinite]"
                            style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, #D4AF3705 10deg 20deg)' }} />
                        <div className="absolute inset-0 -m-8 border border-[#D4AF37]/20 rounded-full animate-[spin_40s_reverse_linear_infinite] border-dashed" />

                        <div className="relative z-20 transform-style-3d">
                            <ThemedProfile theme="CELESTIAL_EMPIRE" profile={profile} onEdit={onEditProfile} />
                        </div>
                    </div>
                </div>

                {/* Imperial Scrolls (Data Grid) */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4 md:px-20 pb-40 perspective-[2000px]">
                    {data.map((item, i) => (
                        <div
                            key={item.id}
                            onClick={() => item.id && onLinkClick(item.id)}
                            className="group relative w-full h-[450px] cursor-pointer"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Card Container with 3D Transform */}
                            <div className="relative w-full h-full transition-all duration-700 ease-out transform-style-3d group-hover:rotate-x-6 group-hover:rotate-y-3 group-hover:scale-105 group-hover:-translate-y-4">

                                {/* Glow/Shadow Behind */}
                                <div className="absolute inset-4 bg-[#D4AF37] rounded-[2rem] blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

                                {/* Main Card Body - Jade & Gold Tablet Style */}
                                <div className="absolute inset-0 bg-[#0c120e] rounded-[2rem] border-2 border-[#D4AF37]/30 overflow-hidden shadow-2xl flex flex-col group-hover:border-[#D4AF37] transition-colors duration-500">

                                    {/* Background Texture: Dark Jade Scales */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/black-scales.png")` }} />

                                    {/* Gold Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#0A1A10] opacity-50" />

                                    {/* Top Ornament */}
                                    <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

                                    {/* Content Container */}
                                    <div className="flex-1 p-8 relative flex flex-col items-center text-center gap-6 z-10">

                                        {/* Floating Category Seal */}
                                        <div className="w-16 h-16 bg-[#8B0000] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-[#ff4d4d]/30 group-hover:rotate-12 transition-transform duration-500 relative overflow-hidden group/seal">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-30" />
                                            {/* Chinese Symbol Mapping */}
                                            <span className="text-[#FFD700] font-black text-4xl font-serif z-10 select-none">
                                                {(() => {
                                                    const cat = (item.category || '').toLowerCase();
                                                    if (cat.includes('code') || cat.includes('dev') || cat.includes('git')) return '码'; // Code
                                                    if (cat.includes('design') || cat.includes('art') || cat.includes('ui')) return '艺'; // Art
                                                    if (cat.includes('video') || cat.includes('media') || cat.includes('play')) return '影'; // Movie/Shadow
                                                    if (cat.includes('social') || cat.includes('chat') || cat.includes('comm')) return '社'; // Society
                                                    if (cat.includes('game') || cat.includes('play')) return '玩'; // Play
                                                    if (cat.includes('music') || cat.includes('sound')) return '乐'; // Music
                                                    return '龙'; // Default Dragon
                                                })()}
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                                        </div>

                                        {/* Title with Gold Text Effect */}
                                        <h3 className="text-3xl font-black font-['Cinzel'] text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#B8860B] drop-shadow-sm uppercase tracking-wide mt-2">
                                            {item.title}
                                        </h3>

                                        <div className="w-12 h-[1px] bg-[#D4AF37]/50 my-2 group-hover:w-24 transition-all duration-500" />

                                        {/* Description */}
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-sm font-serif text-[#a3bfa8] leading-relaxed italic line-clamp-4 px-2 group-hover:text-[#d1e6d5] transition-colors">
                                                "{item.description}"
                                            </p>
                                        </div>

                                        {/* "Read Archives" Button Simulation */}
                                        <div className="w-full mt-auto pt-6 border-t border-[#D4AF37]/10 flex justify-between items-center group-hover:border-[#D4AF37]/30 transition-colors">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/50 font-bold group-hover:text-[#D4AF37] transition-colors">Classified</span>
                                            <span className="text-xl text-[#D4AF37] opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">→</span>
                                        </div>
                                    </div>

                                    {/* Decorative Corners */}
                                    <div className="absolute top-0 left-0 p-4">
                                        <div className="w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-lg" />
                                    </div>
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/30 rounded-tr-lg" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <div className="w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/30 rounded-bl-lg" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-4">
                                        <div className="w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-lg" />
                                    </div>
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
