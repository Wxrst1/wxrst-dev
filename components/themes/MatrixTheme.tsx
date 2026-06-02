
import React, { useEffect, useRef, useState } from 'react';
import { ContentItem, UserProfile, ThemeType } from '../../types';
import ThemedProfile from '../ThemedProfile';
import Guestbook from '../Guestbook';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px Fira Code`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30 bg-black" />;
};

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 50 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
};

const SyntaxHighlightedCode: React.FC<{ code: string }> = ({ code }) => {
  // Enhanced Tokenizer with specific Matrix-style categories
  const tokens = code.split(/(\b(?:fn|let|const|var|return|if|else|match|type|interface|class|import|export|await|async|try|catch|Result|Error|String|Number|Boolean)\b|".*?"|'.*?'|`.*?`|\/\/.*$|\/\*[\s\S]*?\*\/)/g);

  return (
    <div className="relative mt-4 group/code">
      {/* Dynamic ambient glow */}
      <div className="absolute -inset-1 bg-green-500/10 blur-xl opacity-0 group-hover/code:opacity-100 transition-opacity duration-1000" />

      <div className="relative bg-black/95 border border-green-900/40 p-4 overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.05)]">
        {/* Internal CRT Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-20"
          style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,255,0,0.1) 2px)' }} />

        {/* Syntax container */}
        <pre className="text-[10px] md:text-xs font-['Fira_Code'] leading-relaxed overflow-x-auto custom-scrollbar relative z-10">
          <code className="block">
            {tokens.map((token, i) => {
              if (!token) return null;

              // String Literals: Bright neon emerald
              if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
                return <span key={i} className="text-green-300 drop-shadow-[0_0_2px_rgba(34,197,94,0.6)]">{token}</span>;
              }

              // Comments: Faded data logs
              if (token.startsWith('//') || token.startsWith('/*')) {
                return <span key={i} className="text-green-900/60 italic">{token}</span>;
              }

              // Core Control Keywords: High-luminance white
              if (/^(fn|let|const|var|return|if|else|match|type|interface|class|import|export|await|async|try|catch)$/.test(token)) {
                return <span key={i} className="text-white font-black drop-shadow-[0_0_4px_rgba(255,255,255,0.4)] transition-all group-hover/code:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{token}</span>;
              }

              // Data Types: Cyan tinted italic
              if (/^(Result|Error|String|Number|Boolean)$/.test(token)) {
                return <span key={i} className="text-emerald-400 italic opacity-90">{token}</span>;
              }

              // Standard variable/op tokens
              return <span key={i} className="text-green-500/80 group-hover/code:text-green-500 transition-colors">{token}</span>;
            })}
          </code>
        </pre>

        {/* System integrity indicator */}
        <div className="absolute top-2 right-2 flex gap-1 z-30">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
          <div className="w-1 h-1 bg-green-900 rounded-full" />
        </div>
      </div>
    </div>
  );
};

const MatrixTheme: React.FC<{
  data: ContentItem[];
  profile: UserProfile;
  onEditProfile: () => void;
  onLinkClick: (id: string) => void;
}> = ({ data, profile, onEditProfile, onLinkClick }) => {
  const [command, setCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();

    if (cmd === 'help') {
      setTerminalOutput('Available: scan, profile, clear, help, status');
    } else if (cmd === 'profile') {
      setTerminalOutput(`User identity loaded: ${profile.name}`);
    } else if (cmd === 'scan' || cmd === 'scan network') {
      setTerminalOutput('Scanning local network... Found 12 active nodes. Security: VULNERABLE.');
    } else if (cmd === 'clear') {
      setTerminalOutput(null);
    } else if (cmd === 'status') {
      setTerminalOutput('System state: NOMINAL. Core temperature: 34°C. Uplink: STABLE.');
    } else if (cmd !== '') {
      setTerminalOutput(`Error: Command '${cmd}' not recognized. Type 'help' for options.`);
    }

    setCommand('');
  };

  return (
    <div className="min-h-screen font-['Fira_Code'] text-green-500 p-8 md:p-16 flex flex-col gap-4 overflow-hidden relative">
      <MatrixBackground />

      <div className="z-10 flex flex-col gap-2 max-w-4xl mx-auto w-full">
        <nav className="flex items-center gap-4 bg-black/80 border border-green-900 p-3 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
          <span className="text-green-800 font-bold">$</span>
          <form onSubmit={handleCommand} className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={command}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setCommand(e.target.value)}
              placeholder={isFocused ? "" : "Enter command... (try 'help')"}
              className="w-full bg-transparent border-none outline-none text-green-500 placeholder:text-green-900 font-bold uppercase text-sm tracking-widest caret-transparent"
              autoFocus
            />
            {isFocused && (
              <span
                className="absolute pointer-events-none h-[1.2em] w-[0.6em] bg-green-500 animate-terminal-blink"
                style={{ left: `calc(${command.length}ch)`, transition: 'left 0.1s ease-out' }}
              />
            )}
          </form>
        </nav>

        {terminalOutput && (
          <div className="bg-black/90 border border-green-500/50 p-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-green-800 mr-2">[SYSTEM]:</span>
            <TypewriterText text={terminalOutput} delay={20} />
            <button onClick={() => setTerminalOutput(null)} className="float-right text-[10px] hover:text-white">[X]</button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4 z-10 max-w-4xl mx-auto w-full overflow-hidden">
        <header className="border-b border-green-900 pb-8 mb-8 mt-12 flex flex-col items-center gap-10 text-center">
          <div className="shrink-0 scale-100 md:scale-110">
            <ThemedProfile theme={ThemeType.MATRIX} profile={profile} onEdit={onEditProfile} />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold uppercase tracking-tighter">
              <TypewriterText text={`Initializing_${profile.name.replace(/\s/g, '_')}...`} delay={80} />
            </h1>
            <p className="text-green-800 text-sm mt-3 font-bold">[!] WARNING: SECURE CONNECTION ESTABLISHED</p>
          </div>
        </header>

        <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar scroll-smooth">
          {data.map((item, idx) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick(item.id)}
              className="border border-green-900/40 p-4 bg-black/40 hover:bg-green-500/5 transition-all group flex flex-col gap-2 relative border-l-4 border-l-transparent hover:border-l-green-500 block"
            >
              <div className="absolute top-2 right-4 text-[10px] text-green-900 font-bold">{item.timestamp}</div>
              <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                <span>[{idx.toString().padStart(3, '0')}]</span>
                <span className="uppercase">{item.category}</span>
                <span className={`px-1 rounded ${item.status === 'CRITICAL' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>{item.status}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-white transition-colors">{">"} {item.title}</h3>
              <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
              {item.codeSnippet && <SyntaxHighlightedCode code={item.codeSnippet} />}
            </a>
          ))}
        </div>

        {/* Integrated Guestbook Section */}
        <div className="mt-12 border-t border-green-900 pt-12">
          <h2 className="text-2xl font-black uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 animate-ping" />
            Network_Transmissions
          </h2>
          <div className="bg-black/80 border border-green-900 p-6 h-[500px] shadow-[0_0_30px_rgba(0,255,0,0.1)]">
            <Guestbook isInline />
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 50, 0, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0F0; }
        @keyframes terminal-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-terminal-blink { animation: terminal-blink 1s step-end infinite; }
      `}</style>
    </div>
  );
};

export default MatrixTheme;
