
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import Analyzer from './views/Analyzer';
import HistoryView from './views/History';
import Planner from './views/Planner';
import Chat from './views/Chat';
import Recommendations from './views/Recommendations';
import Settings from './views/Settings';
import Login from './views/Login';
import NearbyFacilities from './views/NearbyFacilities';
import Emergency from './views/Emergency';
import MentalSurvey from './views/MentalSurvey';
import MentalSession from './views/MentalSession';
import { AppView, UserProfile } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutri_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nutri_auth') === 'true';
  });
  
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const auth = localStorage.getItem('nutri_auth') === 'true';
    return auth ? 'dashboard' : 'login';
  });

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('nutri_profile', JSON.stringify(newProfile));
  };

  const handleLogin = (userProfile: UserProfile) => {
    localStorage.setItem('nutri_auth', 'true');
    handleUpdateProfile(userProfile);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('nutri_auth');
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const renderView = () => {
    if (!isAuthenticated) return <Login onLogin={handleLogin} />;
    
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'analyzer': return <Analyzer />;
      case 'history': return <HistoryView />;
      case 'planner': return <Planner />;
      case 'chat': return <Chat />;
      case 'recommendations': return <Recommendations />;
      case 'hospitals': return <NearbyFacilities />;
      case 'emergency': return <Emergency />;
      case 'survey': return <MentalSurvey onViewChange={setCurrentView} />;
      case 'mental-session': return <MentalSession />;
      case 'settings': return <Settings onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 md:pl-20 transition-colors duration-500">
      {isAuthenticated && profile && (
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          language={profile.language}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-12 md:py-12">
        <div className="animate-fade-in">
          {renderView()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
