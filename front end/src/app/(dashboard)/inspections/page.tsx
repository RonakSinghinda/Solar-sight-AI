"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, Download, AlertTriangle, ShieldCheck, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const inspections = [
  { id: 'INS-2026-054', date: '2026-05-11', site: 'Sector 4 Array', duration: '2h 15m', anomalies: 12, status: 'Critical' },
  { id: 'INS-2026-053', date: '2026-05-10', site: 'Sector 2 Array', duration: '1h 45m', anomalies: 3, status: 'Warning' },
  { id: 'INS-2026-052', date: '2026-05-08', site: 'Sector 1 Array', duration: '2h 30m', anomalies: 0, status: 'Clear' },
  { id: 'INS-2026-051', date: '2026-05-05', site: 'Sector 5 Array', duration: '3h 10m', anomalies: 24, status: 'Critical' },
  { id: 'INS-2026-050', date: '2026-05-01', site: 'Sector 3 Array', duration: '1h 50m', anomalies: 1, status: 'Warning' },
];

export default function InspectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4 rounded-2xl">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Inspection History</h1>
          <p className="text-[10px] text-muted font-mono tracking-widest">ARCHIVE & ANALYSIS</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-sm hover:bg-white/5 transition-colors">
            <Filter size={14} /><span>Filter</span><ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm hover:bg-white hover:text-black transition-colors">
            <Download size={14} /><span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono text-muted tracking-widest">
              {['INSPECTION ID', 'DATE', 'SITE', 'DURATION', 'ANOMALIES', 'STATUS', ''].map(h => (
                <th key={h} className="p-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inspections.map((ins, i) => (
              <motion.tr key={ins.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <td className="p-4 font-mono text-white text-sm">{ins.id}</td>
                <td className="p-4 text-muted text-sm">{ins.date}</td>
                <td className="p-4 text-white text-sm">{ins.site}</td>
                <td className="p-4 text-muted text-sm">
                  <span className="flex items-center gap-1.5"><Clock size={12} />{ins.duration}</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 text-xs font-bold">{ins.anomalies}</span>
                </td>
                <td className="p-4">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    ins.status === 'Critical' ? "bg-danger/10 text-danger border-danger/20" :
                    ins.status === 'Warning' ? "bg-accent-orange/10 text-accent-orange border-accent-orange/20" :
                    "bg-success/10 text-success border-success/20"
                  )}>
                    {ins.status === 'Clear' ? <ShieldCheck size={10} /> : <AlertTriangle size={10} />}
                    {ins.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/inspections/${ins.id}`}>
                    <button className="px-3 py-1 rounded border border-white/10 text-xs hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
                      VIEW →
                    </button>
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-[11px] text-muted font-mono px-2">
        <span>SHOWING 1–5 OF 142 RECORDS</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/10 transition-colors">← PREV</button>
          <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/10 transition-colors">NEXT →</button>
        </div>
      </div>
    </div>
  );
}
