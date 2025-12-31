
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import MediaGrid from './components/MediaGrid';
import Player from './components/Player';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import NotificationOverlay from './components/NotificationOverlay';
import { CategoryType, MediaItem, UserAccount, TickerConfig, AppNotification } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserAccount> | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerConfig, setTickerConfig] = useState<TickerConfig>({ text: '', speed: 5, enabled: false, color: 'blue' });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // دعم ريموت كنترول التلفزيون (Arrow Keys & Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // التعامل مع الأزرار الشائعة في ريموت الأندرويد
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        // إذا لم يكن هناك عنصر فوكس حالياً، قم بتركيز أول زر متاح
        if (!document.activeElement || document.activeElement === document.body) {
           const firstBtn = document.querySelector('button, a, input') as HTMLElement;
           firstBtn?.focus();
        }
      }
      
      // التعامل مع زر الرجوع (Back) في الأندرويد
      if (e.key === 'Backspace' || e.key === 'Escape') {
        if (selectedMedia) {
          setSelectedMedia(null);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia]);

  const loadMedia = () => {
    try {
      const savedMedia = localStorage.getItem('gonet_media_items');
      setMediaItems(savedMedia ? JSON.parse(savedMedia) : []);
    } catch (e) { setMediaItems([]); }
  };

  const loadSettings = () => {
    const savedTicker = localStorage.getItem('gonet_ticker');
    if (savedTicker) setTickerConfig(JSON.parse(savedTicker));
    const savedNotifs = localStorage.getItem('gonet_notifications');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  };

  useEffect(() => {
    loadMedia();
    loadSettings();
    const authData = localStorage.getItem('gonet_auth');
    if (authData) {
      try {
        const user = JSON.parse(authData);
        setIsLoggedIn(true);
        setCurrentUser(user);
      } catch (e) { localStorage.removeItem('gonet_auth'); }
    }

    const handleUpdate = () => {
      loadMedia();
      loadSettings();
    };
    window.addEventListener('gonet_data_updated', handleUpdate);
    return () => window.removeEventListener('gonet_data_updated', handleUpdate);
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    const sessionData = { username: user.username, plan: user.plan, expiry: user.expiry };
    localStorage.setItem('gonet_auth', JSON.stringify(sessionData));
    setCurrentUser(sessionData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('gonet_auth');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const filteredMedia = searchQuery 
    ? mediaItems.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : mediaItems;

  if (!isLoggedIn) return <Login onLogin={handleLoginSuccess} />;

  return (
    <Router>
      <div className="flex flex-col h-screen bg-[#030303] text-slate-100 overflow-hidden font-sans">
        <Header user={currentUser} onLogout={handleLogout} onSearch={setSearchQuery} />
        <NewsTicker config={tickerConfig} />
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          <Routes>
            <Route path="/" element={<Dashboard mediaItems={filteredMedia} onSelectMedia={setSelectedMedia} user={currentUser} />} />
            <Route path="/live" element={<MediaGrid items={filteredMedia.filter(i => i.type === CategoryType.LIVE)} type={CategoryType.LIVE} onSelectMedia={setSelectedMedia} />} />
            <Route path="/movies" element={<MediaGrid items={filteredMedia.filter(i => i.type === CategoryType.MOVIE)} type={CategoryType.MOVIE} onSelectMedia={setSelectedMedia} />} />
            <Route path="/series" element={<MediaGrid items={filteredMedia.filter(i => i.type === CategoryType.SERIES)} type={CategoryType.SERIES} onSelectMedia={setSelectedMedia} />} />
            <Route path="/radio" element={<MediaGrid items={filteredMedia.filter(i => i.type === CategoryType.RADIO)} type={CategoryType.RADIO} onSelectMedia={setSelectedMedia} />} />
            <Route path="/admin" element={<AdminPanel onMediaUpdate={loadMedia} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <NotificationOverlay notifications={notifications} />
        </main>
        <BottomNav user={currentUser} onLogout={handleLogout} />
        {selectedMedia && (
          <Player 
            media={selectedMedia} 
            playlist={mediaItems.filter(i => i.type === selectedMedia.type)}
            onClose={() => setSelectedMedia(null)} 
          />
        )}
      </div>
    </Router>
  );
};

export default App;
