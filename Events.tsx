
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

type EventCategory = 'all' | 'seminar' | 'online' | 'popup';

interface ConsularEvent {
  id: number;
  title: string;
  category: Omit<EventCategory, 'all'>;
  date: {
    month: string;
    day: string;
    full: string;
  };
  time: string;
  location: string;
  status: 'hot' | 'new' | 'full';
  color: string;
  categoryLabelKey: string;
}

const Events: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<EventCategory>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mockEvents: ConsularEvent[] = [
    {
      id: 1,
      title: "校園領事保護巡迴展 @澳門大學",
      category: "popup",
      date: { month: "MAR", day: "15", full: "2026-03-15" },
      time: "14:00 - 17:00",
      location: "澳門大學 E4",
      status: "hot",
      color: "border-pink-500/50 text-pink-300",
      categoryLabelKey: "tab_popup"
    },
    {
      id: 2,
      title: "防範電信詐騙線上研討會",
      category: "online",
      date: { month: "MAR", day: "22", full: "2026-03-22" },
      time: "20:00 - 21:30",
      location: "Zoom 直播",
      status: "new",
      color: "border-blue-500/50 text-blue-300",
      categoryLabelKey: "tab_online"
    },
    {
      id: 3,
      title: "暑期交流安全說明會",
      category: "seminar",
      date: { month: "APR", day: "05", full: "2026-04-05" },
      time: "10:30 - 12:00",
      location: "澳門科學館",
      status: "full",
      color: "border-purple-500/50 text-purple-300",
      categoryLabelKey: "tab_seminar"
    },
    {
      id: 4,
      title: "旅行證件問答工作坊",
      category: "popup",
      date: { month: "APR", day: "12", full: "2026-04-12" },
      time: "11:00 - 18:00",
      location: "議事亭前地",
      status: "new",
      color: "border-orange-500/50 text-orange-300",
      categoryLabelKey: "tab_popup"
    }
  ];

  const filteredEvents = activeTab === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === activeTab);

  return (
    <div className="min-h-screen bg-transparent pb-24 font-sans pt-16">
      
      {/* Immersive Hero Section - Glass */}
      <div className="relative py-10 px-6 overflow-hidden bg-transparent border-b border-white/20">
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black italic mb-2 leading-tight drop-shadow-lg text-white">
            {t('events.hero_title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500 text-5xl md:text-6xl mt-1 filter drop-shadow-sm">2026</span>
          </h1>
          <div className="h-2 w-24 bg-brand-red rounded-full mt-4 mx-auto md:mx-0 shadow-[0_0_15px_rgba(204,0,0,0.8)]"></div>
        </div>
      </div>

      {/* Floating Category Filter - iOS 26 Style Glass Pills */}
      <div className="sticky top-[64px] z-30 py-4 overflow-x-auto no-scrollbar pl-4 bg-transparent backdrop-blur-xl mask-gradient-r border-b border-white/10">
        <div className="flex gap-3 pr-4">
          {['all', 'seminar', 'online', 'popup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as EventCategory)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-lg border backdrop-blur-2xl ${
                activeTab === tab 
                  ? 'bg-transparent text-white border-white/60 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                  : 'bg-transparent text-gray-400 border-white/20 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t(`events.tab_${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Feed - Glass Blocks */}
      <div className="px-4 space-y-4 mt-4">
        {filteredEvents.map((event, index) => (
          <div 
            key={event.id}
            className={`group bg-transparent backdrop-blur-md rounded-3xl shadow-lg border border-white/30 overflow-hidden transform transition-all duration-500 hover:border-white/50 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="p-5">
              
              <div className="mb-2 flex items-center gap-2">
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border bg-transparent backdrop-blur-sm ${event.color}`}>
                    {t(`events.${event.categoryLabelKey}`)}
                 </span>
                 {event.status === 'hot' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-transparent text-red-300 border border-red-500/50 animate-pulse">HOT</span>}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white leading-tight mb-4 drop-shadow-md">
                {event.title}
              </h3>

              {/* Details Block - Inner Glass */}
              <div className="bg-transparent rounded-2xl p-4 space-y-3 mb-1 border border-white/20 backdrop-blur-sm">
                 <div className="flex items-start gap-3">
                    <div className="w-6 text-center text-lg leading-none filter drop-shadow-sm">📅</div>
                    <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('events.date')}</div>
                       <div className="text-sm font-bold text-gray-100">{event.date.full}</div>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-6 text-center text-lg leading-none filter drop-shadow-sm">🕒</div>
                    <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('events.time')}</div>
                       <div className="text-sm font-bold text-gray-100">{event.time}</div>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-6 text-center text-lg leading-none filter drop-shadow-sm">📍</div>
                    <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('events.location')}</div>
                       <div className="text-sm font-bold text-gray-100">{event.location}</div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Events;
