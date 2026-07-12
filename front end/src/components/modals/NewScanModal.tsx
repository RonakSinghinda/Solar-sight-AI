"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Upload, Flame, Eye, Layers,
  AlertTriangle, Clock, Zap, MapPin, FileText, CheckCircle,
  Image as ImageIcon, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NewScanModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Step 1: Site & Scan Type ────────────────────────────────────────────────
const PRESET_SITES = ['Alpha Array', 'Beta Array', 'Sector 4', 'Delta Farm', 'North Yard'];

const SCAN_TYPES = [
  {
    id: 'Thermal AI',
    label: 'Thermal AI',
    description: 'Infrared fault detection — hotspots, diode failures, string disconnects',
    icon: Flame,
    color: 'text-accent-orange',
    border: 'border-accent-orange/30',
    bg: 'bg-accent-orange/10',
    activeBg: 'bg-accent-orange/20',
  },
  {
    id: 'RGB Visual',
    label: 'RGB Visual',
    description: 'Visible-spectrum inspection — soiling, physical damage, bird droppings',
    icon: Eye,
    color: 'text-accent-cyan',
    border: 'border-accent-cyan/30',
    bg: 'bg-accent-cyan/10',
    activeBg: 'bg-accent-cyan/20',
  },
  {
    id: 'Both',
    label: 'Both',
    description: 'Full dual-spectrum analysis — maximum fault coverage and confidence',
    icon: Layers,
    color: 'text-success',
    border: 'border-success/30',
    bg: 'bg-success/10',
    activeBg: 'bg-success/20',
  },
];

// ── Step 2: Priority & Notes ────────────────────────────────────────────────
const PRIORITIES = [
  {
    id: 'Routine',
    label: 'Routine',
    description: 'Standard inspection — processed in queue order',
    icon: Clock,
    color: 'text-success',
    border: 'border-success/30',
    activeBg: 'bg-success/15',
  },
  {
    id: 'Urgent',
    label: 'Urgent',
    description: 'Elevated priority — potential performance impact detected',
    icon: AlertTriangle,
    color: 'text-accent-orange',
    border: 'border-accent-orange/30',
    activeBg: 'bg-accent-orange/15',
  },
  {
    id: 'Emergency',
    label: 'Emergency',
    description: 'Critical — immediate safety hazard or complete string failure',
    icon: Zap,
    color: 'text-danger',
    border: 'border-danger/30',
    activeBg: 'bg-danger/15',
  },
];

// ── Progress indicator ──────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ['Site & Type', 'Priority', 'Upload', 'Review'];
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              i < current
                ? "bg-accent-cyan text-black"
                : i === current
                  ? "bg-accent-cyan/20 border border-accent-cyan text-accent-cyan"
                  : "bg-white/5 border border-white/10 text-muted"
            )}>
              {i < current ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={cn(
              "text-[9px] font-mono mt-1 tracking-wider transition-colors",
              i === current ? "text-accent-cyan" : "text-muted"
            )}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div className={cn(
              "h-px flex-1 mx-2 mb-4 transition-colors duration-300",
              i < current ? "bg-accent-cyan/50" : "bg-white/10"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────
export function NewScanModal({ open, onClose }: NewScanModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Form state
  const [siteName, setSiteName] = useState('');
  const [customSite, setCustomSite] = useState('');
  const [scanType, setScanType] = useState('Thermal AI');
  const [priority, setPriority] = useState('Routine');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const effectiveSite = siteName === '__custom__' ? customSite : siteName;

  const reset = () => {
    setStep(0);
    setSiteName('');
    setCustomSite('');
    setScanType('Thermal AI');
    setPriority('Routine');
    setNotes('');
    setFiles([]);
    setSubmitting(false);
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f =>
      f.type.startsWith('image/')
    );
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...valid.filter(f => !existing.has(f.name))];
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const canNext = () => {
    if (step === 0) return effectiveSite.trim().length > 0 && scanType;
    if (step === 1) return !!priority;
    if (step === 2) return files.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      const formData = new FormData();
      formData.append('site_name', effectiveSite);
      formData.append('scan_type', scanType);
      formData.append('priority', priority);
      formData.append('notes', notes);
      files.forEach(f => formData.append('images', f));

      const res = await fetch(`${API_BASE}/inspections/`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSubmitted(true);

      setTimeout(() => {
        handleClose();
        router.push(data.id ? `/inspections/${data.id}` : '/inspections');
      }, 1800);
    } catch (err) {
      console.error('Scan submission failed:', err);
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-xl bg-surface/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white">New Inspection Scan</h2>
                    <p className="text-xs text-muted mt-0.5">Create a UAV work order and queue AI analysis</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-muted hover:text-white transition-colors rounded-xl hover:bg-white/5"
                  >
                    <X size={18} />
                  </button>
                </div>
                <StepIndicator current={step} total={4} />
              </div>

              {/* Step content */}
              <div className="p-6 min-h-[320px]">
                <AnimatePresence mode="wait">

                  {/* ── STEP 0: Site & Type ─────────────────────────────── */}
                  {step === 0 && (
                    <motion.div key="step0"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-[10px] font-mono text-muted mb-3 tracking-widest">
                          SELECT SITE / SOLAR FARM
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {PRESET_SITES.map(s => (
                            <button
                              key={s}
                              onClick={() => { setSiteName(s); setCustomSite(''); }}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                siteName === s
                                  ? "bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan"
                                  : "border-white/10 text-muted hover:text-white hover:border-white/20"
                              )}
                            >
                              <MapPin size={10} /> {s}
                            </button>
                          ))}
                          <button
                            onClick={() => setSiteName('__custom__')}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                              siteName === '__custom__'
                                ? "bg-white/10 border-white/30 text-white"
                                : "border-white/10 text-muted hover:text-white"
                            )}
                          >
                            + Custom
                          </button>
                        </div>
                        {siteName === '__custom__' && (
                          <input
                            autoFocus
                            value={customSite}
                            onChange={e => setCustomSite(e.target.value)}
                            placeholder="Enter site name..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-muted mb-3 tracking-widest">
                          SCAN TYPE
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {SCAN_TYPES.map(t => {
                            const Icon = t.icon;
                            const active = scanType === t.id;
                            return (
                              <button
                                key={t.id}
                                onClick={() => setScanType(t.id)}
                                className={cn(
                                  "flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all",
                                  active
                                    ? `${t.activeBg} ${t.border}`
                                    : "border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10"
                                )}
                              >
                                <Icon size={22} className={active ? t.color : "text-muted"} />
                                <span className={cn("text-xs font-bold", active ? t.color : "text-muted")}>
                                  {t.label}
                                </span>
                                <span className="text-[9px] text-muted leading-tight hidden sm:block">
                                  {t.description.split('—')[0].trim()}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 1: Priority & Notes ─────────────────────────── */}
                  {step === 1 && (
                    <motion.div key="step1"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-[10px] font-mono text-muted mb-3 tracking-widest">
                          INSPECTION PRIORITY
                        </label>
                        <div className="space-y-2">
                          {PRIORITIES.map(p => {
                            const Icon = p.icon;
                            const active = priority === p.id;
                            return (
                              <button
                                key={p.id}
                                onClick={() => setPriority(p.id)}
                                className={cn(
                                  "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all",
                                  active
                                    ? `${p.activeBg} ${p.border}`
                                    : "border-white/5 hover:bg-white/5 hover:border-white/10"
                                )}
                              >
                                <Icon size={18} className={active ? p.color : "text-muted"} />
                                <div>
                                  <div className={cn("text-sm font-bold", active ? p.color : "text-white")}>
                                    {p.label}
                                  </div>
                                  <div className="text-xs text-muted">{p.description}</div>
                                </div>
                                {active && (
                                  <CheckCircle size={16} className={cn("ml-auto flex-shrink-0", p.color)} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">
                          NOTES / FIELD OBSERVATIONS (OPTIONAL)
                        </label>
                        <textarea
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="e.g. String 3 in Row 4 showing thermal anomaly — confirm via IR scan"
                          rows={3}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent-cyan/50 transition-colors resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Upload Images ──────────────────────────────── */}
                  {step === 2 && (
                    <motion.div key="step2"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-mono text-muted mb-3 tracking-widest">
                          UPLOAD UAV IMAGES ({files.length} selected)
                        </label>

                        {/* Drop zone */}
                        <div
                          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                            dragOver
                              ? "border-accent-cyan/70 bg-accent-cyan/5"
                              : "border-white/10 hover:border-white/20 hover:bg-white/3"
                          )}
                        >
                          <Upload size={28} className={cn("mx-auto mb-3", dragOver ? "text-accent-cyan" : "text-muted")} />
                          <p className="text-sm font-medium text-white mb-1">
                            {dragOver ? 'Drop images here' : 'Drag & drop UAV images'}
                          </p>
                          <p className="text-xs text-muted">or click to browse — JPG, PNG supported</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFiles(e.target.files)}
                          />
                        </div>
                      </div>

                      {/* File previews */}
                      {files.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {files.map((f, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden bg-black/40 border border-white/5 aspect-video flex items-center justify-center">
                              <img
                                src={URL.createObjectURL(f)}
                                alt={f.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={e => { e.stopPropagation(); removeFile(i); }}
                                  className="p-1 bg-danger/80 rounded-full text-white"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <span className="absolute bottom-0 left-0 right-0 text-[9px] text-white bg-black/60 px-1.5 py-0.5 truncate">
                                {f.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── STEP 3: Review & Submit ───────────────────────────── */}
                  {step === 3 && (
                    <motion.div key="step3"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {submitted ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                          >
                            <CheckCircle size={48} className="text-success" />
                          </motion.div>
                          <div>
                            <p className="text-white font-bold text-lg">Work Order Created!</p>
                            <p className="text-muted text-sm mt-1">Redirecting to inspection page...</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-muted font-mono tracking-widest mb-2">WORK ORDER SUMMARY</p>

                          <div className="space-y-2">
                            {[
                              { label: 'Site', value: effectiveSite, icon: MapPin },
                              { label: 'Scan Type', value: scanType, icon: Layers },
                              { label: 'Priority', value: priority, icon: AlertTriangle },
                              { label: 'Images', value: `${files.length} file${files.length !== 1 ? 's' : ''} selected`, icon: ImageIcon },
                              ...(notes ? [{ label: 'Notes', value: notes.substring(0, 60) + (notes.length > 60 ? '…' : ''), icon: FileText }] : []),
                            ].map(({ label, value, icon: Icon }) => (
                              <div key={label} className="flex items-start gap-3 bg-black/30 rounded-xl p-3 border border-white/5">
                                <Icon size={14} className="text-accent-cyan flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <div className="text-[10px] font-mono text-muted">{label.toUpperCase()}</div>
                                  <div className="text-sm text-white font-medium truncate">{value}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Footer */}
              {!submitted && (
                <div className="px-6 pb-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() => step === 0 ? handleClose() : setStep(s => s - 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft size={14} />
                    {step === 0 ? 'Cancel' : 'Back'}
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canNext()}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                        canNext()
                          ? "bg-accent-cyan text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                          : "bg-white/5 text-muted cursor-not-allowed"
                      )}
                    >
                      Continue <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-cyan text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-60"
                    >
                      {submitting ? (
                        <><Loader2 size={14} className="animate-spin" /> Launching...</>
                      ) : (
                        <><Zap size={14} /> Launch Inspection</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
