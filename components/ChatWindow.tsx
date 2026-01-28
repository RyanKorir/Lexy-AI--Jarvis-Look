
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Link as LinkIcon } from 'lucide-react';
import { Message } from '../types';

interface Props {
  messages: Message[];
  onSend: (text: string) => void;
  isThinking: boolean;
  streamingText: string;
}

export const ChatWindow: React.FC<Props> = ({ messages, onSend, isThinking, streamingText }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-glass rounded-xl border border-cyan-500/10 shadow-2xl overflow-hidden">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
            <Terminal className="w-12 h-12 text-cyan-400" />
            <p className="mono text-sm max-w-xs">
              "Standing by. Try not to start a global crisis, Sir."
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${
              msg.role === 'user' 
                ? 'bg-cyan-500/10 border border-cyan-500/20 text-slate-100' 
                : 'bg-slate-800/50 border border-slate-700/50 text-cyan-50'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-40 mono text-[10px]">
                <span>{msg.role === 'user' ? 'USER_AUTH' : 'LEXY_CORE'}</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-4 pt-3 border-t border-cyan-500/10 space-y-2">
                  <span className="text-[10px] mono opacity-50 uppercase tracking-wider">Research Sources:</span>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, i) => (
                      <a 
                        key={i}
                        href={url.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded border border-cyan-800/30 transition-colors"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{url.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-[85%] md:max-w-[70%] bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-cyan-50 animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center gap-2 mb-2 opacity-40 mono text-[10px]">
                <span>LEXY_CORE</span>
                <span>•</span>
                <span className="animate-pulse">ANALYZING...</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {streamingText || "Processing query..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/10 bg-slate-900/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isThinking ? "Lexy is thinking aggressively..." : "Enter command, Sir..."}
            disabled={isThinking}
            className="w-full bg-slate-950/50 border border-cyan-500/20 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 text-slate-100 placeholder-slate-600 mono text-sm transition-all"
          />
          <button 
            type="submit"
            disabled={isThinking || !input.trim()}
            className="absolute right-2 p-2 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all shadow-lg shadow-cyan-900/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
