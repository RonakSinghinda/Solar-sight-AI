"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RefreshCw, User, Link2, ShieldCheck, Bell, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'profile',    label: 'Profile',     icon: User },
  { id: 'api',        label: 'API',          icon: Link2 },
  { id: 'security',   label: 'Security',     icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Cmdr. Shepard',
    email: 'shepard@solarsight.ai',
    role: 'ADMIN',
    timezone: 'UTC+05:30'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setIsSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl space-y-5 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-muted text-xs md:text-sm">Manage your account, API keys, and system preferences.</p>
      </div>

      {/* ── Mobile Section Tabs ────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0",
              activeSection === id
                ? "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30"
                : "bg-white/5 text-muted border-white/10 hover:text-white"
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Profile Section ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "glass-card rounded-2xl p-5 md:p-6 space-y-5",
          // On mobile, hide non-active sections
          activeSection !== 'profile' ? "hidden md:block" : ""
        )}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
            <User size={16} />
          </div>
          <h3 className="text-base md:text-lg font-display font-semibold text-white">Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'OPERATOR NAME', field: 'name' as const, type: 'text', disabled: false },
            { label: 'EMAIL', field: 'email' as const, type: 'email', disabled: false },
            { label: 'ROLE', field: 'role' as const, type: 'text', disabled: true },
            { label: 'TIMEZONE', field: 'timezone' as const, type: 'text', disabled: false },
          ].map(({ label, field, type, disabled }) => (
            <div key={field}>
              <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">{label}</label>
              <input
                type={type}
                value={profile[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={disabled}
                className={cn(
                  "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors",
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                )}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-full md:w-auto px-6 py-3 md:py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
            isSaved   ? "bg-success text-black" :
            isSaving  ? "bg-accent-cyan/50 text-black cursor-not-allowed" :
            "bg-accent-cyan text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          )}
        >
          {isSaving ? <><RefreshCw size={16} className="animate-spin" />SAVING...</> :
           isSaved   ? <><Check size={16} />SAVED!</> :
           "SAVE CHANGES"}
        </button>
      </motion.div>

      {/* ── API Integration Section ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "glass-card rounded-2xl p-5 md:p-6 space-y-4",
          activeSection !== 'api' ? "hidden md:block" : ""
        )}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
            <Link2 size={16} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-display font-semibold text-white">API Integration</h3>
            <p className="text-muted text-xs mt-0.5">Configure the backend connection URL to your Django service.</p>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">BACKEND API URL</label>
          <input
            type="url"
            defaultValue={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors font-mono"
          />
        </div>

        <button className="w-full md:w-auto px-6 py-3 md:py-2.5 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white hover:text-black transition-all">
          TEST CONNECTION
        </button>
      </motion.div>

      {/* ── Security Section ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "glass-card rounded-2xl p-5 md:p-6",
          activeSection !== 'security' ? "hidden md:block" : ""
        )}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-display font-semibold text-white">Security</h3>
            <p className="text-muted text-xs mt-0.5">Manage your account password and 2FA settings.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 sm:flex-none px-6 py-3 md:py-2.5 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white hover:text-black transition-all">
            CHANGE PASSWORD
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 md:py-2.5 rounded-lg border border-white/10 text-muted text-sm font-bold hover:bg-white/5 transition-all">
            ENABLE 2FA
          </button>
        </div>
      </motion.div>
    </div>
  );
}
