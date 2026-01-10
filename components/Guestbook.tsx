
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ThemeType } from '../types';

interface Comment {
    id: number;
    name: string;
    content: string;
    created_at: string;
}

interface GuestbookProps {
    isInline?: boolean;
    theme?: ThemeType | string;
}

const Guestbook: React.FC<GuestbookProps> = ({ isInline = false, theme }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newName, setNewName] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchComments();

        const channel = supabase
            .channel('public:comments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
                setComments(prev => [payload.new as Comment, ...prev]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'comments' }, (payload) => {
                setComments(prev => prev.filter(c => c.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchComments = async () => {
        const { data } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setComments(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newContent) return;

        setIsSubmitting(true);
        const { error } = await supabase
            .from('comments')
            .insert({ name: newName, content: newContent });

        if (!error) {
            setNewContent('');
            setCurrentPage(1); // Back to first page to see new comment
        }
        setIsSubmitting(false);
    };

    // Theme-based Styles
    const isHorror = theme === ThemeType.BLOOD_STAIN || theme === ThemeType.HORROR;
    const isCelestial = theme === ThemeType.CELESTIAL_EMPIRE;

    let inputClasses = "w-full bg-black border border-white/10 p-3 text-xs text-white outline-none focus:border-cyan-500 font-mono";
    let buttonClasses = "px-6 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 disabled:opacity-50 transition-colors";
    let commentBorder = "border-white/10";
    let commentName = "text-cyan-500 font-black";
    let commentText = "text-white/80 font-mono";

    if (isHorror) {
        inputClasses = "w-full bg-zinc-950 border border-red-950/40 p-4 text-sm text-red-900 outline-none focus:border-red-600 font-['UnifrakturMaguntia'] italic placeholder:text-red-950";
        buttonClasses = "px-8 bg-red-950 text-red-100 text-xs font-black uppercase tracking-[0.3em] hover:bg-red-600 disabled:opacity-50 transition-all font-serif";
        commentBorder = "border-red-900/40";
        commentName = "text-red-600 font-['UnifrakturMaguntia']";
        commentText = "text-red-900/80 font-serif italic";
    } else if (isCelestial) {
        inputClasses = "w-full bg-[#0A1A10] border border-[#D4AF37]/30 p-3 text-xs text-[#D4AF37] outline-none focus:border-[#D4AF37] font-serif placeholder:text-[#D4AF37]/30 tracking-widest";
        buttonClasses = "px-6 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-[#0A1A10] disabled:opacity-50 transition-all font-serif";
        commentBorder = "border-[#D4AF37]/30";
        commentName = "text-[#D4AF37] font-['Cinzel'] font-bold";
        commentText = "text-[#a3bfa8] font-serif italic";
    }

    // Pagination Logic
    const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedComments = comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const GuestbookContent = (
        <div className={`flex flex-col h-full ${isInline ? '' : 'p-4'} overflow-hidden`}>
            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                <input
                    placeholder={isHorror ? "Sign the Covenant..." : "Identity / Name"}
                    className={inputClasses}
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                />
                <div className="flex gap-2">
                    <input
                        placeholder={isHorror ? "Whisper your last words..." : "Leave a transmission..."}
                        className={inputClasses + " flex-1"}
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                    />
                    <button
                        disabled={isSubmitting}
                        className={buttonClasses}
                    >
                        {isHorror ? "INVOKE" : "SEND"}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar mb-4">
                {paginatedComments.map(comment => (
                    <div key={comment.id} className={`border-l-2 ${commentBorder} pl-4 group transition-all hover:border-red-600`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${commentName}`}>{comment.name}</span>
                            <span className="text-[8px] text-white/30 font-mono">{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${commentText}`}>"{comment.content}"</p>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">
                        {isHorror ? "THE_SILENCE_IS_DEAFENING" : "No_Detected_Signals"}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="text-[10px] text-white/40 hover:text-white disabled:opacity-0 transition-all font-black uppercase tracking-widest"
                    >
                        [ PREV ]
                    </button>
                    <span className={`text-[10px] font-mono ${isHorror ? "text-red-900" : "text-cyan-500"} uppercase tracking-widest animate-pulse`}>
                        PAGE_{currentPage}_OF_{totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="text-[10px] text-white/40 hover:text-white disabled:opacity-0 transition-all font-black uppercase tracking-widest"
                    >
                        [ NEXT ]
                    </button>
                </div>
            )}
        </div>
    );



    if (isInline) return GuestbookContent;

    return (
        <div className={`fixed bottom-0 right-0 z-[100] w-full max-w-md transition-transform duration-500 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-40px)]'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest transition-colors
                    ${isCelestial
                        ? 'bg-[#0A1A10] border-t border-x border-[#D4AF37] text-[#D4AF37] hover:bg-[#1a0505]'
                        : 'bg-zinc-900 border-t border-x border-white/10 text-white hover:bg-zinc-800'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isCelestial ? 'bg-[#D4AF37]' : 'bg-cyan-500'}`} />
                    <span>
                        {isCelestial ? `Imperial Edicts [${comments.length}]` : `Guestbook_System [${comments.length}]`}
                    </span>
                </div>
                <span>
                    {isOpen
                        ? (isCelestial ? 'Seal Scroll' : 'Minimize')
                        : (isCelestial ? 'Unfurl' : 'Expand_Terminal')
                    }
                </span>
            </button>
            <div className={`h-[500px] border-x shadow-2xl ${isCelestial ? 'bg-[#0A1A10] border-[#D4AF37]' : 'bg-zinc-900 border-white/10'}`}>
                {/* Decorative Scroll Top for Celestial Theme */}
                {isCelestial && <div className="h-2 w-full bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50" />}

                {GuestbookContent}
            </div>
        </div>
    );
};

export default Guestbook;
