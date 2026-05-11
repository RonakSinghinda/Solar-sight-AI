"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Maximize, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROWS = 10;
const COLS = 20;
const anomalies = [
  { r: 2, c: 5, type: 'critical', temp: '+14°C', desc: 'Diode Failure' },
  { r: 4, c: 12, type: 'warning', temp: '+5°C', desc: 'Micro-crack' },
  { r: 8, c: 3, type: 'critical', temp: '+18°C', desc: 'String Disconnect' },
  { r: 7, c: 18, type: 'warning', temp: '+4°C', desc: 'Soiling/Shading' },
];

export default function PanelViewPage() {
  const [viewMode, setViewMode] = useState<'rgb' | 'thermal'>('thermal');
  const [selectedPanel, setSelectedPanel] = useState<any>(null);

  const getAnomaly = (r: number, c: number) => anomalies.find(a => a.r === r && a.c === c);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-cyan/10 rounded text-accent-cyan box-glow-cyan"><Layers size={18} /></div>
          <div>
            <h1 className="text-lg font-display font-bold text-white">Sector 4 Array</h1>
            <p className="text-[10px] text-muted font-mono tracking-widest">LIVE TELEMETRY ACTIVE</p>
          </div>
        </div>
        <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
          {(['rgb', 'thermal'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className={cn("px-5 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all",
                viewMode === m
                  ? m === 'thermal' ? "bg-accent-orange/20 text-accent-orange border border-accent-orange/30" : "bg-white/10 text-white"
                  : "text-muted hover:text-white"
              )}
            >
              {m === 'thermal' ? 'THERMAL AI' : 'RGB VISUAL'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-[500px]">
        {/* Grid */}
        <div className="flex-1 glass-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-center">
          <div
            className="grid gap-1 relative z-10"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
          >
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const a = getAnomaly(r, c);
                let bg = viewMode === 'rgb' ? 'bg-[#0A1A2A]' : 'bg-[#111115]';
                let border = 'border-white/5';
                let glow = '';
                if (viewMode === 'thermal' && a) {
                  bg = a.type === 'critical' ? 'bg-danger animate-pulse' : 'bg-accent-orange';
                  border = a.type === 'critical' ? 'border-danger' : 'border-accent-orange';
                  glow = a.type === 'critical' ? 'shadow-[0_0_12px_rgba(255,0,60,0.8)] z-10' : 'shadow-[0_0_8px_rgba(255,95,0,0.6)] z-10';
                } else if (viewMode === 'rgb' && a) {
                  border = a.type === 'critical' ? 'border-danger' : 'border-accent-orange';
                }
                return (
                  <div key={`${r}-${c}`} onClick={() => setSelectedPanel(a || { r, c, type: 'normal', desc: 'Panel Nominal' })}
                    className={cn("w-7 h-10 rounded-sm border cursor-pointer hover:border-white/50 transition-all relative", bg, border, glow)}
                  >
                    {viewMode === 'rgb' && <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4px_4px]" />}
                  </div>
                );
              })
            )}
          </div>
          {viewMode === 'thermal' && (
            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-accent-orange/15 to-transparent skew-x-12 pointer-events-none z-0"
            />
          )}
        </div>

        {/* Detail Panel */}
        <div className="w-72 flex-shrink-0">
          <AnimatePresence mode="wait">
            {selectedPanel ? (
              <motion.div key="panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-2xl p-6 h-full border-t-4"
                style={{ borderTopColor: selectedPanel.type === 'critical' ? '#FF003C' : selectedPanel.type === 'warning' ? '#FF5F00' : '#00FF66' }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] font-mono text-muted mb-1">PANEL ID</div>
                    <div className="text-lg font-display font-bold text-white">SEC4-R{selectedPanel.r}-C{selectedPanel.c}</div>
                  </div>
                  {selectedPanel.type === 'critical' && <AlertTriangle className="text-danger flex-shrink-0" size={20} />}
                  {selectedPanel.type === 'warning' && <Info className="text-accent-orange flex-shrink-0" size={20} />}
                  {selectedPanel.type === 'normal' && <ShieldCheck className="text-success flex-shrink-0" size={20} />}
                </div>
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-muted mb-1">DIAGNOSIS</div>
                    <div className={cn("text-sm font-bold", selectedPanel.type === 'critical' ? 'text-danger' : selectedPanel.type === 'warning' ? 'text-accent-orange' : 'text-success')}>
                      {selectedPanel.desc}
                    </div>
                  </div>
                  {selectedPanel.temp && (
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] font-mono text-muted mb-1">THERMAL DELTA</div>
                      <div className="text-3xl font-display text-white">{selectedPanel.temp}</div>
                    </div>
                  )}
                  {selectedPanel.type !== 'normal' && (
                    <button className="w-full mt-2 py-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-all text-sm font-bold">
                      CREATE WORK ORDER
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center border border-dashed border-white/10"
              >
                <Maximize className="text-muted mb-4" size={28} />
                <p className="text-muted text-sm">Select a panel from the grid to view AI diagnostics.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
