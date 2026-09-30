import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { getMediaUrl } from '../utils/formatUrl';

const defaultSettings = {
  site_title: 'THE ENTERTAINMENT SHOW',
  logo_url: '',
  favicon_url: '/favicon.svg',
  support_phone: '+91 9876543210',
  support_email: 'contact@example.com',

  // Social Media Links
  youtube_url: 'https://youtube.com',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  twitter_url: 'https://twitter.com',
  whatsapp_url: 'https://wa.me/919876543210',

  // Hero Section
  hero_title: 'THE ENTERTAINMENT SHOW',
  hero_tagline: 'Where Comedy & Talent Live Together',
  hero_subtitle: 'Comedy. Talent. Stories. Live Entertainment.',
  hero_video_url: '',
  hero_next_city: 'Patna',
  hero_next_date: '12 October 2026',
  hero_next_time: '7:00 PM',

  // About Section
  about_tagline: 'MORE THAN A SHOW',
  about_heading: 'WHERE COMEDY MEETS REAL TALENT',
  about_quote: '"Bringing together comedy, conversations, music, talent and unforgettable live experiences."',
  about_p1: 'Designed as a premier OTT and live entertainment platform, we celebrate vibrant cultural talent through top-tier standup, mimicry, storytelling, and musical performances.',
  about_p2: 'Whether performing before packed auditoriums or reaching millions across OTT and video streaming, our mission is simple: inspire laughter, foster genuine talent, and elevate performance art.',
  about_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',

  // Pillars / Experience Section
  pillar1_title: 'Comedy',
  pillar1_desc: 'Observational stand-up and punchy rural panchayat acts.',
  pillar1_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',

  pillar2_title: 'Talent',
  pillar2_desc: 'Discovering mimicry artists, poets, and actors.',
  pillar2_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',

  pillar3_title: 'Music',
  pillar3_desc: 'High-octane folk tracks and acoustic ensemble solos.',
  pillar3_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',

  pillar4_title: 'Live Audience',
  pillar4_desc: 'Unfiltered cheer, applause, and interactive stage seats.',
  pillar4_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600',
};

const SettingsContext = createContext({
  settings: defaultSettings,
  loading: true,
  refreshSettings: () => {},
  saveSettings: async () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/settings');
      if (response.data.success && response.data.settings) {
        setSettings(prev => ({
          ...defaultSettings,
          ...response.data.settings
        }));
      }
    } catch (err) {
      console.warn("Could not load backend settings, using defaults.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update Document Title & Favicon dynamically when settings change
  useEffect(() => {
    if (settings.site_title) {
      document.title = settings.site_title;
    }
    if (settings.favicon_url) {
      let faviconLink = document.querySelector("link[rel*='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(faviconLink);
      }
      faviconLink.href = getMediaUrl(settings.favicon_url);
    }
  }, [settings]);

  const saveSettings = async (updatedMap) => {
    const response = await apiClient.post('/admin/settings', { settings: updatedMap });
    if (response.data.success) {
      if (response.data.settings) {
        setSettings(prev => ({
          ...defaultSettings,
          ...response.data.settings
        }));
      } else {
        await fetchSettings();
      }
      return true;
    }
    return false;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
