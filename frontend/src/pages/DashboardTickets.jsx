import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Ticket, MapPin, Calendar, QrCode, Download } from 'lucide-react';

const DashboardTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/user/tickets')
      .then(res => {
        if (res.data.success) setBookings(res.data.bookings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-5xl mx-auto">
        
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-bold text-[#B51D2A] uppercase tracking-widest block mb-1">
            MY ACCOUNT
          </span>
          <h1 className="text-3xl font-extrabold uppercase font-heading text-white">
            MY TICKET BOOKINGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">View your confirmed ticket passes, QR codes, and seat numbers.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading your tickets...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400 cinematic-card p-12 rounded-2xl max-w-xl mx-auto">
            <Ticket className="w-12 h-12 text-[#B51D2A] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-heading mb-2">No Ticket Bookings Found</h3>
            <p className="text-xs text-gray-400">You haven't booked any show tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="cinematic-card p-6 sm:p-8 rounded-2xl border border-white/10 relative">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">BOOKING REF NO.</span>
                    <div className="text-xl font-extrabold text-[#D6A84F] font-heading">{booking.booking_no}</div>
                  </div>

                  <div className="px-3 py-1 rounded bg-green-950 text-green-300 border border-green-700 text-xs font-bold uppercase self-start sm:self-auto">
                    {booking.booking_status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  <div className="md:col-span-8 space-y-2">
                    <h2 className="text-xl font-bold font-heading text-white">{booking.show?.title}</h2>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B51D2A]" /> {booking.show?.venue} ({booking.show?.city})
                    </div>
                    <div className="text-xs text-[#D6A84F] flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> {booking.show?.show_date} ({booking.show?.show_time})
                    </div>

                    <div className="pt-3">
                      <div className="text-xs text-gray-400 font-semibold mb-1">SEATS RESERVED ({booking.items?.length}):</div>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.items?.map(item => (
                          <span key={item.id} className="px-2.5 py-1 rounded bg-[#B51D2A] text-white font-bold text-xs">
                            {item.seat_code} (₹{item.price})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-black/60 border border-white/5">
                    <div className="p-2 bg-white rounded-lg mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-20 h-20">
                        <rect width="100" height="100" fill="#FFFFFF"/>
                        <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="#000000"/>
                        <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="#000000"/>
                        <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="#000000"/>
                        <rect x="40" y="40" width="20" height="20" fill="#000000"/>
                      </svg>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">GATE ENTRY QR</div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default DashboardTickets;
