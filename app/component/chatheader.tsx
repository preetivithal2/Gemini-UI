import React from 'react';
import { Menu, Settings, LogOut } from 'lucide-react';

export const ChatHeader = ({ isSidebarOpen, toggleSidebar, isProfileOpen, setProfileOpen, resetWelcome, ProfileImage }: any) => (
  <header className="p-4 flex items-center justify-between w-full relative">
    <div className="flex items-center gap-2">
      {!isSidebarOpen && <button onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} className="p-2 hover:bg-[#282a2d] rounded-full mr-2 cursor-pointer"><Menu size={24} /></button>}
      <div className="flex items-center gap-2 cursor-pointer" onClick={resetWelcome}>
        <span className="text-xl font-google text-[#e3e3e3]">Gemini</span>
        <div className="bg-[#282a2d] px-2 py-0.5 rounded text-[10px] text-blue-400 font-bold uppercase tracking-wider">Flash</div>
      </div>
    </div>
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setProfileOpen(!isProfileOpen); }} className="cursor-pointer hover:scale-105 transition-transform outline-none">
        <ProfileImage size={32} />
      </button>
      {isProfileOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#1e1f20] border border-white/10 rounded-3xl shadow-2xl z-[100] p-4 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center p-4 border-b border-white/5">
            <div className="mb-3"><ProfileImage size={64} /></div>
            <h3 className="text-lg font-medium text-white">User</h3>
            <p className="text-sm text-gray-400">user@example.com</p>
            <button className="mt-4 px-6 py-2 border border-gray-600 rounded-full text-sm font-medium hover:bg-[#282a2d] cursor-pointer">Manage Account</button>
          </div>
          <div className="py-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#282a2d] text-sm text-gray-300 rounded-xl cursor-pointer"><Settings size={18} /> Settings</button>
            <button onClick={resetWelcome} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#282a2d] text-sm text-gray-300 rounded-xl cursor-pointer"><LogOut size={18} /> Sign out</button>
          </div>
        </div>
      )}
    </div>
  </header>
);