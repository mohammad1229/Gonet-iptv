
export enum CategoryType {
  LIVE = 'LIVE',
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
  RADIO = 'RADIO'
}

export interface MediaItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  category: string;
  type: CategoryType;
  rating?: number;
  year?: string;
  description?: string;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  status: 'Active' | 'Offline';
  channelsCount: number;
  type: 'url' | 'file';
  createdAt: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string; // كود التفعيل المكون من 10 أرقام
  expiry: string;
  plan: 'Basic' | 'Premium' | 'Gold' | 'Trial';
  status: 'Active' | 'Expired' | 'Disabled';
  createdAt: string;
}

export interface TickerConfig {
  text: string;
  speed: number; // 1 (بطيء) إلى 10 (سريع)
  enabled: boolean;
  color: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export interface AppState {
  isLoggedIn: boolean;
  user: Partial<UserAccount> | null;
  currentView: 'dashboard' | 'player' | 'admin' | 'settings';
  selectedMedia: MediaItem | null;
  searchQuery: string;
}
