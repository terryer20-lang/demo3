
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Types ---
interface MapNode {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  icon: string;
  label: string;
  color: string;
}

interface Mission {
  id: number;
  text: string;
  path: string[]; // Array of node IDs in order
  hint: string;
}

// --- Data Constants ---
const NODES: MapNode[] = [
  { id: 'hotel', x: 20, y: 80, icon: '🏨', label: '你的酒店', color: 'text-blue-400' },
  { id: 'embassy', x: 80, y: 15, icon: '🏛️', label: '中國領事館', color: 'text-red-500' },
  { id: 'hospital', x: 20, y: 25, icon: '🏥', label: '綜合醫院', color: 'text-pink-400' },
  { id: 'police', x: 80, y: 80, icon: '🚓', label: '警察局', color: 'text-indigo-400' },
  { id: 'supermarket', x: 15, y: 55, icon: '🛒', label: '大型超市', color: 'text-orange-400' },
  { id: 'plaza', x: 50, y: 50, icon: '⛲', label: '中心廣場', color: 'text-teal-400' },
];

const MISSIONS: Mission[] = [
  { 
    id: 1, 
    text: "任務一：你剛抵達日光城，請從「你的酒店」出發，前往「中國領事館」辦理報到手續。", 
    path: ['hotel', 'embassy'],
    hint: "先點擊左下角的酒店，再點擊右上角的領事館。"
  },
  { 
    id: 2, 
    text: "任務二：你在超市購物時感到身體不適，需要立即前往最近的「綜合醫院」。", 
    path: ['supermarket', 'hospital'],
    hint: "起點是超市，終點是醫院。"
  },
  { 
    id: 3, 
    text: "任務三：你在中心廣場與朋友走散了，手機沒電，請前往最近的「警察局」求助。", 
    path: ['plaza', 'police'],
    hint: "從廣場出發，尋找有警車標誌的地方。"
  }
];

const GameD: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [shakingNode, setShakingNode] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const currentMission = MISSIONS[currentMissionIdx];

  // Helper to get node by ID
  const getNode = (id: string) => NODES.find(n => n.id === id);

  // Handle Node Click
  const handleNodeClick = (nodeId: string) => {
    if (gameState !== 'playing') return;
    if (shakingNode) return; // Prevent clicks during error animation

    const expectedNextNode = currentMission.path[selectedPath.length];

    // Case 1: Correct Node
    if (nodeId === expectedNextNode) {
      const newPath = [...selectedPath, nodeId];
      setSelectedPath(newPath);
      
      // Haptic Feedback
      if (navigator.vibrate) navigator.vibrate(50);

      // Check Mission Completion
      if (newPath.length === currentMission.path.length) {
        handleMissionComplete();
      }
    } 
    // Case 2: Incorrect Node (already selected or wrong order)
    else {
      triggerError(nodeId);
    }
  };

  const triggerError = (nodeId: string) => {
    setShakingNode(nodeId);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Error vibration pattern
    setTimeout(() => setShakingNode(null), 500);
  };

  const handleMissionComplete = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      if (currentMissionIdx < MISSIONS.length - 1) {
        setCurrentMissionIdx(prev => prev + 1);
        setSelectedPath([]);
      } else {
        setGameState('completed');
      }
    }, 2000);
  };

  const restartGame = () => {
    setCurrentMissionIdx(0);
    setSelectedPath([]);
    setGameState('playing');
  };

  // --- Renders ---

  const renderLines = () => {
    return selectedPath.map((nodeId, index) => {
      if (index === 0) return null;
      const startNode = getNode(selectedPath[index - 1]);
      const endNode = getNode(nodeId);
      
      if (!startNode || !endNode) return null;

      return (
        <line
          key={`line-${index}`}
          x1={`${startNode.x}%`}
          y1={`${startNode.y}%`}
          x2={`${endNode.x}%`}
          y2={`${endNode.y}%`}
          stroke="#4CAF50"
          strokeWidth="3"
          strokeDasharray="5,5"
          className="animate-[dash_1s_linear_infinite]"
        >
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />
        </line>
      );
    });
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-fade-in space-y-8">
      <div className="relative w-32 h-32">
         <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
         <div className="relative bg-slate-800 rounded-full w-full h-full flex items-center justify-center text-6xl border-4 border-blue-500 shadow-2xl">
            🗺️
         </div>
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-wider">安全路徑規劃師</h1>
        <p className="text-blue-200/80 text-sm max-w-xs mx-auto leading-relaxed">
          你即將前往陌生的「日光城」。<br/>出發前，請熟悉城市的安全節點，並規劃你的應急路線。
        </p>
      </div>
      
      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-xs text-gray-400">
         <p>💡 提示：點擊地圖上的圖標，按任務順序連接地點。</p>
      </div>

      <button 
        onClick={() => setGameState('playing')}
        className="px-10 py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(0,102,204,0.4)] transition-all active:scale-95 text-lg"
      >
        開始規劃
      </button>
    </div>
  );

  const renderMap = () => (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Top: Mission Card */}
      <div className="mb-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg relative z-20">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-brand-blue font-bold tracking-widest uppercase bg-blue-500/10 px-2 py-0.5 rounded">Mission {currentMissionIdx + 1}/{MISSIONS.length}</span>
            <div className="flex gap-1">
               {MISSIONS.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= currentMissionIdx ? 'bg-brand-blue' : 'bg-gray-700'}`}></div>
               ))}
            </div>
         </div>
         <p className="text-white font-bold text-sm md:text-base leading-relaxed">
            {currentMission.text}
         </p>
      </div>

      {/* Center: Map Area */}
      <div className="flex-1 relative bg-[#1e293b] rounded-3xl border border-white/10 overflow-hidden shadow-2xl mb-4 group select-none">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>

         {/* SVG Layer for Lines */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {renderLines()}
         </svg>

         {/* Nodes Layer */}
         {NODES.map((node) => {
            const isSelected = selectedPath.includes(node.id);
            const isShaking = shakingNode === node.id;

            return (
               <div
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10 ${isShaking ? 'animate-shake' : ''}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
               >
                  {/* Icon Bubble */}
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 transition-all duration-200 
                     ${isSelected ? 'bg-green-500 border-white scale-110' : 'bg-slate-800 border-white/20 hover:scale-105 active:scale-95'}
                     ${isShaking ? 'bg-red-500/20 border-red-500' : ''}
                  `}>
                     {node.icon}
                  </div>
                  
                  {/* Label */}
                  <div className={`mt-2 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm shadow-sm whitespace-nowrap transition-colors
                     ${isSelected ? 'bg-green-600 text-white' : 'bg-black/40 text-gray-200'}
                  `}>
                     {node.label}
                  </div>

                  {/* Order Badge (if selected) */}
                  {isSelected && (
                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-white shadow-sm animate-pop-in">
                        {selectedPath.indexOf(node.id) + 1}
                     </div>
                  )}
               </div>
            );
         })}

         {/* Macau Tip Bubble */}
         <div className="absolute bottom-4 right-4 max-w-[150px] bg-yellow-500/90 text-slate-900 text-[10px] p-3 rounded-tr-xl rounded-l-xl shadow-lg animate-bounce-slow backdrop-blur-sm pointer-events-none z-0 opacity-80">
            <span className="font-bold block mb-1">🇲🇴 澳門提示：</span>
            就像熟悉大三巴到議事亭一樣，提前了解目的地關鍵地點哦！
         </div>
      </div>

      {/* Success Toast Overlay */}
      {showSuccessToast && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-green-500/50 shadow-2xl flex flex-col items-center animate-pop-in">
               <div className="text-5xl mb-2">🎉</div>
               <h3 className="text-green-400 font-bold text-xl">路徑規劃成功！</h3>
            </div>
         </div>
      )}
    </div>
  );

  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in space-y-8">
      <div className="text-8xl mb-2 animate-bounce">🏆</div>
      <div>
         <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            安全規劃大師
         </h1>
         <p className="text-gray-300 max-w-sm mx-auto leading-relaxed">
            恭喜！你已成功掌握了在陌生城市識別安全節點的技能。<br/>記住：安全意識是最好的護身符。
         </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
         <button
            onClick={() => navigate('/game-zone')}
            className="py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
         >
            返回大廳
         </button>
         <button
            onClick={restartGame}
            className="py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
         >
            再玩一次
         </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>

      {/* Back Button */}
      <div className="relative z-10 w-full max-w-lg mx-auto mb-2">
         {gameState !== 'playing' && (
            <button 
               onClick={() => navigate('/game-zone')} 
               className="text-gray-500 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm px-3 py-1.5"
            >
               &larr; {t('app.back')}
            </button>
         )}
         {gameState === 'playing' && (
            <button 
               onClick={() => setGameState('intro')} 
               className="text-gray-500 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm px-3 py-1.5"
            >
               &larr; 退出任務
            </button>
         )}
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col h-[calc(100vh-140px)]">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderMap()}
        {gameState === 'completed' && renderCompleted()}
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
};

export default GameD;
