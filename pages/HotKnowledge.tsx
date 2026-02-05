
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { HOT_KNOWLEDGE_LIST } from '../constants';

const HotKnowledge: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="pb-24 min-h-screen bg-gray-50 font-sans">
      
      {/* Hero: Vibrant Gradient */}
      <div className="relative pt-32 pb-16 px-6 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-b-[3rem] shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
            {t('hot_knowledge.hero_title')}
          </h1>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Knowledge List */}
        <div className="space-y-4">
           {HOT_KNOWLEDGE_LIST.map((item) => (
             <div 
               key={item.id}
               onClick={() => navigate(`/knowledge/${item.id}`)}
               className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.99] transition-all hover:shadow-md cursor-pointer flex justify-between items-center group"
             >
               <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-gray-800 text-base md:text-lg mb-2 leading-tight group-hover:text-brand-blue transition-colors">
                    {t(`hot_knowledge.${item.titleKey}`)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
               </div>
               <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </div>
             </div>
           ))}
        </div>

        {/* Section 3: Trending Tags Cloud (Kept as requested style update didn't explicitly ask to remove, fits the list theme) */}
        <section className="pt-4 pb-8 border-t border-gray-200 mt-8">
           <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">
             🔥 {t('hot_knowledge.tags_title')}
           </h2>
           <div className="flex flex-wrap gap-2">
              {['#VisaFree', '#LostPassport', '#12308', '#SafetyFirst', '#TravelTips', '#ConsularProtection', '#MacauID'].map((tag, i) => (
                 <span 
                   key={i}
                   className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-transform hover:scale-105 cursor-default ${
                     i % 3 === 0 ? 'bg-pink-50 text-pink-600 border-pink-100' : 
                     i % 3 === 1 ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                     'bg-purple-50 text-purple-600 border-purple-100'
                   }`}
                 >
                   {tag}
                 </span>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default HotKnowledge;
