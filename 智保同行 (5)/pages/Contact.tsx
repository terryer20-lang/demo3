
import React from 'react';
import { useLanguage } from '../LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  const handleEmailClick = () => {
    window.location.href = "mailto:infodoprogramaem2526@gmail.com";
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50 font-sans">
      
      {/* Hero: Space/Connection Theme */}
      <div className="relative pt-32 pb-16 px-6 bg-brand-dark overflow-hidden rounded-b-[3rem] shadow-2xl mb-8">
        {/* Animated Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
            {t('contact.hero_title')}
          </h1>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* 0. Logo Section */}
        <div className="flex flex-col items-center">
           <div className="flex justify-center items-center gap-6 mb-4">
              <img 
                src="/images/ELCTP_1.webp" 
                alt="ELCTP Logo" 
                className="w-36 h-36 object-contain drop-shadow-lg"
                width={500}
                height={455}
              />
              <img 
                src="/images/Escudos de Quíron_2.webp" 
                alt="Escudos de Quíron Logo" 
                className="w-36 h-36 object-contain drop-shadow-lg"
              />
           </div>
           {/* Disclaimer Text */}
           <div className="text-xs text-gray-500 text-justify leading-relaxed opacity-80 max-w-lg">
              {t('contact.disclaimer')}
           </div>
        </div>

        {/* Group Photo - Moved here as requested */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
           <img 
             src="/images/大合照.webp" 
             alt="Group Photo" 
             className="w-full h-auto object-cover block"
             width={1054}
             height={699}
           />
        </div>

        {/* 1. Holographic ID Card (Office Info & Phone) */}
        <div className="perspective-1000">
           <div className="relative bg-gray-900 rounded-2xl p-5 text-white shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.01] border border-gray-700/50 group">
              
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                 <img 
                   src="/images/ELCTP_2.webp" 
                   alt="Background" 
                   className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-900/70"></div>
              </div>

              {/* Holographic Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 skew-x-12 animate-slide-in z-10"></div>
              
              <div className="relative z-20 flex flex-col gap-4">
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="text-xl mb-1">🇲🇴</div>
                       <h2 className="font-bold text-lg leading-tight whitespace-pre-line text-gray-100">{t('contact.dept_name')}</h2>
                    </div>
                    <div className="text-3xl opacity-10 font-black tracking-tighter">ELCTP</div>
                 </div>

                 <div className="space-y-3 mt-1 text-sm border-t border-gray-700/50 pt-3">
                    <div className="flex items-center gap-3">
                       <span className="text-blue-400 shrink-0">📍</span>
                       <span className="text-gray-300 text-xs">{t('contact.dept_address')}</span>
                    </div>
                    
                    <a href="tel:+85328456071" className="flex items-center gap-3 group active:opacity-70 transition-opacity">
                       <span className="text-blue-400 shrink-0">📞</span>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{t('contact.phone_label')}</span>
                          <span className="text-white font-mono font-bold text-lg leading-none group-hover:text-blue-300 transition-colors">2845 6071</span>
                       </div>
                    </a>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Email Button - Full Width */}
        <div 
           onClick={handleEmailClick}
           className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 active:scale-[0.98] transition-all group cursor-pointer"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                   ✉️
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-xs text-gray-400 font-bold uppercase">{t('contact.email_label')}</div>
                   <div className="font-mono font-bold text-gray-800 text-sm mt-0.5 truncate">infodoprogramaem2526@gmail.com</div>
                </div>
            </div>
            <div className="text-gray-300 text-xl group-hover:text-purple-500 transition-colors shrink-0">
              &rarr;
            </div>
        </div>

        {/* 3. Feedback Button (Redesigned to match Email Button) */}
        <a 
           href="https://docs.google.com/forms/d/e/1FAIpQLSfsitNjYuOlAVM9jdOV4RKiNhuMKmiIZ_83rMQ39OcQK22MEw/viewform?usp=publish-editor"
           target="_blank"
           rel="noopener noreferrer"
           className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 active:scale-[0.98] transition-all group cursor-pointer text-left"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                   📝
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-xs text-gray-400 font-bold uppercase">{t('contact.feedback_label')}</div>
                   <div className="font-bold text-gray-800 text-sm mt-0.5 truncate">{t('contact.feedback_btn')}</div>
                </div>
            </div>
            <div className="text-gray-300 text-xl group-hover:text-blue-500 transition-colors shrink-0">
              &rarr;
            </div>
        </a>

      </div>
    </div>
  );
};

export default Contact;
