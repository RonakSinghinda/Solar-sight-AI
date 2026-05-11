"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Activity, AlertTriangle, Zap, Thermometer, UploadCloud, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboardApi, inspectionsApi } from '@/services/api';

const data = [
  { time: '08:00', anomalies: 4, efficiency: 98 },
  { time: '10:00', anomalies: 7, efficiency: 96 },
  { time: '12:00', anomalies: 12, efficiency: 92 },
  { time: '14:00', anomalies: 8, efficiency: 95 },
  { time: '16:00', anomalies: 3, efficiency: 98 },
  { time: '18:00', anomalies: 1, efficiency: 99 },
];

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    total_inspections: 0,
    total_faults: 0,
    open_faults: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const { data } = await dashboardApi.summary();
      if (data) {
        setMetrics(data);
      }
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data } = await inspectionsApi.create(fileArray);
      if (data) {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1500);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setIsUploading(false);
    }
  };

  const metricItems = [
    { label: 'SYSTEM EFFICIENCY', value: '98.4%', icon: Activity, color: 'text-success', border: 'border-success/20' },
    { label: 'ACTIVE ANOMALIES', value: metrics.open_faults.toString(), icon: AlertTriangle, color: 'text-danger', border: 'border-danger/20' },
    { label: 'TOTAL INSPECTIONS', value: metrics.total_inspections.toString(), icon: Zap, color: 'text-accent-cyan', border: 'border-accent-cyan/20' },
    { label: 'TOTAL FAULTS', value: metrics.total_faults.toString(), icon: Thermometer, color: 'text-accent-orange', border: 'border-accent-orange/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Central Command</h1>
        <p className="text-muted text-sm">Real-time AI telemetry and automated inspection queue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {metricItems.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={cn("glass-card p-6 rounded-2xl relative overflow-hidden group border", m.border)}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity ${m.color} bg-current`} />
            <m.icon className={cn("w-5 h-5 mb-4 relative z-10", m.color)} />
            <div className="text-3xl font-display font-bold text-white mb-1 relative z-10">
              {loading ? <Loader className="animate-spin" size={24} /> : m.value}
            </div>
            <div className="text-[10px] font-mono text-muted tracking-widest relative z-10">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-white">Detection Analytics</h3>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-danger rounded-full" />Anomalies</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-accent-cyan rounded-full" />Efficiency</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gAnomaly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF003C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF003C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="efficiency" stroke="#00F0FF" strokeWidth={2} fill="url(#gEfficiency)" />
                <Area type="monotone" dataKey="anomalies" stroke="#FF003C" strokeWidth={2} fill="url(#gAnomaly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-display font-semibold text-white mb-4">Process Dataset</h3>
          <div
            onClick={() => !isUploading && document.getElementById('file-input')?.click()}
            className={cn("flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer relative overflow-hidden transition-all",
              isUploading ? "border-accent-cyan/50 bg-accent-cyan/5" : "border-white/10 hover:border-white/30 hover:bg-white/5"
            )}
          >
            {isUploading ? (
              <div className="w-full text-center relative z-10">
                <Activity size={40} className="mx-auto text-accent-cyan mb-3 animate-pulse" />
                <div className="font-mono text-xs text-white mb-3">AI PROCESSING DATASET</div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                  <motion.div className="h-full bg-accent-cyan" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                </div>
                <div className="text-[10px] text-muted mt-2 font-mono">{uploadProgress}% COMPLETE</div>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud size={40} className="mx-auto text-muted mb-3" />
                <p className="text-sm font-medium text-white mb-1">Drop Flight Logs</p>
                <p className="text-xs text-muted">Supports RGB & Thermal (.zip, .raw)</p>
              </div>
            )}
            {isUploading && (
              <motion.div animate={{ y: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-accent-cyan/40 blur-sm z-0"
              />
            )}
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*,.zip,.raw"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
