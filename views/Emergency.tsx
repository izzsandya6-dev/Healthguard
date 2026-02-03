
import React, { useState, useEffect } from 'react';
import { Phone, Plus, Trash2, ShieldAlert, Heart, User, PhoneCall, AlertTriangle, X } from 'lucide-react';
import { EmergencyContact, UserProfile } from '../types';

const Emergency: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutri_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const isEn = profile?.language === 'en';

  const defaultContacts = isEn ? [
    { name: 'Ambulance', relation: 'National', phone: '911' },
    { name: 'Police', relation: 'National', phone: '911' },
    { name: 'Fire Department', relation: 'National', phone: '911' }
  ] : [
    { name: 'Ambulans', relation: 'Nasional', phone: '118' },
    { name: 'Polisi', relation: 'Nasional', phone: '110' },
    { name: 'Basarnas', relation: 'Nasional', phone: '115' }
  ];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: newName,
      relation: newRelation,
      phone: newPhone
    };

    const updatedProfile = {
      ...profile!,
      emergencyContacts: [...(profile?.emergencyContacts || []), newContact]
    };

    setProfile(updatedProfile);
    localStorage.setItem('nutri_profile', JSON.stringify(updatedProfile));
    
    // Clear form
    setNewName('');
    setNewRelation('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleDeleteContact = (id: string) => {
    const updatedProfile = {
      ...profile!,
      emergencyContacts: profile!.emergencyContacts.filter(c => c.id !== id)
    };
    setProfile(updatedProfile);
    localStorage.setItem('nutri_profile', JSON.stringify(updatedProfile));
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
            {isEn ? 'Emergency Center' : 'Pusat Darurat'}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {isEn ? 'Quick access to medical help and emergency contacts.' : 'Akses cepat bantuan medis dan kontak darurat Anda.'}
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100"
        >
          <Plus size={18} /> {isEn ? 'Add Contact' : 'Tambah Kontak'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Default Emergency Numbers */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={14} /> {isEn ? 'National Services' : 'Layanan Nasional'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {defaultContacts.map((contact, idx) => (
              <a 
                key={idx}
                href={`tel:${contact.phone}`}
                className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex items-center justify-between group hover:bg-red-600 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg group-hover:text-white transition-colors">{contact.name}</h4>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest group-hover:text-red-100 transition-colors">{contact.relation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-red-600 group-hover:text-white transition-colors tracking-tighter">{contact.phone}</p>
                  <PhoneCall size={18} className="ml-auto text-red-300 group-hover:text-white/50" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* User Specific Contacts */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Heart size={14} /> {isEn ? 'My Trusted Contacts' : 'Kontak Terpercaya Saya'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {(!profile.emergencyContacts || profile.emergencyContacts.length === 0) ? (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-[32px] p-12 text-center">
                <User size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold text-sm">
                  {isEn ? 'No custom contacts added yet.' : 'Belum ada kontak tambahan.'}
                </p>
              </div>
            ) : (
              profile.emergencyContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className="bg-white border border-slate-100 p-6 rounded-[32px] flex items-center justify-between group hover:shadow-xl transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{contact.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{contact.relation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href={`tel:${contact.phone}`}
                      className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      <Phone size={20} />
                    </a>
                    <button 
                      onClick={() => handleDeleteContact(contact.id)}
                      className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Warning Card */}
      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl mt-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-red-500/20 p-6 rounded-[32px] border border-red-500/30">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-2">{isEn ? 'Immediate Danger?' : 'Bahaya Mendesak?'}</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium">
              {isEn 
                ? "If you are experiencing a life-threatening medical emergency, call your local emergency number immediately. HealthGuard is an information tool and not a substitute for clinical emergency care." 
                : "Jika Anda mengalami keadaan darurat medis yang mengancam jiwa, segera hubungi nomor darurat lokal. HealthGuard adalah alat informasi dan bukan pengganti layanan gawat darurat klinis."}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">{isEn ? 'New Contact' : 'Kontak Baru'}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Name' : 'Nama'}</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={isEn ? "e.g. Dr. Smith" : "misal: Dr. Andi"}
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Relation' : 'Hubungan'}</label>
                  <input 
                    type="text" 
                    required
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    placeholder={isEn ? "e.g. Family Doctor" : "misal: Dokter Keluarga"}
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isEn ? 'Phone Number' : 'Nomor Telepon'}</label>
                  <input 
                    type="tel" 
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-100 mt-4 hover:bg-red-700 transition-all"
                >
                  {isEn ? 'Save Contact' : 'Simpan Kontak'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
