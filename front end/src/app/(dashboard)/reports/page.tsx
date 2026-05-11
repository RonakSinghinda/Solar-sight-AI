"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Check, RefreshCw, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { reportsApi } from '@/services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data } = await reportsApi.list();
      if (data) {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const handleDownload = (id: string, url?: string) => {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${id}.pdf`;
      a.click();
    }
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Generated Reports</h1>
        <p className="text-muted text-sm">AI-synthesized summaries and exportable documents.</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-accent-cyan" size={32} />
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <FileText size={32} className="mx-auto text-muted mb-4" />
          <p className="text-muted">No reports generated yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[180px] group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <FileText size={20} className="text-muted group-hover:text-accent-cyan transition-colors" />
                  <span className="text-[10px] font-mono text-success">READY</span>
                </div>
                <h3 className="font-bold text-white leading-snug mb-1">
                  Report for Inspection {r.inspection}
                </h3>
                <p className="text-[11px] text-muted font-mono">{new Date(r.generated_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDownload(r.id, r.pdf_file)}
                className={cn("w-full mt-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all",
                  downloading === r.id ? "bg-success/15 text-success border border-success/30" :
                  "bg-white/10 hover:bg-white hover:text-black text-white"
                )}
              >
                {downloading === r.id ? <><Check size={14} />SAVED</> : <><Download size={14} />DOWNLOAD PDF</>}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
