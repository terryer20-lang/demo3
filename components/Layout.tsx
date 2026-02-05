
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MENU_ITEMS } from '../constants';
import { useLanguage } from '../LanguageContext';

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
    <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-x-hidden font-sans pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 flex items-center justify-between
          ${isTransparentHeader && !scrolled ? 'bg-gradient-to-b from-black/60 to-transparent pt-6 pb-4' : 'bg-brand-red shadow-md py-3'}
        `}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group z-50 relative">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-white/80 bg-white/90 shadow-md flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
             <img src="/images/Escudos de Quíron_1.webp" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className={`font-bold text-white text-lg md:text-xl tracking-wide whitespace-nowrap drop-shadow-sm ${isTransparentHeader && !scrolled ? 'text-shadow-md' : ''}`}>
            {t('app.title')}
          </span>
        </Link>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3 z-50 relative">
          
          {/* Menu Button */}
          <button 
            onClick={toggleMenu}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur border border-white/30 flex flex-col items-center justify-center gap-1.5 hover:bg-white/20 transition-colors focus:outline-none active:scale-95 touch-manipulation"
            aria-label="Menu"
          >
            <div className="w-6 md:w-7 h-0.5 bg-white rounded-full"></div>
            <div className="w-6 md:w-7 h-0.5 bg-white rounded-full"></div>
            <div className="w-6 md:w-7 h-0.5 bg-white rounded-full"></div>
          </button>
        </div>
      </header>

      {/* Main Content - Ensure pages cover the dark background if needed */}
      <main className="flex-1 w-full max-w-[100vw] bg-gray-50">
        {children}
      </main>

      {/* Global Copyright Footer */}
      <footer ref={footerRef} className="w-full bg-gray-900 text-white/50 text-[10px] py-6 px-6 text-center z-10 relative">
         <div className="max-w-4xl mx-auto leading-relaxed whitespace-pre-line">
            {t('app.copyright')}
         </div>
      </footer>

      {/* Sidebar Overlay Menu */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 h-[100dvh] w-[80vw] max-w-[340px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5 md:p-6 flex justify-between items-center bg-brand-red text-white pt-safe-top">
            <span className="font-bold text-xl md:text-2xl tracking-wider">{t('menu.title')}</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-3xl opacity-70 hover:opacity-100 w-10 h-10 flex items-center justify-center active:scale-90">&times;</button>
          </div>
          <div className="overflow-y-auto flex-1 py-2 overscroll-contain">
            {MENU_ITEMS.map((item) => (
              <Link 
                key={item.id} 
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-6 md:px-8 py-4 md:py-5 border-b border-gray-50 hover:bg-gray-50 transition-colors group ${location.pathname === item.path ? 'bg-red-50' : ''}`}
              >
                <span className="mr-5 text-2xl md:text-3xl w-8 text-center group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className={`text-lg md:text-xl font-bold ${location.pathname === item.path ? 'text-brand-red' : 'text-gray-700'}`}>
                  {t(`menu.${item.id}`)}
                </span>
              </Link>
            ))}
          </div>
          <div className="p-4 md:p-6 bg-gray-50 text-center text-xs text-gray-400 pb-safe-bottom">
            {/* Copyright is now in the global footer */}
          </div>
        </div>
      </div>

      {/* Floating SOS Button - Larger Size */}
      <Link 
        to="/emergency"
        style={{ 
          bottom: `calc(1.5rem + env(safe-area-inset-bottom) + ${sosOffset}px)` 
        }}
        className="fixed right-5 md:right-6 bg-brand-red text-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-xl shadow-red-900/30 flex flex-col items-center justify-center z-40 hover:scale-105 transition-all duration-100 ease-out border-4 border-white/90 animate-pulse"
        aria-label="Emergency SOS"
      >
        <span className="text-3xl md:text-4xl">🆘</span>
      </Link>
    </div>
  );
};

export default Layout;
