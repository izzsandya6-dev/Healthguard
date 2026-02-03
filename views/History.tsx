
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Trash2, 
  Search, 
  ChevronRight, 
  Filter, 
  X, 
  Utensils, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Flame, 
  ChevronDown,
  FileText
} from 'lucide-react';
import { FoodAnalysis, UserProfile } from '../types';

const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<FoodAnalysis[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<FoodAnalysis[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [profile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('nutri_profile') || '{}'));
  
  const isEn = profile.language === 'en';

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('nutri_history') || '[]');
    // Sort by newest first
    const sorted = [...savedHistory].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    setHistory(sorted);
    setFilteredHistory(sorted);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, searchQuery, history]);

  const applyFilters = () => {
    let result = [...history];

    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (startDate) {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      result = result.filter(item => (item.timestamp || 0) >= start);
    }

    if (endDate) {
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      result = result.filter(item => (item.timestamp || 0) <= end);
    }

    setFilteredHistory(result);
  };

  const deleteItem = (timestamp: number) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem('nutri_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm(isEn ? "Are you sure you want to clear all history?" : "Yakin ingin menghapus semua riwayat?")) {
      setHistory([]);
      localStorage.setItem('nutri_history', '[]');
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '---';
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
            {isEn ? 'Analysis History' : 'Riwayat Analisis'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isEn ? 'Tracking your nutritional evolution over time.' : 'Melacak evolusi nutrisi Anda dari waktu ke waktu.'}
          </p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-5 py-2.5 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> {isEn ? 'Clear All' : 'Hapus Semua'}
          </button>
        )}
      </header>

      {/* Filter Section */}
      <div className="bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-5 space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Search Food' : 'Cari Makanan'}</label>
           <div className="relative group">
              <Search className="absolute left-4 top-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search by name..." : "Cari berdasarkan nama..."}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              />
           </div>
        </div>
        <div className="md:col-span-3 space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'From Date' : 'Dari Tanggal'}</label>
           <div className="relative">
              <Calendar className="absolute left-4 top-4 text-slate-300 pointer-events-none" size={18} />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              />
           </div>
        </div>
        <div className="md:col-span-3 space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'To Date' : 'Sampai Tanggal'}</label>
           <div className="relative">
              <Calendar className="absolute left-4 top-4 text-slate-300 pointer-events-none" size={18} />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              />
           </div>
        </div>
        <div className="md:col-span-1 flex justify-center">
           <button 
             onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
             className="w-14 h-14 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl flex items-center justify-center border border-slate-100 transition-all"
             title={isEn ? "Reset filters" : "Reset filter"}
           >
              <X size={20} />
           </button>
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item, idx) => (
            <div 
              key={item.timestamp || idx} 
              className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative animate-slide-up overflow-hidden"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteItem(item.timestamp!)}
                  className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                <Clock size={14} className="text-emerald-500" />
                {formatDate(item.timestamp)}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                   <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors pr-8">
                     {item.name}
                   </h3>
                   <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${item.healthScore >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                     {item.healthScore}
                   </div>
                </div>
                
                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <Flame size={16} className="text-orange-500" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Energy</p>
                      <p className="text-sm font-black text-slate-800">{item.nutrients.calories} kcal</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Protein</p>
                      <p className="text-sm font-black text-slate-800">{item.nutrients.protein}g</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-2">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                   </div>
                   <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                      Verified <ChevronRight size={12} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[56px] p-24 text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center animate-fade-in">
           <div className="bg-slate-50 p-8 rounded-[40px] mb-8 text-slate-200">
              <FileText size={80} strokeWidth={1} />
           </div>
           <h3 className="text-2xl font-black text-slate-800">
             {isEn ? 'No Analysis Found' : 'Tidak Ada Riwayat'}
           </h3>
           <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">
             {isEn 
               ? "Try adjusting your filters or start a new food scan to build your nutritional history." 
               : "Coba sesuaikan filter Anda atau mulai scan makanan baru untuk membangun riwayat nutrisi Anda."}
           </p>
           {history.length > 0 && (
             <button 
               onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
               className="mt-8 text-emerald-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all"
             >
                <Filter size={14} /> {isEn ? 'Reset All Filters' : 'Reset Semua Filter'}
             </button>
           )}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
