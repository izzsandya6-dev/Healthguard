
import React, { useState, useEffect } from 'react';
import { Hospital, MapPin, Navigation, ExternalLink, Loader2, Search, Info } from 'lucide-react';
import { findNearbyHospitals } from '../services/geminiService';
import { NearbyFacility } from '../types';

const NearbyFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<NearbyFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationAndFind = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const results = await findNearbyHospitals(latitude, longitude);
          setFacilities(results);
        } catch (err) {
          setError("Gagal mendapatkan data fasilitas medis. Coba lagi nanti.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Izin lokasi ditolak. Aktifkan lokasi untuk mencari fasilitas terdekat.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocationAndFind();
  }, []);

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Fasilitas Medis Terdekat</h1>
          <p className="text-slate-500 font-medium mt-2">Menampilkan Rumah Sakit dan Klinik di sekitar lokasi Anda.</p>
        </div>
        <button 
          onClick={getLocationAndFind}
          disabled={loading}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          Refresh Lokasi
        </button>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] flex items-center gap-4 text-red-600 shadow-sm animate-fade-in">
          <Info size={24} />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center space-y-6 border border-slate-100 shadow-sm">
          <Loader2 className="text-emerald-500 animate-spin" size={64} strokeWidth={3} />
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800">Mencari Fasilitas Terdekat...</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">HealthGuard Maps Integration</p>
          </div>
        </div>
      )}

      {!loading && facilities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {facilities.map((facility, idx) => (
            <div key={idx} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <Hospital size={28} />
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <MapPin size={12} /> Terdeteksi
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">
                  {facility.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  Klik tombol navigasi untuk melihat rute tercepat menuju lokasi ini.
                </p>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href={facility.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
                >
                  <Navigation size={16} /> Navigasi
                </a>
                <a 
                  href={facility.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-slate-100 text-slate-400 flex items-center justify-center rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && facilities.length === 0 && !error && (
        <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
          <Hospital size={64} className="text-slate-200 mb-6" />
          <h3 className="text-xl font-black text-slate-800">Fasilitas Tidak Ditemukan</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">Gunakan tombol refresh untuk mencari kembali.</p>
        </div>
      )}
    </div>
  );
};

export default NearbyFacilities;
