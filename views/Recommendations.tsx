
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Info, Tag, Utensils, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { getPersonalizedRecommendations } from '../services/geminiService';
import { RecommendationItem, UserProfile, FoodAnalysis } from '../types';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('nutri_profile') || '{}'));
  const isEn = profile.language === 'en';

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const history: FoodAnalysis[] = JSON.parse(localStorage.getItem('nutri_history') || '[]');
      const results = await getPersonalizedRecommendations(profile, history);
      setRecommendations(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {isEn ? 'HealthGuard Insights' : 'Saran HealthGuard'}
          </h1>
          <p className="text-slate-500 font-medium">
            {isEn ? 'Smart menu curation based on your metabolic status.' : 'Kurasi menu cerdas berdasarkan status metabolik Anda.'}
          </p>
        </div>
        <button 
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? (isEn ? 'Updating...' : 'Memperbarui...') : (isEn ? 'Refresh Insights' : 'Segarkan Data')}
        </button>
      </header>

      {/* Interactive Priority Profile Card */}
      <div 
        className="bg-emerald-600 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-100 group cursor-default"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <p className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">{isEn ? 'Priority Profile' : 'Profil Prioritas'}</p>
            <h2 className="text-3xl font-black">{profile.goal}</h2>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black border border-white/10">{profile.dietPreference}</span>
              {profile.allergies.length > 0 && (
                <span className="bg-red-400/40 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black border border-white/10">{isEn ? 'Allergies' : 'Alergi'}: {profile.allergies.join(', ')}</span>
              )}
              {profile.focusArea && (
                <span className="bg-blue-400/40 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black border border-white/10">{isEn ? 'Focus' : 'Fokus'}: {profile.focusArea}</span>
              )}
            </div>
          </div>
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 max-w-sm flex flex-col gap-4">
            <p className="text-sm italic opacity-90 leading-relaxed font-medium">
               {isEn 
                ? "AI actively monitors your profile to optimize nutrient thresholds harly." 
                : "AI memantau profil Anda secara aktif untuk mengoptimalkan ambang gizi harian."}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-200">
               <SettingsIcon size={14} /> {isEn ? 'Active System Tuning' : 'Penyetelan Sistem Aktif'}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      </div>

      {loading && !recommendations && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <Loader2 className="text-emerald-500 animate-spin" size={64} strokeWidth={3} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">
            {isEn ? 'Crafting smart nutrition formulas...' : 'Meracik formula nutrisi cerdas...'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations?.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-50 text-emerald-600 p-5 rounded-[24px] group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <Utensils size={32} />
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">{item.calories}</span>
                <span className="text-xs font-black text-slate-400 ml-1 uppercase">kcal</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed line-clamp-3">{item.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {item.tags.map((tag, tIdx) => (
                <span key={tIdx} className="bg-slate-50 text-slate-500 text-[10px] px-3 py-1.5 rounded-xl font-black border border-slate-100 flex items-center gap-1 uppercase tracking-tight">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            <div className="bg-indigo-50/50 rounded-[28px] p-6 border border-indigo-50 shadow-inner group-hover:bg-indigo-50 transition-colors">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={14} /> HealthGuard Analysis
              </p>
              <p className="text-xs text-indigo-800 leading-relaxed font-bold italic">
                 {parseMarkdown(item.reason)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
