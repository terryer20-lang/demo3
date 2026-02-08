
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { CONSULATE_DATA, ConsulateItem, PHONE_DATA, PhoneItem } from '../consulateData';
import { Link } from 'react-router-dom';

const Emergency: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<string>('');
  const { t } = useLanguage();
  
  // Search state for Consulate
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ConsulateItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search state for Quick Call
  const [callQuery, setCallQuery] = useState('');
  const [callSuggestions, setCallSuggestions] = useState<PhoneItem[]>([]);
  const [showCallSuggestions, setShowCallSuggestions] = useState(false);
  const callSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (callSearchRef.current && !callSearchRef.current.contains(event.target as Node)) {
        setShowCallSuggestions(false);
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

    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      // Search by Country Name (CN/EN) or full Mission Name
      const matches = CONSULATE_DATA.filter(
        (item: ConsulateItem) => 
          item.country.includes(query) || 
          item.countryEn.toLowerCase().includes(lowerQuery) ||
          item.name.includes(query)
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCallInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCallQuery(query);

    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      const matches = PHONE_DATA.filter(
        (item: PhoneItem) => 
          item.country.includes(query) || 
          item.countryEn.toLowerCase().includes(lowerQuery) ||
          item.name.includes(query)
      );
      setCallSuggestions(matches);
      setShowCallSuggestions(true);
    } else {
      setCallSuggestions([]);
      setShowCallSuggestions(false);
    }
  };

  const toDMS = (coordinate: number, isLat: boolean) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    
    let direction = "";
    if (isLat) {
      direction = coordinate >= 0 ? "N" : "S";
    } else {
      direction = coordinate >= 0 ? "E" : "W";
    }

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const handleGetLocation = () => {
    setLocationStatus(t('emergency.locating'));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latDMS = toDMS(latitude, true);
          const longDMS = toDMS(longitude, false);
          
          setLocationStatus(`${t('emergency.location_found')}: ${latDMS} ${longDMS}`);
          
          // Redirect to Google Maps searching for nearest Chinese Consulate
          setTimeout(() => {
             window.location.href = `https://www.google.com/maps/search/Chinese+Consulate/@${latitude},${longitude},12z`;
          }, 1500);
        },
        (error) => {
          setLocationStatus(`${t('emergency.location_error')}: ${error.message}`);
        }
      );
    } else {
      setLocationStatus('Geolocation unsupported');
    }
  };

  const hotlines = [
    { name: t('emergency.hotline_commissioner'), number: '+853 66888353', color: 'bg-transparent border-blue-500/50', icon: '🏢' },
    { name: t('emergency.hotline_psp'), number: '+853 28573333', color: 'bg-transparent border-blue-700/50', icon: '👮' },
    { name: t('emergency.hotline_tourism'), number: '+853 28333000', color: 'bg-transparent border-orange-500/50', icon: '🏖️' }
  ];

  return (
    <div className="pb-24 min-h-screen bg-transparent text-white overflow-hidden">
      
      {/* Header Alert Style - White BG, Red Text */}
      <div className="bg-white backdrop-blur-md px-6 pt-32 pb-10 rounded-b-[2.5rem] shadow-2xl relative mb-8 border-b border-red-500/30">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
         <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="text-left flex-1">
              <h1 className="text-2xl font-black tracking-widest uppercase mb-1 text-red-600">{t('emergency.page_title')}</h1>
              <p className="text-red-400 text-sm font-bold tracking-wide">{t('emergency.page_subtitle')}</p>
            </div>
            <div className="text-7xl shrink-0">🚨</div>
         </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 space-y-6">
        
        {/* Main 12308 Card - Transparent */}
        <div className="bg-transparent text-gray-200 rounded-2xl p-6 shadow-xl border border-red-500/50 backdrop-blur-md">
           <div className="flex justify-between items-start mb-4">
              <div className="max-w-[80%]">
                 <h2 className="text-lg font-bold text-red-400 leading-tight">{t('emergency.main_hotline_label')}</h2>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{t('emergency.main_hotline_desc')}</p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-xl animate-pulse shrink-0 border border-red-500/30">📞</div>
           </div>
           
           <div className="text-4xl font-black text-center font-mono tracking-tight my-4 text-white select-all">
             +86 10 12308
           </div>

           <a 
             href="tel:+861012308"
             className="block w-full bg-transparent border border-red-500 text-red-400 text-center py-4 rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-red-500/10"
           >
             <span>{t('emergency.call_action')}</span>
           </a>
        </div>

        {/* Local Hotlines Bento Grid - Full Block Clickable - Transparent */}
        <div>
           <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">{t('emergency.local_hotlines_title')}</h3>
           <div className="grid grid-cols-1 gap-3">
              {hotlines.map((h, i) => (
                <a 
                  key={i} 
                  href={`tel:${h.number.replace(/\s/g, '')}`} 
                  className="flex bg-transparent backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-lg active:bg-white/5 active:scale-[0.99] transition-all group"
                >
                   <div className={`w-16 flex items-center justify-center text-2xl border-r ${h.color} backdrop-blur-sm`}>
                      {h.icon}
                   </div>
                   <div className="flex-1 p-3 flex justify-between items-center">
                      <div className="min-w-0 pr-2">
                         <div className="text-xs text-gray-300 mb-0.5 font-bold leading-tight">{h.name}</div>
                         <div className="font-mono text-lg font-bold text-white">{h.number}</div>
                      </div>
                      <div className="w-10 h-10 bg-transparent border border-green-500/50 rounded-full flex items-center justify-center text-green-400 group-hover:bg-green-500/10 transition-colors shrink-0">
                         📞
                      </div>
                   </div>
                </a>
              ))}
           </div>
        </div>

        {/* Consulate Link Search - Transparent */}
        <div className="bg-transparent backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-5" ref={searchContainerRef}>
           <h2 className="font-bold text-white mb-4 text-sm flex items-center gap-2 uppercase tracking-wider">
             <span>🌐 {t('emergency.consulate_search_title')}</span>
           </h2>
           
           <div className="relative">
             <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                placeholder={t('emergency.consulate_search_placeholder')}
                className="w-full bg-transparent border border-white/30 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
             />
             <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
             
             {/* Suggestions Dropdown */}
             {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/90 rounded-lg shadow-xl border border-white/20 max-h-60 overflow-y-auto z-30 backdrop-blur-xl">
                   {suggestions.map((item, index) => (
                      <a
                         key={index}
                         href={item.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block text-left px-4 py-3 hover:bg-white/10 border-b border-white/10 last:border-none transition-colors group"
                      >
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-200 font-medium leading-snug">
                               {item.name}
                            </span>
                            <span className="text-gray-500 text-xs group-hover:text-brand-blue">↗</span>
                         </div>
                         {(item.countryEn || item.country) && (
                            <span className="text-xs text-gray-500 block mt-0.5">
                               {item.country} {item.countryEn ? `• ${item.countryEn}` : ''}
                            </span>
                         )}
                      </a>
                   ))}
                </div>
             )}
           </div>

           {/* Geolocation Button */}
           <button 
             onClick={handleGetLocation}
             className="w-full mt-3 py-2.5 rounded-lg border border-dashed border-white/30 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
           >
             {locationStatus ? (
                <span className="text-green-400 font-mono">{locationStatus}</span>
             ) : (
                <>
                  <span>📍</span>
                  <span>{t('emergency.location_btn')}</span>
                </>
             )}
           </button>
        </div>

        {/* Quick Call Search - Transparent */}
        <div className="bg-transparent backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-5" ref={callSearchRef}>
           <h2 className="font-bold text-white mb-4 text-sm flex items-center gap-2 uppercase tracking-wider">
             <span>☎️ {t('emergency.quick_call_title')}</span>
           </h2>
           
           <div className="relative">
             <input
                type="text"
                value={callQuery}
                onChange={handleCallInputChange}
                onFocus={() => { if(callSuggestions.length > 0) setShowCallSuggestions(true); }}
                placeholder={t('emergency.quick_call_placeholder')}
                className="w-full bg-transparent border border-white/30 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
             />
             <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
             
             {/* Suggestions Dropdown */}
             {showCallSuggestions && callSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/90 rounded-lg shadow-xl border border-white/20 max-h-60 overflow-y-auto z-30 backdrop-blur-xl">
                   {callSuggestions.map((item, index) => (
                      <a
                         key={index}
                         href={`tel:${item.number}`}
                         className="block text-left px-4 py-3 hover:bg-white/10 border-b border-white/10 last:border-none transition-colors group"
                      >
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-200 font-medium leading-snug">
                               {item.name}
                            </span>
                            <span className="text-green-400 text-xs font-bold bg-green-500/20 px-2 py-0.5 rounded group-hover:bg-green-500/30">📞 Call</span>
                         </div>
                         <div className="flex justify-between mt-0.5">
                            {(item.countryEn || item.country) ? (
                                <span className="text-xs text-gray-500">
                                   {item.country} {item.countryEn ? `• ${item.countryEn}` : ''}
                                </span>
                            ) : <span></span>}
                            <span className="text-xs font-mono text-gray-400">{item.number}</span>
                         </div>
                      </a>
                   ))}
                </div>
             )}
           </div>
        </div>

        {/* Safety Kit - App Downloads - Transparent */}
        <div className="bg-transparent backdrop-blur-md rounded-2xl p-5 border border-white/20">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2">
             <span>🧰</span> {t('emergency.safety_kit_title')}
           </h3>
           <div className="grid grid-cols-2 gap-3">
              <Link to="/resources#new-media" className="bg-transparent p-3 rounded-xl flex flex-col items-center text-center hover:bg-white/10 transition-colors border border-white/20">
                 <div className="text-3xl mb-2">🇨🇳</div>
                 <div className="font-bold text-sm text-white leading-tight">{t('emergency.kit_app_title')}</div>
                 <div className="text-[10px] text-gray-400 mt-1">{t('emergency.kit_app_desc')}</div>
              </Link>
              <Link to="/resources#macau-one-account" className="bg-transparent p-3 rounded-xl flex flex-col items-center text-center hover:bg-white/10 transition-colors border border-white/20">
                 <div className="text-3xl mb-2">🇲🇴</div>
                 <div className="font-bold text-sm text-white leading-tight">{t('emergency.kit_macau_title')}</div>
                 <div className="text-[10px] text-gray-400 mt-1">{t('emergency.kit_macau_desc')}</div>
              </Link>
           </div>
        </div>

        {/* Lost Passport - Horizontal Steps - Transparent, White Numbers */}
        <div>
           <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">{t('emergency.lost_passport_title')}</h3>
           <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar snap-x">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="snap-start shrink-0 w-36 bg-transparent backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col relative shadow-lg">
                   <div className="absolute top-2 right-2 text-4xl text-white font-black">{step}</div>
                   <div className="mb-2 text-2xl">
                      {step === 1 ? '👮' : step === 2 ? '📱' : step === 3 ? '🏛️' : '🛂'}
                   </div>
                   <div className="font-bold text-sm text-white mb-1">{t(`emergency.step_${step}_t`)}</div>
                   <div className="text-[10px] text-gray-400 leading-tight">{t(`emergency.step_${step}_d`)}</div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Emergency;