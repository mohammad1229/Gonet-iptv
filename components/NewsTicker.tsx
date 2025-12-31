
import React from 'react';
import { Megaphone } from 'lucide-react';
import { TickerConfig } from '../types';

interface NewsTickerProps {
  config: TickerConfig;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ config }) => {
  if (!config.enabled || !config.text) return null;

  // السرعة 1 (بطيء) = 60 ثانية للدورة
  // السرعة 10 (سريع) = 5 ثواني للدورة
  const duration = Math.max(5, 65 - (config.speed * 6));

  const colors: Record<string, string> = {
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/5 shadow-[0_0_20px_rgba(37,99,235,0.1)]',
    red: 'border-red-500/30 text-red-400 bg-red-500/5 shadow-[0_0_20px_rgba(238,45,35,0.1)]',
    green: 'border-green-500/30 text-green-400 bg-green-500/5 shadow-[0_0_20px_rgba(0,151,54,0.1)]',
    gold: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.1)]',
  };

  return (
    <div className={`h-12 w-full flex items-center overflow-hidden border-y backdrop-blur-xl relative z-[80] transition-colors duration-500 ${colors[config.color] || colors.blue}`} dir="rtl">
      <div className="flex items-center gap-3 px-6 h-full bg-black/80 z-20 border-l border-white/5 relative">
        <Megaphone size={16} className="animate-bounce" />
        <span className="font-black text-[10px] uppercase tracking-widest whitespace-nowrap">عاجل GONET</span>
      </div>
      
      <div className="flex-1 relative overflow-hidden h-full flex items-center">
        <div 
          className="absolute whitespace-nowrap font-black text-sm tracking-wide"
          style={{
            animation: `tickerMove ${duration}s linear infinite`,
            right: '0'
          }}
        >
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="px-12">{config.text}</span>
              <span className="px-4 opacity-30 text-white">★</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
