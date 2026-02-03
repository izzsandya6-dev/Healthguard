
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Heart, Loader2, Brain, ChevronLeft } from 'lucide-react';
import { getMentalSupport } from '../services/geminiService';
import { ChatMessage, UserProfile } from '../types';

const MentalSession: React.FC = () => {
  const [profile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('nutri_profile') || '{}'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const isEn = profile.language === 'en';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ 
      role: 'model', 
      text: isEn 
        ? "1. I'm here to listen. 2. This is a safe space for your feelings. 3. How are you truly feeling today?" 
        : "1. Aku di sini untuk mendengarkan. 2. Ini adalah ruang aman untuk ceritamu. 3. Bagaimana perasaanmu hari ini?" 
    }]);
  }, [isEn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const renderCleanMentalMessage = (text: string) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/###/g, '');
    const lines = cleanText.split('\n').filter(l => l.trim().length > 0);

    return (
      <div className="space-y-4">
        {lines.map((line, idx) => {
          const match = line.match(/^(\d+)[.\s)]+(.*)/);
          const content = match ? match[2] : line;
          const number = match ? match[1] : null;

          if (number) {
            return (
              <div key={idx} className="flex gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 animate-slide-up shadow-sm">
                <span className="font-black text-indigo-600 shrink-0 text-xs flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-lg">{number}</span>
                <p className="text-sm font-bold text-indigo-900 leading-relaxed">{content}</p>
              </div>
            );
          }
          return <p key={idx} className="text-sm font-bold text-indigo-900 leading-relaxed">{content}</p>;
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
      const response = await getMentalSupport([...messages, userMsg], query);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Maaf, aku sedang kesulitan terhubung. Mari kita tarik napas sejenak." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in pb-4">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-indigo-900 tracking-tight flex items-center gap-3">
            <Heart className="text-rose-400 animate-pulse" fill="currentColor" />
            {isEn ? 'Safe Space' : 'Ruang Aman'}
          </h1>
          <p className="text-indigo-400 font-medium text-sm">Ceritakan apa saja, aku akan mendengarkan.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Private & Secure</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-white/60 rounded-[48px] border border-indigo-50 p-6 md:p-10 space-y-6 shadow-sm custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500 border border-indigo-100'
              }`}>
                {msg.role === 'user' ? <User size={24} /> : <Brain size={24} />}
              </div>
              <div className={`p-6 rounded-[32px] ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-100' 
                  : 'bg-white text-indigo-950 rounded-tl-none font-bold border border-indigo-50/50 shadow-sm'
              }`}>
                {msg.role === 'user' ? <p className="text-sm font-bold">{msg.text}</p> : renderCleanMentalMessage(msg.text)}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-indigo-400 text-[10px] font-black animate-pulse px-4 uppercase tracking-widest">AI sedang mendengarkan dengan seksama...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isEn ? "What's on your mind?..." : "Apa yang sedang kamu pikirkan?..."}
          className="flex-1 bg-white border border-indigo-100 rounded-[32px] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-lg text-indigo-900 font-bold"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white p-6 rounded-[32px] hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95"
        >
          <Send size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default MentalSession;
