
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';

type Category = 'all' | 'alert' | 'news' | 'activity';

interface Notification {
  id: string;
  category: Exclude<Category, 'all'>;
  date: string; // YYYY-MM-DD
  titleKey: string;
  descKey: string;
  readTime: string;
}

const PastNotifications: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const notifications: Notification[] = [
    { id: '1', category: 'activity', date: '2026-03-02', titleKey: 'item_1_title', descKey: 'item_1_desc', readTime: '1 min' },
    { id: '2', category: 'alert', date: '2026-03-02', titleKey: 'item_2_title', descKey: 'item_2_desc', readTime: '1 min' },
    { id: '3', category: 'alert', date: '2026-02-25', titleKey: 'item_3_title', descKey: 'item_3_desc', readTime: '1 min' },
    { id: '4', category: 'news', date: '2026-02-02', titleKey: 'item_4_title', descKey: 'item_4_desc', readTime: '1 min' },
  ];

  // Filter Logic
  const filteredData = useMemo(() => {
    return notifications.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = t(`notifications_page.${item.titleKey}`).toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t(`notifications_page.${item.descKey}`).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);

  // Heatmap Data Calculation Removed

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'alert': return 'bg-red-100 text-red-600 border-red-200';
      case 'news': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'activity': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'alert': return '🚨';
      case 'news': return '📰';
      case 'activity': return '🎉';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* Hero Section: Data Dashboard Style */}
      <div className="relative pt-28 pb-10 px-6 bg-slate-900 text-white rounded-b-[2.5rem] shadow-2xl overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full filter blur-[80px] opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full filter blur-[80px] opacity-20 -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-6">{t('notifications_page.hero_title')}</h1>
          {/* Subtitle removed */}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
             <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/5 text-center">
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-[10px] text-gray-400">{t('notifications_page.stats_total')}</div>
             </div>
             <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/5 text-center">
                <div className="text-2xl font-bold text-red-400">{notifications.filter(n => n.category === 'alert').length}</div>
                <div className="text-[10px] text-gray-400">{t('notifications_page.stats_alerts')}</div>
             </div>
             <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/5 text-center">
                <div className="text-2xl font-bold text-purple-400">{notifications.filter(n => n.category === 'activity').length}</div>
                <div className="text-[10px] text-gray-400">{t('notifications_page.stats_activities')}</div>
             </div>
          </div>

          {/* Activity Heatmap REMOVED */}
        </div>
      </div>

      {/* Sticky Search & Filter */}
      <div className="sticky top-[60px] z-30 bg-gray-50/95 backdrop-blur-sm py-4">
         <div className="px-4 mb-3">
            <div className="relative">
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('notifications_page.search_placeholder')}
                  className="w-full bg-white border border-gray-200 rounded-full py-3 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
               />
               <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
            </div>
         </div>
         
         <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar mask-gradient-r">
            {['all', 'alert', 'news', 'activity'].map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                     activeCategory === cat 
                     ? 'bg-gray-800 text-white border-gray-800' 
                     : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
               >
                  {t(`notifications_page.filter_${cat}`)}
               </button>
            ))}
         </div>
      </div>

      {/* Timeline Layout */}
      <div className="px-4 mt-2">
         {filteredData.length > 0 ? (
            <div className="space-y-6 relative pl-4">
               {/* Timeline Line */}
               <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gray-200"></div>

               {filteredData.map((item, index) => (
                  <div 
                     key={item.id} 
                     className="relative pl-6 animate-slide-up"
                     style={{ animationDelay: `${index * 100}ms` }}
                  >
                     {/* Timeline Dot */}
                     <div className="absolute left-[10.5px] top-6 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-10"></div>
                     
                     <div 
                        onClick={() => navigate(`/notification/${item.id}`)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all hover:shadow-md cursor-pointer group"
                     >
                        {/* Header: Date & Tag */}
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-xs text-gray-400 font-mono mt-1">{item.date}</div>
                           <div className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getCategoryColor(item.category)}`}>
                              {getCategoryIcon(item.category)} {t(`notifications_page.filter_${item.category}`)}
                           </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-bold text-gray-800 text-base mb-1 leading-snug group-hover:text-brand-blue transition-colors">
                           {t(`notifications_page.${item.titleKey}`)}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                           {t(`notifications_page.${item.descKey}`)}
                        </p>

                        {/* Footer: Read More Arrow */}
                        <div className="flex justify-end items-center border-t border-gray-50 pt-2">
                           <div className="text-xs font-bold text-brand-blue flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                              {t('notifications_page.read_more')} &rarr;
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-20 text-gray-400">
               <div className="text-4xl mb-2">🤔</div>
               <p>{t('notifications_page.empty_search')}</p>
            </div>
         )}
      </div>

    </div>
  );
};

export default PastNotifications;
