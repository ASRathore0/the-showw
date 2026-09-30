import React from 'react';
import { Bell, Search, User, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title = 'Operational Dashboard', onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#0F131C] border-b border-[#1E2638] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      
      {/* Title & Mobile Hamburger Menu Toggle */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button 
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#161C2A] transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-sm sm:text-lg font-bold text-white font-heading tracking-wide uppercase truncate max-w-[200px] sm:max-w-none">{title}</h1>
      </div>

      {/* Right Search, Notifications & User Info */}
      <div className="flex items-center gap-6">
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search applicants, shows, bookings..." 
            className="w-64 bg-[#161C2A] border border-[#263148] rounded-lg py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#B51D2A]"
          />
        </div>

        {/* Notifications Icon */}
        <button className="relative text-gray-400 hover:text-white p-2">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#B51D2A] absolute top-1.5 right-1.5" />
        </button>

        {/* Admin Badge */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#1E2638]">
          <div className="w-8 h-8 rounded-full bg-[#B51D2A] text-white flex items-center justify-center font-bold text-xs">
            DP
          </div>
          <div className="hidden sm:block text-xs">
            <div className="font-bold text-white leading-tight">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-[#D6A84F]">ADMIN</div>
          </div>
        </div>

      </div>

    </header>
  );
};

export default AdminHeader;
