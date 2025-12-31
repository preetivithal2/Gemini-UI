import React from 'react';
import { Menu, Plus, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';

export const Sidebar = ({ 
  isOpen, toggle, startNewChat, history, activeId, loadChat, deleteChat, menuOpenId, setMenuOpenId 
}: any) => (
  <aside className={`fixed inset-y-0 left-0 z-50 bg-[#1e1f20] transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0'} lg:relative`}>
    <div className={`w-72 flex flex-col h-full p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      <div className="flex items-center justify-between mb-8">
        <button onClick={toggle} className="p-2 hover:bg-[#282a2d] rounded-full text-gray-400 cursor-pointer">
          <Menu size={20} />
        </button>
      </div>

      <button 
        onClick={() => {
          startNewChat();
          if (window.innerWidth < 1024) toggle(); // Close sidebar on mobile after clicking new chat
        }} 
        className="flex items-center gap-3 bg-[#1a1a1c] hover:bg-[#282a2d] px-4 py-3 rounded-full text-sm mb-8 w-fit text-gray-400 border border-white/5 font-medium cursor-pointer"
      >
        <Plus size={20} /> New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
        <p className="text-xs font-semibold text-gray-500 px-2 py-2 uppercase tracking-tighter">Recent</p>
        
        {history && history.length > 0 ? (
          history.map((chat: any) => (
            <div 
              key={chat.id} 
              onClick={() => {
                loadChat(chat);
                if (window.innerWidth < 1024) toggle(); // Close sidebar on mobile after selecting chat
              }} 
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm group relative transition-all ${activeId === chat.id ? 'bg-[#2e2f31] text-white' : 'hover:bg-[#282a2d] text-gray-400'}`}
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <MessageSquare size={16} className={activeId === chat.id ? "text-blue-400" : ""} />
                <span className="truncate">{chat.title}</span>
              </div>

              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setMenuOpenId(menuOpenId === chat.id ? null : chat.id); 
                }} 
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded-full transition-opacity cursor-pointer"
              >
                <MoreVertical size={14} />
              </button>

              {menuOpenId === chat.id && (
                <div className="absolute right-2 top-10 w-32 bg-[#2e2f31] border border-white/10 rounded-lg shadow-xl z-[60] py-1">
                  <button 
                    onClick={(e) => deleteChat(e, chat.id)} 
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-white/5 cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-600 px-3 py-4 italic">No recent chats</p>
        )}
      </div>
    </div>
  </aside>
);