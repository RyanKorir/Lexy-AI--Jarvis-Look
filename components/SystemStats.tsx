
import React, { useState, useEffect } from 'react';
import { Activity, Battery as BatteryIcon, Cpu, Globe } from 'lucide-react';
import { SystemStatus } from '../types';

export const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStatus>({
    cpu: 8,
    ram: 4.2,
    battery: 100,
    uptime: "00:00:00",
    platform: navigator.platform,
    connection: (navigator as any).connection?.effectiveType || 'Stable'
  });

  useEffect(() => {
    const startTime = Date.now();
    
    const updateRealStats = async () => {
      let batteryLevel = 100;
      if ('getBattery' in navigator) {
        const battery: any = await (navigator as any).getBattery();
        batteryLevel = Math.round(battery.level * 100);
      }

      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const mins = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const secs = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');

      setStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 15) + 2,
        battery: batteryLevel,
        uptime: `${hours}:${mins}:${secs}`,
        connection: (navigator as any).connection?.effectiveType?.toUpperCase() || 'STABLE'
      }));
    };

    const interval = setInterval(updateRealStats, 2000);
    updateRealStats();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon={<Cpu className="w-4 h-4 text-cyan-400" />} label="LOAD" value={`${stats.cpu}%`} />
      <StatCard icon={<Globe className="w-4 h-4 text-purple-400" />} label="LINK" value={stats.connection} />
      <StatCard icon={<BatteryIcon className="w-4 h-4 text-emerald-400" />} label="PWR" value={`${stats.battery}%`} />
      <StatCard icon={<Activity className="w-4 h-4 text-orange-400" />} label="SESSION" value={stats.uptime} />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-glass p-3 rounded-xl border border-white/5 flex flex-col gap-1 hover:border-white/20 transition-all group overflow-hidden relative">
    <div className="flex items-center gap-2 relative z-10">
      {icon}
      <span className="text-[9px] text-slate-500 mono font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-lg text-slate-100 mono relative z-10">{value}</div>
    {/* Background Glow Pulse */}
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);
