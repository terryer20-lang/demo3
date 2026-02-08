
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Types ---

interface StoryNode {
  id: string;
  type: 'intro' | 'node' | 'ending';
  // Common
  panels: ComicPanelData[];
  // For 'node'
  choices?: Choice[];
  // For 'ending'
  endingType?: 'good' | 'bad' | 'mixed';
  restart?: boolean;
}

interface ComicPanelData {
  layout: 'full' | 'split';
  bg?: string; // Color class or style
  emoji?: string;
  speaker?: string; // 'Narrator' | 'XiaoMing' | 'Boss' | 'System'
  text: string;
  bubbleType?: 'speech' | 'thought' | 'shout' | 'system';
  animation?: string;
}

interface Choice {
  id: 'A' | 'B';
  text: string;
  riskDelta: number;
  consequence: ComicPanelData[]; // Immediate visual result
  tip: { title: string; content: string; }; // Navigator Tip
  nextId: string;
}

// --- Story Data ---

const STORY: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    type: 'intro',
    panels: [
      {
        layout: 'full',
        bg: 'bg-blue-100',
        emoji: '🏙️',
        speaker: 'Narrator',
        text: '小明是一名澳門高中生，今年暑假，他獲得了去 R 國交流學習的機會...',
        bubbleType: 'system'
      },
      {
        layout: 'split',
        bg: 'bg-white',
        emoji: '👦',
        speaker: '小明',
        text: '這是我第一次出國，希望能找份兼職賺點零用錢，體驗當地生活！',
        bubbleType: 'speech'
      },
      {
        layout: 'full',
        bg: 'bg-slate-100',
        emoji: '📱',
        speaker: 'Narrator',
        text: '小明在當地的社交論壇上瀏覽著招聘廣告...',
        bubbleType: 'system'
      }
    ],
    choices: [
      {
        id: 'A',
        text: '繼續',
        riskDelta: 0,
        consequence: [],
        tip: { title: '', content: '' },
        nextId: 'node1'
      }
    ]
  },
  'node1': {
    id: 'node1',
    type: 'node',
    panels: [
      {
        layout: 'full',
        bg: 'bg-yellow-50',
        emoji: '📄',
        speaker: '招聘廣告',
        text: '【急聘】現金出糧，時薪高，無需報稅，學生可做！有意者私聊！',
        bubbleType: 'shout'
      }
    ],
    choices: [
      {
        id: 'A',
        text: '哇！高薪又方便，馬上聯繫！',
        riskDelta: 2,
        consequence: [
          {
            layout: 'split',
            bg: 'bg-gray-800',
            emoji: '😨',
            speaker: '小明',
            text: '這地方...怎麼看起來像個地下黑工廠？燈光昏暗，還有一股怪味。',
            bubbleType: 'thought'
          }
        ],
        tip: {
          title: '權利導航：拒絕非法勞工',
          content: '「現金出糧、不報稅」通常意味著非法勞工（黑工）。根據當地法律，打黑工不受法律保護，且可能導致簽證被取消甚至遣返。'
        },
        nextId: 'node2_bad'
      },
      {
        id: 'B',
        text: '無需報稅？這好像違法，先查查簽證規定。',
        riskDelta: 0,
        consequence: [
          {
            layout: 'split',
            bg: 'bg-green-50',
            emoji: '🏫',
            speaker: '小明',
            text: '還是去學校的就業中心看看吧，這裡正規多了。',
            bubbleType: 'thought'
          }
        ],
        tip: {
          title: '權利導航：合規打工',
          content: '留學生應嚴格遵守簽證規定的工時限制（如每週20小時）。通過正規渠道求職，才能保障自身合法權益。'
        },
        nextId: 'node2_good'
      }
    ]
  },
  'node2_bad': {
    id: 'node2_bad',
    type: 'node',
    panels: [
      {
        layout: 'full',
        bg: 'bg-gray-700',
        emoji: '🕶️',
        speaker: '黑工頭',
        text: '小伙子，想在這做可以，先把護照交給我「保管」，這是行規。',
        bubbleType: 'speech'
      }
    ],
    choices: [
      {
        id: 'A',
        text: '（害怕）好吧，給你...',
        riskDelta: 3,
        consequence: [
          {
            layout: 'full',
            bg: 'bg-red-900',
            emoji: '🔒',
            speaker: 'Narrator',
            text: '護照被鎖進了保險箱。小明感到一陣寒意，他失去了證明身份的唯一證件。',
            bubbleType: 'system'
          }
        ],
        tip: {
          title: '安全警示：證件不離身',
          content: '護照是國家財產，也是你在海外的身份證明。任何個人或雇主無權扣押。如遇強行扣押，應立即報警或聯繫使領館。'
        },
        nextId: 'end'
      },
      {
        id: 'B',
        text: '對不起，護照我必須自己保管。我可以提供複印件。',
        riskDelta: 0, // Mitigates previous risk slightly in narrative
        consequence: [
          {
            layout: 'split',
            bg: 'bg-gray-600',
            emoji: '😡',
            speaker: '黑工頭',
            text: '不交護照？那你就別想幹了！滾！',
            bubbleType: 'shout'
          },
          {
            layout: 'split',
            bg: 'bg-white',
            emoji: '🏃',
            speaker: '小明',
            text: '（雖然沒了工作，但鬆了一口氣）快跑！',
            bubbleType: 'thought'
          }
        ],
        tip: {
          title: '權利導航：堅守底線',
          content: '拒絕不合理要求是你的權利。在海外，保護證件安全等同於保護人身自由。'
        },
        nextId: 'end'
      }
    ]
  },
  'node2_good': {
    id: 'node2_good',
    type: 'node',
    panels: [
      {
        layout: 'full',
        bg: 'bg-white',
        emoji: '☕',
        speaker: '咖啡店經理',
        text: '你的條件不錯。我們需要簽一份合約，另外我需要看一下你的護照確認簽證狀態。',
        bubbleType: 'speech'
      }
    ],
    choices: [
      {
        id: 'A',
        text: '好的，這是我的護照（遞給對方查看）。',
        riskDelta: 0,
        consequence: [
          {
            layout: 'split',
            bg: 'bg-green-100',
            emoji: '🤝',
            speaker: '經理',
            text: '確認無誤。（歸還護照）歡迎加入我們！',
            bubbleType: 'speech'
          }
        ],
        tip: {
          title: '權利導航：正規流程',
          content: '正規雇主會查驗證件以確認合法用工，但會當場歸還，絕不會扣押原件。簽署勞動合同是保障權益的關鍵。'
        },
        nextId: 'end'
      },
      {
        id: 'B',
        text: '（多疑）不行！書上說不能給別人看護照！',
        riskDelta: 1, // Being too paranoid is also a minor "mistake" socially, but safe
        consequence: [
          {
            layout: 'split',
            bg: 'bg-gray-100',
            emoji: '😓',
            speaker: '經理',
            text: '呃...如果不核實身份，我們無法錄用你。',
            bubbleType: 'speech'
          }
        ],
        tip: {
          title: '權利導航：合理查驗',
          content: '「查驗」與「扣押」不同。在辦理入職、住宿、租車等正規手續時，出示證件是必要的程序。'
        },
        nextId: 'end'
      }
    ]
  }
};

// --- Components ---

const GameI: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // State
  const [renderedPanels, setRenderedPanels] = useState<React.ReactNode[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [riskScore, setRiskScore] = useState(0);
  const [showTip, setShowTip] = useState<{ title: string, content: string } | null>(null);
  
  // Initialize Intro
  useEffect(() => {
    loadNode('start');
  }, []);

  // Auto scroll to bottom when panels change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [renderedPanels, showTip]);

  const loadNode = (nodeId: string) => {
    if (nodeId === 'end') {
      renderEnding();
      return;
    }

    const node = STORY[nodeId];
    if (!node) return;

    // 1. Add Story Panels
    const newPanels = node.panels.map((panel, idx) => (
      <Panel key={`${nodeId}-p-${idx}`} data={panel} />
    ));

    setRenderedPanels(prev => [...prev, ...newPanels]);

    // 2. If it's a decision node, render choices UI (Not as permanent panel, but as current interactive area)
    // We handle choices rendering in the main render return, separate from the history list.
    setCurrentNodeId(nodeId);
  };

  const handleChoice = (choice: Choice) => {
    // 1. Add User Choice Bubble to history (The "Flying" animation simulation)
    const choicePanel: React.ReactNode = (
      <div key={`choice-${Date.now()}`} className="w-full mb-6 animate-slide-up">
        <div className="flex justify-end">
           <div className="bg-brand-blue text-white px-5 py-3 rounded-l-2xl rounded-tr-2xl shadow-md max-w-[80%] relative">
              {choice.text}
              <div className="absolute -right-2 top-0 w-0 h-0 border-t-[10px] border-t-brand-blue border-r-[10px] border-r-transparent"></div>
           </div>
        </div>
      </div>
    );

    // 2. Add Consequence Panels
    const consequencePanels = choice.consequence.map((panel, idx) => (
      <Panel key={`cons-${Date.now()}-${idx}`} data={panel} />
    ));

    setRenderedPanels(prev => [...prev, choicePanel, ...consequencePanels]);
    setRiskScore(prev => prev + choice.riskDelta);

    // 3. Show Tip
    setShowTip(choice.tip);

    // 4. Update Next Step Logic (We wait for user to dismiss tip/click next)
    setCurrentNodeId(choice.nextId); // Store for when tip is closed
  };

  const handleTipNext = () => {
    setShowTip(null);
    loadNode(currentNodeId);
  };

  const renderEnding = () => {
    let type: 'good' | 'bad' | 'mixed' = 'good';
    let title = '';
    let desc = '';
    let emoji = '';

    if (riskScore === 0) {
      type = 'good';
      title = '明智之旅';
      desc = '你的每一個選擇都充滿智慧！不僅找到了工作，還完美保障了自己的權益。';
      emoji = '🌟';
    } else if (riskScore <= 2) {
      type = 'mixed';
      title = '有驚無險';
      desc = '雖然過程有些波折，但好在你守住了底線。記住這次的教訓，下次會做得更好！';
      emoji = '😅';
    } else {
      type = 'bad';
      title = '麻煩纏身';
      desc = '糟糕！護照被扣或陷入非法打工的泥潭。這時請立即聯繫外交部 12308 熱線尋求幫助。';
      emoji = '🚨';
    }

    const endingPanel = (
      <div key="ending" className="w-full p-6 my-8 animate-fade-in">
         <div className={`rounded-3xl p-8 text-center border-4 shadow-2xl ${type === 'good' ? 'bg-green-100 border-green-500' : type === 'bad' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'}`}>
            <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
            <h2 className="text-3xl font-black mb-4 text-slate-800">{title}</h2>
            <p className="text-slate-600 mb-8 font-bold leading-relaxed">{desc}</p>
            <button 
               onClick={() => window.location.reload()}
               className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
               重新體驗
            </button>
         </div>
      </div>
    );

    setRenderedPanels(prev => [...prev, endingPanel]);
    setCurrentNodeId('end'); // Lock
  };

  // --- Sub Component: Panel ---
  const Panel: React.FC<{ data: ComicPanelData }> = ({ data }) => {
    // Styles based on speaker
    const isNarrator = data.speaker === 'Narrator';
    const isSystem = data.bubbleType === 'system';
    const isShout = data.bubbleType === 'shout';
    const isThought = data.bubbleType === 'thought';

    return (
      <div className={`w-full mb-6 flex flex-col ${isNarrator ? 'items-center' : 'items-start'} animate-fade-in`}>
         {/* Panel Box */}
         <div className={`w-full border-4 border-slate-900 rounded-lg overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.2)] bg-white relative`}>
            {/* Visual Area */}
            <div className={`h-40 ${data.bg} flex items-center justify-center relative overflow-hidden`}>
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/halftone.png')]"></div>
               <div className="text-7xl relative z-10 filter drop-shadow-md">{data.emoji}</div>
               {/* Speaker Tag */}
               {data.speaker && !isNarrator && (
                  <div className="absolute top-2 left-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">
                     {data.speaker}
                  </div>
               )}
            </div>
            
            {/* Text Area */}
            <div className="p-4 bg-white border-t-4 border-slate-900 relative">
               {/* Bubble Tail simulation if needed, but simplified to block style for now */}
               <p className={`text-base font-bold text-slate-800 leading-relaxed 
                  ${isSystem ? 'font-mono text-slate-500 text-sm' : ''}
                  ${isShout ? 'text-xl uppercase text-red-600 font-black' : ''}
                  ${isThought ? 'text-slate-600 italic' : ''}
               `}>
                  {data.text}
               </p>
            </div>
         </div>
      </div>
    );
  };

  // --- Main Render ---

  const currentNode = STORY[currentNodeId];
  const isDecisionTime = currentNode?.type === 'node' && !showTip && currentNodeId !== 'end';
  const isStart = currentNodeId === 'start' && !showTip;

  return (
    <div className="min-h-screen bg-slate-200 font-sans relative overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 z-30 flex items-center justify-between px-4 shadow-md">
         <button onClick={() => navigate('/game-zone')} className="text-white font-bold">&larr; {t('app.back')}</button>
         <h1 className="text-white font-black text-lg tracking-wider">漫遊權利</h1>
         <div className="w-10"></div>
      </div>

      {/* Comic Stream */}
      <div ref={scrollRef} className="flex-1 pt-20 pb-40 px-4 overflow-y-auto max-w-lg mx-auto w-full scroll-smooth">
         {renderedPanels}
         
         {/* Choices UI (Attached to bottom of stream) */}
         {(isDecisionTime || isStart) && currentNode?.choices && (
            <div className="w-full mt-4 space-y-3 animate-slide-up">
               <div className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">做出你的選擇</div>
               {currentNode.choices.map(choice => (
                  <button
                     key={choice.id}
                     onClick={() => handleChoice(choice)}
                     className="w-full p-4 bg-white border-b-4 border-r-4 border-slate-900 rounded-xl text-left font-bold text-slate-800 hover:bg-yellow-50 active:translate-y-1 active:border-b-0 active:border-r-0 active:shadow-inner transition-all flex items-center gap-3"
                  >
                     <span className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-full font-black text-sm shrink-0">
                        {choice.id}
                     </span>
                     {choice.text}
                  </button>
               ))}
            </div>
         )}
      </div>

      {/* Navigator Tip Modal (Slide Up) */}
      {showTip && (
         <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={() => {}}></div>
            <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 relative pointer-events-auto animate-slide-up shadow-2xl border-t-8 border-brand-blue">
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-blue text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg">
                  🧭
               </div>
               <div className="mt-4 text-center">
                  <h3 className="text-xl font-black text-slate-800 mb-2">{showTip.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                     {showTip.content}
                  </p>
                  <button 
                     onClick={handleTipNext}
                     className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
                  >
                     明白，繼續劇情 &rarr;
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default GameI;
