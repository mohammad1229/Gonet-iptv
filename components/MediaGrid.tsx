
import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Tv, 
  Search, 
  Filter, 
  ChevronRight, 
  LayoutGrid, 
  List as ListIcon, 
  ChevronLeft, 
  Menu,
  Globe,
  Clapperboard,
  Gamepad2,
  Bookmark
} from 'lucide-react';
import { CategoryType, MediaItem } from '../types';

interface MediaGridProps {
  type: CategoryType;
  items: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ type, items, onSelectMedia }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // تعبير نمطي للتعرف على الرموز التعبيرية للأعلام (الدول)
  const countryEmojiRegex = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/;

  // استخراج وتقسيم التصنيفات إلى دول وفئات عامة
  const sidebarData = useMemo(() => {
    const countries = new Set<string>();
    const genres = new Set<string>();
    
    items.forEach(item => {
      if (item.category) {
        if (countryEmojiRegex.test(item.category)) {
          countries.add(item.category);
        } else if (item.category !== 'General') {
          genres.add(item.category);
        }
      }
    });

    return {
      countries: Array.from(countries).sort(),
      genres: Array.from(genres).sort()
    };
  }, [items]);

  // تصفية القنوات بناءً على المجموعة المختارة والبحث
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesGroup = selectedGroup === 'All' || item.category === selectedGroup;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [items, selectedGroup, searchQuery]);

  // Fix: Explicitly type SidebarItem as React.FC to resolve JSX 'key' prop assignment errors
  const SidebarItem: React.FC<{ group: string, icon?: any }> = ({ group, icon: Icon }) => (
    <button
      onClick={() => setSelectedGroup(group)}
      className={`
        w-full flex items-center rounded-xl text-sm font-bold transition-all group relative
        ${isSidebarCollapsed ? 'justify-center py-3' : 'justify-between px-4 py-3'}
        ${selectedGroup === group 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
      `}
      title={group === 'All' ? 'الكل' : group}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {Icon ? <Icon size={16} className={selectedGroup === group ? 'text-white' : 'text-blue-500'} /> : (
          <div className={`w-2 h-2 rounded-full shrink-0 ${selectedGroup === group ? 'bg-white' : 'bg-slate-700 group-hover:bg-blue-400'}`}></div>
        )}
        {!isSidebarCollapsed && <span className="truncate whitespace-nowrap">{group === 'All' ? 'الكل' : group}</span>}
      </div>
      
      {!isSidebarCollapsed && (
        <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black transition-colors ${selectedGroup === group ? 'bg-white/20' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
          {items.filter(i => i.category === group || (group === 'All')).length}
        </span>
      )}

      {isSidebarCollapsed && selectedGroup === group && (
         <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full space-y-4 p-6 animate-in fade-in duration-500 overflow-hidden" dir="rtl">
      {/* Header - Receiver UI Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
          >
            <Menu size={24} />
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            {type === CategoryType.LIVE ? <Tv className="text-white w-5 h-5" /> : <Clapperboard className="text-white w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              {type === CategoryType.LIVE ? 'القنوات المباشرة' : type === CategoryType.MOVIE ? 'مكتبة الأفلام' : 'المسلسلات الحصرية'}
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{filteredItems.length} عنصر متوفر</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
            <input 
              type="text"
              placeholder="ابحث عن اسم القناة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64 transition-all"
            />
          </div>
          <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside 
          className={`
            flex flex-col bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-16' : 'w-72'}
          `}
        >
          <div className={`p-4 border-b border-slate-800 bg-slate-900/50 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Filter size={12} className="text-blue-500" />
                تصفح المحتوى
              </p>
            )}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-slate-500 hover:text-white transition-colors">
              {isSidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-6">
            {/* General Filter */}
            <div className="space-y-1">
              <SidebarItem group="All" icon={Bookmark} />
            </div>

            {/* Countries Section */}
            {sidebarData.countries.length > 0 && (
              <div className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-4 py-2 flex items-center gap-2">
                    <Globe size={12} className="text-slate-600" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">مجموعات الدول</span>
                  </div>
                )}
                {sidebarData.countries.map(country => (
                  <SidebarItem key={country} group={country} />
                ))}
              </div>
            )}

            {/* Categories Section */}
            {sidebarData.genres.length > 0 && (
              <div className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-4 py-2 flex items-center gap-2">
                    <Gamepad2 size={12} className="text-slate-600" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">الأصناف والأنواع</span>
                  </div>
                )}
                {sidebarData.genres.map(genre => (
                  <SidebarItem key={genre} group={genre} />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Media Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {filteredItems.length > 0 ? (
            viewMode === 'grid' ? (
              <div className={`grid gap-5 ${type === CategoryType.LIVE ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'}`}>
                {filteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-900/20"
                    onClick={() => onSelectMedia(item)}
                  >
                    <div className={`relative overflow-hidden ${type === CategoryType.LIVE ? 'aspect-video' : 'aspect-[2/3]'}`}>
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                      
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                          <Play className="w-7 h-7 text-blue-600 fill-current translate-x-[-2px]" />
                        </div>
                      </div>

                      {type === CategoryType.LIVE && (
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-lg flex items-center gap-2 shadow-xl ring-1 ring-white/20">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            بث مباشر
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                         <span className="text-[10px] text-blue-500 font-black uppercase tracking-wider">{item.category}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-100 truncate group-hover:text-blue-400 transition-colors leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View Mode
              <div className="space-y-3">
                {filteredItems.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectMedia(item)}
                    className="flex items-center gap-5 p-3 bg-slate-900/40 hover:bg-blue-600/10 border border-slate-800 hover:border-blue-500/30 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="text-[11px] font-black text-slate-600 w-10 text-center">{(idx + 1).toString().padStart(3, '0')}</div>
                    <div className="w-24 aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black flex-shrink-0 relative">
                      <img src={item.thumbnail} alt="" className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm text-slate-100 group-hover:text-blue-400 transition-colors truncate">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 font-bold mt-0.5">{item.category}</p>
                    </div>
                    <div className="px-6">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-lg group-hover:scale-110">
                        <Play className="w-4 h-4 text-slate-400 group-hover:text-white fill-current" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-slate-600 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[40px] animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-slate-900 rounded-[30px] flex items-center justify-center mb-6 border border-slate-800 shadow-2xl">
                <Globe size={40} className="opacity-20 text-blue-500 animate-pulse" />
              </div>
              <p className="font-black text-2xl text-slate-400">لا توجد نتائج مطابقة</p>
              <p className="text-sm mt-3 font-bold text-slate-500 text-center max-w-xs leading-relaxed">يرجى التأكد من كتابة الاسم بشكل صحيح أو اختيار دولة أخرى من القائمة الجانبية.</p>
              <button 
                onClick={() => {setSelectedGroup('All'); setSearchQuery('');}}
                className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl"
              >
                إظهار كافة القنوات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGrid;
