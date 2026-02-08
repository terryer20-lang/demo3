
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useLanguage } from '../LanguageContext';
import { PHONE_DATA, PhoneItem } from '../consulateData';

// --- Assets ---
const MacauLandmarkSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full opacity-5 pointer-events-none">
    <path fill="currentColor" d="M45,150 L45,100 L155,100 L155,150 M60,100 L60,60 L140,60 L140,100 M80,60 L80,40 L120,40 L120,60" stroke="currentColor" strokeWidth="2" fillOpacity="0" />
    <text x="100" y="180" textAnchor="middle" fontSize="10" fill="currentColor" letterSpacing="2">MACAU</text>
  </svg>
);

// --- Types ---
interface SafetyCardData {
  name: string;
  passport: string;
  idCard: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceNo: string;
  bloodType: string;
  allergies: string;
  destination: string;
  consulatePhone: string;
  date: string;
}

const GameC: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);

  // Steps: 0=Intro, 1=Form, 2=Generated
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SafetyCardData>({
    name: '',
    passport: '',
    idCard: '',
    emergencyContact: '',
    emergencyPhone: '',
    insuranceNo: '',
    bloodType: '',
    allergies: '',
    destination: '',
    consulatePhone: '',
    date: new Date().toLocaleDateString('zh-MO'),
  });

  // Extract unique countries for dropdown with explicit typing
  const countries: string[] = Array.from(
    new Set(
      PHONE_DATA
        .filter((p: PhoneItem) => !!p.country)
        .map((p: PhoneItem) => p.country)
    )
  ).sort() as string[];

  // Auto-fill consulate phone when destination changes
  useEffect(() => {
    if (formData.destination) {
      const match = PHONE_DATA.find((p: PhoneItem) => p.country === formData.destination);
      if (match) {
        setFormData(prev => ({ ...prev, consulatePhone: match.number }));
      }
    }
  }, [formData.destination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Use html2canvas
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High resolution
        backgroundColor: null, // Transparent background
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      setGeneratedImage(imgData);
      setStep(2);
    } catch (error) {
      console.error("Card generation failed", error);
      alert("生成卡片失敗，請重試");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `SafetyCard_${formData.name || 'Macau'}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    try {
      const blob = await (await fetch(generatedImage)).blob();
      const file = new File([blob], "safety_card.png", { type: blob.type });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '我的出境安全應急卡',
          text: '出發前備好這張卡，安全隨行！',
          files: [file],
        });
      } else {
        alert("您的瀏覽器不支持直接分享，請下載圖片後手動發送。");
        handleDownload();
      }
    } catch (error) {
      console.log("Share failed", error);
    }
  };

  // Dynamic Progress Calculation
  const calculateProgress = () => {
    const fieldsToCheck = [
      formData.name,
      formData.bloodType,
      formData.allergies,
      formData.emergencyContact,
      formData.insuranceNo,
      formData.destination
    ];
    const filledCount = fieldsToCheck.filter(field => field && field.trim() !== '').length;
    return (filledCount / fieldsToCheck.length) * 100;
  };

  // Validation Check
  const isFormValid = !!(formData.name && formData.emergencyContact && formData.destination);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-10 px-4 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900 pointer-events-none z-0"></div>

      <div className="max-w-md mx-auto relative z-10">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
           <button 
              onClick={() => navigate('/')} 
              className="text-gray-400 font-bold flex items-center gap-1 hover:text-white transition-colors text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
           >
              &larr; {t('app.back')}
           </button>
           <h1 className="text-xl font-black text-white tracking-wider drop-shadow-md">
             {t('menu.safety-card')}
           </h1>
           <div className="w-16"></div>
        </div>

        {/* --- Step 0: Intro --- */}
        {step === 0 && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl animate-fade-in mt-10">
             <div className="text-6xl mb-6 animate-bounce">🛡️</div>
             <h2 className="text-2xl font-bold text-white mb-4">出發前，先備份！</h2>
             <p className="text-gray-300 leading-relaxed mb-8">
               花 3 分鐘填好這張卡，它就是你在海外的「數字護身符」。<br/>
               <span className="text-xs text-gray-500 mt-2 block">(所有數據僅保存在您的手機本地，不會上傳)</span>
             </p>
             <button 
               onClick={() => setStep(1)}
               className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,102,204,0.4)] hover:scale-105 transition-transform"
             >
               開始製作
             </button>
          </div>
        )}

        {/* --- Step 1: Form --- */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up pb-20">
             
             {/* Progress Bar */}
             <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-brand-green to-emerald-400 transition-all duration-500 ease-out" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
             </div>

             {/* Form Fields */}
             <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                   👤 基本身份 <span className="text-xs font-normal text-gray-500">(可選填)</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs text-gray-400">姓名 *</label>
                      <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-brand-blue outline-none transition-colors"
                        placeholder="例如: Chan Tai Man"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-gray-400">血型</label>
                      <select 
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-white/30 rounded-lg py-2 px-2 text-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all appearance-none"
                      >
                         <option value="" className="bg-slate-900 text-gray-400">選擇</option>
                         <option value="A" className="bg-slate-900">A型</option>
                         <option value="B" className="bg-slate-900">B型</option>
                         <option value="O" className="bg-slate-900">O型</option>
                         <option value="AB" className="bg-slate-900">AB型</option>
                         <option value="Unknown" className="bg-slate-900">不詳</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs text-gray-400">過敏史 (藥物/食物)</label>
                   <input 
                     name="allergies" 
                     value={formData.allergies} 
                     onChange={handleChange}
                     className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-brand-blue outline-none transition-colors"
                     placeholder="例如: 無/盤尼西林"
                   />
                </div>
             </div>

             <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                   📞 緊急聯絡
                </h3>
                <div className="space-y-1">
                   <label className="text-xs text-gray-400">緊急聯繫人 & 電話 *</label>
                   <input 
                     name="emergencyContact" 
                     value={formData.emergencyContact} 
                     onChange={handleChange}
                     className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-brand-blue outline-none transition-colors"
                     placeholder="例如: 媽媽 +853 6666xxxx"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs text-gray-400">個人保險單號</label>
                   <input 
                     name="insuranceNo" 
                     value={formData.insuranceNo} 
                     onChange={handleChange}
                     className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-brand-blue outline-none transition-colors"
                     placeholder="例如: X00000000"
                   />
                </div>
             </div>

             <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                   ✈️ 領事資訊
                </h3>
                <div className="space-y-1">
                   <label className="text-xs text-gray-400">目的地國家/地區 *</label>
                   <select 
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-white/30 rounded-lg py-2 px-2 text-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all appearance-none"
                   >
                      <option value="" className="bg-slate-900 text-gray-400">請選擇目的地</option>
                      {countries.map((c: string) => (
                         <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-xs text-gray-400">當地使領館/應急電話 (自動填寫)</label>
                   <input 
                     name="consulatePhone" 
                     value={formData.consulatePhone} 
                     readOnly
                     className="w-full bg-green-900/20 border border-green-500/30 rounded-lg p-2 text-green-400 font-mono font-bold text-sm"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs text-gray-400">全球領保熱線 (預設)</label>
                   <input 
                     value="+86-10-12308" 
                     readOnly
                     className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-400 text-sm"
                   />
                </div>
             </div>

             <button
               onClick={handleGenerate}
               disabled={!isFormValid || isGenerating}
               className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all ${isFormValid ? 'bg-gradient-to-r from-brand-red to-orange-600 text-white hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
             >
                {isGenerating ? '生成中...' : '✨ 生成我的安全卡'}
             </button>
          </div>
        )}
        
        {/* --- Step 2: Result --- */}
        {step === 2 && generatedImage && (
           <div className="animate-fade-in flex flex-col items-center space-y-6">
              <h2 className="text-white font-bold text-xl">✅ 製作完成！</h2>
              
              <div className="w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">
                 <img src={generatedImage} alt="Generated Safety Card" className="w-full h-auto" />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                 <button 
                   onClick={handleShare}
                   className="flex items-center justify-center gap-2 py-3 bg-brand-blue rounded-xl text-white font-bold hover:bg-blue-600 transition-colors"
                 >
                    <span>📤</span> 分享給家人
                 </button>
                 <button 
                   onClick={handleDownload}
                   className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-bold hover:bg-white/20 transition-colors"
                 >
                    <span>💾</span> 保存相冊
                 </button>
              </div>

              <button 
                onClick={() => setStep(1)}
                className="text-gray-400 text-sm underline hover:text-white"
              >
                 返回修改信息
              </button>
           </div>
        )}

        {/* --- Invisible Render Canvas --- */}
        <div className="fixed left-[-9999px] top-0 pointer-events-none">
           <div 
             ref={cardRef}
             id="safety-card"
             className="w-[375px] h-[600px] bg-slate-50 relative overflow-hidden flex flex-col"
           >
              {/* Card Header */}
              <div className="bg-brand-red h-32 p-6 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute right-[-20px] top-[-20px] text-white opacity-10 text-9xl rotate-12">🛡️</div>
                 <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🇲🇴</div>
                       <span className="text-white/80 font-bold text-xs tracking-widest">智保同行</span>
                    </div>
                    <span className="text-white/60 font-mono text-xs">{formData.date}</span>
                 </div>
                 <div className="relative z-10">
                    <h1 className="text-white text-2xl font-black tracking-wide">出境安全備忘錄</h1>
                    <p className="text-white/80 text-xs font-bold uppercase">Safety Emergency Card</p>
                 </div>
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 top-32 z-0 text-gray-200">
                 <MacauLandmarkSVG />
              </div>

              {/* Card Body */}
              <div className="flex-1 p-6 relative z-10 flex flex-col gap-5">
                 
                 {/* ID Section */}
                 <div className="flex gap-4 items-center border-b border-gray-200 pb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                       👤
                    </div>
                    <div>
                       <div className="text-2xl font-bold text-slate-800 leading-none mb-1">{formData.name || '未填寫姓名'}</div>
                       <div className="flex gap-3 text-xs text-gray-500 font-mono">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">Blood: {formData.bloodType || '-'}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">Allergy: {formData.allergies || '無'}</span>
                       </div>
                    </div>
                 </div>

                 {/* Emergency Contacts */}
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                       <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500 text-lg shrink-0">🆘</div>
                       <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Emergency Contact</div>
                          <div className="text-slate-800 font-bold text-sm leading-tight">{formData.emergencyContact}</div>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-lg shrink-0">🏥</div>
                       <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Insurance No.</div>
                          <div className="text-slate-800 font-bold text-sm font-mono">{formData.insuranceNo || 'N/A'}</div>
                       </div>
                    </div>
                 </div>

                 {/* Destination Info */}
                 <div className="mt-auto bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 text-6xl opacity-10">✈️</div>
                    <div className="relative z-10">
                       <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Destination Info</div>
                       <div className="text-xl font-bold mb-3">{formData.destination}</div>
                       
                       <div className="space-y-2 border-t border-white/10 pt-2">
                          <div className="flex justify-between items-center">
                             <span className="text-xs text-gray-400">當地領保電話</span>
                             <span className="text-sm font-mono font-bold text-green-400">{formData.consulatePhone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-xs text-gray-400">全球領保熱線</span>
                             <span className="text-sm font-mono font-bold text-yellow-400">+86-10-12308</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="text-center text-[10px] text-gray-400 pt-2">
                    * 此卡片由「智保同行」網頁生成，僅供個人備份使用
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default GameC;
