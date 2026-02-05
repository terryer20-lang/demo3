
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
      color: "bg-pink-100 text-pink-700 border-pink-200",
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
      color: "bg-blue-100 text-blue-700 border-blue-200",
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
      color: "bg-purple-100 text-purple-700 border-purple-200",
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
      color: "bg-orange-100 text-orange-700 border-orange-200",
      categoryLabelKey: "tab_popup"
    }
  ];

  const filteredEvents = activeTab === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === activeTab);

  const handleAddToCalendar = () => {
    // Basic ICS generation for all events
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Macau Consular//Events//ZH\n";
    
    mockEvents.forEach(event => {
      // Parse date and time roughly for demo
      const dateParts = event.date.full.split('-');
      const timeParts = event.time.split(' - ')[0].split(':');
      
      const start = `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${timeParts[0]}${timeParts[1]}00`;
      // Assuming 1 hour duration if not parsed fully, but here we just take start
      const end = `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${parseInt(timeParts[0]) + 1}${timeParts[1]}00`;

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DTSTART:${start}\n`;
      icsContent += `DTEND:${end}\n`;
      icsContent += `LOCATION:${event.location}\n`;
      icsContent += `DESCRIPTION:${t('app.title')} - ${event.title}\n`;
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'consular_events.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans pt-16">
      
      {/* Immersive Hero Section */}
      <div className="relative py-10 px-6 overflow-hidden bg-[#CC0000] text-white rounded-b-[3rem] shadow-2xl">
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black italic mb-2 leading-tight drop-shadow-lg">
            {t('events.hero_title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500 text-5xl md:text-6xl mt-1">2026</span>
          </h1>
          <div className="h-2 w-24 bg-brand-red rounded-full mt-4 mx-auto md:mx-0"></div>
        </div>
      </div>

      {/* Floating Category Filter */}
      <div className="sticky top-[64px] z-30 py-4 overflow-x-auto no-scrollbar pl-4 bg-gray-50/95 backdrop-blur-sm mask-gradient-r">
        <div className="flex gap-3 pr-4">
          {['all', 'seminar', 'online', 'popup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as EventCategory)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm border ${
                activeTab === tab 
                  ? 'bg-gray-900 text-white border-gray-900 scale-105' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {t(`events.tab_${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Feed - Block List Style */}
      <div className="px-4 space-y-4 mt-2">
        {filteredEvents.map((event, index) => (
          <div 
            key={event.id}
            className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-md ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="p-5">
              
              {/* Removed tags from top-right as requested */}
              <div className="mb-1"></div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4">
                {event.title}
              </h3>

              {/* Details Block */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-1">
                 <div className="flex items-start gap-3">
                    <div className="w-5 text-center text-lg leading-none">📅</div>
                    <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('events.date')}</div>
                       <div className="text-sm font-medium text-gray-800">{event.date.full}</div>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-5 text-center text-lg leading-none">🕒</div>
                    <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('events.time')}</div>
                       <div className="text-sm font-medium text-gray-800">{event.time}</div>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-5 text-center text-lg leading-none">📍</div>
                    <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('events.location')}</div>
                       <div className="text-sm font-medium text-gray-800">{event.location}</div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (Calendar Sync) */}
      <button 
        onClick={handleAddToCalendar}
        className="fixed bottom-24 right-5 w-12 h-12 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center justify-center text-xl z-20 hover:scale-110 transition-transform text-brand-blue"
        aria-label="Add to Calendar"
      >
        📅
      </button>

    </div>
  );
};

export default Events;
