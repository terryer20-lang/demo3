
import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useLocation } from 'react-router-dom';

const Resources: React.FC = () => {
  const { t } = useLanguage();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
           element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [hash]);

  const links = [
    { label: t('resources.link_1'), url: "https://www.fmprc.gov.cn/web/", icon: "🇨🇳" },
    { label: t('resources.link_2'), url: "https://portaldascomunidades.mne.gov.pt/pt/", icon: "🇵🇹" },
    { label: t('resources.link_3'), url: "https://cs.mfa.gov.cn/", icon: "🌏" },
    { label: t('resources.link_4'), url: "https://mo.ocmfa.gov.cn/chn/", icon: "🏢" },
    { label: t('resources.link_5'), url: "https://www.gov.mo/zh-hant/", icon: "🇲🇴" },
    { label: t('resources.link_6'), url: "https://www.dsi.gov.mo/index_cn.jsp", icon: "🆔" },
    { label: t('resources.link_7'), url: "https://www.elctp.k12.edu.mo/elctp/", icon: "🏫" },
  ];

  const guides = [
    { 
      title: t('resources.guide_1_t'), 
      url: "https://drive.google.com/file/d/1vGhf8DCaNA2tocWt9vYK74mGFqeVkxTd/view?usp=sharing",
      color: "from-red-700 to-red-900",
      type: "PDF"
    },
    { 
      title: t('resources.guide_macau_t'), 
      url: "https://drive.google.com/file/d/1moXKmtsGNwWI-FmklMQh9bLLF5pq0Gbt/view?usp=sharing",
      color: "from-green-700 to-green-900",
      type: "PDF"
    },
    { 
      title: t('resources.guide_docs_t'), 
      url: "https://drive.google.com/file/d/12SjMJtQ78o30f-DLA7KcRxfZ5BCln3mB/view?usp=sharing",
      color: "from-blue-700 to-blue-900",
      type: "PDF"
    },
    { 
      title: t('resources.guide_fraud_t'), 
      url: "https://drive.google.com/file/d/1TrWR0A0RvuvKwcS6mrNEdf1LHzKinezE/view?usp=sharing",
      color: "from-purple-700 to-purple-900",
      type: "PDF"
    },
    { 
      title: t('resources.guide_statement_t'), 
      url: "https://drive.google.com/file/d/1taWJK_OVZtYWk1yXMtPH5jmwwH0-tADA/view?usp=sharing",
      color: "from-orange-700 to-orange-900",
      type: "PDF"
    },
    { 
      title: t('resources.guide_safety_t'), 
      url: "https://drive.google.com/file/d/1E7DusoA55-2zTljJGL7yHfm6bUgPTQ_9/view?usp=sharing",
      color: "from-cyan-700 to-cyan-900",
      type: "PDF"
    },
    { 
      title: t('resources.guide_form_t'), 
      url: "https://drive.google.com/file/d/1Nrmgvztrrk1qy1AghrzD4L40JKNgDcEx/view?usp=sharing",
      color: "from-pink-700 to-pink-900",
      type: "PDF"
    },
    {
      title: t('resources.guide_treaties_t'),
      url: "https://cs.mfa.gov.cn/zlbg/tyxy_660627/201402/t20140225_961624.shtml",
      color: "from-slate-700 to-slate-900",
      type: "WEB"
    },
    {
      title: t('resources.guide_regulation_t'),
      url: "https://cs.mfa.gov.cn/zlbg/flfg/gqqjxg/202312/t20231218_11205846.shtml",
      color: "from-indigo-700 to-indigo-900",
      type: "WEB"
    },
    {
      title: t('resources.guide_vienna_t'),
      url: "https://cs.mfa.gov.cn/zlbg/tyxy_660627/201107/t20110726_961616.shtml",
      color: "from-teal-700 to-teal-900",
      type: "WEB"
    }
  ];

  const newMedia = [
    { name: "中國領事服務網", src: "/images/中國領事服務網.webp" },
    { name: "“中國領事”APP", src: "/images/“中國領事”APP.webp" },
    { name: "“中國領事”支付寶小程序", src: "/images/“中國領事”支付寶小程序.webp" },
    { name: "“中國領事”微信小程序", src: "/images/“中國領事”微信小程序.webp" },
    { name: "“領事直通車”微信公眾號", src: "/images/“領事直通車”微信公眾號.webp" },
    { name: "“領事直通車”抖音", src: "/images/“領事直通車”抖音.webp" },
    { name: "“領事直通車”嗶哩嗶哩", src: "/images/“領事直通車”嗶哩嗶哩.webp" },
    { name: "“領事直通車”快手", src: "/images/“領事直通車”快手.webp" },
    { name: "“領事直通車”微博", src: "/images/“領事直通車”微博.webp" },
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50 font-sans pt-16">
      
      {/* Hero: Digital Backpack Theme - Standardized Size */}
      <div className="relative py-10 px-6 bg-[#FFC107] text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
            {t('resources.hero_title')}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg font-bold">
            {t('resources.hero_subtitle')}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-10">

        {/* Section 1: Official Guides Grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 px-1">
            <span>📚</span> {t('resources.section_guide')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {guides.map((guide, idx) => (
              <a 
                key={idx}
                href={guide.url}
                target="_blank"
                rel="noreferrer"
                className={`bg-gradient-to-br ${guide.color} rounded-2xl p-4 text-white relative overflow-hidden group shadow-lg hover:scale-[1.01] transition-transform`}
              >
                 <div className="absolute right-0 bottom-0 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">📖</div>
                 <div className="relative z-10">
                    <h3 className="text-sm font-bold leading-relaxed">
                        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded inline-block mr-2 backdrop-blur-md align-middle">
                          {guide.type || 'PDF'}
                        </span>
                        <span className="align-middle">{guide.title}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold opacity-80 group-hover:opacity-100">
                       <span>{guide.type === 'WEB' ? '點擊跳轉' : t('resources.download_btn')}</span>
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                 </div>
              </a>
            ))}
          </div>
          
          {/* Quick Tools */}
          <div className="grid grid-cols-2 gap-3">
             {/* Side Item 1 - Emergency Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute -right-2 -top-2 w-16 h-16 bg-yellow-50 rounded-full z-0"></div>
               <div className="relative z-10">
                  <div className="text-3xl mb-2">📇</div>
                  <h3 className="font-bold text-gray-800 text-sm leading-tight">{t('resources.guide_2_t')}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{t('resources.guide_2_d')}</p>
               </div>
            </div>

            {/* Side Item 2 - Flowchart */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute -right-2 -top-2 w-16 h-16 bg-blue-50 rounded-full z-0"></div>
               <div className="relative z-10">
                  <div className="text-3xl mb-2">🗺️</div>
                  <h3 className="font-bold text-gray-800 text-sm leading-tight">{t('resources.guide_3_t')}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{t('resources.guide_3_d')}</p>
               </div>
            </div>
          </div>
        </section>

        {/* Section: New Media Matrix (3x3 Grid) */}
        <section id="new-media" className="scroll-mt-24">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 px-1">
             <span>📱</span> {t('resources.section_media')}
           </h2>
           <div className="grid grid-cols-3 gap-3">
              {newMedia.map((media, idx) => (
                 <div key={idx} className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full aspect-square flex items-center justify-center overflow-hidden">
                       <img 
                         src={media.src}
                         alt={media.name} 
                         className="w-full h-full object-contain"
                         onError={(e) => { e.currentTarget.style.display = 'none'; }}
                       />
                    </div>
                    <span className="text-[10px] mt-1.5 font-bold text-gray-600 text-center leading-tight">{media.name}</span>
                 </div>
              ))}
           </div>
           <p className="text-center text-xs text-gray-400 mt-4">長按二維碼下載/掃描</p>
        </section>

        {/* Section: Macau One Account */}
        <section id="macau-one-account" className="scroll-mt-24">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 px-1">
             <span>📲</span> {t('resources.section_macau_one')}
           </h2>
           <div className="flex justify-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center gap-2">
                 <img 
                   src="/images/一戶通_iOS.webp" 
                   alt="Macau One Account iOS" 
                   width={180}
                   height={180}
                   className="rounded-xl shadow-md w-[140px] h-[140px] md:w-[180px] md:h-[180px] object-cover"
                 />
                 <span className="text-xs font-bold text-gray-500">iOS</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <img 
                   src="/images/一戶通_Android.webp" 
                   alt="Macau One Account Android" 
                   width={180}
                   height={180}
                   className="rounded-xl shadow-md w-[140px] h-[140px] md:w-[180px] md:h-[180px] object-cover"
                 />
                 <span className="text-xs font-bold text-gray-500">Android</span>
              </div>
           </div>
           <p className="text-center text-xs text-gray-400 mt-4">長按二維碼下載/掃描</p>
        </section>

        {/* Section 4: External Portals - Pill Buttons */}
        <section className="pb-8">
           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 px-1">
             <span>🔗</span> {t('resources.section_links')}
           </h2>
           <div className="flex flex-col gap-3">
              {links.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 bg-white px-4 py-4 rounded-xl border border-gray-200 shadow-sm hover:border-brand-blue hover:text-brand-blue transition-colors"
                >
                   <span className="text-xl shrink-0">{link.icon}</span>
                   <span className="text-sm font-bold flex-1">{link.label}</span>
                   <span className="text-gray-300 text-xs">↗</span>
                </a>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default Resources;
