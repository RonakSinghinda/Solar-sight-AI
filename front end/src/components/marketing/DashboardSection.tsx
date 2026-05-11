"use client";

import React from 'react';
import { motion } from 'framer-motion';

const DashboardSection = () => {
  return (
    <section className="relative w-full py-32 bg-background overflow-hidden" id="dashboard">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display font-bold mb-6"
        >
          Drone Monitoring Dashboard
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted text-lg max-w-2xl mx-auto"
        >
          Real-time solar panel analytics, thermal overlays, and GPS mapping integrated into a seamless cinematic HUD.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="relative w-full aspect-[16/9] max-h-[800px] rounded-2xl glass-panel border border-primary/20 overflow-hidden box-shadow-[0_0_50px_rgba(0,240,255,0.05)]"
        >
          {/* Dashboard UI Mockup using Tailwind */}
          <div className="absolute inset-0 bg-[#020202]/80 backdrop-blur-xl flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-danger animate-pulse box-glow-red" />
                <span className="text-xs font-mono text-white/50 tracking-widest">LIVE TELEMETRY: SECTOR 4</span>
              </div>
              <div className="flex gap-4 text-xs font-mono text-primary">
                <span>ALT: 120m</span>
                <span>SPD: 12m/s</span>
                <span>BATT: 84%</span>
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex p-6 gap-6">
              {/* Left sidebar */}
              <div className="w-1/4 flex flex-col gap-6">
                <div className="flex-1 border border-white/5 rounded-xl bg-white/5 p-4 relative overflow-hidden">
                   <div className="text-xs font-mono text-muted mb-4">FAULT SEVERITY</div>
                   <div className="flex flex-col gap-3">
                     {[85, 42, 12].map((val, i) => (
                       <div key={i} className="w-full">
                         <div className="flex justify-between text-xs mb-1">
                           <span className={i===0?'text-danger':i===1?'text-accent':'text-primary'}>
                             {i===0?'CRITICAL':i===1?'WARNING':'INFO'}
                           </span>
                           <span className="text-white/50">{val}</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${i===0?'bg-danger':i===1?'bg-accent':'bg-primary'}`} style={{ width: `${val}%` }} />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
                <div className="h-1/3 border border-white/5 rounded-xl bg-white/5 p-4">
                  <div className="text-xs font-mono text-muted mb-2">THERMAL DELTA</div>
                  <div className="text-3xl font-display text-white">+14.2Â°C</div>
                </div>
              </div>

              {/* Center Map/Video */}
              <div className="flex-1 border border-white/5 rounded-xl bg-black relative overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592833159057-6dd0248a3188?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen" />
                
                {/* Overlay Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* Scan Line Animation */}
                <motion.div 
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-primary/20 border-b border-primary"
                />

                <div className="relative z-10 w-16 h-16 border border-primary rounded-full flex items-center justify-center box-glow-cyan">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
              </div>

              {/* Right sidebar */}
              <div className="w-1/4 flex flex-col gap-6">
                <div className="h-2/3 border border-white/5 rounded-xl bg-white/5 p-4 overflow-hidden relative">
                   <div className="text-xs font-mono text-muted mb-4">REAL-TIME ALERTS</div>
                   <div className="space-y-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="flex gap-3 items-start border-l-2 border-danger pl-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                         <div className="text-[10px] text-danger font-mono mt-1">10:42:0{i}</div>
                         <div className="text-xs text-white/80">Hotspot anomaly detected in Array {i+14}</div>
                       </div>
                     ))}
                   </div>
                </div>
                <div className="flex-1 border border-white/5 rounded-xl bg-white/5 flex items-center justify-center">
                   <button className="px-6 py-2 border border-white/20 rounded-full text-xs font-mono text-white hover:bg-white hover:text-black transition-colors">
                     GENERATE REPORT
                   </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSection;

