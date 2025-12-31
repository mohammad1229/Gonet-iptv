
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Tv, 
  Film, 
  PlaySquare, 
  Radio, 
  LayoutDashboard, 
  Settings, 
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { CategoryType } from '../types';

interface SidebarProps {
  user: any;
  activeCategory: CategoryType;
  onCategoryChange: (cat: CategoryType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeCategory, onCategoryChange, onLogout }) => {
  const isAdmin = user?.username === 'admin';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Tv, label: 'Live TV', path: '/live', type: CategoryType.LIVE },
    { icon: Film, label: 'Movies', path: '/movies', type: CategoryType.MOVIE },
    { icon: PlaySquare, label: 'Series', path: '/series', type: CategoryType.SERIES },
    { icon: Radio, label: 'Radio', path: '/radio', type: CategoryType.RADIO },
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
          <span className="font-bold text-xl italic text-white">G</span>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tighter bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          GoNet IPTV
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={() => item.type && onCategoryChange(item.type)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-1">
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all border border-blue-500/20
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-blue-400 hover:bg-blue-600/10'}
            `}
          >
            <ShieldCheck className="w-6 h-6" />
            <span className="hidden md:block font-bold uppercase text-xs tracking-widest">Control Panel</span>
          </NavLink>
        )}
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
