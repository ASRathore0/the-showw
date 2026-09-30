import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EpisodeCard from '../components/EpisodeCard';
import apiClient from '../api/axios';

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/episodes')
      .then(res => {
        if (res.data.success) setEpisodes(res.data.episodes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center border-b border-white/10">
        <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-2">
          OTT DIGITAL SHOWS
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading tracking-tight mb-4">
          EPISODES &amp; SPECIALS
        </h1>
        <p className="text-gray-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Watch full digital episodes, guest star interviews, and exclusive behind-the-scenes performances.
        </p>
      </div>

      <section className="py-12 px-4 max-w-7xl mx-auto min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading episodes...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {episodes.map(ep => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Episodes;
