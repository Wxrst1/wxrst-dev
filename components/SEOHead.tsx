
import React, { useEffect } from 'react';
import { UserProfile, ThemeType } from '../types';

interface SEOHeadProps {
    profile: UserProfile;
    currentTheme: ThemeType;
}

const SEOHead: React.FC<SEOHeadProps> = ({ profile, currentTheme }) => {
    useEffect(() => {
        // Dynamic Title
        const themeLabel = currentTheme.replace(/_/g, ' ').toLowerCase();
        document.title = `${profile.name} | ${profile.title} [${themeLabel}]`;

        // Update Meta Tags
        const updateMeta = (name: string, content: string, property = false) => {
            let el = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                if (property) el.setAttribute('property', name);
                else el.setAttribute('name', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        const description = `${profile.bio.substring(0, 150)}... Explore the ${themeLabel} universe of ${profile.name}.`;

        updateMeta('description', description);
        updateMeta('keywords', `developer, designer, portfolio, ${profile.name}, ${currentTheme}, radical morph`);

        // Open Graph
        updateMeta('og:title', `${profile.name} - ${profile.title}`, true);
        updateMeta('og:description', description, true);
        updateMeta('og:image', profile.avatarUrl || '/og-image.png', true);
        updateMeta('og:type', 'website', true);
        updateMeta('og:url', window.location.href, true);

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', `${profile.name} | ${profile.title}`);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', profile.avatarUrl || '/og-image.png');

    }, [profile, currentTheme]);

    return null; // This component doesn't render anything, just manages side effects
};

export default SEOHead;
