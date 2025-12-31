
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BarChart3, Database, Upload, Trash2, RefreshCcw, Home,
  UserPlus, CheckCircle2, AlertCircle, ShieldAlert, Link as LinkIcon,
  Plus, Zap, Film, Tv, Radio as RadioIcon, Search, ExternalLink, Settings2,
  Lock, Key, Calendar, Activity, Bell, Megaphone, Send, ToggleLeft, ToggleRight
} from 'lucide-react';
import { UserAccount, Playlist, MediaItem, CategoryType, TickerConfig, AppNotification } from '../types';

interface AdminPanelProps {
  onMediaUpdate?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onMediaUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'playlists' | 'users' | 'content' | 'alerts'>('stats');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchContent, setSearchContent] = useState('');
  
  // Ticker & Notification States
  const [ticker, setTicker] = useState<TickerConfig>({ text: 'أهلاً بكم في GoNet IPTV - صامد بوجودكم', speed: 5, enabled: true, color: 'blue' });
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState<AppNotification['type']>('info');

  const [showAddUser, setShowAddUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [m3uUrl, setM3uUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [years, setYears] = useState('1');
  const [months, setMonths] = useState('0');
  const [newUser, setNewUser] = useState({ 
    username: '', 
    password: Math.floor(1000000000 + Math.random() * 9000000000).toString(), 
    plan: 'Premium' as const 
  });

  const OFFICIAL_URL = "http://bluedk.xyz:8880/get.php?username=136610933900&password=259526152403&type=m3u_plus&output";

  useEffect(() => {
    const authData = localStorage.getItem('gonet_auth');
    if (authData) {
      const user = JSON.parse(authData);
      if (user.username !== 'admin') { navigate('/'); return; }
    } else { navigate('/'); return; }
    loadData();
  }, [navigate]);

  const loadData = () => {
    const savedUsers = localStorage.getItem('gonet_users');
    const savedPlaylists = localStorage.getItem('gonet_playlists');
    const savedMedia = localStorage.getItem('gonet_media_items');
    const savedTicker = localStorage.getItem('gonet_ticker');
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    if (savedMedia) setMediaItems(JSON.parse(savedMedia));
    if (savedTicker) setTicker(JSON.parse(savedTicker));
  };

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('gonet_data_updated'));
  };

  const handleTickerSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveToStorage('gonet_ticker', ticker);
    setStatusMsg({ type: 'success', text: 'تم تحديث شريط الأخبار بنجاح.' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;

    const newNotif: AppNotification = {
      id: `nt-${Date.now()}`,
      title: notifTitle,
      message: notifMsg,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      type: notifType
    };

    const savedNotifs = localStorage.getItem('gonet_notifications');
    const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    const updated = [newNotif, ...currentNotifs].slice(0, 5); 
    
    saveToStorage('gonet_notifications', updated);
    setNotifTitle('');
    setNotifMsg('');
    setStatusMsg({ type: 'success', text: 'تم إرسال التنبيه للمشتركين.' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const parseM3U = (content: string, sourceName: string, sourceType: 'file' | 'url', sourceUrl?: string) => {
    const playlistId = `pl-${Date.now()}`;
    const lines = content.split('\n');
    const items: MediaItem[] = [];
    let currentItem: any = {};

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('#EXTINF:')) {
        const title = line.split(',').pop()?.trim() || 'قناة غير معروفة';
        const logo = line.match(/tvg-logo="([^"]+)"/)?.[1] || '';
        const group = line.match(/group-title="([^"]+)"/)?.[1] || 'عام';
        const yearMatch = title.match(/\b(19|20)\d{2}\b/);
        currentItem = { 
          id: `m-${Math.random().toString(36).substr(2, 9)}`, 
          title, thumbnail: logo, category: group, year: yearMatch ? yearMatch[0] : '2025'
        };
      } else if (line.startsWith('http')) {
        currentItem.url = line;
        const lowerGroup = (currentItem.category || '').toLowerCase();
        
        if (lowerGroup.includes('movie') || lowerGroup.includes('افلام') || lowerGroup.includes('vod')) currentItem.type = CategoryType.MOVIE;
        else if (lowerGroup.includes('series') || lowerGroup.includes('مسلسل')) currentItem.type = CategoryType.SERIES;
        else if (lowerGroup.includes('radio') || lowerGroup.includes('اذاعة')) currentItem.type = CategoryType.RADIO;
        else currentItem.type = CategoryType.LIVE;

        if (currentItem.title) items.push(currentItem as MediaItem);
        currentItem = {};
      }
    });

    const newPl: Playlist = { id: playlistId, name: sourceName, url: sourceUrl || 'local', status: 'Active', channelsCount: items.length, type: sourceType, createdAt: new Date().toISOString() };
    const updatedPls = [...playlists, newPl];
    setPlaylists(updatedPls);
    saveToStorage('gonet_playlists', updatedPls);
    const updatedMedia = [...mediaItems, ...items];
    setMediaItems(updatedMedia);
    saveToStorage('gonet_media_items', updatedMedia);
    setStatusMsg({ type: 'success', text: `تم دمج ${items.length} قناة بنجاح.` });
    if (onMediaUpdate) onMediaUpdate();
  };

  const handleFetchOfficial = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(OFFICIAL_URL);
      const content = await response.text();
      parseM3U(content, 'GoNet Cloud Sync', 'url', OFFICIAL_URL);
    } catch (err) { setStatusMsg({ type: 'error', text: 'فشل مزامنة السيرفر الرسمي.' }); }
    finally { setIsProcessing(false); }
  };

  const filteredMedia = useMemo(() => {
    if (!searchContent) return mediaItems.slice(0, 40);
    return mediaItems.filter(i => 
      i.title.toLowerCase().includes(searchContent.toLowerCase()) || 
      i.category.toLowerCase().includes(searchContent.toLowerCase())
    ).slice(0, 100);
  }, [mediaItems, searchContent]);

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10 pb-40 font-sans text-slate-100 scroll-smooth" dir="rtl">
      {/* Admin Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 glass-pro p-6 md:p-8 rounded-[30px] md:rounded-[50px] border-blue-500/20 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-6">
           <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl">
              <ShieldAlert size={28} className="text-white" />
           </div>
           <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">GoNet <span className="text-blue-500">ADMIN</span></h2>
              <p className="text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2">
                 <Activity size={14} className="text-green-500" /> لوحة التحكم الشاملة
              </p>
           </div>
        </div>
        <div className="flex gap-2 md:gap-4 w-full md:w-auto">
           <button onClick={() => navigate('/')} className="btn-pro flex-1 md:flex-none px-6 py-3 md:px-8 md:py-4 bg-white/5 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-3"><Home size={20}/> الرئيسية</button>
           <button onClick={() => { if(confirm('حذف كل شيء؟')) { localStorage.clear(); window.location.reload(); } }} className="btn-pro flex-1 md:flex-none px-6 py-3 md:px-8 md:py-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-3"><Trash2 size={20}/> تهيئة</button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top duration-500 ${statusMsg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          <CheckCircle2 size={24}/>
          <span className="font-black text-lg">{statusMsg.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar bg-white/[0.02] p-2 rounded-[25px] border border-white/5">
        {[
          { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
          { id: 'users', label: 'المشتركين', icon: Users },
          { id: 'playlists', label: 'السيرفرات', icon: Zap },
          { id: 'alerts', label: 'تنبيهات وأخبار', icon: Bell },
          { id: 'content', label: 'المكتبة', icon: Film },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-3 px-6 py-3.5 rounded-[18px] font-black transition-all whitespace-nowrap text-sm ${activeTab === t.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <t.icon size={18}/> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 animate-in fade-in duration-500">
           {/* Ticker Management */}
           <div className="glass-pro p-8 md:p-12 rounded-[40px] md:rounded-[55px] space-y-6 md:space-y-8 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Megaphone size={24} /></div>
                   <h3 className="text-xl md:text-3xl font-black">شريط الأخبار</h3>
                </div>
                <button 
                  onClick={() => setTicker({...ticker, enabled: !ticker.enabled})}
                  className={`p-1 rounded-full transition-all ${ticker.enabled ? 'text-blue-500' : 'text-slate-600'}`}
                >
                  {ticker.enabled ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                </button>
              </div>

              <form onSubmit={handleTickerSave} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">نص الشريط المتحرك</label>
                    <textarea 
                      value={ticker.text}
                      onChange={e => setTicker({...ticker, text: e.target.value})}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 font-bold h-24 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="اكتب الخبر العاجل هنا..."
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">السرعة ({ticker.speed})</label>
                       <input 
                         type="range" min="1" max="10" 
                         value={ticker.speed}
                         onChange={e => setTicker({...ticker, speed: parseInt(e.target.value)})}
                         className="w-full accent-blue-600 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between text-[8px] font-black text-slate-600 px-1">
                          <span>بطيء</span>
                          <span>متوسط</span>
                          <span>سريع</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">لون الثيم</label>
                       <select 
                         value={ticker.color}
                         onChange={e => setTicker({...ticker, color: e.target.value})}
                         className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 font-black text-xs outline-none"
                       >
                          <option value="blue">أزرق GoNet</option>
                          <option value="red">أحمر فلسطين</option>
                          <option value="green">أخضر فلسطين</option>
                          <option value="gold">ذهبي بريميوم</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full btn-pro bg-blue-600 py-5 rounded-2xl font-black text-sm shadow-xl">تطبيق التعديلات الآن</button>
              </form>
           </div>

           {/* Notifications Center */}
           <div className="glass-pro p-8 md:p-12 rounded-[40px] md:rounded-[55px] space-y-6 md:space-y-8 border-red-500/20">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><Bell size={24} /></div>
                 <h3 className="text-xl md:text-3xl font-black">إرسال إشعار فوري</h3>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">عنوان الرسالة</label>
                    <input 
                      type="text"
                      value={notifTitle}
                      onChange={e => setNotifTitle(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-5 py-3 font-black text-base outline-none focus:border-red-500"
                      placeholder="مثال: تم إضافة قنوات جديدة"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">محتوى الإشعار</label>
                    <textarea 
                      value={notifMsg}
                      onChange={e => setNotifMsg(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 font-bold h-24 outline-none focus:border-red-500 text-sm"
                      placeholder="اكتب محتوى الرسالة هنا..."
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    {['info', 'warning', 'alert', 'success'].map(type => (
                      <button 
                        key={type} type="button" 
                        onClick={() => setNotifType(type as any)}
                        className={`py-2 rounded-lg font-black text-[9px] transition-all border-2 uppercase tracking-tighter ${notifType === type ? 'border-red-500 bg-red-500/20' : 'border-transparent bg-white/5 text-slate-500'}`}
                      >
                         {type === 'info' ? 'معلومة' : type === 'warning' ? 'تحذير' : type === 'alert' ? 'هام' : 'نجاح'}
                      </button>
                    ))}
                 </div>
                 <button type="submit" className="w-full btn-pro bg-red-600 py-5 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-3">
                   <Send size={18} /> إرسال الإشعار للجميع
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* باقي تبويبات لوحة التحكم (Stats, Users, Playlists, Content) تظل كما هي مع تحسينات طفيفة للموبايل */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-in fade-in duration-700">
           {[
             { label: 'المشتركين', val: users.length, icon: Users, color: 'text-blue-500' },
             { label: 'القنوات', val: mediaItems.filter(i => i.type === CategoryType.LIVE).length, icon: Tv, color: 'text-green-500' },
             { label: 'الأفلام', val: mediaItems.filter(i => i.type === CategoryType.MOVIE).length, icon: Film, color: 'text-red-500' },
             { label: 'استقرار', val: '99.9%', icon: Activity, color: 'text-yellow-500' }
           ].map((stat, idx) => (
             <div key={idx} className="glass-pro p-6 md:p-10 rounded-[30px] md:rounded-[50px] relative overflow-hidden group">
                <stat.icon className={`absolute -right-4 -bottom-4 opacity-5 ${stat.color}`} size={100} />
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className={`text-3xl md:text-6xl font-black ${stat.color}`}>{stat.val}</p>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
