import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [activeScenario, setActiveScenario] = useState<'passport' | 'accident' | 'arrest' | null>(null);

  const contacts = [
    { name: t('help.c_1'), number: '+861012308', color: 'bg-red-500' },
    { name: t('help.c_2'), number: '+85366888353', color: 'bg-blue-600' },
    { name: t('help.c_3'), number: '+85328573333', color: 'bg-blue-800' },
    { name: t('help.c_4'), number: '+85328333000', color: 'bg-orange-500' },
  ];

  const scenarios = [
    { id: 'passport', icon: '🛂', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'accident', icon: '🚑', color: 'bg-red-100 text-red-800 border-red-200' },
    { id: 'arrest', icon: '👮', color: 'bg-gray-200 text-gray-800 border-gray-300' },
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      
      {/* Hero: Emotional Support */}
      <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white px-6 pt-32 pb-10 rounded-b-[2.5rem] shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-black mb-2">{t('help.hero_title')}</h1>
            <p className="text-white/90 text-sm leading-relaxed max-w-sm">{t('help.hero_desc')}</p>
          </div>
          <div className="text-7xl shrink-0 animate-pulse">🆘</div>
        </div>
      </div>

      <div className="px-4 space-y-8">
        
        {/* Contact Grid - Horizontal Scroll on Mobile */}
        <div>
           <div className="flex items-center gap-2 mb-4">
             <span className="animate-pulse text-red-500 text-xl">🆘</span>
             <h2 className="font-bold text-gray-800">{t('help.contacts_title')}</h2>
           </div>
           <p className="text-xs text-gray-500 mb-3">{t('help.contacts_desc')}</p>
           
           <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x">
              {contacts.map((c, idx) => (
                <a 
                  key={idx}
                  href={`tel:${c.number}`}
                  className={`flex-none w-64 p-4 rounded-xl text-white shadow-lg snap-center flex flex-col justify-between min-h-[140px] relative overflow-hidden active:scale-95 transition-transform ${c.color}`}
                >
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">📞</div>
                  <div className="font-bold text-sm leading-snug relative z-10">{c.name}</div>
                  <div className="font-mono font-bold text-sm mt-2">{c.number}</div>
                </a>
              ))}
           </div>
        </div>

        {/* Scenario Selector */}
        <div>
           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
             <span>🧭</span> {t('help.scenarios_title')}
           </h2>
           
           <div className="grid grid-cols-3 gap-3 mb-6">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(activeScenario === s.id ? null : s.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${activeScenario === s.id ? 'scale-105 shadow-md border-transparent ring-2 ring-offset-1 ring-blue-400' : 'border-transparent'} ${s.color}`}
                >
                  <span className="text-3xl mb-1">{s.icon}</span>
                  <span className="text-xs font-bold text-center leading-tight">{t(`help.s_${s.id}`)}</span>
                </button>
              ))}
           </div>

           {/* Dynamic Content Area */}
           {activeScenario && (
             <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 animate-fade-in relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100"></div>
               
               {/* Passport Scenario */}
               {activeScenario === 'passport' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg text-yellow-800 flex items-center gap-2 border-b border-yellow-100 pb-2">
                      {t('help.s_passport')}
                    </h3>
                    <div className="relative border-l-2 border-yellow-200 pl-6 space-y-6 ml-2">
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">1</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_passport.1.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_passport.1.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">2</div>
                          <h4 className="font-bold text-brand-blue text-sm flex items-center gap-1">
                             📱 {t('help.steps_passport.2.t')}
                          </h4>
                          <div className="bg-blue-50 p-3 rounded-lg mt-2 border border-blue-100">
                             <p className="text-[10px] text-blue-600 mt-1">{t('help.steps_passport.2.d')}</p>
                          </div>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">3</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_passport.3.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_passport.3.d')}</p>
                       </div>
                    </div>
                 </div>
               )}

               {/* Accident Scenario */}
               {activeScenario === 'accident' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg text-red-800 flex items-center gap-2 border-b border-red-100 pb-2">
                      {t('help.s_accident')}
                    </h3>
                    <div className="relative border-l-2 border-red-200 pl-6 space-y-6 ml-2">
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">1</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_accident.1.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_accident.1.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">2</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_accident.2.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_accident.2.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">3</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_accident.3.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_accident.3.d')}</p>
                       </div>
                    </div>
                 </div>
               )}

               {/* Arrest Scenario */}
               {activeScenario === 'arrest' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                      {t('help.s_arrest')}
                    </h3>
                    <div className="relative border-l-2 border-gray-300 pl-6 space-y-6 ml-2">
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">1</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_arrest.1.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_arrest.1.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[31px] w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">2</div>
                          <h4 className="font-bold text-gray-800 text-sm">{t('help.steps_arrest.2.t')}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t('help.steps_arrest.2.d')}</p>
                       </div>
                    </div>
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Powers: Can vs Cannot */}
        <div className="space-y-4">
           <h2 className="font-bold text-gray-800 text-center">{t('help.powers_title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                 <h3 className="text-green-700 mb-3 font-medium">
                   ✅ <span className="font-black text-lg">可以</span>為你做什麼？
                 </h3>
                 <ul className="space-y-2">
                   {[0, 1, 2].map(i => (
                     <li key={i} className="text-xs text-green-800 flex items-start gap-2">
                       <span className="mt-0.5">🔹</span>
                       <span>{t('help.can_list')[i]}</span>
                     </li>
                   ))}
                 </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                 <h3 className="text-red-700 mb-3 font-medium">
                   ❌ <span className="font-black text-lg">不可以</span>做什麼？
                 </h3>
                 <ul className="space-y-2">
                   {[0, 1, 2, 3].map(i => (
                     <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                       <span className="mt-0.5">🔸</span>
                       <span>{t('help.cannot_list')[i]}</span>
                     </li>
                   ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* Tips Footer */}
        <div className="bg-gray-800 text-gray-300 rounded-xl p-5 text-xs space-y-3">
           <h3 className="font-bold text-white text-sm border-b border-gray-600 pb-2 mb-2">💡 {t('help.tips_title')}</h3>
           <div>
             <span className="font-bold text-white block mb-0.5">{t('help.t_1_t')}</span>
             {t('help.t_1_d')}
           </div>
           <div>
             <span className="font-bold text-white block mb-0.5">{t('help.t_2_t')}</span>
             {t('help.t_2_d')}
           </div>
           <div>
             <span className="font-bold text-white block mb-0.5">{t('help.t_3_t')}</span>
             {t('help.t_3_d')}
           </div>
        </div>

        {/* Navigation Button to Emergency Zone */}
        <Link 
          to="/emergency" 
          className="block w-full bg-brand-red text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:bg-red-700"
        >
            <span>🚨 {t('help.emergency_btn')}</span>
        </Link>

      </div>
    </div>
  );
};

export default Help;