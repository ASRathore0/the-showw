import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeatMap from '../components/SeatMap';
import apiClient from '../api/axios';
import { Ticket, ArrowRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';

const SeatBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/shows/${id}/seats`)
      .then(res => {
        if (res.data.success) {
          setShow(res.data.show);
          setCategories(res.data.ticket_categories);
          setSeats(res.data.seats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleSeat = (seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(sid => sid !== seat.id));
    } else {
      // Limit selection to maximum 6 seats
      if (selectedSeatIds.length >= 6) {
        alert('You can select a maximum of 6 seats per booking transaction.');
        return;
      }
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  const selectedSeats = seats.filter(s => selectedSeatIds.includes(s.id));
  const totalAmount = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    
    // Pass selected details via state navigation to Checkout page
    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
        totalAmount
      }
    });
  };

  if (loading) {
    return <div className="bg-[#080808] text-white min-h-screen flex items-center justify-center">Loading seat map layout...</div>;
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans pb-32 md:pb-24">
      <Navbar />

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#B51D2A] uppercase tracking-widest block mb-1">
              SELECT YOUR SEATS
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase font-heading text-white">
              {show?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#B51D2A]" /> {show?.venue}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#D6A84F]" /> {show?.show_date} ({show?.show_time})</span>
            </div>
          </div>

          <Link to={`/shows/${id}`} className="btn-outline text-xs py-2 px-4 self-start md:self-auto">
            &larr; Show Details
          </Link>
        </div>

        {/* Layout Grid: Seat Map (Left) vs Summary Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Seat Map Area */}
          <div className="lg:col-span-8">
            <SeatMap 
              seats={seats} 
              categories={categories} 
              selectedSeatIds={selectedSeatIds} 
              onToggleSeat={handleToggleSeat} 
            />
          </div>

          {/* Desktop Booking Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="cinematic-card p-6 rounded-xl border border-white/10 space-y-6">
              <h3 className="text-lg font-bold uppercase font-heading text-white border-b border-white/10 pb-3 flex items-center justify-between">
                <span>BOOKING SUMMARY</span>
                <Ticket className="w-5 h-5 text-[#B51D2A]" />
              </h3>

              {/* Selected Seats List */}
              {selectedSeats.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500 italic">
                  Click on available seats on the map to select.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase">Selected Seats ({selectedSeats.length})</div>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {selectedSeats.map(s => (
                      <div key={s.id} className="p-2.5 rounded bg-black/50 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{s.seat_code}</span>
                          <span className="text-gray-500 text-[10px] ml-2">(Row {s.row})</span>
                        </div>
                        <span className="text-[#D6A84F] font-bold">₹{s.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Seats Total:</span>
                      <span className="text-white">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Convenience Fee:</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                      <span>Total Payable:</span>
                      <span className="text-xl text-[#D6A84F] font-heading">₹{totalAmount}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleProceedToCheckout} 
                    className="btn-primary w-full py-3.5 text-xs text-center justify-center font-bold tracking-wider uppercase mt-4"
                  >
                    PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}

              <div className="text-[10px] text-gray-500 flex items-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>100% Authentic Tickets with QR Code Access.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Bottom Booking Summary Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-white/15 p-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-gray-400">{selectedSeats.length} Seat(s) Selected</div>
          <div className="text-xl font-extrabold text-[#D6A84F] font-heading">₹{totalAmount}</div>
        </div>

        <button 
          disabled={selectedSeats.length === 0} 
          onClick={handleProceedToCheckout}
          className="btn-primary py-3 px-6 text-xs font-bold uppercase disabled:opacity-40"
        >
          CHECKOUT ({selectedSeats.length})
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default SeatBooking;
