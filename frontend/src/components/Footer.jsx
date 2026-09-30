import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Sparkles, Phone, Mail, MapPin, Video, Camera, Globe, Share2, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getMediaUrl } from '../utils/formatUrl';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#080808] border-t border-white/10 pt-16 pb-12 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              {settings?.logo_url ? (
                <img 
                  src={getMediaUrl(settings.logo_url)} 
                  alt={settings.site_title || "The JP Yadav Show Logo"} 
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-white font-heading uppercase">
                  {settings?.site_title || "THE JP YADAV SHOW"}
                </span>
              )}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier Bhojpuri comedy &amp; entertainment platform. Bringing high-energy live shows, talent auditions, and digital comedy episodes.
            </p>
            <div className="text-xs text-[#D6A84F] tracking-wide uppercase font-semibold">
              "{settings.hero_tagline || "जहाँ हँसी भी है, हुनर भी है।"}"
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-white transition-colors">The Show &amp; Story</Link></li>
              <li><Link to="/auditions" className="hover:text-white transition-colors">Audition Opportunities</Link></li>
              <li><Link to="/shows" className="hover:text-white transition-colors">Upcoming Live Shows</Link></li>
              <li><Link to="/episodes" className="hover:text-white transition-colors">Episodes &amp; Videos</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo &amp; Media Gallery</Link></li>
            </ul>
          </div>

          {/* User & Ticket Portal */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs">Portal &amp; Support</h3>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="hover:text-white transition-colors">User Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Apply as Talent</Link></li>
              <li><Link to="/dashboard/tickets" className="hover:text-white transition-colors">My Ticket Booking</Link></li>
              <li><Link to="/dashboard/auditions" className="hover:text-white transition-colors">Application Tracker</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Production</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs">Production Office</h3>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#B51D2A] flex-shrink-0" />
              <span>SK Memorial Hall Complex, Patna, Bihar</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#B51D2A] flex-shrink-0" />
              <span>{settings.support_phone || "+91 98765 43210"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#B51D2A] flex-shrink-0" />
              <span>{settings.support_email || "contact@jpyadavshow.com"}</span>
            </div>

            <div className="pt-4 flex items-center gap-3 flex-wrap">
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#B51D2A] hover:text-[#B51D2A] transition-colors" title="YouTube Channel">
                  <Video className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#B51D2A] hover:text-[#B51D2A] transition-colors" title="Instagram Page">
                  <Camera className="w-4 h-4" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#B51D2A] hover:text-[#B51D2A] transition-colors" title="Facebook Page">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#B51D2A] hover:text-[#B51D2A] transition-colors" title="Twitter / X">
                  <Share2 className="w-4 h-4" />
                </a>
              )}
              {settings?.whatsapp_url && (
                <a href={settings.whatsapp_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-green-500 hover:text-green-500 transition-colors" title="WhatsApp Support">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 THE JP YADAV SHOW. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <Link to="/admin" className="text-[#D6A84F] hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;

