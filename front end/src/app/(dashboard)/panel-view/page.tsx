"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, AlertTriangle, ShieldCheck, Info, X } from 'lucide-react';
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

  const borderColor =
    selectedPanel?.type === 'critical' ? '#FF003C' :
    selectedPanel?.type === 'warning'  ? '#FF5F00' : '#00FF66';

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* ── Controls Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-card p-3 md:p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-cyan/10 rounded text-accent-cyan box-glow-cyan flex-shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-display font-bold text-white">Sector 4 Array</h1>
            <p className="text-[10px] text-muted font-mono tracking-widest">LIVE TELEMETRY ACTIVE</p>
          </div>
        </div>

        {/* Anomaly legend + mode toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick legend */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-danger shadow-[0_0_6px_rgba(255,0,60,0.8)]" />
              CRITICAL
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-accent-orange" />
              WARNING
            </span>
          </div>
          {/* Mode toggle */}
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/5 flex-shrink-0">
            {(['rgb', 'thermal'] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={cn("px-3 md:px-5 py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                  viewMode === m
                    ? m === 'thermal' ? "bg-accent-orange/20 text-accent-orange border border-accent-orange/30" : "bg-white/10 text-white"
                    : "text-muted hover:text-white"
                )}
              >
                {m === 'thermal' ? 'THERMAL' : 'RGB'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content: Desktop = side-by-side, Mobile = stacked ───── */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">

        {/* Panel Grid */}
        <div className="flex-1 glass-card rounded-2xl p-3 md:p-6 relative overflow-hidden">
          <div className="overflow-x-auto pb-2">
            <div
              className="grid gap-0.5 md:gap-1 relative z-10 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`,
                // On mobile: each cell is smaller to fit on screen
                minWidth: '320px',
              }}
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
                  const isSelected = selectedPanel?.r === r && selectedPanel?.c === c;
                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => setSelectedPanel(a || { r, c, type: 'normal', desc: 'Panel Nominal' })}
                      className={cn(
                        "w-4 h-6 sm:w-5 sm:h-7 md:w-7 md:h-10 rounded-sm border cursor-pointer transition-all relative",
                        bg, border, glow,
                        isSelected ? "ring-1 ring-white ring-offset-0 scale-110 z-20" : "hover:border-white/50"
                      )}
                    >
                      {viewMode === 'rgb' && <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4px_4px]" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {viewMode === 'thermal' && (
            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-accent-orange/15 to-transparent skew-x-12 pointer-events-none z-0"
            />
          )}

          {/* Tap hint on mobile */}
          <p className="text-center text-[10px] text-muted font-mono mt-3 lg:hidden">
            TAP A PANEL TO VIEW DIAGNOSTICS
          </p>
        </div>

        {/* ── Detail Panel ─────────────────────────────────────────────── */}
        {/* Desktop: fixed-width sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <AnimatePresence mode="wait">
            {selectedPanel ? (
              <DesktopDetailPanel panel={selectedPanel} borderColor={borderColor} />
            ) : (
              <motion.div key="empty-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center border border-dashed border-white/10 min-h-[300px]"
              >
                <Layers className="text-muted mb-4" size={28} />
                <p className="text-muted text-sm">Select a panel from the grid to view AI diagnostics.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile Bottom Sheet (slides up when a panel is selected) ──── */}
      <AnimatePresence>
        {selectedPanel && (
          <motion.div
            key="mobile-sheet"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="lg:hidden glass-card rounded-2xl p-5 border-t-4"
            style={{ borderTopColor: borderColor }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] font-mono text-muted mb-0.5">PANEL ID</div>
                <div className="text-lg font-display font-bold text-white">
                  SEC4-R{selectedPanel.r}-C{selectedPanel.c}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedPanel.type === 'critical' && <AlertTriangle className="text-danger" size={20} />}
                {selectedPanel.type === 'warning' && <Info className="text-accent-orange" size={20} />}
                {selectedPanel.type === 'normal' && <ShieldCheck className="text-success" size={20} />}
                <button
                  onClick={() => setSelectedPanel(null)}
                  className="p-1 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] font-mono text-muted mb-1">DIAGNOSIS</div>
                <div className={cn("text-sm font-bold",
                  selectedPanel.type === 'critical' ? 'text-danger' :
                  selectedPanel.type === 'warning' ? 'text-accent-orange' : 'text-success'
                )}>
                  {selectedPanel.desc}
                </div>
              </div>
              {selectedPanel.temp && (
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <div className="text-[10px] font-mono text-muted mb-1">THERMAL DELTA</div>
                  <div className="text-2xl font-display text-white">{selectedPanel.temp}</div>
                </div>
              )}
            </div>

            {selectedPanel.type !== 'normal' && (
              <button className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-all text-sm font-bold">
                CREATE WORK ORDER
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopDetailPanel({ panel, borderColor }: { panel: any; borderColor: string }) {
  return (
    <motion.div key="panel-desktop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="glass-card rounded-2xl p-6 h-full border-t-4 min-h-[300px]"
      style={{ borderTopColor: borderColor }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-[10px] font-mono text-muted mb-1">PANEL ID</div>
          <div className="text-lg font-display font-bold text-white">SEC4-R{panel.r}-C{panel.c}</div>
        </div>
        {panel.type === 'critical' && <AlertTriangle className="text-danger flex-shrink-0" size={20} />}
        {panel.type === 'warning' && <Info className="text-accent-orange flex-shrink-0" size={20} />}
        {panel.type === 'normal' && <ShieldCheck className="text-success flex-shrink-0" size={20} />}
      </div>
      <div className="space-y-3">
        <div className="bg-black/30 p-3 rounded-lg border border-white/5">
          <div className="text-[10px] font-mono text-muted mb-1">DIAGNOSIS</div>
          <div className={cn("text-sm font-bold",
            panel.type === 'critical' ? 'text-danger' :
            panel.type === 'warning' ? 'text-accent-orange' : 'text-success'
          )}>
            {panel.desc}
          </div>
        </div>
        {panel.temp && (
          <div className="bg-black/30 p-3 rounded-lg border border-white/5">
            <div className="text-[10px] font-mono text-muted mb-1">THERMAL DELTA</div>
            <div className="text-3xl font-display text-white">{panel.temp}</div>
          </div>
        )}
        {panel.type !== 'normal' && (
          <button className="w-full mt-2 py-2.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-all text-sm font-bold">
            CREATE WORK ORDER
          </button>
        )}
      </div>
    </motion.div>
  );
}
