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
    { rank: 11, user: "Gao**", score: 1600 },
    { rank: 12, user: "User_991", score: 1550 },
    { rank: 13, user: "Ip**", score: 1520 },
    { rank: 14, user: "Cheung**", score: 1480 },
    { rank: 15, user: "User_332", score: 1450 },
    { rank: 16, user: "Fong**", score: 1400 },
    { rank: 17, user: "Leong**", score: 1380 },
    { rank: 18, user: "Ng**", score: 1350 },
    { rank: 19, user: "User_771", score: 1300 },
    { rank: 20, user: "Kuok**", score: 1250 },
  ];

  const mockWeeklyLeaderboard = [
    { rank: 1, user: "User_882", score: 850 },
    { rank: 2, user: "陳**", score: 720 },
    { rank: 3, user: "Zhang**", score: 690 },
    { rank: 4, user: "Li**", score: 650 },
    { rank: 5, user: "Wong**", score: 600 },
    { rank: 6, user: "Sou**", score: 580 },
    { rank: 7, user: "User_112", score: 550 },
    { rank: 8, user: "Ho**", score: 520 },
    { rank: 9, user: "Leung**", score: 500 },
    { rank: 10, user: "User_445", score: 480 },
    { rank: 11, user: "Chan**", score: 460 },
    { rank: 12, user: "Wu**", score: 440 },
    { rank: 13, user: "Lam**", score: 420 },
    { rank: 14, user: "User_009", score: 400 },
    { rank: 15, user: "Pun**", score: 380 },
    { rank: 16, user: "Lok**", score: 360 },
    { rank: 17, user: "Choi**", score: 340 },
    { rank: 18, user: "User_551", score: 320 },
    { rank: 19, user: "Sam**", score: 300 },
    { rank: 20, user: "Vong**", score: 280 },
  ];

  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1: // Gold
        return 'bg-gradient-to-r from-yellow-500/30 via-yellow-500/10 to-transparent border-l-4 border-yellow-400';
      case 2: // Silver
        return 'bg-gradient-to-r from-slate-400/30 via-slate-400/10 to-transparent border-l-4 border-slate-300';
      case 3: // Bronze
        return 'bg-gradient-to-r from-orange-700/30 via-orange-700/10 to-transparent border-l-4 border-orange-600';
      default:
        return 'hover:bg-white/5 border-l-4 border-transparent';
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: 
        return <span className="text-2xl filter drop-shadow-md">🥇</span>;
      case 2: 
        return <span className="text-2xl filter drop-shadow-md">🥈</span>;
      case 3: 
        return <span className="text-2xl filter drop-shadow-md">🥉</span>;
      default:
        return (
          <div className="w-8 h-8 flex items-center justify-center rounded-full font-bold italic text-sm text-gray-500 border border-white/10 bg-white/5">
            {rank}
          </div>
        );
    }
  };

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
              <div 
                key={item.rank} 
                className={`flex items-center justify-between p-4 transition-all duration-300 ${getRowStyle(item.rank)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center shrink-0">
                    {getRankBadge(item.rank)}
                  </div>
                  <span className={`text-sm font-bold ${item.rank <= 3 ? 'text-white scale-105' : 'text-gray-200'}`}>
                    {item.user}
                  </span>
                </div>
                <span className={`text-sm font-bold px-2 py-0.5 rounded border ${item.rank <= 3 ? 'text-white border-white/30 bg-white/10' : 'text-green-400 bg-green-500/10 border-green-500/20'}`}>
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
              <div 
                key={item.rank} 
                className={`flex items-center justify-between p-4 transition-all duration-300 ${getRowStyle(item.rank)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center shrink-0">
                    {getRankBadge(item.rank)}
                  </div>
                  <span className={`text-sm font-bold ${item.rank <= 3 ? 'text-white scale-105' : 'text-gray-200'}`}>
                    {item.user}
                  </span>
                </div>
                <span className={`text-sm font-bold px-2 py-0.5 rounded border ${item.rank <= 3 ? 'text-white border-white/30 bg-white/10' : 'text-brand-blue bg-blue-500/10 border-blue-500/20'}`}>
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