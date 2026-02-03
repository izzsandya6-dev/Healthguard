
import React, { useState } from 'react';
import { Calendar, ChefHat, Sparkles, Loader2, Brain, HeartPulse } from 'lucide-react';
import { generateMealPlan } from '../services/geminiService';
import { MealPlanDay, UserProfile } from '../types';

const Planner: React.FC = () => {
  const [profile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('nutri_profile') || '{}'));
  const [goal, setGoal] = useState(profile.goal || 'Meningkatkan Stamina');
  const [diet, setDiet] = useState(profile.dietPreference || 'Semua (Normal)');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<MealPlanDay[] | null>(null);

  const isEn = profile.language === 'en';

  const goals = isEn 
    ? ['Weight Loss', 'Muscle Mass', 'Healthy Living', 'Boost Stamina', 'Digestive Health']
    : ['Turunkan Berat Badan', 'Massa Otot', 'Hidup Sehat', 'Meningkatkan Stamina', 'Kesehatan Pencernaan'];
  
  const diets = isEn
    ? ['All (Normal)', 'Vegetarian', 'Vegan', 'Keto', 'Low Carb', 'Gluten Free']
    : ['Semua (Normal)', 'Vegetarian', 'Vegan', 'Keto', 'Rendah Karbo', 'Gluten Free'];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateMealPlan(goal, diet);
      setPlans(result);
    } catch (err) {
      console.error(err);
      alert(isEn ? "Failed to generate meal plan. Check your connection." : "Gagal membuat rencana makan. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          {isEn ? 'HealthGuard Planner' : 'Perencana HealthGuard'}
        </h1>
        <p className="text-slate-500 font-medium">
          {isEn ? 'Personalized nutrition strategy for optimal body and mind performance.' : 'Strategi gizi personal untuk performa tubuh dan pikiran optimal.'}
        </p>
      </header>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{isEn ? 'Strategic Goal' : 'Tujuan Strategis'}</label>
            <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 appearance-none font-bold text-slate-700"
            >
              {goals.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{isEn ? 'Diet Protocol' : 'Protokol Diet'}</label>
            <select 
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 appearance-none font-bold text-slate-700"
            >
              {diets.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
          {loading ? (isEn ? 'Optimizing Menu...' : 'Mengoptimalkan Menu...') : (isEn ? 'Design HealthGuard Menu' : 'Rancang Menu HealthGuard')}
        </button>
      </div>

      {plans && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{isEn ? '3-Day Nutrition Protocol' : 'Protokol Nutrisi 3 Hari'}</h3>
            <span className="text-emerald-600 text-xs font-black uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
              <ChefHat size={16} /> Personalised by AI
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((day, idx) => (
              <div key={idx} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6 hover:shadow-xl transition-all group animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <h4 className="font-black text-slate-800 text-xl">{day.day}</h4>
                  <div className="bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1.5 rounded-xl text-xs font-black">
                    {day.totalCalories} kcal
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> {isEn ? 'Breakfast' : 'Sarapan'}
                    </p>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{day.breakfast}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" /> {isEn ? 'Lunch' : 'Makan Siang'}
                    </p>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{day.lunch}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" /> {isEn ? 'Dinner' : 'Makan Malam'}
                    </p>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{day.dinner}</p>
                  </div>
                  
                  {/* Mental Wellness Tip in Planner */}
                  {day.mentalWellnessTip && (
                    <div className="bg-purple-50 p-4 rounded-3xl border border-purple-100">
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Brain size={14} /> {isEn ? 'Mind Wellness' : 'Keseimbangan Mental'}
                      </p>
                      <p className="text-[11px] text-purple-800 font-bold leading-relaxed">{day.mentalWellnessTip}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Snacks</p>
                    <div className="flex flex-wrap gap-2">
                      {day.snacks.map((s, i) => (
                        <span key={i} className="bg-slate-50 text-slate-600 text-[10px] px-3 py-1.5 rounded-xl font-bold border border-slate-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
