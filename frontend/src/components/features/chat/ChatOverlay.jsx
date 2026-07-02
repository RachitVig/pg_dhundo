import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Send } from 'lucide-react';
import { pgService } from '../../../services/api';

const ChatOverlay = ({ activeChatPg, setActiveChatPg, clientId, API_BASE, WS_BASE }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeChatPg) {
      const fetchHistory = async () => {
        try {
          const res = await pgService.getHistory(activeChatPg.id, clientId);
          setMessages(res.data.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
        } catch (err) {
          console.error("History Error:", err);
          setMessages([{
            id: 'system-1',
            sender: 'System',
            content: `Connected to ${activeChatPg.name}. No previous history.`,
            timestamp: new Date()
          }]);
        }
      };
      
      fetchHistory();

      const newSocket = new WebSocket(`${WS_BASE}/ws/chat/${activeChatPg.id}/${clientId}`);
      
      newSocket.onmessage = (event) => {
        const data = event.data;
        if (data.startsWith("System: ")) return;

        const isUser = data.startsWith("You says: ");
        const content = data.split(isUser ? "You says: " : "Owner says: ")[1];
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: isUser ? "You" : "Owner",
          content: content,
          timestamp: new Date()
        }]);
      };

      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [activeChatPg, clientId, API_BASE, WS_BASE]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && chatInput.trim()) {
      socket.send(chatInput);
      setChatInput('');
    }
  };

  if (!activeChatPg) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[3000] w-full max-w-sm h-[32rem] bg-white rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900 p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <User size={20} />
           </div>
           <div>
              <h4 className="text-white font-black text-xs uppercase tracking-tight">{activeChatPg.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-[9px] font-black text-slate-400 uppercase">Host is Online</span>
              </div>
           </div>
        </div>
        <button onClick={() => setActiveChatPg(null)} className="p-2 hover:bg-slate-800 text-slate-400 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
              msg.sender === 'You' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-100 rounded-bl-none text-slate-700'
            }`}>
              {msg.content}
            </div>
            <span className="text-[8px] font-black text-slate-400 uppercase mt-1 px-1">
              {msg.sender} • {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
         <input 
           autoFocus
           type="text" 
           className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
           placeholder="Type a message..."
           value={chatInput}
           onChange={(e) => setChatInput(e.target.value)}
         />
         <button type="submit" className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Send size={18} />
         </button>
      </form>
    </div>
  );
};

export default ChatOverlay;
