import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CreditCard, QrCode, Building2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { show, selectedSeats, totalAmount } = location.state || {};

  const [customerName, setCustomerName] = useState(user?.name || 'Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'demo@example.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 9876543210');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="bg-[#080808] text-white min-h-screen">
        <Navbar />
        <div className="pt-36 text-center py-20">
          <h2 className="text-2xl font-bold font-heading mb-4">No Seats Selected</h2>
          <p className="text-gray-400 text-xs mb-6">Please select your seats before proceeding to checkout.</p>
          <Link to="/shows" className="btn-primary py-2 px-6 text-sm">Browse Live Shows</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMsg('Please enter customer name, email, and mobile phone.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        show_id: show.id,
        seat_ids: selectedSeats.map(s => s.id),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_method: paymentMethod
      };

      const res = await apiClient.post('/bookings', payload);

      if (res.data.success) {
        // Navigate to booking success page with booking details
        navigate('/booking/success', {
          state: {
            booking: res.data.booking
          }
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-5xl mx-auto">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-1">
            SECURE CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-heading">
            CONFIRM YOUR TICKETS
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCompletePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer Info & Payment Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Details Card */}
            <div className="cinematic-card p-6 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold uppercase font-heading text-white border-b border-white/10 pb-3">
                1. CUSTOMER INFORMATION
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none"
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Email Address (For Ticket Delivery) *</label>
                    <input 
                      type="email" 
                      value={customerEmail} 
                      onChange={e => setCustomerEmail(e.target.value)} 
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Mobile Phone (For SMS Ticket) *</label>
                    <input 
                      type="tel" 
                      value={customerPhone} 
                      onChange={e => setCustomerPhone(e.target.value)} 
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none"
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options Card */}
            <div className="cinematic-card p-6 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold uppercase font-heading text-white border-b border-white/10 pb-3 flex items-center justify-between">
                <span>2. PAYMENT METHOD</span>
                <Lock className="w-4 h-4 text-green-500" />
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'UPI' 
                      ? 'border-[#B51D2A] bg-[#B51D2A]/10 text-white font-bold' 
                      : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-[#D6A84F]" />
                  <span className="text-xs">UPI Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'Card' 
                      ? 'border-[#B51D2A] bg-[#B51D2A]/10 text-white font-bold' 
                      : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-[#B51D2A]" />
                  <span className="text-xs">Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Net Banking')}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'Net Banking' 
                      ? 'border-[#B51D2A] bg-[#B51D2A]/10 text-white font-bold' 
                      : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <Building2 className="w-6 h-6 text-[#D6A84F]" />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-black/60 border border-white/5 text-xs text-gray-400 leading-relaxed">
                <span className="text-[#D6A84F] font-semibold">Payment Architecture Note:</span> Payment service abstraction configured. Submitting will process instant mock confirmation and generate your official digital tickets.
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Pay Button */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="cinematic-card p-6 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold uppercase font-heading text-white border-b border-white/10 pb-3">
                ORDER SUMMARY
              </h3>

              <div className="text-xs space-y-3">
                <div>
                  <div className="font-bold text-white text-base">{show.title}</div>
                  <div className="text-gray-400 mt-0.5">{show.city} &bull; {show.venue}</div>
                  <div className="text-[#D6A84F] font-semibold mt-0.5">{show.show_date} ({show.show_time})</div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="text-gray-400 font-semibold mb-2">SEATS BOOKED ({selectedSeats.length}):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map(s => (
                      <span key={s.id} className="px-2 py-1 rounded bg-zinc-800 text-white font-bold text-[11px] border border-zinc-700">
                        {s.seat_code}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span className="text-white">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax &amp; Fees:</span>
                    <span className="text-green-400">₹0 (Waived)</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                    <span>Grand Total:</span>
                    <span className="text-2xl text-[#D6A84F] font-heading">₹{totalAmount}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider text-center justify-center mt-4 disabled:opacity-50"
                >
                  {submitting ? 'PROCESSING PAYMENT...' : `PAY ₹${totalAmount} & CONFIRM BOOKING`}
                </button>
              </div>

              <div className="text-[10px] text-gray-500 flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>SSL Encrypted Transaction Guarantee</span>
              </div>
            </div>
          </div>

        </form>

      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
