import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, UserProfile } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const ExorcismTheme: React.FC<{
    data: ContentItem[];
    profile: UserProfile;
    onEditProfile: () => void;
    onLinkClick: (id: string) => void;
    isAdmin?: boolean;
}> = ({ data, profile, onEditProfile, onLinkClick, isAdmin }) => {
    const [possessionLevel, setPossessionLevel] = useState(0);
    const [isExorcising, setIsExorcising] = useState(false);
    const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [scareActive, setScareActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Auto-deterioration
    useEffect(() => {
        const timer = setInterval(() => {
            setTimestamp(new Date().toLocaleTimeString());
            if (!isExorcising && Math.random() > 0.7) {
                setPossessionLevel(prev => Math.min(prev + 5, 100));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [isExorcising]);

    // Malefic Laughs & Scares logic
    useEffect(() => {
        if (!audioEnabled) return;

        const triggerLaugh = () => {
            // 30% chance to actually trigger when interval hits
            if (Math.random() > 0.7) {
                // Audio Laugh (Real audio file - Local Project File)
                const audio = new Audio('/demonic-voice.mp3');
                audio.volume = 1.0;
                audio.play().catch(e => {
                    console.error("Audio playback failed", e);
                });

                // Visual Scare - Strobe Effect
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                    setScareActive(prev => !prev);
                    flashCount++;
                    if (flashCount > 15) { // Flash for ~2 seconds
                        clearInterval(flashInterval);
                        setScareActive(false);
                    }
                }, 100);

                // Spike possession
                setPossessionLevel(prev => Math.min(prev + 30, 100));
            }

            // Re-schedule randomly between 10s and 40s
            timeoutId = setTimeout(triggerLaugh, Math.random() * 30000 + 10000);
        };

        let timeoutId = setTimeout(triggerLaugh, 5000); // Start trying after 5s

        return () => {
            clearTimeout(timeoutId);
            window.speechSynthesis.cancel();
        };
    }, [audioEnabled]);

    // Ambient Drone Logic
    useEffect(() => {
        if (!audioEnabled) return;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(35, ctx.currentTime); // Low frequency drone
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2); // Fade in

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();

        return () => {
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            setTimeout(() => {
                osc.stop();
                ctx.close();
            }, 500);
        };
    }, [audioEnabled]);

    const handleExorcise = () => {
        setIsExorcising(true);
        setPossessionLevel(0);

        // Holy light flash sound
        if (audioEnabled && audioCtxRef.current) {
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();

            osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch "divine" tone
            g.gain.setValueAtTime(0.2, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

            osc.connect(g);
            g.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 1.5);
        }

        setTimeout(() => {
            setIsExorcising(false);
        }, 2000);
    };

    const getDistortion = () => {
        const intensity = possessionLevel / 100;
        const rotate = (Math.random() - 0.5) * intensity * 5; // +/- 2.5deg
        const scale = 1 + (Math.sin(Date.now() / 100) * intensity * 0.05);
        const blur = `blur(${intensity * 2}px)`;
        const filter = isExorcising
            ? 'brightness(2) contrast(200%) grayscale(100%)' // Exorcism flash effect base
            : `${blur} contrast(${100 + intensity * 50}%) ${possessionLevel > 80 ? 'invert(10%)' : ''}`;

        return {
            transform: `rotate(${rotate}deg) scale(${scale})`,
            filter: filter,
        };
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#050505] text-[#eee] font-serif relative overflow-hidden transition-all duration-300"
            style={getDistortion()}
        >
            {/* Audio Toggle */}
            <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="fixed top-4 right-4 z-[60] bg-black/50 border border-white/20 px-3 py-1 text-[10px] uppercase font-mono tracking-widest hover:bg-red-900/50 transition-colors"
                style={{ filter: 'none' }} // Prevent parent distortion from blurring this too much? CSS inheritance applies filters to children, so this might still be blurry. Fixed positioning helps it stay on screen.
            >
                [ AUDIO_{audioEnabled ? 'ON' : 'OFF'} ]
            </button>

            {/* CCTV Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] animate-pulse" />
            <div className="fixed inset-0 pointer-events-none z-50">
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scanline-v opacity-30" />

                {/* HUD */}
                <div className="absolute top-10 left-10 text-xl font-bold tracking-widest text-white drop-shadow-md flex items-center gap-4">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-ping" />
                    <span className="font-mono">REC</span>
                    <span className="font-mono">CAM_04</span>
                    <span className="font-mono">{timestamp}</span>
                </div>

                <div className="absolute bottom-10 right-10 text-right">
                    <div className="text-xs uppercase tracking-widest text-red-600 mb-2 font-mono">Possession Integrity</div>
                    <div className="w-64 h-4 bg-zinc-900 border border-white/20 relative overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${possessionLevel > 80 ? 'bg-red-600 animate-pulse' : 'bg-white'}`}
                            style={{ width: `${100 - possessionLevel}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Crosses Background */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-6xl text-zinc-800 transition-transform duration-[5s]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `rotate(${possessionLevel * (i % 2 === 0 ? 1 : -1) * 2}deg)`,
                            opacity: 0.5 - (possessionLevel / 200)
                        }}
                    >
                        †
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto pt-40 px-6 pb-20 space-y-24">
                {/* Header / Profile */}
                <header className="flex flex-col items-center gap-12 group relative">
                    <div className={`relative transition-all duration-500 hover:scale-105 ${possessionLevel > 50 ? 'animate-glitch' : ''}`}>
                        {/* Themed Profile wrapper that we might distort */}
                        <div className="relative z-10 p-1 bg-black border-2 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                            <ThemedProfile theme="THE_EXORCISM" profile={profile} onEdit={onEditProfile} />
                        </div>
                        {/* Glitch Clone */}
                        {possessionLevel > 30 && (
                            <div className="absolute inset-0 bg-red-900/50 -translate-x-2 translate-y-2 mix-blend-exclusion opacity-50 animate-pulse pointer-events-none" />
                        )}
                    </div>

                    <div className="text-center space-y-4 max-w-lg">
                        <h1 className="text-6xl md:text-8xl font-black tracking-widest text-white mix-blend-difference italic uppercase">
                            {possessionLevel > 90 ? "SAVE US" : "The Rite_"}
                        </h1>
                        <button
                            onClick={handleExorcise}
                            className="mt-12 px-12 py-4 bg-white text-black font-black uppercase tracking-[0.5em] hover:bg-red-700 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 italic"
                        >
                            Exorcise_
                        </button>
                    </div>
                </header>

                {/* Evidence Cards - Updated with user's requested style */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {data.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group relative h-[500px] transition-transform duration-1000 perspective-1000"
                            style={{
                                transform: `rotate(${Math.sin(possessionLevel / 20 + idx) * (possessionLevel / 20)}deg) translateY(${possessionLevel / 2}px)` // Distort position based on possession
                            }}
                        >
                            <div className={`relative h-full bg-[#0a0a0a] border border-white/5 p-8 flex flex-col shadow-2xl overflow-hidden group-hover:border-red-900/50 transition-colors ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}>
                                {/* Card internal scanline */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scanline-v opacity-30" />

                                <header className="flex justify-between mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">REF_{item.id}</span>
                                    <span className="text-xl rotate-180 text-red-900">✝</span>
                                </header>

                                <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-6 text-zinc-300 group-hover:text-red-600 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm italic leading-relaxed text-white/40 group-hover:text-white/60 transition-colors mb-10 font-serif">
                                    "{item.description}"
                                </p>

                                {item.codeSnippet && (
                                    <pre className="mt-auto mb-6 bg-black/50 p-2 text-[8px] text-zinc-500 font-mono border-l border-white/10 opacity-50">
                                        {item.codeSnippet.substring(0, 50)}...
                                    </pre>
                                )}

                                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex flex-col gap-1">
                                        <span className="opacity-20 text-zinc-500">Sanctity</span>
                                        <span className={item.status === 'CRITICAL' ? 'text-red-700 animate-pulse' : 'text-zinc-400'}>{item.status}</span>
                                    </div>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => {
                                            if (isAdmin) e.preventDefault();
                                            onLinkClick(item.id);
                                        }}
                                        className={`px-6 py-2 bg-white/5 hover:bg-red-900 text-zinc-400 hover:text-white transition-all font-black text-[9px] ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        Bind Node
                                    </a>
                                </div>

                                {/* Flickering Eye background element */}
                                <div className="absolute -bottom-10 -right-10 text-[10rem] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-[3000ms] pointer-events-none select-none grayscale">👁️</div>
                            </div>
                        </div>
                    ))}
                </main>

                {/* Confessional / Guestbook */}
                <div className="mt-32 border-t border-zinc-800 pt-16">
                    <div className="flex flex-col items-center mb-12">
                        <div className="text-xs uppercase tracking-[0.5em] text-red-600 mb-2 font-bold font-mono">The Confessional</div>
                        <h2 className="text-3xl font-black text-white mix-blend-difference mb-4 italic tracking-widest">LEAVE_YOUR_TESTIMONY</h2>
                        <div className="w-12 h-1 bg-red-900/50" />
                    </div>

                    <div className="max-w-3xl mx-auto bg-zinc-950/80 border border-zinc-800 p-8 relative overflow-hidden">
                        {/* Decorative tape */}
                        <div className="absolute top-0 right-0 p-2 opacity-50">
                            <div className="w-20 h-8 bg-yellow-100/10 rotate-45 border border-white/5" />
                        </div>
                        <div className="relative z-10">
                            <Guestbook isInline theme="THE_EXORCISM" />
                        </div>
                    </div>
                </div>

                <footer className="py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Thy Kingdom Come.</p>
                </footer>
            </div>

            {/* Exorcism Flash */}
            <div
                className={`fixed inset-0 bg-white z-[100] transition-opacity duration-[2000ms] pointer-events-none ${isExorcising ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionTimingFunction: 'ease-out' }}
            />

            {/* Scare Overlay */}
            {scareActive && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black pointer-events-none mix-blend-exclusion">
                    <div className="text-[20rem] animate-ping grayscale contrast-200 invert">👹</div>
                    <div className="absolute inset-0 bg-red-600/50 mix-blend-multiply" />
                </div>
            )}

            {/* Global Theme Styles */}
            <style>{`
          @keyframes animate-glitch {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 2px) }
            40% { transform: translate(-2px, -2px) }
            60% { transform: translate(2px, 2px) }
            80% { transform: translate(2px, -2px) }
            100% { transform: translate(0) }
          }
          .animate-glitch {
             animation: animate-glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
          }
          @keyframes scanline-v { 
            0% { top: -10%; } 
            100% { top: 110%; } 
          }
          .animate-scanline-v { 
            animation: scanline-v 8s linear infinite; 
          }
        `}</style>
        </div>
    );
};

export default ExorcismTheme;
