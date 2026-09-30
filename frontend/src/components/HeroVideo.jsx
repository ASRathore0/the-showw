import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Sparkles, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getMediaUrl } from '../utils/formatUrl';

const FALLBACK_HERO_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-stage-lights-shining-at-a-concert-4087-large.mp4";

const HeroVideo = () => {
  const [videoError, setVideoError] = useState(false);
  const { settings } = useSettings();
  const videoRef = useRef(null);

  const rawVideoUrl = settings?.hero_video_url;
  const videoSrc = rawVideoUrl ? getMediaUrl(rawVideoUrl) : FALLBACK_HERO_VIDEO;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.warn("Autoplay attempt failed:", err);
      });
    }
  }, [videoSrc]);

  return (
    <div className="relative w-full h-[95vh] min-h-[650px] bg-[#080808] flex items-center justify-center overflow-hidden">
      
      {/* Hero Video background with fallback */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.80] contrast-[1.1]"
          onError={() => setVideoError(true)}
          key={videoSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}

      {/* Background Poster Image Fallback / Layer */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${videoError ? 'opacity-40' : 'opacity-20'}`}
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1920')` }}
      />

      {/* Dark Cinematic Gradients Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/70 z-10" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 z-10" />

      {/* Hero Central Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center justify-center mt-12">
        
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#D6A84F] tracking-widest uppercase mb-6 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
          Official Entertainment Platform
        </div>

        {/* Editorial Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight uppercase font-heading mb-3 drop-shadow-2xl">
          {settings.hero_title || settings.site_title || "THE SHOW"}
        </h1>

        {/* Hindi Tagline */}
        <h2 className="text-2xl sm:text-4xl font-bold text-[#B51D2A] mb-4 font-heading tracking-wide">
          "{settings.hero_tagline || "जहाँ हँसी भी है, हुनर भी है।"}"
        </h2>

        {/* Subtitle */}
        <p className="text-gray-300 text-base sm:text-xl font-light max-w-2xl mb-8 tracking-wide">
          {settings.hero_subtitle || "Comedy. Talent. Stories. Live Entertainment."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
          <Link 
            to="/shows" 
            className="btn-primary w-full sm:w-auto py-3.5 px-8 text-base shadow-lg shadow-[#B51D2A]/30"
          >
            <Ticket className="w-5 h-5" />
            BOOK LIVE TICKETS
          </Link>
          <Link 
            to="/auditions" 
            className="btn-outline w-full sm:w-auto py-3.5 px-8 text-base border-white/30 bg-white/5 hover:bg-white/15"
          >
            <Sparkles className="w-5 h-5 text-[#D6A84F]" />
            APPLY FOR AUDITION
          </Link>
        </div>

        {/* Upcoming Show Badge Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-xl bg-[#121212]/80 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-gray-300">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-[#B51D2A] animate-pulse"></span>
            NEXT LIVE SHOW:
          </span>
          <span className="flex items-center gap-1.5 text-white">
            <MapPin className="w-3.5 h-3.5 text-[#B51D2A]" /> {settings.hero_next_city || "Patna"}
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="flex items-center gap-1.5 text-white">
            <Calendar className="w-3.5 h-3.5 text-[#D6A84F]" /> {settings.hero_next_date || "12 October 2026"}
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="text-[#D6A84F] font-medium">{settings.hero_next_time || "7:00 PM"}</span>
        </div>

      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-6 z-20 flex flex-col items-center gap-1 text-gray-400 text-xs animate-bounce opacity-70">
        <span className="uppercase tracking-widest text-[10px]">Scroll Down</span>
        <ChevronDown className="w-4 h-4" />
      </div>

    </div>
  );
};

export default HeroVideo;
