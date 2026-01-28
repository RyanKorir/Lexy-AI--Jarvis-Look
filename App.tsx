
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HudFrame } from './components/HudFrame';
import { SystemStats } from './components/SystemStats';
import { LexyAvatar } from './components/LexyAvatar';
import { ChatWindow } from './components/ChatWindow';
import { SettingsPanel } from './components/SettingsPanel';
import { chatWithLexy, getLexyVoice } from './geminiService';
import { Message, LexySettings, ThemeType } from './types';
import { Settings, Info, Mic, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'lexy_v2_core';
const DEFAULT_SETTINGS: LexySettings = {
  theme: 'cyan',
  voiceEnabled: true,
  avatarSpeed: 1.2,
  coreIntensity: 1.1,
  userName: 'Ryan Korir',
  memoryNodes: []
};

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;

// Audio Helpers
const decode = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<LexySettings>(DEFAULT_SETTINGS);
  const [isRebooting, setIsRebooting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  // Persistence & Recognition Init
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) { console.error("Corrupt config"); }
    }

    const Recognition = SpeechRecognition || webkitSpeechRecognition;
    if (Recognition) {
      recognitionRef.current = new Recognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (e: any) => {
        handleSendMessage(e.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  // Theme Sync & Protocol Shift
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.className = settings.theme;
  }, [settings]);

  // Handle Protocol Shift (Theme Change Animation)
  const updateSettings = (newSettings: Partial<LexySettings>) => {
    if (newSettings.theme && newSettings.theme !== settings.theme) {
      setIsRebooting(true);
      setTimeout(() => setIsRebooting(false), 800);
    }
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const playVoice = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    const data = decode(base64);
    const buffer = await decodeAudioData(data, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    setStreamingText('');

    try {
      const response = await chatWithLexy(
        [...messages, userMsg].slice(-10), // Context window
        settings.userName,
        settings.memoryNodes,
        (chunk) => setStreamingText(chunk)
      );
      
      let audio;
      if (settings.voiceEnabled) {
        audio = await getLexyVoice(response.text);
        if (audio) playVoice(audio);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        groundingUrls: response.groundingUrls,
        audioData: audio
      }]);

      // Simple memory update: save every 5 messages
      if (messages.length % 5 === 0) {
        setSettings(prev => ({
          ...prev,
          memoryNodes: [...prev.memoryNodes, `Last discussed: ${content.substring(0, 30)}...`].slice(-5)
        }));
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: "Neural link severed. Attempting reconnect.", timestamp: Date.now() }]);
    } finally {
      setIsThinking(false);
      setStreamingText('');
    }
  }, [messages, settings]);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("System Vocal Capture Unavailable.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const themeAccent = {
    cyan: 'text-cyan-400 border-cyan-500/30',
    crimson: 'text-red-400 border-red-500/30',
    emerald: 'text-emerald-400 border-emerald-500/30',
    gold: 'text-amber-400 border-amber-500/30',
  }[settings.theme];

  return (
    <HudFrame>
      {isRebooting && (
        <div className="fixed inset-0 z-[200] bg-white pointer-events-none animate-ping opacity-20" />
      )}
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full pb-4 min-h-0 relative">
        {/* Left Control Column */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-glass rounded-3xl border border-white/10 relative overflow-hidden">
             {/* Security Badge */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="mono text-[8px] text-white/60 tracking-tighter">SECURE_LINK</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-2">
               <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/5 transition-all">
                <Settings className="w-4 h-4 text-white" />
              </button>
              <button onClick={toggleListening} className={`p-2 rounded-xl border border-white/5 transition-all ${isListening ? 'bg-red-500/40' : 'bg-black/40'}`}>
                <Mic className={`w-4 h-4 ${isListening ? 'text-red-400' : 'text-white'}`} />
              </button>
            </div>
            
            <LexyAvatar 
              isThinking={isThinking} 
              isListening={isListening}
              theme={settings.theme} 
              speed={settings.avatarSpeed} 
              intensity={settings.coreIntensity} 
              onClick={toggleListening}
            />
          </div>
          
          <div className="hidden lg:flex flex-1 flex-col bg-glass rounded-3xl border border-white/10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`mono text-[10px] uppercase tracking-widest ${themeAccent.split(' ')[0]}`}>Active Protocols</h3>
              <Info className="w-3 h-3 opacity-30" />
            </div>
            <div className="space-y-3">
              <StatusRow label="CORE_ARCH" val="Ryan_Korir_Custom" color="text-cyan-400" />
              <StatusRow label="IDENTITY" val={settings.userName === 'Ryan Korir' ? 'CREATOR_PRIMARY' : 'AUTHORIZED_GUEST'} color="text-green-400" />
              <StatusRow label="VOCAL_SYNC" val={settings.voiceEnabled ? 'ACTIVE' : 'MUTED'} color={settings.voiceEnabled ? 'text-emerald-400' : 'text-slate-600'} />
              <StatusRow label="MEMORY_RELAY" val={`${settings.memoryNodes.length} SEGMENTS`} color="text-purple-400" />
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/5">
              <p className="mono text-[9px] text-slate-500 leading-relaxed uppercase">
                Host Node: {navigator.platform}<br/>
                Version: Lexy_Sentient_V2.1<br/>
                Status: Operational
              </p>
            </div>
          </div>
        </div>

        {/* Messaging Interface */}
        <div className="flex-1 flex flex-col min-h-0">
          <SystemStats />
          <ChatWindow 
            messages={messages} 
            onSend={handleSendMessage} 
            isThinking={isThinking} 
            streamingText={streamingText}
          />
        </div>
      </div>

      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onUpdate={updateSettings} 
          onClose={() => setShowSettings(false)}
        />
      )}
    </HudFrame>
  );
};

const StatusRow = ({ label, val, color }: any) => (
  <div className="flex justify-between items-center text-[10px] mono py-1.5 border-b border-white/5 last:border-0">
    <span className="text-slate-500">{label}::</span>
    <span className={`${color} font-bold`}>{val}</span>
  </div>
);

export default App;
