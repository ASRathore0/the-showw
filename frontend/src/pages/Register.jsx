import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await register({ name, email, phone, city, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-md mx-auto">
        <div className="cinematic-card p-8 rounded-2xl border border-white/10 shadow-2xl">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold font-heading uppercase text-white">CREATE ACCOUNT</h1>
            <p className="text-xs text-gray-400 mt-1">Register to track audition applications and tickets.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Full Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Amit Kumar" 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+91 98765..." 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="Patna" 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Password *</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider text-center justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER NOW'} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
            Already have an account? <Link to="/login" className="text-[#B51D2A] font-bold hover:underline">Log In</Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
