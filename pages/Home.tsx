
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
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] w-full flex flex-col md:flex-row">
        
        {/* Column 1: Consular Protection */}
        <Link 
          to="/protection" 
          className="group relative flex-1 bg-transparent border-r border-white/10 flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up hover:flex-[1.2]"
          style={{ animationDelay: '0ms' }}
        >
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/A1.webp" 
              alt="Consular Protection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10"></div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/50 transition-all z-20 m-2 rounded-xl"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-black tracking-wide drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:text-cyan-400 transition-colors">{t('home.hero.protection')}</h2>
            <div className="h-0.5 w-0 group-hover:w-16 bg-cyan-400 transition-all duration-500 mt-2"></div>
          </div>
        </Link>

        {/* Column 2: Resident Rights */}
        <Link 
          to="/rights" 
          className="group relative flex-1 bg-transparent border-r border-white/10 flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up hover:flex-[1.2]"
          style={{ animationDelay: '100ms' }}
        >
          <div className="absolute inset-0 z-0">
             <img 
              src="/images/A2.webp" 
              alt="Resident Rights" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10"></div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500/50 transition-all z-20 m-2 rounded-xl"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-black tracking-wide drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:text-green-400 transition-colors">{t('home.hero.rights')}</h2>
            <div className="h-0.5 w-0 group-hover:w-16 bg-green-400 transition-all duration-500 mt-2"></div>
          </div>
        </Link>

        {/* Column 3: Events */}
        <Link 
          to="/events" 
          className="group relative flex-1 bg-transparent border-r border-white/10 flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up hover:flex-[1.2]"
          style={{ animationDelay: '200ms' }}
        >
          <div className="absolute inset-0 z-0">
             <img 
              src="/images/A3.webp" 
              alt="Events" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10"></div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/50 transition-all z-20 m-2 rounded-xl"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-black tracking-wide drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:text-yellow-400 transition-colors">{t('home.hero.alerts')}</h2>
            <div className="h-0.5 w-0 group-hover:w-16 bg-yellow-400 transition-all duration-500 mt-2"></div>
          </div>
        </Link>

        {/* Column 4: Resources */}
        <Link 
          to="/resources" 
          className="group relative flex-1 bg-transparent flex items-center justify-center transition-all duration-300 py-10 md:py-0 overflow-hidden animate-slide-up hover:flex-[1.2]"
          style={{ animationDelay: '300ms' }}
        >
          <div className="absolute inset-0 z-0">
             <img 
              src="/images/A4.webp" 
              alt="Resources" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10"></div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 transition-all z-20 m-2 rounded-xl"></div>

          <div className="relative z-20 text-center text-white p-4 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl font-black tracking-wide drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:text-purple-400 transition-colors">{t('home.hero.emergency')}</h2>
            <div className="h-0.5 w-0 group-hover:w-16 bg-purple-400 transition-all duration-500 mt-2"></div>
          </div>
        </Link>

        {/* Scroll Indicator */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-center pointer-events-none z-20 opacity-0 animate-fade-in -translate-y-1/2" style={{ animationDelay: '1000ms' }}>
          <button 
            onClick={(e) => { e.preventDefault(); scrollToContent(); }}
            className="pointer-events-auto flex flex-col items-center gap-1 md:gap-2 bg-transparent backdrop-blur-md px-6 py-4 rounded-full text-white hover:bg-white/10 transition-all border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 hover:border-cyan-400/50 transform duration-300"
          >
            <span className="text-xs font-bold tracking-[0.2em] opacity-100 uppercase text-cyan-200">{t('home.hero.scroll')}</span>
            <svg className="w-5 h-5 animate-bounce text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Content Section - Transparent Container */}
      <div id="home-content" className="relative z-10 w-full mt-0 shadow-none pb-10 bg-transparent">
        
        {/* Quick Access Buttons */}
        <section className="px-4 py-8 pb-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/help" className="bg-transparent hover:bg-white/10 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)] p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 duration-200 group backdrop-blur-sm">
                  <div className="text-3xl mb-1 drop-shadow-sm group-hover:scale-110 transition-transform">🆘</div>
                  <span className="font-bold text-gray-100 text-sm leading-tight">{t('home.quick.help')}</span>
              </Link>
              <Link to="/prepare" className="bg-transparent hover:bg-white/10 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)] p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 duration-200 group backdrop-blur-sm">
                  <div className="text-3xl mb-1 drop-shadow-sm group-hover:scale-110 transition-transform">✈️</div>
                  <span className="font-bold text-gray-100 text-sm leading-tight">{t('home.quick.prepare')}</span>
              </Link>
              <Link to="/safety-index" className="bg-transparent hover:bg-white/10 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)] p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 duration-200 group backdrop-blur-sm">
                  <div className="text-3xl mb-1 drop-shadow-sm group-hover:scale-110 transition-transform">📊</div>
                  <span className="font-bold text-gray-100 text-sm leading-tight">{t('home.quick.test')}</span>
              </Link>
               <Link to="/graphics" className="bg-transparent hover:bg-white/10 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)] p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 duration-200 group backdrop-blur-sm">
                  <div className="text-3xl mb-1 drop-shadow-sm group-hover:scale-110 transition-transform">🖼️</div>
                  <span className="font-bold text-gray-100 text-sm leading-tight">{t('home.quick.graphics')}</span>
              </Link>
           </div>
        </section>

        {/* Knowledge Section */}
        <section className="pt-4 pb-6 border-b border-white/10">
          <div className="px-5 mb-4 flex items-center gap-3">
            <div className="w-1.5 h-5 md:h-6 bg-gradient-to-b from-brand-red to-orange-500 rounded-full shadow-[0_0_10px_rgba(204,0,0,0.5)]"></div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">{t('home.knowledge.title')}</h2>
          </div>
          
          <div className="overflow-x-auto flex gap-4 px-5 pb-4 no-scrollbar snap-x snap-mandatory touch-pan-x">
            {HOT_KNOWLEDGE_LIST.slice(0, 5).map((item, index) => (
              <Link key={item.id} to={`/knowledge/${item.id}`} className="flex-none w-[80vw] md:w-96 snap-center group">
                <div className="bg-transparent backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-40 md:h-48 overflow-hidden bg-gray-900/50">
                    <img 
                      src={`/images/${KNOWLEDGE_IMAGES[index]}`}
                      alt={t(`hot_knowledge.${item.titleKey}`)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <h3 className="absolute bottom-3 left-4 right-4 text-white text-base md:text-lg font-bold line-clamp-2 leading-tight drop-shadow-md">
                      {t(`hot_knowledge.${item.titleKey}`)}
                    </h3>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center bg-transparent">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[70%]">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] md:text-xs text-gray-200 font-bold bg-transparent border border-white/40 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-cyan-400 flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-1 transition-transform">
                      {t('home.knowledge.read')} <span className="text-base">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Notifications Panel - Transparent Glass Card */}
        <section className="py-8 px-4 max-w-4xl mx-auto pb-24">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="w-1.5 h-5 md:h-6 bg-gradient-to-b from-brand-blue to-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,102,204,0.5)]"></div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">{t('home.notifications.title')}</h2>
          </div>

          <div className="bg-transparent backdrop-blur-sm rounded-xl border border-white/30 shadow-lg overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-blue via-purple-500 to-brand-red opacity-80"></div>
            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-transparent border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-3">{t('home.notifications.col_date')}</div>
              <div className="col-span-7">{t('home.notifications.col_content')}</div>
              <div className="col-span-2 text-right">{t('home.notifications.col_download')}</div>
            </div>

            <div className="divide-y divide-white/10">
              {MOCK_NOTIFICATIONS.map((item) => (
                <div key={item.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-white/5 transition-colors block group">
                  {/* Mobile: Date above title */}
                  <div className="mb-1 md:mb-0 md:col-span-3 text-xs text-gray-300 font-en flex items-center gap-2 md:block font-bold">
                    <span className="md:hidden inline-block w-2 h-2 rounded-full bg-brand-blue/50 group-hover:bg-brand-blue transition-colors"></span>
                    {item.date}
                  </div>
                  
                  {/* Title Area */}
                  <div className="md:col-span-7 flex justify-between items-start gap-3">
                    <Link to={item.link} className="text-sm md:text-base text-gray-200 font-medium group-hover:text-cyan-400 leading-snug transition-colors">
                      {t(`data.notifications.${item.id}`)}
                    </Link>
                    
                    {/* Mobile: Detail link icon */}
                    <Link to={item.link} className="md:hidden shrink-0 w-8 h-8 rounded-full bg-transparent border border-white/40 text-gray-300 flex items-center justify-center -mt-1 active:bg-white/10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Desktop: Detail Link Button */}
                  <div className="hidden md:flex md:col-span-2 justify-end">
                    <Link to={item.link} className="w-8 h-8 rounded-full bg-transparent border border-white/40 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-white/60 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-transparent text-center border-t border-white/10">
              <Link to="/past-notifications" className="text-xs md:text-sm text-gray-300 hover:text-cyan-400 font-bold inline-flex items-center gap-1 py-1 uppercase tracking-wider transition-colors">
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
