
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// Types
interface LevelData {
  id: number;
  title: string;
  source: string; // e.g., "澳門基本法 第25條"
  scrambled: string[]; // The text chunks to order
  correctOrder: string[]; // The correct sequence
  hint: string;
  type: 'reorder' | 'fill'; // Expansion for future types
}

const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "平等權利之謎",
    source: "《澳門基本法》第二十五條",
    type: 'reorder',
    scrambled: ["一律平等", "澳門居民", "在法律面前", "不受歧視"],
    correctOrder: ["澳門居民", "在法律面前", "一律平等", "不受歧視"],
    hint: "主體是誰？在什麼面前？狀態如何？"
  },
  {
    id: 2,
    title: "自由的邊界",
    source: "《澳門基本法》第二十七條",
    type: 'reorder',
    scrambled: ["言論、新聞、出版", "澳門居民享有", "集會、遊行、示威", "的自由", "結社、組織和參加工會"],
    correctOrder: ["澳門居民享有", "言論、新聞、出版", "的自由", "結社、組織和參加工會", "集會、遊行、示威"],
    hint: "先說享有哪些基本的表達自由，再說群體性活動的權利。"
  },
  {
    id: 3,
    title: "領事保護核心",
    source: "領事保護定義",
    type: 'reorder',
    scrambled: ["維護", "中國駐外使領館", "正當權益", "中國公民及機構", "依法"],
    correctOrder: ["中國駐外使領館", "依法", "維護", "中國公民及機構", "正當權益"],
    hint: "誰（主體）？怎樣做（方式）？保護誰（對象）？"
  }
];

const GameRightsDecoder: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedChunks, setSelectedChunks] = useState<string[]>([]);
  const [availableChunks, setAvailableChunks] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success' | 'completed'>('intro');
  const [isWrong, setIsWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Load Progress
  useEffect(() => {
    const saved = localStorage.getItem('consular_game_c_progress');
    if (saved) {
      const level = parseInt(saved);
      if (level < LEVELS.length) {
        setCurrentLevelIdx(level);
      }
    }
  }, []);

  // Initialize Level
  useEffect(() => {
    if (gameState === 'playing') {
      // Shuffle chunks for display
      const chunks = [...LEVELS[currentLevelIdx].scrambled].sort(() => Math.random() - 0.5);
      setAvailableChunks(chunks);
      setSelectedChunks([]);
      setShowHint(false);
    }
  }, [currentLevelIdx, gameState]);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleSelectChunk = (chunk: string) => {
    setAvailableChunks(prev => prev.filter(c => c !== chunk));
    setSelectedChunks(prev => [...prev, chunk]);
    setIsWrong(false);
  };

  const handleDeselectChunk = (chunk: string) => {
    setSelectedChunks(prev => prev.filter(c => c !== chunk));
    setAvailableChunks(prev => [...prev, chunk]);
    setIsWrong(false);
  };

  const checkAnswer = () => {
    const currentLevel = LEVELS[currentLevelIdx];
    const isMatch = JSON.stringify(selectedChunks) === JSON.stringify(currentLevel.correctOrder);

    if (isMatch) {
      if (currentLevelIdx + 1 >= LEVELS.length) {
        setGameState('completed');
      } else {
        setGameState('success');
        // Save progress
        localStorage.setItem('consular_game_c_progress', (currentLevelIdx + 1).toString());
      }
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextLevel = () => {
    setCurrentLevelIdx(prev => prev + 1);
    setGameState('playing');
  };

  const resetGame = () => {
    setCurrentLevelIdx(0);
    localStorage.removeItem('consular_game_c_progress');
    setGameState('playing');
  };

  // --- Renders ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-8 animate-fade-in">
      <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <span className="text-5xl">🕵️</span>
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-wider">權利解碼員</h1>
        <p className="text-amber-200/80 font-serif italic text-sm">Rights Decoder</p>
      </div>
      <div className="bg-slate-900/80 p-6 rounded-lg border border-white/10 max-w-sm text-sm text-gray-300 leading-relaxed text-justify">
        <p className="mb-4">
          <span className="text-amber-400 font-bold">任務簡報：</span><br/>
          我們截獲了一批加密的法律文檔。作為特工，你需要運用邏輯與法律知識，將散亂的片段重組成完整的條款，解鎖居民權利的真相。
        </p>
        <p>準備好接受挑戰了嗎？</p>
      </div>
      <button 
        onClick={handleStart}
        className="px-10 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 border border-amber-400/30 tracking-widest"
      >
        開始解密
      </button>
    </div>
  );

  const renderGame = () => {
    const level = LEVELS[currentLevelIdx];
    return (
      <div className="max-w-2xl mx-auto w-full animate-slide-up flex flex-col h-full min-h-[60vh]">
        {/* Header */}
        <div className="flex justify-between items-end mb-6 border-b border-amber-500/30 pb-2">
          <div>
            <div className="text-[10px] text-amber-500/70 font-mono tracking-widest uppercase">Case File</div>
            <div className="text-xl font-bold text-white font-serif">#{String(level.id).padStart(3, '0')} : {level.title}</div>
          </div>
          <div className="text-xs text-gray-400">
            Level {currentLevelIdx + 1}/{LEVELS.length}
          </div>
        </div>

        {/* Decoder Screen */}
        <div className="flex-1 bg-black/30 rounded-t-xl border-x border-t border-white/10 p-6 relative">
          
          {/* Answer Area - The "Document" */}
          <div className={`min-h-[120px] bg-slate-100/5 rounded-lg border-2 border-dashed transition-all p-4 mb-8 flex flex-wrap gap-2 content-start ${isWrong ? 'border-red-500/50 bg-red-500/10 animate-shake' : 'border-white/20'}`}>
            {selectedChunks.length === 0 && (
              <div className="w-full text-center text-gray-600 text-sm italic mt-8 pointer-events-none">
                點擊下方片段重組條文...
              </div>
            )}
            {selectedChunks.map((chunk, idx) => (
              <button
                key={`${chunk}-${idx}`}
                onClick={() => handleDeselectChunk(chunk)}
                className="bg-amber-100 text-slate-900 px-3 py-1.5 rounded shadow-sm font-bold text-sm md:text-base border border-amber-200 hover:bg-red-100 hover:text-red-800 transition-colors animate-pop-in"
              >
                {chunk}
              </button>
            ))}
          </div>

          {/* Hint Area */}
          {showHint && (
             <div className="absolute top-4 right-4 max-w-[200px] bg-yellow-900/90 text-yellow-100 text-xs p-3 rounded-lg border border-yellow-500/30 shadow-xl backdrop-blur-md z-10 animate-fade-in">
                <span className="font-bold block mb-1">💡 提示：</span>
                {level.hint}
             </div>
          )}

          {/* Source Area (Pool) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableChunks.map((chunk, idx) => (
              <button
                key={`${chunk}-${idx}`}
                onClick={() => handleSelectChunk(chunk)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-200 px-3 py-3 rounded border border-white/10 shadow-lg font-medium text-sm transition-all active:scale-95"
              >
                {chunk}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-white/10 rounded-b-xl p-4 flex justify-between items-center gap-4">
           <button 
             onClick={() => setShowHint(!showHint)}
             className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-amber-400 hover:bg-white/5 active:scale-90 transition-all"
             aria-label="Hint"
           >
             ?
           </button>
           
           <div className="flex gap-2">
             <button
               onClick={() => { setSelectedChunks([]); setAvailableChunks([...level.scrambled].sort(() => Math.random() - 0.5)); }}
               className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
             >
               重置
             </button>
             <button
               onClick={checkAnswer}
               disabled={availableChunks.length > 0}
               className={`px-6 py-2 rounded font-bold text-sm transition-all ${
                 availableChunks.length === 0 
                   ? 'bg-amber-600 text-white shadow-lg hover:bg-amber-500' 
                   : 'bg-gray-800 text-gray-600 cursor-not-allowed'
               }`}
             >
               解碼
             </button>
           </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 animate-fade-in space-y-6">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-4xl border-2 border-green-500/50 mb-4 animate-bounce">
        🔓
      </div>
      <h2 className="text-2xl font-bold text-white">解密成功</h2>
      
      <div className="bg-white/10 p-6 rounded-lg border-l-4 border-amber-500 text-left w-full max-w-md relative overflow-hidden">
         {/* Stamp Effect */}
         <div className="absolute -right-4 -bottom-4 w-24 h-24 border-4 border-red-500/30 rounded-full flex items-center justify-center transform -rotate-12 pointer-events-none">
            <span className="text-red-500/30 font-black text-xs tracking-widest uppercase border-y border-red-500/30 py-1">Verified</span>
         </div>

         <div className="text-xs text-amber-400 mb-2 font-mono">{LEVELS[currentLevelIdx].source}</div>
         <p className="text-lg font-serif text-white font-medium leading-relaxed">
           {LEVELS[currentLevelIdx].correctOrder.join("")}
         </p>
      </div>

      <button
        onClick={nextLevel}
        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg shadow-xl hover:scale-105 transition-transform"
      >
        下一個檔案 &rarr;
      </button>
    </div>
  );

  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
      <div className="text-6xl mb-6">🏆</div>
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-4">
        金牌權利解碼員
      </h1>
      <p className="text-gray-300 max-w-sm mb-8 leading-relaxed">
        恭喜！你已成功破譯所有核心法律檔案。你對《基本法》與領事保護精神的掌握已達到特工級別。
      </p>
      
      {/* Badge Visual */}
      <div className="w-48 h-64 bg-slate-800 rounded border border-yellow-600/30 p-4 shadow-2xl relative mb-8 flex flex-col items-center justify-between">
         <div className="w-full h-1 bg-yellow-600/30"></div>
         <div className="text-4xl">🇲🇴</div>
         <div className="text-center">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Certified</div>
            <div className="font-bold text-amber-500">Rights Agent</div>
         </div>
         <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">PHOTO</span>
         </div>
         <div className="w-full h-8 bg-white/5 mt-2"></div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/game-zone')}
          className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg border border-white/10"
        >
          返回大廳
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg"
        >
          重玩
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4 font-sans relative overflow-hidden text-slate-200 selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
         <div className="absolute top-0 left-10 w-[1px] h-full bg-white/5"></div>
         <div className="absolute top-0 right-10 w-[1px] h-full bg-white/5"></div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mb-4">
         <button 
            onClick={() => navigate('/game-zone')} 
            className="text-gray-500 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm px-3 py-1.5"
         >
            &larr; {t('app.back')}
         </button>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'success' && renderSuccess()}
        {gameState === 'completed' && renderCompleted()}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default GameRightsDecoder;
