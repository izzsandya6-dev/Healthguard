
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Calendar, 
  Weight, 
  Ruler,
  ExternalLink,
  Inbox,
  ArrowLeft,
  Users
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (userData: UserProfile) => void;
}

type AuthView = 'login' | 'register' | 'verify_pending';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSimulatedEmail, setShowSimulatedEmail] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'Pria' | 'Wanita'>('Pria');

  const getRegisteredUsers = (): UserProfile[] => {
    return JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
  };

  const updateUsers = (users: UserProfile[]) => {
    localStorage.setItem('hg_registered_users', JSON.stringify(users));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const users = getRegisteredUsers();

    if (!email || !password || !name || !age || !weight || !height) {
      setError("Mohon lengkapi semua data: Nama, Email, Sandi, Umur, BB, dan TB.");
      return;
    }

    if (users.find(u => u.email === email)) {
      setError("Email sudah terdaftar. Silakan login.");
      return;
    }
    
    // Fix: Added missing 'weightHistory', 'activityLog', 'dietProtocol', and 'wellnessPrefs' 
    // properties to satisfy UserProfile interface.
    const newUser: UserProfile = {
      name,
      email,
      password,
      isVerified: false, // New users start unverified
      language: 'id',
      age: parseInt(age),
      weight: parseInt(weight),
      height: parseInt(height),
      gender: gender, // Using the selected gender
      goal: 'Meningkatkan Stamina',
      weightHistory: [],
      activityLog: [],
      dietPreference: 'Semua (Normal)',
      dietProtocol: 'Standard',
      allergies: [],
      medicalConditions: [],
      activityLevel: 'Moderat',
      focusArea: 'Energi',
      formula: { metabolism: 3, recovery: 3, focus: 3, longevity: 3 },
      emergencyContacts: [],
      connectedDevices: [],
      // Adding missing properties to fix TypeScript error
      hydrationToday: 0,
      hydrationGoal: 2000,
      // Fix: changed sleepLastNight to sleepLast_night to match UserProfile interface definition
      sleepLast_night: 0,
      sleepGoal: 8,
      immunityStatus: 'Stabil',
      wellnessPrefs: {
        meditation: true,
        exercise: true,
        deepSleep: true,
        hydration: true,
      }
    };

    updateUsers([...users, newUser]);
    setPendingEmail(email);
    setView('verify_pending');
    setShowSimulatedEmail(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setError("Email atau Sandi salah. Pastikan Anda sudah terdaftar.");
      return;
    }

    if (!user.isVerified) {
      setPendingEmail(email);
      setView('verify_pending');
      setError("Email Anda belum terverifikasi. Silakan cek 'Email' Anda.");
      return;
    }

    onLogin(user);
  };

  const simulateVerification = () => {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => u.email === pendingEmail ? { ...u, isVerified: true } : u);
    updateUsers(updatedUsers);
    setSuccess("Email berhasil diverifikasi! Silakan login sekarang.");
    setShowSimulatedEmail(false);
    setView('login');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative">
      {/* Simulated Email Notification / Inbox UI */}
      {showSimulatedEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-slate-100 p-6 flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <Inbox size={20} className="text-blue-500" />
                <span className="font-bold text-slate-700 text-sm">Simulasi Kotak Masuk</span>
              </div>
              <button onClick={() => setShowSimulatedEmail(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Dari: HealthGuard Security</p>
                <h3 className="text-xl font-black text-slate-800">Verifikasi Akun HealthGuard Anda</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Halo <strong>{name || pendingEmail}</strong>,<br /><br />
                Terima kasih telah bergabung dengan <strong>HealthGuard</strong>. Klik tautan di bawah ini untuk mengaktifkan profil kesehatan AI Anda secara penuh.
              </p>
              <button 
                onClick={simulateVerification}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                Verifikasi Akun Sekarang <ExternalLink size={16} />
              </button>
              <p className="text-[10px] text-slate-400 text-center italic">
                *Ini adalah simulasi proses pengiriman email ke {pendingEmail}.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl shadow-emerald-100 overflow-hidden border border-slate-100 animate-fade-in">
        <div className="bg-emerald-600 p-10 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30 shadow-xl">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">HealthGuard</h1>
            <p className="text-emerald-100 mt-2 font-bold opacity-90 uppercase tracking-widest text-[10px]">Sistem Keamanan Medis & Gizi</p>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
        </div>

        {view === 'verify_pending' ? (
          <div className="p-12 text-center space-y-8 animate-slide-up">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-blue-500">
              <Mail size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cek Email Anda</h2>
              <p className="text-slate-500 font-medium">Kami telah mengirimkan tautan verifikasi ke <strong>{pendingEmail}</strong>. Akun Anda belum aktif.</p>
            </div>
            <button 
              onClick={() => setShowSimulatedEmail(true)}
              className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              <Inbox size={20} /> Buka Simulasi Kotak Masuk
            </button>
            <button 
              onClick={() => setView('login')}
              className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <form onSubmit={view === 'register' ? handleRegister : handleLogin} className="p-8 md:p-12 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {view === 'register' ? 'Buat Profil Kesehatan' : 'Masuk ke HealthGuard'}
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {view === 'register' 
                  ? 'Verifikasi email diperlukan setelah pendaftaran' 
                  : 'Hanya email terverifikasi yang dapat masuk'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-3xl flex items-center gap-4 text-xs font-black border border-red-100 animate-shake">
                <AlertCircle size={20} className="flex-shrink-0" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-5 rounded-3xl flex items-center gap-4 text-xs font-black border border-emerald-100">
                <CheckCircle size={20} className="flex-shrink-0" /> {success}
              </div>
            )}

            <div className="space-y-4">
              {view === 'register' && (
                <div className="relative group">
                  <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl py-5 pl-14 pr-4 transition-all text-slate-700 font-bold focus:outline-none"
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Alamat Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl py-5 pl-14 pr-4 transition-all text-slate-700 font-bold focus:outline-none"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl py-5 pl-14 pr-4 transition-all text-slate-700 font-bold focus:outline-none"
                />
              </div>

              {view === 'register' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Kelamin</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('Pria')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                          gender === 'Pria'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <User size={18} /> Pria
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('Wanita')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                          gender === 'Wanita'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <Users size={18} /> Wanita
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 animate-slide-up">
                    <div className="relative group">
                      <div className="absolute left-4 top-4 text-slate-400">
                        <Calendar size={16} />
                      </div>
                      <input 
                        type="number" 
                        required
                        placeholder="Umur"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-10 pr-2 text-sm text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-4 text-slate-400">
                        <Weight size={16} />
                      </div>
                      <input 
                        type="number" 
                        required
                        placeholder="BB (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-10 pr-2 text-sm text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-4 text-slate-400">
                        <Ruler size={16} />
                      </div>
                      <input 
                        type="number" 
                        required
                        placeholder="TB (cm)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-10 pr-2 text-sm text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {view === 'register' ? 'Daftar Sekarang' : 'Masuk ke Sistem'}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 text-center border-t border-slate-50 mt-4">
              <button 
                type="button"
                onClick={() => {
                  setView(view === 'register' ? 'login' : 'register');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-all"
              >
                {view === 'register' ? 'Sudah punya akun? Login di sini' : 'Belum terdaftar? Buat akun lengkap'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
