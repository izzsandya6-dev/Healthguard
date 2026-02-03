
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, X, Maximize2, RefreshCw, Sparkles, Share2, ChevronRight, ListChecks } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodAnalysis } from '../types';

const Analyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeFoodImage(base64Data);
      
      const savedHistory = JSON.parse(localStorage.getItem('nutri_history') || '[]');
      const updatedHistory = [...savedHistory, { ...analysis, timestamp: Date.now() }];
      localStorage.setItem('nutri_history', JSON.stringify(updatedHistory));
      
      setResult(analysis);
    } catch (err) {
      setError("Gagal menganalisis gambar. Pastikan gambar jelas dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const renderCleanList = (text: string) => {
    const cleanLines = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/###/g, '')
      .split('\n')
      .filter(line => line.trim().length > 0);

    return (
      <div className="space-y-3">
        {cleanLines.map((line, idx) => {
          const match = line.match(/^(\d+)[.\s)]+(.*)/);
          const content = match ? match[2] : line;
          const number = match ? match[1] : (idx + 1).toString();

          return (
            <div 
              key={idx} 
              className="flex gap-4 items-start bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="w-6 h-6 bg-emerald-400 text-emerald-900 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px] shadow-sm">
                {number}
              </div>
              <p className="text-sm font-semibold text-emerald-50 leading-relaxed">{content}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Food Scan AI</h1>
          <p className="text-slate-500 font-medium mt-1">Laboratorium Gizi Digital dalam saku Anda.</p>
        </div>
        {image && !loading && !result && (
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100">
            <RefreshCw size={14} /> Ganti Foto
          </button>
        )}
      </header>

      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-dashed border-slate-200 rounded-[56px] p-20 md:p-32 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all shadow-sm">
          <div className="bg-emerald-100 p-8 rounded-[32px] text-emerald-600 mb-8 shadow-lg shadow-emerald-100">
            <Camera size={64} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="font-black text-2xl text-slate-800">Ambil Foto Hidangan</p>
            <p className="text-slate-400 font-medium mt-2">AI akan mendeteksi kalori, protein, dan nutrisi mikro.</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-[56px] overflow-hidden shadow-2xl border-[12px] border-white bg-slate-100 aspect-square md:aspect-auto md:min-h-[600px]">
              <img src={image} alt="Food Target" className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-10 text-center">
                  <Loader2 className="animate-spin mb-6" size={80} strokeWidth={1.5} />
                  <h3 className="text-2xl font-black tracking-tight">Menghitung Biometrik...</h3>
                </div>
              )}
              <button onClick={() => { setImage(null); setResult(null); }} className="absolute top-8 right-8 bg-white/90 text-slate-900 p-4 rounded-3xl font-black shadow-2xl backdrop-blur-md hover:bg-red-50 hover:text-red-600 transition-all">
                <X size={24} />
              </button>
            </div>
            {!result && !loading && (
              <button onClick={processImage} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4">
                Mulai Analisis Neural AI <Maximize2 size={20} />
              </button>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="bg-white rounded-[56px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10 animate-slide-up sticky top-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-100">
                      Food Report
                    </span>
                    <div className="flex flex-col items-end">
                       <span className="text-5xl font-black text-slate-800 tracking-tighter">{result.healthScore}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 leading-tight tracking-tight">{result.name}</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">{result.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Energi</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight">{result.nutrients.calories} <span className="text-xs font-bold text-slate-400">kcal</span></p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Protein</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight">{result.nutrients.protein} <span className="text-xs font-bold text-slate-400">g</span></p>
                  </div>
                </div>

                <div className="bg-emerald-600 text-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-emerald-100 relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 border-b border-emerald-500/30 pb-4">
                       <ListChecks size={24} className="text-emerald-100" />
                       <h4 className="font-black text-xl tracking-tight">Saran Ahli Gizi AI</h4>
                    </div>
                    {renderCleanList(result.recommendation)}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => window.print()} className="flex-1 bg-white text-slate-800 py-5 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all border border-slate-200">
                    Simpan Hasil
                  </button>
                  <button onClick={() => setImage(null)} className="flex-1 bg-slate-900 text-white py-5 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[56px] p-12 text-center h-full flex flex-col items-center justify-center text-slate-400">
                  <Sparkles size={48} strokeWidth={1} className="opacity-20 mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">Menunggu Analisis...</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
