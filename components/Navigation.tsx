
import React from 'react';
import { LayoutDashboard, Camera, CalendarDays, MessageSquare, Lightbulb, Settings as SettingsIcon, Hospital, ShieldAlert, History } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  language: 'id' | 'en';
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, language }) => {
  const isEn = language === 'en';
  
  const navItems = [
    { id: 'dashboard', label: isEn ? 'Home' : 'Beranda', icon: LayoutDashboard },
    { id: 'analyzer', label: isEn ? 'Analysis' : 'Analisis', icon: Camera },
    { id: 'history', label: isEn ? 'History' : 'Riwayat', icon: History },
    { id: 'recommendations', label: isEn ? 'Advice' : 'Saran', icon: Lightbulb },
    { id: 'planner', label: isEn ? 'Plan' : 'Rencana', icon: CalendarDays },
    { id: 'hospitals', label: isEn ? 'Medical' : 'Fasilitas', icon: Hospital },
    { id: 'emergency', label: isEn ? 'Emergency' : 'Darurat', icon: ShieldAlert },
    { id: 'chat', label: isEn ? 'Consult' : 'Konsul', icon: MessageSquare },
    { id: 'settings', label: isEn ? 'Profile' : 'Profil', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-full md:border-r md:border-t-0 md:px-0 md:py-8 transition-colors">
      <div className="hidden md:flex mb-8 flex-col items-center">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">H</div>
      </div>
      
      <div className="flex w-full justify-around md:flex-col md:gap-6 md:items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isEmergency = item.id === 'emergency';
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AppView)}
              className={`flex flex-col items-center transition-all duration-200 relative group ${
                isActive 
                  ? (isEmergency ? 'text-red-600' : 'text-emerald-600') 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              <span className="text-[10px] mt-1 font-semibold md:hidden">{item.label}</span>
              {isActive && (
                <div className={`hidden md:block absolute left-0 w-1 h-6 rounded-r-full -translate-x-3 ${isEmergency ? 'bg-red-600' : 'bg-emerald-600'}`} />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="hidden md:flex mt-auto">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
          U
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
