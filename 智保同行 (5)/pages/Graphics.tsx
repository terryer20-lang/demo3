
import React, { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import html2canvas from 'html2canvas';

type Category = 'all' | 'passport' | 'safety' | 'fraud' | 'emergency';

interface GraphicItem {
  id: number;
  category: Omit<Category, 'all'>;
  titleKey: string;
  descKey: string;
  type: 'flow' | 'chat' | 'wallpaper' | 'list' | 'info' | 'card';
  height: string; // Used for aspect ratio logic
  color: string;
  gradient: string;
  user: string;
}

const Graphics: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const items: GraphicItem[] = [
    { id: 1, category: 'passport', titleKey: 'item_1_title', descKey: 'item_1_desc', type: 'flow', height: 'aspect-[3/4]', color: 'bg-blue-50', gradient: 'from-blue-500 to-cyan-400', user: 'ConsularOffical' },
    { id: 2, category: 'fraud', titleKey: 'item_2_title', descKey: 'item_2_desc', type: 'chat', height: 'aspect-[3/5]', color: 'bg-gray-100', gradient: 'from-purple-600 to-indigo-600', user: 'SafetyFirst' },
    { id: 3, category: 'emergency', titleKey: 'item_3_title', descKey: 'item_3_desc', type: 'wallpaper', height: 'aspect-[3/4]', color: 'bg-red-500', gradient: 'from-red-600 to-rose-500', user: 'EmergencyCenter' },
    { id: 4, category: 'safety', titleKey: 'item_4_title', descKey: 'item_4_desc', type: 'list', height: 'aspect-[3/4]', color: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-400', user: 'TravelGuide' },
    { id: 5, category: 'passport', titleKey: 'item_5_title', descKey: 'item_5_desc', type: 'info', height: 'aspect-[1/1]', color: 'bg-indigo-50', gradient: 'from-indigo-500 to-purple-500', user: 'VisaHelp' },
    { id: 6, category: 'safety', titleKey: 'item_6_title', descKey: 'item_6_desc', type: 'card', height: 'aspect-[3/4]', color: 'bg-yellow-50', gradient: 'from-yellow-400 to-orange-400', user: 'TipsMaster' },
  ];

  // Limit to 5 stories as requested
  const stories = items.slice(0, 5); 
  const filteredItems = activeFilter === 'all' ? items : items.filter(i => i.category === activeFilter);

  // Update index on scroll
  const handleStoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
     const scrollLeft = e.currentTarget.scrollLeft;
     const width = e.currentTarget.clientWidth;
     const index = Math.round(scrollLeft / width);
     setCurrentStoryIndex(index);
  };

  // Tap Navigation Logic
  const navigateStory = (direction: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    
    let newIndex = currentStoryIndex;
    if (direction === 'next') {
       if (currentStoryIndex < stories.length - 1) {
          newIndex = currentStoryIndex + 1;
       }
    } else {
       if (currentStoryIndex > 0) {
          newIndex = currentStoryIndex - 1;
       }
    }

    if (newIndex !== currentStoryIndex) {
       const width = scrollRef.current.clientWidth;
       scrollRef.current.scrollTo({
          left: width * newIndex,
          behavior: 'smooth'
       });
    }
  };

  // Share Logic (Text Link)
  const handleShare = async () => {
     if (navigator.share) {
        try {
           await navigator.share({
              title: '智保同行 - 圖解領保',
              text: '看看這個實用的領保知識！',
              url: window.location.href,
           });
        } catch (error) {
           console.log('Error sharing', error);
        }
     } else {
        // Fallback
        alert('連結已複製到剪貼板');
     }
  };

  // Real Download Logic using html2canvas
  const handleDownload = async () => {
     if (isDownloading) return;
     setIsDownloading(true);

     const activeStory = stories[currentStoryIndex];
     const element = document.getElementById(`story-node-${activeStory.id}`);

     if (!element) {
        setIsDownloading(false);
        return;
     }

     try {
        // Generate Canvas
        const canvas = await html2canvas(element, {
           scale: 2, // High resolution
           useCORS: true,
           backgroundColor: null,
           logging: false
        });

        // Convert to Blob
        canvas.toBlob(async (blob: Blob | null) => {
           if (!blob) {
              setIsDownloading(false);
              return;
           }

           const file = new File([blob], `macau-consular-story-${activeStory.id}.png`, { type: 'image/png' });

           // Try Web Share API Level 2 (allows sharing files, preferred for mobile "Save to Photos")
           if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                 await navigator.share({
                    files: [file],
                    title: '智保同行',
                    text: '下載圖片'
                 });
              } catch (err) {
                 // User cancelled or failed, fallback to download
                 console.log('Share failed, falling back to download', err);
                 triggerDownload(canvas);
              }
           } else {
              // Fallback to standard download
              triggerDownload(canvas);
           }
           setIsDownloading(false);
        }, 'image/png');

     } catch (error) {
        console.error('Download failed', error);
        alert('下載失敗，請稍後再試');
        setIsDownloading(false);
     }
  };

  const triggerDownload = (canvas: HTMLCanvasElement) => {
     const link = document.createElement('a');
     link.download = `story-${Date.now()}.png`;
     link.href = canvas.toDataURL('image/png');
     link.click();
     alert('圖片已下載 ✅\n如未看到，請檢查手機「檔案」或「下載」資料夾。');
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 1. Full Screen IG Stories Style Hero */}
      <section className="h-[100dvh] w-full relative bg-black overflow-hidden">
         
         {/* Story Progress Bars - Moved down to mt-20/24 to avoid header overlap */}
         <div className="absolute top-0 left-0 right-0 z-40 pt-safe-top px-2 flex gap-1 mt-20 md:mt-24 pointer-events-none">
            {stories.map((_, idx) => (
               <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                     className={`h-full bg-white transition-all duration-300 ${
                        idx < currentStoryIndex ? 'w-full' : 
                        idx === currentStoryIndex ? 'w-full' : 'w-0'
                     }`}
                  ></div>
               </div>
            ))}
         </div>

         {/* Header Info Overlay Removed as requested */}

         {/* Tap Navigation Overlays (Invisible) */}
         <div className="absolute inset-0 z-30 flex">
            {/* Left 30% for Prev */}
            <div className="w-[30%] h-full" onClick={() => navigateStory('prev')}></div>
            {/* Right 70% for Next */}
            <div className="w-[70%] h-full" onClick={() => navigateStory('next')}></div>
         </div>

         {/* Snap Scroll Container */}
         <div 
            ref={scrollRef}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            onScroll={handleStoryScroll}
         >
            {/* FIX: Removed unused 'index' parameter here */}
            {stories.map((item) => (
               // Added ID for html2canvas targeting
               <div id={`story-node-${item.id}`} key={item.id} className="snap-center min-w-full h-full relative flex items-center justify-center bg-gray-900">
                  {/* Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80`}></div>
                  
                  {/* Visual Content Placeholder - Centered Art */}
                  <div className="relative z-10 p-8 text-center text-white flex flex-col items-center pointer-events-none">
                     <div className="text-8xl mb-6 drop-shadow-2xl filter blur-sm animate-pulse transform scale-150 opacity-50 absolute">
                        {item.category === 'passport' ? '🛂' : item.category === 'fraud' ? '🚫' : item.category === 'emergency' ? '🆘' : '🛡️'}
                     </div>
                     <div className="text-8xl mb-6 drop-shadow-2xl relative z-10">
                        {item.category === 'passport' ? '🛂' : item.category === 'fraud' ? '🚫' : item.category === 'emergency' ? '🆘' : '🛡️'}
                     </div>
                     <h2 className="text-3xl font-black mb-4 leading-tight drop-shadow-lg max-w-xs mx-auto">
                        {t(`graphics.${item.titleKey}`)}
                     </h2>
                     <p className="text-white/90 text-sm max-w-xs mx-auto font-medium leading-relaxed bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        {t(`graphics.${item.descKey}`)}
                     </p>
                  </div>
                  
                  {/* Action Buttons (Download & Share) - Right Side */}
                  <div className="absolute bottom-32 right-6 text-white flex flex-col gap-6 z-40 items-center">
                     {/* Download Button */}
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                        disabled={isDownloading}
                        className="flex flex-col items-center gap-1 active:scale-90 transition-transform disabled:opacity-50"
                     >
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20">
                           {isDownloading ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                           )}
                        </div>
                        <span className="text-[10px] font-bold">{isDownloading ? 'Saving...' : 'Download'}</span>
                     </button>

                     {/* Share Button */}
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(); }}
                        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                     >
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20">
                           <svg className="w-5 h-5 -ml-0.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                           </svg>
                        </div>
                        <span className="text-[10px] font-bold">Share</span>
                     </button>
                  </div>
               </div>
            ))}
         </div>

         {/* Scroll Down Indicator */}
         <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center text-white animate-bounce pointer-events-none">
            <span className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">更多圖解</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
         </div>
      </section>

      {/* 2. Xiaohongshu Style Masonry Grid */}
      <section className="relative z-20 -mt-6 rounded-t-[2rem] bg-gray-50 pt-8 px-2 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-screen">
         
         {/* Filter Tabs */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 px-2 mb-2">
            {['all', 'passport', 'safety', 'fraud', 'emergency'].map((cat) => (
               <button
                  key={cat}
                  onClick={() => setActiveFilter(cat as Category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                     activeFilter === cat 
                     ? 'bg-gray-900 text-white border-gray-900' 
                     : 'bg-white text-gray-500 border-gray-100'
                  }`}
               >
                  {t(`graphics.filter_${cat}`)}
               </button>
            ))}
         </div>

         {/* Masonry Layout */}
         <div className="columns-2 gap-2 space-y-2 px-1">
            {filteredItems.map((item) => (
               <div key={item.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group mb-2 border border-gray-100">
                  {/* Image Area */}
                  <div className={`w-full ${item.height} ${item.color} relative overflow-hidden flex items-center justify-center`}>
                     <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                     <div className="text-4xl transform group-hover:scale-110 transition-transform duration-500">
                        {item.category === 'passport' ? '🛂' : item.category === 'fraud' ? '🚫' : item.category === 'emergency' ? '🆘' : item.category === 'safety' ? '🛡️' : '💡'}
                     </div>
                     {/* Type Badge */}
                     <div className="absolute top-2 right-2 bg-black/40 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-full">
                        {item.type.toUpperCase()}
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-3">
                     <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                        {t(`graphics.${item.titleKey}`)}
                     </h3>
                     
                     {/* Footer: User & Likes (Updated) */}
                     <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                           <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`} alt="avatar" />
                           </div>
                           <span className="text-[10px] text-gray-500 truncate">{item.user}</span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="text-center py-8 text-xs text-gray-400">
            沒有更多內容了
         </div>

      </section>

    </div>
  );
};

export default Graphics;
