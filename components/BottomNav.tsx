
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Tv, Film, PlaySquare, LogOut, ShieldCheck, Heart, Radio, MapPin, Compass } from 'lucide-react';

interface BottomNavProps {
  user: any;
  onLogout: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const isAdmin = user?.username === 'admin';

  const NavItem = ({ to, icon: Icon, label, color = "blue" }: any) => (
    <NavLink 
      to={to} 
      className={({isActive}) => `
        flex flex-col items-center gap-3 transition-all duration-500 group px-8 py-3 rounded-[28px] relative
        ${isActive ? 'text-white scale-110' : 'text-slate-600 hover:text-white'}
      `}
    >
      <Icon size={32} className="group-hover:rotate-12 transition-transform duration-500" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      {({isActive}) => isActive && (
        <div className={`absolute -bottom-2 w-8 h-1 bg-${color}-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.8)]`}></div>
      )}
    </NavLink>
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] flex flex-col items-center gap-6 pb-12 px-10">
      {/* Dynamic Navigation Bar */}
      <div className="glass-v3 py-4 px-10 rounded-[45px] flex items-center gap-4 md:gap-12 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] transition-all">
        
        <NavItem to="/live" icon={Tv} label="بث مباشر" color="red" />
        <NavItem to="/movies" icon={Film} label="الأفلام" color="green" />
        
        {/* Main Logo Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[30px] flex items-center justify-center shadow-2xl shadow-blue-600/30 transform hover:scale-110 active:scale-95 transition-all border-2 border-white/20 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <span className="text-white font-black text-3xl italic relative z-10">G</span>
        </button>

        <NavItem to="/series" icon={PlaySquare} label="مسلسلات" color="yellow" />
        <NavItem to="/radio" icon={Radio} label="إذاعات" color="blue" />
      </div>

      {/* Info Status Bar */}
      <div className="flex items-center gap-10 bg-white/[0.03] backdrop-blur-3xl px-12 py-4 rounded-full border border-white/5 shadow-inner">
         <div className="flex items-center gap-4">
            <MapPin size={18} className="text-[#EE2D23] animate-bounce" />
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
               صنع بكل فخر في <span className="text-white">فلسطين</span>
            </p>
         </div>
         <div className="w-px h-4 bg-white/10"></div>
         <div className="flex items-center gap-4">
            <Heart size={18} className="text-[#009736] animate-pulse" />
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
               نهاية الاشتراك: <span className="text-blue-500 font-mono">{user?.expiry}</span>
            </p>
         </div>
         <div className="w-px h-4 bg-white/10"></div>
         <button onClick={onLogout} className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-colors">
            <LogOut size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">خروج</span>
         </button>
      </div>
    </div>
  );
};

export default BottomNav;
