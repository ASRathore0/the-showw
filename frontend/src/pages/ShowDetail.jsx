import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Calendar, MapPin, Ticket, User, Star, Clock } from 'lucide-react';

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/shows/${id}`)
      .then(res => {
        if (res.data.success) setShow(res.data.show);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="bg-[#080808] text-white min-h-screen flex items-center justify-center">Loading show details...</div>;
  }

  if (!show) {
    return (
      <div className="bg-[#080808] text-white min-h-screen">
        <Navbar />
        <div className="pt-36 text-center py-20">
          <h2 className="text-2xl font-bold font-heading mb-4">Show Not Found</h2>
          <Link to="/shows" className="btn-primary py-2 px-6 text-sm">Back to Shows</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 p-8 sm:p-12 min-h-[450px] flex flex-col justify-end">
          <img 
            src={show.hero_path || show.poster_path || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'} 
            alt={show.title} 
            className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 max-w-3xl">
            <span className="px-3.5 py-1.5 bg-[#B51D2A] text-white text-xs font-bold uppercase tracking-wider rounded mb-4 inline-block">
              {show.city} LIVE CONCERT
            </span>
            <h1 className="text-3xl sm:text-6xl font-extrabold uppercase font-heading text-white leading-tight mb-4">
              {show.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D6A84F]" /> {show.show_date} ({show.show_time})
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B51D2A]" /> {show.venue}
              </span>
            </div>

            <Link 
              to={`/shows/${show.id}/seats`} 
              className="btn-primary py-3.5 px-8 text-sm inline-flex items-center gap-2"
            >
              <Ticket className="w-5 h-5" /> SELECT SEATS &amp; BOOK TICKETS
            </Link>
          </div>
        </div>
      </div>

      {/* Details & Ticket Categories */}
      <section className="py-12 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Description & Star Performers */}
        <div className="lg:col-span-8 space-y-10">
          <div>
            <h2 className="text-2xl font-bold uppercase font-heading mb-4 text-white">ABOUT THE EVENT</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {show.description}
            </p>
          </div>

          {/* Performers */}
          {show.performers && show.performers.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold uppercase font-heading mb-6 text-white">STAR PERFORMERS CAST</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {show.performers.map(p => (
                  <div key={p.id} className="cinematic-card p-4 rounded-xl text-center">
                    <img 
                      src={p.photo_path || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'} 
                      alt={p.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-[#D6A84F]" 
                    />
                    <div className="font-bold text-sm text-white">{p.name}</div>
                    <div className="text-xs text-[#D6A84F] mt-0.5">{p.pivot?.role || p.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Ticket Pricing Table */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cinematic-card p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold font-heading uppercase text-white mb-4 border-b border-white/10 pb-3">
              TICKET CATEGORIES &amp; PRICING
            </h3>

            <div className="space-y-4">
              {show.ticket_categories?.map(cat => (
                <div key={cat.id} className="p-4 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-sm text-white">{cat.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{cat.available_seats} seats remaining</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#D6A84F] font-heading">₹{cat.price}</div>
                    <div className="text-[10px] text-gray-500">per seat</div>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              to={`/shows/${show.id}/seats`} 
              className="btn-primary w-full text-center justify-center py-3 px-4 text-xs font-bold uppercase tracking-wider mt-6"
            >
              CHOOSE SEATS ON MAP
            </Link>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default ShowDetail;
