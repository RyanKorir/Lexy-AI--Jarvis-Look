
import React, { useState, useEffect } from 'react';
import { ThemeType } from '../types';

interface Props {
  isThinking: boolean;
  isListening: boolean;
  theme: ThemeType;
  speed: number;
  intensity: number;
  onClick: () => void;
  customAvatarUrl: string | null; // New prop for custom avatar
}

const themeColors = {
  cyan: 'from-cyan-400 to-blue-600',
  crimson: 'from-red-500 to-rose-700',
  emerald: 'from-emerald-400 to-teal-600',
  gold: 'from-amber-300 to-yellow-600',
};

const glowColors = {
  cyan: 'rgba(34, 211, 238, 0.4)',
  crimson: 'rgba(244, 63, 94, 0.4)',
  emerald: 'rgba(52, 211, 153, 0.4)',
  gold: 'rgba(251, 191, 36, 0.4)',
};

const borderColors = {
  cyan: 'border-cyan-400/30',
  crimson: 'border-red-400/30',
  emerald: 'border-emerald-400/30',
  gold: 'border-amber-400/30',
};

export const LexyAvatar: React.FC<Props> = ({ isThinking, isListening, theme, speed, intensity, onClick, customAvatarUrl }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blink logic
  useEffect(() => {
    // Only blink if not using a custom avatar
    if (!customAvatarUrl) {
      const triggerBlink = () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
        setTimeout(triggerBlink, Math.random() * 5000 + 2000);
      };
      const timeout = setTimeout(triggerBlink, 3000);
      return () => clearTimeout(timeout);
    }
    return () => {}; // No-op cleanup if custom avatar is used
  }, [customAvatarUrl]);

  const rotationStyle = { animationDuration: `${20 / speed}s` };

  return (
    <div className="flex flex-col items-center justify-center p-8 cursor-pointer group" onClick={onClick}>
      <div className={`relative w-40 h-40 md:w-56 md:h-56 transition-transform duration-500 ${isListening ? 'scale-110' : 'hover:scale-105'}`}>
        
        {/* Outer Halo */}
        <div 
          style={rotationStyle}
          className={`absolute inset-0 border border-dashed ${borderColors[theme].replace('/30', '/20')} rounded-full animate-[spin_linear_infinite]`} 
        />

        {/* The Eye Socket / Custom Avatar Container */}
        <div 
          className={`absolute inset-4 rounded-full bg-slate-950 border-2 ${borderColors[theme]} shadow-inner overflow-hidden flex items-center justify-center transition-all duration-300 ${isListening ? 'border-opacity-100 ring-4 ring-white/10' : ''}`}
          style={{ boxShadow: (isThinking || isListening) ? `0 0 ${40 * intensity}px ${glowColors[theme]}` : 'none' }}
        >
          {customAvatarUrl ? (
            <img src={customAvatarUrl} alt="Custom Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            <>
              {/* Eyelids (Blink Effect) */}
              <div className={`absolute inset-0 bg-slate-900 z-30 transition-all duration-150 ${isBlinking ? 'h-full' : 'h-0'}`} />

              {/* Iris Container */}
              <div className={`relative w-4/5 h-4/5 rounded-full border border-white/5 flex items-center justify-center transition-transform duration-500 ${isThinking ? 'animate-pulse' : ''} ${isListening ? 'scale-110' : ''}`}>
                
                {/* Pupil */}
                <div className={`relative z-20 w-1/3 h-1/3 rounded-full bg-gradient-to-br ${themeColors[theme]} shadow-2xl flex items-center justify-center`}>
                  {/* Inner Pupil Glow */}
                  <div className="w-1/2 h-1/2 rounded-full bg-white opacity-40 blur-[2px]" />
                </div>

                {/* Shimmering Rings (Iris Details) */}
                <div className={`absolute inset-0 rounded-full border-2 border-white/10 ${isListening ? 'animate-ping' : ''}`} />
                <div className="absolute inset-2 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
              </div>
            </>
          )}
        </div>

        {/* Listening / Thinking Text HUD */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] mono text-white/40 tracking-[0.3em] uppercase">
            Click to Establish Vocal Link
          </span>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-1">
        <h2 
          className={`text-2xl font-black tracking-widest mono uppercase transition-all duration-500 ${isListening ? 'tracking-[0.5em] scale-110' : ''}`} 
          style={{ color: glowColors[theme].replace('0.4', '1'), textShadow: isListening ? `0 0 20px ${glowColors[theme]}` : 'none' }}
        >
          {isListening ? 'HEARING' : 'LEXY'}
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'} transition-colors`} />
          <span className="text-[10px] text-slate-500 mono uppercase tracking-[0.2em]">
            {isListening ? 'Vocal Capture Active' : isThinking ? 'Processing Neural Data' : 'Standing By, Sir'}
          </span>
        </div>
      </div>
    </div>
  );
};
