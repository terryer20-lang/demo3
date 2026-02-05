
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../LanguageContext';
import { translations } from '../locales';

// Define the structure locally as it's specific to this new logic
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

  // Load quiz data directly from translations to ensure type safety
  const quizData = (translations['zh-MO'].data.safety_quiz as unknown) as QuizItem[];

  const handleOptionSelect = (qId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const calculateData = () => {
    // Categories Mapping:
    // Help (求助管道): Q1 (12308), Q3 (112)
    // Docs (證件權益): Q2 (Passport), Q9 (Rights)
    // Fraud (防騙網安): Q4 (Scam), Q8 (WiFi)
    // Safety (安全意識): Q6 (Fire), Q10 (Levels)
    // Compliance (合規邊界): Q5 (Consulate limits), Q7 (Medicine)

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

  // Calculate total score out of 100 (10 questions, 10 pts each)
  const totalScore = quizData.reduce((score, q) => {
    return score + (answers[q.id] === q.answer ? 10 : 0);
  }, 0);

  const getIncorrectQuestions = () => {
    return quizData.filter(q => answers[q.id] !== q.answer);
  };

  const allAnswered = quizData.length === Object.keys(answers).length;

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header - Refactored to match Protection/Rights style */}
      <div className="relative pt-32 pb-10 px-6 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-b-[3rem] shadow-2xl mb-8 overflow-hidden">
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
            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm border border-blue-100 flex gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>{t('safety.intro')}</div>
            </div>

            {quizData.map((q, index) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex gap-2">
                  <span className="text-brand-red">{index + 1}.</span>
                  {q.q}
                </h3>
                <div className="space-y-3">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(q.id, idx)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                        answers[q.id] === idx 
                          ? 'bg-red-50 border-brand-red text-red-900 shadow-sm ring-1 ring-red-200' 
                          : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        answers[q.id] === idx ? 'bg-brand-red border-brand-red text-white' : 'border-gray-300 bg-white text-gray-400'
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
              className={`w-full py-4 rounded-xl font-bold shadow-lg mt-8 text-lg transition-all transform ${
                allAnswered 
                  ? 'bg-brand-blue text-white hover:bg-blue-700 active:scale-95' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('safety.generate_btn')}
            </button>
            {!allAnswered && <p className="text-center text-xs text-gray-400">請回答所有問題以查看結果</p>}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-slide-up border border-gray-100">
            <h2 className="text-center text-lg font-bold text-gray-500 mb-2 uppercase tracking-widest">{t('safety.result_title')}</h2>
            
            <div className="flex flex-col items-center justify-center mb-8">
               <div className={`text-7xl font-black mb-2 ${totalScore >= 80 ? 'text-green-500' : totalScore >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                 {totalScore}
               </div>
               <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden">
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
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Safety"
                    dataKey="A"
                    stroke="#CC0000"
                    strokeWidth={2}
                    fill="#CC0000"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Feedback Section */}
            <div className="space-y-6 border-t border-gray-100 pt-6">
              {totalScore === 100 ? (
                 <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="font-bold text-green-800 mb-1">完美表現！</h3>
                    <p className="text-sm text-green-700">{t('safety.success_msg')}</p>
                 </div>
              ) : (
                 <>
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                     <span>🧐</span> {t('safety.feedback_title')}
                   </h3>
                   <div className="space-y-4">
                     {getIncorrectQuestions().map((q) => (
                       <div key={q.id} className="bg-red-50 rounded-xl p-4 border border-red-100">
                          <div className="text-xs font-bold text-red-400 mb-1">Question {q.id}</div>
                          <div className="font-bold text-red-900 text-sm mb-3">{q.q}</div>
                          
                          <div className="flex gap-2 text-xs mb-2">
                             <span className="font-bold text-gray-500 whitespace-nowrap">{t('safety.correct_label')}</span>
                             <span className="text-green-700 font-bold">{q.options[q.answer]}</span>
                          </div>
                          
                          <div className="bg-white/60 p-3 rounded-lg text-xs text-red-800 leading-relaxed">
                             <span className="font-bold block mb-1">💡 {t('safety.explanation_label')}</span>
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
              className="w-full border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-bold mt-8 transition-colors"
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
