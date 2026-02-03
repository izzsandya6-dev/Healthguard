
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Plus, History, ChevronLeft, AlertCircle, Pill, Trash2 } from 'lucide-react';
import { getHealthAdvice } from '../services/geminiService';
import { ChatMessage, UserProfile, ChatSession } from '../types';

const Chat: React.FC = () => {
  const [profile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('nutri_profile') || '{}'));
  const [sessions, setSessions] = useState<ChatSession[]>(() => JSON.parse(localStorage.getItem('chat_sessions') || '[]'));
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const isEn = profile.language === 'en';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSessionId) {
      const session = sessions.find(s => s.id === activeSessionId);
      if (session) setMessages(session.messages);
    } else {
      setMessages([{ role: 'model', text: isEn ? "1. Hi! I'm your HealthGuard Expert. 2. I can suggest over-the-counter (OTC) medicine. 3. How can I help?" : "1. Halo! Saya Pakar HealthGuard. 2. Saya dapat menyarankan obat bebas (OTC) untuk gejala ringan. 3. Ada yang bisa saya bantu?" }]);
    }
  }, [activeSessionId, sessions, isEn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const clearAllSessions = () => {
    if (window.confirm(isEn ? "Are you sure you want to delete all chat history?" : "Yakin ingin menghapus semua riwayat chat?")) {
      setSessions([]);
      localStorage.setItem('chat_sessions', '[]');
      setActiveSessionId(null);
      setMessages([{ role: 'model', text: isEn ? "All chat history cleared. How can I help you today?" : "Semua riwayat chat telah dihapus. Ada yang bisa saya bantu?" }]);
    }
  };

  const renderCleanMessage = (text: string) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/###/g, '');
    const lines = cleanText.split('\n').filter(l => l.trim().length > 0);

    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          const match = line.match(/^(\d+)[.\s)]+(.*)/);
          const content = match ? match[2] : line;
          const number = match ? match[1] : null;

          if (number) {
            return (
              <div key={idx} className="flex gap-3 bg-white/40 p-3 rounded-xl border border-white/20 animate-slide-up shadow-sm">
                <span className="font-black text-emerald-600 shrink-0 text-[10px] flex items-center justify-center w-5 h-5 bg-emerald-50 rounded-lg">{number}</span>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{content}</p>
              </div>
            );
          }
          return <p key={idx} className="text-sm font-bold text-slate-700 leading-relaxed">{content}</p>;
        })}
      </div>
    );
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const query = input;
    setInput('');
    setLoading(true);

    try {
      const advice = await getHealthAdvice([...messages, userMsg], query);
      const aiMsg: ChatMessage = { role: 'model', text: advice };
      setMessages(prev => [...prev, aiMsg]);

      const newSessions = activeSessionId 
        ? sessions.map(s => s.id === activeSessionId ? { ...s, messages: [...messages, userMsg, aiMsg] } : s)
        : [{ id: Date.now().toString(), title: query.slice(0, 30), messages: [userMsg, aiMsg], timestamp: Date.now() }, ...sessions];
      
      setSessions(newSessions);
      localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
      if (!activeSessionId) setActiveSessionId(newSessions[0].id);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Koneksi terputus. Silakan coba lagi.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] max-w-6xl mx-auto gap-6 relative overflow-hidden animate-fade-in">
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r p-6 transition-transform md:relative md:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="flex flex-col h-full">
            <button onClick={() => { setActiveSessionId(null); setShowSidebar(false); }} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black text-xs uppercase mb-4 shadow-lg flex items-center justify-center gap-2"><Plus size={18}/> Konsul Baru</button>
            
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[70%] custom-scrollbar mb-4">
              {sessions.map(s => (
                <div key={s.id} onClick={() => { setActiveSessionId(s.id); setShowSidebar(false); }} className={`p-4 rounded-2xl cursor-pointer transition-all ${activeSessionId === s.id ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <p className="text-xs truncate">{s.title}</p>
                </div>
              ))}
            </div>

            {sessions.length > 0 && (
              <button 
                onClick={clearAllSessions}
                className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> {isEn ? 'Clear All Sessions' : 'Hapus Semua Sesi'}
              </button>
            )}
         </div>
         <button onClick={() => setShowSidebar(false)} className="md:hidden absolute top-4 right-4 text-slate-400"><ChevronLeft/></button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(true)} className="md:hidden bg-white p-2 rounded-xl border shadow-sm"><History size={20}/></button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Health Consult AI</h1>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100 flex items-center gap-2">
            <Pill size={14}/> Pharma Mode
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-white rounded-[40px] border border-slate-100 p-6 space-y-6 shadow-inner custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-900 text-white'}`}>
                  {msg.role === 'user' ? <User size={20}/> : <Bot size={20}/>}
                </div>
                <div className={`p-5 rounded-[28px] ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                  {msg.role === 'user' ? <p className="text-sm font-bold">{msg.text}</p> : renderCleanMessage(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="text-emerald-600 text-[10px] font-black animate-pulse px-4 uppercase tracking-widest">AI sedang merumuskan jawaban...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Tanya gejala atau dosis obat ringan..." className="flex-1 bg-white border border-slate-200 rounded-3xl px-6 py-4 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:outline-none" />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-emerald-600 text-white p-5 rounded-3xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"><Send size={24}/></button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
