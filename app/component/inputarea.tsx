import React from 'react';
import { ImageIcon, Mic, Send, Square, X } from 'lucide-react';

export const ChatInput = ({ 
  input, setInput, handleSend, selectedImage, setSelectedImage, audioUrl, setAudioUrl, 
  isRecording, startRecording, stopRecording, fileInputRef 
}: any) => (
  <footer className="p-4 sm:pb-8">
    <div className="max-w-3xl mx-auto bg-[#1e1f20] rounded-[28px] p-2 flex flex-col shadow-2xl border border-white/5 transition-all focus-within:bg-[#282a2d]">
      {selectedImage && <div className="px-4 pt-3 relative"><img src={selectedImage} className="h-16 w-16 object-cover rounded-xl border border-white/10" /><button onClick={() => setSelectedImage(null)} className="absolute top-1 left-16 bg-black rounded-full p-0.5 cursor-pointer"><X size={12} /></button></div>}
      {audioUrl && <div className="px-4 pt-3 flex items-center gap-2"><audio src={audioUrl} controls className="h-8 opacity-70" /><button onClick={() => setAudioUrl(null)} className="bg-[#282a2d] p-1 rounded-full cursor-pointer"><X size={14} /></button></div>}
      <textarea 
        className="bg-transparent border-none focus:ring-0 resize-none px-4 py-3 min-h-[56px] max-h-40 w-full outline-none text-[#e3e3e3]" 
        placeholder={isRecording ? "Recording..." : "Ask Gemini 3"} 
        value={input} onChange={(e) => setInput(e.target.value)} 
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
      />
      <div className="flex items-center justify-between px-2 pb-1">
        <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-[#37393b] rounded-full text-blue-400 cursor-pointer"><ImageIcon size={20} /></button>
        <div className="flex items-center gap-2">
          <button onClick={isRecording ? stopRecording : startRecording} className={`p-2.5 rounded-full ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-[#37393b] text-gray-400'} cursor-pointer`}>
            {isRecording ? <Square size={20} /> : <Mic size={20} />}
          </button>
          <button onClick={handleSend} disabled={!input.trim() && !selectedImage && !audioUrl} className="p-2 bg-[#2b2c2f] rounded-full hover:bg-[#444746] cursor-pointer">
            <Send size={20} className={`${(input.trim() || selectedImage || audioUrl) ? 'text-blue-400' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>
    </div>
  </footer>
);