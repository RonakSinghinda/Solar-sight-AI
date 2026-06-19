"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inspectionsApi } from '@/services/api';

interface Inspection {
  id: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  report_url: string | null;
}

export default function ReportsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchReports = async () => {
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
    fetchReports();
    // Poll every 3 seconds for a snappier UI update when processing completes
    const interval = setInterval(fetchReports, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = (id: string, url: string | null) => {
    if (!url) return;
    setDownloading(id);
    window.open(url, '_blank');
    setTimeout(() => setDownloading(null), 2000);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Generated Reports</h1>
        <p className="text-muted text-sm">AI-synthesized summaries and exportable documents.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-accent-cyan">
          <RefreshCw size={16} className="animate-spin" />
          <span className="text-sm font-mono">LOADING REPORTS...</span>
        </div>
      ) : inspections.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
          <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
          <p className="text-white font-medium mb-1">No reports generated yet</p>
          <p className="text-muted text-sm">Upload a dataset in the Dashboard to generate your first AI report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {inspections.map((insp, i) => (
            <motion.div key={insp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={cn("glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[180px] group border transition-all",
                insp.status === 'Pending' ? "border-accent-orange/30 shadow-[0_0_15px_rgba(255,165,0,0.1)]" : "border-white/5"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <FileText size={20} className={cn("transition-colors", insp.status === 'Pending' ? "text-accent-orange" : "text-muted group-hover:text-accent-cyan")} />
                  {insp.status === 'Pending' ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-accent-orange">
                      <RefreshCw size={10} className="animate-spin" /> GENERATING AI REPORT
                    </span>
                  ) : insp.status === 'Failed' ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-danger">
                      <AlertCircle size={10} /> FAILED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-success">READY</span>
                  )}
                </div>
                <h3 className="font-bold text-white leading-snug mb-1 truncate">
                  {insp.status === 'Pending' ? 'Processing Dataset...' : 'Inspection Report'}
                </h3>
                <p className="text-[11px] text-muted font-mono">{formatDateTime(insp.date)}</p>
                <p className="text-[11px] text-muted font-mono mt-1 opacity-50 truncate">ID: {insp.id.split('-')[0]}</p>
              </div>
              <button
                disabled={insp.status !== 'Completed' || downloading === insp.id || !insp.report_url}
                onClick={() => handleDownload(insp.id, insp.report_url)}
                className={cn("w-full mt-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all",
                  downloading === insp.id ? "bg-success/15 text-success border border-success/30" :
                  insp.status === 'Pending' ? "bg-accent-orange/10 text-accent-orange/50 cursor-wait border border-accent-orange/20" :
                  !insp.report_url ? "bg-white/5 text-muted cursor-not-allowed" :
                  "bg-white/10 hover:bg-white hover:text-black text-white"
                )}
              >
                {downloading === insp.id ? <><Check size={14} />OPENED</> : 
                 insp.status === 'Pending' ? <><RefreshCw size={14} className="animate-spin" />AI RUNNING...</> : 
                 <><Download size={14} />DOWNLOAD PDF</>}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
