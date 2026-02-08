
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
    <div className="pb-24 min-h-screen bg-transparent">
      <div className="relative pt-32 pb-10 px-6 bg-gradient-to-br from-yellow-500/80 to-orange-600/80 backdrop-blur-md text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden border-b border-white/20">
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
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
          <div className="bg-white/5 p-4 border-b border-white/10">
             <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <span>🏆</span> {t('challenge.leaderboard_title')}
             </h3>
          </div>
          
          <div className="divide-y divide-white/5">
            {mockLeaderboard.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold italic text-sm border
                    ${item.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 
                      item.rank === 2 ? 'bg-gray-400/20 text-gray-300 border-gray-400/50' : 
                      item.rank === 3 ? 'bg-orange-600/20 text-orange-400 border-orange-600/50' : 'text-gray-500 border-transparent bg-white/5'}`}>
                    {item.rank}
                  </div>
                  <span className="text-sm font-bold text-gray-200">{item.user}</span>
                </div>
                <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                  {item.score} {t('challenge.score_suffix')}
                </span>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/5">
             <a 
               href="https://docs.google.com/spreadsheets/d/1DWOBJv_kEMX2ITArOUAEXNMinZ3Ec6mW4Qh1nTHDaKk/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer"
               className="block w-full text-center py-2.5 rounded-xl border border-yellow-500/30 text-yellow-400 font-bold text-sm bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
             >
               📄 {t('challenge.view_score_sheet')}
             </a>
          </div>

          <div className="p-4 bg-black/20 text-center text-xs text-gray-500 border-t border-white/5">
             排行榜每週一 00:00 更新
          </div>
        </div>

        {/* Weekly Leaderboard */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
          <div className="bg-white/5 p-4 border-b border-white/10">
             <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <span>📅</span> {t('challenge.weekly_leaderboard_title')}
             </h3>
          </div>
          
          <div className="divide-y divide-white/5">
            {mockWeeklyLeaderboard.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold italic text-sm border
                    ${item.rank === 1 ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 
                      item.rank === 2 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 
                      item.rank === 3 ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'text-gray-500 border-transparent bg-white/5'}`}>
                    {item.rank}
                  </div>
                  <span className="text-sm font-bold text-gray-200">{item.user}</span>
                </div>
                <span className="text-sm font-bold text-brand-blue bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {item.score} {t('challenge.score_suffix')}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5">
             <a 
               href="https://docs.google.com/spreadsheets/d/1LtmfQCz4PS7gULKMhytSFMcYaT_6pqPzfuGWOs-7RWA/edit?usp=sharing"
               target="_blank"
               rel="noopener noreferrer"
               className="block w-full text-center py-2.5 rounded-xl border border-blue-500/30 text-blue-400 font-bold text-sm bg-blue-500/10 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
             >
               📄 {t('challenge.view_score_sheet')}
             </a>
          </div>

          <div className="p-4 bg-black/20 text-center text-xs text-gray-500 border-t border-white/5">
             排行榜每週一 00:00 更新
          </div>
        </div>

      </div>
    </div>
  );
};

export default Challenge;
