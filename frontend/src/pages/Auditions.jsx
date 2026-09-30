import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import AuditionCard from '../components/AuditionCard';
import apiClient from '../api/axios';
import { Filter, Sparkles } from 'lucide-react';

const Auditions = () => {
  const [auditions, setAuditions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Comedy', 'Acting', 'Singing', 'Mimicry', 'Anchoring', 'Other'];

  useEffect(() => {
    const fetchAuditions = async () => {
      setLoading(true);
      try {
        const url = selectedCategory === 'All' ? '/auditions' : `/auditions?category=${selectedCategory}`;
        const res = await apiClient.get(url);
        if (res.data.success) {
          setAuditions(res.data.auditions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditions();
  }, [selectedCategory]);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center border-b border-white/10">
        <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-2">
          AUDITION OPPORTUNITIES 2026
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading tracking-tight mb-4">
          THINK YOU CAN OWN THE STAGE?
        </h1>
        <p className="text-gray-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          We're looking for comedians, performers, singers, mimicry artists, actors and extraordinary talent.
        </p>
      </div>

      {/* Category Filters */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#B51D2A] text-white shadow-lg shadow-[#B51D2A]/40' 
                  : 'bg-[#121212] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Active Auditions Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading audition opportunities...</div>
        ) : auditions.length === 0 ? (
          <div className="text-center py-20 text-gray-400 cinematic-card p-12 rounded-2xl max-w-xl mx-auto">
            <Sparkles className="w-12 h-12 text-[#D6A84F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-heading mb-2">No Open Auditions Found</h3>
            <p className="text-xs text-gray-400">Please try selecting another category or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {auditions.map(audition => (
              <AuditionCard key={audition.id} audition={audition} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Auditions;
