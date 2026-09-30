import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Ticket, 
  Mic, 
  Video, 
  Image, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { getMediaUrl } from '../../utils/formatUrl';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { settings } = useSettings();

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Applicants & Auditions', path: '/admin/applicants', icon: Users },
    { label: 'Show & Venue CMS', path: '/admin/shows', icon: Calendar },
    { label: 'Ticket Bookings', path: '/admin/bookings', icon: Ticket },
    { label: 'Registered Customers', path: '/admin/customers', icon: FileSpreadsheet },
    { label: 'Performer Roster', path: '/admin/performers', icon: Mic },
    { label: 'Episodes CMS', path: '/admin/episodes', icon: Video },
    { label: 'Gallery CMS', path: '/admin/gallery', icon: Image },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        />
      )}

      <aside className={`fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-30 w-64 bg-[#0F131C] border-r border-[#1E2638] flex flex-col justify-between h-screen text-gray-300 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        <div className="overflow-y-auto">
          {/* Admin Header Branding */}
          <div className="p-5 border-b border-[#1E2638] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img 
                  src={getMediaUrl(settings.logo_url)} 
                  alt="Logo" 
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-[#B51D2A] text-white flex items-center justify-center font-bold text-xs">
                  JP
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white tracking-wider uppercase font-heading">OPERATIONS SAAS</div>
                <div className="text-[10px] text-[#D6A84F] font-semibold">ADMIN PORTAL</div>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button 
                type="button" 
                onClick={onClose}
                className="md:hidden text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 text-xs font-medium">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (onClose) onClose(); }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#B51D2A] text-white font-bold shadow-md shadow-[#B51D2A]/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#1E2638]">
        <Link to="/" className="text-xs text-gray-400 hover:text-white block mb-3 text-center">
          &larr; View Public Website
        </Link>
        <button 
          onClick={logout} 
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Sign Out Admin
        </button>
      </div>

    </aside>
  </>
  );
};

export default AdminSidebar;
