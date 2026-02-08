
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const Protection: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'can' | 'cannot'>('can');

  return (
    <div className="pb-24 min-h-screen bg-transparent pt-16">
      {/* Hero Section */}
      <div className="relative py-10 px-6 bg-[#003366]/90 backdrop-blur-md text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden border-b border-white/10">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
            {t('protection.hero_title')}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg">
            {t('protection.hero_desc')}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Definition Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/20 rounded-bl-full -mr-4 -mt-4 z-0"></div>
           <h2 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
             💡 {t('protection.definition_title')}
           </h2>
           <p className="text-sm text-gray-300 leading-relaxed relative z-10 text-justify">
             {t('protection.definition_desc')}
           </p>
        </div>

        {/* Who is Eligible - Bento Grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3 px-1">
            {t('protection.who_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-900/40 backdrop-blur-md p-4 rounded-xl border border-blue-500/30 flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl mb-2">🎫</div>
                <h3 className="font-bold text-blue-200 mb-1">{t('protection.who_1_title')}</h3>
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  {t('protection.who_1_desc')}
                </p>
              </div>
            </div>
            <div className="bg-purple-900/40 backdrop-blur-md p-4 rounded-xl border border-purple-500/30 flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl mb-2">🧬</div>
                <h3 className="font-bold text-purple-200 mb-1">{t('protection.who_2_title')}</h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">
                  {t('protection.who_2_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Can / Cannot Interactive Toggle - Transparent */}
        <div className="bg-transparent backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden">
          <div className="p-5 pb-2">
             <h2 className="text-xl font-bold text-white">{t('protection.scope_title')}</h2>
             <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{t('protection.scope_subtitle')}</p>
          </div>
          
          <div className="flex border-b border-white/10">
            <button 
              onClick={() => setActiveTab('can')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'can' ? 'text-green-400 bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              {t('protection.tab_can')}
              {activeTab === 'can' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('cannot')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'cannot' ? 'text-red-400 bg-red-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              {t('protection.tab_cannot')}
              {activeTab === 'cannot' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
            </button>
          </div>

          <div className="p-4 min-h-[280px]">
            {activeTab === 'can' ? (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-green-500/10 p-3 rounded-lg border border-green-500/30 backdrop-blur-sm">
                    <div className="text-xs font-bold text-green-300 mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {t(`protection.can_list.${i}.t`)}
                    </div>
                    <div className="text-[10px] text-green-200/80 leading-snug">
                       {t(`protection.can_list.${i}.d`)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                 {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold border border-red-500/30">✕</div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-200">{t(`protection.cannot_list.${i}.t`)}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{t(`protection.cannot_list.${i}.d`)}</p>
                    </div>
                  </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Anti-Fraud Alert - Dark/Glitch Style - Transparent */}
        <div className="border border-red-500/50 bg-transparent backdrop-blur-md p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-8xl opacity-10 grayscale">👮</div>
          <h2 className="text-red-400 font-black text-xl mb-1 uppercase tracking-tighter flex items-center gap-2">
            <span className="animate-pulse">🛑</span> {t('protection.fraud_title')}
          </h2>
          <p className="text-xs font-bold text-red-300 bg-red-900/50 inline-block px-2 py-0.5 rounded mb-4 border border-red-500/30">
             {t('protection.fraud_subtitle')}
          </p>

          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-lg border-l-4 border-red-500 shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-gray-100 text-sm mb-1">{t('protection.fraud_1_t')}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{t('protection.fraud_1_d')}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border-l-4 border-gray-500 shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-gray-100 text-sm mb-1">{t('protection.fraud_2_t')}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{t('protection.fraud_2_d')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer for Contact */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-0 right-0 px-4 pointer-events-none z-30">
        <a 
          href="tel:+861012308"
          className="mx-auto max-w-sm bg-slate-900/90 backdrop-blur-xl text-white p-3 rounded-full shadow-2xl flex items-center justify-between pl-6 pr-2 pointer-events-auto hover:scale-105 transition-transform border border-white/10"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('protection.footer_hotline')}</span>
            <span className="font-mono text-xl font-bold tracking-widest">+86 10 12308</span>
          </div>
          <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center animate-pulse">
            📞
          </div>
        </a>
      </div>
    </div>
  );
};

export default Protection;
