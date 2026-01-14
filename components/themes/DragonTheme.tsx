import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ContentItem, UserProfile, ThemeType } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

// --- Assets & Constants ---
const DRAGON_SEGMENTS = 50;
const GONG_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2988/2988-preview.mp3';

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

    // TODO: EASTER EGG IMPLEMENTATION
    // Goal: Add Dragon Balls mechanics or similar hidden secrets.
    // Ideas: 
    // - Konami Code triggering Shenron.
    // - Clicking the "福" Gong 7 times rapidly.
    // - Hidden scroll messages hidden in console logs.
    // - "deixar pistas de easter eggs no theme dragon" (Leave clues).

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

    // --- THE DRAGON'S HOARD: EASTER EGG SYSTEM ---
    const [huntStarted, setHuntStarted] = useState(false);
    const [ballsFound, setBallsFound] = useState<boolean[]>(Array(7).fill(false));
    const [huntMessage, setHuntMessage] = useState<string | null>(null);
    const [isGoldenMode, setIsGoldenMode] = useState(false); // Kept from previous
    const inputBuffer = useRef<string>('');

    const [colorSequence, setColorSequence] = useState<string[]>([]);
    const [timeFragments, setTimeFragments] = useState<number>(0);
    const [shardFragments, setShardFragments] = useState<boolean[]>(Array(6).fill(false));

    // Finale State
    const [showRiddle, setShowRiddle] = useState(false);
    const [riddleInput, setRiddleInput] = useState('');
    const allBallsFound = ballsFound.every(b => b);

    // Initial Hint (Cryptic)
    // Initial Hint (Cryptic)
    useEffect(() => {
        console.log("%c🐉 THE ANCIENT SCROLL REVEALS:\n%c'Twice to the Heavens, Twice to the Earth.\nThe Sun sets and rises, sets and rises again.\nBreak the Seal (B), and Awaken (A).'",
            "color: #FFD700; font-size: 16px; font-weight: bold; font-family: serif;",
            "color: #a3bfa8; font-style: italic;"
        );
    }, []);

    // Konami Code Sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
    const KONAMI_CODE = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            inputBuffer.current = (inputBuffer.current + e.key).slice(-KONAMI_CODE.length * 2); // Buffer safety
            if (inputBuffer.current.toLowerCase().includes(KONAMI_CODE.toLowerCase())) {
                setHuntStarted(true);
                setHuntMessage("THE DRAGON STIRS... FIND THE 7 ORBS.");
                setTimeout(() => setHuntMessage(null), 5000);
                inputBuffer.current = '';
                // Audio Cue
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(err => console.warn("Audio play blocked:", err));
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // BALL 6: FRAGMENTS LOGIC
    const collectShard = (index: number) => {
        if (ballsFound[5]) return; // Already have Ball 6
        const newShards = [...shardFragments];
        newShards[index] = true;
        setShardFragments(newShards);

        if (newShards.every(s => s)) {
            collectBall(5);
        }
    };

    const checkRiddle = () => {
        const answer = riddleInput.trim().toLowerCase();
        if (answer === 'silence' || answer === 'nothing' || answer === 'shadow') {
            collectBall(6); // Ball 7
            setShowRiddle(false);
        } else {
            const msgs = ["THE DRAGON SIGHS...", "INCORRECT.", "TRY AGAIN.", "SHHH..."];
            setHuntMessage(msgs[Math.floor(Math.random() * msgs.length)]);
            setTimeout(() => setHuntMessage(null), 2000);
            setRiddleInput('');
        }
    };

    // BALL 3: TIME LOGIC
    const handleEraClick = () => {
        if (ballsFound[2]) return;
        const newCount = timeFragments + 1;
        setTimeFragments(newCount);
        if (newCount >= 3) {
            collectBall(2);
        }
    };

    // IMPL BALL 4: Console Command & Dev Tools
    useEffect(() => {
        (window as any).dragon = {
            start: () => {
                setHuntStarted(true);
                console.log("THE DRAGON STIRS... (Dev Mode Activated)");
                return "Hunt Started.";
            },
            awaken: (n: number) => {
                if (!huntStarted) return "The dragon sleeps. (Use dragon.start() first)";
                if (n === 4) {
                    collectBall(3);
                    console.log(`
        ,   ___           __
       (' \\    O>    _  ((
        _)  \\  ___  ||-  ))
      (.   ___>-==   ]__'
           ||        \\   _____ 
          _||         \\.'     \`.
         |  T  |       |  .===.|
         |____|        \\ /     \\|
         _|_|_          \`-------'
    
    THE FOURTH ORB IS YOURS.
                    `);
                    return "Dragon Awakened.";
                }
                return "The dragon sleeps.";
            }
        };
    }, [huntStarted, ballsFound]);

    const handleWispClick = (color: string) => {
        if (ballsFound[1]) return;
        const targetSequence = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        const nextIndex = colorSequence.length;

        if (color === targetSequence[nextIndex]) {
            const newSeq = [...colorSequence, color];
            setColorSequence(newSeq);
            // Visual feedback could be added here
            if (newSeq.length === 6) {
                collectBall(1); // Collect Ball 2
                setColorSequence([]);
            }
        } else {
            setColorSequence([]); // Reset on mistake
            // Optional: Shake effect or error sound
        }
    };

    const collectBall = (index: number) => {
        if (!huntStarted) return;
        if (ballsFound[index]) return;

        const newBalls = [...ballsFound];
        newBalls[index] = true;
        setBallsFound(newBalls);

        // Visual Feedback
        // Visual Feedback & Next Hint
        setHuntMessage(`DRAGON BALL ${index + 1} ACQUIRED!`);

        // Specific Side Effects for Hints
        if (index === 2) { // Just found Ball 3, looking for Ball 4
            // Subtle "System Trace" for hackers
            console.log("%c[SYSTEM TRACE] %cSignal intercepted from sector 0x4 (Console)...",
                "color: #0f0; font-family: monospace;",
                "color: #888;"
            );
            console.groupCollapsed("%c > DECRYPT SIGNAL SOURCE", "color: #D4AF37; font-weight: bold; cursor: pointer;");
            console.log("To awaken the guardian, execute: %cwindow.dragon.awaken(4)", "background: #222; color: #D4AF37; padding: 2px 4px; border-radius: 2px;");
            console.groupEnd();
        }

        // Clues for the NEXT ball
        setTimeout(() => {
            const hints = [
                "SEEK THE SPINNING LIGHTS OF FATE (ROYGBIV)...", // Ball 1 -> 2
                "THE ERAS OF HISTORY HOLD THE KEY...",          // Ball 2 -> 3
                "THE DRAGON LIES DORMANT IN THE SILICON DEPTHS...", // Ball 3 -> 4
                "LISTEN FOR THE HIDDEN MELODY...",             // Ball 4 -> 5
                "REFLECTIONS LIE SHATTERED ON THE GLASS...",   // Ball 5 -> 6
                "THE CIRCLE IS NEARLY COMPLETE... ONE REMAINS." // Ball 6 -> 7
            ];
            if (index < 6) {
                setHuntMessage(hints[index]);
                setTimeout(() => setHuntMessage(null), 8000);
            } else {
                setHuntMessage(null);
            }
        }, 3000);

        // TODO: Play "Item Get" sound
    };

    // Kept for backward compatibility with checkGongSecret calls if any remain
    const checkGongSecret = () => { };
    const gongStrikes = useRef(0); // Stub to prevent crashes if referenced
    const lastStrikeTime = useRef(0);

    /* REMOVING OLD HINT LOGS TO AVOID CLUTTER */

    // Old hints removed.



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
            if (isBreathingFire.current || isGoldenMode) {
                // Spawn Fire Particles (Golden Mode: Always active & multicolour)
                const spawnRate = isGoldenMode ? 2 : 5;

                // ... same logic but enhanced ...
                for (let k = 0; k < (isGoldenMode ? 3 : 5); k++) {
                    const spread = (Math.random() - 0.5) * 0.4;
                    const speed = Math.random() * 12 + 8;
                    fireParticles.current.push({
                        x: head.x + (Math.random() - 0.5) * 30, // Wider spawn
                        y: head.y + (Math.random() - 0.5) * 30,
                        vx: Math.cos(angle + spread) * speed,
                        vy: Math.sin(angle + spread) * speed,
                        life: 1.0,
                        size: Math.random() * 15 + 8,
                        color: isGoldenMode
                            ? `hsl(${Math.random() * 60 + 30}, 100%, 70%)` // Gold/Yellow spectrum
                            : (Math.random() > 0.4 ? '#FF4500' : '#FFD700')
                    });
                }
            }

            // Update & Draw Fire Particles
            ctx.globalCompositeOperation = 'screen';
            for (let i = fireParticles.current.length - 1; i >= 0; i--) {
                const p = fireParticles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.025;
                p.size += 0.6;
                p.vx *= 0.96;
                p.vy *= 0.96;

                // Gravity in Golden Mode
                if (isGoldenMode) p.vy += 0.2;

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
        checkGongSecret(); // Check for secret
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.warn(e));
        }
        setTimeout(() => setShockwave(false), 1000);
    };

    return (
        <div
            ref={containerRef}
            className={`relative min-h-screen overflow-hidden font-serif selection:bg-red-900 selection:text-gold transition-filters duration-1000 ${shockwave ? 'brightness-110' : ''} ${isGoldenMode ? 'brightness-105 saturate-110 selection:bg-[#FFD700] selection:text-black' : ''}`}
            style={{
                background: isGoldenMode
                    ? 'radial-gradient(circle at 50% 50%, #2a0a0a 0%, #1a0500 50%, #000000 100%)' // Warmer, richer background
                    : 'radial-gradient(circle at 50% 50%, #2a0a0a 0%, #000000 100%)',
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



            {/* --- Loading Screen: Cinematic Rising Curtain --- */}
            <div className={`fixed inset-0 z-[100] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isLoading ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* Main Curtain Background */}
                <div className="absolute inset-0 bg-[#1a0505] flex flex-col items-center justify-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 30%, #3a0a0a 0%, #000000 100%)`
                    }}>

                    {/* Decorative Gold Border at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />
                    <div className="absolute bottom-2 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                    {/* Central Content */}
                    <div className={`flex flex-col items-center gap-8 transition-all duration-700 ${isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-90 delay-0'}`}>
                        {/* Emblem */}
                        <div className="relative group cursor-wait">
                            <div className="w-32 h-32 rounded-full border border-[#D4AF37]/30 flex items-center justify-center relative bg-black/20 backdrop-blur-sm">
                                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 scale-125 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/10 scale-150 animate-[ping_3s_infinite]" />
                                <span className="text-6xl text-[#FFD700] drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] animate-pulse">
                                    🐉
                                </span>
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-['Cinzel'] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#B8860B] tracking-[0.2em] uppercase drop-shadow-sm">
                                Imperial<br />Archives
                            </h1>
                            <div className="flex items-center justify-center gap-4 opacity-60">
                                <span className="w-12 h-[1px] bg-[#D4AF37]" />
                                <span className="text-[10px] font-serif tracking-[0.4em] text-[#D4AF37] uppercase">System Initializing</span>
                                <span className="w-12 h-[1px] bg-[#D4AF37]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canvas Dragon Layer - Z-index fix to allow clicks on content */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 mix-blend-screen" />

            {/* Main Content Layout */}
            <div className={`relative z-30 pointer-events-auto container mx-auto px-4 py-12 flex flex-col gap-16 transition-transform duration-500 ${shockwave ? 'scale-[1.02] rotate-1 blur-sm' : ''}`}>

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
                        <h1
                            className={`relative z-50 text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] via-[#FFA500] to-[#B8860B] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight uppercase transform scale-y-110 transition-all duration-300 ${huntStarted && !ballsFound[0] ? 'cursor-pointer hover:sepia hover:brightness-125' : ''}`}
                            style={{ fontFamily: '"Cinzel", serif' }}
                            onClick={(e) => {
                                console.log("Header Clicked", e.detail, huntStarted); // Debug
                                if (huntStarted && !ballsFound[0] && e.detail >= 2) {
                                    collectBall(0); // Double click to collect Ball 1
                                }
                            }}
                            title={huntStarted && !ballsFound[0] ? "A name of power..." : undefined}
                        >
                            Supreme Dynasty
                        </h1>
                        <p className="text-[#D4AF37] tracking-[0.8em] text-sm mt-4 uppercase border-y border-[#D4AF37]/30 py-2 w-fit mx-auto px-8 backdrop-blur-sm">The Imperial Archives</p>
                    </div>
                </header>

                {/* Profile Section: Wheel of Fate */}
                <div className="relative flex justify-center py-10 perspective-1000 z-40">
                    {/* Mandala Frame */}
                    <div className="relative w-[500px] flex justify-center">
                        {/* BALL 2: ELEMENTAL WISPS */}
                        {huntStarted && ballsFound[0] && !ballsFound[1] && (
                            <div className="absolute inset-0 animate-[spin_20s_linear_infinite] pointer-events-none z-50">
                                {[
                                    { c: 'red', hex: '#FF0000', deg: 0 },
                                    { c: 'orange', hex: '#FFA500', deg: 60 },
                                    { c: 'yellow', hex: '#FFFF00', deg: 120 },
                                    { c: 'green', hex: '#008000', deg: 180 },
                                    { c: 'blue', hex: '#0000FF', deg: 240 },
                                    { c: 'purple', hex: '#800080', deg: 300 }
                                ].map((wisp, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-8 h-8 rounded-full cursor-pointer pointer-events-auto hover:scale-150 transition-transform shadow-[0_0_15px_currentColor] border-2 border-white/50"
                                        style={{
                                            backgroundColor: wisp.hex,
                                            top: '50%',
                                            left: '50%',
                                            transform: `rotate(${wisp.deg}deg) translate(160px) rotate(-${wisp.deg}deg)`, // Radius reduced to 160px
                                            opacity: colorSequence.length > i ? 0.3 : 0.9
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWispClick(wisp.c);
                                            // Visual Debug
                                            console.log("Wisp Clicked:", wisp.c);
                                        }}
                                        title={`Essence of ${wisp.c}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Outer Slow Rotating Rings */}
                        <div className="absolute inset-0 -m-16 border border-[#D4AF37]/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"
                            style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, #D4AF3705 10deg 20deg)' }} />
                        <div className="absolute inset-0 -m-8 border border-[#D4AF37]/20 rounded-full animate-[spin_40s_reverse_linear_infinite] border-dashed pointer-events-none" />

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
                            onClick={() => {
                                if (item.id) onLinkClick(item.id);
                                if (item.url) window.open(item.url, '_blank');
                            }}
                            className="group relative w-full h-[450px] cursor-pointer z-50 pointer-events-auto"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Card Container with 3D Transform */}
                            <div className="relative w-full h-full transition-all duration-700 ease-out transform-style-3d group-hover:rotate-x-6 group-hover:rotate-y-3 group-hover:scale-105 group-hover:-translate-y-4">

                                {/* Glow/Shadow Behind */}
                                <div className="absolute inset-4 bg-[#D4AF37] rounded-[2rem] blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

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

                                        {/* BALL 3: HIDDEN ERA TIMESTAMP */}
                                        {huntStarted && ballsFound[1] && !ballsFound[2] && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEraClick();
                                                }}
                                                className="text-[10px] text-[#D4AF37]/40 cursor-pointer hover:text-[#D4AF37] hover:scale-110 transition-all font-mono tracking-widest"
                                            >
                                                [ ERA: {2023 + (i % 3)} ]
                                            </div>
                                        )}

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

                {/* --- Royal Edicts (Guestbook) --- */}
                <div className="container mx-auto px-4 md:px-20 pb-20 relative z-30 pointer-events-auto">
                    <div className="relative border-4 border-[#D4AF37]/30 bg-[#0F0505]/90 p-8 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden">
                        {/* Title */}
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <h2 className="text-3xl font-black font-['Cinzel'] text-[#D4AF37] uppercase tracking-[0.2em] drop-shadow-lg">
                                Public Edicts
                            </h2>
                            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                        </div>

                        {/* Guestbook Component Inline */}
                        <div className="relative z-10">
                            <Guestbook theme={ThemeType.CELESTIAL_EMPIRE} isInline={true} />
                        </div>

                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/rice-paper.png")` }} />
                    </div>
                </div>

                {/* VISUAL HINT (Footer - Ancient Runes) */}
                <div className="w-full text-center pb-12 opacity-20 hover:opacity-60 transition-opacity duration-500">
                    <p className="text-[#D4AF37] font-serif text-[12px] tracking-[0.8em] select-none cursor-help" title="2 Sky, 2 Earth, West-East, West-East, Seal, Awaken">
                        ▲△▼▽◄►◄►ᛒᚪ
                    </p>
                </div>
            </div>

            {/* BALL 6: SCATTERED SHARDS */}
            {huntStarted && ballsFound[4] && !ballsFound[5] && shardFragments.map((collected, i) => !collected && (
                <div
                    key={i}
                    onClick={() => collectShard(i)}
                    className="fixed w-4 h-4 bg-white/80 rotate-45 animate-pulse cursor-pointer hover:scale-150 hover:bg-[#FFD700] transition-all shadow-[0_0_10px_white] z-[9990]"
                    style={{
                        top: `${20 + (i * 15)}%`,
                        left: `${10 + (i * 13)}%`,
                        animationDelay: `${i * 0.5}s`
                    }}
                />
            ))}

            {/* BALL 5: HUMMING STONE (Guestbook Area) */}
            {huntStarted && ballsFound[3] && !ballsFound[4] && (
                <div
                    onClick={() => collectBall(4)}
                    className="fixed bottom-8 left-8 w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all z-[9990] animate-bounce"
                    title="Listen..."
                >
                    <span className="text-2xl">🎵</span>
                </div>
            )}

            {/* Global Styles for Animations */}
            <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
      `}</style>

            {/* --- Shenron Summoning Overlay (Secret) --- */}
            {/* --- DRAGON HUNT UI --- */}
            {huntStarted && !allBallsFound && (
                <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div
                        className={`flex gap-1 p-2 bg-black/50 backdrop-blur-md rounded-full border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all ${ballsFound.filter(b => b).length === 6 ? 'cursor-pointer animate-pulse hover:bg-[#FFD700]/20 hover:scale-110' : ''}`}
                        onClick={() => {
                            if (ballsFound.filter(b => b).length === 6) setShowRiddle(true);
                        }}
                    >
                        {ballsFound.map((found, i) => (
                            <div
                                key={i}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] border transition-all duration-500 ${found ? 'bg-gradient-to-br from-[#FFD700] to-[#FF4500] border-[#FFD700] shadow-[0_0_10px_#FFD700] scale-110' : 'bg-black/50 border-white/10 text-white/10 grayscale'}`}
                            >
                                {found ? '★' : ''}
                            </div>
                        ))}
                    </div>
                    {ballsFound.filter(b => b).length === 6 && (
                        <div className="text-[10px] text-[#FFD700] font-mono tracking-widest animate-bounce">
                            CLICK THE ORBS
                        </div>
                    )}
                    {huntMessage && (
                        <div className="text-[#FFD700] font-['Cinzel'] font-bold tracking-widest text-shadow-sm bg-black/80 px-4 py-2 rounded-md border border-[#FFD700]/50 animate-pulse">
                            {huntMessage}
                        </div>
                    )}
                </div>
            )}

            {/* BALL 7: RIDDLE MODAL */}
            {showRiddle && (
                <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
                    <div className="bg-black border-2 border-[#D4AF37] p-8 max-w-md w-full text-center space-y-6 relative shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] -mt-2 -ml-2" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] -mb-2 -mr-2" />

                        <h2 className="text-3xl text-[#FFD700] font-['Cinzel']">The Final Trial</h2>
                        <p className="text-white/80 font-serif italic">
                            "I am so fragile that if you say my name, you break me.<br />What am I?"
                        </p>
                        <input
                            type="text"
                            value={riddleInput}
                            onChange={(e) => setRiddleInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') checkRiddle() }}
                            className="bg-transparent border-b border-[#D4AF37] text-center text-white text-xl w-full py-2 focus:outline-none focus:border-white transition-colors uppercase tracking-widest"
                            placeholder="..."
                        />
                        <button
                            onClick={checkRiddle}
                            className="px-8 py-2 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all uppercase tracking-widest text-sm"
                        >
                            Speak
                        </button>
                    </div>
                </div>
            )}

            {/* --- SHENRON SUMMONING --- */}
            {allBallsFound && (
                <div className="fixed inset-0 z-[99999] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-2000">
                    <div className="absolute inset-0 bg-white animate-[pulse_0.1s_ease-in-out_infinite] opacity-5 pointer-events-none" />

                    <div className="relative z-10 text-center space-y-8 p-8 border-y-4 border-[#FFD700] bg-black/50 backdrop-blur-md animate-in slide-in-from-bottom-10 duration-1000">
                        <div className="text-9xl animate-spin-slow drop-shadow-[0_0_50px_rgba(255,215,0,0.8)]">🐉</div>
                        <h1 className="text-5xl md:text-8xl font-['Cinzel'] font-black text-[#FFD700] tracking-[0.2em] uppercase drop-shadow-[0_0_30px_#FFA500]">
                            I Am Shenron
                        </h1>
                        <div className="w-32 h-1 bg-[#FFD700] mx-auto shadow-[0_0_20px_#FFD700]" />
                        <p className="text-xl md:text-3xl font-serif text-white italic tracking-widest animate-pulse leading-relaxed">
                            "YOUR JOURNEY IS COMPLETE.<br />MAKE YOUR WISH."
                        </p>

                        <div className="pt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
                            <button
                                onClick={() => {
                                    setIsGoldenMode(true);
                                    if (audioRef.current) audioRef.current.play();
                                    // Properly close the sequence
                                    setTimeout(() => {
                                        setBallsFound(Array(7).fill(false)); // Optional: Reset balls or keep them? Keeping them found but closing modal.
                                        setHuntStarted(false); // End the hunt state so UI clears
                                        setHuntMessage("YOUR WISH HAS BEEN GRANTED.");
                                        setTimeout(() => setHuntMessage(null), 5000);
                                    }, 500);
                                }}
                                className="group relative px-10 py-5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-[#FFD700] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative group-hover:text-black z-10">Eternal Wealth</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default DragonTheme;
