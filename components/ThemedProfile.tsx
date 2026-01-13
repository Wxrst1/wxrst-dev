
import React from 'react';
import { ThemeType, UserProfile } from '../types';

interface ThemedProfileProps {
  theme: ThemeType | string;
  profile: UserProfile;
  onEdit: () => void;
}

const SocialLinks: React.FC<{ socials?: UserProfile['socials'], className?: string, iconClass?: string }> = ({ socials, className = "flex gap-4 justify-center mt-4", iconClass = "w-5 h-5 fill-current" }) => {
  if (!socials) return null;
  const icons: Record<string, { path: React.ReactNode, viewBox: string }> = {
    github: {
      path: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />,
      viewBox: "0 0 24 24"
    },
    twitter: {
      path: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
      viewBox: "0 0 24 24"
    },
    linkedin: {
      path: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />,
      viewBox: "0 0 24 24"
    },
    instagram: {
      path: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
      viewBox: "0 0 24 24"
    },
    discord: {
      path: <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.7728-.6083 1.1581a18.3246 18.3246 0 00-5.4876 0C9.0837 3.6628 8.8415 3.2653 8.639 2.8917a.0779.0779 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />,
      viewBox: "0 0 24 24"
    },
    steam: {
      path: <path d="M127.779 0C60.42 0 5.24 52.412 0 119.014l68.724 28.674a35.812 35.812 0 0 1 20.426-6.366c.682 0 1.356.019 2.02.056l30.566-44.71v-.626c0-26.903 21.69-48.796 48.353-48.796 26.662 0 48.352 21.893 48.352 48.796 0 26.902-21.69 48.804-48.352 48.804-.37 0-.73-.009-1.098-.018l-43.593 31.377c.028.582.046 1.163.046 1.735 0 20.204-16.283 36.636-36.294 36.636-17.566 0-32.263-12.658-35.584-29.412L4.41 164.654c15.223 54.313 64.673 94.132 123.369 94.132 70.818 0 128.221-57.938 128.221-129.393C256 57.93 198.597 0 127.779 0zM80.352 196.332l-15.749-6.568c2.787 5.867 7.621 10.775 14.033 13.47 13.857 5.83 29.836-.803 35.612-14.799a27.555 27.555 0 0 0 .046-21.035c-2.768-6.79-7.999-12.086-14.706-14.909-6.67-2.795-13.811-2.694-20.085-.304l16.275 6.79c10.222 4.3 15.056 16.145 10.794 26.46-4.253 10.314-15.998 15.195-26.22 10.895zm121.957-100.29c0-17.925-14.457-32.52-32.217-32.52-17.769 0-32.226 14.595-32.226 32.52 0 17.926 14.457 32.512 32.226 32.512 17.76 0 32.217-14.586 32.217-32.512zm-56.37-.055c0-13.488 10.84-24.42 24.2-24.42 13.368 0 24.208 10.932 24.208 24.42 0 13.488-10.84 24.421-24.209 24.421-13.359 0-24.2-10.933-24.2-24.42z" />,
      viewBox: "0 0 256 259"
    },
    youtube: {
      path: <path d="M21.582,3.955c-0.233-0.936-0.908-1.705-1.791-1.956C18.176,1.554,12,1.5,12,1.5s-6.176,0.054-7.791,0.499 C3.326,2.25,2.651,3.02,2.418,3.955C2,5.655,2,9.206,2,9.206s0,3.551,0.418,5.251c0.233,0.936,0.908,1.705,1.791,1.956 C5.824,16.858,12,16.912,12,16.912s6.176-0.054,7.791-0.499c0.883-0.251,1.558-1.02,1.791-1.956C22,12.757,22,9.206,22,9.206 S22,5.655,21.582,3.955z M10,12.75v-7l6,3.5L10,12.75z" />,
      viewBox: "0 0 24 24"
    }
  };

  return (
    <div className={className}>
      {Object.entries(socials).map(([key, url]) => {
        if (!url) return null;
        const iconData = icons[key];
        if (!iconData) return null;

        return (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <svg className={iconClass} viewBox={iconData.viewBox} xmlns="http://www.w3.org/2000/svg">
              {iconData.path}
            </svg>
          </a>
        );
      })}
    </div>
  );
};

const ThemedProfile: React.FC<ThemedProfileProps> = ({ theme, profile, onEdit }) => {
  const renderProfile = () => {
    switch (theme) {
      case ThemeType.THE_HEIST:
        return (
          <div className="flex flex-col md:flex-row gap-8 bg-zinc-950 p-8 border border-cyan-500/20 relative group">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-[10px] uppercase font-black">Target_Dossier_Verified</div>
            <div className="w-32 h-40 bg-zinc-900 border-2 border-cyan-500/40 relative overflow-hidden shrink-0">
              <img src={profile.avatarUrl} className="w-full h-full object-cover grayscale brightness-50 contrast-125" alt={profile.name} />
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
              <div className="absolute inset-0 border border-cyan-500/50 pointer-events-none" />
            </div>
            <div className="space-y-4 font-mono text-cyan-500">
              <div>
                <span className="text-[8px] opacity-40 block uppercase">Name</span>
                <h2 className="text-2xl font-black uppercase italic">{profile.name}</h2>
              </div>
              <div>
                <span className="text-[8px] opacity-40 block uppercase">Title</span>
                <p className="text-xs font-bold">{profile.title}</p>
              </div>
              <p className="text-[10px] leading-relaxed opacity-60 max-w-sm italic">"{profile.bio}"</p>
              <button onClick={onEdit} className="text-[9px] underline underline-offset-4 hover:text-white transition-colors">Edit Intel</button>
            </div>
          </div>
        );

      case ThemeType.THE_EXORCISM:
        return (
          <div className="relative p-8 bg-black border border-zinc-800 text-zinc-400 font-mono tracking-widest max-w-md overflow-hidden">
            <div className="flex gap-6 items-start">
              <div className="relative w-24 h-32 bg-zinc-900 border border-zinc-800 grayscale contrast-150 overflow-hidden shrink-0 group">
                <img src={profile.avatarUrl} className="w-full h-full object-cover opacity-80 group-hover:invert transition-all duration-75" alt={profile.name} />
                <div className="absolute inset-0 bg-red-900/40 opacity-0 group-hover:opacity-100 mix-blend-color-dodge transition-opacity duration-100" />
              </div>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="text-[10px] uppercase text-red-900 mb-1 font-bold">Subject_Identity</div>
                  <h2 className="text-2xl text-zinc-100 font-bold uppercase">{profile.name}</h2>
                  <div className="text-xs text-zinc-600">{profile.title}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-red-900 mb-1 font-bold">Psych_Eval</div>
                  <p className="text-[10px] leading-relaxed opacity-60 italic">"{profile.bio}"</p>
                </div>
                <SocialLinks socials={profile.socials} className="flex gap-4 items-center pl-1 pt-1 opacity-70" iconClass="w-3 h-3 fill-current text-red-900 hover:text-red-500 transition-colors" />
                <button onClick={onEdit} className="text-[9px] bg-red-950/20 text-red-800 px-3 py-1 border border-red-900/30 hover:bg-red-900 hover:text-white transition-all uppercase">Modify Record</button>
              </div>
            </div>
            {/* Scanlines on the card specifically */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_1px] pointer-events-none" />
          </div>
        );

      case ThemeType.THE_MUSEUM:
        return (
          <div className="flex flex-col items-center text-center gap-6 p-12 bg-white/5 border-[16px] border-double border-zinc-800 shadow-2xl font-serif">
            <div className="w-48 h-64 border-4 border-yellow-900/20 p-2 shadow-inner bg-zinc-900 relative">
              <img src={profile.avatarUrl} className="w-full h-full object-cover sepia" alt={profile.name} />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,1)]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter text-white">{profile.name}</h2>
              <p className="text-xs uppercase tracking-[0.5em] text-yellow-600 font-bold">{profile.title}</p>
              <p className="text-sm italic opacity-40 max-w-xs mx-auto mt-4 leading-relaxed">"{profile.bio}"</p>
            </div>
            <button onClick={onEdit} className="px-6 py-1 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Update Records</button>
          </div>
        );

      case ThemeType.MATRIX:
        return (
          <div className="font-mono text-green-500 bg-black p-6 border-l-4 border-green-500/50 max-w-md">
            <div className="text-[10px] mb-4 opacity-50 font-bold tracking-widest uppercase">System.User_Identity(active)</div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-green-900/40 pb-1">
                <span className="opacity-40 uppercase text-[9px]">Alias:</span>
                <span className="font-black">{profile.name}</span>
              </div>
              <div className="flex justify-between border-b border-green-900/40 pb-1">
                <span className="opacity-40 uppercase text-[9px]">Status:</span>
                <span className="text-white animate-pulse">{profile.title}</span>
              </div>
              <p className="text-xs leading-relaxed italic opacity-70 border-l border-green-900/40 pl-3">"{profile.bio}"</p>
              <button onClick={onEdit} className="text-[9px] bg-green-900/20 px-2 py-1 border border-green-500/20 hover:bg-green-500 hover:text-black transition-all">Overwrite_Identity</button>
            </div>
          </div>
        );

      case ThemeType.THE_CORRUPTION:
        return (
          <div className="p-8 border border-black/5 bg-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col gap-6">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">{profile.name}</h2>
              <p className="text-xl font-bold italic tracking-widest text-red-600">{profile.title}</p>
              <p className="text-sm opacity-60 leading-relaxed font-light">"{profile.bio}"</p>
              <div className="h-px w-full bg-black/5" />
              <button onClick={onEdit} className="text-[10px] font-black uppercase underline decoration-red-500">Fix Details</button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
          </div>
        );

      case ThemeType.CYBERPUNK:
        return (
          <div className="flex flex-col gap-6 p-8 bg-zinc-900/90 border-r-4 border-fuchsia-600 shadow-[20px_0_40px_rgba(0,0,0,0.5)] relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-fuchsia-500 p-1 relative overflow-hidden">
                <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full" alt={profile.name} />
                <div className="absolute inset-0 bg-cyan-400/20 mix-blend-overlay animate-pulse" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">{profile.name}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">{profile.title}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400 italic font-mono border-l border-zinc-700 pl-4">"{profile.bio}"</p>
            <SocialLinks socials={profile.socials} className="flex gap-3 text-cyan-500/50" iconClass="w-4 h-4 fill-current hover:text-fuchsia-500 hover:drop-shadow-[0_0_5px_fuchsia] transition-all" />
            <button onClick={onEdit} className="w-fit text-[9px] font-black uppercase text-fuchsia-500 border border-fuchsia-500/20 px-3 py-1 hover:bg-fuchsia-500 hover:text-white transition-all">Mod_Identity</button>
          </div>
        );

      case ThemeType.STEAMPUNK:
        return (
          <div className="flex items-start gap-8 bg-[#f4e4bc] p-8 border-[10px] border-double border-[#8b4513] shadow-inner font-serif relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 border-b border-l border-[#8b4513] opacity-20 pointer-events-none" />
            <div className="w-24 h-32 border-4 border-[#8b4513] p-1 bg-zinc-900 relative shrink-0">
              <img src={profile.avatarUrl} className="w-full h-full object-cover sepia grayscale contrast-125" alt={profile.name} />
              <div className="absolute inset-0 bg-[#d4af37]/20 mix-blend-overlay" />
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-black uppercase text-[#5d2e0a] tracking-widest leading-none">{profile.name}</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b4513] mt-2 italic decoration-double underline underline-offset-4">{profile.title}</p>
              </div>
              <p className="text-xs italic leading-relaxed text-[#2c1b0e]/80 max-w-sm">"{profile.bio}"</p>
              <button onClick={onEdit} className="text-[10px] font-black uppercase text-[#2c1b0e] border-b-2 border-[#8b4513] hover:text-[#8b4513] transition-colors">Recalibrate Profile</button>
            </div>
          </div>
        );

      case ThemeType.FBI_INVESTIGATION:
        return (
          <div className="flex items-center gap-6 bg-slate-900/90 border-r-4 border-cyan-500 p-6 shadow-2xl backdrop-blur-xl group">
            <div className="w-24 h-24 bg-black border border-slate-700 relative overflow-hidden shrink-0">
              <img src={profile.avatarUrl} className="w-full h-full object-cover opacity-60 contrast-125 grayscale" alt={profile.name} />
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-color" />
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/40 animate-fbi-item-scan shadow-[0_0_15px_cyan]" />
            </div>
            <div className="space-y-2 font-mono">
              <div className="flex flex-col">
                <span className="text-[7px] text-slate-500 uppercase font-black tracking-widest">Authorized Personnel</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">{profile.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1 bg-cyan-500 text-black text-[8px] font-black uppercase">Cleared</span>
                <span className="text-[9px] text-cyan-400 font-bold uppercase">{profile.title}</span>
              </div>
              <p className="text-[9px] text-slate-400 italic max-w-xs border-l border-slate-800 pl-2">"{profile.bio}"</p>
              <button onClick={onEdit} className="text-[8px] font-black uppercase text-slate-500 hover:text-cyan-400 transition-colors">Modify_Credentials</button>
            </div>
          </div>
        );

      case ThemeType.AETHER_QUANTUM:
        return (
          <div className="relative p-10 flex flex-col items-center text-center gap-6 group">
            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full animate-pulse" />
            <div className="relative">
              <div className="w-32 h-32 rounded-full border border-cyan-400/30 p-2 group-hover:border-cyan-400 transition-all duration-700">
                <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full shadow-[0_0_30px_rgba(34,211,238,0.2)]" alt={profile.name} />
              </div>
              <div className="absolute -inset-2 border border-fuchsia-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute -inset-4 border border-cyan-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            </div>
            <div className="space-y-1 relative z-10">
              <h2 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {profile.name}
              </h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-cyan-400">{profile.title}</p>
              <p className="text-xs italic text-white/50 max-w-xs mt-4">"{profile.bio}"</p>
            </div>
            <button onClick={onEdit} className="relative z-10 px-8 py-1 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">Re-Sync</button>
          </div>
        );

      case ThemeType.PIRATE:
        return (
          <div className="bg-[#e8d5b5] p-8 border-4 border-[#3e1e1e] shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3e1e1e]/5 rounded-full rotate-45 transform group-hover:scale-110 transition-transform" />
            <div className="flex gap-8 items-center relative z-10">
              <div className="w-24 h-32 bg-black border-2 border-[#8b4513] shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                <img src={profile.avatarUrl} className="w-full h-full object-cover sepia grayscale contrast-150 brightness-75" alt={profile.name} />
              </div>
              <div className="space-y-4 font-serif">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-[#8b4513]">WANTED // ALIVE OR DEAD</span>
                  <h2 className="text-5xl font-['Pirata_One'] text-[#2c1b0e] leading-none">{profile.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚓</span>
                  <p className="text-xs font-bold uppercase italic text-[#2c1b0e]/70 tracking-widest">{profile.title}</p>
                </div>
                <p className="text-xs italic leading-relaxed text-[#2c1b0e]/80 max-w-[200px]">"{profile.bio}"</p>
                <button onClick={onEdit} className="text-[10px] font-black uppercase border-b-2 border-[#3e1e1e] hover:text-[#8b4513] transition-colors">Edit Bounty</button>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-4xl opacity-10 group-hover:opacity-40 transition-opacity">☠️</div>
          </div>
        );

      case ThemeType.ALCHEMIST:
        return (
          <div className="bg-zinc-950 p-10 border-2 border-indigo-900/50 shadow-[0_0_50px_rgba(79,70,229,0.1)] relative group overflow-hidden">
            {/* Witchy/Magical background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#312e81_0%,_transparent_70%)] opacity-20" />
            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <div className="w-28 h-28 rounded-full border-2 border-indigo-500 p-2 shadow-[0_0_30px_indigo]">
                <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full sepia-0 hue-rotate-[280deg] brightness-125" alt={profile.name} />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-['Cinzel'] text-indigo-300 tracking-tighter uppercase font-black italic">{profile.name}</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-fuchsia-400">High Sorceress // {profile.title}</p>
              </div>
              <p className="text-sm italic font-['Playfair_Display'] text-indigo-200/50 max-w-sm">"{profile.bio}"</p>
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-indigo-500/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
              <button onClick={onEdit} className="px-10 py-2 bg-indigo-900/30 text-indigo-300 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all">Transmute Profile</button>
            </div>
          </div>
        );

      case ThemeType.WAR:
        return (
          <div className="bg-[#1a1c12] p-8 border-l-[12px] border-[#3d422a] border-t border-b border-r border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-[20px] italic">TOP SECRET</div>
            <div className="flex gap-10 items-start">
              <div className="w-28 h-32 bg-stone-900 border-2 border-[#3d422a] p-1 relative shrink-0">
                <img src={profile.avatarUrl} className="w-full h-full object-cover grayscale contrast-150 brightness-50" alt={profile.name} />
                <div className="absolute top-0 left-0 w-full h-full bg-green-950/20 mix-blend-overlay" />
              </div>
              <div className="space-y-6 font-['Fira_Code']">
                <div className="space-y-1">
                  <span className="text-[8px] text-[#3d422a] font-black uppercase">Service ID: 0922-X</span>
                  <h2 className="text-3xl font-black text-stone-200 uppercase tracking-tighter italic">{profile.name}</h2>
                  <p className="text-[11px] font-bold text-[#8a916a] uppercase tracking-widest">{profile.title}</p>
                </div>
                <p className="text-xs leading-relaxed text-stone-400 max-w-sm italic">"{profile.bio}"</p>
                <button onClick={onEdit} className="px-6 py-2 bg-[#3d422a] text-[#1a1c12] text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 transition-colors">Modify Orders</button>
              </div>
            </div>
          </div>
        );

      case ThemeType.GAMING_PRO:
        return (
          <div className="w-[450px] bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,1)] group">
            <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
              <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
            </div>
            <div className="px-8 pb-8 -mt-12 relative flex flex-col items-center">
              <div className="w-32 h-32 rounded-3xl border-4 border-zinc-950 bg-zinc-900 p-2 overflow-hidden mb-4 shadow-xl">
                <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500" alt={profile.name} />
              </div>
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{profile.name}</h2>
                <div className="flex items-center justify-center gap-3">
                  <span className="px-2 py-0.5 bg-violet-600 text-white text-[9px] font-black rounded uppercase">PRO</span>
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{profile.title}</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-3 gap-2 mb-8 border-y border-white/5 py-4">
                {[
                  { label: 'Rank', value: 'S+' },
                  { label: 'Latency', value: '4ms' },
                  { label: 'Focus', value: '100%' }
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-[8px] text-zinc-500 uppercase font-black">{stat.label}</p>
                    <p className="text-sm font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-400 text-center italic mb-8">"{profile.bio}"</p>

              <SocialLinks socials={profile.socials} className="flex gap-4 justify-center mb-6" iconClass="w-4 h-4 fill-current text-white/50 hover:text-white transition-colors" />

              <button onClick={onEdit} className="w-full py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-violet-600 hover:text-white transition-all rounded-xl shadow-lg">Settings</button>
            </div>
          </div>
        );

      case ThemeType.HORROR:
        return (
          <div className="p-8 border-l-8 border-red-950 bg-black/80 flex flex-col gap-6 max-w-sm">
            <div className="text-[10px] text-red-900 font-bold tracking-widest uppercase mb-2">Subject_Record_394-C</div>
            <div className="aspect-square bg-zinc-900 border border-red-900/20 p-4 relative">
              <img src={profile.avatarUrl} className="w-full h-full object-cover opacity-20 grayscale brightness-50 sepia" alt={profile.name} />
              <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-['UnifrakturMaguntia'] text-red-800 leading-none">{profile.name}</h2>
              <p className="text-xs uppercase italic text-red-950 font-['Special_Elite']">{profile.title}</p>
              <p className="text-[11px] font-['Special_Elite'] text-red-900 italic leading-relaxed">"{profile.bio}"</p>
            </div>
            <button onClick={onEdit} className="text-[10px] font-bold uppercase text-red-700 hover:text-red-500 transition-colors border-t border-red-950 pt-4 text-left">Resurrect Profile</button>
          </div>
        );

      case ThemeType.NIGHTMARE:
        return (
          <div className="relative p-8 bg-black border border-white/10 max-w-md overflow-hidden group">
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[2] bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 pointer-events-none animate-[scan_5s_linear_infinite] bg-gradient-to-b from-transparent via-white/5 to-transparent h-[100px] z-[2]" />

            <div className="flex gap-6 relative z-[3]">
              <div className="relative w-28 h-36 border border-white/20 p-1 shrink-0">
                <img src={profile.avatarUrl} className="w-full h-full object-cover grayscale contrast-200 brightness-75" alt={profile.name} />
                <div className="absolute top-2 left-2 w-2 h-2 bg-red-600 animate-pulse shadow-[0_0_10px_red]" />
                <div className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50 inverted">REC</div>
              </div>

              <div className="flex flex-col flex-1 font-mono gap-4">
                <div className="space-y-1 border-b border-white/10 pb-2">
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest animate-pulse">Subject Detected</span>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter glitch-text">{profile.name}</h2>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] text-white/40 uppercase">Classification</p>
                  <p className="text-xs text-white font-bold uppercase decoration-wavy underline decoration-red-900">{profile.title}</p>
                </div>

                <p className="text-[10px] text-white/50 italic leading-relaxed">
                  "{profile.bio}"
                </p>
              </div>
            </div>

            <button onClick={onEdit} className="w-full mt-6 py-2 border border-red-900/30 text-red-800 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-red-950 hover:text-red-500 transition-colors z-[10] relative">
              Terminate Connection
            </button>

            <style>{`
              @keyframes scan {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(500%); }
              }
            `}</style>
          </div>
        );

      case ThemeType.SHOOTING:
        return (
          <div className="bg-[#050505] p-8 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)] relative group w-[350px]">
            {/* Tactical Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />

            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="w-full flex justify-between items-center border-b border-orange-500/20 pb-2">
                <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest animate-pulse">Target Verified</span>
                <span className="text-[10px] font-mono text-orange-500/50">ID: {Math.floor(Math.random() * 9000) + 1000}</span>
              </div>

              <div className="relative w-32 h-32">
                <div className="rounded-full overflow-hidden border-2 border-orange-500/30 p-1 group-hover:border-orange-500 transition-colors w-full h-full bg-orange-950/20">
                  <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full grayscale brightness-75 contrast-125" alt={profile.name} />
                </div>
                {/* Crosshair Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-px bg-orange-500" />
                  <div className="h-full w-px bg-orange-500 absolute" />
                  <div className="w-20 h-20 border border-orange-500 rounded-full absolute" />
                </div>
              </div>

              <div className="text-center space-y-2 w-full">
                <h2 className="text-3xl font-['Black_Ops_One'] text-orange-500 uppercase tracking-tighter">{profile.name}</h2>
                <div className="bg-orange-950/30 py-1 px-4 border border-orange-500/20 inline-block">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">{profile.title}</p>
                </div>
              </div>

              <p className="text-xs font-mono text-orange-500/70 text-center leading-relaxed max-w-xs border-l-2 border-orange-500/20 pl-4">
                "{profile.bio}"
              </p>

              <button onClick={onEdit} className="w-full py-2 bg-orange-600/10 border border-orange-500/50 text-orange-500 font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-black transition-all">
                Update Intel
              </button>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          </div>
        );

      case ThemeType.CELESTIAL_EMPIRE:
        return (
          <div className="relative w-[500px] bg-[#0A1A10] border-4 border-[#C8A050] p-12 shadow-[0_0_80px_rgba(200,160,80,0.2)] overflow-hidden group perspective-1000 transform-style-3d hover:rotate-y-6 transition-transform duration-700">
            {/* Holographic Gold Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A050]/10 via-transparent to-[#F8E7B6]/10 opacity-50 mix-blend-overlay pointer-events-none" />

            {/* Background Texture: Silk Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] animate-[pulse_8s_infinite]" />

            {/* Corner Ornaments - Enhanced */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-[6px] border-l-[6px] border-[#C8A050] rounded-tl-3xl opacity-80" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-[6px] border-r-[6px] border-[#C8A050] rounded-tr-3xl opacity-80" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[6px] border-l-[6px] border-[#C8A050] rounded-bl-3xl opacity-80" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[6px] border-r-[6px] border-[#C8A050] rounded-br-3xl opacity-80" />

            {/* Inner Border Frame */}
            <div className="absolute inset-4 border border-[#C8A050]/30 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8 transform translate-z-10 bg-black/5 backdrop-blur-sm p-4 rounded-xl">
              {/* Avatar Frame - Enhanced */}
              <div className="relative group/avatar">
                <div className="w-48 h-48 rounded-full border-4 border-[#C8A050] p-1 bg-[#1a0505] shadow-[0_0_50px_rgba(200,160,80,0.4)] relative z-10 transition-transform duration-500 group-hover/avatar:scale-105">
                  <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full grayscale brightness-90 contrast-125 sepia-[.3]" alt={profile.name} />
                </div>
                {/* Dragon Halo Animation - Layered */}
                <div className="absolute inset-[-30px] rounded-full border border-[#C8A050]/20 animate-[spin_20s_linear_infinite]"
                  style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 20deg, #C8A05010 20deg 40deg)' }} />
                <div className="absolute inset-[-15px] rounded-full border-2 border-[#C8A050]/40 border-dashed animate-[spin_30s_reverse_linear_infinite]" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] z-20 pointer-events-none" />
              </div>

              {/* Text Content - Enhanced Typography */}
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-['Cinzel'] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#F8E7B6] to-[#C8A050] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-wider scale-y-110">
                  {profile.name}
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8A050]" />
                  <p className="text-xs font-serif font-black uppercase tracking-[0.5em] text-[#C8A050] drop-shadow-sm">{profile.title}</p>
                  <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8A050]" />
                </div>
              </div>

              <p className="text-sm font-serif italic text-white/70 text-center leading-relaxed max-w-sm border-t border-[#C8A050]/20 pt-6 mt-2 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A1A10] px-2 text-[#C8A050] text-xl">❦</span>
                "{profile.bio}"
              </p>

              {/* Social Links Customization */}
              <div className="relative p-2">
                <div className="absolute inset-0 bg-[#C8A050]/5 blur-xl rounded-full" />
                <SocialLinks socials={profile.socials} className="flex gap-8 justify-center relative z-10" iconClass="w-6 h-6 fill-current text-[#C8A050] hover:text-[#FF4500] hover:drop-shadow-[0_0_10px_rgba(255,69,0,0.8)] transition-all duration-300 transform hover:-translate-y-1" />
              </div>

              <button onClick={onEdit} className="group/btn relative px-12 py-3 mt-4 overflow-hidden bg-transparent border border-[#C8A050] text-[#C8A050] font-serif uppercase tracking-[0.4em] text-[10px] font-bold transition-all hover:text-[#0A1A10]">
                <div className="absolute inset-0 w-0 bg-[#C8A050] transition-all duration-[250ms] ease-out group-hover/btn:w-full opacity-100" />
                <span className="relative z-10 group-hover/btn:text-black transition-colors">Consult Archives</span>
              </button>
            </div>
          </div>
        );

      case ThemeType.BLOOD_STAIN:
        return (
          <div className="p-10 bg-zinc-950 border-4 border-[#4a0404] shadow-[0_0_100px_rgba(74,4,4,0.4)] relative group overflow-hidden max-w-md">

            {/* Occult Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
              <div className="text-[200px] text-red-900 rotate-180 select-none">†</div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#4a0404_0%,_transparent_70%)] opacity-20" />

            <div className="relative z-10 flex flex-col items-center text-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#880808] p-1 shadow-[0_0_40px_rgba(136,8,8,0.6)] group-hover:scale-110 transition-transform duration-1000 relative z-10 bg-black">
                  <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-full grayscale brightness-75 contrast-125" alt={profile.name} />
                </div>
                {/* Orbiting Skull with Glow */}
                <div className="absolute inset-[-1.5rem] animate-[spin_4s_linear_infinite] z-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">☠️</div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-5xl font-['Playfair_Display'] font-black text-[#880808] tracking-widest drop-shadow-[0_0_10px_black] uppercase italic">{profile.name}</h2>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-[#880808] text-xl">⛧</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">{profile.title}</p>
                  <span className="text-[#880808] text-xl">⛧</span>
                </div>
              </div>

              <p className="text-sm italic font-serif text-white/40 max-w-sm leading-relaxed border-y border-[#4a0404]/30 py-4">
                "{profile.bio}"
              </p>

              <SocialLinks socials={profile.socials} className="flex gap-6 justify-center pb-2 text-[#880808]" iconClass="w-5 h-5 fill-current hover:text-red-500 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_5px_black]" />

              <button onClick={onEdit} className="w-full py-2 bg-[#4a0404] text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-black transition-all border border-red-900 group-hover:tracking-[1em] duration-500">
                Invoke Changes
              </button>
            </div>

            {/* Bleeding Edges */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-900 animate-drip" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-red-900 animate-[drip_4s_linear_infinite_reverse]" />
          </div >
        );

      case ThemeType.YIN_YANG:
        return (
          <div className="relative p-10 max-w-md mx-auto group perspective-1000">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700" />

            {/* Revolving Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-[3px] border-transparent border-t-[#FFD700] border-b-[#00FF00] animate-[spin_10s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/20 animate-[spin_15s_reverse_linear_infinite]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Split Avatar */}
              <div className="relative w-48 h-48 mb-8 rounded-full overflow-hidden border-4 border-white/10 group-hover:scale-105 transition-transform duration-500">
                {/* Left Side: Grayscale */}
                <img
                  src={profile.avatarUrl}
                  alt="Left"
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-125"
                  style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                />
                {/* Right Side: Inverted */}
                <img
                  src={profile.avatarUrl}
                  alt="Right"
                  className="absolute inset-0 w-full h-full object-cover invert filter contrast-125"
                  style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
                />
                {/* Central Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50 -translate-x-1/2 shadow-[0_0_10px_white]" />
              </div>

              <h2 className="text-5xl font-['Orbitron'] font-bold text-white tracking-widest uppercase mb-2 mix-blend-difference">{profile.name}</h2>
              <p className="text-base font-['Playfair_Display'] italic tracking-wide text-white/80 mb-6 mix-blend-difference">{profile.title}</p>

              <div className="w-16 h-px bg-white/50 mb-6" />

              <p className="text-sm font-['Playfair_Display'] leading-relaxed max-w-xs text-white/90 mb-8 mix-blend-difference">
                "{profile.bio}"
              </p>

              <div className="mix-blend-difference">
                <SocialLinks socials={profile.socials} className="flex gap-6 justify-center" iconClass="w-5 h-5 fill-current text-white hover:scale-125 transition-transform" />
              </div>

              <button onClick={onEdit} className="mt-8 text-[10px] font-['Orbitron'] uppercase tracking-[0.3em] border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors mix-blend-difference">
                Harmonize Data
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-12 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center gap-4 text-center">
            <div className="relative group/avatar">
              <img src={profile.avatarUrl} className="w-24 h-24 rounded-full border-2 border-white/20 p-1 group-hover/avatar:border-white transition-all duration-500" alt={profile.name} />
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tight">{profile.name}</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-px bg-white/20" />
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[9px]">{profile.title}</p>
                <span className="w-8 h-px bg-white/20" />
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-xs italic leading-relaxed">"{profile.bio}"</p>
            <div className="w-full h-px bg-white/5 my-2" />
            <SocialLinks socials={profile.socials} className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity" />
            <button onClick={onEdit} className="px-8 py-2 bg-white/10 text-white font-black uppercase text-[10px] rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">Edit Identity</button>
          </div>
        );
    }
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-top-4 duration-1000">
      {renderProfile()}
    </div>
  );
};

export default ThemedProfile;
