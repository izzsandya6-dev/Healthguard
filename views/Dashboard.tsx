
import React, { useState, useEffect } from 'react';
import { Activity, Flame, Droplets, Utensils, Target, Brain, Shield, AlertCircle, Stethoscope, Smile, Frown, Meh, HeartPulse, Sparkles, ChevronRight, Plus, Moon, RefreshCw, X, Heart, BookOpen, Coffee, Apple, Monitor, GlassWater, ExternalLink, Newspaper, Loader2 } from 'lucide-react';
import { UserProfile, FoodAnalysis, HealthArticle } from '../types';
// Fixed: Removed non-existent export getQuickAdvice which was causing a TypeScript error
import { getHealthArticles } from '../services/geminiService';

interface DashboardProps {
  onViewChange?: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutri_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<FoodAnalysis[]>(() => {
    const saved = localStorage.getItem('nutri_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [quickAdvice, setQuickAdvice] = useState<{topic: string, text: string} | null>(null);
  
  const isEn = profile?.language === 'en';

  useEffect(() => {
    const savedHistory = localStorage.getItem('nutri_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedProfile = localStorage.getItem('nutri_profile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      // Data normalization for biometric consistency
      if (data.hydrationToday === undefined) data.hydrationToday = 0;
      if (data.sleepLast_night === undefined) data.sleepLast_night = 0;
      setProfile(data);
    }

    fetchArticles();
  }, []);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchArticles = async () => {
    setArticlesLoading(true);
    try {
      const lang = profile?.language || 'id';
      const data = await getHealthArticles(lang);
      // Shuffle and take only 4 to ensure variety on every load
      const randomArticles = shuffleArray(data).slice(0, 4);
      setArticles(randomArticles);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setArticlesLoading(false);
    }
  };

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    localStorage.setItem('nutri_profile', JSON.stringify(updated));
  };

  const addHydration = () => {
    const newVal = (profile?.hydrationToday || 0) + 250;
    updateProfileField('hydrationToday', newVal);
  };

  const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    updateProfileField('sleepLast_night', val);
  };

  if (!profile) return null;

  const targetCalories = Math.round((10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + (profile.gender === 'Pria' ? 5 : -161));
  const caloriesNow = history.reduce((sum, item) => sum + (item.nutrients?.calories || 0), 0);

  const mentalStatus = (() => {
    const rating = profile?.moodRating;
    if (!rating) return { emoji: "😶", msg: isEn ? "Log mood below." : "Catat mood di bawah.", color: "bg-white/5 border-white/10" };
    if (rating <= 2) return { emoji: "🚨", msg: isEn ? "AI: Fatigue detected." : "AI: Deteksi kelelahan.", color: "bg-red-500/20 border-red-500/30 text-red-200" };
    if (rating === 3) return { emoji: "⚖️", msg: isEn ? "AI: State stable." : "AI: Kondisi stabil.", color: "bg-amber-500/20 border-amber-500/30 text-amber-200" };
    return { emoji: "✨", msg: isEn ? "AI: Peak performance." : "AI: Performa puncak.", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-200" };
  })();

  return (
    <div className="animate-fade-in space-y-8 pb-24">
      {quickAdvice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 space-y-6 relative border border-slate-100 shadow-2xl">
             <button onClick={() => setQuickAdvice(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
             </button>
             <h3 className="text-xl font-black text-slate-800 capitalize">AI: {quickAdvice.topic}</h3>
             <div className="text-slate-600 leading-relaxed text-sm p-6 bg-slate-50 rounded-3xl">
                {quickAdvice.text}
             </div>
             <button onClick={() => setQuickAdvice(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                {isEn ? 'Got it' : 'Mengerti'}
             </button>
          </div>
        </div>
      )}

      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
          {isEn ? `Status, ${profile.name.split(' ')[0]}` : `Status, ${profile.name.split(' ')[0]}`}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col justify-between group overflow-hidden relative">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{isEn ? 'Calories Today' : 'Kalori Hari Ini'}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-black text-slate-800 tracking-tighter">{caloriesNow}</span>
              <span className="text-slate-300 font-bold text-xl tracking-tight">/ {targetCalories} kcal</span>
            </div>
            <div className="mt-8 w-full bg-slate-50 h-4 rounded-full overflow-hidden p-1">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((caloriesNow / targetCalories) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center"><Flame size={24} /></div>
                <div><p className="text-sm font-black text-slate-800">Metabolic Status: Active</p></div>
             </div>
             <button onClick={() => onViewChange?.('analyzer')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                {isEn ? 'Scan Food' : 'Scan Makan'} <ChevronRight size={14} />
             </button>
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-900 rounded-[48px] p-8 text-white flex flex-col items-center relative overflow-hidden group">
          <div className="relative z-10 w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
               <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"><Brain size={24} /></div>
               <h3 className="text-lg font-black tracking-tight leading-none">Mind Hub</h3>
            </div>
            <div className="flex-1 space-y-4 mb-6">
               <div className={`p-4 rounded-2xl border transition-all duration-500 ${mentalStatus.color}`}>
                  <div className="flex items-center gap-3 text-left">
                     <span className="text-2xl">{mentalStatus.emoji}</span>
                     <p className="text-[10px] font-bold leading-tight">{mentalStatus.msg}</p>
                  </div>
               </div>
               <div className="flex justify-between gap-2">
                 {[1, 3, 5].map(v => (
                   <button key={v} onClick={() => updateProfileField('moodRating', v)} className={`flex-1 h-12 rounded-xl flex items-center justify-center transition-all border ${profile.moodRating === v ? 'bg-white text-slate-900' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                     {v === 1 ? <Frown size={18} /> : v === 3 ? <Meh size={18} /> : <Smile size={18} />}
                   </button>
                 ))}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button onClick={() => onViewChange?.('survey')} className="bg-white/10 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Survey</button>
              <button onClick={() => onViewChange?.('mental-session')} className="bg-indigo-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all">Chat AI</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
             <div className="bg-blue-50 text-blue-500 p-5 rounded-2xl"><Droplets size={24} /></div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hydration</p>
               <p className="text-xl font-black text-slate-800 tracking-tight">{profile.hydrationToday}ml</p>
             </div>
             <button onClick={addHydration} className="w-full bg-blue-500 text-white p-3 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"><Plus size={16} strokeWidth={3} /></button>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
             <div className="bg-indigo-50 text-indigo-500 p-5 rounded-2xl"><Moon size={24} /></div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sleep</p>
               <input type="number" step="0.5" value={profile.sleepLast_night} onChange={handleSleepChange} className="w-20 bg-slate-50 border-none rounded-xl p-2 text-center font-black text-lg text-slate-800 focus:ring-2 focus:ring-indigo-100" />
             </div>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
             <div className="bg-purple-50 text-purple-500 p-5 rounded-2xl"><HeartPulse size={24} /></div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stress</p>
               <p className="text-xl font-black text-slate-800 tracking-tight">{profile.stressScore || '---'}%</p>
             </div>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
             <div className="bg-red-50 text-red-500 p-5 rounded-2xl"><Shield size={24} /></div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Immunity</p>
               <p className="text-sm font-black text-slate-800">{profile.immunityStatus}</p>
             </div>
         </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Newspaper className="text-emerald-600" size={24} />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isEn ? 'Health Insights' : 'Wawasan Kesehatan'}</h2>
           </div>
           <button 
            onClick={fetchArticles} 
            disabled={articlesLoading}
            className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 transition-all"
           >
              {articlesLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              {isEn ? 'Refresh' : 'Segarkan'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {articlesLoading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="bg-white rounded-[32px] p-6 h-64 animate-pulse flex flex-col gap-4 border border-slate-100 shadow-sm">
                  <div className="w-1/3 h-4 bg-slate-100 rounded-full" />
                  <div className="w-full h-8 bg-slate-100 rounded-xl" />
                  <div className="w-full h-16 bg-slate-100 rounded-xl mt-auto" />
               </div>
             ))
           ) : articles.length > 0 ? (
             articles.map((article, i) => (
               <div key={i} className="bg-white rounded-[32px] p-6 flex flex-col border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3 bg-emerald-50 px-2 py-1 rounded-lg self-start">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 leading-tight mb-4 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-3 mb-6 leading-relaxed">
                    {article.summary}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[100px]">
                      via {article.sourceName}
                    </span>
                    <a 
                      href={article.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                    >
                      {isEn ? 'Source' : 'Sumber'} <ExternalLink size={12} />
                    </a>
                  </div>
               </div>
             ))
           ) : (
             <div className="col-span-full py-12 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">{isEn ? 'No articles found. Try refreshing.' : 'Tidak ada artikel. Coba segarkan.'}</p>
             </div>
           )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
