import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

export const WelcomePage = ({ onStart, GeminiLogo, ProfileImage }: any) => (
  <div className="h-screen w-full bg-[#000000] flex flex-col items-center justify-between text-white font-sans overflow-hidden">
    <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
      <span className="text-xl font-medium tracking-tight">Google DeepMind</span>
      <ProfileImage size={40} />
    </nav>
    <div className="flex flex-col items-center text-center px-4 animate-in fade-in zoom-in duration-700">
      <div className="mb-6"><GeminiLogo size={80} /></div>
      <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8">Gemini Models</h1>
      <button onClick={onStart} className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-all shadow-xl hover:scale-105 cursor-pointer">
        Start Chatting <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
      <div className="mt-16 max-w-md bg-[#131314] border border-white/10 p-6 rounded-2xl flex gap-4 items-center text-left">
        <div className="w-16 h-16 bg-[#1e1f20] rounded-lg flex items-center justify-center shrink-0"><Sparkles className="text-blue-400" size={24} /></div>
        <div>
          <p className="text-xs text-blue-400 font-bold uppercase mb-1">Company</p>
          <p className="text-sm text-gray-300">Gemini breaks new ground: a faster model and longer context.</p>
        </div>
      </div>
    </div>
    <div className="w-full p-8 flex justify-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
      <span>Ultra</span><span>Pro</span><span className="text-blue-400 border-b border-blue-400">Flash</span><span>Nano</span>
    </div>
  </div>
);