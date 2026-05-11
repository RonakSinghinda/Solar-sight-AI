"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, Download, AlertTriangle, ShieldCheck, Clock, ChevronDown, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inspectionsApi } from '@/services/api';

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true);
      const { data, error: apiError } = await inspectionsApi.list();
      if (apiError) {
        setError(apiError);
      } else if (data) {
        setInspections(data);
      }
      setLoading(false);
    };

    fetchInspections();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', icon: ShieldCheck };
      case 'Failed':
        return { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/20', icon: AlertTriangle };
      default:
        return { bg: 'bg-accent-orange/10', text: 'text-accent-orange', border: 'border-accent-orange/20', icon: Clock };
    }
  };

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

      {error && (
        <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono text-muted tracking-widest">
              {['INSPECTION ID', 'DATE', 'STATUS', 'IMAGES', ''].map(h => (
                <th key={h} className="p-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <Loader className="animate-spin mx-auto mb-2 text-accent-cyan" size={24} />
                  <p className="text-muted text-sm">Loading inspections...</p>
                </td>
              </tr>
            ) : inspections.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">No inspections found</td>
              </tr>
            ) : (
              inspections.map((ins, i) => {
                const badge = getStatusBadge(ins.status);
                const StatusIcon = badge.icon;
                return (
                  <motion.tr key={ins.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4 font-mono text-white text-sm">{ins.id.substring(0, 8)}</td>
                    <td className="p-4 text-muted text-sm">{new Date(ins.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", badge.bg, badge.text, badge.border)}>
                        <StatusIcon size={10} />
                        {ins.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted text-sm">{ins.images?.length || 0} files</td>
                    <td className="p-4 text-right">
                      <Link href={`/inspections/${ins.id}`}>
                        <button className="px-3 py-1 rounded border border-white/10 text-xs hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
                          VIEW →
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && inspections.length > 0 && (
        <div className="flex justify-between items-center text-[11px] text-muted font-mono px-2">
          <span>SHOWING 1–{inspections.length} OF {inspections.length} RECORDS</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/10 transition-colors">← PREV</button>
            <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/10 transition-colors">NEXT →</button>
          </div>
        </div>
      )}
    </div>
  );
}
