
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed unused useLanguage import

// --- Types ---

type ScenarioId = 'culture' | 'study' | 'homesick';

interface Action {
  id: string;
  text: string;
  feedback: string;
  effect?: 'resource_hint';
}

interface ScenarioData {
  id: ScenarioId;
  title: string;
  context: string;
  imageIcon: string;
  bgColor: string;
  emotions: string[];
  actions: Action[];
}

// --- Data ---

const SCENARIOS: ScenarioData[] = [
  {
    id: 'culture',
    title: "校園社交圈",
    context: "來到新校園的第三週，當你興奮地想和同學分享從澳門帶來的杏仁餅時，卻發現很難插入他們關於當地棒球聯賽的話題... 大家都聊得很開心，你拿著餅乾的手停在半空。",
    imageIcon: "🍪",
    bgColor: "from-[#E0E7E9] to-[#C0D4EA]", // Muted Blueish
    emotions: ["有點孤單", "無所謂，習慣了", "好奇他們的話題", "輕微焦慮"],
    actions: [
      {
        id: "A",
        text: "默默把餅乾收起來，戴上耳機回宿舍。",
        feedback: "你獲得了一時的安靜，但夜晚看著天花板，心裡可能感到更空蕩。也許明天可以試試別的？",
      },
      {
        id: "B",
        text: "給在澳門的好友發訊息吐槽：「這裡的人只聊棒球！」",
        feedback: "朋友的秒回讓你感到溫暖。雖然距離很遠，但這種連結是你堅強的後盾。",
      },
      {
        id: "C",
        text: "試著問旁邊的同學：「這個球隊很有名嗎？我是新來的不太懂。」",
        feedback: "雖然一開始有點緊張，但同學熱情地向你解釋了規則。微小的嘗試往往是轉機的開始。",
      }
    ]
  },
  {
    id: 'study',
    title: "期末圖書館",
    context: "期末考週的圖書館燈火通明。你看著厚厚的全英文教材和還沒寫完的論文，大腦突然一片空白。身邊的同學都在運指如飛，只有你的游標在文檔第一行閃爍。",
    imageIcon: "📚",
    bgColor: "from-[#F0EFEE] to-[#D8D3CD]", // Warm Grey
    emotions: ["自我懷疑", "想要逃跑", "極度疲憊", "麻木"],
    actions: [
      {
        id: "A",
        text: "通宵喝咖啡，強迫自己必須寫完。",
        feedback: "你熬過了今晚，但身體的透支讓第二天的效率更低了。休息不是偷懶，是為了走更遠。",
      },
      {
        id: "B",
        text: "去學校的心理諮詢中心網站看看有沒有減壓工作坊。",
        feedback: "這是一個聰明的決定。大多數海外高校都提供免費的學業壓力諮詢，尋求幫助是強者的行為。",
      },
      {
        id: "C",
        text: "暫時合上電腦，去做 10 分鐘深呼吸。",
        feedback: "短暫的抽離讓你找回了節奏。即使只寫了一段，那也是切實的進步。",
      }
    ]
  },
  {
    id: 'homesick',
    title: "獨自過節",
    context: "今天是冬至。朋友圈裡大家都在曬家人團聚的湯圓和盆菜。你看著窗外陌生的街道和剛下過的雪，宿舍裡只有你一個人，桌上放著便利店買的三明治。",
    imageIcon: "❄️",
    bgColor: "from-[#F5E6E6] to-[#E6C9C9]", // Dusty Pink
    emotions: ["想家想哭了", "羨慕", "覺得自己很慘", "平靜"],
    actions: [
      {
        id: "A",
        text: "給家裡打個視訊電話，看看家裡的貓。",
        feedback: "聽到家人的聲音和貓咪的呼嚕聲，雖然觸不到，但愛是跨越時區的暖流。",
      },
      {
        id: "B",
        text: "查詢當地是否有華人學生聯誼會 (CSSA) 的聚會。",
        feedback: "原來學校附近就有一家粵菜館今晚有聚餐！你可能會遇到同樣想家的夥伴。",
      },
      {
        id: "C",
        text: "蒙頭大睡，希望這一天快點過去。",
        feedback: "這也是一種保護機制。等睡醒了，太陽依然會升起，新的日子會來臨。",
      }
    ]
  }
];

// --- Components ---

const GameH: React.FC = () => {
  const navigate = useNavigate();

  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [stage, setStage] = useState<'intro' | 'context' | 'emotion' | 'action' | 'feedback' | 'resources'>('intro');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isFading, setIsFading] = useState(false);

  const scenario = SCENARIOS[currentScenarioIdx];

  const handleTransition = (nextStage: typeof stage) => {
    setIsFading(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsFading(false);
      window.scrollTo(0, 0);
    }, 500);
  };

  const handleNextScenario = () => {
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx(prev => prev + 1);
      setSelectedEmotion(null);
      setSelectedAction(null);
      handleTransition('context');
    } else {
      // Loop or end? Let's loop for now or go to resources as final
      handleTransition('resources');
    }
  };

  // --- Views ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-8">
      <div className="w-32 h-32 bg-[#DAEAC0] rounded-full flex items-center justify-center text-6xl shadow-[0_10px_40px_rgba(218,234,192,0.4)] animate-[float_6s_ease-in-out_infinite]">
        🧭
      </div>
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-wide font-serif">心靈避風港導航員</h1>
        <p className="text-slate-500 text-sm">Mind Haven Navigator</p>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 max-w-sm text-left shadow-sm">
        <h3 className="text-slate-700 font-bold mb-2 text-sm">隱私聲明</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          本體驗為教育性互動故事，<span className="font-bold">不收集</span>任何個人資料或心理數據。所有選擇僅用於體驗劇情。如需專業幫助，請務必聯繫文末提供的正式機構。
        </p>
      </div>

      <button 
        onClick={() => handleTransition('context')}
        className="px-10 py-3 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:bg-slate-700 transition-all active:scale-95"
      >
        開始旅程
      </button>
    </div>
  );

  const renderContext = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-8xl mb-6 opacity-80 filter drop-shadow-sm">{scenario.imageIcon}</div>
        <div className="bg-white/40 inline-block px-4 py-1 rounded-full text-slate-500 text-xs mb-4 font-bold tracking-widest uppercase">
          Scenario {currentScenarioIdx + 1}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{scenario.title}</h2>
        <p className="text-slate-600 text-base leading-loose text-justify bg-white/50 p-6 rounded-2xl shadow-sm border border-white/20">
          {scenario.context}
        </p>
      </div>
      
      <div className="w-full text-center animate-pulse text-slate-400 text-sm mt-4">
         你感到一陣...
      </div>

      <button 
        onClick={() => handleTransition('emotion')}
        className="mt-8 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-slate-600 shadow-md hover:scale-110 transition-transform"
      >
        ↓
      </button>
    </div>
  );

  const renderEmotion = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-slate-700 mb-8">此時此刻，你的感受是？</h2>
      
      <div className="grid grid-cols-1 gap-4 w-full">
        {scenario.emotions.map((emotion, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedEmotion(emotion);
              // Slight delay to show selection state
              setTimeout(() => handleTransition('action'), 300);
            }}
            className={`p-4 rounded-xl text-slate-600 font-medium transition-all shadow-sm border border-white/40 hover:scale-[1.02] active:scale-95 text-left flex justify-between items-center ${selectedEmotion === emotion ? 'bg-slate-700 text-white' : 'bg-white/60 hover:bg-white/80'}`}
          >
            <span>{emotion}</span>
            {selectedEmotion === emotion && <span>✓</span>}
          </button>
        ))}
      </div>

      <div className="mt-8 text-xs text-slate-400 text-center max-w-xs">
        * 所有的情緒都是真實且被允許的。沒有所謂「錯誤」的感受。
      </div>
    </div>
  );

  const renderAction = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 max-w-md mx-auto">
      <div className="mb-6 text-center">
         <span className="text-slate-500 text-sm">你感到</span>
         <span className="font-bold text-slate-700 mx-2 text-lg underline decoration-wavy decoration-slate-300">{selectedEmotion}</span>
         <span className="text-slate-500 text-sm">。</span>
         <p className="text-slate-500 text-sm mt-2">許多初到海外的同學都有類似的感受，這很正常。</p>
      </div>

      <h2 className="text-xl font-bold text-slate-700 mb-6">接下來，你想試著做點什麼？</h2>

      <div className="space-y-4 w-full">
        {scenario.actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedAction(action);
              setTimeout(() => handleTransition('feedback'), 300);
            }}
            className={`p-5 rounded-xl text-slate-700 text-sm leading-relaxed transition-all shadow-sm border border-white/40 hover:shadow-md text-left w-full ${selectedAction?.id === action.id ? 'bg-slate-700 text-white ring-2 ring-slate-400' : 'bg-white/70 hover:bg-white/90'}`}
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center text-4xl shadow-inner mb-6">
        🌱
      </div>
      
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/30 mb-8">
        <p className="text-slate-700 text-lg leading-relaxed font-medium">
          {selectedAction?.feedback}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => handleTransition('resources')}
          className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-700 transition-colors"
        >
          查看心靈補給包 🎁
        </button>
        
        {currentScenarioIdx < SCENARIOS.length - 1 && (
           <button
             onClick={handleNextScenario}
             className="w-full py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors text-sm"
           >
             繼續下一段旅程 &rarr;
           </button>
        )}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="pt-24 pb-12 px-6 max-w-lg mx-auto min-h-screen">
       <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 font-serif">心靈補給站</h2>
          <p className="text-slate-500 text-sm">關注心理健康與保護人身安全同等重要。</p>
       </div>

       <div className="space-y-6">
          {/* Card 1: Consular */}
          <div className="bg-[#E6C9C9]/30 rounded-2xl p-6 border border-[#E6C9C9] shadow-sm">
             <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-bold text-slate-800">祖國在身後</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed mb-4">
                當你感到極度無助或遇到緊急心理危機時，中國駐外使領館可以提供協助，包括推薦當地專業醫療機構。
             </p>
             <div className="bg-white/60 p-3 rounded-lg flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">全球領保熱線</span>
                <span className="font-mono font-bold text-slate-800">+86-10-12308</span>
             </div>
          </div>

          {/* Card 2: School */}
          <div className="bg-[#DAEAC0]/30 rounded-2xl p-6 border border-[#DAEAC0] shadow-sm">
             <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏫</span>
                <h3 className="font-bold text-slate-800">校園資源</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed">
                大多數海外高校都設有免費且保密的 <span className="font-bold">Counseling Center</span>（心理諮詢中心）。
                <br/><br/>
                預約一次談話不是軟弱，而是勇敢且聰明的自我關懷選擇。
             </p>
          </div>

          {/* Card 3: Self Help */}
          <div className="bg-[#C0D4EA]/30 rounded-2xl p-6 border border-[#C0D4EA] shadow-sm">
             <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎧</span>
                <h3 className="font-bold text-slate-800">自助小練習</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed mb-4">
                當焦慮來襲時，試試 <span className="font-bold">4-7-8 呼吸法</span>：
             </p>
             <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>吸氣 4 秒</li>
                <li>憋氣 7 秒</li>
                <li>慢慢呼氣 8 秒</li>
             </ul>
             <div className="mt-4 text-center">
                <button 
                   onClick={() => window.open('https://www.youtube.com/results?search_query=4-7-8+breathing', '_blank')}
                   className="text-xs text-slate-500 underline hover:text-slate-800"
                >
                   跟著影片練習
                </button>
             </div>
          </div>
       </div>

       <div className="mt-10 flex gap-4">
          <button 
            onClick={() => navigate('/game-zone')}
            className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50"
          >
            返回大廳
          </button>
          {currentScenarioIdx < SCENARIOS.length - 1 && (
             <button 
               onClick={handleNextScenario}
               className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700"
             >
               下一個情境
             </button>
          )}
       </div>
    </div>
  );

  // --- Main Render ---

  return (
    <div className={`min-h-screen font-sans transition-colors duration-1000 ease-in-out bg-gradient-to-br ${scenario.bgColor}`}>
      
      {/* Navbar Placeholder */}
      <div className="fixed top-0 left-0 right-0 h-16 z-20 flex items-center px-4">
         <button 
            onClick={() => navigate('/game-zone')}
            className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-slate-600 hover:bg-white/40 transition-colors"
         >
            &larr;
         </button>
         <div className="ml-4 font-serif font-bold text-slate-700 opacity-50">
            Game H
         </div>
      </div>

      {/* Content Container with Fade Transition */}
      <div className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'} pb-10 pt-20`}>
         {stage === 'intro' && renderIntro()}
         {stage === 'context' && renderContext()}
         {stage === 'emotion' && renderEmotion()}
         {stage === 'action' && renderAction()}
         {stage === 'feedback' && renderFeedback()}
         {stage === 'resources' && renderResources()}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default GameH;
