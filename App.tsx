import React, { useState, useEffect } from 'react';
import { ThemeType, MOCK_DATA, DEFAULT_PROFILE, getAutoTheme, UserProfile } from './types';
import ThemeSwitcher from './components/ThemeSwitcher';
import ProfileEditor from './components/ProfileEditor';
import { supabase } from './supabase';
import VisitorCounter from './components/VisitorCounter';
import QuickReactions from './components/QuickReactions';
import Guestbook from './components/Guestbook';
import AdminDashboard from './components/AdminDashboard';
import SecurityGateway from './components/SecurityGateway';
import SEOHead from './components/SEOHead';

import ChristmasTheme from './components/themes/ChristmasTheme';
import HalloweenTheme from './components/themes/HalloweenTheme';
import SaoJoaoTheme from './components/themes/SaoJoaoTheme';
import AutumnTheme from './components/themes/AutumnTheme';
import SteampunkTheme from './components/themes/SteampunkTheme';
import MatrixTheme from './components/themes/MatrixTheme';
import CyberpunkTheme from './components/themes/CyberpunkTheme';
import HorrorTheme from './components/themes/HorrorTheme';
import NewYearTheme from './components/themes/NewYearTheme';
import ValentineTheme from './components/themes/ValentineTheme';
import CarnivalTheme from './components/themes/CarnivalTheme';
import EasterTheme from './components/themes/EasterTheme';
import WarTheme from './components/themes/WarTheme';
import SerialKillerTheme from './components/themes/SerialKillerTheme';
import LabyrinthTheme from './components/themes/LabyrinthTheme';
import NightmareTheme from './components/themes/NightmareTheme';
import FBITheme from './components/themes/FBITheme';
import DrugDealerTheme from './components/themes/DrugDealerTheme';
import SingularityTheme from './components/themes/SingularityTheme';
import SolarSystemTheme from './components/themes/SolarSystemTheme';
import PirateTheme from './components/themes/PirateTheme';
import MedicalTheme from './components/themes/MedicalTheme';
import BloodStainTheme from './components/themes/BloodStainTheme';
import ShootingTheme from './components/themes/ShootingTheme';
import AetherQuantumTheme from './components/themes/AetherQuantumTheme';
import RusticHarvestTheme from './components/themes/RusticHarvestTheme';
import BankTheme from './components/themes/BankTheme';
import AlchemistTheme from './components/themes/AlchemistTheme';
import GamingProTheme from './components/themes/GamingProTheme';
import InvestigativeHorrorTheme from './components/themes/InvestigativeHorrorTheme';
import QuantumNexusTheme from './components/themes/QuantumNexusTheme';
import NeuralCanvasTheme from './components/themes/NeuralCanvasTheme';
import VoidCommerceTheme from './components/themes/VoidCommerceTheme';
import InterrogationRoomTheme from './components/themes/InterrogationRoomTheme';
import HeistTheme from './components/themes/HeistTheme';
import CorruptionTheme from './components/themes/CorruptionTheme';
import MuseumTheme from './components/themes/MuseumTheme';
import ExorcismTheme from './components/themes/ExorcismTheme';
import DragonTheme from './components/themes/DragonTheme';
import YinYangTheme from './components/themes/YinYangTheme';
import AkatsukiTheme from './components/themes/AkatsukiTheme';


const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Try to load from local storage first for instant detailed loading screens
    const saved = localStorage.getItem('radical_theme');
    return (saved as ThemeType) || getAutoTheme();
  });
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for admin mode and fetch profile data
  useEffect(() => {
    // SECURITY UPDATE: Removed URL param check.
    // Use Ctrl+Shift+A for Admin Access
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    fetchProfileData();
    recordVisit();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const recordLock = React.useRef(false);

  const recordVisit = async () => {
    if (recordLock.current) return;
    recordLock.current = true;

    try {
      const now = Date.now();
      const lastVisit = localStorage.getItem('last_visit_timestamp');
      const cooldown = 24 * 60 * 60 * 1000; // 24 hours

      const shouldRecord = !lastVisit || (now - parseInt(lastVisit)) > cooldown;

      if (shouldRecord) {
        // 1. Total Visits
        const { data } = await supabase.from('analytics').select('count').eq('key', 'total_visits').maybeSingle();
        const currentCount = data?.count || 0;
        await supabase.from('analytics').upsert({ key: 'total_visits', count: currentCount + 1 }, { onConflict: 'key' });

        // Update local timestamp immediately to prevent race conditions
        localStorage.setItem('last_visit_timestamp', now.toString());

        // 2. Track Referrer (Real Data)
        let referrer = 'Direct / Unknown';
        if (document.referrer) {
          try {
            const url = new URL(document.referrer);
            referrer = url.hostname;
          } catch {
            referrer = 'Unknown Source';
          }
        }
        const refKey = `referrer:${referrer}`;
        const { data: refData } = await supabase.from('analytics').select('count').eq('key', refKey).maybeSingle();
        await supabase.from('analytics').upsert({ key: refKey, count: (refData?.count || 0) + 1 }, { onConflict: 'key' });

        // 3. Track Device/Platform (Real Data for "Search Queries" replacement)
        const userAgent = navigator.userAgent || '';
        let platform = 'Unknown';
        if (/android/i.test(userAgent)) platform = 'Android';
        else if (/iPad|iPhone|iPod/.test(userAgent)) platform = 'iOS';
        else if (/windows phone/i.test(userAgent)) platform = 'Windows Phone';
        else if (/Win/i.test(userAgent)) platform = 'Windows';
        else if (/Mac/i.test(userAgent)) platform = 'MacOS';
        else if (/Linux/i.test(userAgent)) platform = 'Linux';

        const platKey = `platform:${platform}`;
        const { data: platData } = await supabase.from('analytics').select('count').eq('key', platKey).maybeSingle();
        await supabase.from('analytics').upsert({ key: platKey, count: (platData?.count || 0) + 1 }, { onConflict: 'key' });

        // 4. Track Resolution (Bucketized)
        const w = window.innerWidth;
        let res = 'Desktop';
        if (w < 768) res = 'Mobile';
        else if (w < 1024) res = 'Tablet';
        const resKey = `resolution:${res}`;
        const { data: resData } = await supabase.from('analytics').select('count').eq('key', resKey).maybeSingle();
        await supabase.from('analytics').upsert({ key: resKey, count: (resData?.count || 0) + 1 }, { onConflict: 'key' });

        // 5. Track Browser
        let browser = 'Other';
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Edg')) browser = 'Edge';
        const browserKey = `browser:${browser}`;
        const { data: browserData } = await supabase.from('analytics').select('count').eq('key', browserKey).maybeSingle();
        await supabase.from('analytics').upsert({ key: browserKey, count: (browserData?.count || 0) + 1 }, { onConflict: 'key' });
      }
    } catch (e) {
      console.warn('Analytics tracking failed', e);
    }
  };

  const handleLinkClick = async (linkId: string) => {
    try {
      // Find the link to get current count
      const link = profile.links.find(l => String(l.id) === String(linkId));
      // In a real app we'd just use an RPC `increment_visit_count(id)`
      const { data } = await supabase.from('links').select('visit_count').eq('id', linkId).single();
      const currentCount = data?.visit_count || 0;
      await supabase.from('links').update({ visit_count: currentCount + 1 }).eq('id', linkId);
    } catch (e) {
      console.warn('Click tracking failed', e);
    }
  };

  const handleThemeChange = async (newTheme: ThemeType) => {
    console.log('Attempting to change theme to:', newTheme);
    setTheme(newTheme);
    localStorage.setItem('radical_theme', newTheme);
    try {
      const { error } = await supabase.from('profile_config').upsert({ key: 'current_theme', value: newTheme }, { onConflict: 'key' });
      if (error) {
        console.error('Supabase error persisting theme:', error);
      } else {
        console.log('Theme persisted successfully');
      }
    } catch (e) {
      console.warn('Catch block: Failed to persist theme', e);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. Fetch profile configuration from 'profile_config'
      const { data: configData, error: configError } = await supabase
        .from('profile_config')
        .select('key, value');

      if (configError) throw configError;

      // 2. Fetch links from 'links' table
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .order('id', { ascending: true });

      if (linksError) throw linksError;

      // Map config keys to profile object
      const newProfile: Partial<UserProfile> = { ...DEFAULT_PROFILE, socials: {} };

      let savedTheme: ThemeType | null = null;
      configData.forEach((item: { key: string; value: string }) => {
        switch (item.key) {
          case 'name': newProfile.name = item.value; break;
          case 'title': newProfile.title = item.value; break;
          case 'bio_text': newProfile.bio = item.value; break;
          case 'avatar_url': newProfile.avatarUrl = item.value; break;
          case 'status_mode': newProfile.status_mode = item.value; break;
          case 'status_emoji': newProfile.status_emoji = item.value; break;
          case 'activity_playing': newProfile.activity_playing = item.value; break;
          case 'activity_watching': newProfile.activity_watching = item.value; break;
          case 'activity_working': newProfile.activity_working = item.value; break;
          case 'featured_project': newProfile.featured_project = item.value; break;
          case 'song_on_repeat': newProfile.song_on_repeat = item.value; break;
          case 'timezone': newProfile.timezone = item.value; break;
          case 'current_theme':
            if (item.value) savedTheme = item.value as ThemeType;
            break;
          case 'social_links':
            try {
              if (item.value) newProfile.socials = JSON.parse(item.value);
            } catch (e) {
              console.warn("Failed to parse social_links", e);
            }
            break;
          case 'social_github': newProfile.socials!.github = item.value; break;
          case 'social_twitter': newProfile.socials!.twitter = item.value; break;
          case 'social_linkedin': newProfile.socials!.linkedin = item.value; break;
          case 'social_instagram': newProfile.socials!.instagram = item.value; break;
          case 'social_youtube': newProfile.socials!.youtube = item.value; break;
          case 'social_discord': newProfile.socials!.discord = item.value; break;
        }
      });

      if (savedTheme) {
        setTheme(savedTheme);
        localStorage.setItem('radical_theme', savedTheme);
      }

      // Map links
      if (linksData) {
        newProfile.links = linksData.map(l => ({
          id: l.id,
          label: l.title,
          url: l.url,
          status: l.status,
          category: l.category
        }));
      }

      setProfile(newProfile as UserProfile);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      // Artificial delay to show off the loading screen
      await new Promise(resolve => setTimeout(resolve, 2500));
      setLoading(false);
    }
  };


  // Provide themes with profile data by wrapping them or passing props if they support it
  const renderTheme = () => {
    // Map profile links to ContentItem format for themes that use 'data'
    const dbData = profile.links.map(l => ({
      id: String(l.id),
      title: l.label,
      url: l.url,
      description: l.category || 'Link description',
      category: l.category || 'GENERAL',
      timestamp: new Date().toISOString(),
      status: (l.status as any) || 'ACTIVE'
    }));

    const commonProps = {
      data: dbData,
      profile,
      onEditProfile: () => setIsEditorOpen(true),
      onLinkClick: handleLinkClick,
      isAdmin,
    };

    switch (theme) {
      case ThemeType.MATRIX: return <MatrixTheme {...commonProps} />;
      case ThemeType.THE_HEIST: return <HeistTheme {...commonProps} />;
      case ThemeType.THE_CORRUPTION: return <CorruptionTheme {...commonProps} />;
      case ThemeType.THE_MUSEUM: return <MuseumTheme {...commonProps} />;
      case ThemeType.CYBERPUNK: return <CyberpunkTheme {...commonProps} />;
      case ThemeType.HORROR: return <HorrorTheme {...commonProps} />;
      case ThemeType.CHRISTMAS: return <ChristmasTheme {...commonProps} />;
      case ThemeType.HALLOWEEN: return <HalloweenTheme {...commonProps} />;
      case ThemeType.SAO_JOAO: return <SaoJoaoTheme {...commonProps} />;
      case ThemeType.AUTUMN: return <AutumnTheme {...commonProps} />;
      case ThemeType.NEW_YEAR: return <NewYearTheme {...commonProps} />;
      case ThemeType.VALENTINE: return <ValentineTheme {...commonProps} />;
      case ThemeType.CARNIVAL: return <CarnivalTheme {...commonProps} />;
      case ThemeType.EASTER: return <EasterTheme {...commonProps} />;
      case ThemeType.WAR: return <WarTheme {...commonProps} />;
      case ThemeType.SERIAL_KILLER: return <SerialKillerTheme {...commonProps} />;
      case ThemeType.LABYRINTH: return <LabyrinthTheme {...commonProps} />;
      case ThemeType.NIGHTMARE: return <NightmareTheme {...commonProps} />;
      case ThemeType.FBI_INVESTIGATION: return <FBITheme {...commonProps} />;
      case ThemeType.DRUG_DEALER: return <DrugDealerTheme {...commonProps} />;
      case ThemeType.SINGULARITY: return <SingularityTheme {...commonProps} />;
      case ThemeType.SOLAR_SYSTEM: return <SolarSystemTheme {...commonProps} />;
      case ThemeType.PIRATE: return <PirateTheme {...commonProps} />;
      case ThemeType.MEDICAL: return <MedicalTheme {...commonProps} />;
      case ThemeType.BLOOD_STAIN: return <BloodStainTheme {...commonProps} />;
      case ThemeType.SHOOTING: return <ShootingTheme {...commonProps} />;
      case ThemeType.AETHER_QUANTUM: return <AetherQuantumTheme {...commonProps} />;
      case ThemeType.RUSTIC_HARVEST: return <RusticHarvestTheme {...commonProps} />;
      case ThemeType.BANK: return <BankTheme {...commonProps} />;
      case ThemeType.ALCHEMIST: return <AlchemistTheme {...commonProps} />;
      case ThemeType.GAMING_PRO: return <GamingProTheme {...commonProps} />;
      case ThemeType.INVESTIGATIVE_HORROR: return <InvestigativeHorrorTheme {...commonProps} />;
      case ThemeType.QUANTUM_NEXUS: return <QuantumNexusTheme {...commonProps} />;
      case ThemeType.NEURAL_CANVAS: return <NeuralCanvasTheme {...commonProps} />;
      case ThemeType.VOID_COMMERCE: return <VoidCommerceTheme {...commonProps} />;
      case ThemeType.INTERROGATION_ROOM: return <InterrogationRoomTheme {...commonProps} />;
      case ThemeType.THE_EXORCISM: return <ExorcismTheme {...commonProps} />;
      case ThemeType.CELESTIAL_EMPIRE: return <DragonTheme {...commonProps} />;
      case ThemeType.YIN_YANG: return <YinYangTheme {...commonProps} />;
      case ThemeType.AKATSUKI: return <AkatsukiTheme {...commonProps} />;
      case ThemeType.STEAMPUNK:
      default: return <SteampunkTheme {...commonProps} />;
    }
  };

  const renderLoadingScreen = () => {
    switch (theme) {

      case ThemeType.YIN_YANG:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(100% 0, 0 0, 0 100%)' }} />
            <div className="relative z-10 flex flex-col items-center gap-12 mix-blend-difference text-white">
              <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center animate-[spin_3s_linear_infinite]">
                <span className="text-8xl font-black font-['Orbitron'] pb-4 pr-1">☯</span>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black font-['Orbitron'] tracking-[0.2em] uppercase">Restoring Balance</h2>
                <p className="text-sm font-['Playfair_Display'] italic tracking-wider opacity-80 animate-pulse">Integrating light and shadow...</p>
              </div>
            </div>
          </div>
        );

      case ThemeType.BLOOD_STAIN:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#050000] text-[#880808] font-['UnifrakturMaguntia'] uppercase tracking-widest relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4a0404_0%,_transparent_70%)] opacity-20 animate-pulse" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="text-9xl animate-[spin_10s_linear_infinite] opacity-50 text-[#ff0000]">⛧</div>
              <div className="text-2xl animate-pulse tracking-[0.5em]">Summoning_Demons...</div>
              <div className="w-64 h-1 bg-[#4a0404] rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_10px_#ff0000]"
                  style={{ animation: 'blood_load 2.5s ease-out forwards' }}
                />
              </div>
            </div>
            <style>{`
               @keyframes blood_load {
                 0% { width: 0%; }
                 100% { width: 100%; }
               }
             `}</style>
          </div>
        );

      case ThemeType.CYBERPUNK:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510] text-[#00f0ff] font-['Orbitron'] relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            <div className="text-6xl mb-8 animate-bounce">⚡</div>
            <div className="text-xl font-bold tracking-widest animate-pulse">SYSTEM_INITIALIZATION_V.2.0</div>
            <div className="mt-4 text-xs text-fuchsia-500">LOADING_NEURAL_ASSETS...</div>
          </div>
        );

      case ThemeType.MATRIX:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#00ff00] font-mono">
            <div className="text-4xl font-bold animate-pulse mb-4 tracking-widest">WAKE UP, NEO...</div>
            <div className="text-xs opacity-50">The matrix has you...</div>
          </div>
        );

      case ThemeType.THE_HEIST:
      case ThemeType.FBI_INVESTIGATION:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white font-mono">
            <div className="text-xs font-bold uppercase tracking-[0.5em] mb-4 text-white/50">Top Secret // Classified</div>
            <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Decrypting_Files...</div>
            <div className="mt-8 flex gap-2">
              {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <div className="animate-pulse tracking-widest text-xs uppercase opacity-70">Loading_Encrypted_Data...</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="neural-matrix-root" className="relative w-full min-h-screen overflow-hidden bg-black transition-colors duration-1000">
      <SEOHead profile={profile} currentTheme={theme} />

      {/* Interactive Global Elements */}
      {theme !== ThemeType.YIN_YANG && theme !== ThemeType.AKATSUKI && (
        <>
          <VisitorCounter theme={theme} />
          <QuickReactions theme={theme} />
        </>
      )}
      {!([
        ThemeType.BLOOD_STAIN,
        ThemeType.AETHER_QUANTUM,
        ThemeType.WAR,
        ThemeType.STEAMPUNK,
        ThemeType.PIRATE,
        ThemeType.THE_MUSEUM,
        ThemeType.MATRIX,
        ThemeType.HORROR,
        ThemeType.THE_HEIST,
        ThemeType.GAMING_PRO,
        ThemeType.FBI_INVESTIGATION,
        ThemeType.CYBERPUNK,
        ThemeType.THE_CORRUPTION,
        ThemeType.ALCHEMIST,
        ThemeType.THE_EXORCISM,
        ThemeType.CELESTIAL_EMPIRE,
        ThemeType.YIN_YANG,
        ThemeType.AKATSUKI
      ].includes(theme)) && <Guestbook theme={theme} />}

      <SecurityGateway
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={() => setIsAdmin(true)}
      />

      {/* Invisible Admin Trigger (Bottom Right Corner) */}
      <div
        className="fixed bottom-0 right-0 w-4 h-4 z-[9999] cursor-default"
        onDoubleClick={() => setIsLoginOpen(true)}
        title=" " // Empty title to hide it
      />

      {isAdmin && (
        <>
          <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />

          <AdminDashboard
            isOpen={isAdminDashboardOpen}
            onClose={() => setIsAdminDashboardOpen(false)}
            profile={profile}
            setProfile={setProfile}
            refreshData={fetchProfileData}
          />

          <ProfileEditor
            isOpen={isEditorOpen}
            onClose={() => {
              setIsEditorOpen(false);
              fetchProfileData(); // Refresh after save
            }}
            profile={profile}
            setProfile={setProfile}
          />

          {/* Admin Toolbar */}
          <div className="fixed top-8 left-8 z-[999] flex gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 group shadow-2xl"
            >
              <span className="text-lg">⚡</span>
              <span className="hidden md:inline group-hover:tracking-tighter">Command_Center</span>
            </button>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 group shadow-2xl"
            >
              <span className="text-lg">👤</span>
              <span className="hidden md:inline group-hover:tracking-tighter">Identity_Override</span>
            </button>
          </div>
        </>
      )}

      {loading ? (
        renderLoadingScreen()
      ) : (
        <div className="w-full min-h-screen">
          {renderTheme()}
        </div>
      )}
    </div>
  );
};

export default App;
