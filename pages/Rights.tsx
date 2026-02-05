
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const Rights: React.FC = () => {
  const { t } = useLanguage();
  const [activeIdentity, setActiveIdentity] = useState<'perm' | 'non_perm'>('perm');

  // Data derived from the user-provided image table
  const comparisonData = [
    {
      category: "逗留條件",
      icon: "🛃",
      perm: "不受限制",
      nonPerm: "受法律及簽注限制"
    },
    {
      category: "現金分享計劃",
      icon: "💰",
      perm: "金額較多 (如 $10,000)",
      nonPerm: "金額較少 (如 $6,000)"
    },
    {
      category: "社會房屋申請",
      icon: "🏠",
      perm: "合資格者可申請",
      nonPerm: "不可"
    },
    {
      category: "居留權",
      icon: "🛂",
      perm: "依法享有居留權。可自由進出澳門，不被施加任何逗留條件，且不被驅逐出境。",
      nonPerm: "不享有居留權。僅為有資格領取澳門居民身份證的人。"
    },
    {
      category: "身份證明文件",
      icon: "🪪",
      perm: "有資格領取永久性居民身份證。",
      nonPerm: "有資格領取居民身份證（非永久性）。"
    },
    {
      category: "選舉權與被選舉權",
      icon: "🗳️",
      perm: "依法享有選舉權和被選舉權。",
      nonPerm: "不享有選舉權和被選舉權。"
    },
    {
      category: "擔任行政/立法職位",
      icon: "🏛️",
      perm: "行政長官、政府主要官員、立法會議員、行政會委員等必須由其擔任。",
      nonPerm: "不具備擔任上述主要政治職位的資格。"
    },
    {
      category: "擔任特定司法公職",
      icon: "⚖️",
      perm: "終審法院院長、檢察長等職位必須由其（且為中國公民）擔任。",
      nonPerm: "不具備擔任這些領導職位的資格。"
    },
    {
      category: "公務人員任用",
      icon: "👮",
      perm: "法律規定公務人員必須是永久性居民（除特定例外）。",
      nonPerm: "除聘用的專業技術人員或初級公務人員外，一般不得擔任。"
    },
    {
      category: "旅行證件",
      icon: "✈️",
      perm: "中國公民可獲發澳門特別行政區護照。",
      nonPerm: "由特區政府簽發其他旅行證件，不獲發護照。"
    },
    {
      category: "政治參與義務",
      icon: "🇨🇳",
      perm: "其中的中國公民可依法參與國家事務管理（如選出全國人大代表）。",
      nonPerm: "不具備參與國家事務管理的特定法律權利。"
    }
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative py-10 px-6 bg-[#00785E] text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
            {t('rights.hero_title')}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed max-w-xl">
            {t('rights.hero_desc')}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-8">
        
        {/* Identity Comparison Section */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
            <span>🆔</span> {t('rights.residents_title')}
          </h2>
          
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-gray-200 p-1 rounded-xl">
             <button 
               onClick={() => setActiveIdentity('perm')}
               className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeIdentity === 'perm' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               <span className={activeIdentity === 'perm' ? '' : 'grayscale opacity-50'}>🎫</span>
               {t('rights.perm_title')}
             </button>
             <button 
               onClick={() => setActiveIdentity('non_perm')}
               className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeIdentity === 'non_perm' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               <span className={activeIdentity === 'non_perm' ? '' : 'grayscale opacity-50'}>🎫</span>
               {t('rights.non_perm_title')}
             </button>
          </div>

          {/* Detailed Comparison Table/List */}
          <div className="space-y-3">
            {comparisonData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <span className="text-xl">{item.icon}</span>
                  <h3 className="font-bold text-gray-800 text-sm">{item.category}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {/* Permanent Content */}
                  <div className={`text-xs p-2.5 rounded-lg transition-colors ${activeIdentity === 'perm' ? 'bg-brand-blue/10 text-brand-blue font-bold ring-1 ring-brand-blue/30' : 'text-gray-400 opacity-60'}`}>
                    <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70">永久性居民</div>
                    {item.perm}
                  </div>

                  {/* Non-Permanent Content */}
                  <div className={`text-xs p-2.5 rounded-lg transition-colors ${activeIdentity === 'non_perm' ? 'bg-gray-100 text-gray-800 font-bold ring-1 ring-gray-300' : 'text-gray-400 opacity-60'}`}>
                    <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70">非永久性居民</div>
                    {item.nonPerm}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Rights - Block Style Re-layout */}
        <div className="border-[3px] border-blue-200 rounded-xl bg-white shadow-sm overflow-hidden">
           {/* Header */}
           <div className="px-5 py-3 border-b border-blue-100 bg-blue-50/30">
              <h2 className="text-xl font-bold text-gray-800 leading-tight">{t('rights.core_title')}</h2>
              <p className="text-xs font-bold text-brand-blue mt-0.5">{t('rights.core_subtitle')}</p>
           </div>

           <div className="p-4 space-y-4 bg-white/50">
              {/* Row 1: Freedom (Full Width) */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
                 <div className="w-12 h-12 bg-orange-100/50 rounded-full flex items-center justify-center text-2xl shrink-0">
                    🔐
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800 text-base">{t('rights.rights_list.freedom.t')}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t('rights.rights_list.freedom.d')}</p>
                 </div>
              </div>

              {/* Row 2: Speech & Movement (Half Width on tablet, stacked on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Speech */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                     <div className="text-3xl mb-3 text-pink-500">📢</div>
                     <h3 className="font-bold text-gray-800 text-sm mb-1">{t('rights.rights_list.speech.t')}</h3>
                     <p className="text-xs text-gray-500 leading-relaxed">{t('rights.rights_list.speech.d')}</p>
                  </div>

                  {/* Movement */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                     <div className="text-3xl mb-3 text-blue-500">✈️</div>
                     <h3 className="font-bold text-gray-800 text-sm mb-1">{t('rights.rights_list.movement.t')}</h3>
                     <p className="text-xs text-gray-500 leading-relaxed">{t('rights.rights_list.movement.d')}</p>
                  </div>
              </div>

              {/* Row 3: Remaining Items (Full width on mobile to show text, 3 cols on desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Judicial */}
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="text-3xl mb-3 text-blue-600">⚖️</div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{t('rights.rights_list.judicial.t')}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{t('rights.rights_list.judicial.d')}</p>
                 </div>
                 
                 {/* Faith */}
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="text-3xl mb-3 text-purple-600">🕍</div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{t('rights.rights_list.faith.t')}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{t('rights.rights_list.faith.d')}</p>
                 </div>
                 
                 {/* Welfare */}
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="text-3xl mb-3 text-orange-600">👶</div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{t('rights.rights_list.welfare.t')}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{t('rights.rights_list.welfare.d')}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Overseas Identity Transformation - Expanded */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full filter blur-[80px] opacity-20 -mr-20 -mt-20"></div>
           
           <div className="relative z-10">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                🌍 {t('rights.overseas_title')}
              </h2>
              <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">{t('rights.overseas_subtitle')}</p>

              <div className="space-y-4">
                 {/* Item 1: Citizen Definition */}
                 <div className="flex gap-4 items-start border-l-2 border-brand-red/50 pl-4">
                    <div>
                       <h3 className="font-bold text-red-100 text-sm mb-1">{t('rights.citizen_def')}</h3>
                       <p className="text-xs text-gray-300 leading-relaxed">{t('rights.citizen_desc')}</p>
                    </div>
                 </div>

                 {/* Item 2: Consular Right */}
                 <div className="flex gap-4 items-start border-l-2 border-brand-blue/50 pl-4">
                    <div>
                       <h3 className="font-bold text-blue-100 text-sm mb-1">{t('rights.consular_right')}</h3>
                       <p className="text-xs text-gray-300 leading-relaxed">{t('rights.consular_desc')}</p>
                    </div>
                 </div>

                 {/* Item 3: Nationality Selection */}
                 <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/10">
                    <h3 className="font-bold text-sm mb-1 text-yellow-100">🇨🇳 {t('rights.nationality_select')}</h3>
                    <p className="text-xs text-gray-300 mb-2">{t('rights.nationality_desc')}</p>
                 </div>

                 {/* Item 4: Travel Convenience */}
                 <div className="bg-white/5 backdrop-blur rounded-lg p-3 border border-white/5">
                    <h3 className="font-bold text-sm mb-1 text-green-100">🛂 {t('rights.passport_convenience')}</h3>
                    <p className="text-xs text-gray-400">{t('rights.passport_desc')}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Duty & Responsibility */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 text-9xl opacity-5 -mt-4 -mr-4">⚖️</div>
           
           <h2 className="text-lg font-bold text-gray-800 relative z-10">{t('rights.duty_title')}</h2>
           <p className="text-xs text-gray-500 mb-6 relative z-10">{t('rights.duty_subtitle')}</p>

           <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <div className="flex-1 bg-gray-50 p-4 rounded-xl border-l-4 border-gray-400">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="text-xl">📜</div>
                    <h3 className="font-bold text-sm text-gray-800">{t('rights.duty_1')}</h3>
                 </div>
                 <p className="text-xs text-gray-500">{t('rights.duty_1_desc')}</p>
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-xl border-l-4 border-gray-400">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="text-xl">🤝</div>
                     <h3 className="font-bold text-sm text-gray-800">{t('rights.duty_2')}</h3>
                 </div>
                 <p className="text-xs text-gray-500">{t('rights.duty_2_desc')}</p>
              </div>
           </div>
        </div>

        {/* Tips Footer - Sticky Note Style */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 relative shadow-sm">
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-200/50 backdrop-blur rounded-sm"></div>
           <h2 className="font-bold text-yellow-800 text-sm mb-3 flex items-center gap-2 border-b border-yellow-200 pb-2">
             📌 {t('rights.tips_title')}
           </h2>
           
           <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-lg mt-0.5">🛂</div>
                <div>
                   <h3 className="font-bold text-yellow-900 text-xs mb-0.5">{t('rights.tips_passport')}</h3>
                   <p className="text-xs text-yellow-700/80 leading-relaxed">{t('rights.tips_passport_desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-lg mt-0.5">📱</div>
                <div>
                   <h3 className="font-bold text-yellow-900 text-xs mb-0.5">{t('rights.tips_app')}</h3>
                   <p className="text-xs text-yellow-700/80 leading-relaxed">{t('rights.tips_app_desc')}</p>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Rights;
