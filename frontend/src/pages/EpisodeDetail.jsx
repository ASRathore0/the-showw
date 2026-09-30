import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Play, Clock, User, Calendar, Share2, Sparkles } from 'lucide-react';

const EpisodeDetail = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/episodes/${id}`)
      .then(res => {
        if (res.data.success) setEpisode(res.data.episode);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="bg-[#080808] text-white min-h-screen flex items-center justify-center">Loading episode player...</div>;
  }

  if (!episode) {
    return (
      <div className="bg-[#080808] text-white min-h-screen">
        <Navbar />
        <div className="pt-36 text-center py-20">
          <h2 className="text-2xl font-bold font-heading mb-4">Episode Not Found</h2>
          <Link to="/episodes" className="btn-primary py-2 px-6 text-sm">Back to Episodes</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-28 pb-20 max-w-6xl mx-auto px-4">
        
        {/* Video Player Frame Container */}
        <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl mb-8 relative aspect-video">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0" 
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>

        {/* Video Metadata Header */}
        <div className="cinematic-card p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
            <span className="px-3 py-1 bg-[#B51D2A] text-white font-bold uppercase rounded">
              EPISODE {episode.episode_no}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D6A84F]" /> {episode.duration}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-500" /> {episode.publish_date || 'Sept 2026'}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase font-heading text-white leading-tight">
            {episode.title}
          </h1>

          {episode.guest_name && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D6A84F]/10 text-[#D6A84F] text-xs font-semibold border border-[#D6A84F]/30">
              <Sparkles className="w-3.5 h-3.5" /> Featuring Special Guest: {episode.guest_name}
            </div>
          )}

          <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
            {episode.description}
          </p>

          <div className="pt-4 flex items-center justify-between">
            <Link to="/episodes" className="btn-outline text-xs py-2.5 px-5">
              &larr; ALL EPISODES
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default EpisodeDetail;
