
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// Game Data
interface Scenario {
  id: number;
  country: string; // Used for badge/flag
  countryCode: string; // ISO code for flagcdn
  situation: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    country: "日本",
    countryCode: "jp",
    situation: "【背景：日本東京成田機場轉機大廳】\n【角色：澳門高中學生】\n因前一程航班延誤，你到達時下一程前往北海道的航班登機手續已關閉，日本航空職員以轉機時間不足為由拒絕你登機。",
    options: [
      "在櫃檯大吵大鬧要求賠償",
      "聯繫中國駐日本大使館或附近領事館尋求協助",
      "強行闖入登機口嘗試登機",
      "睡在機場地板等待下一班機"
    ],
    correctIndex: 1,
    explanation: "遇到航班延誤或轉機受阻，應理性維權。若受到不公正對待或溝通困難，可尋求使領館協助，提供語言或協調幫助。"
  },
  {
    id: 2,
    country: "泰國",
    countryCode: "th",
    situation: "【背景：泰國曼谷開往芭堤雅的火車上】\n【角色：獨自旅行的背包客】\n小睡醒來後，發現放在腳邊的背包不翼而飛，裡面有護照、少量現金和信用卡。",
    options: [
      "驚慌失措，立即結束行程回國",
      "立即向當地警方報案，然後前往中國駐泰國大使館申請旅行證",
      "在社交媒體發文求助，等待網友匯款",
      "找路邊攤販幫忙追賊"
    ],
    correctIndex: 1,
    explanation: "護照遺失必須先取得當地警方的報案證明，這是向使領館申請補辦旅行證件的必要文件。"
  },
  {
    id: 3,
    country: "美國",
    countryCode: "us",
    situation: "【背景：美國蒙大拿州滑雪度假村】\n【角色：與家人度假的學生】\n在滑雪時意外摔傷，被診斷為小腿骨折需立即手術，但初步估計的醫療費用遠超預算和家人保險額度。",
    options: [
      "為了省錢拒絕治療，堅持飛回澳門",
      "接受治療，請醫院協助聯繫中國駐美國使領館，獲取當地醫療資源與溝通協助",
      "找律師起訴滑雪場要求全額賠償",
      "相信偏方，自己包紮處理"
    ],
    correctIndex: 1,
    explanation: "生命安全第一。使領館雖不能代付醫藥費，但可提供當地醫療機構名單、協助與醫院溝通或聯繫家屬匯款。"
  },
  {
    id: 4,
    country: "義大利",
    countryCode: "it",
    situation: "【背景：義大利羅馬西班牙廣場附近】\n【角色：參加國際青年藝術節的澳門中學生】\n在拍攝街景時，無意中被捲入一場突然發生的環保抗議活動，因人群擁擠未能及時離開，與部分示威者一同被警方帶走。",
    options: [
      "為了盡快離開，警方讓簽什麼就簽什麼",
      "要求警方通知中國駐義大利使領館，並在領事官員到來前不簽署任何文件",
      "大聲抗議並試圖逃跑",
      "假裝聽不懂英語，拒絕溝通"
    ],
    correctIndex: 1,
    explanation: "根據《維也納領事關係公約》，被捕時你有權要求通知所在國使領館。在不懂當地法律語言的情況下，切勿隨意簽署文件。"
  },
  {
    id: 5,
    country: "法國",
    countryCode: "fr",
    situation: "【背景：法國阿爾卑斯山區薩瓦省】\n【角色：參加冬季滑雪營的學員】\n所在山區因連日暴雪發生雪崩，對外道路中斷，度假村成為孤島，食物補給開始緊張。",
    options: [
      "獨自冒險徒步下山尋找物資",
      "前往度假村管理處登記澳門居民身份，並聯繫中國駐法國大使館應急機制",
      "搶奪其他遊客的食物",
      "躲在房間哭泣，什麼都不做"
    ],
    correctIndex: 1,
    explanation: "遇自然災害受困，應保持冷靜，聽從指揮，並盡快與使領館取得聯繫，以便使領館掌握情況協調救援。"
  },
  {
    id: 6,
    country: "澳洲",
    countryCode: "au",
    situation: "【背景：澳洲塔斯馬尼亞州霍巴特的某農場】\n【角色：持打工度假簽證的青年】\n農場主以「工作質量未達標」為由，拒絕支付你過去一個月的薪資，並威脅如果你申訴將舉報你違反簽證條例。",
    options: [
      "忍氣吞聲，換一家農場工作",
      "收集證據向當地公平工作委員會投訴，並諮詢中國駐墨爾本總領館的建議",
      "破壞農場設施作為報復",
      "害怕簽證被取消，立即買機票回國"
    ],
    correctIndex: 1,
    explanation: "海外打工遇到勞資糾紛，應通過法律途徑維權。使領館可提供當地法律諮詢機構名單或律師建議。"
  },
  {
    id: 7,
    country: "沙烏地阿拉伯",
    countryCode: "sa",
    situation: "【背景：沙烏地阿拉伯利雅得的傳統市場】\n【角色：隨商務考察父親前往的高中生】\n在齋月期間的白天，你因口渴在公共場合飲水，被宗教警察發現並嚴厲指責，可能面臨罰款或處罰。",
    options: [
      "辯解「不知者無罪」，繼續喝水",
      "立即誠懇道歉，停止行為，並聯繫中國駐沙烏地阿拉伯大使館尋求指導與協助",
      "與宗教警察發生肢體衝突",
      "轉身逃跑"
    ],
    correctIndex: 1,
    explanation: "尊重當地風俗習慣和法律法規是海外安全的前提。遇到文化衝突，應態度誠懇，避免激化矛盾。"
  },
  {
    id: 8,
    country: "英國",
    countryCode: "gb",
    situation: "【背景：英國倫敦】\n【角色：在當地大學進行短期交換的學生】\n父母在澳門為你購置房產，需要你簽署一份授權書並辦理公證，以便他們代為辦理手續。",
    options: [
      "直接將簽名文件寄回澳門即可",
      "前往中國駐英國大使館辦理相關文書的公證或認證",
      "找學校教授幫忙見證簽名",
      "通過視訊通話向父母口頭授權"
    ],
    correctIndex: 1,
    explanation: "在國外簽署的法律文書通常需要經過中國駐外使領館的公證或認證，才能在中國（含港澳）境內產生法律效力。"
  },
  {
    id: 9,
    country: "西班牙",
    countryCode: "es",
    situation: "【背景：西班牙巴塞隆納的地鐵車廂內】\n【角色：自由行的亞裔遊客】\n幾名當地青年因疫情後遺緒，對你進行帶有種族歧視的言語侮辱，並推搡你，周圍乘客無人制止。",
    options: [
      "當場與對方發生肢體衝突",
      "在安全抵達站台後立即報警，並向中國駐巴塞隆納總領館反映情況",
      "默默忍受，不敢聲張",
      "在網上發帖洩憤，但不報警"
    ],
    correctIndex: 1,
    explanation: "遭遇歧視或仇恨犯罪，首先確保人身安全，隨後應報警並向使領館報告，使領館可向駐在國提出交涉，維護公民尊嚴。"
  },
  {
    id: 10,
    country: "土耳其",
    countryCode: "tr",
    situation: "【背景：土耳其伊斯坦堡機場】\n【角色：準備轉機回澳門的旅客】\n機場大螢幕顯示，你預訂的航班因航空公司員工突然罷工而被取消，後續幾天內的航班全部客滿。",
    options: [
      "在登機口大聲喧嘩，阻礙他人登機",
      "前往航空公司櫃檯辦理改簽索賠，如權益受損聯繫中國駐伊斯坦堡總領館",
      "輕信陌生人購買高價黃牛票",
      "滯留機場禁區，拒絕離開"
    ],
    correctIndex: 1,
    explanation: "航班取消屬於商業糾紛，應先與航空公司協商。若遭遇歧視性待遇或合法權益受損，使領館可提供必要協助。"
  }
];

type GameState = 'start' | 'playing' | 'feedback' | 'summary';

const GameA: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]); // Array of country codes
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  // Initialize Game
  useEffect(() => {
    // Shuffle scenarios on load
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    setShuffledScenarios(shuffled);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeOut();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setCurrentScenarioIndex(0);
    setScore(0);
    setBadges([]);
    setTimeLeft(60);
  };

  const handleTimeOut = () => {
    setSelectedOption(-1); // -1 indicates timeout
    setIsCorrect(false);
    setGameState('feedback');
  };

  const handleOptionClick = (index: number) => {
    if (gameState !== 'playing') return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedOption(index);
    const correct = index === shuffledScenarios[currentScenarioIndex].correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      setScore((prev) => prev + 100 + (timeLeft * 2)); // Bonus for speed
      setBadges((prev) => [...prev, shuffledScenarios[currentScenarioIndex].countryCode]);
    }

    setGameState('feedback');
  };

  const nextScenario = () => {
    if (currentScenarioIndex < shuffledScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setTimeLeft(60); // Reset timer for next question
      setSelectedOption(null);
      setGameState('playing');
    } else {
      setGameState('summary');
    }
  };

  // --- Render Components ---

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
        <div className="relative text-8xl mb-4">🌍</div>
      </div>
      
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
          全球領事守護者
        </h1>
        <p className="text-blue-200 text-lg font-medium">Global Consular Guardian</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-md mx-auto text-left shadow-xl">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span className="text-xl">🎮</span> 遊戲規則
        </h3>
        <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-brand-blue">•</span>
            你將扮演一名在海外的澳門居民，面對突發狀況。
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-blue">•</span>
            每個情境限時 <span className="text-yellow-400 font-bold">60秒</span> 做出正確決策。
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-blue">•</span>
            答對即可解鎖該國家的 <span className="text-green-400 font-bold">領事徽章</span>。
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-blue">•</span>
            收集所有徽章，成為最強領保達人！
          </li>
        </ul>
      </div>

      <button
        onClick={startGame}
        className="group relative px-8 py-4 bg-brand-blue text-white font-bold text-xl rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,102,204,0.5)] transition-all hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full"></div>
        <span className="relative flex items-center gap-2">
          開始挑戰 <span className="text-2xl">🚀</span>
        </span>
      </button>
    </div>
  );

  const renderGameScreen = () => {
    const scenario = shuffledScenarios[currentScenarioIndex];
    return (
      <div className="max-w-3xl mx-auto w-full animate-slide-up">
        {/* Progress & Timer */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
               <img 
                 src={`https://flagcdn.com/${scenario.countryCode}.svg`} 
                 alt={scenario.country} 
                 className="w-full h-full object-cover"
               />
             </div>
             <div>
               <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</div>
               <div className="text-white font-bold">{scenario.country}</div>
             </div>
          </div>
          
          <div className="flex flex-col items-end">
             <div className={`text-2xl font-black font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
               {timeLeft}s
             </div>
             <div className="w-32 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
             </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl pointer-events-none select-none">
              ?
           </div>
           <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed relative z-10 whitespace-pre-line">
             {scenario.situation}
           </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {scenario.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className="w-full text-left p-5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:bg-brand-blue/20 hover:border-brand-blue/50 hover:text-white transition-all active:scale-[0.99] font-medium text-base md:text-lg shadow-sm"
            >
              <span className="inline-block w-8 h-8 rounded-full bg-white/10 text-center leading-8 mr-4 text-sm font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          ))}
        </div>
        
        <div className="text-center mt-6 text-gray-500 text-sm">
           情境 {currentScenarioIndex + 1} / {SCENARIOS.length}
        </div>
      </div>
    );
  };

  const renderFeedbackScreen = () => {
    const scenario = shuffledScenarios[currentScenarioIndex];
    return (
      <div className="max-w-2xl mx-auto w-full animate-fade-in pt-10">
        <div className={`p-8 rounded-3xl text-center border-4 shadow-2xl backdrop-blur-xl relative overflow-hidden ${isCorrect ? 'bg-green-900/80 border-green-500' : 'bg-red-900/80 border-red-500'}`}>
           
           {/* Animated Icon */}
           <div className="text-8xl mb-4 animate-bounce">
              {isCorrect ? '🛡️' : '⚠️'}
           </div>

           <h2 className={`text-3xl font-black mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
             {isCorrect ? '決策正確！' : '決策錯誤'}
           </h2>
           
           <p className="text-white/90 text-lg mb-8 font-medium leading-relaxed">
             {isCorrect ? '你成功運用了領保知識，獲得了新的徽章！' : '這樣做可能會帶來更大的風險。'}
           </p>

           <div className="bg-black/30 rounded-xl p-6 text-left border border-white/10 mb-8">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                💡 領保小知識
              </h3>
              <p className="text-gray-200 leading-relaxed">
                {scenario.explanation}
              </p>
           </div>

           <button
             onClick={nextScenario}
             className="w-full py-4 bg-white text-slate-900 font-black text-xl rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
           >
             {currentScenarioIndex < shuffledScenarios.length - 1 ? '下一題 →' : '查看成績 🏆'}
           </button>
        </div>
      </div>
    );
  };

  const renderSummaryScreen = () => {
    const total = shuffledScenarios.length;
    const correctCount = badges.length;
    const percentage = Math.round((correctCount / total) * 100);
    const isFullScore = correctCount === total;
    
    return (
      <div className="max-w-4xl mx-auto w-full animate-slide-up pb-10">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">任務完成！</h2>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm mb-4">
               {score} 分
            </div>
            <p className="text-gray-400">
               你成功解決了 {correctCount} / {total} 個突發狀況
            </p>
         </div>

         {/* Badge Map Grid */}
         <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl mb-8">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
               <span>🗺️</span> 你的全球領事徽章地圖
            </h3>
            
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
               {SCENARIOS.map((s, i) => {
                 const isUnlocked = badges.includes(s.countryCode);
                 return (
                   <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all duration-500 ${isUnlocked ? 'bg-white/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-md mb-2">
                         <img 
                           src={`https://flagcdn.com/${s.countryCode}.svg`} 
                           alt={s.country}
                           className="w-full h-full object-cover" 
                         />
                      </div>
                      <span className={`text-[10px] md:text-xs font-bold text-center leading-tight ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                        {s.country}
                      </span>
                      {isUnlocked && <span className="text-[8px] text-green-400 mt-1">GET!</span>}
                   </div>
                 )
               })}
            </div>
         </div>

         <div className="flex gap-4 mb-8">
            <button
              onClick={() => navigate('/game-zone')}
              className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
            >
              返回遊戲大廳
            </button>
            <button
              onClick={startGame}
              className="flex-1 py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              再次挑戰 🔄
            </button>
         </div>

         {/* Submit Score Section - Only visible on full score */}
         {isFullScore && (
            <div className="text-center animate-fade-in border-t border-white/10 pt-8">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdoH9T9CBlXSMBctGjgC8En2ai2_IVn6WHv57Rje4XKKTcajQ/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full md:w-auto px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-black text-xl rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-105 transition-all mb-4 border border-yellow-400/30"
                >
                  提交成績 🏆
                </a>
            </div>
         )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent pt-20 pb-10 px-4 font-sans flex flex-col relative overflow-hidden">
      {/* Background Overlay specifically for Game A to focus attention */}
      <div className="fixed inset-0 bg-slate-900/80 z-0"></div>
      
      {/* Back Button */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mb-4">
         {gameState === 'start' && (
            <button 
               onClick={() => navigate('/game-zone')} 
               className="text-gray-400 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 mb-4"
            >
               &larr; {t('app.back')}
            </button>
         )}
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {gameState === 'start' && renderStartScreen()}
        {gameState === 'playing' && renderGameScreen()}
        {gameState === 'feedback' && renderFeedbackScreen()}
        {gameState === 'summary' && renderSummaryScreen()}
      </div>
    </div>
  );
};

export default GameA;
