import React from 'react';
import { Bell, Search, User, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title = 'Operational Dashboard', onMenuToggle }) => {
  const { user } = useAuth();
  
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <header className="h-14 sm:h-16 bg-[#0F131C] border-b border-[#1E2638] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 gap-2">
      
      {/* Left: Title & Mobile Hamburger Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-2">
        {onMenuToggle && (
          <button 
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#161C2A] transition-colors flex-shrink-0"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xs sm:text-base font-bold text-white font-heading tracking-wide uppercase truncate">
          {title}
        </h1>
      </div>

      {/* Right: Search, Notifications & User Info */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search CMS, shows, bookings..." 
            className="w-48 lg:w-60 bg-[#161C2A] border border-[#263148] rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-[#B51D2A]"
          />
        </div>

        {/* Notifications Icon */}
        <button 
          type="button" 
          className="relative text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#161C2A] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="w-2 h-2 rounded-full bg-[#B51D2A] absolute top-1 right-1" />
        </button>

        {/* Admin User Badge */}
        <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-[#1E2638]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#B51D2A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
            {userInitials}
          </div>
          <div className="hidden sm:block text-xs">
            <div className="font-bold text-white leading-tight truncate max-w-[120px]">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-[#D6A84F] font-semibold">ADMIN</div>
          </div>
        </div>

      </div>

    </header>
  );
};

export default AdminHeader;
