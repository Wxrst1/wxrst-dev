
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
  const [localProfile, setLocalProfile] = useState<UserProfile>(() => ({ ...profile }));
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if profile prop updates while open
  React.useEffect(() => {
    if (isOpen) {
      setLocalProfile({ ...profile });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Prepare profile_config updates
      const updates = [
        { key: 'name', value: localProfile.name },
        { key: 'title', value: localProfile.title },
        { key: 'bio_text', value: localProfile.bio },
        { key: 'avatar_url', value: localProfile.avatarUrl },
        { key: 'status_mode', value: localProfile.status_mode || '' },
        { key: 'status_emoji', value: localProfile.status_emoji || '' },
        { key: 'activity_playing', value: localProfile.activity_playing || '' },
        { key: 'activity_watching', value: localProfile.activity_watching || '' },
        { key: 'activity_working', value: localProfile.activity_working || '' },
        { key: 'featured_project', value: localProfile.featured_project || '' },
        { key: 'song_on_repeat', value: localProfile.song_on_repeat || '' },
        { key: 'timezone', value: localProfile.timezone || '' },
        // Serialize socials to store in the key-value config table
        { key: 'social_links', value: JSON.stringify(localProfile.socials || {}) }
      ];

      // Upsert into profile_config
      const { error: configError } = await supabase
        .from('profile_config')
        .upsert(updates, { onConflict: 'key' });

      if (configError) throw configError;

      // Commit to parent state
      setProfile(localProfile);
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
              value={localProfile.name}
              onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Codename / Title</label>
            <input
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
              value={localProfile.title}
              onChange={e => setLocalProfile({ ...localProfile, title: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Personal Bio</label>
            <textarea
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none h-24 resize-none"
              value={localProfile.bio}
              onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Avatar URL</label>
            <input
              className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
              value={localProfile.avatarUrl}
              onChange={e => setLocalProfile({ ...localProfile, avatarUrl: e.target.value })}
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
                    value={localProfile.socials?.[social as keyof UserProfile['socials']] || ''}
                    onChange={e => setLocalProfile({
                      ...localProfile,
                      socials: {
                        ...localProfile.socials,
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
                value={localProfile.activity_playing || ''}
                onChange={e => setLocalProfile({ ...localProfile, activity_playing: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Project</label>
              <input
                className="w-full bg-black border border-white/10 p-2 text-sm focus:border-cyan-500 outline-none"
                value={localProfile.featured_project || ''}
                onChange={e => setLocalProfile({ ...localProfile, featured_project: e.target.value })}
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

