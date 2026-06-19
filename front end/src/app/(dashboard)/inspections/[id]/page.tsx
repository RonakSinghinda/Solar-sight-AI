"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Crosshair, Maximize2, Download, AlertTriangle } from 'lucide-react';

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Link href="/inspections">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><ArrowLeft size={18} /></button>
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-white">{params.id} — Full Analysis</h1>
            <p className="text-[10px] text-muted font-mono tracking-widest">COMPLETED: 2026-05-11 14:30Z</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent-cyan text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
          <Download size={14} /> GENERATE PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-1 overflow-hidden">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                className="absolute top-[38%] left-[58%] w-28 h-28 border-2 border-danger rounded-lg flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(255,0,60,0.6)' }}
              >
                <div className="absolute -top-6 left-0 bg-danger text-white text-[9px] font-mono px-2 py-0.5 rounded whitespace-nowrap">HOTSPOT (99.8%)</div>
                <Crosshair className="text-danger animate-pulse" size={40} />
              </motion.div>
              <button className="absolute bottom-3 right-3 p-1.5 bg-black/50 backdrop-blur border border-white/20 rounded hover:bg-white/20 transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-display font-semibold mb-3 text-white">AI Diagnostic Summary</h3>
            <p className="text-muted text-sm leading-relaxed mb-5">
              Neural network analysis completed across 4,200 panels in Sector 4. Detected 12 critical thermal anomalies indicating potential diode failures or severe string disconnections. Immediate dispatch recommended.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'CONFIDENCE', value: '99.8%', color: 'text-accent-cyan' },
                { label: 'AFFECTED CAPACITY', value: '−2.4 MW', color: 'text-danger' },
                { label: 'EST. REPAIR', value: '4.5 Hrs', color: 'text-white' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[10px] font-mono text-muted mb-1">{label}</div>
                  <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white">Anomaly Log</h3>
            <span className="text-[10px] font-bold bg-danger/20 text-danger px-2 py-0.5 rounded">12 CRITICAL</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-white/10 border-danger' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <AlertTriangle size={12} className={i === 0 ? 'text-danger' : 'text-accent-orange'} />
                    Diode Failure {i + 1}
                  </div>
                  <span className="text-[10px] font-mono text-muted">R{i + 2}-C5</span>
                </div>
                <p className="text-[11px] text-muted">Thermal delta +14°C above nominal</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
