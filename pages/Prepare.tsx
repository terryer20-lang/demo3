
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { COUNTRY_RISK_DATA } from '../constants';
import { Link } from 'react-router-dom';

const Prepare: React.FC = () => {
  const { t } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [detailedChecks, setDetailedChecks] = useState<Record<number, boolean>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof COUNTRY_RISK_DATA[0] | null>(null);
  const [suggestions, setSuggestions] = useState<typeof COUNTRY_RISK_DATA>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const checklist = [
    { id: 1, icon: '🛂', title: t('prepare.check_1_t'), desc: t('prepare.check_1_d') },
    { id: 2, icon: '🛡️', title: t('prepare.check_2_t'), desc: t('prepare.check_2_d') },
    { id: 3, icon: '🏥', title: t('prepare.check_3_t'), desc: t('prepare.check_3_d') },
    { id: 4, icon: '📲', title: t('prepare.check_4_t'), desc: t('prepare.check_4_d') },
    { id: 5, icon: '☎️', title: t('prepare.check_5_t'), desc: t('prepare.check_5_d') },
  ];

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDetailedCheck = (id: number) => {
    setDetailedChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate Progress based on both lists (5 main items + 10 detailed items)
  const completedMain = Object.values(checkedItems).filter(Boolean).length;
  const completedDetailed = Object.values(detailedChecks).filter(Boolean).length;
  
  const totalItems = checklist.length + 10; // 5 + 10
  const totalCompleted = completedMain + completedDetailed;
  const progress = (totalCompleted / totalItems) * 100;

  useEffect(() => {
    if (progress === 100 && !hasShownPopup) {
      setShowPopup(true);
      setHasShownPopup(true);
    }
  }, [progress, hasShownPopup]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResult(null); // Clear previous result when typing

    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      const matches = COUNTRY_RISK_DATA.filter(
        (c: typeof COUNTRY_RISK_DATA[0]) => c.cn.includes(lowerQuery) || c.en.toLowerCase().includes(lowerQuery)
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCountry = (country: typeof COUNTRY_RISK_DATA[0]) => {
    setSearchResult(country);
    setSearchQuery(country.cn);
    setShowSuggestions(false);
  };

  const getRiskLabel = (risk: string | null | undefined) => {
    if (!risk) return 'N/A';
    const lower = risk.toLowerCase();
    if (lower === 'low') return '低';
    if (lower === 'medium') return '中';
    if (lower === 'high') return '高';
    return risk;
  };

  const getRiskColor = (risk: string | null | undefined) => {
    if (!risk) return 'bg-gray-800 text-gray-500 border-gray-700';
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-900/30 text-red-400 border-red-500/30';
      default: return 'bg-gray-800 text-gray-500 border-gray-700';
    }
  };

  const getRiskInfo = (risk: string | null | undefined) => {
    const lower = risk?.toLowerCase();
    if (lower === 'low') return { color: 'green', labelKey: 'alert_1', tipKey: 'risk_tip_low' };
    if (lower === 'medium') return { color: 'yellow', labelKey: 'alert_2', tipKey: 'risk_tip_medium' };
    if (lower === 'high') return { color: 'red', labelKey: 'alert_3', tipKey: 'risk_tip_high' };
    return { color: 'gray', labelKey: '', tipKey: '' };
  };

  const riskInfo = searchResult ? getRiskInfo(searchResult.risk) : null;

  return (
    <div className="pb-24 min-h-screen bg-transparent">
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-blue-600/90 to-blue-900/90 backdrop-blur-md text-white rounded-b-[3rem] shadow-2xl overflow-hidden border-b border-blue-500/30">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg width="100%" height="100%">
             <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
             {t('prepare.hero_title')}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg">
             {t('prepare.hero_desc')}
          </p>
        </div>
      </div>

      {/* Floating Progress Card */}
      <div className="px-4 -mt-12 relative z-20">
         <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-4 flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                 <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                 <path className="text-brand-green transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-green">
                 {Math.round(progress)}%
               </div>
            </div>
            <div>
               <h3 className="font-bold text-white text-sm">{t('prepare.progress_title')}</h3>
               <p className="text-xs text-gray-400 mt-1">{totalCompleted}/{totalItems} 完成度</p>
               <p className="text-[10px] text-gray-500 mt-1 leading-tight">{t('prepare.progress_hint')}</p>
            </div>
         </div>
      </div>

      <div className="px-4 space-y-6 mt-8">
        
        {/* Checklist Section */}
        <div>
           <h2 className="font-bold text-white mb-3 flex items-center gap-2 px-1">
             <span>📝</span> {t('prepare.check_title')}
           </h2>
           <div className="space-y-3">
             {checklist.map((item) => (
               <div 
                 key={item.id}
                 onClick={() => toggleCheck(item.id)}
                 className={`group p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm ${checkedItems[item.id] ? 'bg-green-900/30 border-green-500/50' : 'bg-slate-800/40 border-white/10 hover:bg-slate-800/60'}`}
               >
                 <div className="flex items-start gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 transition-colors ${checkedItems[item.id] ? 'bg-green-500/20' : 'bg-white/10'}`}>
                       {checkedItems[item.id] ? '✅' : item.icon}
                    </div>
                    <div>
                       <h3 className={`font-bold text-sm transition-colors ${checkedItems[item.id] ? 'text-green-400' : 'text-gray-100'}`}>
                         {item.title}
                       </h3>
                       <p className={`text-xs mt-1 leading-relaxed transition-colors ${checkedItems[item.id] ? 'text-green-300/70' : 'text-gray-400'}`}>
                         {item.desc}
                       </p>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Destination Safety Search */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-5" ref={searchContainerRef}>
           <h2 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             <span>🚦 {t('prepare.search_title')}</span>
           </h2>
           
           <div className="relative mb-4">
             <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                placeholder={t('prepare.search_placeholder')}
                className="w-full bg-black/40 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
             />
             <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
             
             {/* Suggestions Dropdown */}
             {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-xl border border-white/10 max-h-60 overflow-y-auto z-30">
                   {suggestions.map((country) => (
                      <button
                         key={country.code}
                         onClick={() => handleSelectCountry(country)}
                         className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-none transition-colors flex items-center justify-between"
                      >
                         <span className="text-sm text-gray-200 font-medium">
                            {country.cn} <span className="text-gray-500 font-normal">({country.en})</span>
                         </span>
                         <img 
                           src={`https://flagcdn.com/20x15/${country.code.toLowerCase()}.png`} 
                           alt="flag" 
                           className="shadow-sm rounded-sm"
                         />
                      </button>
                   ))}
                </div>
             )}
           </div>

           {searchResult && riskInfo ? (
             <div className="animate-fade-in bg-white/5 rounded-xl p-4 border border-white/10">
               <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{searchResult.cn} <span className="text-sm font-normal text-gray-400">({searchResult.en})</span></h3>
                    <img 
                      src={`https://flagcdn.com/24x18/${searchResult.code.toLowerCase()}.png`} 
                      alt="flag" 
                      className="mt-1 shadow-sm rounded-sm"
                    />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(searchResult.risk)}`}>
                     {t('prepare.risk_level')}: {getRiskLabel(searchResult.risk)}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="bg-black/20 p-2 rounded shadow-sm border border-white/5">
                    <div className="text-[10px] text-gray-400">{t('prepare.peace_index')}</div>
                    <div className="font-mono font-bold text-gray-200">{searchResult.gpi ?? 'N/A'}</div>
                 </div>
                 <div className="bg-black/20 p-2 rounded shadow-sm border border-white/5">
                    <div className="text-[10px] text-gray-400">{t('prepare.safety_index')}</div>
                    <div className="font-mono font-bold text-gray-200">{searchResult.safeIndex ?? 'N/A'}</div>
                 </div>
                 <div className="bg-black/20 p-2 rounded shadow-sm border border-white/5">
                    <div className="text-[10px] text-gray-400">{t('prepare.terrorism_index')}</div>
                    <div className="font-mono font-bold text-gray-200">{searchResult.gti ?? 'N/A'}</div>
                 </div>
                 <div className="bg-black/20 p-2 rounded shadow-sm border border-white/5">
                    <div className="text-[10px] text-gray-400">{t('prepare.us_news_rank')}</div>
                    <div className="font-mono font-bold text-gray-200">#{searchResult.usRank ?? '-'}</div>
                 </div>
               </div>

               {/* Traffic Light & Tips Block */}
               <div className="bg-black/30 rounded-lg p-3 border border-white/5 flex flex-col items-center shadow-inner">
                  <div className="flex gap-4 mb-2 bg-black/50 p-2 rounded-full shadow-md border border-white/5">
                     <div className={`w-4 h-4 rounded-full transition-all duration-300 ${riskInfo.color === 'green' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] scale-110' : 'bg-green-900/30'}`}></div>
                     <div className={`w-4 h-4 rounded-full transition-all duration-300 ${riskInfo.color === 'yellow' ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)] scale-110' : 'bg-yellow-900/30'}`}></div>
                     <div className={`w-4 h-4 rounded-full transition-all duration-300 ${riskInfo.color === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-110' : 'bg-red-900/30'}`}></div>
                  </div>
                  <div className={`font-bold text-sm mb-1 ${riskInfo.color === 'green' ? 'text-green-400' : riskInfo.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                     {t(`prepare.${riskInfo.labelKey}`)}
                  </div>
                  <p className="text-xs text-center text-gray-400 leading-relaxed px-2">
                     {t(`prepare.${riskInfo.tipKey}`)}
                  </p>
               </div>

             </div>
           ) : searchQuery && !showSuggestions && (
             <div className="text-center py-4 text-gray-500 text-xs">
               {t('prepare.no_result')}
             </div>
           )}

           <div className="mt-4 text-[10px] text-gray-500 text-center">
              資料來源於 <a href="https://worldpopulationreview.com/country-rankings/safest-countries-in-the-world" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-blue transition-colors">Safest Countries in the World 2026</a>
           </div>
        </div>

        {/* Detailed Self-Check Module */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-5">
           <h2 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             <span>📋</span> {t('prepare.detailed_checklist_title')}
           </h2>
           <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                 <div 
                   key={num} 
                   className="flex items-start gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                   onClick={() => toggleDetailedCheck(num)}
                 >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${detailedChecks[num] ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-500 text-transparent'}`}>
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                    <span className={`text-xs text-gray-300 leading-relaxed ${detailedChecks[num] ? 'line-through opacity-60' : ''}`}>
                       {t(`prepare.detailed_q_${num}`)}
                    </span>
                 </div>
              ))}
           </div>
        </div>

        {/* Luggage / Customs - Do's and Don'ts */}
        <div>
           <h2 className="font-bold text-white mb-3 px-1">{t('prepare.luggage_title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-900/30 backdrop-blur-md rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden">
                 <div className="absolute -right-2 -top-2 text-6xl opacity-10">💊</div>
                 <h3 className="font-bold text-emerald-400 text-sm mb-1">{t('prepare.luggage_ok')}</h3>
                 <p className="text-xs text-emerald-200/80 leading-relaxed">{t('prepare.luggage_ok_desc')}</p>
              </div>
              <div className="bg-rose-900/30 backdrop-blur-md rounded-xl p-4 border border-rose-500/30 relative overflow-hidden">
                 <div className="absolute -right-2 -top-2 text-6xl opacity-10">🚫</div>
                 <h3 className="font-bold text-rose-400 text-sm mb-1">{t('prepare.luggage_no')}</h3>
                 <p className="text-xs text-rose-200/80 leading-relaxed">{t('prepare.luggage_no_desc')}</p>
              </div>
           </div>
        </div>

        {/* Fraud Alert */}
        <div className="bg-black/40 rounded-xl p-1 relative overflow-hidden group border border-white/10">
           {/* Animated border gradient */}
           <div className="absolute inset-0 bg-gradient-to-r from-red-500/50 via-purple-500/50 to-blue-500/50 opacity-30 group-hover:opacity-60 transition-opacity"></div>
           <div className="bg-slate-900/90 backdrop-blur rounded-lg p-5 relative z-10 h-full">
              <div className="flex items-center gap-3 mb-2">
                 <span className="text-2xl animate-bounce">📵</span>
                 <div>
                    <h2 className="text-white font-bold text-sm uppercase tracking-wider">{t('prepare.fraud_title')}</h2>
                    <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">{t('prepare.fraud_alert')}</span>
                 </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 border-l-2 border-red-500 pl-3">
                 {t('prepare.fraud_desc')}
              </p>
           </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
           <Link 
             to="/resources#new-media"
             className="block w-full text-center bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-md"
           >
             點擊下載“中國領事”APP
           </Link>
        </div>
      </div>

      {/* Completion Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('prepare.popup_congrats')}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {t('prepare.popup_message')}
              </p>
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-colors"
              >
                {t('prepare.popup_close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Prepare;