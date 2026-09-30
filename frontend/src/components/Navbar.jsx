import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ticket, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { getMediaUrl } from '../utils/formatUrl';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/10 py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={getMediaUrl(settings.logo_url, "/assets/images/jp-yadav-show-logo.png")} 
            alt={settings.site_title || "The JP Yadav Show Logo"} 
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = '/assets/images/jp-yadav-show-logo.png'; 
            }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link to="/" className={`transition-colors hover:text-[#B51D2A] ${location.pathname === '/' ? 'text-[#B51D2A] font-semibold' : 'text-gray-300'}`}>Home</Link>
          <Link to="/about" className={`transition-colors hover:text-[#B51D2A] ${location.pathname === '/about' ? 'text-[#B51D2A] font-semibold' : 'text-gray-300'}`}>The Show</Link>
          <Link to="/auditions" className={`transition-colors hover:text-[#B51D2A] ${location.pathname.startsWith('/auditions') ? 'text-[#B51D2A] font-semibold' : 'text-gray-300'}`}>Auditions</Link>
          <Link to="/shows" className={`transition-colors hover:text-[#B51D2A] ${location.pathname.startsWith('/shows') ? 'text-[#B51D2A] font-semibold' : 'text-gray-300'}`}>Live Shows</Link>
          <Link to="/episodes" className={`transition-colors hover:text-[#B51D2A] ${location.pathname.startsWith('/episodes') ? 'text-[#B51D2A] font-semibold' : 'text-gray-300'}`}>Episodes</Link>
          <Link to="/gallery" className={`transition-colors hover:text-[#B51D2A] ${location.pathname === '/gallery' ? 'text-[#B51D2A] font-semibold' : 'text-gray-300'}`}>Gallery</Link>
        </div>

        {/* Right CTA / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/shows" 
            className="btn-primary py-2 px-4 text-sm"
          >
            <Ticket className="w-4 h-4" />
            Book Tickets
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                to={isAdmin ? "/admin" : "/dashboard"} 
                className="btn-outline py-2 px-4 text-sm border-white/20 bg-white/5 hover:bg-white/10"
              >
                {isAdmin ? <LayoutDashboard className="w-4 h-4 text-[#D6A84F]" /> : <UserIcon className="w-4 h-4 text-[#B51D2A]" />}
                {isAdmin ? 'Admin Dashboard' : 'My Account'}
              </Link>
              <button 
                onClick={logout} 
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-sm font-medium text-white hover:text-[#B51D2A] px-3 py-2 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          <Link to="/" className="text-lg font-medium text-white hover:text-[#B51D2A]">Home</Link>
          <Link to="/about" className="text-lg font-medium text-white hover:text-[#B51D2A]">The Show</Link>
          <Link to="/auditions" className="text-lg font-medium text-white hover:text-[#B51D2A]">Auditions</Link>
          <Link to="/shows" className="text-lg font-medium text-white hover:text-[#B51D2A]">Live Shows</Link>
          <Link to="/episodes" className="text-lg font-medium text-white hover:text-[#B51D2A]">Episodes</Link>
          <Link to="/gallery" className="text-lg font-medium text-white hover:text-[#B51D2A]">Gallery</Link>
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link to="/shows" className="btn-primary w-full text-center">
              <Ticket className="w-4 h-4" /> Book Live Tickets
            </Link>
            {user ? (
              <div className="flex flex-col gap-2">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="btn-outline w-full text-center">
                  {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
                <button onClick={logout} className="text-center text-sm text-red-400 py-2">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-outline w-full text-center">
                User / Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
