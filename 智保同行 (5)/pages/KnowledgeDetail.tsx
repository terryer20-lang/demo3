
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { HOT_KNOWLEDGE_LIST } from '../constants';

const KnowledgeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const item = HOT_KNOWLEDGE_LIST.find(n => n.id === id);

  if (!item) {
    return (
      <div className="pt-24 p-4 text-center">
        <button onClick={() => navigate('/hot-knowledge')} className="text-brand-blue font-bold mb-4">&larr; {t('app.back')}</button>
        <div className="text-gray-500">Article not found</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 text-gray-500 font-bold flex items-center gap-1 hover:text-brand-blue transition-colors text-sm"
        >
          &larr; {t('app.back')}
        </button>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
           {/* Header with decorative pattern */}
           <div className="bg-gradient-to-r from-brand-blue to-purple-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
              
              <div className="relative z-10">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-bold border border-white/20">
                        #{tag}
                      </span>
                    ))}
                 </div>
                 <h1 className="text-2xl md:text-3xl font-black leading-tight">
                   {t(`hot_knowledge.${item.titleKey}`)}
                 </h1>
              </div>
           </div>

           {/* Content Body */}
           <div className="p-8">
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                 <div className="flex items-start gap-4 mb-6">
                    <span className="text-4xl">💡</span>
                    <p className="font-bold text-xl text-gray-900 mt-1">
                      {t(`hot_knowledge.${item.contentKey}`)}
                    </p>
                 </div>
                 
                 <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500 text-sm text-blue-800">
                    此資訊僅供參考，具體情況請以官方最新公告為準。如遇緊急情況，請立即聯繫外交部全球領保熱線 12308。
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeDetail;
