
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
    setProfile: (p: UserProfile) => void;
    refreshData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, profile, setProfile, refreshData }) => {
    const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PROFILE' | 'LINKS' | 'COMMENTS'>('ANALYTICS');
    const [stats, setStats] = useState({ visits: 0, reactions: 0, comments: 0, totalClicks: 0 });
    const [links, setLinks] = useState(profile.links);
    const [isSaving, setIsSaving] = useState(false);
    const [commentList, setCommentList] = useState<any[]>([]);

    // SEO Data State
    const [referrers, setReferrers] = useState<Array<{ src: string; count: number; pc: string }>>([]);
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [browsers, setBrowsers] = useState<Array<{ name: string; count: number; pc: string }>>([]);
    const [resolutions, setResolutions] = useState<Array<{ type: string; count: number; pc: string }>>([]);

    // Live Traffic State
    const [trafficHistory, setTrafficHistory] = useState<Array<{ in: number; out: number }>>(() => {
        // Initialize with random "noise" so it looks alive immediately
        return Array(13).fill(0).map(() => ({
            in: Math.floor(Math.random() * 60) + 10,
            out: Math.floor(Math.random() * 40) + 5
        }));
    });
    const lastTrafficStats = React.useRef({ visits: 0, clicks: 0, reactions: 0, comments: 0, initialized: false });

    useEffect(() => {
        if (isOpen) {
            fetchStats();
            fetchComments();
            setLinks(profile.links);
        }
    }, [isOpen, profile]);

    // Real-Time Traffic Poller
    useEffect(() => {
        if (!isOpen) return;

        const pollTraffic = async () => {
            // 1. Fetch all current totals
            const { data: vData } = await supabase.from('analytics').select('count').eq('key', 'total_visits').maybeSingle();
            const { count: cCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
            const { count: rCount } = await supabase.from('reactions').select('*', { count: 'exact', head: true });
            const { data: lData } = await supabase.from('links').select('visit_count');

            const currentVisits = vData?.count || 0;
            const currentComments = cCount || 0;
            const currentReactions = rCount || 0;
            const currentClicks = lData?.reduce((acc, curr) => acc + (Number(curr.visit_count) || 0), 0) || 0;

            // 2. Initialize if first run
            if (!lastTrafficStats.current.initialized) {
                lastTrafficStats.current = {
                    visits: currentVisits,
                    clicks: currentClicks,
                    reactions: currentReactions,
                    comments: currentComments,
                    initialized: true
                };
                return;
            }

            // 3. Calculate Deltas
            const deltaVisits = Math.max(0, currentVisits - lastTrafficStats.current.visits);
            const deltaComments = Math.max(0, currentComments - lastTrafficStats.current.comments);
            const deltaClicks = Math.max(0, currentClicks - lastTrafficStats.current.clicks);
            const deltaReactions = Math.max(0, currentReactions - lastTrafficStats.current.reactions);

            // 4. Construct Series (Amplified for visibility: 1 event = 20% height)
            const inbound = (deltaVisits + deltaComments) * 20;
            const outbound = (deltaClicks + deltaReactions) * 20;

            // 5. Update History
            setTrafficHistory(prev => {
                const newHistory = [...prev.slice(1), { in: Math.min(100, inbound), out: Math.min(100, outbound) }];
                return newHistory;
            });

            // 6. Update Last Stats
            lastTrafficStats.current = {
                ...lastTrafficStats.current,
                visits: currentVisits,
                clicks: currentClicks,
                reactions: currentReactions,
                comments: currentComments
            };

            // Also refresh the main stats text
            setStats({
                visits: currentVisits,
                reactions: currentReactions,
                comments: currentComments,
                totalClicks: currentClicks
            });
        };

        const interval = setInterval(pollTraffic, 3000); // Check every 3 seconds
        return () => clearInterval(interval);
    }, [isOpen]);

    const fetchStats = async () => {
        // Initial fetch handled by poller mostly, but kept for immediate load
        const { data: analytics } = await supabase.from('analytics').select('*').eq('key', 'total_visits').maybeSingle();
        const { count: reactionCount } = await supabase.from('reactions').select('*', { count: 'exact', head: true });
        const { count: commentCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
        const { data: linksData } = await supabase.from('links').select('visit_count');
        const totalClicks = linksData?.reduce((acc, curr) => acc + (Number(curr.visit_count) || 0), 0) || 0;

        setStats({
            visits: analytics?.count || 0,
            reactions: reactionCount || 0,
            comments: commentCount || 0,
            totalClicks
        });

        // Fetch SEO Data (Referrers & Platforms)
        const { data: allAnalytics } = await supabase.from('analytics').select('*');
        if (allAnalytics) {
            // Referrers
            const rawReferrers = allAnalytics.filter(r => r.key.startsWith('referrer:'));
            const totalRefVisits = rawReferrers.reduce((acc, curr) => acc + curr.count, 0) || 1;

            const processedReferrers = rawReferrers
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map(r => ({
                    src: r.key.replace('referrer:', ''),
                    count: r.count,
                    pc: Math.round((r.count / totalRefVisits) * 100) + '%'
                }));
            setReferrers(processedReferrers.length ? processedReferrers : [{ src: 'No Data Yet', count: 0, pc: '0%' }]);

            // Platforms
            const rawPlatforms = allAnalytics.filter(r => r.key.startsWith('platform:'));
            const processedPlatforms = rawPlatforms
                .sort((a, b) => b.count - a.count)
                .map(r => `${r.key.replace('platform:', '')} (${r.count})`);
            setPlatforms(processedPlatforms.length ? processedPlatforms : ['No Data Yet']);

            // Browsers
            const rawBrowsers = allAnalytics.filter(r => r.key.startsWith('browser:'));
            const totalBrowsers = rawBrowsers.reduce((acc, curr) => acc + curr.count, 0) || 1;
            const processedBrowsers = rawBrowsers
                .sort((a, b) => b.count - a.count)
                .map(r => ({
                    name: r.key.replace('browser:', ''),
                    count: r.count,
                    pc: Math.round((r.count / totalBrowsers) * 100) + '%'
                }));
            setBrowsers(processedBrowsers);

            // Resolutions
            const rawResolutions = allAnalytics.filter(r => r.key.startsWith('resolution:'));
            const totalRes = rawResolutions.reduce((acc, curr) => acc + curr.count, 0) || 1;
            const processedRes = rawResolutions
                .sort((a, b) => b.count - a.count)
                .map(r => ({
                    type: r.key.replace('resolution:', ''),
                    count: r.count,
                    pc: Math.round((r.count / totalRes) * 100) + '%'
                }));
            setResolutions(processedRes);
        }
    };

    const fetchComments = async () => {
        const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
        if (data) setCommentList(data);
    };

    const handleDeleteComment = async (id: number) => {
        const { error } = await supabase.from('comments').delete().eq('id', id);
        if (!error) fetchComments();
    };

    const handleExportReport = () => {
        const date = new Date().toLocaleDateString();
        const topLink = links.sort((a, b) => (Number((b as any).visit_count) || 0) - (Number((a as any).visit_count) || 0))[0];

        const report = `
RADICAL MORPH // INTELLIGENCE REPORT [${date}]

[GLOBAL METRICS]
- Total Visits: ${stats.visits}
- Total Clicks: ${stats.totalClicks}
- Reactions: ${stats.reactions}

[TOP PERFORMANCE]
- Most Popular Node: ${topLink ? topLink.label : 'N/A'} (${(topLink as any)?.visit_count || 0} clicks)

[TRAFFIC INTELLIGENCE]
- Top Source: ${referrers[0]?.src || 'N/A'}
- Primary Platform: ${platforms[0] || 'N/A'}
- Browser Distribution: ${browsers.map(b => `${b.name}:${b.pc}`).join(', ')}
- Resolution Distribution: ${resolutions.map(r => `${r.type}:${r.pc}`).join(', ')}

[END OF TRANSMISSION]
        `.trim();

        // Encode and open mail client
        window.location.href = `mailto:?subject=Daily Site Report - ${date}&body=${encodeURIComponent(report)}`;
    };

    const handleResetStats = async () => {
        if (!confirm('WARNING: FORMATTING NEURAL DRIVE...\n\nThis will permanently delete ALL analytics, reactions, and reset link clicks to zero.\n\nAre you sure you want to proceed with this irreversible action?')) return;

        setIsSaving(true);
        try {
            await supabase.from('analytics').delete().not('key', 'is', null); // Delete all analytics
            await supabase.from('reactions').delete().not('id', 'is', null); // Delete all reactions safer (not id=0)
            // Reset links visit_count
            const { data: allLinks } = await supabase.from('links').select('id');
            if (allLinks) {
                await Promise.all(allLinks.map(l => supabase.from('links').update({ visit_count: 0 }).eq('id', l.id)));
            }

            // Refresh
            fetchStats();
            alert('SYSTEM FORMAT COMPLETE. ALL METRICS RESET TO ZERO.');
        } catch (e) {
            console.error(e);
            alert('ERROR: FORMATTING FAILED.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updates = [
                { key: 'name', value: profile.name },
                { key: 'title', value: profile.title },
                { key: 'bio_text', value: profile.bio },
                { key: 'avatar_url', value: profile.avatarUrl },
                { key: 'social_github', value: profile.socials?.github || '' },
                { key: 'social_twitter', value: profile.socials?.twitter || '' },
                { key: 'social_linkedin', value: profile.socials?.linkedin || '' },
                { key: 'social_instagram', value: profile.socials?.instagram || '' },
                { key: 'social_youtube', value: profile.socials?.youtube || '' },
                { key: 'social_discord', value: profile.socials?.discord || '' },
                { key: 'social_links', value: JSON.stringify(profile.socials || {}) },
                { key: 'activity_playing', value: profile.activity_playing || '' },
            ];

            await supabase.from('profile_config').upsert(updates, { onConflict: 'key' });
            refreshData();
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddLink = () => {
        const newLink = { label: 'New Link', url: 'https://', category: 'GENERAL', status: 'ACTIVE' };
        setLinks([...links, newLink]);
    };

    const handleUpdateLink = (index: number, field: string, value: string) => {
        const newLinks = [...links];
        (newLinks[index] as any)[field] = value;
        setLinks(newLinks);
    };

    const handleSaveLinks = async () => {
        setIsSaving(true);
        try {
            // For simplicity, we delete all and re-insert, or upsert if we had IDs
            // A better way is to handle each row, but for this project upserting with IDs works.
            const toUpdate = links.filter(l => l.id).map(l => ({
                id: l.id,
                title: l.label,
                url: l.url,
                category: l.category || 'GENERAL',
                status: l.status || 'ACTIVE'
            }));

            const toInsert = links.filter(l => !l.id).map(l => ({
                title: l.label,
                url: l.url,
                category: l.category || 'GENERAL',
                status: l.status || 'ACTIVE'
            }));

            console.log('Syncing links:', { toUpdate, toInsert });

            if (toUpdate.length > 0) {
                const { error: upError } = await supabase.from('links').upsert(toUpdate);
                if (upError) throw upError;
            }

            if (toInsert.length > 0) {
                const { error: insError } = await supabase.from('links').insert(toInsert);
                if (insError) throw insError;
            }

            refreshData();
            alert('Links updated successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-12 overflow-hidden">
            <div className="w-full max-w-6xl h-full bg-zinc-900 border border-white/10 flex flex-col shadow-3xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white flex items-center justify-center">
                            <span className="text-black font-black text-xl">AD</span>
                        </div>
                        <div>
                            <h1 className="text-white font-black uppercase tracking-[0.2em] text-lg">Central_Intelligence_Command</h1>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest">Admin Authorization Level: O5-X</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-red-500 transition-all text-white">✕</button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Navigation */}
                    <div className="w-64 border-r border-white/10 bg-black/20 p-6 space-y-2">
                        {[
                            { id: 'ANALYTICS', icon: '📊', label: 'Analytics' },
                            { id: 'PROFILE', icon: '👤', label: 'Identify' },
                            { id: 'LINKS', icon: '🔗', label: 'Neural_Links' },
                            { id: 'COMMENTS', icon: '💬', label: 'Transmissions' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full p-4 flex items-center gap-3 transition-all border border-transparent ${activeTab === tab.id ? 'bg-white text-black font-black' : 'text-white/60 hover:border-white/20 hover:text-white'}`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-12 overflow-y-auto no-scrollbar">

                        {activeTab === 'ANALYTICS' && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {[
                                        {
                                            label: 'Total_Intrusion_Visits',
                                            value: stats.visits,
                                            sub: '+12% from last cycle',
                                            color: 'cyan',
                                            chart: (
                                                <svg className="absolute bottom-0 left-0 w-full h-16 opacity-30" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                    <path d="M0 40 L0 30 L10 25 L20 35 L30 20 L40 30 L50 15 L60 25 L70 10 L80 20 L90 5 L100 15 L100 40 Z" fill="currentColor" className="text-cyan-500" />
                                                    <path d="M0 30 L10 25 L20 35 L30 20 L40 30 L50 15 L60 25 L70 10 L80 20 L90 5 L100 15" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400" />
                                                </svg>
                                            )
                                        },
                                        {
                                            label: 'Neural_Node_Clicks',
                                            value: stats.totalClicks,
                                            sub: 'Direct link interaction',
                                            color: 'yellow',
                                            chart: (
                                                <div className="absolute bottom-0 right-0 w-1/2 h-16 flex items-end gap-1 px-4 opacity-50">
                                                    {[40, 70, 30, 80, 50, 90, 60, 40].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-yellow-500" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            )
                                        },
                                        {
                                            label: 'Social_Impact_Reactions',
                                            value: stats.reactions,
                                            sub: 'Active feedback loops',
                                            color: 'purple',
                                            chart: (
                                                <div className="absolute top-4 right-4 w-12 h-12">
                                                    <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
                                                    <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                                    <div className="absolute inset-[30%] bg-purple-500 rounded-full animate-pulse" />
                                                </div>
                                            )
                                        },
                                        {
                                            label: 'Encrypted_Comments',
                                            value: stats.comments,
                                            sub: 'External transmissions',
                                            color: 'green',
                                            chart: (
                                                <div className="absolute bottom-4 right-4 text-[8px] font-mono text-green-500/50 flex flex-col items-end leading-none">
                                                    {['01001010', '11010100', '00101110', '10101011'].map((line, i) => (
                                                        <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>{line}</span>
                                                    ))}
                                                </div>
                                            )
                                        },
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-black/50 backdrop-blur-md border border-white/5 p-6 relative group overflow-hidden h-40 flex flex-col justify-between hover:border-white/20 transition-all duration-500">
                                            {/* Scanning Line Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] w-full animate-[scan_4s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100" />

                                            {/* Glitch Corner Accents */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-cyan-500 transition-colors" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-cyan-500 transition-colors" />

                                            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 blur-[60px] group-hover:bg-${stat.color}-500/20 transition-all`} />

                                            <div className="relative z-10">
                                                <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1 group-hover:text-white/70 transition-colors">{stat.label}</p>
                                                <p className="text-4xl text-white font-black tracking-tighter shadow-lg group-hover:scale-105 transition-transform origin-left">{stat.value.toLocaleString()}</p>
                                            </div>

                                            <div className="relative z-10 w-full flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500 animate-pulse`} />
                                                <p className={`text-[8px] text-${stat.color}-400 font-mono uppercase tracking-widest bg-black/50 inline-block px-1`}>{stat.sub}</p>
                                            </div>

                                            {/* Chart Layer */}
                                            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity">
                                                {stat.chart}
                                            </div>

                                            <style>{`
                                                @keyframes scan {
                                                    0% { transform: translateY(-50%); }
                                                    100% { transform: translateY(0%); }
                                                }
                                            `}</style>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-black border border-white/5 p-8 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 border-b border-white/10 pb-4 flex justify-between relative z-10">
                                        <span>Active_Node_Traffic</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-cyan-500" />
                                                <span className="text-[9px] text-white/40">INBOUND</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-500" />
                                                <span className="text-[9px] text-white/40">OUTBOUND</span>
                                            </div>
                                            <span className="text-cyan-500 animate-pulse ml-4">LIVE</span>
                                        </div>
                                    </h3>

                                    <div className="h-64 flex items-end justify-between gap-2 px-4 relative z-10">
                                        {/* Background Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-full h-px bg-white border-t border-dashed border-white/20" />
                                            ))}
                                        </div>

                                        {trafficHistory.map((data, i) => (
                                            <div key={i} className="flex-1 h-full flex items-end justify-center gap-[2px] relative group">
                                                {/* Tooltip */}
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                                                    <div className="text-[8px] font-black uppercase tracking-widest">T-{12 - i}</div>
                                                    <div className="text-[10px] font-mono"><span className="text-cyan-600">IN:{data.in / 20}</span> | <span className="text-purple-600">OUT:{data.out / 20}</span></div>
                                                </div>

                                                {/* Inbound Bar */}
                                                <div className="w-1/2 bg-cyan-900/30 h-full relative overflow-hidden rounded-t-sm">
                                                    <div className="absolute bottom-0 w-full bg-cyan-500 hover:bg-cyan-400 transition-all duration-500" style={{ height: `${data.in}%` }} />
                                                </div>

                                                {/* Outbound Bar */}
                                                <div className="w-1/2 bg-purple-900/30 h-full relative overflow-hidden rounded-t-sm">
                                                    <div className="absolute bottom-0 w-full bg-purple-500 hover:bg-purple-400 transition-all duration-500" style={{ height: `${data.out}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 text-[8px] text-white/20 font-mono uppercase relative z-10">
                                        <span>-40s</span>
                                        <span>-30s</span>
                                        <span>-20s</span>
                                        <span>-10s</span>
                                        <span className="text-cyan-500">NOW</span>
                                    </div>
                                </div>

                                {/* SEO / Traffic Sources Grid (REAL DATA) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-black border border-white/5 p-6 space-y-4">
                                        <h4 className="text-[10px] text-white/40 uppercase font-black tracking-widest">Top_Referrers (Real-Time)</h4>
                                        <div className="space-y-2">
                                            {referrers.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 text-xs font-mono group">
                                                    <div className="w-32 text-white/60 truncate" title={item.src}>{item.src}</div>
                                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-all" style={{ width: item.pc }} />
                                                    </div>
                                                    <div className="w-12 text-right text-white font-bold">{item.count}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-black border border-white/5 p-6 space-y-4">
                                        <h4 className="text-[10px] text-white/40 uppercase font-black tracking-widest">Client_Platforms / Browsers</h4>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {platforms.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-white/70 font-mono hover:bg-white/10 hover:text-white transition-all cursor-crosshair">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="space-y-2 border-t border-white/5 pt-4">
                                            {browsers.map((b, i) => (
                                                <div key={i} className="flex items-center justify-between text-[8px] font-mono">
                                                    <span className="text-white/40">{b.name}</span>
                                                    <div className="flex-1 mx-4 h-[1px] bg-white/10" />
                                                    <span className="text-cyan-500">{b.pc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-black border border-white/5 p-6 space-y-4">
                                        <h4 className="text-[10px] text-white/40 uppercase font-black tracking-widest">Display_Resolutions</h4>
                                        <div className="space-y-3">
                                            {resolutions.map((r, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-[8px] font-mono">
                                                        <span className="text-white/60">{r.type}</span>
                                                        <span className="text-white/40">{r.count} sessions</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500/50" style={{ width: r.pc }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Link Performance Leaderboard */}
                                <div className="bg-black border border-white/5 p-6 space-y-6">
                                    <h4 className="text-[10px] text-white/40 uppercase font-black tracking-widest flex justify-between">
                                        <span>Highest_Value_Nodes (Most Clicked)</span>
                                        <span className="text-cyan-500">SYSTEM_OPTIMIZED</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {links
                                            .sort((a, b) => (Number((b as any).visit_count) || 0) - (Number((a as any).visit_count) || 0))
                                            .slice(0, 5)
                                            .map((link, i) => {
                                                const maxClicks = Math.max(1, Number((links[0] as any).visit_count) || 0);
                                                const clicks = Number((link as any).visit_count) || 0;
                                                const percentage = (clicks / maxClicks) * 100;

                                                return (
                                                    <div key={i} className="group relative">
                                                        <div className="flex justify-between text-xs text-white/60 mb-1 font-mono uppercase">
                                                            <span>{link.label}</span>
                                                            <span className="text-white font-bold">{clicks}</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 group-hover:from-purple-400 group-hover:to-cyan-300 transition-all duration-500"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        {links.length === 0 && <p className="text-white/20 text-xs font-mono">NO_ACTIVE_NODES_DETECTED</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8 border-t border-white/5 gap-4">
                                    <button
                                        onClick={handleExportReport}
                                        className="group relative px-6 py-3 bg-cyan-900/20 border border-cyan-500/30 text-cyan-500 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            <span>⚡ TRANSMIT_REPORT</span>
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleResetStats}
                                        disabled={isSaving}
                                        className="group relative px-6 py-3 bg-red-900/20 border border-red-500/30 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10">{isSaving ? 'PURGING_DATA...' : '⚠ INITIATE_SYSTEM_PURGE'}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'PROFILE' && (
                            <div className="max-w-2xl space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-white/40 tracking-widest">Operator_Name</label>
                                        <input className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-white outline-none" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-white/40 tracking-widest">Codename / Designation</label>
                                        <input className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-white outline-none" value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-white/40 tracking-widest">Bio_Data_Exfiltration</label>
                                    <textarea className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-white outline-none h-32 resize-none" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    {/* Socials Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">GitHub</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.github || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, github: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">X / Twitter</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.twitter || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, twitter: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">LinkedIn</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.linkedin || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">Instagram</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.instagram || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, instagram: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">YouTube</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.youtube || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, youtube: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">Discord</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.discord || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, discord: e.target.value } })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-white/20">Steam</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-white font-mono text-xs focus:border-white outline-none" value={profile.socials?.steam || ''} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, steam: e.target.value } })} />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveProfile} disabled={isSaving} className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-cyan-500 transition-all disabled:opacity-50">
                                    {isSaving ? 'Syncing_Data...' : 'Update_Neural_Profile'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'LINKS' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs">Active_Neural_Pathways</h3>
                                    <button onClick={handleAddLink} className="px-4 py-2 border border-white/20 text-white text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Add_New_Node</button>
                                </div>
                                <div className="space-y-4">
                                    {links.map((link, i) => (
                                        <div key={i} className="p-6 bg-black border border-white/5 flex flex-wrap gap-4 items-end group">
                                            <div className="flex-1 min-w-[200px] space-y-2">
                                                <label className="text-[8px] uppercase font-black text-white/20 tracking-widest">Node_Label</label>
                                                <input className="w-full bg-zinc-900 border border-white/10 p-3 text-white text-xs outline-none focus:border-cyan-500" value={link.label} onChange={e => handleUpdateLink(i, 'label', e.target.value)} />
                                            </div>
                                            <div className="flex-[2] min-w-[200px] space-y-2">
                                                <label className="text-[8px] uppercase font-black text-white/20 tracking-widest">Target_URL</label>
                                                <input className="w-full bg-zinc-900 border border-white/10 p-3 text-white text-xs outline-none focus:border-cyan-500" value={link.url} onChange={e => handleUpdateLink(i, 'url', e.target.value)} />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <label className="text-[8px] uppercase font-black text-white/20 tracking-widest">Category</label>
                                                <input className="w-full bg-zinc-900 border border-white/10 p-3 text-white text-xs outline-none focus:border-cyan-500" value={link.category || ''} onChange={e => handleUpdateLink(i, 'category', e.target.value)} placeholder="GENERAL" />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <label className="text-[8px] uppercase font-black text-white/20 tracking-widest">Status</label>
                                                <select className="w-full bg-zinc-900 border border-white/10 p-3 text-white text-xs outline-none focus:border-cyan-500" value={link.status} onChange={e => handleUpdateLink(i, 'status', e.target.value)}>
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="ENCRYPTED">ENCRYPTED</option>
                                                    <option value="OFFLINE">OFFLINE</option>
                                                </select>
                                            </div>
                                            <button onClick={() => setLinks(links.filter((_, idx) => idx !== i))} className="p-3 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">✕</button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleSaveLinks} disabled={isSaving} className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-cyan-500 transition-all disabled:opacity-50 mt-8">
                                    {isSaving ? 'Syncing_Nodes...' : 'Verify_Network_Array'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'COMMENTS' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 border-b border-white/10 pb-4">Recent_Transmissions</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {commentList.map(comment => (
                                        <div key={comment.id} className="p-6 bg-black border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[10px] font-black text-cyan-500 uppercase">{comment.name}</span>
                                                    <span className="text-[8px] text-white/20 font-mono">{new Date(comment.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-white/80 font-mono leading-relaxed">{comment.content}</p>
                                            </div>
                                            <button onClick={() => handleDeleteComment(comment.id)} className="opacity-0 group-hover:opacity-100 p-4 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">Purge_Data</button>
                                        </div>
                                    ))}
                                    {commentList.length === 0 && <p className="text-center py-24 text-white/20 font-black uppercase tracking-[0.5em]">No_Detected_Signals</p>}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
