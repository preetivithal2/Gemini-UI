"use client";
import React, { useState, useRef, ChangeEvent } from 'react';
import { Menu, Plus, MessageSquare, Send, Image as ImageIcon, Mic, X, Square, MoreVertical, Trash2, LogOut, Settings, Sparkles, ChevronRight } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  audio?: string;
}

interface ChatHistory {
  id: number;
  title: string;
  messages: Message[];
}

const GeminiLogo = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="animate-pulse"
  >
    <path 
      d="M12 2C12 2 12.5 7.5 15 10C17.5 12.5 22 12 22 12C22 12 16.5 12.5 14 15C11.5 17.5 12 22 12 22C12 22 11.5 16.5 9 14C6.5 11.5 2 12 2 12C2 12 7.5 11.5 10 9C12.5 6.5 12 2 12 2Z" 
      fill="url(#gemini-grad-real)" 
    />
    <defs>
      <linearGradient id="gemini-grad-real" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1A73E8" />
        <stop offset="0.3" stopColor="#4285F4" /> 
        <stop offset="0.6" stopColor="#9B72CB" /> 
        <stop offset="0.8" stopColor="#D96570" /> 
        <stop offset="1" stopColor="#F4AF94" /> 
      </linearGradient>
    </defs>
  </svg>
);

export default function ResponsiveGemini() {
  // New state for Welcome Page navigation
  const [isWelcomePage, setIsWelcomePage] = useState<boolean>(true);
  
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'How can I help you today?' }
  ]);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSendMessage = () => {
    if (!input.trim() && !selectedImage && !audioUrl) return;
    const userMessage: Message = { role: 'user', content: input, image: selectedImage || undefined, audio: audioUrl || undefined };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setSelectedImage(null);
    setAudioUrl(null);

    if (activeChatId !== null) {
      setHistory(prev => prev.map(chat => chat.id === activeChatId ? { ...chat, messages: updatedMessages } : chat));
    }

    setTimeout(() => {
      const botResponse: Message = { role: 'assistant', content: "I'm Gemini, your AI assistant. How can I further assist you with this?" };
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      if (activeChatId !== null) {
        setHistory(prev => prev.map(chat => chat.id === activeChatId ? { ...chat, messages: finalMessages } : chat));
      }
    }, 1000);
  };

  const startNewChat = () => {
    if (messages.length > 1 && activeChatId === null) {
      const newChat: ChatHistory = {
        id: Date.now(),
        title: messages.find(m => m.role === 'user')?.content.substring(0, 25) + "..." || "New Chat",
        messages: messages
      };
      setHistory([newChat, ...history]);
    }
    setMessages([{ role: 'assistant', content: 'How can I help you today?' }]);
    setActiveChatId(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const loadChat = (chat: ChatHistory) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const deleteChat = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(chat => chat.id !== id));
    if (activeChatId === id) {
      setMessages([{ role: 'assistant', content: 'How can I help you today?' }]);
      setActiveChatId(null);
    }
    setMenuOpenId(null);
  };

  // --- WELCOME PAGE UI ---
  if (isWelcomePage) {
    return (
      <div className="h-screen w-full bg-[#000000] flex flex-col items-center justify-between text-white font-sans overflow-hidden">
        {/* Navbar */}
        <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-medium tracking-tight">Google DeepMind</span>
            <div className="hidden md:flex gap-6 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer">About</span>
              <span className="hover:text-white cursor-pointer">Research</span>
              <span className="hover:text-white cursor-pointer">Technologies</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-white/10" />
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center px-4 animate-in fade-in zoom-in duration-700">
          <div className="mb-6">
            <GeminiLogo size={80} />
          </div>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8">
            Gemini Models
          </h1>
          
          <button 
            onClick={() => setIsWelcomePage(false)}
            className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-all shadow-xl hover:scale-105"
          >
            Start Chatting
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Sub-card feature from your image */}
          <div className="mt-16 max-w-md bg-[#131314] border border-white/10 p-6 rounded-2xl flex gap-4 items-center text-left">
             <div className="w-16 h-16 bg-[#1e1f20] rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="text-blue-400" size={24} />
             </div>
             <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Company</p>
                <p className="text-sm text-gray-300 leading-snug">Gemini breaks new ground: a faster model, longer context and AI agents</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full p-8 flex justify-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
          <span>Ultra</span>
          <span>Pro</span>
          <span className="text-blue-400 border-b border-blue-400">Flash</span>
          <span>Nano</span>
        </div>
      </div>
    );
  }

  // --- ORIGINAL CHAT UI ---
  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(file);
        }
      }} accept="image/*" className="hidden" />

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#1e1f20] transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0'} lg:relative`}>
        <div className={`w-72 flex flex-col h-full p-4 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center justify-between mb-8">
            <button onClick={toggleSidebar} className="p-2 hover:bg-[#282a2d] rounded-full text-gray-400"><Menu size={20} /></button>
          </div>
          
          <button onClick={startNewChat} className="flex items-center gap-3 bg-[#1a1a1c] hover:bg-[#282a2d] px-4 py-3 rounded-full text-sm mb-8 w-fit text-gray-400 border border-white/5 font-medium transition-all shadow-sm">
            <Plus size={20} />
            New Chat
          </button>
          
          <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
            <p className="text-xs font-semibold text-gray-500 px-2 py-2 uppercase tracking-tighter">Recent</p>
            {history.map((chat) => (
              <div key={chat.id} onClick={() => loadChat(chat)} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm group relative transition-all ${activeChatId === chat.id ? 'bg-[#2e2f31] text-white' : 'hover:bg-[#282a2d] text-gray-400'}`}>
                <div className="flex items-center gap-3 truncate pr-2"><MessageSquare size={16} /><span className="truncate">{chat.title}</span></div>
                <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded-full transition-opacity"><MoreVertical size={14} /></button>
                {menuOpenId === chat.id && (
                  <div className="absolute right-2 top-10 w-32 bg-[#2e2f31] border border-white/10 rounded-lg shadow-xl z-[60] py-1">
                    <button onClick={(e) => deleteChat(e, chat.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-white/5 text-left"><Trash2 size={14} /> Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#131314]" onClick={() => { setMenuOpenId(null); setIsProfileOpen(false); }}>
        <header className="p-4 flex items-center justify-between w-full relative">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && <button onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} className="p-2 hover:bg-[#282a2d] rounded-full mr-2"><Menu size={24} /></button>}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsWelcomePage(true)}>
              <span className="text-xl font-google text-[#e3e3e3]">Gemini</span>
              <div className="bg-[#282a2d] px-2 py-0.5 rounded text-[10px] text-blue-400 font-bold uppercase tracking-wider">Flash</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative">
                <div 
                  onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-white/5 shadow-lg cursor-pointer hover:scale-105 transition-transform" 
                />
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-[#1e1f20] border border-white/10 rounded-3xl shadow-2xl z-[100] p-4 animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col items-center p-4 border-b border-white/5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-3" />
                        <h3 className="text-lg font-medium text-white">John Doe</h3>
                        <p className="text-sm text-gray-400">john.doe@example.com</p>
                        <button className="mt-4 px-6 py-2 border border-gray-600 rounded-full text-sm font-medium hover:bg-[#282a2d] transition-colors">Manage your Google Account</button>
                    </div>
                    <div className="py-2">
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#282a2d] text-sm text-gray-300 transition-colors"><Settings size={18} /> Settings</button>
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#282a2d] text-sm text-gray-300 transition-colors" onClick={() => setIsWelcomePage(true)}><LogOut size={18} /> Sign out</button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 scrollbar-thin">
          <div className="max-w-3xl mx-auto py-8 space-y-12">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="shrink-0 pt-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">U</div>
                  ) : (
                    <GeminiLogo size={28} />
                  )}
                </div>
                <div className={`leading-relaxed text-[16px] ${msg.role === 'user' ? 'bg-[#282a2d] px-5 py-3 rounded-2xl max-w-[85%]' : 'flex-1 text-gray-200'}`}>
                  {msg.image && <img src={msg.image} className="max-w-xs rounded-lg mb-4 shadow-lg border border-white/10" />}
                  {msg.audio && <audio controls src={msg.audio} className="mb-4 h-8 invert opacity-80" />}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="p-4 sm:pb-8">
          <div className="max-w-3xl mx-auto bg-[#1e1f20] rounded-[28px] p-2 flex flex-col shadow-2xl border border-white/5 transition-all focus-within:bg-[#282a2d]">
            {selectedImage && <div className="px-4 pt-3 relative"><img src={selectedImage} className="h-16 w-16 object-cover rounded-xl border border-white/10" /><button onClick={() => setSelectedImage(null)} className="absolute top-1 left-16 bg-black rounded-full p-0.5"><X size={12} /></button></div>}
            {audioUrl && <div className="px-4 pt-3 flex items-center gap-2"><audio src={audioUrl} controls className="h-8 opacity-70" /><button onClick={() => setAudioUrl(null)} className="bg-[#282a2d] p-1 rounded-full"><X size={14} /></button></div>}
            <textarea className="bg-transparent border-none focus:ring-0 resize-none px-4 py-3 min-h-[56px] max-h-40 w-full outline-none text-[#e3e3e3]" placeholder={isRecording ? "Recording..." : "Message Gemini..."} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
            <div className="flex items-center justify-between px-2 pb-1">
              <div className="flex gap-1">
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-[#37393b] rounded-full text-blue-400 transition-colors"><ImageIcon size={20} /></button>
                <button onClick={isRecording ? () => mediaRecorderRef.current?.stop() : async () => {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    const chunks: Blob[] = [];
                    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                    mediaRecorder.onstop = () => {
                      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                      setAudioUrl(URL.createObjectURL(blob));
                    };
                    mediaRecorder.start();
                    setIsRecording(true);
                  } catch (err) { alert("Microphone access denied."); }
                }} className={`p-2.5 rounded-full transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-[#37393b] text-blue-400'}`}>{isRecording ? <Square size={20} /> : <Mic size={20} />}</button>
              </div>
              <button onClick={handleSendMessage} disabled={!input.trim() && !selectedImage && !audioUrl} className="p-2 bg-[#2b2c2f] rounded-full transition-all hover:bg-[#444746]"><Send size={20} className={`${(input.trim() || selectedImage || audioUrl) ? 'text-blue-400' : 'text-gray-500'}`} /></button>
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-4">Gemini can make mistakes, so double-check its responses.</p>
        </footer>
      </main>
    </div>
  );
}