"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Crosshair, Maximize2, Download, AlertTriangle, Loader } from 'lucide-react';
import { inspectionsApi, faultsApi, reportsApi } from '@/services/api';

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  const [inspection, setInspection] = useState<any>(null);
  const [faults, setFaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: inspectionData } = await inspectionsApi.get(params.id);
      if (inspectionData) {
        setInspection(inspectionData);
        const { data: faultsData } = await faultsApi.listByInspection(params.id);
        if (faultsData) {
          setFaults(faultsData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  const handleGenerateReport = async () => {
    const { data } = await reportsApi.generate(params.id);
    if (data && data.url) {
      const a = document.createElement('a');
      a.href = data.url;
      a.download = `inspection-${params.id}.pdf`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-accent-cyan" size={32} />
      </div>
    );
  }

  if (!inspection) {
    return <div className="text-muted text-center py-12">Inspection not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Link href="/inspections">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><ArrowLeft size={18} /></button>
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-white">{params.id.substring(0, 8)} — Full Analysis</h1>
            <p className="text-[10px] text-muted font-mono tracking-widest">COMPLETED: {new Date(inspection.date).toLocaleString()}</p>
          </div>
        </div>
        <button onClick={handleGenerateReport} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent-cyan text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
          <Download size={14} /> GENERATE PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {inspection.images && inspection.images.length > 0 && (
            <div className="glass-card rounded-2xl p-1 overflow-hidden">
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                <img 
                  src={inspection.images[0].file} 
                  alt="Inspection"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {faults.length > 0 && faults[0] && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute top-[38%] left-[58%] w-28 h-28 border-2 border-danger rounded-lg flex items-center justify-center"
                    style={{ boxShadow: '0 0 20px rgba(255,0,60,0.6)' }}
                  >
                    <div className="absolute -top-6 left-0 bg-danger text-white text-[9px] font-mono px-2 py-0.5 rounded whitespace-nowrap">{faults[0].fault_type}</div>
                    <Crosshair className="text-danger animate-pulse" size={40} />
                  </motion.div>
                )}
                <button className="absolute bottom-3 right-3 p-1.5 bg-black/50 backdrop-blur border border-white/20 rounded hover:bg-white/20 transition-colors">
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-display font-semibold mb-3 text-white">AI Diagnostic Summary</h3>
            <p className="text-muted text-sm leading-relaxed mb-5">
              Neural network analysis completed across {inspection.images?.length || 0} images. Detected {faults.length} anomalies requiring attention.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'STATUS', value: inspection.status, color: 'text-accent-cyan' },
                { label: 'FAULTS FOUND', value: faults.length, color: inspection.status === 'Completed' ? 'text-danger' : 'text-white' },
                { label: 'IMAGES', value: inspection.images?.length || 0, color: 'text-white' },
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
            <h3 className="font-display font-semibold text-white">Fault Log</h3>
            <span className="text-[10px] font-bold bg-danger/20 text-danger px-2 py-0.5 rounded">{faults.length} FAULTS</span>
          </div>
          {faults.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted text-sm">No faults detected</div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {faults.slice(0, 6).map((fault, i) => (
                <motion.div key={fault.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-white/10 border-danger' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <AlertTriangle size={12} className={fault.confidence > 0.8 ? 'text-danger' : 'text-accent-orange'} />
                      {fault.fault_type}
                    </div>
                    <span className="text-[10px] font-mono text-muted">{(fault.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-[11px] text-muted">Confidence: {(fault.confidence * 100).toFixed(1)}%</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
