
import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';

const GameZone: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const games = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)); // Generates ['A', 'B', ... 'J']

  const handleGameClick = (game: string) => {
    if (game === 'A') {
      navigate('/game-zone/a');
    } else if (game === 'B') {
      navigate('/game-zone/b');
    } else if (game === 'C') {
      navigate('/game-zone/c');
    } else if (game === 'D') {
      navigate('/game-zone/d');
    } else if (game === 'E') {
      navigate('/game-zone/e');
    } else if (game === 'F') {
      navigate('/game-zone/f');
    }
  };

  const getGameTitle = (game: string) => {
    if (game === 'A') return '全球領事守護者';
    if (game === 'B') return '緊急聯絡配對';
    if (game === 'C') return '權利解碼員';
    if (game === 'D') return '安全路徑規劃師';
    if (game === 'E') return '領事信箱分揀員';
    if (game === 'F') return '全球風險解碼器';
    return `遊戲 ${game}`;
  }

  const isPlayable = (game: string) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(game);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-10 px-4 animate-fade-in font-sans">
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <button 
                  onClick={() => navigate(-1)} 
                  className="text-gray-400 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                    &larr; {t('app.back')}
                </button>
                <h1 className="text-2xl md:text-3xl text-white font-black drop-shadow-md tracking-wider">
                  {t('menu.game-zone')}
                </h1>
                <div className="w-16"></div> {/* Spacer for visual balance */}
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {games.map((game, index) => (
                    <div 
                      key={game} 
                      onClick={() => handleGameClick(game)}
                      className={`bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg hover:bg-slate-800/80 hover:border-brand-blue/50 hover:shadow-[0_0_20px_rgba(0,102,204,0.2)] transition-all cursor-pointer group flex flex-col items-center justify-center aspect-[4/5] relative overflow-hidden ${isPlayable(game) ? 'ring-2 ring-brand-blue/50' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -right-4 -bottom-4 text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none">
                          {game}
                        </div>

                        {/* Icon/Letter */}
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-purple-400 font-black drop-shadow-sm z-10">
                            {game}
                        </div>
                        
                        {/* Label */}
                        <h3 className="text-gray-300 font-bold text-lg group-hover:text-white transition-colors z-10 text-center leading-tight">
                            {getGameTitle(game)}
                        </h3>
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-white/5 transition-colors ${isPlayable(game) ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/10 text-gray-400'}`}>
                             {isPlayable(game) ? 'PLAY' : 'DEV'}
                           </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Footer Note */}
            <div className="mt-12 text-center animate-pulse">
               <p className="text-gray-500 text-xs bg-black/20 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/5">
                  <span className="text-lg">{t('app.construction')}</span>
                  <span>更多遊戲內容開發中</span>
               </p>
            </div>
        </div>
    </div>
  );
};

export default GameZone;
