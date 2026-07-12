"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, AlertTriangle, ShieldCheck, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inspectionsApi, reportsApi } from '@/services/api';

interface Fault {
  id: string;
  fault_type: string;
  confidence: number;
  bounding_box: number[];
  status: string;
  detected_at: string;
}

interface InspectionImage {
  id: string;
  file: string;
  is_processed: boolean;
  gps_lat: number | null;
  gps_lon: number | null;
  faults: Fault[];
}

interface Inspection {
  id: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  images: InspectionImage[];
  report_url: string | null;
}

const FAULT_COLORS: Record<string, string> = {
  Hotspot: 'text-danger',
  'Micro-crack': 'text-accent-orange',
  Soiling: 'text-accent-cyan',
};

const FAULT_BG: Record<string, string> = {
  Hotspot: 'bg-danger/10 border-danger/20',
  'Micro-crack': 'bg-accent-orange/10 border-accent-orange/20',
  Soiling: 'bg-accent-cyan/10 border-accent-cyan/20',
};

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [selectedImage, setSelectedImage] = useState<InspectionImage | null>(null);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const data = await inspectionsApi.get(params.id) as Inspection;
        if (data) {
          setInspection(data);
          if (data.images.length > 0) setSelectedImage(data.images[0]);
        }
      } catch (err) {
        console.error('Failed to fetch inspection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
    // Poll while Pending
    const interval = setInterval(async () => {
      const data = await inspectionsApi.get(params.id) as Inspection;
      if (data) {
        setInspection(data);
        if (data.images.length > 0 && !selectedImage) setSelectedImage(data.images[0]);
        if (data.status !== 'Pending') clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [params.id]);

  const handleGeneratePdf = async () => {
    if (!inspection) return;

    // If report already exists, open it
    if (inspection.report_url) {
      window.open(inspection.report_url, '_blank');
      return;
    }

    setGeneratingPdf(true);
    try {
      const result = await reportsApi.generate(params.id) as { url?: string };
      if (result?.url) {
        window.open(result.url, '_blank');
        // Refresh to get updated report_url
        const updated = await inspectionsApi.get(params.id) as Inspection;
        if (updated) setInspection(updated);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const allFaults = inspection?.images.flatMap(img => img.faults) ?? [];
  const totalFaults = allFaults.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-accent-cyan">
        <RefreshCw size={20} className="animate-spin" />
        <span className="font-mono text-sm">LOADING INSPECTION...</span>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center border border-white/5">
        <FileText size={48} className="mx-auto text-muted mb-4 opacity-40" />
        <p className="text-white font-semibold mb-1">Inspection not found</p>
        <Link href="/inspections">
          <button className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white hover:text-black transition-colors">
            ← Back to Inspections
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Link href="/inspections">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><ArrowLeft size={18} /></button>
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-white">
              {inspection.id.split('-')[0].toUpperCase()}...{inspection.id.split('-').pop()?.toUpperCase()} — Full Analysis
            </h1>
            <p className="text-[10px] text-muted font-mono tracking-widest">
              {inspection.status === 'Pending' ? 'AI PROCESSING...' : `${inspection.status.toUpperCase()}: ${new Date(inspection.date).toLocaleString()}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleGeneratePdf}
          disabled={inspection.status !== 'Completed' || generatingPdf}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all",
            inspection.status !== 'Completed'
              ? "bg-white/5 text-muted cursor-not-allowed"
              : "bg-accent-cyan text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          )}
        >
          {generatingPdf ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
          {generatingPdf ? 'GENERATING...' : inspection.report_url ? 'OPEN PDF' : 'GENERATE PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Image + Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image viewer */}
          <div className="glass-card rounded-2xl p-1 overflow-hidden">
            <div className="relative w-full aspect-video bg-black/60 rounded-xl overflow-hidden flex items-center justify-center">
              {selectedImage?.file ? (
                <img
                  src={selectedImage.file}
                  alt="Inspection image"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted">
                  <ImageIcon size={40} className="opacity-30" />
                  <span className="text-sm">No image available</span>
                </div>
              )}
              {inspection.status === 'Pending' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={32} className="text-accent-cyan animate-spin" />
                  <span className="text-accent-cyan font-mono text-sm">AI PROCESSING IMAGE...</span>
                </div>
              )}
            </div>
          </div>

          {/* Image thumbnails */}
          {inspection.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {inspection.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage?.id === img.id ? "border-accent-cyan" : "border-white/10 opacity-60 hover:opacity-100"
                  )}
                >
                  {img.file ? (
                    <img src={img.file} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <ImageIcon size={16} className="text-muted" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Summary stats */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-display font-semibold mb-3 text-white">AI Diagnostic Summary</h3>
            <p className="text-muted text-sm leading-relaxed mb-5">
              {totalFaults === 0
                ? 'No anomalies detected. All panels appear to be operating within normal parameters.'
                : `AI analysis detected ${totalFaults} fault${totalFaults > 1 ? 's' : ''} across ${inspection.images.length} image${inspection.images.length > 1 ? 's' : ''}. Review the anomaly log for details.`}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'TOTAL IMAGES', value: String(inspection.images.length), color: 'text-white' },
                { label: 'FAULTS FOUND', value: String(totalFaults), color: totalFaults > 0 ? 'text-danger' : 'text-success' },
                { label: 'STATUS', value: inspection.status.toUpperCase(), color: inspection.status === 'Completed' ? 'text-success' : inspection.status === 'Failed' ? 'text-danger' : 'text-accent-cyan' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[10px] font-mono text-muted mb-1">{label}</div>
                  <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Anomaly log */}
        <div className="glass-card rounded-2xl p-5 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white">Anomaly Log</h3>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded",
              totalFaults > 0 ? "bg-danger/20 text-danger" : "bg-success/20 text-success"
            )}>
              {totalFaults > 0 ? `${totalFaults} FAULT${totalFaults > 1 ? 'S' : ''}` : 'ALL CLEAR'}
            </span>
          </div>

          {inspection.status === 'Pending' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted">
              <RefreshCw size={24} className="text-accent-cyan animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          ) : allFaults.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted">
              <ShieldCheck size={32} className="text-success opacity-60" />
              <span className="text-sm text-center">No faults detected in this inspection.</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {allFaults.map((fault, i) => (
                <motion.div key={fault.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className={cn("p-3 rounded-xl border cursor-pointer transition-all hover:border-white/20",
                    i === 0 ? `${FAULT_BG[fault.fault_type] || 'bg-white/10 border-white/10'}` : "bg-white/5 border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className={cn("flex items-center gap-1.5 text-xs font-bold", FAULT_COLORS[fault.fault_type] || 'text-white')}>
                      <AlertTriangle size={12} />
                      {fault.fault_type}
                    </div>
                    <span className="text-[10px] font-mono text-muted">{Math.round(fault.confidence * 100)}%</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Confidence: {Math.round(fault.confidence * 100)}% • Status: {fault.status}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
