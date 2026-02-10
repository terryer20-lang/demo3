
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

interface ContactItem {
  name: string;
  number: string;
  color: string;
}

interface ScenarioItem {
  id: string;
  icon: string;
  color: string;
}

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [activeScenario, setActiveScenario] = useState<'passport' | 'accident' | 'arrest' | null>(null);

  const contacts: ContactItem[] = [
    { name: t('help.c_1'), number: '+861012308', color: 'bg-red-600/80 border-red-500/50' },
    { name: t('help.c_2'), number: '+85366888353', color: 'bg-blue-600/80 border-blue-500/50' },
    { name: t('help.c_3'), number: '+85328573333', color: 'bg-blue-800/80 border-blue-700/50' },
    { name: t('help.c_4'), number: '+85328333000', color: 'bg-orange-500/80 border-orange-500/50' },
  ];

  const scenarios: ScenarioItem[] = [
    { id: 'passport', icon: '🛂', color: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30' },
    { id: 'accident', icon: '🚑', color: 'bg-red-500/20 text-red-200 border-red-500/30 hover:bg-red-500/30' },
    { id: 'arrest', icon: '👮', color: 'bg-gray-500/20 text-gray-200 border-gray-500/30 hover:bg-gray-500/30' },
  ];

  const TIPS_DATA = [
    {
      title: "一、 事前準備：多重備份與官方工具",
      icon: "🎒",
      content: [
        { label: "證件雲端化", text: "將護照、身份證、簽證及機票拍照存於雲端 (iCloud/Google Drive)，確保離線可訪問。" },
        { label: "紙質應急包", text: "隨身攜帶護照複印件及 2 張證件照，與正本分開存放。" },
        { label: "手機設置", text: "下載「中國領事」App 完成實名認證；開啟手機 SOS 功能並填寫醫療急救卡。" }
      ]
    },
    {
      title: "二、 向警方求助：明確取得「官方證明」",
      icon: "👮",
      content: [
        { label: "核心目標", text: "務必取得載有案號 (Case Number) 的報案證明，這是補證與理賠的唯一憑證。" },
        { label: "語言溝通", text: "若語言不通，清晰重複 \"Chinese translator\" 請求翻譯。" },
        { label: "自我保護", text: "僅陳述客觀事實，不猜測，且絕不簽署任何看不懂的文件。" }
      ]
    },
    {
      title: "三、 向使領館求助：驗證與替代文件",
      icon: "🏛️",
      content: [
        { label: "必備材料", text: "前往時備妥警察報告、證件影本及照片以節省核實時間。" },
        { label: "旅行證", text: "辦理速度快，適用於急需回國 (可轉機)。" },
        { label: "護照補發", text: "耗時長 (約5-11工作天)，適用於需長期留居或有後續行程者。" }
      ]
    }
  ];

  return (
    <div className="pb-24 min-h-screen bg-transparent pt-16">
      
      {/* Hero: Emotional Support */}
      <div className="bg-gradient-to-br from-rose-600/90 to-red-800/90 backdrop-blur-md text-white px-6 pt-10 pb-10 rounded-b-[2.5rem] shadow-[0_10px_40px_rgba(225,29,72,0.3)] mb-8 relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-black mb-2 drop-shadow-md">{t('help.hero_title')}</h1>
            <p className="text-white/90 text-sm leading-relaxed max-w-sm font-medium">{t('help.hero_desc')}</p>
          </div>
          <div className="text-7xl shrink-0 animate-pulse filter drop-shadow-lg">🆘</div>
        </div>
      </div>

      <div className="px-4 space-y-8">
        
        {/* Contact Grid - Horizontal Scroll on Mobile */}
        <div>
           <div className="flex items-center gap-2 mb-4">
             <span className="animate-pulse text-red-500 text-xl">🆘</span>
             <h2 className="font-bold text-white text-lg">{t('help.contacts_title')}</h2>
           </div>
           <p className="text-xs text-gray-400 mb-3">{t('help.contacts_desc')}</p>
           
           <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x">
              {contacts.map((c: ContactItem, idx: number) => (
                <a 
                  key={idx}
                  href={`tel:${c.number}`}
                  className={`flex-none w-64 p-4 rounded-2xl text-white shadow-lg snap-center flex flex-col justify-between min-h-[140px] relative overflow-hidden active:scale-95 transition-all backdrop-blur-md border ${c.color}`}
                >
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">📞</div>
                  <div className="font-bold text-sm leading-snug relative z-10 drop-shadow-md">{c.name}</div>
                  <div className="font-mono font-bold text-lg mt-2 tracking-wide">{c.number}</div>
                </a>
              ))}
           </div>
        </div>

        {/* Scenario Selector */}
        <div>
           <h2 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
             <span>🧭</span> {t('help.scenarios_title')}
           </h2>
           
           <div className="grid grid-cols-3 gap-3 mb-6">
              {scenarios.map((s: ScenarioItem) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(activeScenario === s.id ? null : s.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${activeScenario === s.id ? 'scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-1 ring-white/50' : 'border-transparent'} ${s.color}`}
                >
                  <span className="text-3xl mb-2 filter drop-shadow-sm">{s.icon}</span>
                  <span className="text-xs font-bold text-center leading-tight">{t(`help.s_${s.id}`)}</span>
                </button>
              ))}
           </div>

           {/* Dynamic Content Area - Glass Card */}
           {activeScenario && (
             <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 animate-fade-in relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800/80 backdrop-blur-xl rotate-45 border-t border-l border-white/10"></div>
               
               {/* Passport Scenario */}
               {activeScenario === 'passport' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg text-yellow-400 flex items-center gap-2 border-b border-white/10 pb-3">
                      {t('help.s_passport')}
                    </h3>
                    <div className="relative border-l-2 border-yellow-500/30 pl-6 space-y-8 ml-2">
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]">1</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_passport.1.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_passport.1.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]">2</div>
                          <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-1 mb-1">
                             📱 {t('help.steps_passport.2.t')}
                          </h4>
                          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                             <p className="text-[10px] text-blue-300 leading-relaxed">{t('help.steps_passport.2.d')}</p>
                          </div>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]">3</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_passport.3.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_passport.3.d')}</p>
                       </div>
                    </div>
                 </div>
               )}

               {/* Accident Scenario */}
               {activeScenario === 'accident' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg text-red-400 flex items-center gap-2 border-b border-white/10 pb-3">
                      {t('help.s_accident')}
                    </h3>
                    <div className="relative border-l-2 border-red-500/30 pl-6 space-y-8 ml-2">
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]">1</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_accident.1.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_accident.1.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]">2</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_accident.2.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_accident.2.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]">3</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_accident.3.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_accident.3.d')}</p>
                       </div>
                    </div>
                 </div>
               )}

               {/* Arrest Scenario */}
               {activeScenario === 'arrest' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg text-gray-200 flex items-center gap-2 border-b border-white/10 pb-3">
                      {t('help.s_arrest')}
                    </h3>
                    <div className="relative border-l-2 border-gray-600 pl-6 space-y-8 ml-2">
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center text-xs font-bold border border-gray-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]">1</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_arrest.1.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_arrest.1.d')}</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[33px] w-7 h-7 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center text-xs font-bold border border-gray-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]">2</div>
                          <h4 className="font-bold text-white text-sm mb-1">{t('help.steps_arrest.2.t')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{t('help.steps_arrest.2.d')}</p>
                       </div>
                    </div>
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Powers: Can vs Cannot - Transparent */}
        <div className="space-y-4">
           <h2 className="font-bold text-white text-center text-lg">{t('help.powers_title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-transparent p-5 rounded-2xl border border-green-500/30 backdrop-blur-md">
                 <h3 className="text-green-400 mb-4 font-bold text-base flex items-center gap-2">
                   ✅ <span>{t('protection.tab_can')}</span>
                 </h3>
                 <ul className="space-y-3">
                   {[0, 1, 2].map(i => (
                     <li key={i} className="text-xs text-green-200/80 flex items-start gap-2 leading-relaxed">
                       <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                       <span>{t('help.can_list')[i]}</span>
                     </li>
                   ))}
                 </ul>
              </div>
              <div className="bg-transparent p-5 rounded-2xl border border-red-500/30 backdrop-blur-md">
                 <h3 className="text-red-400 mb-4 font-bold text-base flex items-center gap-2">
                   ❌ <span>{t('protection.tab_cannot')}</span>
                 </h3>
                 <ul className="space-y-3">
                   {[0, 1, 2, 3].map(i => (
                     <li key={i} className="text-xs text-red-200/80 flex items-start gap-2 leading-relaxed">
                       <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                       <span>{t('help.cannot_list')[i]}</span>
                     </li>
                   ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* Tips Footer - Integrated & Optimized */}
        <div className="bg-transparent backdrop-blur-md text-gray-300 rounded-2xl p-6 text-xs space-y-6 border border-white/10 shadow-lg">
           <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3 flex items-center gap-2">
             💡 {t('help.tips_title')}
           </h3>
           
           {TIPS_DATA.map((tip, idx) => (
             <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                   <span>{tip.icon}</span>
                   <span>{tip.title}</span>
                </div>
                <ul className="space-y-2 pl-6 border-l-2 border-white/10 ml-2">
                   {tip.content.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                         <span className="text-brand-blue font-bold">{item.label}：</span>
                         <span className="text-gray-400">{item.text}</span>
                      </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>

        {/* Navigation Button to Emergency Zone - iOS 26 Style */}
        <Link 
          to="/emergency" 
          className="block w-full bg-red-600/80 backdrop-blur-xl text-white text-center py-4 rounded-2xl font-bold text-lg shadow-[0_0_25px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-400/30 hover:bg-red-600 hover:shadow-[0_0_35px_rgba(220,38,38,0.6)]"
        >
            <span>🚨 {t('help.emergency_btn')}</span>
        </Link>

      </div>
    </div>
  );
};

export default Help;
    