import React from 'react';
import { useLanguage } from '../LanguageContext';

const Multimedia: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pb-24 pt-16 md:pt-20">
      {/* Video Section */}
      <div className="mb-8">
        <div className="px-5 py-3 bg-gray-50/95 backdrop-blur sticky top-[60px] md:top-[72px] z-30 font-bold text-gray-800 border-l-4 border-brand-blue flex justify-between items-center shadow-sm">
          <span>{t('multimedia.videos_title')}</span>
          <span className="text-xs text-brand-blue font-normal">{t('multimedia.swipe_hint')} &rarr;</span>
        </div>
        <div className="overflow-x-auto flex gap-4 p-5 no-scrollbar touch-pan-x">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-none w-[75vw] md:w-80 snap-center group">
              <div className="aspect-video bg-gray-800 rounded-xl mb-3 relative overflow-hidden shadow-md">
                <img src={`https://picsum.photos/400/225?random=${i}`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/40">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">01:30</span>
              </div>
              <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2 leading-snug">
                {t('multimedia.video_title_template').replace('{{i}}', i.toString())}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Podcast Section */}
      <div>
        <div className="px-5 py-3 bg-gray-50/95 backdrop-blur sticky top-[60px] md:top-[72px] z-30 font-bold text-gray-800 border-l-4 border-brand-green flex justify-between items-center shadow-sm">
          <span>{t('multimedia.podcasts_title')}</span>
          <button className="text-xs text-brand-green border border-brand-green px-2 py-1 rounded active:bg-green-50">{t('multimedia.rss_btn')}</button>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3 items-center active:bg-gray-50 transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-brand-blue font-bold shrink-0 text-sm md:text-base border border-indigo-100">
                {i}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-800 text-sm md:text-base truncate">
                  {t('multimedia.podcast_title_template').replace('{{i}}', i.toString())}
                </h5>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green w-1/3 rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">12:00</span>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Multimedia;