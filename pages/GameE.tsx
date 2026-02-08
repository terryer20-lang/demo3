import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Types ---
type Category = 'red' | 'yellow' | 'blue';

interface MailItem {
  id: number;
  text: string;
  category: Category;
  x: number; // Percentage 0-100
  speed: number; // Animation duration in seconds
  isDragging: boolean;
}

interface Question {
  text: string;
  category: Category;
  explanation: string;
}

// --- Data ---
const QUESTIONS: Question[] = [
  // Red: Consular Duties
  { text: "護照被偷，急需回國", category: 'red', explanation: "補辦緊急旅行證件是領事館的核心職能。" },
  { text: "遭遇地震，請求撤離", category: 'red', explanation: "重大突發事件撤離協助屬於領事保護範圍。" },
  { text: "被當地警方拘留", category: 'red', explanation: "你有權要求領事探視，保障人道待遇。" },
  { text: "家人在海外失蹤", category: 'red', explanation: "使領館可提供尋人渠道建議並協助聯絡。" },
  { text: "遭遇嚴重車禍受傷", category: 'red', explanation: "使領館可協助聯繫家人及提供當地醫療名單。" },
  
  // Yellow: Local Authorities/Legal
  { text: "餐廳結帳糾紛", category: 'yellow', explanation: "商業糾紛應報警或向當地消保機構投訴，領館不介入仲裁。" },
  { text: "違章停車罰單", category: 'yellow', explanation: "違反當地法規需自行處理，領館不能干預司法。" },
  { text: "房東扣押租金", category: 'yellow', explanation: "屬民事糾紛，應通過當地法律途徑或律師解決。" },
  { text: "錢包在街上被搶", category: 'yellow', explanation: "涉及刑事案件，第一步必須先向當地警方報案。" },
  { text: "航班延誤索賠", category: 'yellow', explanation: "屬商業合同糾紛，應與航空公司協商。" },

  // Blue: Self Service
  { text: "預訂回程機票", category: 'blue', explanation: "個人行程安排需自行處理。" },
  { text: "尋找網紅餐廳", category: 'blue', explanation: "吃喝玩樂資訊請查詢旅遊攻略。" },
  { text: "手機摔壞買新的", category: 'blue', explanation: "個人財物損壞需自行解決。" },
  { text: "辦理其他國家簽證", category: 'blue', explanation: "前往第三國簽證應諮詢該國使領館。" },
  { text: "兌換當地貨幣", category: 'blue', explanation: "請前往銀行或兌換店辦理。" },
];

const GameE: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Game State
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<MailItem[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  // Refs for logic
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const scoreRef = useRef(0); // Ref for immediate access in loop

  // Refs for Bins (to calculate collision)
  const redBinRef = useRef<HTMLDivElement>(null);
  const yellowBinRef = useRef<HTMLDivElement>(null);
  const blueBinRef = useRef<HTMLDivElement>(null);

  // --- Game Logic ---

  const spawnItem = useCallback(() => {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    // Spawn mostly in center 20-80% to ensure draggable on mobile
    const randomX = 20 + Math.random() * 60; 
    // Speed increases with score
    const baseSpeed = 8;
    const speed = Math.max(3, baseSpeed - Math.floor(scoreRef.current / 50) * 0.5);

    const newItem: MailItem = {
      id: nextIdRef.current++,
      text: q.text,
      category: q.category,
      x: randomX,
      speed: speed,
      isDragging: false,
    };

    setItems(prev => [...prev, newItem]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== 'playing') return;

    // Spawning Logic
    // Base spawn rate 2500ms, decreases as score increases
    const spawnRate = Math.max(1200, 2500 - scoreRef.current * 10);
    if (timestamp - lastSpawnTimeRef.current > spawnRate) {
      spawnItem();
      lastSpawnTimeRef.current = timestamp;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, spawnItem]);

  useEffect(() => {
    if (gameState === 'playing') {
      scoreRef.current = 0;
      setScore(0);
      setLives(3);
      setItems([]);
      lastSpawnTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, gameLoop]);

  // Remove items that fall off screen (handled via onAnimationEnd in CSS usually, 
  // but here we need logic. Simplified: The React component handles the animation, 
  // we just need to know when to remove it from state to prevent memory leaks?
  // Actually, strictly purely CSS animation makes "state removal" hard without a timer.
  // We will use a `setTimeout` inside the MailItem component to self-destruct if not dragged.

  const handleCorrect = () => {
    setScore(s => {
      const newScore = s + 10;
      scoreRef.current = newScore;
      return newScore;
    });
    if (navigator.vibrate) navigator.vibrate(50);
    // Success feedback is purely visual/audio
  };

  const handleWrong = (explanation: string) => {
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) setGameState('gameover');
      return newLives;
    });
    setFeedback({ msg: explanation, type: 'error' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDrop = (item: MailItem, clientX: number, clientY: number) => {
    // 1. Identify which bin is under the drop point
    const redRect = redBinRef.current?.getBoundingClientRect();
    const yellowRect = yellowBinRef.current?.getBoundingClientRect();
    const blueRect = blueBinRef.current?.getBoundingClientRect();

    let targetCategory: Category | null = null;

    if (redRect && isInside(clientX, clientY, redRect)) targetCategory = 'red';
    else if (yellowRect && isInside(clientX, clientY, yellowRect)) targetCategory = 'yellow';
    else if (blueRect && isInside(clientX, clientY, blueRect)) targetCategory = 'blue';

    // 2. Logic
    if (targetCategory) {
      if (targetCategory === item.category) {
        handleCorrect();
      } else {
        const q = QUESTIONS.find(q => q.text === item.text);
        handleWrong(q?.explanation || "分類錯誤");
      }
      // Remove item
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      // Dropped in empty space? Resume falling? 
      // For simplicity, if dropped outside, we just snap it back to falling (reactivate CSS) 
      // OR we count it as a miss if it's too low. 
      // Let's just let it resume falling by updating `isDragging` to false.
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isDragging: false } : i));
    }
  };

  const isInside = (x: number, y: number, rect: DOMRect) => {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  // --- Sub-Component for individual falling item ---
  const FallingItem = ({ item }: { item: MailItem }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 }); // Offset during drag
    // Initial Spawn Position is handled by CSS left
    
    // Self-destruct if falls out of bounds (animation duration)
    useEffect(() => {
      if (!item.isDragging) {
        const timer = setTimeout(() => {
           // If it reaches here, it wasn't dragged in time
           setItems(prev => prev.filter(i => i.id !== item.id));
           // Penalty for missing? Optional. Let's not penalize missing for now to keep it casual, or small penalty.
           // Let's deduct score slightly but not life.
           setScore(s => Math.max(0, s - 5));
        }, item.speed * 1000);
        return () => clearTimeout(timer);
      }
    }, [item.isDragging, item.speed, item.id]);

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
      e.stopPropagation(); // Prevent bg scroll
      // Find the element's current visual position to avoid snapping
      const element = e.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      
      // Update global item state to dragging
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isDragging: true } : i));
      
      // Set local position to current visual coordinates relative to viewport
      // We need to convert this to fixed position style
      // Actually, easier: transform translate relative to touch delta? 
      // Let's stick to: On drag start, element becomes fixed/absolute at current XY.
    };

    // Note: The main logic for "Follow Finger" is better handled globally or via specific drag lib.
    // Implementing a simple version here:
    // When dragging, we use a fixed overlay driven by `activeDragItem` state in parent?
    // Let's try separate approach:
    // This component purely handles the falling animation.
    // If user touches it, we remove it from the list and create a "FloatingItem" that follows cursor.
    return (
        <div
            className={`absolute top-[-100px] cursor-grab active:cursor-grabbing select-none z-20 touch-none`}
            style={{
                left: `${item.x}%`,
                animation: item.isDragging ? 'none' : `fall ${item.speed}s linear forwards`,
                display: item.isDragging ? 'none' : 'block' // Hide if being dragged globally
            }}
            onMouseDown={(e) => startDrag(item, e.clientX, e.clientY)}
            onTouchStart={(e) => startDrag(item, e.touches[0].clientX, e.touches[0].clientY)}
        >
            <div className="bg-white text-slate-800 text-xs font-bold p-3 rounded-md shadow-lg border-l-4 border-slate-300 w-32 text-center transform rotate-1 hover:scale-110 transition-transform">
                {item.text}
            </div>
        </div>
    )
  }

  // Global Drag State
  const [dragItem, setDragItem] = useState<{ item: MailItem, x: number, y: number } | null>(null);

  const startDrag = (item: MailItem, clientX: number, clientY: number) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isDragging: true } : i));
    setDragItem({ item, x: clientX, y: clientY });
  };

  const onGlobalMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragItem) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragItem({ ...dragItem, x: clientX, y: clientY });
  };

  const onGlobalEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragItem) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    
    handleDrop(dragItem.item, clientX, clientY);
    setDragItem(null);
  };

  // --- Screens ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8 animate-fade-in z-20 relative">
      <div className="text-8xl animate-bounce">📬</div>
      <div>
        <h1 className="text-3xl font-black text-white mb-2">領事信箱分揀員</h1>
        <p className="text-gray-300 text-sm max-w-xs mx-auto">
          你現在是領事館的前台。請將收到的大量請求信件，準確分類到三個信箱中。
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
         <div className="bg-red-500/20 border border-red-500/50 p-2 rounded text-center">
            <div className="text-2xl">🏛️</div>
            <div className="text-[10px] text-red-200">領事職責</div>
         </div>
         <div className="bg-yellow-500/20 border border-yellow-500/50 p-2 rounded text-center">
            <div className="text-2xl">⚖️</div>
            <div className="text-[10px] text-yellow-200">當地解決</div>
         </div>
         <div className="bg-blue-500/20 border border-blue-500/50 p-2 rounded text-center">
            <div className="text-2xl">🎒</div>
            <div className="text-[10px] text-blue-200">自行處理</div>
         </div>
      </div>

      <button 
        onClick={() => setGameState('playing')}
        className="px-10 py-4 bg-brand-blue text-white font-bold rounded-full shadow-[0_0_20px_rgba(0,102,204,0.4)] hover:scale-105 transition-transform"
      >
        開始工作
      </button>
    </div>
  );

  const renderGameover = () => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-6 text-center">
       <div className="text-6xl mb-4">💔</div>
       <h2 className="text-3xl font-black text-white mb-2">任務結束</h2>
       <p className="text-xl text-yellow-400 font-bold mb-6">得分: {score}</p>
       <div className="flex gap-4">
          <button 
            onClick={() => navigate('/game-zone')}
            className="px-6 py-3 bg-white/10 text-white rounded-lg"
          >
            退出
          </button>
          <button 
            onClick={() => setGameState('playing')}
            className="px-6 py-3 bg-brand-blue text-white font-bold rounded-lg shadow-lg"
          >
            重試
          </button>
       </div>
    </div>
  );

  return (
    <div 
        className="min-h-screen bg-slate-900 pt-20 pb-4 px-2 font-sans relative overflow-hidden touch-none"
        onMouseMove={onGlobalMove}
        onMouseUp={onGlobalEnd}
        onTouchMove={onGlobalMove}
        onTouchEnd={onGlobalEnd}
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-10 flex items-center justify-center">
         <img src="/images/Macau_Outline.svg" className="w-full max-w-lg" alt="" onError={(e) => e.currentTarget.style.display='none'} /> 
         {/* Fallback pattern if svg missing */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-4 mb-4">
         <button onClick={() => navigate('/game-zone')} className="text-white opacity-50">&larr;</button>
         <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
               <span key={i} className={`text-xl transition-opacity ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>❤️</span>
            ))}
         </div>
         <div className="font-mono text-2xl font-black text-white">{score}</div>
      </div>

      {/* Game Area */}
      <div ref={gameAreaRef} className="relative flex-1 h-[65vh] w-full max-w-lg mx-auto border-x-2 border-white/5 rounded-t-xl bg-gradient-to-b from-transparent to-black/20 overflow-hidden">
         {gameState === 'intro' && renderIntro()}
         {gameState === 'gameover' && renderGameover()}
         
         {/* Feedback Toast */}
         {feedback && (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-2xl backdrop-blur-md border animate-pop-in z-40 text-center max-w-[80%] ${feedback.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 'bg-green-900/90 border-green-500 text-white'}`}>
                <div className="text-4xl mb-2">{feedback.type === 'error' ? '❌' : '✅'}</div>
                <div className="font-bold">{feedback.msg}</div>
            </div>
         )}

         {/* Falling Items */}
         {items.map(item => (
            <FallingItem key={item.id} item={item} />
         ))}

         {/* Active Dragging Item (Overlay) */}
         {dragItem && (
            <div 
               className="fixed z-50 pointer-events-none"
               style={{ 
                  left: dragItem.x, 
                  top: dragItem.y,
                  transform: 'translate(-50%, -50%) rotate(5deg) scale(1.1)' 
               }}
            >
               <div className="bg-white text-slate-900 text-sm font-bold p-4 rounded-md shadow-2xl border-l-4 border-brand-blue w-40 text-center opacity-90">
                  {dragItem.item.text}
               </div>
            </div>
         )}
      </div>

      {/* Bins */}
      <div className="fixed bottom-0 left-0 right-0 h-[180px] bg-slate-900/90 backdrop-blur-lg border-t border-white/10 z-20 pb-safe-bottom">
         <div className="max-w-lg mx-auto h-full grid grid-cols-3 gap-2 p-2 items-end pb-4">
            {/* Red Bin */}
            <div ref={redBinRef} className="h-[140px] bg-red-900/40 border-2 border-red-500/50 rounded-t-xl flex flex-col items-center justify-end p-2 transition-colors hover:bg-red-900/60">
               <div className="mb-auto mt-4 text-4xl opacity-80">🏛️</div>
               <div className="text-xs font-bold text-red-300 text-center leading-tight">領事職責<br/><span className="text-[10px] opacity-70">Consular</span></div>
               <div className="w-full h-1 bg-red-500 mt-2 rounded-full"></div>
            </div>

            {/* Yellow Bin */}
            <div ref={yellowBinRef} className="h-[140px] bg-yellow-900/40 border-2 border-yellow-500/50 rounded-t-xl flex flex-col items-center justify-end p-2 transition-colors hover:bg-yellow-900/60">
               <div className="mb-auto mt-4 text-4xl opacity-80">⚖️</div>
               <div className="text-xs font-bold text-yellow-300 text-center leading-tight">當地解決<br/><span className="text-[10px] opacity-70">Local</span></div>
               <div className="w-full h-1 bg-yellow-500 mt-2 rounded-full"></div>
            </div>

            {/* Blue Bin */}
            <div ref={blueBinRef} className="h-[140px] bg-blue-900/40 border-2 border-blue-500/50 rounded-t-xl flex flex-col items-center justify-end p-2 transition-colors hover:bg-blue-900/60">
               <div className="mb-auto mt-4 text-4xl opacity-80">🎒</div>
               <div className="text-xs font-bold text-blue-300 text-center leading-tight">自行處理<br/><span className="text-[10px] opacity-70">Self</span></div>
               <div className="w-full h-1 bg-blue-500 mt-2 rounded-full"></div>
            </div>
         </div>
      </div>

      <style>{`
        @keyframes fall {
          from { top: -100px; transform: rotate(0deg); }
          to { top: 110%; transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default GameE;