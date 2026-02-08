
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Types & Data ---

interface LevelData {
  id: number;
  targetPhrase: string; // The phrase to assemble
  explanation: string; // Brief hint displayed at start
  distractors: string[]; // Wrong words
  legalTip: string; // Detailed knowledge card content
  source: string; // Legal source reference
}

const LEVELS: LevelData[] = [
  {
    id: 1,
    targetPhrase: "領事保護",
    explanation: "指中國公民在海外合法權益受侵害時，駐外使領館提供的協助。",
    distractors: ["旅遊", "購物", "簽證", "學習", "代購", "糾紛", "天氣", "導遊", "機票", "酒店", "美食", "打卡", "領事", "保衛"],
    legalTip: "領事保護是國家主權在海外的延伸，核心是維護本國公民和法人的正當權益。但請記住，領事保護不能凌駕於駐在國法律之上。",
    source: "《維也納領事關係公約》"
  },
  {
    id: 2,
    targetPhrase: "國民待遇",
    explanation: "在民事權利方面，外國人享有與本國人同等的待遇。",
    distractors: ["VIP", "特權", "外交", "豁免", "優先", "免費", "特殊", "綠卡", "永居", "移民", "國籍", "居民", "福利", "稅收"],
    legalTip: "在海外，我們不能要求享有比當地人更高的「超國民待遇」。遵守當地法律是獲得尊重的基礎。",
    source: "國際私法原則"
  },
  {
    id: 3,
    targetPhrase: "人身安全",
    explanation: "生命與身體不受非法侵害的權利，是領事保護的首要任務。",
    distractors: ["財產", "自由", "名譽", "隱私", "健康", "保險", "理賠", "醫療", "報警", "意外", "風險", "安全", "人身"],
    legalTip: "當人身安全受到嚴重威脅（如戰亂、自然災害）時，國家會啟動撤僑等應急機制。記住全球領保熱線：12308。",
    source: "《中華人民共和國領事保護與協助條例》"
  }
];

interface WordNode {
  id: string;
  text: string;
  isTarget: boolean;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
  color: string;
  width: number; // Approximate width for collision
  height: number;
}

// Visual Config
const COLORS = ['#94a3b8', '#cbd5e1', '#64748b', '#475569']; // Slate shades for distractors
const TARGET_COLOR = '#fbbf24'; // Amber for targets (hidden logic)
const SVG_WIDTH = 350;
const SVG_HEIGHT = 400;

// --- Helper Functions ---

// 1. Check if two rectangles overlap
const isColliding = (a: WordNode, b: WordNode) => {
  const margin = 5; // Padding
  return !(
    a.x + a.width / 2 + margin < b.x - b.width / 2 ||
    a.x - a.width / 2 - margin > b.x + b.width / 2 ||
    a.y + a.height / 2 + margin < b.y - b.height / 2 ||
    a.y - a.height / 2 - margin > b.y + b.height / 2
  );
};

// 2. Simple Spiral Layout Algorithm
const computeLayout = (words: string[], targetPhrase: string): WordNode[] => {
  const nodes: WordNode[] = [];
  const targets = targetPhrase.split(''); // '領', '事', '保', '護'
  
  // Combine all characters/words
  let allItems = words.map(w => ({ text: w, isTarget: false }));
  // Add target chars (shuffled in later, but logic handles them)
  targets.forEach((char, idx) => {
     // Ensure targets are unique instances even if char repeats
     allItems.push({ text: char, isTarget: true });
  });

  // Shuffle
  allItems = allItems.sort(() => Math.random() - 0.5);

  allItems.forEach((item, index) => {
    const fontSize = item.isTarget ? 24 + Math.random() * 8 : 16 + Math.random() * 12;
    const isVertical = Math.random() > 0.8;
    // Estimate dimensions (rough approximation for SVG text)
    const charWidth = fontSize * 1.2; 
    const width = item.text.length * charWidth;
    const height = fontSize * 1.5;

    // Actual Bounding Box depends on rotation
    const bbox = {
      width: isVertical ? height : width,
      height: isVertical ? width : height
    };

    let placed = false;
    let angle = Math.random() * Math.PI * 2;
    let radius = 0;
    let step = 5; // Radius increment
    let maxSteps = 200; // Safety break

    // Center of spiral
    const cx = SVG_WIDTH / 2;
    const cy = SVG_HEIGHT / 2;

    while (!placed && maxSteps > 0) {
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      // Boundary Check (roughly keep inside viewBox)
      if (x > 40 && x < SVG_WIDTH - 40 && y > 40 && y < SVG_HEIGHT - 40) {
        const candidate: WordNode = {
          id: `word-${index}-${item.text}`,
          text: item.text,
          isTarget: item.isTarget,
          x,
          y,
          fontSize,
          rotation: isVertical ? 90 : 0,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          width: bbox.width,
          height: bbox.height
        };

        // Check collision with existing nodes
        const collision = nodes.some(n => isColliding(candidate, n));
        
        if (!collision) {
          nodes.push(candidate);
          placed = true;
        }
      }

      // Move along spiral
      angle += 0.5;
      radius += step * (angle / (2 * Math.PI)) * 0.1; // Slower radius growth
      maxSteps--;
    }
  });

  return nodes;
};

const GameG: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // --- State ---
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [nodes, setNodes] = useState<WordNode[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]); // Array of IDs
  const [foundChars, setFoundChars] = useState<string[]>([]); // Array of texts in order
  const [wrongWordId, setWrongWordId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory' | 'summary'>('intro');
  const [hintActive, setHintActive] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({ mistakes: 0, time: 0 });
  const timerRef = useRef<number | null>(null);

  const currentLevel = LEVELS[currentLevelIdx];
  const targetChars = useMemo(() => currentLevel.targetPhrase.split(''), [currentLevel]);

  // --- Init Level ---
  useEffect(() => {
    if (gameState === 'playing') {
      const layout = computeLayout(currentLevel.distractors, currentLevel.targetPhrase);
      setNodes(layout);
      setFoundWords([]);
      setFoundChars([]);
      setHintActive(false);
      
      // Timer
      timerRef.current = window.setInterval(() => {
        setStats(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentLevel]);

  // --- Interaction ---
  const handleWordClick = (node: WordNode) => {
    if (gameState !== 'playing') return;
    if (foundWords.includes(node.id)) return;

    if (node.isTarget) {
      // Correct!
      // Haptic
      if (navigator.vibrate) navigator.vibrate(50);
      
      setFoundWords(prev => [...prev, node.id]);
      
      // Determine insertion order (simplified: just push to array, but for strict games you might want ordered selection)
      // Here: We just collect valid parts. Display them in the order found OR auto-sort?
      // Let's Auto-Sort logic: The target slot fills up based on the *correct phrase order*.
      // We need to know WHICH part of the target phrase this is.
      // Since `computeLayout` might have duplicate chars (unlikely in this dataset but possible), we find the first unmatched char index.
      
      // Simplified: Just show the char in the found list.
      setFoundChars(prev => {
        const next = [...prev, node.text];
        
        // Check Victory
        if (next.length === targetChars.length) {
           setTimeout(() => handleVictory(), 500);
        }
        return next;
      });

    } else {
      // Wrong!
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setWrongWordId(node.id);
      setStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      setTimeout(() => setWrongWordId(null), 500);
    }
  };

  const handleVictory = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('victory');
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState('playing');
    } else {
      setGameState('summary');
    }
  };

  const handleHint = () => {
    setHintActive(true);
    setTimeout(() => setHintActive(false), 2000); // Highlight for 2s
  };

  // --- Renders ---

  // Intro Screen
  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-8 animate-fade-in relative z-10">
      <div className="w-24 h-24 bg-blue-900/50 rounded-full flex items-center justify-center border-2 border-amber-500/50 shadow-[0_0_40px_rgba(251,191,36,0.2)]">
        <span className="text-5xl">☁️</span>
      </div>
      <div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-wider drop-shadow-lg">詞雲探秘者</h1>
        <p className="text-amber-200/80 font-serif italic text-sm">Cloud Explorer</p>
      </div>
      <div className="bg-slate-900/90 p-6 rounded-xl border border-white/10 max-w-sm text-sm text-gray-300 leading-relaxed text-left shadow-2xl backdrop-blur-md">
        <p className="mb-4">
          <span className="text-amber-400 font-bold">檔案代號：</span> {currentLevel.targetPhrase}
        </p>
        <p className="mb-4 text-xs text-gray-400">
          {currentLevel.explanation}
        </p>
        <div className="border-t border-white/10 pt-4 mt-4">
           <p className="font-bold text-white mb-2">玩法說明：</p>
           <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>在詞雲中找出組成 <span className="text-amber-400">「{currentLevel.targetPhrase}」</span> 的所有字詞。</li>
              <li>點擊正確詞彙，它們將歸檔。</li>
              <li>小心干擾詞，它們會混淆視聽！</li>
           </ul>
        </div>
      </div>
      <button 
        onClick={() => setGameState('playing')}
        className="px-10 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 border border-amber-400/30 tracking-widest uppercase"
      >
        開始檢索
      </button>
    </div>
  );

  // Victory / Knowledge Card
  const renderVictory = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-lg animate-fade-in">
       <div className="bg-slate-800 border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-amber-600 p-6 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <h2 className="text-2xl font-black text-white mb-1 relative z-10">{currentLevel.targetPhrase}</h2>
             <p className="text-amber-100 text-xs font-mono relative z-10 uppercase tracking-widest">檔案歸檔成功</p>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
             <div className="flex items-start gap-3">
                <div className="text-2xl mt-1">⚖️</div>
                <div>
                   <h3 className="font-bold text-white text-sm mb-1">法律小貼士</h3>
                   <p className="text-gray-300 text-sm leading-relaxed text-justify">
                      {currentLevel.legalTip}
                   </p>
                </div>
             </div>
             <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-500">來源</span>
                <span className="text-amber-400 font-mono">{currentLevel.source}</span>
             </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/20 flex gap-3">
             <button 
                onClick={() => window.open('https://www.fmprc.gov.cn/web/wjb_673085/zmhd_673581/', '_blank')}
                className="flex-1 py-3 text-xs font-bold text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
             >
                🔗 相關法條
             </button>
             <button 
                onClick={handleNextLevel}
                className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-500 transition-colors"
             >
                {currentLevelIdx < LEVELS.length - 1 ? '下一份檔案 →' : '查看報告 📊'}
             </button>
          </div>
       </div>
    </div>
  );

  // Summary Report
  const renderSummary = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-fade-in relative z-10">
       <div className="text-6xl mb-6 animate-bounce">📑</div>
       <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-2">
          權利詞彙掌握報告
       </h1>
       <p className="text-gray-400 text-xs mb-8 uppercase tracking-widest">Access Granted: Level 3 Clearance</p>

       <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
             <div className="text-gray-500 text-xs uppercase mb-1">總耗時</div>
             <div className="text-2xl font-mono font-bold text-white">{stats.time}s</div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
             <div className="text-gray-500 text-xs uppercase mb-1">誤觸次數</div>
             <div className={`text-2xl font-mono font-bold ${stats.mistakes === 0 ? 'text-green-400' : 'text-red-400'}`}>{stats.mistakes}</div>
          </div>
       </div>

       <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl max-w-sm mb-8 text-left">
          <h3 className="font-bold text-blue-200 text-sm mb-2">學習建議：</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
             您對基礎領保概念已有一定認識。建議多瀏覽「領保燙知識」專區，深入了解具體案例，將知識轉化為行動力。
          </p>
       </div>

       <button 
         onClick={() => navigate('/game-zone')}
         className="px-10 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
       >
         返回大廳
       </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-0 font-sans relative overflow-hidden text-slate-200 selection:bg-amber-500/30">
      
      {/* Background Ambience (Library Lines) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
         <svg width="100%" height="100%">
            <defs>
               <pattern id="library_lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="40" y2="40" stroke="white" strokeWidth="0.5" />
               </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#library_lines)" />
         </svg>
      </div>

      {/* Back Button */}
      <div className="relative z-20 px-4 mb-2 flex justify-between items-center">
         <button 
            onClick={() => navigate('/game-zone')} 
            className="text-gray-500 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm px-3 py-1.5"
         >
            &larr; {t('app.back')}
         </button>
         {gameState === 'playing' && (
            <div className="text-xs font-mono text-amber-500">
               LEVEL {currentLevelIdx + 1}/{LEVELS.length}
            </div>
         )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'victory' && renderVictory()}
        {gameState === 'summary' && renderSummary()}
        
        {gameState === 'playing' && (
           <div className="flex flex-col h-[calc(100vh-100px)]">
              {/* Target Area */}
              <div className="h-24 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm border-y border-white/5 mb-4 shrink-0">
                 <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Target Phrase</div>
                 <div className="flex gap-2">
                    {targetChars.map((char, idx) => {
                       const found = foundChars.length > idx; // Simplified sequential fill
                       // More complex logic: check if the specifically found words match specific chars.
                       // For this game, we just fill slots sequentially as user finds correct words.
                       return (
                          <div 
                            key={idx} 
                            className={`w-10 h-10 md:w-12 md:h-12 rounded border-2 flex items-center justify-center text-lg md:text-xl font-black transition-all duration-300
                               ${found 
                                 ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-110' 
                                 : 'bg-white/5 border-white/10 text-transparent'}`}
                          >
                             {found ? targetChars[idx] : '?'}
                          </div>
                       )
                    })}
                 </div>
              </div>

              {/* Word Cloud SVG */}
              <div className="flex-1 relative w-full overflow-hidden touch-none">
                 <svg 
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
                    className="w-full h-full max-w-md mx-auto"
                    preserveAspectRatio="xMidYMid meet"
                 >
                    {nodes.map((node) => {
                       const isFound = foundWords.includes(node.id);
                       const isWrong = wrongWordId === node.id;
                       // Hint logic: if hint active and node is target and not found -> glow
                       const isHinted = hintActive && node.isTarget && !isFound;

                       if (isFound) return null; // Remove from cloud if found

                       return (
                          <g 
                             key={node.id} 
                             transform={`translate(${node.x}, ${node.y}) rotate(${node.rotation})`}
                             onClick={() => handleWordClick(node)}
                             className={`cursor-pointer transition-all duration-300 ${isWrong ? 'animate-shake' : ''}`}
                             style={{ transformOrigin: 'center' }}
                          >
                             {/* Hit Area */}
                             <rect 
                                x={-node.width / 2 - 5} 
                                y={-node.height / 2} 
                                width={node.width + 10} 
                                height={node.height} 
                                fill="transparent" 
                             />
                             
                             {/* Text */}
                             <text 
                                textAnchor="middle" 
                                dominantBaseline="central"
                                fontSize={node.fontSize}
                                fill={isHinted ? '#fbbf24' : node.color}
                                fontWeight="bold"
                                className={`select-none ${isHinted ? 'animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'drop-shadow-md'}`}
                                style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
                             >
                                {node.text}
                             </text>
                          </g>
                       )
                    })}
                 </svg>
              </div>

              {/* Controls */}
              <div className="h-16 flex items-center justify-center shrink-0">
                 <button 
                    onClick={handleHint}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300 active:bg-white/20 transition-all"
                 >
                    <span>💡</span> 提示
                 </button>
              </div>
           </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)); }
          25% { transform: translate(calc(var(--tw-translate-x) - 5px), var(--tw-translate-y)) rotate(calc(var(--tw-rotate) - 5deg)); }
          75% { transform: translate(calc(var(--tw-translate-x) + 5px), var(--tw-translate-y)) rotate(calc(var(--tw-rotate) + 5deg)); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default GameG;
