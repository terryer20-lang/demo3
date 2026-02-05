
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NOTIFICATIONS, HOT_KNOWLEDGE_LIST } from '../constants';
import { useLanguage } from '../LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const scrollToContent = () => {
    const content = document.getElementById('home-content');
    content?.scrollIntoView({ behavior: 'smooth' });
  };

  const KNOWLEDGE_IMAGES = [
    "A5.webp",
    "A6.webp",
    "A7.webp",
    "A8.webp",
    "A9.webp"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Hero Section - Flexible Height, fills at least viewport */}
      <section className="relative min-h-[100dvh] w-full flex flex-col md:flex-row">
        
        {/* Column 1: Consular Protection */}
        <Link 
          to="/protection" 
          className="group relative flex-1 bg-black flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up"
          style={{ animationDelay: '0ms' }}
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/A1.webp" 
              alt="Consular Protection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-bold tracking-wide drop-shadow-md">{t('home.hero.protection')}</h2>
          </div>
        </Link>

        {/* Column 2: Resident Rights */}
        <Link 
          to="/rights" 
          className="group relative flex-1 bg-black flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
             <img 
              src="/images/A2.webp" 
              alt="Resident Rights" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-bold tracking-wide drop-shadow-md">{t('home.hero.rights')}</h2>
          </div>
        </Link>

        {/* Column 3: Events */}
        <Link 
          to="/events" 
          className="group relative flex-1 bg-black flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
             <img 
              src="/images/A3.webp" 
              alt="Events" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-bold tracking-wide drop-shadow-md">{t('home.hero.alerts')}</h2>
          </div>
        </Link>

        {/* Column 4: Resources */}
        <Link 
          to="/resources" 
          className="group relative flex-1 bg-black flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
             <img 
              src="/images/A4.webp" 
              alt="Resources" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-bold tracking-wide drop-shadow-md">{t('home.hero.emergency')}</h2>
          </div>
        </Link>

        {/* Scroll Indicator */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-center pointer-events-none z-20 opacity-0 animate-fade-in -translate-y-1/2" style={{ animationDelay: '1000ms' }}>
          <button 
            onClick={(e) => { e.preventDefault(); scrollToContent(); }}
            className="pointer-events-auto flex flex-col items-center gap-1 md:gap-2 bg-black/30 backdrop-blur-md px-5 py-3 rounded-full text-white hover:bg-black/50 transition-colors border border-white/20 shadow-2xl hover:scale-105 transform duration-300"
          >
            <span className="text-xs font-bold tracking-widest opacity-100 uppercase">{t('home.hero.scroll')}</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Content Section - Immediately follows the Hero section */}
      <div id="home-content" className="bg-white relative z-10 w-full mt-0 shadow-[0_-5px_25px_rgba(0,0,0,0.1)]">
        
        {/* Quick Access Buttons */}
        <section className="px-4 py-8 pb-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/help" className="bg-red-50 hover:bg-red-100 border border-red-100 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-colors active:scale-95 duration-200">
                  <div className="text-3xl mb-1">🆘</div>
                  <span className="font-bold text-gray-800 text-sm leading-tight">{t('home.quick.help')}</span>
              </Link>
              <Link to="/prepare" className="bg-blue-50 hover:bg-blue-100 border border-blue-100 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-colors active:scale-95 duration-200">
                  <div className="text-3xl mb-1">✈️</div>
                  <span className="font-bold text-gray-800 text-sm leading-tight">{t('home.quick.prepare')}</span>
              </Link>
              <Link to="/safety-index" className="bg-orange-50 hover:bg-orange-100 border border-orange-100 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-colors active:scale-95 duration-200">
                  <div className="text-3xl mb-1">📊</div>
                  <span className="font-bold text-gray-800 text-sm leading-tight">{t('home.quick.test')}</span>
              </Link>
               <Link to="/graphics" className="bg-green-50 hover:bg-green-100 border border-green-100 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-colors active:scale-95 duration-200">
                  <div className="text-3xl mb-1">🖼️</div>
                  <span className="font-bold text-gray-800 text-sm leading-tight">{t('home.quick.graphics')}</span>
              </Link>
           </div>
        </section>

        {/* Knowledge Section */}
        <section className="pt-4 pb-6 border-b border-gray-100">
          <div className="px-5 mb-4 flex items-center gap-3">
            <div className="w-1.5 h-5 md:h-6 bg-brand-red rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{t('home.knowledge.title')}</h2>
          </div>
          
          <div className="overflow-x-auto flex gap-4 px-5 pb-4 no-scrollbar snap-x snap-mandatory touch-pan-x">
            {HOT_KNOWLEDGE_LIST.slice(0, 5).map((item, index) => (
              <Link key={item.id} to={`/knowledge/${item.id}`} className="flex-none w-[80vw] md:w-96 snap-center group">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-40 md:h-48 overflow-hidden bg-gray-900">
                    <img 
                      src={`/images/${KNOWLEDGE_IMAGES[index]}`}
                      alt={t(`hot_knowledge.${item.titleKey}`)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <h3 className="absolute bottom-3 left-4 right-4 text-white text-base md:text-lg font-bold line-clamp-2 leading-tight drop-shadow-sm">
                      {t(`hot_knowledge.${item.titleKey}`)}
                    </h3>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[70%]">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] md:text-xs text-gray-500 font-bold bg-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-brand-blue flex items-center gap-1 shrink-0 ml-2">
                      {t('home.knowledge.read')} <span className="text-base">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Notifications Panel - Responsive List */}
        <section className="py-8 px-4 max-w-4xl mx-auto pb-24">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="w-1.5 h-5 md:h-6 bg-brand-blue rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{t('home.notifications.title')}</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <div className="col-span-3">{t('home.notifications.col_date')}</div>
              <div className="col-span-7">{t('home.notifications.col_content')}</div>
              <div className="col-span-2 text-right">{t('home.notifications.col_download')}</div>
            </div>

            <div className="divide-y divide-gray-100">
              {MOCK_NOTIFICATIONS.map((item) => (
                <div key={item.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-blue-50/50 transition-colors block">
                  {/* Mobile: Date above title */}
                  <div className="mb-1 md:mb-0 md:col-span-3 text-xs text-gray-400 font-en flex items-center gap-2 md:block">
                    <span className="md:hidden inline-block w-2 h-2 rounded-full bg-brand-blue/30"></span>
                    {item.date}
                  </div>
                  
                  {/* Title Area */}
                  <div className="md:col-span-7 flex justify-between items-start gap-3">
                    <Link to={item.link} className="text-sm md:text-base text-gray-800 font-medium hover:text-brand-blue leading-snug">
                      {t(`data.notifications.${item.id}`)}
                    </Link>
                    
                    {/* Mobile: Detail link icon */}
                    <Link to={item.link} className="md:hidden shrink-0 w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center -mt-1 active:bg-gray-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Desktop: Detail Link Button */}
                  <div className="hidden md:flex md:col-span-2 justify-end">
                    <Link to={item.link} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 text-center border-t border-gray-200">
              <Link to="/past-notifications" className="text-xs md:text-sm text-gray-500 hover:text-brand-blue font-medium inline-flex items-center gap-1 py-1">
                {t('home.notifications.more')} <span>&darr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Extra space for bottom safe area */}
        <div className="h-safe-bottom"></div>
      </div>
    </div>
  );
};

export default Home;
