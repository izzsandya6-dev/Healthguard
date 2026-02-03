
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Info, Activity, Droplets, Moon, Shield, Zap, Heart, Utensils, Monitor, Gauge, CheckCircle2 } from 'lucide-react';
import { getHealthSurveyAdvice } from '../services/geminiService';
import { UserProfile, AppView } from '../types';

interface MentalSurveyProps {
  onViewChange: (view: AppView) => void;
}

interface Question {
  text: string;
  category: 'metabolik' | 'pemulihan' | 'imunitas' | 'gaya-hidup' | 'stres';
  id: string;
  options: { label: string; val: number; raw: any }[];
}

const MentalSurvey: React.FC<MentalSurveyProps> = ({ onViewChange }) => {
  const [profile, setProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('nutri_profile') || '{}'));
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [bioScore, setBioScore] = useState(0);
  
  const isEn = profile.language === 'en';

  const questions: Question[] = isEn ? [
    { id: 'water', text: "Water intake today?", category: 'metabolik', options: [{ label: "Low", val: 1, raw: 500 }, { label: "Average", val: 3, raw: 1500 }, { label: "Hydrated", val: 5, raw: 2500 }] },
    { id: 'sleep', text: "Sleep duration last night?", category: 'pemulihan', options: [{ label: "< 5h", val: 1, raw: 4 }, { label: "5-7h", val: 3, raw: 6 }, { label: "> 7h", val: 5, raw: 8 }] },
    { id: 'immune', text: "Current immune feeling?", category: 'imunitas', options: [{ label: "Weak", val: 1, raw: "Rentan" }, { label: "Stable", val: 3, raw: "Stabil" }, { label: "Strong", val: 5, raw: "Kuat" }] },
    { id: 'stress', text: "Stress level right now?", category: 'stres', options: [{ label: "High", val: 1, raw: 85 }, { label: "Normal", val: 3, raw: 45 }, { label: "Calm", val: 5, raw: 15 }] },
    { id: 'activity', text: "Physical activity level today?", category: 'metabolik', options: [{ label: "Sedentary", val: 1, raw: "none" }, { label: "Moderate", val: 3, raw: "walk" }, { label: "Intense", val: 5, raw: "workout" }] },
    { id: 'veggies', text: "Vegetable and fruit intake?", category: 'imunitas', options: [{ label: "None", val: 1, raw: "none" }, { label: "Some", val: 3, raw: "portion" }, { label: "Plenty", val: 5, raw: "optimal" }] },
    { id: 'junk', text: "Sugar or junk food consumption?", category: 'metabolik', options: [{ label: "High", val: 1, raw: "high" }, { label: "Moderate", val: 3, raw: "some" }, { label: "Clean", val: 5, raw: "none" }] },
    { id: 'digestion', text: "Digestive comfort?", category: 'metabolik', options: [{ label: "Bloated", val: 1, raw: "bad" }, { label: "Normal", val: 5, raw: "good" }] },
    { id: 'screen', text: "Screen time today?", category: 'gaya-hidup', options: [{ label: "Intense (>8h)", val: 1, raw: "very high" }, { label: "Normal", val: 3, raw: "high" }, { label: "Low", val: 5, raw: "low" }] },
    { id: 'energy', text: "Current energy level?", category: 'pemulihan', options: [{ label: "Drained", val: 1, raw: "tired" }, { label: "Focused", val: 5, raw: "energetic" }] }
  ] : [
    { id: 'water', text: "Asupan air minum hari ini?", category: 'metabolik', options: [{ label: "Kurang", val: 1, raw: 500 }, { label: "Cukup", val: 3, raw: 1500 }, { label: "Banyak", val: 5, raw: 2500 }] },
    { id: 'sleep', text: "Lama tidur Anda semalam?", category: 'pemulihan', options: [{ label: "< 5 jam", val: 1, raw: 4 }, { label: "5-7 jam", val: 3, raw: 6 }, { label: "> 7 jam", val: 5, raw: 8 }] },
    { id: 'immune', text: "Bagaimana perasaan imun Anda?", category: 'imunitas', options: [{ label: "Lemas/Sakit", val: 1, raw: "Rentan" }, { label: "Biasa saja", val: 3, raw: "Stabil" }, { label: "Sangat Fit", val: 5, raw: "Kuat" }] },
    { id: 'stress', text: "Tingkat stres saat ini?", category: 'stres', options: [{ label: "Tinggi", val: 1, raw: 85 }, { label: "Normal", val: 3, raw: 45 }, { label: "Tenang", val: 5, raw: 15 }] },
    { id: 'activity', text: "Tingkat aktivitas fisik hari ini?", category: 'metabolik', options: [{ label: "Diam saja", val: 1, raw: "sedenter" }, { label: "Jalan santai", val: 3, raw: "moderat" }, { label: "Olahraga berat", val: 5, raw: "aktif" }] },
    { id: 'veggies', text: "Porsi sayur dan buah hari ini?", category: 'imunitas', options: [{ label: "Tidak ada", val: 1, raw: "kosong" }, { label: "1-2 porsi", val: 3, raw: "sedikit" }, { label: "Banyak", val: 5, raw: "cukup" }] },
    { id: 'junk', text: "Konsumsi gula atau junk food?", category: 'metabolik', options: [{ label: "Banyak", val: 1, raw: "tinggi" }, { label: "Sedikit", val: 3, raw: "sedang" }, { label: "Tidak ada", val: 5, raw: "bersih" }] },
    { id: 'digestion', text: "Kenyamanan pencernaan?", category: 'metabolik', options: [{ label: "Kembung/Bermasalah", val: 1, raw: "buruk" }, { label: "Nyaman", val: 5, raw: "baik" }] },
    { id: 'screen', text: "Lama menatap layar (HP/Laptop)?", category: 'gaya-hidup', options: [{ label: "> 8 jam", val: 1, raw: "sangat tinggi" }, { label: "4-8 jam", val: 3, raw: "tinggi" }, { label: "Sebentar", val: 5, raw: "rendah" }] },
    { id: 'energy', text: "Tingkat energi saat ini?", category: 'pemulihan', options: [{ label: "Sangat Lelah", val: 1, raw: "lemah" }, { label: "Bertenaga", val: 5, raw: "fokus" }] }
  ];

  const handleAnswer = (val: number, raw: any) => {
    const questionId = questions[step].id;
    const newAnswers = [...answers, { id: questionId, category: questions[step].category, value: val, raw }];
    
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      processResults(newAnswers);
    }
  };

  const processResults = async (finalAnswers: any[]) => {
    setLoading(true);
    
    const totalPoints = finalAnswers.reduce((sum, a) => sum + a.value, 0);
    const maxPoints = questions.length * 5;
    const score = Math.round((totalPoints / maxPoints) * 100);
    setBioScore(score);

    const updatedProfile = { ...profile };
    
    finalAnswers.forEach(ans => {
      if (ans.id === 'water') updatedProfile.hydrationToday = ans.raw;
      if (ans.id === 'sleep') updatedProfile.sleepLast_night = ans.raw;
      if (ans.id === 'immune') updatedProfile.immunityStatus = ans.raw;
      if (ans.id === 'stress') updatedProfile.stressScore = ans.raw;
    });

    localStorage.setItem('nutri_profile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);

    try {
      const summary = finalAnswers.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr.raw);
        return acc;
      }, {});
      const aiAdvice = await getHealthSurveyAdvice(summary);
      setAdvice(aiAdvice);
    } catch (err) {
      setAdvice(isEn ? "Focus on hydration and consistent sleep. Your biometrics have been updated." : "Fokus pada hidrasi dan tidur yang konsisten. Data biometrik Anda telah diperbarui.");
    } finally {
      setLoading(false);
    }
  };

  const parseGPTStyle = (text: string) => {
    // Completely remove markdown symbols ** and *
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
    const lines = cleanText.split('\n').filter(l => l.trim() !== '');
    
    return (
      <div className="space-y-4 text-slate-700 leading-relaxed font-bold">
        {lines.map((line, idx) => {
          const match = line.match(/^(\d+)[.\s)]+(.*)/);
          const content = match ? match[2] : line;
          return (
            <div key={idx} className="flex gap-4 p-5 bg-white/50 rounded-2xl border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
               <div className="w-6 h-6 bg-emerald-500 text-white font-black rounded-lg flex items-center justify-center shrink-0 text-xs shadow-md shadow-emerald-100">
                {match ? match[1] : idx + 1}
               </div>
               <div className="flex-1 text-sm">{content}</div>
            </div>
          );
        })}
      </div>
    );
  };

  if (advice) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
         <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                  <h2 className="text-3xl font-black mb-1 flex items-center gap-3">
                     <Sparkles className="text-emerald-400" /> {isEn ? 'Bio-Sync Report' : 'Laporan Sinkronisasi Bio'}
                  </h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{isEn ? 'Dashboard Updated Successfully' : 'Dashboard Berhasil Diperbarui'}</p>
               </div>
               <div className="flex flex-col items-center bg-white/5 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                  <div className="text-5xl font-black text-emerald-400">{bioScore}%</div>
                  <div className="text-[9px] font-black uppercase text-slate-400 mt-1">{isEn ? 'Bio-Wellness Index' : 'Indeks Bio-Wellness'}</div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
               <Droplets className="text-blue-500" size={20} />
               <span className="text-[9px] font-black text-slate-400 uppercase">{isEn ? 'Hydration' : 'Hidrasi'}</span>
               <span className="text-sm font-black text-slate-800">{profile.hydrationToday}ml</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
               <Moon className="text-indigo-500" size={20} />
               <span className="text-[9px] font-black text-slate-400 uppercase">{isEn ? 'Sleep' : 'Tidur'}</span>
               <span className="text-sm font-black text-slate-800">{profile.sleepLast_night}h</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
               <Shield className="text-red-500" size={20} />
               <span className="text-[9px] font-black text-slate-400 uppercase">{isEn ? 'Immunity' : 'Imunitas'}</span>
               <span className="text-sm font-black text-slate-800">{profile.immunityStatus}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
               <Activity className="text-amber-500" size={20} />
               <span className="text-[9px] font-black text-slate-400 uppercase">{isEn ? 'Stress' : 'Stres'}</span>
               <span className="text-sm font-black text-slate-800">{profile.stressScore}%</span>
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest px-4">
               <CheckCircle2 size={14} className="text-emerald-500" /> {isEn ? 'Neural Recommendations' : 'Rekomendasi Neural'}
            </div>
            
            <div className="bg-slate-50/50 rounded-[32px] p-6 md:p-10 border border-slate-100">
              {parseGPTStyle(advice)}
            </div>

            <div className="pt-6 flex gap-4 px-2">
              <button 
                onClick={() => onViewChange('dashboard')} 
                className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                {isEn ? 'Sync & Return to Dashboard' : 'Sinkronkan & Kembali ke Dashboard'}
              </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="text-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{isEn ? 'Mind Hub Survey' : 'Survei Mind Hub'}</h1>
        <p className="text-slate-500 font-medium mt-2">{isEn ? 'This data will synchronize with your health dashboard' : 'Data ini akan sinkron dengan dashboard kesehatan Anda'}</p>
      </header>
      
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center gap-6">
             <Loader2 className="animate-spin text-emerald-500" size={64} strokeWidth={3} />
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">{isEn ? 'Synchronizing Biometrics...' : 'Menyinkronkan Biometrik...'}</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
               <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-emerald-500`} />
                  {questions[step].category}
               </span>
               <span>{step + 1} / 10</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">{questions[step].text}</h2>
            
            <div className="grid grid-cols-1 gap-3">
               {questions[step].options.map((opt, oIdx) => (
                 <button 
                    key={oIdx} 
                    onClick={() => handleAnswer(opt.val, opt.raw)} 
                    className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[24px] group hover:bg-emerald-600 transition-all text-left"
                 >
                    <span className="font-bold text-slate-600 group-hover:text-white transition-colors">{opt.label}</span>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-white transition-all" />
                 </button>
               ))}
            </div>

            <div className="flex gap-1 justify-center">
               {questions.map((_, i) => (
                 <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-100'}`} />
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalSurvey;
