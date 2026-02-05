import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { MOCK_NOTIFICATIONS } from '../constants';

const NotificationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const notification = MOCK_NOTIFICATIONS.find(n => n.id === id);

  if (!notification) {
    return (
      <div className="pt-24 p-4 text-center">
        <button onClick={() => navigate('/')} className="text-brand-blue font-bold mb-4">&larr; {t('app.back')}</button>
        <div className="text-gray-500">Notification not found</div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-4 max-w-2xl mx-auto min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-6 text-brand-blue font-bold flex items-center gap-1 hover:underline">
        &larr; {t('app.back')}
      </button>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-xs font-bold">{notification.date}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">{t(`data.notifications.${id}`)}</h1>
        <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed max-w-none">
           <p className="mb-4">
             {t('app.placeholder')}
           </p>
           <p className="mb-4">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
           </p>
           <p>
             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
           </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;