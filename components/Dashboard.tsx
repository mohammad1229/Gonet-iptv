
import React from 'react';
import { MediaItem, CategoryType } from '../types';
import { Play, Flame, Star, Radio, TrendingUp, Info, PlayCircle, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  mediaItems: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ mediaItems, onSelectMedia, user }) => {
  const movies = mediaItems.filter(i => i.type === CategoryType.MOVIE);
  const series = mediaItems.filter(i => i.type === CategoryType.SERIES);
  const featured = mediaItems.length > 0 ? mediaItems[0] : null;

  const Section = ({ title, items, color = "blue" }: { title: string, items: MediaItem[], color?: string }) => (
    <div className="space-y-8 px-10 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-10 bg-${color}-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]`}></div>
          <h2 className="text-4xl font-black text-white tracking-tight">{title}</h2>
        </div>
        <button className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-black text-sm uppercase tracking-widest">
          مشاهدة الكل <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </button>
      </div>
      
      <div className="flex gap-8 overflow-x-auto no-scrollbar pb-10 px-2 scroll-smooth">
        {items.length > 0 ? items.map((item) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 w-72 group cursor-pointer"
            onClick={() => onSelectMedia(item)}
          >
            <div className="aspect-[2/3] relative rounded-[45px] overflow-hidden shadow-2xl card-zoom border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-white/5">
              <img src={item.thumbnail} className="w-full h-full object-cover transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute top-6 right-6">
                 <div className="bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-2xl text-[10px] font-black text-white border border-white/10">
                   {item.year || '2025'}
                 </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-blue-600/10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] transform scale-50 group-hover:scale-100 transition-all duration-500">
                  <Play className="text-blue-600 w-10 h-10 fill-current translate-x-1" />
                </div>
              </div>
            </div>
            <div className="mt-6 px-4 space-y-1">
              <h3 className="text-xl font-black truncate text-slate-100 group-hover:text-blue-500 transition-colors">{item.title}</h3>
              <div className="flex items-center gap-3">
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.category}</p>
                 <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                 <p className="text-[10px] font-black text-slate-500 uppercase">4K HDR</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="w-full h-72 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[50px] bg-white/[0.01] text-slate-700">
            <Clock className="mb-4 opacity-10" size={48} />
            <span className="font-black text-sm uppercase tracking-[0.4em]">بانتظار المحتوى</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-48 space-y-24 relative overflow-hidden">
      {/* Dynamic Hero Section */}
      {featured && (
        <div className="relative h-[90vh] w-full overflow-hidden">
           <img src={featured.thumbnail} className="absolute inset-0 w-full h-full object-cover scale-110 blur-[1px] opacity-40 animate-pulse" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#010101]/70 to-[#010101]"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[#010101] via-transparent to-transparent"></div>
           
           <div className="absolute bottom-24 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-12">
              <div className="max-w-5xl space-y-10 animate-in slide-in-from-bottom duration-1000">
                 <div className="flex items-center gap-5">
                    <span className="bg-red-600 px-6 py-2 rounded-full text-[11px] font-black tracking-widest shadow-xl shadow-red-600/20 live-pulse">يُعرض الآن</span>
                    <div className="flex items-center gap-2 text-yellow-400">
                       <Star size={20} fill="currentColor" />
                       <span className="font-black text-lg">9.9</span>
                    </div>
                    <span className="w-px h-6 bg-white/10"></span>
                    <span className="text-slate-400 font-black text-sm">IMDb Rating</span>
                 </div>
                 
                 <h1 className="text-8xl md:text-[10rem] font-black italic tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    GoNet <span className="text-blue-500">PRO</span>
                 </h1>
                 
                 <p className="text-2xl md:text-3xl text-slate-300 font-bold leading-relaxed max-w-3xl pr-8 border-r-8 border-blue-600 shadow-blue-500/10">
                    {featured.title}: النقلة النوعية في عالم الترفيه الرقمي. محتوى عالمي، هوية وطنية، وسرعة فائقة لا تتوقف.
                 </p>

                 <div className="flex gap-6 pt-6">
                    <button 
                      onClick={() => onSelectMedia(featured)}
                      className="btn-pro bg-blue-600 text-white px-14 py-6 rounded-3xl font-black text-2xl flex items-center gap-5 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)]"
                    >
                       <PlayCircle size={32} /> ابدأ المشاهدة
                    </button>
                    <button className="btn-pro bg-white/5 backdrop-blur-2xl text-white border border-white/10 px-12 py-6 rounded-3xl font-black text-2xl flex items-center gap-5 hover:bg-white/10">
                       <Info size={32} /> معلومات إضافية
                    </button>
                 </div>
              </div>

              <div className="hidden xl:grid grid-cols-1 gap-6 pb-8">
                 <div className="glass-pro p-8 rounded-[40px] border-blue-500/20 shadow-blue-500/5">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">الدقة المتوفرة</p>
                    <p className="text-4xl font-black text-white italic">Ultra 4K</p>
                    <div className="h-1 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
                       <div className="h-full bg-blue-500 w-full animate-pulse"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {!featured && (
        <div className="pt-40 text-center space-y-8">
           <h1 className="text-8xl font-black italic text-white animate-pulse">GoNet <span className="text-blue-500">PRO</span></h1>
           <div className="flex justify-center gap-4">
              <span className="h-1 w-20 bg-red-600 rounded-full"></span>
              <span className="h-1 w-20 bg-green-600 rounded-full"></span>
              <span className="h-1 w-20 bg-white rounded-full"></span>
           </div>
           <p className="text-slate-500 font-black tracking-[1em] uppercase text-xs">صمودنا في جودة محتوانا</p>
        </div>
      )}

      <div className="space-y-32">
        <Section title="أحدث الأفلام" items={movies} color="blue" />
        <Section title="المسلسلات الحصرية" items={series} color="green" />
      </div>
      
      {/* Bottom Ambient Lighting */}
      <div className="fixed bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0 opacity-80"></div>
    </div>
  );
};

export default Dashboard;
