import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
    setProfile: (p: UserProfile) => void;
    refreshData: () => void;
    initialTab?: 'ANALYTICS' | 'PROFILE' | 'LINKS' | 'COMMENTS';
}

// Brand SVG Icons for social links
const SocialIcon = ({ type, className = "w-4 h-4" }: { type: string; className?: string }) => {
    switch (type.toLowerCase()) {
        case 'github':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                </svg>
            );
        case 'twitter':
        case 'x':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
        case 'linkedin':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
            );
        case 'instagram':
            return (
                <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            );
        case 'youtube':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
        case 'discord':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
            );
        case 'steam':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12c5.96 0 10.9-4.36 11.84-10.05L16.2 10.2c-.41.34-.94.55-1.52.55-.58 0-1.11-.21-1.52-.55l-3.21 2.3c.03.17.05.33.05.5 0 1.38-1.12 2.5-2.5 2.5S5 14.38 5 13s1.12-2.5 2.5-2.5c.17 0 .33.02.5.05l2.3-3.21C9.96 6.93 9.75 6.4 9.75 5.82c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 .58-.21 1.11-.55 1.52l3.75 5.16C18.66 7.42 15.6 4.3 12 4.3c-4.24 0-7.7 3.46-7.7 7.7s3.46 7.7 7.7 7.7 7.7-3.46 7.7-7.7c0-.52-.06-1.03-.17-1.52l-5.69-3.93z" />
                </svg>
            );
        default:
            return (
                <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            );
    }
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, profile, setProfile, refreshData, initialTab }) => {
    const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PROFILE' | 'LINKS' | 'COMMENTS'>('ANALYTICS');
    const [stats, setStats] = useState({ visits: 0, reactions: 0, comments: 0, totalClicks: 0 });
    const [links, setLinks] = useState(profile.links);
    const [isSaving, setIsSaving] = useState(false);
    const [commentList, setCommentList] = useState<any[]>([]);
    const [deletedLinkIds, setDeletedLinkIds] = useState<number[]>([]);

    // SEO Data State
    const [referrers, setReferrers] = useState<Array<{ src: string; count: number; pc: string }>>([]);
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [browsers, setBrowsers] = useState<Array<{ name: string; count: number; pc: string }>>([]);
    const [resolutions, setResolutions] = useState<Array<{ type: string; count: number; pc: string }>>([]);

    // Live Traffic State
    const [trafficHistory, setTrafficHistory] = useState<Array<{ in: number; out: number }>>(() => {
        return Array(13).fill(0).map(() => ({
            in: Math.floor(Math.random() * 60) + 10,
            out: Math.floor(Math.random() * 40) + 5
        }));
    });
    const lastTrafficStats = React.useRef({ visits: 0, clicks: 0, reactions: 0, comments: 0, initialized: false });
    const [localProfile, setLocalProfile] = useState<UserProfile>(() => ({ ...profile }));
    
    // Hovered index for traffic tooltip
    const [hoveredTrafficIndex, setHoveredTrafficIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchStats();
            fetchComments();
            setLinks(profile.links);
            setLocalProfile({ ...profile });
            setDeletedLinkIds([]);
            if (initialTab) {
                setActiveTab(initialTab);
            }
        }
    }, [isOpen, profile, initialTab]);

    // Real-Time Traffic Poller
    useEffect(() => {
        if (!isOpen) return;

        const pollTraffic = async () => {
            const { data: vData } = await supabase.from('analytics').select('count').eq('key', 'total_visits').maybeSingle();
            const { count: cCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
            const { count: rCount } = await supabase.from('reactions').select('*', { count: 'exact', head: true });
            const { data: lData } = await supabase.from('links').select('visit_count');

            const currentVisits = vData?.count || 0;
            const currentComments = cCount || 0;
            const currentReactions = rCount || 0;
            const currentClicks = lData?.reduce((acc, curr) => acc + (Number(curr.visit_count) || 0), 0) || 0;

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

            const deltaVisits = Math.max(0, currentVisits - lastTrafficStats.current.visits);
            const deltaComments = Math.max(0, currentComments - lastTrafficStats.current.comments);
            const deltaClicks = Math.max(0, currentClicks - lastTrafficStats.current.clicks);
            const deltaReactions = Math.max(0, currentReactions - lastTrafficStats.current.reactions);

            const inbound = (deltaVisits + deltaComments) * 20;
            const outbound = (deltaClicks + deltaReactions) * 20;

            setTrafficHistory(prev => {
                return [...prev.slice(1), { in: Math.min(100, inbound), out: Math.min(100, outbound) }];
            });

            lastTrafficStats.current = {
                visits: currentVisits,
                clicks: currentClicks,
                reactions: currentReactions,
                comments: currentComments,
                initialized: true
            };

            setStats({
                visits: currentVisits,
                reactions: currentReactions,
                comments: currentComments,
                totalClicks: currentClicks
            });
        };

        const interval = setInterval(pollTraffic, 3000);
        return () => clearInterval(interval);
    }, [isOpen]);

    const fetchStats = async () => {
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
        if (!confirm('WARNING: SECURE SIGNAL PURGING...\n\nAre you sure you want to delete this transmission permanently?')) return;
        const { error } = await supabase.from('comments').delete().eq('id', id);
        if (!error) fetchComments();
    };

    const handleExportReport = () => {
        const date = new Date().toLocaleDateString();
        const topLink = [...links].sort((a, b) => (Number((b as any).visit_count) || 0) - (Number((a as any).visit_count) || 0))[0];

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

        window.location.href = `mailto:?subject=Daily Site Report - ${date}&body=${encodeURIComponent(report)}`;
        navigator.clipboard.writeText(report);
        alert('REPORT ENCRYPTED AND COPIED TO CLIPBOARD.\n\nOpening mail client fallback...');
    };

    const handleResetStats = async () => {
        if (!confirm('WARNING: FORMATTING NEURAL DRIVE...\n\nThis will permanently delete ALL analytics, reactions, and reset link clicks to zero.\n\nAre you sure you want to proceed with this irreversible action?')) return;

        setIsSaving(true);
        try {
            await supabase.from('analytics').delete().not('key', 'is', null);
            await supabase.from('reactions').delete().not('id', 'is', null);
            const { data: allLinks } = await supabase.from('links').select('id');
            if (allLinks) {
                await Promise.all(allLinks.map(l => supabase.from('links').update({ visit_count: 0 }).eq('id', l.id)));
            }

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
                { key: 'name', value: localProfile.name },
                { key: 'title', value: localProfile.title },
                { key: 'bio_text', value: localProfile.bio },
                { key: 'avatar_url', value: localProfile.avatarUrl },
                { key: 'social_github', value: localProfile.socials?.github || '' },
                { key: 'social_twitter', value: localProfile.socials?.twitter || '' },
                { key: 'social_linkedin', value: localProfile.socials?.linkedin || '' },
                { key: 'social_instagram', value: localProfile.socials?.instagram || '' },
                { key: 'social_youtube', value: localProfile.socials?.youtube || '' },
                { key: 'social_discord', value: localProfile.socials?.discord || '' },
                { key: 'social_links', value: JSON.stringify(localProfile.socials || {}) },
                { key: 'activity_playing', value: localProfile.activity_playing || '' },
            ];

            const { error } = await supabase.from('profile_config').upsert(updates, { onConflict: 'key' });
            if (error) throw error;
            setProfile(localProfile);
            refreshData();
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddLink = () => {
        const newLink = { label: 'New Link', url: 'https://', category: 'GENERAL', status: 'ACTIVE', visit_count: 0 };
        setLinks([...links, newLink]);
    };

    const handleUpdateLink = (index: number, field: string, value: string) => {
        const newLinks = [...links];
        (newLinks[index] as any)[field] = value;
        setLinks(newLinks);
    };

    const handleDeleteLink = (index: number) => {
        const linkToDelete = links[index];
        if (linkToDelete && linkToDelete.id) {
            setDeletedLinkIds(prev => [...prev, linkToDelete.id]);
        }
        setLinks(links.filter((_, idx) => idx !== index));
    };

    // Swap content items in array but keep database IDs to prevent breaking links/data mapping
    const handleMoveLink = (index: number, direction: 'UP' | 'DOWN') => {
        if (direction === 'UP' && index === 0) return;
        if (direction === 'DOWN' && index === links.length - 1) return;

        const newIndex = direction === 'UP' ? index - 1 : index + 1;
        const updatedLinks = [...links];

        const currentItem = updatedLinks[index];
        const swapItem = updatedLinks[newIndex];

        // Keep database primary IDs anchored to their position indexes
        const tempId = currentItem.id;
        currentItem.id = swapItem.id;
        swapItem.id = tempId;

        // Perform standard swap in array
        updatedLinks[index] = swapItem;
        updatedLinks[newIndex] = currentItem;

        setLinks(updatedLinks);
    };

    const handleSaveLinks = async () => {
        setIsSaving(true);
        try {
            if (deletedLinkIds.length > 0) {
                const { error: delError } = await supabase.from('links').delete().in('id', deletedLinkIds);
                if (delError) throw delError;
                setDeletedLinkIds([]);
            }

            const toUpdate = links.filter(l => l.id).map(l => ({
                id: l.id,
                title: l.label,
                url: l.url,
                category: l.category || 'GENERAL',
                status: l.status || 'ACTIVE',
                visit_count: l.visit_count || 0
            }));

            const toInsert = links.filter(l => !l.id).map(l => ({
                title: l.label,
                url: l.url,
                category: l.category || 'GENERAL',
                status: l.status || 'ACTIVE',
                visit_count: 0
            }));

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
            alert('Failed to sync links.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-8 xl:p-12 overflow-hidden font-mono text-white">
            {/* Holographic scanning grids on backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

            <div className="w-full max-w-7xl h-full bg-zinc-950/80 border border-cyan-500/20 flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.1)] rounded-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Visual Corner Highlights */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 pointer-events-none" />

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-cyan-500/10 bg-cyan-950/10 backdrop-blur-md gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/30 rounded-sm relative group overflow-hidden">
                            <span className="text-black font-black text-xl z-10 group-hover:scale-110 transition-transform">X</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-white font-black uppercase tracking-[0.2em] text-lg font-sans">Central_Intelligence_Command</h1>
                                <span className="text-[9px] px-2 py-0.5 border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 animate-pulse uppercase tracking-widest font-mono">STATUS: ONLINE</span>
                            </div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 font-mono">SYS_AUTH_LEVEL: O5-X // SPECTRUM ENGINE V.2.1</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="self-end md:self-auto px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white active:scale-[0.93] transition-all duration-150 text-xs font-bold uppercase tracking-widest bg-red-950/20"
                    >
                        [ Terminate_Session ]
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-cyan-500/10 bg-zinc-950/50 p-4 md:p-6 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar shrink-0 gap-2 md:gap-0">
                        {[
                            { id: 'ANALYTICS', icon: '📊', label: 'ANALYTICS', desc: 'Core Data Engine' },
                            { id: 'PROFILE', icon: '👤', label: 'IDENTIFY', desc: 'Operator Registry' },
                            { id: 'LINKS', icon: '🔗', label: 'NEURAL_LINKS', desc: 'Pathway Routing' },
                            { id: 'COMMENTS', icon: '💬', label: 'TRANSMISSIONS', desc: 'Encrypted Logs' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full p-3 md:p-4 flex flex-col items-start border active:scale-[0.98] transition-all duration-200 shrink-0 md:shrink ${
                                    activeTab === tab.id 
                                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                                        : 'bg-transparent border-white/5 text-white/50 hover:border-cyan-500/30 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{tab.icon}</span>
                                    <span className="text-[10px] uppercase font-black tracking-[0.15em]">{tab.label}</span>
                                </div>
                                <span className="hidden md:inline text-[8px] text-white/30 uppercase mt-1 tracking-wider">{tab.desc}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 md:p-8 xl:p-12 overflow-y-auto no-scrollbar bg-black/40">

                        {activeTab === 'ANALYTICS' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Stats Cards Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        {
                                            label: 'Total_Intrusion_Visits',
                                            value: stats.visits,
                                            sub: '+12% from last cycle',
                                            color: 'cyan',
                                            glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-500/20 hover:border-cyan-400',
                                            chart: (
                                                <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                    <path d="M0 40 L0 30 L10 25 L20 35 L30 20 L40 30 L50 15 L60 25 L70 10 L80 20 L90 5 L100 15 L100 40 Z" fill="currentColor" className="text-cyan-500" />
                                                    <path d="M0 30 L10 25 L20 35 L30 20 L40 30 L50 15 L60 25 L70 10 L80 20 L90 5 L100 15" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400" />
                                                </svg>
                                            )
                                        },
                                        {
                                            label: 'Neural_Node_Clicks',
                                            value: stats.totalClicks,
                                            sub: 'Direct pathway query',
                                            color: 'yellow',
                                            glow: 'shadow-[0_0_20px_rgba(234,179,8,0.12)] border-yellow-500/20 hover:border-yellow-400',
                                            chart: (
                                                <div className="absolute bottom-0 right-0 w-2/3 h-14 flex items-end gap-[3px] px-4 opacity-30 pointer-events-none">
                                                    {[40, 70, 30, 80, 50, 95, 60, 40, 75, 90].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-yellow-500 rounded-t-sm" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            )
                                        },
                                        {
                                            label: 'Social_Impact_Reactions',
                                            value: stats.reactions,
                                            sub: 'Synaptic feed responses',
                                            color: 'purple',
                                            glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)] border-purple-500/20 hover:border-purple-400',
                                            chart: (
                                                <div className="absolute top-4 right-4 w-12 h-12 pointer-events-none">
                                                    <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full" />
                                                    <div className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                                    <div className="absolute inset-[30%] bg-purple-500 rounded-full animate-pulse" />
                                                </div>
                                            )
                                        },
                                        {
                                            label: 'Encrypted_Comments',
                                            value: stats.comments,
                                            sub: 'External data packet uploads',
                                            color: 'green',
                                            glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)] border-green-500/20 hover:border-green-400',
                                            chart: (
                                                <div className="absolute bottom-3 right-4 text-[7px] font-mono text-green-500/40 flex flex-col items-end leading-none pointer-events-none">
                                                    {['01101001', '10101100', '00101011', '11001010'].map((line, i) => (
                                                        <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>{line}</span>
                                                    ))}
                                                </div>
                                            )
                                        },
                                    ].map(stat => (
                                        <div key={stat.label} className={`bg-zinc-950/60 backdrop-blur-md border p-6 relative group overflow-hidden h-40 flex flex-col justify-between transition-all duration-300 ${stat.glow}`}>
                                            {/* Corner brackets */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-cyan-400 transition-colors" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-cyan-400 transition-colors" />

                                            {/* Grid background on card */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none" />

                                            {/* Scanline hover animation */}
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />

                                            <div className="relative z-10">
                                                <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1 group-hover:text-white/60 transition-colors">{stat.label}</p>
                                                <p className="text-4xl text-white font-sans font-black tracking-tighter group-hover:scale-[1.03] transition-transform origin-left">{stat.value.toLocaleString()}</p>
                                            </div>

                                            <div className="relative z-10 w-full flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full animate-ping ${stat.color === 'cyan' ? 'bg-cyan-500' : stat.color === 'yellow' ? 'bg-yellow-500' : stat.color === 'purple' ? 'bg-purple-500' : 'bg-green-500'}`} />
                                                <p className="text-[8px] text-white/60 uppercase tracking-widest font-mono bg-black/35 px-1 py-0.5 border border-white/5">{stat.sub}</p>
                                            </div>

                                            {stat.chart}
                                        </div>
                                    ))}
                                </div>

                                {/* Live Traffic Segment */}
                                <div className="bg-zinc-950/60 border border-cyan-500/10 p-6 md:p-8 relative overflow-hidden shadow-lg">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                                    
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 border-b border-cyan-500/10 pb-4 flex flex-col sm:flex-row justify-between gap-4 relative z-10">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                                            Active_Node_Traffic (Real-Time Synchronizer)
                                        </span>
                                        <div className="flex items-center gap-4 text-[9px] text-white/40 tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 bg-cyan-500/20 border border-cyan-500 rounded-sm" />
                                                <span>INBOUND (VISITS)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 bg-purple-500/20 border border-purple-500 rounded-sm" />
                                                <span>OUTBOUND (CLICKS)</span>
                                            </div>
                                            <span className="text-cyan-400 font-bold border border-cyan-500/30 px-1 bg-cyan-500/10 animate-pulse">LIVE FEED</span>
                                        </div>
                                    </h3>

                                    <div className="h-64 flex items-end justify-between gap-2 px-2 relative z-10">
                                        {/* Background Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-full h-px bg-cyan-500/30 border-t border-dashed" />
                                            ))}
                                        </div>

                                        {trafficHistory.map((data, i) => (
                                            <div 
                                                key={i} 
                                                className="flex-1 h-full flex items-end justify-center gap-[3px] relative group cursor-pointer"
                                                onMouseEnter={() => setHoveredTrafficIndex(i)}
                                                onMouseLeave={() => setHoveredTrafficIndex(null)}
                                            >
                                                {/* Floating Tooltip */}
                                                {hoveredTrafficIndex === i && (
                                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-zinc-950 border border-cyan-500/40 p-2 opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-sm">
                                                        <div className="text-[7px] font-black text-cyan-400 uppercase tracking-widest mb-0.5">TIMEFRAME T-{36 - i * 3}s</div>
                                                        <div className="text-[9px] font-mono"><span className="text-cyan-400">INBOUND: {Math.round(data.in / 20)}</span> <span className="text-white/20">|</span> <span className="text-purple-400">OUTBOUND: {Math.round(data.out / 20)}</span></div>
                                                    </div>
                                                )}

                                                {/* Inbound Column (Visits) */}
                                                <div className="w-1/2 bg-cyan-950/20 h-full relative overflow-hidden border border-cyan-500/10 hover:border-cyan-500/40 rounded-t-[1px]">
                                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-125 transition-all duration-300 rounded-t-[1px]" style={{ height: `${data.in}%` }}>
                                                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[size:100%_4px]" />
                                                    </div>
                                                </div>

                                                {/* Outbound Column (Clicks) */}
                                                <div className="w-1/2 bg-purple-950/20 h-full relative overflow-hidden border border-purple-500/10 hover:border-purple-500/40 rounded-t-[1px]">
                                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 group-hover:brightness-125 transition-all duration-300 rounded-t-[1px]" style={{ height: `${data.out}%` }}>
                                                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[size:100%_4px]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 text-[8px] text-white/30 font-mono uppercase relative z-10 border-t border-cyan-500/10 pt-2">
                                        <span>T-36s</span>
                                        <span>T-24s</span>
                                        <span>T-12s</span>
                                        <span className="text-cyan-400 animate-pulse">SYNCHRONIZED_NOW</span>
                                    </div>
                                </div>

                                {/* SEO Metadata Progress Bars */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Referrers */}
                                    <div className="bg-zinc-950/60 border border-cyan-500/10 p-6 space-y-4 shadow-lg">
                                        <h4 className="text-[10px] text-cyan-400 uppercase font-black tracking-widest border-b border-cyan-500/10 pb-2 flex items-center justify-between">
                                            <span>Top Referrers</span>
                                            <span className="text-[8px] text-white/30">EXTERNAL SIGNALS</span>
                                        </h4>
                                        <div className="space-y-3">
                                            {referrers.map((item, i) => (
                                                <div key={i} className="space-y-1 group">
                                                    <div className="flex justify-between text-xs font-mono">
                                                        <span className="text-white/60 group-hover:text-cyan-300 transition-colors truncate w-40" title={item.src}>{item.src}</span>
                                                        <span className="text-white font-bold">{item.count}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/5 border border-white/5 rounded-sm overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 group-hover:brightness-110 transition-all duration-500" 
                                                            style={{ width: item.pc }} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {referrers.length === 0 && <p className="text-[10px] text-white/20 font-mono italic">No Traffic Signals Captured</p>}
                                        </div>
                                    </div>

                                    {/* Client Hardware Platform & Browser */}
                                    <div className="bg-zinc-950/60 border border-cyan-500/10 p-6 space-y-4 shadow-lg">
                                        <h4 className="text-[10px] text-cyan-400 uppercase font-black tracking-widest border-b border-cyan-500/10 pb-2 flex items-center justify-between">
                                            <span>Hardware & Browsers</span>
                                            <span className="text-[8px] text-white/30">USER AGENT SYSTEM</span>
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {platforms.map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-cyan-950/20 border border-cyan-500/20 text-[9px] text-cyan-300 font-mono tracking-widest uppercase hover:bg-cyan-500/10 cursor-crosshair">
                                                        ⚡ {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="space-y-2 border-t border-cyan-500/10 pt-4">
                                                {browsers.map((b, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-mono">
                                                            <span className="text-white/60">{b.name}</span>
                                                            <span className="text-cyan-400">{b.pc} ({b.count})</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-white/5 rounded-sm overflow-hidden">
                                                            <div className="h-full bg-cyan-500" style={{ width: b.pc }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resolutions */}
                                    <div className="bg-zinc-950/60 border border-cyan-500/10 p-6 space-y-4 shadow-lg">
                                        <h4 className="text-[10px] text-cyan-400 uppercase font-black tracking-widest border-b border-cyan-500/10 pb-2 flex items-center justify-between">
                                            <span>Screen Resolutions</span>
                                            <span className="text-[8px] text-white/30">DISPLAY DOMAINS</span>
                                        </h4>
                                        <div className="space-y-3">
                                            {resolutions.map((r, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-mono">
                                                        <span className="text-white/60">{r.type}</span>
                                                        <span className="text-purple-400">{r.pc} ({r.count} SESS)</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/5 border border-white/5 rounded-sm overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400" 
                                                            style={{ width: r.pc }} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {resolutions.length === 0 && <p className="text-[10px] text-white/20 font-mono italic">Calibrating Display Spectrum...</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Link Leaderboard */}
                                <div className="bg-zinc-950/60 border border-cyan-500/10 p-6 shadow-lg space-y-6">
                                    <h4 className="text-[10px] text-cyan-400 uppercase font-black tracking-widest border-b border-cyan-500/10 pb-3 flex justify-between">
                                        <span>Highest Performance Pathways (Leaderboard)</span>
                                        <span className="text-cyan-400 animate-pulse font-bold">SYSTEM_OPTIMIZED</span>
                                    </h4>
                                    <div className="space-y-4">
                                        {(() => {
                                            const sortedLinks = [...links].sort((a, b) => (Number((b as any).visit_count) || 0) - (Number((a as any).visit_count) || 0));
                                            const maxClicks = Math.max(1, Number((sortedLinks[0] as any)?.visit_count) || 0);

                                            return sortedLinks.slice(0, 5).map((link, i) => {
                                                const clicks = Number((link as any).visit_count) || 0;
                                                const percentage = (clicks / maxClicks) * 100;
                                                const medal = i === 0 ? '👑 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : '🔹 ';

                                                return (
                                                    <div key={i} className="group space-y-1.5">
                                                        <div className="flex justify-between text-xs text-white/70 font-mono uppercase group-hover:text-cyan-300 transition-colors">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-cyan-500 font-bold">#{i + 1}</span>
                                                                <span>{medal}{link.label}</span>
                                                                <span className="text-[9px] text-white/30 truncate max-w-xs lowercase">({link.url})</span>
                                                            </div>
                                                            <span className="text-white font-black">{clicks} <span className="text-[9px] text-white/40">clicks</span></span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 border border-white/5 rounded-sm overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-purple-500 group-hover:brightness-110 transition-all duration-700"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                        {links.length === 0 && <p className="text-white/20 text-xs font-mono italic">NO ACTIVE ROUTING PATHWAYS FOUND</p>}
                                    </div>
                                </div>

                                {/* Analytics Control Actions */}
                                <div className="flex flex-wrap justify-end pt-8 border-t border-cyan-500/10 gap-4">
                                    <button
                                        onClick={handleExportReport}
                                        className="group relative px-6 py-3 bg-cyan-950/20 border border-cyan-500/40 text-cyan-400 font-black text-[10px] uppercase tracking-wider hover:bg-cyan-500 hover:text-black active:scale-[0.97] transition-all overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <span>⚡ TRANSMIT_DECRYPTED_REPORT</span>
                                        </span>
                                        <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>

                                    <button
                                        onClick={handleResetStats}
                                        disabled={isSaving}
                                        className="group relative px-6 py-3 bg-red-950/20 border border-red-500/40 text-red-400 font-black text-[10px] uppercase tracking-wider hover:bg-red-500 hover:text-white active:scale-[0.97] transition-all overflow-hidden"
                                    >
                                        <span className="relative z-10">{isSaving ? 'PURGING_CORE_DRIVES...' : '⚠ INITIATE_SYSTEM_PURGE'}</span>
                                        <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'PROFILE' && (
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-right duration-300">
                                {/* Left Form Column */}
                                <div className="xl:col-span-7 space-y-6 bg-zinc-950/40 border border-cyan-500/10 p-6 sm:p-8 shadow-lg">
                                    <h3 className="text-cyan-400 font-black uppercase tracking-widest text-xs border-b border-cyan-500/10 pb-3 mb-6">
                                        Identity Registration
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Operator Name</label>
                                            <input 
                                                className="w-full bg-black/60 border border-cyan-500/20 p-3.5 text-white font-mono text-sm focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] outline-none transition-all duration-200" 
                                                value={localProfile.name} 
                                                onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Codename / Designation</label>
                                            <input 
                                                className="w-full bg-black/60 border border-cyan-500/20 p-3.5 text-white font-mono text-sm focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] outline-none transition-all duration-200" 
                                                value={localProfile.title} 
                                                onChange={e => setLocalProfile({ ...localProfile, title: e.target.value })} 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Bio Data Exfiltration</label>
                                        <textarea 
                                            className="w-full bg-black/60 border border-cyan-500/20 p-3.5 text-white font-mono text-sm focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] outline-none h-28 resize-none transition-all duration-200" 
                                            value={localProfile.bio} 
                                            onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })} 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Avatar Resource URL</label>
                                        <input 
                                            className="w-full bg-black/60 border border-cyan-500/20 p-3.5 text-white font-mono text-xs focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] outline-none transition-all duration-200" 
                                            value={localProfile.avatarUrl} 
                                            onChange={e => setLocalProfile({ ...localProfile, avatarUrl: e.target.value })} 
                                        />
                                    </div>

                                    <div className="border-t border-cyan-500/10 pt-6 mt-6 space-y-4">
                                        <h4 className="text-[10px] text-cyan-400 uppercase font-black tracking-widest flex items-center justify-between">
                                            <span>Social Network Anchors</span>
                                            <span className="text-[8px] text-white/30">EXTERNAL NODES</span>
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {['github', 'twitter', 'linkedin', 'instagram', 'youtube', 'discord', 'steam'].map(social => (
                                                <div key={social} className="space-y-1">
                                                    <label className="text-[8px] uppercase font-black text-white/35 flex items-center gap-1.5">
                                                        <SocialIcon type={social} className="w-3.5 h-3.5 text-cyan-500/70" />
                                                        <span>{social}</span>
                                                    </label>
                                                    <input
                                                        className="w-full bg-black/60 border border-cyan-500/20 p-3 text-white font-mono text-xs focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] outline-none transition-all duration-200"
                                                        placeholder={`https://${social}.com/...`}
                                                        value={localProfile.socials?.[social as keyof UserProfile['socials']] || ''}
                                                        onChange={e => setLocalProfile({
                                                            ...localProfile,
                                                            socials: {
                                                                ...localProfile.socials,
                                                                [social]: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleSaveProfile} 
                                        disabled={isSaving} 
                                        className="group relative w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-cyan-500 active:scale-[0.98] transition-all disabled:opacity-50 mt-8 shadow-lg overflow-hidden text-xs"
                                    >
                                        <span className="relative z-10">{isSaving ? 'Syncing_Drives...' : 'Verify & Write Neural Profile'}</span>
                                        <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>
                                </div>

                                {/* Right Live Preview Hologram Column */}
                                <div className="xl:col-span-5 sticky top-0 space-y-6">
                                    <div className="border border-cyan-500/30 bg-cyan-950/10 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden group">
                                        {/* Visual Corner decorations */}
                                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400" />

                                        {/* Grid overlay */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                                        <div className="text-[8px] text-cyan-400/60 uppercase tracking-[0.2em] border-b border-cyan-500/20 pb-2 mb-6 flex justify-between items-center">
                                            <span>[ Preview // Neural Hologram ]</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                        </div>

                                        <div className="flex flex-col items-center text-center space-y-6 relative z-10 py-6">
                                            {/* Avatar Target Scanner container */}
                                            <div className="relative w-28 h-28 flex items-center justify-center">
                                                {/* Tech HUD ring elements */}
                                                <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
                                                <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                                                <div className="absolute inset-0.5 border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin" />
                                                
                                                <div className="w-24 h-24 rounded-full overflow-hidden border border-cyan-500/40 relative bg-zinc-950">
                                                    {localProfile.avatarUrl ? (
                                                        <img 
                                                            src={localProfile.avatarUrl} 
                                                            alt="Preview Profile Avatar" 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : null}
                                                    {/* Sweep line laser */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/35 to-transparent h-[200%] w-full animate-[scan_3s_linear_infinite] pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-2 max-w-sm">
                                                <h4 className="text-lg font-black tracking-widest text-cyan-400 uppercase">{localProfile.name || 'Anonymous Operator'}</h4>
                                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest border border-white/5 inline-block px-2 py-0.5 bg-white/5">{localProfile.title || 'UNREGISTERED AGENT'}</p>
                                                <p className="text-xs text-white/80 font-mono leading-relaxed italic max-h-24 overflow-y-auto no-scrollbar">{localProfile.bio ? `"${localProfile.bio}"` : 'No cerebral bio-metrics synchronized yet.'}</p>
                                            </div>

                                            {/* Preview Social badging */}
                                            <div className="flex flex-wrap justify-center gap-3 border-t border-cyan-500/20 pt-6 w-full">
                                                {Object.entries(localProfile.socials || {}).map(([key, val]) => {
                                                    if (!val) return null;
                                                    return (
                                                        <a 
                                                            key={key} 
                                                            href={val} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="w-8 h-8 rounded-sm bg-black/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-500 hover:bg-cyan-500/20 transition-all shadow-md"
                                                            title={`Anchor to ${key}`}
                                                        >
                                                            <SocialIcon type={key} className="w-4 h-4" />
                                                        </a>
                                                    );
                                                })}
                                                {(!localProfile.socials || Object.values(localProfile.socials).filter(Boolean).length === 0) && (
                                                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">No Active Anchors Linked</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'LINKS' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-500/10 pb-4 gap-4">
                                    <div>
                                        <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                                            Active Neural Pathways
                                        </h3>
                                        <p className="text-[8px] text-white/40 uppercase mt-0.5 font-mono">Route external assets through the global profile mesh</p>
                                    </div>
                                    <button 
                                        onClick={handleAddLink} 
                                        className="px-5 py-2.5 bg-cyan-950/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase hover:bg-cyan-500 hover:text-black active:scale-[0.95] transition-all"
                                    >
                                        [ + Add New Pathway ]
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {links.map((link, i) => {
                                        const clicks = link.visit_count || 0;
                                        const percentageOfTotal = stats.totalClicks > 0 ? Math.round((clicks / stats.totalClicks) * 100) : 0;

                                        return (
                                            <div 
                                                key={i} 
                                                className="p-6 bg-zinc-950/50 border border-cyan-500/10 flex flex-col gap-4 relative group animate-in fade-in slide-in-from-bottom-2 duration-300"
                                                style={{ animationDelay: `${i * 30}ms` }}
                                            >
                                                {/* Card Corner decoration */}
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-cyan-500/40 transition-colors" />

                                                {/* Header node metadata bar */}
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[8px] text-white/35 font-mono tracking-widest">
                                                    <span className="text-cyan-500 font-black">PATHWAY_NODE_#0{i + 1}</span>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        {/* Reorder actions */}
                                                        <div className="flex gap-1.5 border border-white/5 p-0.5 bg-black/40">
                                                            <button 
                                                                onClick={() => handleMoveLink(i, 'UP')} 
                                                                disabled={i === 0} 
                                                                className="px-2 py-0.5 text-white/60 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-white/60 transition-colors text-[9px] font-bold"
                                                                title="Move Pathway Up"
                                                            >
                                                                ↑
                                                            </button>
                                                            <button 
                                                                onClick={() => handleMoveLink(i, 'DOWN')} 
                                                                disabled={i === links.length - 1} 
                                                                className="px-2 py-0.5 text-white/60 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-white/60 transition-colors text-[9px] font-bold"
                                                                title="Move Pathway Down"
                                                            >
                                                                ↓
                                                            </button>
                                                        </div>

                                                        {/* Delete button */}
                                                        <button 
                                                            onClick={() => handleDeleteLink(i)} 
                                                            className="px-2 py-0.5 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10 font-bold"
                                                            title="Sever Pathway Node"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Main fields row */}
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                    <div className="md:col-span-3 space-y-1.5">
                                                        <label className="text-[8px] uppercase font-black text-white/30 tracking-widest">Label / Gateway Title</label>
                                                        <input 
                                                            className="w-full bg-black border border-cyan-500/20 p-2.5 text-white text-xs outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all duration-200" 
                                                            value={link.label} 
                                                            onChange={e => handleUpdateLink(i, 'label', e.target.value)} 
                                                        />
                                                    </div>
                                                    <div className="md:col-span-5 space-y-1.5">
                                                        <label className="text-[8px] uppercase font-black text-white/30 tracking-widest">Target URL Address</label>
                                                        <input 
                                                            className="w-full bg-black border border-cyan-500/20 p-2.5 text-white text-xs outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all duration-200" 
                                                            value={link.url} 
                                                            onChange={e => handleUpdateLink(i, 'url', e.target.value)} 
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-1.5">
                                                        <label className="text-[8px] uppercase font-black text-white/30 tracking-widest">Category</label>
                                                        <input 
                                                            className="w-full bg-black border border-cyan-500/20 p-2.5 text-white text-xs outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all duration-200" 
                                                            value={link.category || ''} 
                                                            onChange={e => handleUpdateLink(i, 'category', e.target.value)} 
                                                            placeholder="GENERAL" 
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-1.5">
                                                        <label className="text-[8px] uppercase font-black text-white/30 tracking-widest">Routing Integrity</label>
                                                        <select 
                                                            className="w-full bg-black border border-cyan-500/20 p-2.5 text-white text-xs outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all duration-200" 
                                                            value={link.status} 
                                                            onChange={e => handleUpdateLink(i, 'status', e.target.value)}
                                                        >
                                                            <option value="ACTIVE">ACTIVE</option>
                                                            <option value="ENCRYPTED">ENCRYPTED</option>
                                                            <option value="OFFLINE">OFFLINE</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Node visual stats status footer */}
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/5 pt-2 text-[9px] font-mono gap-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-white/40">NODE VALUE:</span>
                                                            <span className="text-white font-bold">{clicks} Clicks</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-white/40">SHARE:</span>
                                                            <span className="text-cyan-400 font-bold">{percentageOfTotal}%</span>
                                                        </div>
                                                    </div>

                                                    {/* Node status tags and clicks bar */}
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <div className="w-24 h-1 bg-white/5 border border-white/5 overflow-hidden rounded-sm hidden sm:block">
                                                            <div className="h-full bg-cyan-500" style={{ width: `${percentageOfTotal}%` }} />
                                                        </div>
                                                        
                                                        {link.status === 'ACTIVE' && (
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 border border-green-500/30 text-green-400 bg-green-500/10 text-[8px] tracking-widest font-black uppercase">
                                                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                                                ACTIVE_SIGNAL
                                                            </span>
                                                        )}
                                                        {link.status === 'ENCRYPTED' && (
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 border border-yellow-500/30 text-yellow-400 bg-yellow-500/10 text-[8px] tracking-widest font-black uppercase">
                                                                <span className="w-1 h-1 rounded-full bg-yellow-500" />
                                                                SHIELDED
                                                            </span>
                                                        )}
                                                        {link.status === 'OFFLINE' && (
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 border border-white/10 text-white/40 bg-white/5 text-[8px] tracking-widest font-black uppercase">
                                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                OFFLINE
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {links.length === 0 && (
                                        <div className="p-16 border border-dashed border-cyan-500/20 flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-xl">📭</span>
                                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">No Pathway Nodes Connected</p>
                                            <button onClick={handleAddLink} className="text-[10px] text-cyan-400 font-bold hover:underline">Add First Pathway Node</button>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleSaveLinks} 
                                    disabled={isSaving} 
                                    className="group relative px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-cyan-500 active:scale-[0.98] transition-all disabled:opacity-50 mt-8 shadow-lg overflow-hidden text-xs"
                                >
                                    <span className="relative z-10">{isSaving ? 'Syncing_Nodes...' : 'Verify Network Array'}</span>
                                    <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </div>
                        )}

                        {activeTab === 'COMMENTS' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
                                <div className="border-b border-cyan-500/10 pb-4">
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                                        Incoming Encrypted Transmissions
                                    </h3>
                                    <p className="text-[8px] text-white/40 uppercase mt-0.5 font-mono">External guest inputs parsed and recorded on system drives</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {commentList.map((comment, i) => (
                                        <div key={comment.id} className="p-6 bg-zinc-950/60 border border-cyan-500/10 flex justify-between items-center group relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500/50" />
                                            
                                            <div className="pl-3 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{comment.name}</span>
                                                    <span className="text-[8px] text-white/20 font-mono">{new Date(comment.created_at).toLocaleString()}</span>
                                                    <span className="text-[7px] border border-cyan-500/20 text-cyan-500/70 px-1 bg-cyan-500/5 uppercase font-mono">SIG-0{commentList.length - i}</span>
                                                </div>
                                                <p className="text-sm text-white/80 font-mono leading-relaxed">"{comment.content}"</p>
                                            </div>

                                            <button 
                                                onClick={() => handleDeleteComment(comment.id)} 
                                                className="opacity-0 group-hover:opacity-100 px-4 py-2 text-[10px] text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 uppercase font-black tracking-widest ml-4 bg-red-950/20 shrink-0"
                                            >
                                                Purge Signal
                                            </button>
                                        </div>
                                    ))}
                                    {commentList.length === 0 && (
                                        <div className="py-24 border border-dashed border-cyan-500/10 flex flex-col items-center justify-center text-center text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">
                                            <span>No_Detected_Signals_On_Frequency</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    50% { transform: translateY(2000%); }
                    100% { transform: translateY(-100%); }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
