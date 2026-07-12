"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, Download, AlertTriangle, ShieldCheck, Clock, ChevronDown, RefreshCw, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inspectionsApi } from '@/services/api';

interface Fault {
  id: string;
  fault_type: string;
  confidence: number;
}

interface InspectionImage {
  id: string;
  is_processed: boolean;
  faults: Fault[];
}

interface Inspection {
  id: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  images: InspectionImage[];
  report_url: string | null;
}

function getStatusLabel(inspection: Inspection): 'Critical' | 'Warning' | 'Clear' | 'Pending' | 'Failed' {
  if (inspection.status === 'Pending') return 'Pending';
  if (inspection.status === 'Failed') return 'Failed';
  const totalFaults = inspection.images.reduce((sum, img) => sum + img.faults.length, 0);
  if (totalFaults === 0) return 'Clear';
  if (totalFaults >= 5) return 'Critical';
  return 'Warning';
}

function countFaults(inspection: Inspection): number {
  return inspection.images.reduce((sum, img) => sum + img.faults.length, 0);
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function StatusBadge({ label }: { label: ReturnType<typeof getStatusLabel> }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
      label === 'Critical' ? "bg-danger/10 text-danger border-danger/20" :
      label === 'Warning'  ? "bg-accent-orange/10 text-accent-orange border-accent-orange/20" :
      label === 'Pending'  ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" :
      label === 'Failed'   ? "bg-danger/10 text-danger border-danger/20" :
      "bg-success/10 text-success border-success/20"
    )}>
      {label === 'Pending' ? (
        <RefreshCw size={10} className="animate-spin" />
      ) : label === 'Clear' ? (
        <ShieldCheck size={10} />
      ) : (
        <AlertTriangle size={10} />
      )}
      {label}
    </span>
  );
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    try {
      const data = await inspectionsApi.list() as Inspection[];
      if (data) setInspections(data);
    } catch (err) {
      console.error('Failed to fetch inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
    const interval = setInterval(fetchInspections, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center glass-card p-3 md:p-4 rounded-2xl">
        <div>
          <h1 className="text-lg md:text-xl font-display font-bold text-white">Inspection History</h1>
          <p className="text-[10px] text-muted font-mono tracking-widest">ARCHIVE & ANALYSIS</p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-xs md:text-sm hover:bg-white/5 transition-colors">
            <Filter size={13} /><span className="hidden sm:inline">Filter</span><ChevronDown size={11} />
          </button>
          <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-xs md:text-sm hover:bg-white hover:text-black transition-colors">
            <Download size={13} /><span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-12 flex items-center justify-center gap-3 text-accent-cyan">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm font-mono">LOADING INSPECTIONS...</span>
        </div>
      ) : inspections.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 md:p-16 text-center border border-white/5">
          <FileText size={48} className="mx-auto text-muted mb-4 opacity-40" />
          <p className="text-white font-semibold mb-1">No inspections yet</p>
          <p className="text-muted text-sm">Upload solar panel images from the Dashboard to start your first inspection.</p>
        </div>
      ) : (
        <>
          {/* ── Desktop Table (md and above) ───────────────────────────────── */}
          <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono text-muted tracking-widest">
                  {['INSPECTION ID', 'DATE', 'IMAGES', 'ANOMALIES', 'STATUS', ''].map(h => (
                    <th key={h} className="p-4 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inspections.map((ins, i) => {
                  const statusLabel = getStatusLabel(ins);
                  const faultCount = countFaults(ins);
                  return (
                    <motion.tr key={ins.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 font-mono text-white text-sm">
                        {ins.id.split('-')[0].toUpperCase()}...{ins.id.split('-').pop()?.toUpperCase()}
                      </td>
                      <td className="p-4 text-muted text-sm">
                        <span className="flex items-center gap-1.5"><Clock size={12} />{formatDate(ins.date)}</span>
                      </td>
                      <td className="p-4 text-muted text-sm">{ins.images.length}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 text-xs font-bold">
                          {faultCount}
                        </span>
                      </td>
                      <td className="p-4"><StatusBadge label={statusLabel} /></td>
                      <td className="p-4 text-right">
                        <Link href={`/inspections/${ins.id}`}>
                          <button className="px-3 py-1 rounded border border-white/10 text-xs hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
                            VIEW →
                          </button>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card List (below md) ─────────────────────────────────── */}
          <div className="space-y-3 md:hidden">
            {inspections.map((ins, i) => {
              const statusLabel = getStatusLabel(ins);
              const faultCount = countFaults(ins);
              return (
                <motion.div key={ins.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/inspections/${ins.id}`}>
                    <div className="glass-card rounded-2xl p-4 border border-white/5 flex items-center gap-4 active:bg-white/5 transition-colors">
                      {/* Status dot */}
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        statusLabel === 'Critical' ? "bg-danger shadow-[0_0_6px_rgba(255,0,60,0.8)]" :
                        statusLabel === 'Warning'  ? "bg-accent-orange shadow-[0_0_6px_rgba(255,95,0,0.6)]" :
                        statusLabel === 'Pending'  ? "bg-accent-cyan animate-pulse" :
                        statusLabel === 'Failed'   ? "bg-danger" :
                        "bg-success shadow-[0_0_6px_rgba(0,255,120,0.5)]"
                      )} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-white text-xs font-bold truncate">
                            {ins.id.split('-')[0].toUpperCase()}...{ins.id.split('-').pop()?.toUpperCase()}
                          </span>
                          <StatusBadge label={statusLabel} />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted">
                          <span className="flex items-center gap-1"><Clock size={10} />{formatDate(ins.date)}</span>
                          <span>{ins.images.length} image{ins.images.length !== 1 ? 's' : ''}</span>
                          <span className={cn("font-bold", faultCount > 0 ? "text-danger" : "text-success")}>
                            {faultCount} fault{faultCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight size={16} className="text-muted flex-shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[11px] text-muted font-mono px-2">
            <span>SHOWING {inspections.length} RECORD{inspections.length !== 1 ? 'S' : ''}</span>
          </div>
        </>
      )}
    </div>
  );
}
