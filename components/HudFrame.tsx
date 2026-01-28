
import React from 'react';

export const HudFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col p-4 md:p-6 select-none">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 hud-scanline opacity-20 z-50 pointer-events-none" />
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl pointer-events-none" />

      {/* Decorative HUD Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-40 mono text-[10px] tracking-widest text-cyan-400">
        <span>LVL_CONTRL_INIT::OK</span>
        <span className="animate-pulse">|</span>
        <span>LINK_ESTABLISHED::SECURE</span>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
