
import React, { useState } from 'react';
import { X, Volume2, VolumeX, Palette, Zap, User, Fingerprint, Shield } from 'lucide-react';
import { LexySettings, ThemeType } from '../types';

interface Props {
  settings: LexySettings;
  onUpdate: (settings: Partial<LexySettings>) => void;
  onClose: () => void;
}

type Tab = 'identity' | 'appearance' | 'protocols';

export const SettingsPanel: React.FC<Props> = ({ settings, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('identity');

  const themes: { id: ThemeType; label: string; class: string }[] = [
    { id: 'cyan', label: 'JARVIS', class: 'bg-cyan-500' },
    { id: 'crimson', label: 'ULTRON', class: 'bg-red-500' },
    { id: 'emerald', label: 'MATRIX', class: 'bg-emerald-500' },
    { id: 'gold', label: 'STARK', class: 'bg-amber-500' },
  ];

  const tabButtonStyle = (tab: Tab) => 
    `flex-1 text-center py-2 text-sm mono uppercase tracking-widest transition-all ${
      activeTab === tab 
        ? 'text-cyan-400 border-b-2 border-cyan-400' 
        : 'text-slate-500 hover:text-white border-b-2 border-transparent hover:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-cyan-500/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <h3 className="mono text-sm uppercase tracking-widest text-white">System Customization</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded"><X className="w-5 h-5" /></button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950/50">
          <button onClick={() => setActiveTab('identity')} className={tabButtonStyle('identity')}>
            <Fingerprint className="w-4 h-4 inline-block mr-2" /> Identity
          </button>
          <button onClick={() => setActiveTab('appearance')} className={tabButtonStyle('appearance')}>
            <Palette className="w-4 h-4 inline-block mr-2" /> Appearance
          </button>
          <button onClick={() => setActiveTab('protocols')} className={tabButtonStyle('protocols')}>
            <Shield className="w-4 h-4 inline-block mr-2" /> Protocols
          </button>
        </div>

        <div className="p-6 space-y-8">
          {activeTab === 'identity' && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <label className="flex items-center gap-2 text-[10px] mono text-slate-400 uppercase">
                <User className="w-3 h-3" /> User Identity
              </label>
              <input 
                type="text" 
                value={settings.userName}
                onChange={(e) => onUpdate({ userName: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm mono text-white focus:border-cyan-500 outline-none"
                placeholder="Ryan Korir"
              />
              <p className="text-[9px] text-slate-500 mono leading-relaxed mt-2">
                Lexy uses this to address you and tailor her responses. Changing this will update her operational directives.
              </p>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-[10px] mono text-slate-400 uppercase">Aesthetic Matrix</label>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onUpdate({ theme: t.id })}
                      className={`flex items-center gap-2 p-2 rounded border text-xs mono transition-all ${
                        settings.theme === t.id ? 'border-white bg-white/10' : 'border-white/5 bg-black/20 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${t.class}`} />
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-500 mono leading-relaxed mt-2">
                  Selecting a new aesthetic matrix will initiate a "Protocol Shift" sequence.
                </p>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] mono text-slate-400">
                    <span>ROTATION SPEED</span>
                    <span>{settings.avatarSpeed.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="5" step="0.1"
                    value={settings.avatarSpeed}
                    onChange={(e) => onUpdate({ avatarSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] mono text-slate-400">
                    <span>CORE INTENSITY</span>
                    <span>{settings.coreIntensity.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="2" step="0.1"
                    value={settings.coreIntensity}
                    onChange={(e) => onUpdate({ coreIntensity: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protocols' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Audio Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                <div className="flex items-center gap-3">
                  {settings.voiceEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                  <div>
                    <p className="text-sm mono text-white">Neural Voice Link</p>
                    <p className="text-[9px] mono text-slate-500">LEX_AUDIO_PROTOCOL_2.5</p>
                  </div>
                </div>
                <button
                  onClick={() => onUpdate({ voiceEnabled: !settings.voiceEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.voiceEnabled ? 'bg-cyan-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.voiceEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <p className="text-[9px] text-slate-500 mono leading-relaxed mt-2">
                Enables Lexy's neural voice output. Disabling will limit responses to text-only.
              </p>

              {/* Memory Nodes Status */}
              <div className="space-y-3 mt-8">
                <label className="flex items-center gap-2 text-[10px] mono text-slate-400 uppercase">
                  <Zap className="w-3 h-3" /> Memory Nodes
                </label>
                <div className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm mono text-slate-300 min-h-[60px]">
                  {settings.memoryNodes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {settings.memoryNodes.map((node, i) => (
                        <li key={i} className="text-[11px] text-slate-400">{node}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-600 text-[11px]">No active memory fragments.</span>
                  )}
                </div>
                <p className="text-[9px] text-slate-500 mono leading-relaxed mt-2">
                  Lexy summarizes key conversations to maintain context across sessions (up to 5 nodes).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
