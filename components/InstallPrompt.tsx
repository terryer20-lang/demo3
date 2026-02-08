
import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

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
    if (isIOS) {
        // iOS doesn't support programmatic install, so we just close the modal 
        // (The UI shows instructions instead of a button)
        setShow(false);
    } else if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        setShow(false);
      }
    }
  };

  if (!show || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none pb-[calc(env(safe-area-inset-bottom)+80px)] px-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl max-w-sm w-full pointer-events-auto animate-slide-up relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-red/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md">
                        <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base leading-tight">智保同行</h3>
                        <p className="text-gray-400 text-xs">官方領事保護平台</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShow(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                >
                    ✕
                </button>
            </div>

            <p className="text-gray-200 text-sm mb-4 font-medium leading-relaxed">
                新增至桌面以獲取即時信息！
                {isIOS && <br/>}
                {isIOS && <span className="text-xs text-gray-400 mt-1 block">請點擊下方 <span className='text-lg inline-block align-middle'>⎋</span> 分享按鈕，並選擇「加入主畫面」<span className='text-lg inline-block align-middle'>➕</span>。</span>}
            </p>

            {!isIOS && (
                <button
                    onClick={handleInstallClick}
                    className="w-full py-3 bg-gradient-to-r from-brand-red to-orange-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <span>📲</span> 立即新增
                </button>
            )}
            
            {isIOS && (
                 <div className="w-full text-center pb-2 animate-bounce text-brand-blue font-bold text-xl">
                    ↓
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
