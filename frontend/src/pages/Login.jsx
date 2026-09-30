import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { getMediaUrl } from '../utils/formatUrl';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user.role === 'admin' || res.user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@example.com');
    setPassword('password');
  };

  const fillDemoCustomer = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-md mx-auto">
        <div className="cinematic-card p-8 rounded-2xl border border-white/10 shadow-2xl">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              {settings?.logo_url ? (
                <img 
                  src={getMediaUrl(settings.logo_url)} 
                  alt="Logo" 
                  className="h-12 w-auto mx-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-white font-heading uppercase">
                  {settings?.site_title || "THE JP YADAV SHOW"}
                </span>
              )}
            </Link>
            <h1 className="text-2xl font-extrabold font-heading uppercase text-white">ACCOUNT LOGIN</h1>
            <p className="text-xs text-gray-400 mt-1">Sign in to manage tickets, auditions, or administration.</p>
          </div>

          {/* Quick Demo Fill Pill Buttons */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 mb-6 text-center">
            <div className="text-[10px] font-bold text-[#D6A84F] uppercase tracking-wider mb-2">QUICK DEMO CREDENTIALS</div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onClick={fillDemoAdmin}
                className="py-1.5 px-2 rounded bg-black/60 border border-white/10 text-[11px] font-semibold text-gray-300 hover:border-[#B51D2A] hover:text-white transition-colors"
              >
                Fill Admin Login
              </button>
              <button 
                type="button" 
                onClick={fillDemoCustomer}
                className="py-1.5 px-2 rounded bg-black/60 border border-white/10 text-[11px] font-semibold text-gray-300 hover:border-[#D6A84F] hover:text-white transition-colors"
              >
                Fill User Login
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="admin@example.com or demo@example.com" 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-10 pr-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-10 pr-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider text-center justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN NOW'} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
            Don't have an account? <Link to="/register" className="text-[#B51D2A] font-bold hover:underline">Register as Talent / User</Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
