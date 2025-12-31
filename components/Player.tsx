
import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Search, Layout, Maximize, Volume2, Plus, Minus, Volume1, VolumeX, AlertCircle, Settings, Check, Clock } from 'lucide-react';
import { MediaItem, CategoryType } from '../types';

interface PlayerProps {
  media: MediaItem;
  playlist: MediaItem[];
  onClose: () => void;
}

const Player: React.FC<PlayerProps> = ({ media, playlist, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(media.category);
  const [activeMedia, setActiveMedia] = useState<MediaItem>(media);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Fix: Replaced NodeJS.Timeout with any to avoid "Cannot find namespace 'NodeJS'" error in the browser environment.
  const overlayTimerRef = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    resetOverlayTimer();
    return () => {
      clearInterval(timer);
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, [activeMedia]);

  const resetOverlayTimer = () => {
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    setShowOverlay(true);
    overlayTimerRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 5000);
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  const handleVolumeUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVolume(prev => Math.min(prev + 0.1, 1));
    resetOverlayTimer();
  };

  const handleVolumeDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVolume(prev => Math.max(prev - 0.1, 0));
    resetOverlayTimer();
  };

  const categories = Array.from(new Set(playlist.map(i => i.category)));
  const channelsInCategory = playlist.filter(i => i.category === selectedCategory);

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} className="text-red-500" />;
    if (volume < 0.5) return <Volume1 size={20} className="text-blue-400" />;
    return <Volume2 size={20} className="text-blue-400" />;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300 select-none overflow-hidden" onMouseMove={resetOverlayTimer}>
      <div className="relative w-full h-full flex items-center justify-center">
        <video 
          ref={videoRef}
          autoPlay 
          controls={false}
          src={activeMedia.url} 
          onError={() => setError(true)}
          className="w-full h-full object-contain"
          onClick={() => setShowOverlay(!showOverlay)}
        />
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-20 text-center p-8">
            <AlertCircle size={80} className="text-red-600 mb-6 animate-pulse" />
            <h3 className="text-3xl font-black text-white mb-3">خطأ في جلب البث</h3>
            <p className="text-slate-400 max-w-md text-lg leading-relaxed">السيرفر لا يستجيب حالياً أو أن رابط البث غير متاح. يرجى اختيار قناة أخرى أو المحاولة لاحقاً.</p>
            <button onClick={() => {setError(false); videoRef.current?.load();}} className="mt-8 px-10 py-4 bg-blue-600 text-white font-black rounded-[28px] flex items-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30">
              <RefreshCw size={24} /> إعادة تحميل القناة
            </button>
          </div>
        )}
      </div>

      {showOverlay && (
        <div className="absolute inset-0 flex flex-col pointer-events-none" dir="rtl">
          {/* Top Bar */}
          <div className="p-8 flex justify-between items-start pointer-events-auto">
             <div className="glass-v3 p-4 rounded-[24px] flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic shadow-lg">G</div>
                <div>
                   <p className="text-xs font-black text-blue-500 uppercase tracking-widest">GoNet IPTV Player</p>
                   <p className="text-sm font-bold text-slate-400 truncate max-w-[200px]">{activeMedia.title}</p>
                </div>
             </div>
             <button onClick={onClose} className="p-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-[24px] transition-all border border-red-500/30 backdrop-blur-xl">
               <X size={28} />
             </button>
          </div>

          {/* Left Menu (Categories & Channels) */}
          <div className="flex-1 flex pointer-events-none overflow-hidden">
             <div className="w-80 glass-v3 m-8 rounded-[40px] pointer-events-auto overflow-hidden flex flex-col border border-white/10 shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                   <Layout size={20} className="text-blue-500" />
                   <h4 className="font-black text-lg">دليل المحتوى</h4>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
                   {categories.map(cat => (
                      <div key={cat}>
                         <button 
                           onClick={() => setSelectedCategory(cat)} 
                           className={`w-full flex items-center justify-between px-5 py-4 rounded-[22px] font-black text-sm transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                         >
                            <span className="truncate">{cat}</span>
                            <span className="text-[10px] opacity-40">{playlist.filter(i => i.category === cat).length}</span>
                         </button>
                         {selectedCategory === cat && (
                            <div className="mt-1 mb-3 space-y-0.5 animate-in slide-in-from-top-2">
                               {channelsInCategory.map((chan, idx) => (
                                  <button 
                                    key={chan.id} 
                                    onClick={() => { setActiveMedia(chan); setError(false); }}
                                    className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all ${activeMedia.id === chan.id ? 'bg-white/10 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'}`}
                                  >
                                     <span className="text-[9px] font-mono opacity-40">{idx + 1}</span>
                                     <span className="text-xs font-bold truncate">{chan.title}</span>
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             {/* Right Controls */}
             <div className="mr-auto mt-8 flex flex-col gap-4 px-8 pointer-events-auto">
                <div className="bg-black/60 backdrop-blur-xl p-3 rounded-[32px] border border-white/10 flex flex-col items-center gap-4 shadow-2xl">
                   <button onClick={handleVolumeUp} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 active:scale-90 transition-all"><Plus /></button>
                   <div className="flex flex-col items-center gap-1">
                      <VolumeIcon />
                      <span className="text-[10px] font-black text-blue-500">{Math.round(volume * 100)}%</span>
                   </div>
                   <button onClick={handleVolumeDown} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 active:scale-90 transition-all"><Minus /></button>
                </div>
                
                <button onClick={() => videoRef.current?.requestFullscreen()} className="w-14 h-14 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all shadow-2xl">
                   <Maximize size={24} />
                </button>
                <button onClick={() => window.location.reload()} className="w-14 h-14 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all shadow-2xl">
                   <RefreshCw size={24} />
                </button>
             </div>
          </div>

          {/* Bottom Bar (Information) */}
          <div className="h-44 bg-gradient-to-t from-black via-black/90 to-transparent p-10 flex items-center justify-between pointer-events-auto">
             <div className="flex items-center gap-8">
                <div className="w-32 h-20 bg-blue-600/20 backdrop-blur-md rounded-[28px] border border-white/10 flex items-center justify-center p-3 shadow-2xl overflow-hidden">
                   <img src={activeMedia.thumbnail} className="max-h-full max-w-full object-contain" alt="" />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-4">
                      <h2 className="text-4xl font-black text-white">{activeMedia.title}</h2>
                      <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-lg shadow-xl ring-1 ring-white/20">FULL HD 1080p</span>
                   </div>
                   <div className="flex items-center gap-4 text-slate-400">
                      <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-2"><Layout size={14} className="text-blue-500" /> {selectedCategory}</p>
                      <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                      <p className="text-sm font-bold flex items-center gap-2"><Settings size={14} className="text-blue-500" /> 4.5 Mbps Bitrate</p>
                   </div>
                </div>
             </div>
             
             <div className="text-left space-y-1">
                <div className="flex items-center gap-3 text-4xl font-black text-white font-mono">
                   <Clock className="text-blue-500" size={28} />
                   {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-[0.4em] mr-10">GoNet RealTime</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
