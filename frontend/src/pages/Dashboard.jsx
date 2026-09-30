import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import { Ticket, Sparkles, User, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/user/dashboard')
      .then(res => {
        if (res.data.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        
        {/* User Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-1">
              CUSTOMER &amp; TALENT DASHBOARD
            </span>
            <h1 className="text-3xl font-extrabold uppercase font-heading text-white">
              WELCOME BACK, {user?.name || 'PERFORMER'}!
            </h1>
            <p className="text-xs text-gray-400 mt-1">{user?.email} &bull; {user?.phone || 'No phone registered'}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard/tickets" className="btn-outline text-xs py-2.5 px-4">
              <Ticket className="w-4 h-4" /> My Tickets ({data?.tickets_count || 0})
            </Link>
            <Link to="/dashboard/auditions" className="btn-primary text-xs py-2.5 px-4">
              <Sparkles className="w-4 h-4" /> My Auditions ({data?.auditions_count || 0})
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading user dashboard...</div>
        ) : (
          <div className="space-y-10">
            
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="cinematic-card p-6 rounded-xl border border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase">TICKETS PURCHASED</div>
                <div className="text-3xl font-extrabold font-heading text-[#D6A84F] mt-2">{data?.tickets_count || 0}</div>
                <div className="text-[11px] text-gray-500 mt-1">Confirmed show entry seats</div>
              </div>

              <div className="cinematic-card p-6 rounded-xl border border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase">AUDITION APPLICATIONS</div>
                <div className="text-3xl font-extrabold font-heading text-[#B51D2A] mt-2">{data?.auditions_count || 0}</div>
                <div className="text-[11px] text-gray-500 mt-1">Submissions in screening pipeline</div>
              </div>

              <div className="cinematic-card p-6 rounded-xl border border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase">ACCOUNT STATUS</div>
                <div className="text-3xl font-extrabold font-heading text-green-400 mt-2">ACTIVE</div>
                <div className="text-[11px] text-gray-500 mt-1">Verified Member Account</div>
              </div>
            </div>

            {/* Upcoming Show Ticket Banner */}
            {data?.upcoming_booking && (
              <div className="cinematic-card p-8 rounded-2xl border border-[#D6A84F]/40 bg-gradient-to-r from-black via-zinc-900 to-black">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-[#D6A84F]/20 text-[#D6A84F] text-[10px] font-bold uppercase tracking-wider border border-[#D6A84F]/40 inline-block mb-3">
                      UPCOMING CONFIRMED SHOW PASS
                    </span>
                    <h2 className="text-2xl font-bold font-heading text-white">{data.upcoming_booking.show?.title}</h2>
                    <div className="text-xs text-gray-300 mt-2 flex flex-wrap gap-4">
                      <span><MapPin className="w-3.5 h-3.5 inline text-[#B51D2A]" /> {data.upcoming_booking.show?.venue}</span>
                      <span><Calendar className="w-3.5 h-3.5 inline text-[#D6A84F]" /> {data.upcoming_booking.show?.show_date} ({data.upcoming_booking.show?.show_time})</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-xs text-gray-400">BOOKING REF: <span className="text-white font-bold">{data.upcoming_booking.booking_no}</span></div>
                    <Link to="/dashboard/tickets" className="btn-primary py-2.5 px-5 text-xs">
                      VIEW FULL TICKET PASS &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Audition Applications List */}
            <div className="cinematic-card p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold font-heading text-white uppercase mb-4 border-b border-white/10 pb-3">
                RECENT AUDITION APPLICATIONS
              </h3>

              {data?.recent_auditions?.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  You haven't submitted any audition applications yet.
                  <div className="mt-3">
                    <Link to="/auditions" className="btn-primary py-2 px-4 text-xs">Apply for Open Audition</Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.recent_auditions?.map(app => (
                    <div key={app.id} className="p-4 rounded-xl bg-black/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{app.application_no}</span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-semibold">{app.category}</span>
                        </div>
                        <div className="text-gray-400 mt-1 font-semibold text-xs">{app.audition?.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Applied: {app.created_at?.split('T')[0]} &bull; City: {app.city}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded font-bold uppercase ${
                          app.status === 'Selected' ? 'bg-green-900 text-green-200 border border-green-700' :
                          app.status === 'Shortlisted' ? 'bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]' :
                          'bg-[#B51D2A]/20 text-[#B51D2A] border border-[#B51D2A]'
                        }`}>
                          {app.status}
                        </span>
                        <Link to="/dashboard/auditions" className="text-xs text-gray-400 hover:text-white underline">
                          Timeline &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
