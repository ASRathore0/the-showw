import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle2, QrCode, Download, Calendar as CalendarIcon, MapPin, Ticket as TicketIcon } from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="bg-[#080808] text-white min-h-screen">
        <Navbar />
        <div className="pt-36 text-center py-20">
          <h2 className="text-2xl font-bold font-heading mb-4">No Booking Found</h2>
          <Link to="/shows" className="btn-primary py-2 px-6 text-sm">Browse Live Shows</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-3xl mx-auto">
        
        {/* Success Card */}
        <div className="cinematic-card p-8 sm:p-12 rounded-2xl border border-white/10 text-center relative overflow-hidden shadow-2xl">
          
          <div className="w-20 h-20 rounded-full bg-green-950/60 border border-green-500/50 text-green-400 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-1">
            CONFIRMED TICKET PASS
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading text-white mb-2">
            YOU'RE IN.
          </h1>
          <p className="text-gray-300 text-sm mb-8">
            Your booking is confirmed! Show your digital pass or QR code at venue entrance.
          </p>

          {/* Ticket Pass Ticket Container */}
          <div className="p-6 rounded-xl bg-black/80 border border-white/10 text-left mb-8 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-2">
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">BOOKING REFERENCE NO.</div>
                <div className="text-xl font-extrabold text-[#D6A84F] font-heading">{booking.booking_no}</div>
              </div>

              <div className="px-3 py-1 rounded bg-green-900/60 border border-green-500/40 text-green-300 text-xs font-bold uppercase">
                {booking.booking_status.toUpperCase()}
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold font-heading text-white mb-1">{booking.show?.title}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#B51D2A]" /> {booking.show?.venue}
              </div>
              <div className="text-xs text-[#D6A84F] flex items-center gap-1 mt-1 font-semibold">
                <CalendarIcon className="w-3.5 h-3.5" /> {booking.show?.show_date} ({booking.show?.show_time})
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <div className="text-gray-500 font-semibold mb-1">SEATS ALLOTTED:</div>
                <div className="flex flex-wrap gap-1">
                  {booking.items?.map(item => (
                    <span key={item.id} className="px-2 py-1 rounded bg-[#B51D2A] text-white font-bold text-xs">
                      {item.seat_code}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-gray-500 font-semibold mb-1">PASS HOLDER:</div>
                <div className="text-white font-bold">{booking.customer_name} ({booking.customer_phone})</div>
              </div>
            </div>

            {/* QR Code Placeholder Box */}
            <div className="pt-6 border-t border-white/10 flex flex-col items-center justify-center">
              <div className="p-4 bg-white rounded-xl shadow-lg mb-2">
                {/* SVG QR CODE REPRESENTATION */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-32 h-32">
                  <rect width="100" height="100" fill="#FFFFFF"/>
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="#000000"/>
                  <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="#000000"/>
                  <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="#000000"/>
                  <rect x="35" y="10" width="10" height="10" fill="#000000"/>
                  <rect x="50" y="20" width="15" height="10" fill="#000000"/>
                  <rect x="40" y="40" width="20" height="20" fill="#000000"/>
                  <rect x="70" y="50" width="10" height="20" fill="#000000"/>
                  <rect x="10" y="40" width="15" height="10" fill="#000000"/>
                  <rect x="40" y="70" width="20" height="20" fill="#000000"/>
                  <rect x="70" y="80" width="20" height="10" fill="#000000"/>
                </svg>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">SCAN AT GATE FOR FAST PASS ENTRY</div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={handlePrintTicket} 
              className="btn-primary py-3 px-6 text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> DOWNLOAD TICKET (PDF)
            </button>
            <Link 
              to="/dashboard/tickets" 
              className="btn-outline py-3 px-6 text-xs border-white/20"
            >
              MY ACCOUNT DASHBOARD
            </Link>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default BookingSuccess;
