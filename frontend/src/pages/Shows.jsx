import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import ShowCard from '../components/ShowCard';
import apiClient from '../api/axios';
import { MapPin } from 'lucide-react';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);

  const cities = ['All', 'Patna', 'Varanasi', 'Lucknow', 'Delhi', 'Mumbai'];

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const url = selectedCity === 'All' ? '/shows' : `/shows?city=${selectedCity}`;
        const res = await apiClient.get(url);
        if (res.data.success) {
          setShows(res.data.shows);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [selectedCity]);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center border-b border-white/10">
        <span className="text-xs font-bold text-[#B51D2A] uppercase tracking-widest block mb-2">
          LIVE TOUR 2026
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading tracking-tight mb-4">
          UPCOMING LIVE EVENTS
        </h1>
        <p className="text-gray-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Book your tickets to experience non-stop laughter, music, and celebrity appearances live.
        </p>
      </div>

      {/* City Filters */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                selectedCity === city 
                  ? 'bg-[#B51D2A] text-white shadow-lg shadow-[#B51D2A]/40' 
                  : 'bg-[#121212] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {city !== 'All' && <MapPin className="w-3.5 h-3.5" />}
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* Shows Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading tour dates...</div>
        ) : shows.length === 0 ? (
          <div className="text-center py-20 text-gray-400 cinematic-card p-12 rounded-2xl max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white font-heading mb-2">No Upcoming Shows in {selectedCity}</h3>
            <p className="text-xs text-gray-400">Please select another city or check back soon for new dates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shows.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Shows;
