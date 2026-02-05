
import React from 'react';
import { useLanguage } from '../LanguageContext';

const Challenge: React.FC = () => {
  const { t } = useLanguage();

  const mockLeaderboard = [
    { rank: 1, user: "陳**", score: 2850 },
    { rank: 2, user: "Li**", score: 2720 },
    { rank: 3, user: "Wong**", score: 2690 },
    { rank: 4, user: "張**", score: 2450 },
    { rank: 5, user: "User_882", score: 2300 },
    { rank: 6, user: "Ho**", score: 2150 },
    { rank: 7, user: "劉**", score: 1980 },
    { rank: 8, user: "Maca**", score: 1850 },
    { rank: 9, user: "Sou**", score: 1700 },
    { rank: 10, user: "User_103", score: 1650 },
  ];

  const mockWeeklyLeaderboard = [
    { rank: 1, user: "User_882", score: 850 },
    { rank: 2, user: "陳**", score: 720 },
    { rank: 3, user: "Zhang**", score: 690 },
    { rank: 4, user: "Li**", score: 650 },
    { rank: 5, user: "Wong**", score: 600 },
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <div className="relative pt-32 pb-10 px-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
            {t('challenge.hero_title')}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg">
            {t('challenge.hero_desc')}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Total Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-50 to-white p-4 border-b border-gray-100">
             <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <span>🏆</span> {t('challenge.leaderboard_title')}
             </h3>
          </div>
          
          <div className="divide-y divide-gray-50">
            {mockLeaderboard.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold italic text-sm
                    ${item.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                      item.rank === 2 ? 'bg-gray-100 text-gray-600' : 
                      item.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
                    {item.rank}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{item.user}</span>
                </div>
                <span className="text-sm font-bold text-brand-green bg-green-50 px-2 py-0.5 rounded">
                  {item.score} {t('challenge.score_suffix')}
                </span>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-50">
             <a 
               href="https://docs.google.com/spreadsheets/d/1DWOBJv_kEMX2ITArOUAEXNMinZ3Ec6mW4Qh1nTHDaKk/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer"
               className="block w-full text-center py-2.5 rounded-xl border border-yellow-200 text-yellow-700 font-bold text-sm hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
             >
               📄 {t('challenge.view_score_sheet')}
             </a>
          </div>

          <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
             排行榜每週一 00:00 更新
          </div>
        </div>

        {/* Weekly Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-100">
             <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <span>📅</span> {t('challenge.weekly_leaderboard_title')}
             </h3>
          </div>
          
          <div className="divide-y divide-gray-50">
            {mockWeeklyLeaderboard.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold italic text-sm
                    ${item.rank === 1 ? 'bg-blue-100 text-blue-600' : 
                      item.rank === 2 ? 'bg-cyan-100 text-cyan-600' : 
                      item.rank === 3 ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}>
                    {item.rank}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{item.user}</span>
                </div>
                <span className="text-sm font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                  {item.score} {t('challenge.score_suffix')}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-50">
             <a 
               href="https://docs.google.com/spreadsheets/d/1LtmfQCz4PS7gULKMhytSFMcYaT_6pqPzfuGWOs-7RWA/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer"
               className="block w-full text-center py-2.5 rounded-xl border border-blue-200 text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
             >
               📄 {t('challenge.view_score_sheet')}
             </a>
          </div>

          <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
             排行榜每週一 00:00 更新
          </div>
        </div>

      </div>
    </div>
  );
};

export default Challenge;
