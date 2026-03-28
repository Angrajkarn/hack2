'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Radio, Bell, Activity, Cpu } from 'lucide-react';

interface NavbarProps {
  crisisCount?: number;
}

const Navbar = ({ crisisCount = 0 }: NavbarProps) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav
      id="main-navbar"
      className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-void-black/90 backdrop-blur-xl sticky top-0 z-50"
      style={{ boxShadow: '0 1px 0 rgba(0,212,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/25 glow-primary">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight font-display" style={{ background: 'linear-gradient(90deg, #fff 40%, rgba(255,255,255,0.45))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AntiGravity
          </h1>
          <p className="text-[9px] text-primary/60 uppercase tracking-[0.25em] font-mono leading-none">
            Universal Intelligence Engine
          </p>
        </div>
      </div>

      {/* Center Status Row */}
      <div className="flex items-center gap-6">
        {/* Live Satellite Feed */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-success/5">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-ping" />
          <span className="text-[10px] font-mono text-white/50 tracking-wider">LIVE_SAT_CONN_04</span>
        </div>

        {/* Crisis Badge */}
        {crisisCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emergency/25 bg-emergency/8">
            <div className="w-1.5 h-1.5 bg-emergency rounded-full pulse-critical" />
            <span className="text-[10px] font-mono text-emergency/80 tracking-wider">
              {crisisCount} INCIDENT{crisisCount !== 1 ? 'S' : ''} LOGGED
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        <span className="text-[10px] font-mono text-white/25 tracking-wider hidden lg:block">{time}</span>

        <div className="flex items-center gap-3 text-white/30">
          <button id="nav-radio" title="Radio channels" className="hover:text-primary transition-colors">
            <Radio className="w-4 h-4" />
          </button>
          <button id="nav-alerts" title="Alerts" className="hover:text-warning transition-colors relative">
            <Bell className="w-4 h-4" />
            {crisisCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emergency rounded-full" />
            )}
          </button>
          <button id="nav-activity" title="System activity" className="hover:text-success transition-colors">
            <Activity className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-violet/20 bg-violet/8">
          <Cpu className="w-3 h-3 text-violet" />
          <span className="text-[10px] font-mono text-violet/70">GEMINI-1.5</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
