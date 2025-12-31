
import React, { useState, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationOverlayProps {
  notifications: AppNotification[];
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ notifications }) => {
  const [visibleNotifs, setVisibleNotifs] = useState<AppNotification[]>([]);

  useEffect(() => {
    // عرض أحدث تنبيه فقط إذا كان جديداً (تم إضافته في آخر 10 ثواني مثلاً)
    if (notifications.length > 0) {
      setVisibleNotifs(notifications.slice(0, 1));
      
      const timer = setTimeout(() => {
        setVisibleNotifs([]);
      }, 10000); // إخفاء التنبيه بعد 10 ثواني

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (visibleNotifs.length === 0) return null;

  const config = {
    info: { icon: Info, color: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
    warning: { icon: AlertTriangle, color: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    alert: { icon: AlertCircle, color: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-500' },
    success: { icon: CheckCircle, color: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-500' },
  };

  return (
    <div className="fixed top-32 right-10 z-[100] w-96 space-y-4 pointer-events-none" dir="rtl">
      {visibleNotifs.map(n => {
        const c = config[n.type] || config.info;
        return (
          <div 
            key={n.id} 
            className={`pointer-events-auto glass-pro p-6 rounded-[35px] border-l-8 ${c.color} ${c.bg} shadow-2xl animate-in slide-in-from-right duration-500 relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setVisibleNotifs([])} className="text-slate-500 hover:text-white"><X size={16}/></button>
            </div>
            <div className="flex gap-4">
               <div className={`p-3 rounded-2xl bg-white/5 ${c.text}`}>
                  <c.icon size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-lg text-white mb-1">{n.title}</h4>
                  <p className="text-sm font-bold text-slate-300 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] font-black text-slate-600 mt-3 uppercase tracking-widest">{n.timestamp}</p>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationOverlay;
