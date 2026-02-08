
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Game Configuration
const GAME_DURATION = 90; // seconds
const PAIR_COUNT = 5;

interface CardData {
  id: string; // Unique instance ID
  pairId: number; // ID to check matches
  content: string;
  type: 'text' | 'number';
  isFlipped: boolean;
  isMatched: boolean;
}

const RAW_PAIRS = [
  { id: 1, text: "外交部全球領保熱線", number: "+86-10-12308" },
  { id: 2, text: "駐澳公署領保熱線", number: "+853 66888353" },
  { id: 3, text: "澳門治安警察局", number: "+853 28573333" },
  { id: 4, text: "旅遊危機處理辦公室", number: "+853 28333000" },
  { id: 5, text: "駐日本大使館", number: "+81 3 3403 3065" },
];

const GameB: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [isProcessing, setIsProcessing] = useState(false); // Block interaction during animations

  const timerRef = useRef<number | null>(null);

  // Initialize Game
  const startGame = () => {
    // Generate card pairs
    const deck: CardData[] = [];
    RAW_PAIRS.forEach((pair) => {
      // Card 1: Location/Name
      deck.push({
        id: `pair-${pair.id}-text`,
        pairId: pair.id,
        content: pair.text,
        type: 'text',
        isFlipped: false,
        isMatched: false,
      });
      // Card 2: Number
      deck.push({
        id: `pair-${pair.id}-num`,
        pairId: pair.id,
        content: pair.number,
        type: 'number',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedIds([]);
    setMatchedCount(0);
    setMoves(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    setIsProcessing(false);
  };

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('lost');
      // Flip all cards to show answers
      setCards(prev => prev.map(c => ({ ...c, isFlipped: true })));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  // Card Click Handler
  const handleCardClick = (id: string) => {
    // Validation
    if (gameState !== 'playing' || isProcessing) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    // Flip the card
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    
    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);

    // Check match if 2 cards flipped
    if (newFlippedIds.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      checkForMatch(newFlippedIds[0], newFlippedIds[1]);
    }
  };

  const checkForMatch = (id1: string, id2: string) => {
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);

    if (card1 && card2 && card1.pairId === card2.pairId) {
      // Match Found
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          (c.id === id1 || c.id === id2) ? { ...c, isMatched: true } : c
        ));
        setFlippedIds([]);
        setMatchedCount(prev => {
          const newCount = prev + 1;
          if (newCount === PAIR_COUNT) {
            setGameState('won');
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return newCount;
        });
        setIsProcessing(false);
      }, 500);
    } else {
      // No Match
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          (c.id === id1 || c.id === id2) ? { ...c, isFlipped: false } : c
        ));
        setFlippedIds([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  // Render Screens
  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center p-6">
      <div className="text-8xl mb-6 drop-shadow-lg">📇</div>
      <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
        緊急聯絡配對
      </h1>
      <p className="text-gray-400 mb-8 max-w-sm">
        在 90 秒內，找出所有地點與對應的緊急電話號碼。
      </p>
      <button
        onClick={startGame}
        className="px-8 py-4 bg-brand-blue text-white font-bold text-xl rounded-full shadow-[0_0_20px_rgba(0,102,204,0.5)] transition-transform hover:scale-105 active:scale-95"
      >
        開始遊戲
      </button>
    </div>
  );

  const renderEndScreen = (won: boolean) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-6xl mb-4 animate-bounce">
          {won ? '🏆' : '⏰'}
        </div>
        <h2 className={`text-3xl font-black mb-2 ${won ? 'text-green-400' : 'text-red-400'}`}>
          {won ? '挑戰成功！' : '時間到！'}
        </h2>
        <p className="text-gray-300 mb-6">
          {won ? '你已熟記關鍵號碼，安全意識滿分！' : '別灰心，多試幾次就能記住這些救命號碼！'}
        </p>
        
        <div className="bg-white/5 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4">
           <div>
             <div className="text-xs text-gray-500 uppercase">得分</div>
             <div className="text-xl font-bold text-white">{matchedCount * 10}</div>
           </div>
           <div>
             <div className="text-xs text-gray-500 uppercase">嘗試次數</div>
             <div className="text-xl font-bold text-white">{moves}</div>
           </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/game-zone')}
            className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl"
          >
            返回
          </button>
          <button
            onClick={startGame}
            className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-xl"
          >
            重試
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent pt-20 pb-10 px-4 font-sans select-none">
      
      {/* Header Info */}
      <div className="max-w-md mx-auto mb-6 flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
         <button 
            onClick={() => navigate('/game-zone')} 
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-300 hover:text-white"
         >
            &larr;
         </button>
         
         <div className="flex items-center gap-6">
            <div className="text-center">
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time</div>
               <div className={`text-xl font-black font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                 {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
               </div>
            </div>
            <div className="text-center">
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Moves</div>
               <div className="text-xl font-black text-brand-blue font-mono">{moves}</div>
            </div>
            <div className="text-center">
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Score</div>
               <div className="text-xl font-black text-green-400 font-mono">{matchedCount * 10}</div>
            </div>
         </div>
      </div>

      {/* Game Board */}
      <div className="max-w-2xl mx-auto relative">
        {gameState === 'start' ? renderStartScreen() : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 aspect-[4/5] md:aspect-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`relative cursor-pointer group perspective-1000 w-full h-24 md:h-28`}
              >
                <div 
                  className={`w-full h-full duration-500 preserve-3d transition-transform relative ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''} ${card.isMatched ? 'scale-95 z-0' : 'z-10'}`}
                >
                  {/* Card Back (Face Down) */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-white/10 shadow-md flex items-center justify-center hover:border-brand-blue/50 transition-colors">
                     <div className="text-2xl opacity-50">🛡️</div>
                  </div>

                  {/* Card Front (Face Up) */}
                  <div 
                    className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border flex items-center justify-center p-2 text-center shadow-lg bg-slate-800 ${card.isMatched ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-white/20 text-white'}`}
                  >
                     <span className={`${card.type === 'number' ? 'text-xs md:text-sm font-mono font-bold' : 'text-xs md:text-sm font-bold leading-tight'}`}>
                       {card.content}
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {(gameState === 'won' || gameState === 'lost') && renderEndScreen(gameState === 'won')}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default GameB;
