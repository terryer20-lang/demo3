
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MENU_ITEMS } from '../constants';
import { useLanguage } from '../LanguageContext';
import ParticleBackground from './ParticleBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sosOffset, setSosOffset] = useState(0);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      // Handle header background
      setScrolled(window.scrollY > 20);

      // Handle SOS button offset to avoid footer overlap
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the footer is visible in the viewport
        if (footerRect.top < windowHeight) {
          const overlap = windowHeight - footerRect.top;
          setSosOffset(Math.max(0, overlap));
        } else {
          setSosOffset(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Apply transparent header for Home and Graphics pages
  const isTransparentHeader = location.pathname === '/' || location.pathname === '/graphics';

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-sans pb-[env(safe-area-inset-bottom)] text-gray-100 selection:bg-cyan-500 selection:text-white">
      
      {/* Interactive Tech Background */}
      <ParticleBackground />

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 flex items-center justify-between
          ${isTransparentHeader && !scrolled ? 'bg-gradient-to-b from-slate-900/80 to-transparent pt-6 pb-4' : 'bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-white/10 py-3'}
        `}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group z-50 relative">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-cyan-500/50 bg-black/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform backdrop-blur-sm">
             <img src="/images/Escudos de Quíron.webp" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-white text-lg md:text-xl tracking-wide whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-shadow-md">
            {t('app.title')}
          </span>
        </Link>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3 z-50 relative">
          
          {/* Menu Button */}
          <button 
            onClick={toggleMenu}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center gap-1.5 hover:bg-white/20 transition-colors focus:outline-none active:scale-95 touch-manipulation shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            aria-label="Menu"
          >
            <div className="w-6 md:w-7 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
            <div className="w-6 md:w-7 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
            <div className="w-6 md:w-7 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
          </button>
        </div>
      </header>

      {/* Main Content - Transparent background to show particles */}
      <main className="flex-1 w-full max-w-[100vw] bg-transparent relative z-10">
        {children}
      </main>

      {/* Global Copyright Footer - Glass Effect */}
      <footer ref={footerRef} className="w-full bg-slate-900/60 backdrop-blur-md border-t border-white/5 text-white/40 text-[10px] py-6 px-6 text-center z-10 relative">
         <div className="max-w-4xl mx-auto leading-relaxed whitespace-pre-line mb-3">
            {t('app.copyright')}
         </div>
      </footer>

      {/* Fullscreen App-Grid Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-2xl flex flex-col transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        {/* Menu Header */}
        <div className="pt-[max(env(safe-area-inset-top),20px)] px-6 py-5 flex justify-between items-center border-b border-white/10 bg-white/5">
          <span className="font-bold text-xl text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{t('menu.title')}</span>
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors active:scale-90 border border-white/10"
          >
            &times;
          </button>
        </div>

        {/* App Grid */}
        <div className="flex-1 overflow-y-auto p-4 pt-8">
          <div className="grid grid-cols-4 gap-x-2 gap-y-8 max-w-lg mx-auto">
            {MENU_ITEMS.map((item, index) => (
              <Link 
                key={item.id} 
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex flex-col items-center gap-2 group animate-fade-in`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* App Icon Shape */}
                <div 
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-[18px] flex items-center justify-center text-2xl md:text-3xl shadow-lg border transition-all duration-200 group-active:scale-90
                    ${location.pathname === item.path 
                      ? 'bg-white text-brand-red border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105' 
                      : 'bg-white/10 backdrop-blur-md text-white border-white/20 group-hover:bg-white/20 group-hover:border-white/40'
                    }`}
                >
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className={`text-[10px] md:text-xs font-bold text-center leading-tight break-words w-full px-0.5 line-clamp-2 ${location.pathname === item.path ? 'text-brand-red' : 'text-gray-300'}`}>
                  {t(`menu.${item.id}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Footer */}
        <div className="pb-safe-bottom p-6 text-center">
           <div className="w-12 h-1 mx-auto bg-white/20 rounded-full mb-2"></div>
        </div>
      </div>

      {/* Floating SOS Button - Larger Size */}
      <Link 
        to="/emergency"
        style={{ 
          bottom: `calc(1.5rem + env(safe-area-inset-bottom) + ${sosOffset}px)` 
        }}
        className="fixed right-5 md:right-6 bg-brand-red/90 backdrop-blur text-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-[0_0_30px_rgba(204,0,0,0.6)] flex flex-col items-center justify-center z-40 hover:scale-105 transition-all duration-100 ease-out border-4 border-white/20 animate-pulse"
        aria-label="Emergency SOS"
      >
        <span className="text-3xl md:text-4xl drop-shadow-md">🆘</span>
      </Link>
    </div>
  );
};

export default Layout;
