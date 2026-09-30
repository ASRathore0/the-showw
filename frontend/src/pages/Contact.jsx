import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiClient.post('/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center border-b border-white/10">
        <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-2">
          GET IN TOUCH
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading tracking-tight mb-4">
          CONTACT PRODUCTION TEAM
        </h1>
        <p className="text-gray-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          For show inquiries, press passes, sponsorship opportunities, or audition questions.
        </p>
      </div>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold uppercase font-heading text-white">PRODUCTION HEADQUARTERS</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our production desk handles tour scheduling, talent screening, and ticketing partnerships across India.
            </p>

            <div className="space-y-4 pt-4 text-sm text-gray-300">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <MapPin className="w-5 h-5 text-[#B51D2A] flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Main Office</div>
                  <div className="text-xs text-gray-400 mt-1">SK Memorial Hall Complex, Gandhi Maidan, Patna, Bihar - 800001</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <Phone className="w-5 h-5 text-[#D6A84F] flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Direct Phone Lines</div>
                  <div className="text-xs text-gray-400 mt-1">+91 98765 43210 / +91 91234 56789</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <Mail className="w-5 h-5 text-[#B51D2A] flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">Official Email</div>
                  <div className="text-xs text-gray-400 mt-1">{settings.support_email || "contact@example.com"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="cinematic-card p-8 rounded-2xl border border-white/10">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold font-heading text-white mb-2">Message Sent Successfully</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Thank you for reaching out. Our production coordinator will get back to you within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <h3 className="text-xl font-bold font-heading text-white mb-4">SEND A DIRECT MESSAGE</h3>

                  {errorMsg && <div className="p-3 rounded bg-red-950/60 border border-red-800 text-red-300">{errorMsg}</div>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        placeholder="Amit Kumar" 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="you@example.com" 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                        placeholder="+91 9876543210" 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Subject *</label>
                      <input 
                        type="text" 
                        value={formData.subject} 
                        onChange={e => setFormData({ ...formData, subject: e.target.value })} 
                        placeholder="e.g. Show Booking Inquiry" 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Message *</label>
                    <textarea 
                      rows="5" 
                      value={formData.message} 
                      onChange={e => setFormData({ ...formData, message: e.target.value })} 
                      placeholder="Write your message here..." 
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      required 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider text-center justify-center disabled:opacity-50"
                  >
                    {submitting ? 'SENDING...' : 'SEND MESSAGE'} <Send className="w-4 h-4 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
