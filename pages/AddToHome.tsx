
import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';

const AddToHome: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-10 px-4 min-h-screen bg-transparent">
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <button 
                  onClick={() => navigate(-1)} 
                  className="text-gray-400 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                    &larr; {t('app.back')}
                </button>
                <h1 className="text-xl md:text-2xl text-white font-black drop-shadow-md tracking-wider">
                  {t('menu.add-to-home')}
                </h1>
                <div className="w-16"></div> {/* Spacer for visual balance */}
            </div>

            {/* Placeholder Content */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg text-center">
                <div className="text-6xl mb-6 animate-pulse">📲</div>
                <p className="text-gray-300 text-lg">
                    {t('app.placeholder')}
                </p>
            </div>
        </div>
    </div>
  );
};

export default AddToHome;
