"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Activity, AlertTriangle, Zap, Thermometer, UploadCloud, Play, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inspectionsApi, api } from '@/services/api';

const data = [
  { time: '08:00', anomalies: 4, efficiency: 98 },
  { time: '10:00', anomalies: 7, efficiency: 96 },
  { time: '12:00', anomalies: 12, efficiency: 92 },
  { time: '14:00', anomalies: 8, efficiency: 95 },
  { time: '16:00', anomalies: 3, efficiency: 98 },
  { time: '18:00', anomalies: 1, efficiency: 99 },
];

interface DashboardSummary {
  total_inspections: number;
  total_faults: number;
  open_faults: number;
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await api.get<DashboardSummary>('/dashboard/summary/');
      if (data) setSummary(data);
    };
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'SYSTEM EFFICIENCY', value: summary ? `${Math.max(0, 100 - summary.total_faults * 0.5).toFixed(1)}%` : '—', icon: Activity, color: 'text-success', border: 'border-success/20' },
    { label: 'OPEN ANOMALIES', value: summary ? String(summary.open_faults) : '—', icon: AlertTriangle, color: 'text-danger', border: 'border-danger/20' },
    { label: 'TOTAL INSPECTIONS', value: summary ? String(summary.total_inspections) : '—', icon: Zap, color: 'text-accent-cyan', border: 'border-accent-cyan/20' },
    { label: 'TOTAL FAULTS', value: summary ? String(summary.total_faults) : '—', icon: Thermometer, color: 'text-accent-orange', border: 'border-accent-orange/20' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleRunModel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    
    // Start visual progress
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + 5;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append('images', file);
      
      // Call backend to create inspection, upload image, and queue celery task
      await inspectionsApi.upload(formData);
      
      // Finish progress bar
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setFile(null);
      }, 1000);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsUploading(false);
      alert('Failed to upload and run model.');
    }
  };

  return (
    <div className="space-y-5 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Central Command</h1>
        <p className="text-muted text-xs md:text-sm">Real-time AI telemetry and automated inspection queue.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={cn("glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden group border", m.border)}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity ${m.color} bg-current`} />
            <m.icon className={cn("w-4 h-4 md:w-5 md:h-5 mb-3 md:mb-4 relative z-10", m.color)} />
            <div className="text-2xl md:text-3xl font-display font-bold text-white mb-1 relative z-10">{m.value}</div>
            <div className="text-[9px] md:text-[10px] font-mono text-muted tracking-widest relative z-10">{m.label}</div>
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
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.zip,.raw"
          />
          <div
            onClick={() => { if (!isUploading && !file) fileInputRef.current?.click(); }}
            className={cn("flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all relative overflow-hidden",
              isUploading ? "border-accent-cyan/50 bg-accent-cyan/5 cursor-default" : 
              file ? "border-accent-cyan/30 bg-white/5 cursor-default" : "border-white/10 hover:border-white/30 hover:bg-white/5 cursor-pointer"
            )}
          >
            {isUploading ? (
              <div className="w-full text-center relative z-10">
                <Activity size={40} className="mx-auto text-accent-cyan mb-3 animate-pulse" />
                <div className="font-mono text-xs text-white mb-3">AI MODEL RUNNING...</div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                  <motion.div className="h-full bg-accent-cyan" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                </div>
                <div className="text-[10px] text-muted mt-2 font-mono">{uploadProgress}% COMPLETE</div>
              </div>
            ) : uploadSuccess ? (
              <div className="text-center relative z-10">
                <CheckCircle2 size={40} className="mx-auto text-success mb-3" />
                <p className="text-sm font-medium text-white mb-1">Model Queued Successfully!</p>
                <p className="text-xs text-muted">The report will appear in Reports soon.</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setUploadSuccess(false); }}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
                >
                  Upload Another
                </button>
              </div>
            ) : file ? (
              <div className="text-center w-full relative z-10">
                <UploadCloud size={32} className="mx-auto text-accent-cyan mb-3" />
                <p className="text-sm font-medium text-white mb-1 truncate px-4">{file.name}</p>
                <p className="text-xs text-muted mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRunModel}
                    className="px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/90 text-black rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <Play size={14} className="fill-black" /> Run AI Model
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <UploadCloud size={40} className="mx-auto text-muted mb-3" />
                <p className="text-sm font-medium text-white mb-1">Click to Upload Image</p>
                <p className="text-xs text-muted">Supports RGB & Thermal (.jpg, .png)</p>
              </div>
            )}
            
            {isUploading && (
              <motion.div animate={{ y: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-accent-cyan/40 blur-sm z-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
