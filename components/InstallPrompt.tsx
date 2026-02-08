
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if already installed (Standalone mode)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    if (checkStandalone()) return;

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Handle Android/Desktop beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Force show for iOS if not standalone (since iOS doesn't fire the event)
    if (isIosDevice && !checkStandalone()) {
        // Small delay to ensure it doesn't clash with load animations
        setTimeout(() => setShow(true), 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // Navigate to the "Add to Home" page instead of triggering prompt directly
    setShow(false);
    navigate('/add-to-home');
  };

  const handleBackdropClick = () => {
    setShow(false);
  };

  if (!show || isStandalone) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-slate-900/95 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full relative overflow-hidden animate-slide-up transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-red/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg">
                        <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight tracking-wide">智保同行</h3>
                        <p className="text-gray-400 text-xs mt-0.5">官方領事保護平台</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShow(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2 -mr-2 -mt-2"
                >
                    ✕
                </button>
            </div>

            <p className="text-gray-200 text-base mb-6 font-medium leading-relaxed">
                新增至桌面以獲取即時信息！
                {isIOS && <br/>}
                {isIOS && <span className="text-xs text-gray-400 mt-2 block bg-white/5 p-2 rounded-lg border border-white/10">請點擊下方 <span className='text-lg inline-block align-middle'>⎋</span> 分享按鈕，並選擇「加入主畫面」<span className='text-lg inline-block align-middle'>➕</span>。</span>}
            </p>

            {!isIOS && (
                <button
                    onClick={handleInstallClick}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-red to-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border border-white/10 hover:shadow-orange-500/20"
                >
                    <span>📲</span> 點擊新增至主頁面
                </button>
            )}
            
            {isIOS && (
                 <div className="w-full text-center pb-2 animate-bounce text-brand-blue font-bold text-2xl">
                    ↓
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
