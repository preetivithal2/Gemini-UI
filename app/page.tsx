"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './component/sidebar';
import { ChatInput } from './component/inputarea';
import { ChatHeader } from './component/chatheader';
import { WelcomePage } from './component/welcomepage';
import { GeminiLogo, ProfileImage } from './component/icons';
import { Sparkles } from 'lucide-react';

export default function ResponsiveGemini() {
  const [isWelcomePage, setIsWelcomePage] = useState<boolean>(true);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('Hello');
  const [messages, setMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedGemini');
    if (hasVisited === 'true') setIsWelcomePage(false);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleStartChatting = () => {
    localStorage.setItem('hasVisitedGemini', 'true');
    setIsWelcomePage(false);
  };

  const resetWelcome = () => {
    localStorage.removeItem('hasVisitedGemini');
    setIsWelcomePage(true);
  };

  // --- UPDATED RECENT CHAT HISTORY LOGIC ---
  const handleSendMessage = () => {
    if (!input.trim() && !selectedImage && !audioUrl) return;

    const userMessage = { 
      role: 'user', 
      content: input, 
      image: selectedImage || undefined, 
      audio: audioUrl || undefined 
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Save current input to use as title if needed
    const chatTitle = input.trim() || "New Chat";

    let currentId = activeChatId;

    // Logic: If no active chat, create a new one in history
    if (currentId === null) {
      currentId = Date.now();
      setActiveChatId(currentId);
      const newEntry = {
        id: currentId,
        title: chatTitle.length > 30 ? chatTitle.substring(0, 30) + "..." : chatTitle,
        messages: updatedMessages
      };
      setHistory(prev => [newEntry, ...prev]);
    } else {
      // Update existing chat in history
      setHistory(prev => prev.map(chat => 
        chat.id === currentId ? { ...chat, messages: updatedMessages } : chat
      ));
    }

    setInput('');
    setSelectedImage(null);
    setAudioUrl(null);

    // Bot Response Logic
    setTimeout(() => {
      const botResponse = { role: 'assistant', content: "I'm Gemini, your AI assistant." };
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);

      // Update history with bot response
      setHistory(prev => prev.map(chat => 
        chat.id === currentId ? { ...chat, messages: finalMessages } : chat
      ));
    }, 1000);
  };

  const deleteChat = (e: any, id: number) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(chat => chat.id !== id));
    if (activeChatId === id) {
      setMessages([]);
      setActiveChatId(null);
    }
    setMenuOpenId(null);
  };
  // ------------------------------------------

  if (isWelcomePage) return <WelcomePage onStart={handleStartChatting} GeminiLogo={GeminiLogo} ProfileImage={ProfileImage} />;

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={(e) => {/* same logic */}} accept="image/*" className="hidden" />
      
      <Sidebar
        isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} 
        startNewChat={() => { setMessages([]); setActiveChatId(null); }}
        history={history} activeId={activeChatId} 
        loadChat={(c: any) => { setActiveChatId(c.id); setMessages(c.messages); }}
        deleteChat={deleteChat}
        menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#131314]" onClick={() => { setMenuOpenId(null); setIsProfileOpen(false); }}>
        <ChatHeader
          isSidebarOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          isProfileOpen={isProfileOpen} setProfileOpen={setIsProfileOpen}
          resetWelcome={resetWelcome} ProfileImage={ProfileImage}
        />

        <div className="flex-1 overflow-y-auto px-4 scrollbar-thin">
          <div className="max-w-3xl mx-auto py-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-start mt-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-blue-400" size={24} />
                  <h2 className="text-4xl md:text-5xl font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">{greeting}, User</h2>
                </div>
                <h2 className="text-4xl md:text-5xl font-medium text-[#444746] mb-12">It's time to start counting down to 2026</h2>
              </div>
            ) : (
              <div className="space-y-12">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className="shrink-0 pt-1">{msg.role === 'user' ? <ProfileImage size={32} /> : <GeminiLogo size={28} />}</div>
                    <div className={`leading-relaxed text-[16px] ${msg.role === 'user' ? 'bg-[#282a2d] px-5 py-3 rounded-2xl max-w-[85%]' : 'flex-1 text-gray-200'}`}>
                      {msg.image && <img src={msg.image} className="max-w-xs rounded-lg mb-4 shadow-lg border border-white/10" />}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ChatInput
          input={input} setInput={setInput} handleSend={handleSendMessage}
          selectedImage={selectedImage} setSelectedImage={setSelectedImage}
          audioUrl={audioUrl} setAudioUrl={setAudioUrl}
          isRecording={isRecording} fileInputRef={fileInputRef}
          startRecording={() => {/* recorder logic */}} stopRecording={() => {/* recorder logic */}}
        />
      </main>
    </div>
  );
}