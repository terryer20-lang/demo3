
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Types & Data ---

type RiskLevel = 'high' | 'medium' | 'low';

interface Region {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  path: string; // SVG Path
  cx: number;   // Center X for label/snap
  cy: number;   // Center Y for label/snap
  riskCauseId: string;
  description: string;
}

interface RiskCard {
  id: string;
  text: string;
  icon: string;
}

// Fictional Data to ensure Zero Political Risk
const REGIONS: Region[] = [
  { 
    id: 'r1', name: '北境群島', riskLevel: 'low', 
    path: 'M 10,20 Q 25,5 40,20 T 70,20 L 70,40 Q 50,55 30,40 L 10,20', 
    cx: 40, cy: 30, 
    riskCauseId: 'c_law', 
    description: '法治完善，社會穩定，是理想的旅遊目的地。' 
  },
  { 
    id: 'r2', name: '赤道新區', riskLevel: 'high', 
    path: 'M 5,60 Q 20,50 35,60 T 65,60 L 60,90 Q 30,95 10,85 L 5,60', 
    cx: 35, cy: 75, 
    riskCauseId: 'c_unrest', 
    description: '近期發生多起遊行示威，政局動盪，社會治安風險極高。' 
  },
  { 
    id: 'r3', name: '東方半島', riskLevel: 'medium', 
    path: 'M 75,10 Q 90,15 95,30 T 90,50 L 75,45 Q 65,30 75,10', 
    cx: 82, cy: 30, 
    riskCauseId: 'c_disaster', 
    description: '雨季來臨，颱風與洪水頻發，需時刻關注天氣預警。' 
  },
  { 
    id: 'r4', name: '沙漠特區', riskLevel: 'medium', 
    path: 'M 70,60 L 95,60 L 95,90 L 70,90 Z', 
    cx: 82, cy: 75, 
    riskCauseId: 'c_health', 
    description: '當地爆發流行性傳染病，醫療資源緊張，衛生風險較高。' 
  }
];

const CARDS: RiskCard[] = [
  { id: 'c_unrest', text: '政局動盪', icon: '📢' },
  { id: 'c_disaster', text: '自然災害', icon: '🌪️' },
  { id: 'c_law', text: '治安良好', icon: '🛡️' },
  { id: 'c_health', text: '公共衛生', icon: '🏥' },
];

const COLORS = {
  high: '#EF4444',   // Red
  medium: '#EAB308', // Yellow
  low: '#22C55E',    // Green
  default: '#334155' // Slate 700
};

const GameF: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // --- State ---
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'summary'>('intro');
  // Map card ID to region ID (where it is placed)
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ id: string, type: 'success' | 'error', msg: string } | null>(null);
  const [dragState, setDragState] = useState<{ cardId: string, x: number, y: number } | null>(null);
  const [_completedCount, setCompletedCount] = useState(0);

  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const regionRefs = useRef<Record<string, SVGPathElement | null>>({});

  // --- Logic ---

  const handleDragStart = (cardId: string, e: React.TouchEvent | React.MouseEvent) => {
    // Prevent default to stop scrolling while dragging
    // e.preventDefault(); // Note: careful with this on some browsers
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setDragState({ cardId, x: clientX, y: clientY });
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragState) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setDragState({ ...dragState, x: clientX, y: clientY });
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragState) return;

    // Detect Drop
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;

    // Check collision with SVG paths
    let droppedRegionId: string | null = null;

    // Use document.elementFromPoint to see if we are over a path
    // We need to temporarily hide the dragged element or use pointer-events-none on it so we can click "through" it
    // But since we are rendering a separate drag overlay, the original card is in the tray.
    
    // Simple Bounding Box Check for Regions (Simulating collision)
    // We iterate region refs and check if point is inside rect
    for (const region of REGIONS) {
      const el = regionRefs.current[region.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          droppedRegionId = region.id;
          break;
        }
      }
    }

    if (droppedRegionId) {
      setPlacements(prev => ({ ...prev, [dragState.cardId]: droppedRegionId! }));
      if (navigator.vibrate) navigator.vibrate(20);
    } else {
      // Returned to tray (remove placement)
      setPlacements(prev => {
        const next = { ...prev };
        delete next[dragState.cardId];
        return next;
      });
    }

    setDragState(null);
  };

  const validate = () => {
    let newCompleted = 0;

    // Iterate through all regions to see if they have the right card
    for (const region of REGIONS) {
      // Find card placed here
      const placedCardId = Object.keys(placements).find(key => placements[key] === region.id);
      
      if (!placedCardId) {
        continue;
      }

      // Check match
      const card = CARDS.find(c => c.id === placedCardId);
      if (card?.id === region.riskCauseId) {
        newCompleted++;
      }
    }

    if (newCompleted === REGIONS.length) {
      setGameState('summary');
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    } else {
      setFeedback({ id: 'system', type: 'error', msg: '還有匹配錯誤，請參考顏色與風險類型的關係！' });
      setTimeout(() => setFeedback(null), 2500);
      if (navigator.vibrate) navigator.vibrate(100);
    }
    
    setCompletedCount(newCompleted);
  };

  // --- Renders ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-6xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10">
        🧩
      </div>
      <h1 className="text-3xl font-black text-white mb-2 tracking-wide">全球風險解碼器</h1>
      <div className="bg-blue-500/20 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-500/30 mb-6">
        教學演示 • 數據虛構
      </div>
      
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 max-w-sm text-left space-y-4 shadow-xl">
        <p className="text-gray-300 text-sm leading-relaxed">
          <span className="text-white font-bold block mb-1">任務目標：</span>
          世界地圖上的顏色（紅/黃/綠）代表不同的風險等級。請將下方的「風險原因卡片」拖拽到對應的地圖區域。
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
           <div className="bg-red-500/20 text-red-300 py-2 rounded border border-red-500/30">紅: 高風險</div>
           <div className="bg-yellow-500/20 text-yellow-300 py-2 rounded border border-yellow-500/30">黃: 謹慎</div>
           <div className="bg-green-500/20 text-green-300 py-2 rounded border border-green-500/30">綠: 低風險</div>
        </div>
      </div>

      <button 
        onClick={() => setGameState('playing')}
        className="mt-8 px-10 py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
      >
        開始解碼
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto pt-4 relative">
      
      {/* 1. Map Area */}
      <div className="relative bg-[#1e293b] rounded-3xl border border-white/10 overflow-hidden shadow-2xl aspect-square mx-4 mb-4">
         <div className="absolute top-4 left-4 z-10 text-white/50 text-xs font-bold tracking-widest uppercase">Global Risk Map</div>
         
         {/* Macau Marker (Decor) */}
         <div className="absolute bottom-8 right-8 flex flex-col items-center z-10 opacity-80">
            <span className="text-xs text-white mb-1 drop-shadow-md">我們的出發地</span>
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-brand-green rounded-full -mt-3 border-2 border-white"></div>
         </div>

         <svg 
           ref={svgRef}
           viewBox="0 0 100 100" 
           className="w-full h-full pointer-events-auto"
         >
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {REGIONS.map((region) => {
               // Is a card placed here?
               const placedCardId = Object.keys(placements).find(k => placements[k] === region.id);
               const placedCard = placedCardId ? CARDS.find(c => c.id === placedCardId) : null;

               return (
                 <g key={region.id}>
                    <path
                      ref={el => { regionRefs.current[region.id] = el; }}
                      d={region.path}
                      fill={COLORS[region.riskLevel]}
                      fillOpacity="0.3"
                      stroke={COLORS[region.riskLevel]}
                      strokeWidth="1"
                      className="transition-all duration-300"
                    />
                    {/* Region Label */}
                    {!placedCard && (
                       <text x={region.cx} y={region.cy} textAnchor="middle" dominantBaseline="middle" fontSize="4" fill="white" fontWeight="bold" className="pointer-events-none drop-shadow-md opacity-80">
                          {region.name}
                       </text>
                    )}
                    
                    {/* Placed Card Visual on Map */}
                    {placedCard && (
                       <foreignObject x={region.cx - 10} y={region.cy - 6} width="20" height="12">
                          <div className="w-full h-full bg-white text-slate-900 rounded-sm flex items-center justify-center text-[3px] font-bold shadow-md border-b-2 border-slate-300 animate-pop-in">
                             {placedCard.text}
                          </div>
                       </foreignObject>
                    )}
                 </g>
               )
            })}
         </svg>
      </div>

      {/* 2. Feedback Toast */}
      {feedback && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-xl px-6 py-4 rounded-xl border border-red-500/50 shadow-2xl z-50 text-center w-3/4 animate-pop-in">
            <div className="text-3xl mb-2">🤔</div>
            <div className="text-white font-bold text-sm">{feedback.msg}</div>
         </div>
      )}

      {/* 3. Card Tray */}
      <div className="flex-1 bg-slate-900/80 backdrop-blur-md border-t border-white/10 p-4 relative z-20">
         <div className="text-xs text-gray-400 mb-3 text-center">拖拽卡片至對應顏色的區域</div>
         <div className="grid grid-cols-2 gap-3">
            {CARDS.map((card) => {
               const isPlaced = placements[card.id] !== undefined;
               const isDragging = dragState?.cardId === card.id;

               return (
                  <div 
                    key={card.id}
                    className={`relative h-12 bg-white rounded-lg shadow-sm border-b-4 border-slate-300 flex items-center justify-center gap-2 transition-all active:scale-95 touch-none select-none
                      ${isPlaced || isDragging ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-grab'}
                    `}
                    onTouchStart={(e) => handleDragStart(card.id, e)}
                    onMouseDown={(e) => handleDragStart(card.id, e)}
                  >
                     <span className="text-xl">{card.icon}</span>
                     <span className="text-slate-800 font-bold text-sm">{card.text}</span>
                  </div>
               )
            })}
         </div>

         {/* Validate Button */}
         <div className="mt-4">
            <button 
               onClick={validate}
               disabled={Object.keys(placements).length !== REGIONS.length}
               className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${
                  Object.keys(placements).length === REGIONS.length
                  ? 'bg-brand-blue text-white hover:scale-[1.02]' 
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
               }`}
            >
               驗證答案
            </button>
         </div>
      </div>

      {/* 4. Drag Overlay */}
      {dragState && (
         <div 
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: dragState.x, top: dragState.y }}
         >
            <div className="w-32 h-12 bg-white rounded-lg shadow-2xl border-b-4 border-brand-blue flex items-center justify-center gap-2 opacity-90 scale-110 rotate-3">
               <span className="text-xl">{CARDS.find(c => c.id === dragState.cardId)?.icon}</span>
               <span className="text-slate-800 font-bold text-sm">{CARDS.find(c => c.id === dragState.cardId)?.text}</span>
            </div>
         </div>
      )}

      {/* Global Touch Listener for Move/End */}
      {dragState && (
         <div 
            className="fixed inset-0 z-40 touch-none"
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
         ></div>
      )}
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in pb-20">
       <div className="text-6xl mb-4 animate-bounce">🎉</div>
       <h2 className="text-3xl font-black text-white mb-2">解碼成功！</h2>
       <p className="text-gray-300 text-sm mb-8">你已掌握了「看顏色，知風險」的關鍵技能。</p>

       <div className="w-full max-w-sm space-y-3 mb-8 text-left">
          {REGIONS.map(region => (
             <div key={region.id} className="bg-slate-800/60 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-1">
                   <span className="font-bold text-white">{region.name}</span>
                   <span className={`text-[10px] px-2 py-0.5 rounded font-bold bg-white/10`} style={{color: COLORS[region.riskLevel]}}>
                      {region.riskLevel.toUpperCase()}
                   </span>
                </div>
                <div className="text-xs text-gray-400">{region.description}</div>
             </div>
          ))}
       </div>

       <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-xs text-yellow-200 mb-8 max-w-sm">
          ⚠️ <strong>領保小貼士：</strong><br/>
          風險顏色只是快速提示。出行前，務必登錄「中國領事」APP 查詢最新的詳細安全提醒。
       </div>

       <button 
         onClick={() => navigate('/game-zone')}
         className="px-10 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
       >
         返回遊戲大廳
       </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-4 font-sans relative overflow-hidden select-none">
      
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none"></div>

      {/* Navbar */}
      <div className="relative z-10 w-full max-w-lg mx-auto mb-2 flex justify-between items-center">
         <button 
            onClick={() => navigate('/game-zone')} 
            className="text-gray-500 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm px-3 py-1.5"
         >
            &larr; {t('app.back')}
         </button>
         {gameState === 'playing' && (
            <div className="text-gray-500 text-xs font-mono">GAME F</div>
         )}
      </div>

      <div className="relative z-10 w-full flex-1">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'summary' && renderSummary()}
      </div>
    </div>
  );
};

export default GameF;
