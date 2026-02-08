
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../LanguageContext';
import { translations } from '../locales';

interface QuizItem {
  id: number;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const SafetyIndex: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const quizData = (translations['zh-MO'].data.safety_quiz as unknown) as QuizItem[];

  const handleOptionSelect = (qId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const calculateData = () => {
    const checkCorrect = (id: number) => {
      const q = quizData.find(i => i.id === id);
      return q && answers[id] === q.answer ? 1 : 0;
    };

    const getScore = (ids: number[]) => {
      const correctCount = ids.reduce((sum, id) => sum + checkCorrect(id), 0);
      return (correctCount / ids.length) * 100;
    };

    return [
      { subject: t('safety.subjects.help'), A: getScore([1, 3]), fullMark: 100 },
      { subject: t('safety.subjects.docs'), A: getScore([2, 9]), fullMark: 100 },
      { subject: t('safety.subjects.fraud'), A: getScore([4, 8]), fullMark: 100 },
      { subject: t('safety.subjects.safety'), A: getScore([6, 10]), fullMark: 100 },
      { subject: t('safety.subjects.compliance'), A: getScore([5, 7]), fullMark: 100 },
    ];
  };

  const totalScore = quizData.reduce((score, q) => {
    return score + (answers[q.id] === q.answer ? 10 : 0);
  }, 0);

  const getIncorrectQuestions = () => {
    return quizData.filter(q => answers[q.id] !== q.answer);
  };

  const allAnswered = quizData.length === Object.keys(answers).length;

  return (
    <div className="pb-24 min-h-screen bg-transparent">
      {/* Header */}
      <div className="relative pt-32 pb-10 px-6 bg-gradient-to-br from-orange-500/80 to-red-600/80 backdrop-blur-md text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden border-b border-white/20">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 drop-shadow-lg">
            {t('safety.hero_title')}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg">
            {t('safety.hero_desc')}
          </p>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {!submitted ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-blue-500/10 backdrop-blur-md p-4 rounded-xl text-blue-200 text-sm border border-blue-500/30 flex gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>{t('safety.intro')}</div>
            </div>

            {quizData.map((q, index) => (
              <div key={q.id} className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/10">
                <h3 className="font-bold text-gray-100 mb-4 text-lg flex gap-2">
                  <span className="text-white">{index + 1}.</span>
                  {q.q}
                </h3>
                <div className="space-y-3">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(q.id, idx)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 backdrop-blur-sm ${
                        answers[q.id] === idx 
                          ? 'bg-white border-white text-brand-blue shadow-[0_0_15px_rgba(255,255,255,0.8)] font-bold' 
                          : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        answers[q.id] === idx ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-500 bg-transparent text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className={`w-full py-4 rounded-xl font-bold shadow-lg mt-8 text-lg transition-all transform backdrop-blur-md ${
                allAnswered 
                  ? 'bg-brand-blue/90 text-white hover:bg-brand-blue border border-white/20 active:scale-95' 
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {t('safety.generate_btn')}
            </button>
            {!allAnswered && <p className="text-center text-xs text-white">請回答所有問題以查看結果</p>}
          </div>
        ) : (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 animate-slide-up border border-white/10">
            <h2 className="text-center text-lg font-bold text-gray-400 mb-2 uppercase tracking-widest">{t('safety.result_title')}</h2>
            
            <div className="flex flex-col items-center justify-center mb-8">
               <div className={`text-7xl font-black mb-2 ${totalScore >= 80 ? 'text-green-400' : totalScore >= 60 ? 'text-orange-400' : 'text-red-400'}`}>
                 {totalScore}
               </div>
               <div className="h-2 w-24 rounded-full bg-gray-700 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${totalScore >= 80 ? 'bg-green-500' : totalScore >= 60 ? 'bg-orange-500' : 'bg-red-500'}`} 
                    style={{ width: `${totalScore}%` }}
                  ></div>
               </div>
            </div>

            {/* Radar Chart */}
            <div className="h-64 w-full -ml-2 mb-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={calculateData()}>
                  <PolarGrid stroke="#4b5563" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Safety"
                    dataKey="A"
                    stroke="#CC0000"
                    strokeWidth={2}
                    fill="#CC0000"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Feedback Section */}
            <div className="space-y-6 border-t border-white/10 pt-6">
              {totalScore === 100 ? (
                 <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="font-bold text-green-400 mb-1">完美表現！</h3>
                    <p className="text-sm text-green-300">{t('safety.success_msg')}</p>
                 </div>
              ) : (
                 <>
                   <h3 className="font-bold text-gray-200 flex items-center gap-2">
                     <span>🧐</span> {t('safety.feedback_title')}
                   </h3>
                   <div className="space-y-4">
                     {getIncorrectQuestions().map((q) => (
                       <div key={q.id} className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                          <div className="text-xs font-bold text-red-400 mb-1">Question {q.id}</div>
                          <div className="font-bold text-red-200 text-sm mb-3">{q.q}</div>
                          
                          <div className="flex gap-2 text-xs mb-2">
                             <span className="font-bold text-gray-400 whitespace-nowrap">{t('safety.correct_label')}</span>
                             <span className="text-green-400 font-bold">{q.options[q.answer]}</span>
                          </div>
                          
                          <div className="bg-black/30 p-3 rounded-lg text-xs text-red-200 leading-relaxed border border-white/5">
                             <span className="font-bold block mb-1 text-white">💡 {t('safety.explanation_label')}</span>
                             {q.explanation}
                          </div>
                       </div>
                     ))}
                   </div>
                 </>
              )}
            </div>
            
            <button 
              onClick={() => { setSubmitted(false); setAnswers({}); window.scrollTo(0, 0); }}
              className="w-full border border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/5 py-3 rounded-xl font-bold mt-8 transition-colors backdrop-blur-sm"
            >
              {t('safety.retake_btn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyIndex;
