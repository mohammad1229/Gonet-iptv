
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, User, Clock, X, LogOut, ShieldCheck, ChevronDown, Activity } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.username === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setShowUserDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-[100] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-[#010101] to-transparent pointer-events-none"></div>
      
      <div className="flex-1 max-w-2xl relative z-10" ref={dropdownRef}>
        <div className="relative group">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-all" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="ابحث عن الأفلام، القنوات، أو المسلسلات..." 
            className="w-full bg-white/5 border border-white/5 rounded-[24px] py-4 pr-14 pl-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/80 backdrop-blur-xl transition-all font-bold placeholder:text-slate-600"
            dir="rtl"
          />
          {searchQuery && (
            <button onClick={() => handleSearchChange('')} className="absolute left-5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="hidden md:flex items-center gap-3 glass-v3 px-5 py-2.5 rounded-full border-blue-500/20 shadow-lg shadow-blue-500/5">
           <Activity size={16} className="text-blue-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Server Status: Online</span>
        </div>

        <div className="relative" ref={userDropdownRef}>
          <button 
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-4 p-1.5 pr-5 bg-white/5 hover:bg-white/10 rounded-[20px] border border-white/5 transition-all group"
          >
            <div className="text-left hidden sm:block">
              <p className="text-sm font-black text-slate-200 group-hover:text-blue-500 transition-colors">{user?.username}</p>
              <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{user?.plan || 'PRO USER'}</p>
            </div>
            <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute top-full left-0 mt-4 w-64 bg-[#0a0a0a] border border-white/10 rounded-[30px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4" dir="rtl">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">معلومات الحساب</p>
                <p className="text-sm font-black text-white">{user?.username}</p>
              </div>
              <div className="p-2 space-y-1">
                {isAdmin && (
                  <NavLink to="/admin" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-4 px-4 py-4 text-blue-500 hover:bg-blue-600 hover:text-white rounded-2xl transition-all font-black">
                    <ShieldCheck size={20} /> لوحة التحكم
                  </NavLink>
                )}
                <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all font-black">
                  <LogOut size={20} /> تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
