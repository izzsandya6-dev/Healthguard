
import React, { useState } from 'react';
import { 
  User, Target, Stethoscope, LogOut, Save, Check, Zap, Dumbbell, 
  Wind, ShieldCheck, Smile, Globe, Plus, X, AlertTriangle, 
  Utensils, Activity, Ruler, Weight, Calendar, Laptop, 
  Smartphone, Bell, Lock, Database, ChevronRight, Sliders,
  TrendingDown, History, Heart, Coffee, Moon, Droplets, Watch, Smartphone as PhoneIcon, Link2, Languages, Trash2, ShieldAlert
} from 'lucide-react';
import { UserProfile, SmartFormula, WeightRecord, ActivityRecord } from '../types';

interface SettingsProps {
  onLogout: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, onUpdateProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutri_profile');
    if (!saved) return null;
    const data = JSON.parse(saved);
    if (!data.formula) data.formula = { metabolism: 3, recovery: 3, focus: 3, longevity: 3 };
    if (!data.weightHistory) data.weightHistory = [];
    if (!data.activityLog) data.activityLog = [];
    if (!data.dietProtocol) data.dietProtocol = 'Standard';
    if (!data.wellnessPrefs) data.wellnessPrefs = { meditation: true, exercise: true, deepSleep: true, hydration: true };
    if (data.hydrationGoal === undefined) data.hydrationGoal = 2000;
    if (data.sleepGoal === undefined) data.sleepGoal = 8;
    if (!data.connectedDevices) data.connectedDevices = [];
    return data;
  });

  const [newDevice, setNewDevice] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const isEn = profile?.language === 'en';

  if (!profile) return null;

  const handleChange = (field: keyof UserProfile, value: any) => {
    const updated = { ...profile!, [field]: value };
    setProfile(updated);
    setIsSaved(false);
    if (field === 'language') {
      onUpdateProfile(updated);
    }
  };

  const handleSave = () => {
    onUpdateProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const clearFoodHistory = () => {
    if (window.confirm(isEn ? "Are you sure you want to delete all food analysis history?" : "Yakin ingin menghapus semua riwayat analisis makanan?")) {
      localStorage.setItem('nutri_history', '[]');
      alert(isEn ? "Food history cleared." : "Riwayat makanan dihapus.");
    }
  };

  const clearChatHistory = () => {
    if (window.confirm(isEn ? "Are you sure you want to delete all chat consultation sessions?" : "Yakin ingin menghapus semua riwayat sesi konsultasi chat?")) {
      localStorage.setItem('chat_sessions', '[]');
      alert(isEn ? "Chat history cleared." : "Riwayat chat dihapus.");
    }
  };

  const addDevice = () => {
    if (newDevice.trim() && !profile.connectedDevices.includes(newDevice.trim())) {
      handleChange('connectedDevices', [...profile.connectedDevices, newDevice.trim()]);
      setNewDevice('');
    }
  };

  const removeDevice = (device: string) => {
    handleChange('connectedDevices', profile.connectedDevices.filter(d => d !== device));
  };

  const goals = [
    { id: 'Meningkatkan Stamina', en: 'Boost Stamina', icon: <Zap size={16} /> },
    { id: 'Performa Otot', en: 'Muscle Performance', icon: <Dumbbell size={16} /> },
    { id: 'Imunitas Tubuh', en: 'Immunity', icon: <ShieldCheck size={16} /> },
    { id: 'Keseimbangan Mental', en: 'Mental Wellness', icon: <Smile size={16} /> },
    { id: 'Pencernaan Sehat', en: 'Digestive Health', icon: <Wind size={16} /> }
  ];

  const dietProtocols: UserProfile['dietProtocol'][] = ['Standard', 'Paleo', 'Keto', 'Mediterranean', 'Intermittent Fasting', 'Low Sodium'];

  return (
    <div className="space-y-10 pb-32 max-w-7xl mx-auto animate-fade-in transition-colors">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-4">
        <div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {isEn ? 'Bio-Engine' : 'Mesin Biometrik'}
          </span>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mt-2">
            {isEn ? 'Hyper' : 'Profil'} <span className="text-emerald-600">Profile</span>
          </h1>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button onClick={onLogout} className="bg-white text-slate-400 border border-slate-200 px-6 py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-50 hover:text-red-500 transition-all">
             {isEn ? 'Logout' : 'Keluar'}
          </button>
          <button onClick={handleSave} className={`flex-1 lg:flex-none px-10 py-4 rounded-3xl font-black text-xs uppercase shadow-2xl transition-all flex items-center justify-center gap-2 ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'}`}>
            {isSaved ? <Check size={18} /> : (isEn ? 'Sync Bio-Data' : 'Sinkronisasi Data')}
          </button>
        </div>
      </header>

      <section className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm overflow-hidden relative group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="flex items-center gap-6">
              <div className="bg-emerald-600 text-white p-5 rounded-[24px] shadow-lg shadow-emerald-100">
                 <Languages size={32} />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{isEn ? 'App Language' : 'Bahasa Aplikasi'}</h3>
                 <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{isEn ? 'Dynamic Interface Switching' : 'Pergantian Antarmuka Dinamis'}</p>
              </div>
           </div>
           
           <div className="flex bg-slate-100 p-2 rounded-[32px] w-full md:w-auto">
              <button onClick={() => handleChange('language', 'id')} className={`flex-1 md:px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all ${profile.language === 'id' ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Indonesia</button>
              <button onClick={() => handleChange('language', 'en')} className={`flex-1 md:px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all ${profile.language === 'en' ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>English</button>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
            <div className="flex items-center gap-4">
               <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Ruler size={28} /></div>
               <div>
                  <h3 className="text-xl font-black text-slate-800">{isEn ? 'Biometrics' : 'Biometrik'}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{isEn ? 'Health measurements' : 'Pengukuran kesehatan'}</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Weight (kg)' : 'Berat (kg)'}</label>
                  <input type="number" value={profile.weight} onChange={(e) => handleChange('weight', parseInt(e.target.value))} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Height (cm)' : 'Tinggi (cm)'}</label>
                  <input type="number" value={profile.height} onChange={(e) => handleChange('height', parseInt(e.target.value))} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Age' : 'Umur'}</label>
                  <input type="number" value={profile.age} onChange={(e) => handleChange('age', parseInt(e.target.value))} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500" />
               </div>
            </div>
          </section>

          {/* New Data Management Section */}
          <section className="bg-red-50 rounded-[40px] p-8 md:p-12 border border-red-100 space-y-8">
            <div className="flex items-center gap-4">
               <div className="bg-red-100 p-4 rounded-2xl text-red-600"><ShieldAlert size={28} /></div>
               <div>
                  <h3 className="text-xl font-black text-slate-800">{isEn ? 'Privacy & Data' : 'Privasi & Data'}</h3>
                  <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{isEn ? 'Manage your history' : 'Kelola riwayat Anda'}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={clearFoodHistory}
                className="bg-white border border-red-100 p-6 rounded-3xl flex flex-col items-center text-center gap-3 hover:bg-red-600 hover:text-white transition-all group"
              >
                <Trash2 size={24} className="text-red-500 group-hover:text-white" />
                <span className="text-sm font-black uppercase tracking-widest">{isEn ? 'Clear Food History' : 'Hapus Riwayat Makan'}</span>
              </button>
              <button 
                onClick={clearChatHistory}
                className="bg-white border border-red-100 p-6 rounded-3xl flex flex-col items-center text-center gap-3 hover:bg-red-600 hover:text-white transition-all group"
              >
                <History size={24} className="text-red-500 group-hover:text-white" />
                <span className="text-sm font-black uppercase tracking-widest">{isEn ? 'Clear Chat History' : 'Hapus Riwayat Chat'}</span>
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                 <div className="bg-amber-100 p-4 rounded-2xl text-amber-600"><Utensils size={24} /></div>
                 <h3 className="text-lg font-black text-slate-800">{isEn ? 'Diet Protocol' : 'Protokol Diet'}</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {dietProtocols.map(p => (
                   <button key={p} onClick={() => handleChange('dietProtocol', p)} className={`w-full p-4 rounded-2xl text-xs font-black flex justify-between items-center transition-all ${profile.dietProtocol === p ? 'bg-slate-900 text-white shadow-xl translate-x-1' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                     {p}
                     {profile.dietProtocol === p && <ChevronRight size={14} />}
                   </button>
                 ))}
              </div>
           </section>

           <section className="bg-emerald-600 rounded-[40px] p-10 text-white space-y-10 shadow-2xl shadow-emerald-100 border border-transparent">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl border border-white/20"><Target size={24} /></div>
                <h3 className="text-lg font-black">{isEn ? 'Core Goal' : 'Objektif Utama'}</h3>
              </div>
              <div className="space-y-2">
                 {goals.map(g => (
                   <button key={g.id} onClick={() => handleChange('goal', g.id)} className={`w-full p-4 rounded-2xl text-[11px] font-black flex items-center gap-3 transition-all ${profile.goal === g.id ? 'bg-white text-emerald-700 shadow-xl' : 'bg-emerald-500/30 text-white hover:bg-emerald-500/50'}`}>
                     {g.icon} {isEn ? g.en : g.id}
                   </button>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
