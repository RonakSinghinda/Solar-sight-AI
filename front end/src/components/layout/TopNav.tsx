"use client";

import React from 'react';
import { Search, Bell, Activity } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface/30 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 flex-shrink-0">
      <div className="relative w-80">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search inspections, panels, reports..."
          className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 transition-all"
        />
      </div>
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
          </span>
          <span className="text-[10px] font-mono text-muted tracking-widest">SYSTEM NOMINAL</span>
        </div>
        <button className="relative p-2 text-muted hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-orange" />
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium hover:bg-white hover:text-black transition-all">
          <Activity size={14} />
          <span>New Scan</span>
        </button>
      </div>
    </header>
  );
}
