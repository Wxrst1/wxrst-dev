
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../supabase';

interface ProfileEditorProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, setProfile, isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Prepare profile_config updates
      const updates = [
        { key: 'name', value: profile.name },
        { key: 'title', value: profile.title },
        { key: 'bio_text', value: profile.bio },
        { key: 'avatar_url', value: profile.avatarUrl },
        { key: 'status_mode', value: profile.status_mode || '' },
        { key: 'status_emoji', value: profile.status_emoji || '' },
        { key: 'activity_playing', value: profile.activity_playing || '' },
        { key: 'activity_watching', value: profile.activity_watching || '' },
        { key: 'activity_working', value: profile.activity_working || '' },
        { key: 'featured_project', value: profile.featured_project || '' },
        { key: 'song_on_repeat', value: profile.song_on_repeat || '' },
        { key: 'timezone', value: profile.timezone || '' },
        // Serialize socials to store in the key-value config table
        { key: 'social_links', value: JSON.stringify(profile.socials || {}) }
      ];

      // Upsert into profile_config
      const { error: configError } = await supabase
        .from('profile_config')
        .upsert(updates, { onConflict: 'key' });

      if (configError) throw configError;

      // 2. Note: Updating individual links would require a more complex UI
      // For now, we focus on the core profile configuration as requested.

      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save identity. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-white/10 w-full max-w-md p-8 shadow-2xl text-white font-mono max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-xl font-black uppercase tracking-widest">Identify Editor</h2>
          <button onClick={onClose} className="hover:text-red-500 transition-colors">✕</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Full Name</label>
            <input
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Codename / Title</label>
            <input
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
              value={profile.title}
              onChange={e => setProfile({ ...profile, title: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Personal Bio</label>
            <textarea
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none h-24 resize-none"
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Avatar URL</label>
            <input
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
              value={profile.avatarUrl}
              onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-xs font-bold uppercase mb-4 text-cyan-500">Social Connections</h3>
            <div className="grid grid-cols-2 gap-4">
              {['twitter', 'github', 'linkedin', 'instagram', 'youtube', 'discord', 'steam'].map(social => (
                <div key={social} className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest">{social}</label>
                  <input
                    className="w-full bg-black border border-white/10 p-2 text-xs focus:border-cyan-500 outline-none"
                    placeholder={`https://${social}.com/...`}
                    value={profile.socials?.[social as keyof UserProfile['socials']] || ''}
                    onChange={e => setProfile({
                      ...profile,
                      socials: {
                        ...profile.socials,
                        [social]: e.target.value
                      }
                    })}
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Activity Playing</label>
              <input
                className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
                value={profile.activity_playing || ''}
                onChange={e => setProfile({ ...profile, activity_playing: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Project</label>
              <input
                className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
                value={profile.featured_project || ''}
                onChange={e => setProfile({ ...profile, featured_project: e.target.value })}
                disabled={isSaving}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors mt-8 flex items-center justify-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Updating_Core...
              </>
            ) : (
              'Save Identity'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;

