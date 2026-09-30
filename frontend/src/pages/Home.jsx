import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Sparkles, ArrowRight, Play, Smile, Mic, Music, Users, Award } from 'lucide-react';
import apiClient from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import { getMediaUrl } from '../utils/formatUrl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroVideo from '../components/HeroVideo';
import SectionHeading from '../components/SectionHeading';
import ShowCard from '../components/ShowCard';
import AuditionCard from '../components/AuditionCard';
import EpisodeCard from '../components/EpisodeCard';

const Home = () => {
  const [shows, setShows] = useState([]);
  const [auditions, setAuditions] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showsRes, auditionsRes, episodesRes] = await Promise.all([
          apiClient.get('/shows?featured=1'),
          apiClient.get('/auditions'),
          apiClient.get('/episodes')
        ]);
        if (showsRes.data.success) setShows(showsRes.data.shows.slice(0, 3));
        if (auditionsRes.data.success) setAuditions(auditionsRes.data.auditions.slice(0, 3));
        if (episodesRes.data.success) setEpisodes(episodesRes.data.episodes.slice(0, 4));
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans selection:bg-[#B51D2A] selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroVideo />

      {/* About / The Show Section */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="text-xs font-bold text-[#B51D2A] uppercase tracking-widest block">
              {settings.about_tagline || "MORE THAN A SHOW"}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading uppercase leading-tight">
              {settings.about_heading || "WHERE COMEDY MEETS REAL TALENT"}
            </h2>
            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed font-light italic border-l-2 border-[#B51D2A] pl-3 sm:pl-4 py-0.5">
              {settings.about_quote || '"Bringing together comedy, conversations, music, talent and unforgettable live experiences."'}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {settings.about_p1 || "Designed as a premier OTT and live entertainment platform, we celebrate vibrant cultural talent through top-tier standup, mimicry, storytelling, and musical performances."}
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <Link to="/about" className="btn-primary py-3 px-6 text-xs sm:text-sm w-full sm:w-auto justify-center">
                DISCOVER THE STORY <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#D6A84F] font-semibold uppercase tracking-wider py-1">
                <Award className="w-4 h-4 flex-shrink-0" /> Season 3 Live
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={getMediaUrl(settings.about_image_url, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000")} 
                alt={`${settings.site_title || "Show"} Stage`} 
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
                <div className="text-[10px] sm:text-xs font-bold text-[#D6A84F] uppercase tracking-widest mb-0.5 sm:mb-1">LIVE EXPERIENCE</div>
                <div className="text-xs sm:text-base lg:text-lg font-bold text-white">Full-House Audiences Across India</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Experience The Show Section (4 Large Visual Areas) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <SectionHeading 
          tagline="THE EXPERIENCE"
          title="FOUR PILLARS OF ENTERTAINMENT"
          subtitle="Explore the core elements that make every episode and live event a sensation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="cinematic-card rounded-2xl p-6 relative overflow-hidden group h-80 flex flex-col justify-end">
            <img 
              src={getMediaUrl(settings.pillar1_image, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600")} 
              alt={settings.pillar1_title || "Comedy"} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="relative z-10">
              <Smile className="w-8 h-8 text-[#B51D2A] mb-3" />
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">{settings.pillar1_title || "Comedy"}</h3>
              <p className="text-xs text-gray-300">{settings.pillar1_desc || "Observational stand-up and punchy rural panchayat acts."}</p>
            </div>
          </div>

          <div className="cinematic-card rounded-2xl p-6 relative overflow-hidden group h-80 flex flex-col justify-end">
            <img 
              src={getMediaUrl(settings.pillar2_image, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600")} 
              alt={settings.pillar2_title || "Talent"} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="relative z-10">
              <Mic className="w-8 h-8 text-[#D6A84F] mb-3" />
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">{settings.pillar2_title || "Talent"}</h3>
              <p className="text-xs text-gray-300">{settings.pillar2_desc || "Discovering mimicry artists, poets, and actors."}</p>
            </div>
          </div>

          <div className="cinematic-card rounded-2xl p-6 relative overflow-hidden group h-80 flex flex-col justify-end">
            <img 
              src={getMediaUrl(settings.pillar3_image, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600")} 
              alt={settings.pillar3_title || "Music"} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="relative z-10">
              <Music className="w-8 h-8 text-[#B51D2A] mb-3" />
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">{settings.pillar3_title || "Music"}</h3>
              <p className="text-xs text-gray-300">{settings.pillar3_desc || "High-octane folk tracks and acoustic ensemble solos."}</p>
            </div>
          </div>

          <div className="cinematic-card rounded-2xl p-6 relative overflow-hidden group h-80 flex flex-col justify-end">
            <img 
              src={getMediaUrl(settings.pillar4_image, "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600")} 
              alt={settings.pillar4_title || "Live Audience"} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="relative z-10">
              <Users className="w-8 h-8 text-[#D6A84F] mb-3" />
              <h3 className="text-2xl font-bold font-heading mb-1 text-white">{settings.pillar4_title || "Live Audience"}</h3>
              <p className="text-xs text-gray-300">{settings.pillar4_desc || "Unfiltered cheer, applause, and interactive stage seats."}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Auditions Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <SectionHeading 
          tagline="SHOWCASE YOUR TALENT"
          title="THINK YOU CAN OWN THE STAGE?"
          subtitle="We're looking for comedians, performers, singers, mimicry artists, actors and extraordinary talent."
        />

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading active audition hunts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {auditions.map(audition => (
              <AuditionCard key={audition.id} audition={audition} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/auditions" className="btn-outline py-3 px-8 text-sm border-white/30 hover:border-white">
            VIEW ALL OPEN AUDITIONS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Upcoming Live Shows */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <SectionHeading 
          tagline="LIVE TOUR 2026"
          title="UPCOMING LIVE EVENTS & SHOWS"
          subtitle="Reserve your premium seat for an unforgettable live comedy gala."
        />

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading upcoming shows...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {shows.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/shows" className="btn-primary py-3.5 px-8 text-sm">
            <Ticket className="w-4 h-4" /> EXPLORE ALL TOUR DATES
          </Link>
        </div>
      </section>

      {/* Featured Episodes Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <SectionHeading 
          tagline="WATCH ANYTIME"
          title="FEATURED EPISODES"
          subtitle="Catch up on the latest episodes, guest appearances, and hilarious moments."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {episodes.map(ep => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/episodes" className="btn-outline py-3 px-8 text-sm">
            BROWSE ALL EPISODES
          </Link>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="cinematic-card p-12 rounded-3xl relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#B51D2A]/20 via-transparent to-[#D6A84F]/20 pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-heading text-white mb-4">
            SEE YOU AT THE SHOW.
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto font-light mb-8">
            Book your tickets now or step into the spotlight by submitting your audition.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/shows" className="btn-primary py-3.5 px-8 text-sm">
              <Ticket className="w-4 h-4" /> BOOK TICKETS NOW
            </Link>
            <Link to="/auditions" className="btn-outline py-3.5 px-8 text-sm border-white/30">
              APPLY FOR AUDITION
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
