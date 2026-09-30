import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Sparkles, Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

const AuditionDetail = () => {
  const { id } = useParams();
  const [audition, setAudition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/auditions/${id}`)
      .then(res => {
        if (res.data.success) setAudition(res.data.audition);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#080808] text-white min-h-screen flex items-center justify-center">
        Navbar loading...
      </div>
    );
  }

  if (!audition) {
    return (
      <div className="bg-[#080808] text-white min-h-screen">
        <Navbar />
        <div className="pt-36 text-center py-20">
          <h2 className="text-2xl font-bold font-heading mb-4">Audition Hunt Not Found</h2>
          <Link to="/auditions" className="btn-primary py-2 px-6 text-sm">Back to Auditions</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <div className="cinematic-card p-8 sm:p-12 rounded-2xl border border-white/10 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="px-3.5 py-1.5 bg-[#B51D2A] text-white text-xs font-bold uppercase tracking-wider rounded-md">
              {audition.category} HUNT
            </span>
            <span className="text-xs text-[#D6A84F] font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Status: {audition.status.toUpperCase()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-heading mb-6 leading-tight">
            {audition.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl bg-black/50 border border-white/5 mb-8 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5 text-[#B51D2A] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Audition City &amp; Venue</div>
                <div className="font-semibold text-white">{audition.city} - {audition.venue}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-5 h-5 text-[#D6A84F] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Application Window</div>
                <div className="font-semibold text-white">{audition.start_date} to {audition.end_date}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-gray-300 text-sm leading-relaxed mb-10">
            <div>
              <h3 className="text-lg font-bold text-white font-heading uppercase mb-2">About The Opportunity</h3>
              <p>{audition.description}</p>
            </div>

            {audition.requirements && (
              <div>
                <h3 className="text-lg font-bold text-white font-heading uppercase mb-2">Requirements &amp; Guidelines</h3>
                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-gray-300 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#B51D2A] flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm">{audition.requirements}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/auditions" className="btn-outline text-xs py-3 px-6">
              &larr; BACK TO AUDITIONS
            </Link>
            <Link 
              to={`/auditions/${audition.id}/apply`}
              className="btn-primary py-3.5 px-8 text-sm w-full sm:w-auto text-center"
            >
              APPLY NOW FOR THIS AUDITION <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuditionDetail;
