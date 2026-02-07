
import React from 'react';
import { useLanguage } from '../LanguageContext';

const Multimedia: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pb-24 pt-16 md:pt-20 min-h-screen bg-transparent">
      {/* Video Section */}
      <div className="mb-8">
        <div className="px-5 py-3 bg-slate-900/40 backdrop-blur-xl sticky top-[60px] md:top-[72px] z-30 font-bold text-white border-l-4 border-brand-blue flex justify-between items-center shadow-lg border-y border-r border-white/5 rounded-r-xl mr-4">
          <span className="drop-shadow-md">{t('multimedia.videos_title')}</span>
          <span className="text-xs text-cyan-400 font-normal animate-pulse">{t('multimedia.swipe_hint')} &rarr;</span>
        </div>
        <div className="overflow-x-auto flex gap-4 p-5 no-scrollbar touch-pan-x">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-none w-[75vw] md:w-80 snap-center group">
              <div className="aspect-video bg-slate-800/50 rounded-2xl mb-3 relative overflow-hidden shadow-lg border border-white/10">
                <img src={`https://picsum.photos/400/225?random=${i}`} alt="Video Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10">01:30</span>
              </div>
              <h4 className="font-bold text-gray-200 text-sm md:text-base line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">
                {t('multimedia.video_title_template').replace('{{i}}', i.toString())}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Podcast Section */}
      <div>
        <div className="px-5 py-3 bg-slate-900/40 backdrop-blur-xl sticky top-[60px] md:top-[72px] z-30 font-bold text-white border-l-4 border-brand-green flex justify-between items-center shadow-lg border-y border-r border-white/5 rounded-r-xl mr-4">
          <span className="drop-shadow-md">{t('multimedia.podcasts_title')}</span>
          <button className="text-xs text-green-400 border border-green-500/50 px-3 py-1 rounded-full active:bg-green-500/20 transition-colors backdrop-blur-sm shadow-[0_0_10px_rgba(74,222,128,0.2)]">{t('multimedia.rss_btn')}</button>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-sm border border-white/10 flex gap-4 items-center active:bg-white/10 transition-colors cursor-pointer group hover:border-white/20">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 font-bold shrink-0 text-sm md:text-base border border-indigo-500/30 group-hover:bg-indigo-500/30 group-hover:text-white transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                {i}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-gray-200 text-sm md:text-base truncate group-hover:text-white transition-colors">
                  {t('multimedia.podcast_title_template').replace('{{i}}', i.toString())}
                </h5>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-green to-emerald-400 w-1/3 rounded-full shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">12:00</span>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-blue hover:border-brand-blue transition-all backdrop-blur-sm shadow-sm">
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Multimedia;
