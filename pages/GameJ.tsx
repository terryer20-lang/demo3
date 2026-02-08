
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Types ---

interface OrgData {
  id: string;
  name: string;
  acronym: string;
  logo: string; // Emoji or Icon
  desc: string;
  consularNote: string;
}

const ORGS: OrgData[] = [
  {
    id: 'un',
    name: '聯合國',
    acronym: 'UN',
    logo: '🇺🇳',
    desc: '維護國際和平與安全，促進國際合作。',
    consularNote: '在涉及跨國維和或大規模撤僑行動中，聯合國的協調機制至關重要。'
  },
  {
    id: 'who',
    name: '世界衛生組織',
    acronym: 'WHO',
    logo: '⚕️',
    desc: '負責全球公共衛生事務，制定國際疾病防治標準。',
    consularNote: '在海外爆發傳染病疫情時，使領館會依據WHO資訊發布安全提醒。'
  },
  {
    id: 'ifrc',
    name: '國際紅十字與紅新月',
    acronym: 'IFRC',
    logo: '⛑️',
    desc: '在武裝衝突和災難中提供人道主義援助和保護。',
    consularNote: '當公民在戰亂地區受傷或失蹤，紅十字會是重要的人道救援合作方。'
  },
  {
    id: 'icao',
    name: '國際民用航空組織',
    acronym: 'ICAO',
    logo: '✈️',
    desc: '制定國際航空標準和法規，保障航空安全。',
    consularNote: '確保國際航班安全運行，是海外公民平安回國的基礎保障。'
  },
  {
    id: 'interpol',
    name: '國際刑警組織',
    acronym: 'INTERPOL',
    logo: '👮',
    desc: '促進全球警方間的資訊共享與合作，打擊跨國犯罪。',
    consularNote: '當公民遭遇嚴重跨國犯罪時，領事官員可通過此管道加強與當地警方協作。'
  },
  {
    id: 'imo',
    name: '國際海事組織',
    acronym: 'IMO',
    logo: '🚢',
    desc: '負責船舶安全、航行安全和防止船舶造成海洋污染。',
    consularNote: '涉及公海海難或海盜襲擊時，IMO的公約是開展領事保護的法律依據。'
  },
  {
    id: 'unwto',
    name: '世界旅遊組織',
    acronym: 'UNWTO',
    logo: '🏖️',
    desc: '促進負責任的、可持續的和普遍可及的旅遊業。',
    consularNote: '推動旅遊安全標準，減少中國遊客在海外遭遇旅遊安全事故的風險。'
  }
];

const GameJ: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // State
  const [leftItems, setLeftItems] = useState<OrgData[]>([]);
  const [rightItems, setRightItems] = useState<OrgData[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  const [wrongLink, setWrongLink] = useState<{left: string, right: string} | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'summary'>('intro');
  const [showConsularInfo, setShowConsularInfo] = useState(false);

  // Refs for line drawing
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lineCoordinates, setLineCoordinates] = useState<any>({});

  // Initialize
  useEffect(() => {
    if (gameState === 'playing') {
      const shuffledLeft = [...ORGS].sort(() => Math.random() - 0.5);
      const shuffledRight = [...ORGS].sort(() => Math.random() - 0.5);
      setLeftItems(shuffledLeft);
      setRightItems(shuffledRight);
      setMatches({});
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongLink(null);
      setShowConsularInfo(false);
    }
  }, [gameState]);

  // Recalculate coordinates on resize or state change
  const updateCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords: any = {};

    // 1. Calculate Matched Lines
    Object.entries(matches).forEach(([lId, rId]) => {
      const lEl = leftRefs.current[lId];
      const rEl = rightRefs.current[rId];
      if (lEl && rEl) {
        const lRect = lEl.getBoundingClientRect();
        const rRect = rEl.getBoundingClientRect();
        newCoords[`${lId}-${rId}`] = {
          x1: lRect.right - containerRect.left,
          y1: lRect.top + lRect.height / 2 - containerRect.top,
          x2: rRect.left - containerRect.left,
          y2: rRect.top + rRect.height / 2 - containerRect.top
        };
      }
    });

    // 2. Calculate Active Selection Line (if both selected but not matched yet - instant)
    // Actually we handle logic first, but for visual of 'trying' to connect, we can add temp line
    
    // 3. Calculate "Web" background lines (All possible connections)
    // This might be too heavy for React render loop if dynamic.
    // Let's do it only once or optimize. For now, skip background web for performance, 
    // or just render a few static ones if needed. 
    // The prompt requested it, so let's try to map ALL left to ALL right.
    const webCoords: any[] = [];
    leftItems.forEach(l => {
        rightItems.forEach(r => {
            const lEl = leftRefs.current[l.id];
            const rEl = rightRefs.current[r.id];
            if (lEl && rEl) {
                const lRect = lEl.getBoundingClientRect();
                const rRect = rEl.getBoundingClientRect();
                webCoords.push({
                    key: `web-${l.id}-${r.id}`,
                    x1: lRect.right - containerRect.left,
                    y1: lRect.top + lRect.height / 2 - containerRect.top,
                    x2: rRect.left - containerRect.left,
                    y2: rRect.top + rRect.height / 2 - containerRect.top
                });
            }
        });
    });

    setLineCoordinates({ ...newCoords, web: webCoords });
  };

  useEffect(() => {
    // Update coordinates after render
    const timer = setTimeout(updateCoordinates, 100);
    window.addEventListener('resize', updateCoordinates);
    return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateCoordinates);
    };
  }, [leftItems, rightItems, matches, gameState]);

  // Logic
  const handleLeftClick = (id: string) => {
    if (matches[id]) return; // Already matched
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    // Check if this right item is already matched to something
    const isMatched = Object.values(matches).includes(id);
    if (isMatched) return;

    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (lId: string, rId: string) => {
    // Determine if correct
    // In our data, left items are ORGS, right items are ORGS (shuffled).
    // The match is correct if lId === rId (since we use same IDs)
    if (lId === rId) {
      // Correct
      setMatches(prev => ({ ...prev, [lId]: rId }));
      if (navigator.vibrate) navigator.vibrate(50);
      
      // Check win condition
      if (Object.keys(matches).length + 1 === ORGS.length) {
         setTimeout(() => setGameState('summary'), 1000);
      }
    } else {
      // Wrong
      setWrongLink({ left: lId, right: rId });
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setTimeout(() => {
        setWrongLink(null);
      }, 500);
    }
    // Reset selection
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // --- Renders ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-8 animate-fade-in relative z-10">
      <div className="w-28 h-28 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
        <span className="text-6xl">🌐</span>
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-wider">全球守護者連線</h1>
        <p className="text-blue-300 font-bold text-sm uppercase tracking-widest">Global Guardian Connection</p>
      </div>
      <div className="bg-slate-900/80 p-6 rounded-xl border border-white/10 max-w-sm text-sm text-gray-300 leading-relaxed shadow-2xl backdrop-blur-md">
        <p className="mb-4">
           作為世界公民，你需要了解誰在守護我們的安全。
        </p>
        <ul className="list-disc pl-4 space-y-2 text-left">
           <li>點擊左側的<span className="text-white font-bold">國際組織</span>。</li>
           <li>點擊右側對應的<span className="text-white font-bold">職能描述</span>。</li>
           <li>將它們正確連接起來！</li>
        </ul>
      </div>
      <button 
        onClick={() => setGameState('playing')}
        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 border border-blue-400/30 tracking-widest text-lg"
      >
        開始連線
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto pt-4 relative animate-fade-in">
       
       <div ref={containerRef} className="flex justify-between relative min-h-[60vh]">
          
          {/* SVG Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
             {/* Background Web (Faint) */}
             {(lineCoordinates.web as any[])?.map((line: any) => (
                <line 
                   key={line.key}
                   x1={line.x1} y1={line.y1}
                   x2={line.x2} y2={line.y2}
                   stroke="rgba(255,255,255,0.03)"
                   strokeWidth="1"
                />
             ))}

             {/* Correct Matches */}
             {Object.entries(matches).map(([lId, rId]) => {
                const coords = lineCoordinates[`${lId}-${rId}`];
                if (!coords) return null;
                return (
                   <line 
                      key={`match-${lId}`}
                      x1={coords.x1} y1={coords.y1}
                      x2={coords.x2} y2={coords.y2}
                      stroke="#4CAF50"
                      strokeWidth="3"
                      className="animate-draw"
                   />
                );
             })}

             {/* Wrong Attempt */}
             {wrongLink && (
                (() => {
                   // Calculate wrong line coords on the fly or utilize refs directly?
                   // Since state update triggers render, refs are stable.
                   // We need coords. We can re-calc just for this frame or rely on a helper.
                   // Let's use helper logic directly here safely.
                   const lEl = leftRefs.current[wrongLink.left];
                   const rEl = rightRefs.current[wrongLink.right];
                   if (lEl && rEl && containerRef.current) {
                      const cRect = containerRef.current.getBoundingClientRect();
                      const lRect = lEl.getBoundingClientRect();
                      const rRect = rEl.getBoundingClientRect();
                      return (
                         <line 
                            x1={lRect.right - cRect.left} y1={lRect.top + lRect.height/2 - cRect.top}
                            x2={rRect.left - cRect.left} y2={rRect.top + rRect.height/2 - cRect.top}
                            stroke="#EF4444"
                            strokeWidth="3"
                            className="animate-shake opacity-80"
                         />
                      )
                   }
                   return null;
                })()
             )}
          </svg>

          {/* Left Column: Logos */}
          <div className="flex flex-col justify-around w-[40%] space-y-4 pr-4 z-20">
             {leftItems.map(item => {
                const isSelected = selectedLeft === item.id;
                const isMatched = matches[item.id] !== undefined;
                return (
                   <div 
                      key={item.id}
                      ref={el => { leftRefs.current[item.id] = el; }}
                      onClick={() => handleLeftClick(item.id)}
                      className={`
                         relative p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all duration-300
                         ${isMatched ? 'bg-green-900/30 border-green-500/50 opacity-80' : isSelected ? 'bg-blue-600/30 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800/50 border-white/10 hover:bg-slate-800'}
                      `}
                   >
                      <div className="text-3xl md:text-4xl">{item.logo}</div>
                      <div className="font-bold text-sm text-gray-200 leading-tight">
                         {item.name}
                         <div className="text-[10px] text-gray-500 font-mono">{item.acronym}</div>
                      </div>
                      {/* Anchor Dot */}
                      <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors ${isMatched ? 'bg-green-500 border-green-500' : isSelected ? 'bg-blue-500 border-blue-500' : 'bg-slate-900 border-gray-600'}`}></div>
                   </div>
                )
             })}
          </div>

          {/* Right Column: Descriptions */}
          <div className="flex flex-col justify-around w-[55%] space-y-4 pl-4 z-20">
             {rightItems.map(item => {
                const isSelected = selectedRight === item.id;
                const isMatched = Object.values(matches).includes(item.id);
                return (
                   <div 
                      key={item.id}
                      ref={el => { rightRefs.current[item.id] = el; }}
                      onClick={() => handleRightClick(item.id)}
                      className={`
                         relative p-3 rounded-xl border flex items-center cursor-pointer transition-all duration-300 h-full
                         ${isMatched ? 'bg-green-900/30 border-green-500/50 opacity-80' : isSelected ? 'bg-blue-600/30 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800/50 border-white/10 hover:bg-slate-800'}
                      `}
                   >
                      {/* Anchor Dot */}
                      <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors ${isMatched ? 'bg-green-500 border-green-500' : isSelected ? 'bg-blue-500 border-blue-500' : 'bg-slate-900 border-gray-600'}`}></div>
                      
                      <div className="text-xs md:text-sm text-gray-300 leading-snug">
                         {item.desc}
                      </div>
                   </div>
                )
             })}
          </div>

       </div>
    </div>
  );

  const renderSummary = () => (
    <div className="w-full max-w-2xl mx-auto pt-10 pb-20 px-4 animate-fade-in">
       <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🌐</div>
          <h2 className="text-3xl font-black text-white mb-2">連結成功！</h2>
          <p className="text-gray-400 text-sm">你已掌握了全球守護者的職能網絡。</p>
       </div>

       <div className="space-y-4">
          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest text-center mb-4">領事保護關聯檔案</h3>
          {ORGS.map(org => (
             <div key={org.id} className="bg-slate-800/60 rounded-xl p-4 border border-white/10 flex gap-4 items-start hover:bg-slate-800 transition-colors">
                <div className="text-3xl shrink-0 mt-1">{org.logo}</div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-bold">{org.name}</h4>
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{org.acronym}</span>
                   </div>
                   <div className="text-xs text-gray-300 mb-2">{org.desc}</div>
                   <div className="text-xs text-blue-200 bg-blue-900/20 p-2 rounded border-l-2 border-blue-500">
                      <strong>🔗 關聯：</strong> {org.consularNote}
                   </div>
                </div>
             </div>
          ))}
       </div>

       <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => navigate('/game-zone')}
            className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            返回大廳
          </button>
          <button 
            onClick={() => setGameState('playing')}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg"
          >
            再玩一次
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 font-sans relative overflow-x-hidden">
      
      {/* Background Ambience (Macau Lighthouse) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
         {/* Guia Lighthouse Stylized SVG */}
         <svg viewBox="0 0 500 500" className="absolute bottom-0 right-0 w-[500px] h-[500px] text-white fill-none stroke-current stroke-[2]">
            <path d="M250,100 L300,400 L200,400 Z M250,100 A20,20 0 1,1 250,60 A20,20 0 1,1 250,100" />
            <line x1="100" y1="450" x2="400" y2="450" />
         </svg>
      </div>

      {/* Navbar */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mb-4 px-4 flex justify-between items-center">
         <button 
            onClick={() => navigate('/game-zone')} 
            className="text-gray-500 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm px-3 py-1.5"
         >
            &larr; {t('app.back')}
         </button>
         {gameState === 'playing' && (
            <div className="text-xs font-mono text-blue-500">
               {Object.keys(matches).length}/{ORGS.length} 已連接
            </div>
         )}
      </div>

      <div className="relative z-10">
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'summary' && renderSummary()}
      </div>

      <style>{`
        @keyframes draw {
          from { stroke-dasharray: 0 1000; }
          to { stroke-dasharray: 1000 0; }
        }
        .animate-draw { animation: draw 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GameJ;
