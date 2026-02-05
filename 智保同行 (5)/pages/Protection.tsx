
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const Protection: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'can' | 'cannot'>('can');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const progress = (Object.values(checkedItems).filter(Boolean).length / 5) * 100;

  return (
    <div className="pb-24 min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative py-10 px-6 bg-[#003366] text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden">
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
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
           <h2 className="text-lg font-bold text-gray-800 mb-2 relative z-10 flex items-center gap-2">
             💡 {t('protection.definition_title')}
           </h2>
           <p className="text-sm text-gray-600 leading-relaxed relative z-10 text-justify">
             {t('protection.definition_desc')}
           </p>
        </div>

        {/* Who is Eligible - Bento Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3 px-1">
            {t('protection.who_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl mb-2">🎫</div>
                <h3 className="font-bold text-blue-900 mb-1">{t('protection.who_1_title')}</h3>
                <p className="text-xs text-blue-700 leading-relaxed opacity-80">
                  {t('protection.who_1_desc')}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl mb-2">🧬</div>
                <h3 className="font-bold text-purple-900 mb-1">{t('protection.who_2_title')}</h3>
                <p className="text-xs text-purple-700 leading-relaxed opacity-80">
                  {t('protection.who_2_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Can / Cannot Interactive Toggle */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 pb-2">
             <h2 className="text-xl font-bold text-gray-800">{t('protection.scope_title')}</h2>
             <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{t('protection.scope_subtitle')}</p>
          </div>
          
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('can')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'can' ? 'text-green-600 bg-green-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {t('protection.tab_can')}
              {activeTab === 'can' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('cannot')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'cannot' ? 'text-red-600 bg-red-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {t('protection.tab_cannot')}
              {activeTab === 'cannot' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
            </button>
          </div>

          <div className="p-4 min-h-[280px]">
            {activeTab === 'can' ? (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-green-50 p-3 rounded-lg border border-green-100/50">
                    <div className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {t(`protection.can_list.${i}.t`)}
                    </div>
                    <div className="text-[10px] text-green-700 leading-snug">
                       {t(`protection.can_list.${i}.d`)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                 {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">✕</div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">{t(`protection.cannot_list.${i}.t`)}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{t(`protection.cannot_list.${i}.d`)}</p>
                    </div>
                  </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Pre-departure Checklist - Gamified */}
        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <h2 className="text-lg font-bold">✈️ {t('protection.checklist_title')}</h2>
            </div>
            <div className="text-2xl font-bold font-mono text-brand-green">{Math.round(progress)}%</div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-700 rounded-full mb-6 relative z-10 overflow-hidden">
            <div className="h-full bg-brand-green transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="space-y-3 relative z-10">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                onClick={() => toggleCheck(i)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer active:scale-98 ${checkedItems[i] ? 'bg-brand-green/20 border-brand-green/50' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checkedItems[i] ? 'bg-brand-green border-brand-green' : 'border-gray-500'}`}>
                  {checkedItems[i] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-sm ${checkedItems[i] ? 'text-gray-200 line-through opacity-70' : 'text-gray-300'}`}>
                  {t(`protection.checklist_items.${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Fraud Alert - Dark/Glitch Style */}
        <div className="border-2 border-red-500/30 bg-red-50 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 grayscale">👮</div>
          <h2 className="text-red-700 font-black text-xl mb-1 uppercase tracking-tighter flex items-center gap-2">
            <span className="animate-pulse">🛑</span> {t('protection.fraud_title')}
          </h2>
          <p className="text-xs font-bold text-red-500 bg-red-100 inline-block px-2 py-0.5 rounded mb-4">
             {t('protection.fraud_subtitle')}
          </p>

          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border-l-4 border-red-500 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-1">{t('protection.fraud_1_t')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t('protection.fraud_1_d')}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border-l-4 border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-1">{t('protection.fraud_2_t')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t('protection.fraud_2_d')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer for Contact */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-0 right-0 px-4 pointer-events-none z-30">
        <a 
          href="tel:+861012308"
          className="mx-auto max-w-sm bg-gray-900/90 backdrop-blur text-white p-3 rounded-full shadow-2xl flex items-center justify-between pl-6 pr-2 pointer-events-auto hover:scale-105 transition-transform"
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
