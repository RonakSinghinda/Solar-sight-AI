"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
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
    
    // Simulate API call to save settings
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
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-muted text-sm">Manage your account, API keys, and system preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-lg font-display font-semibold text-white">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">OPERATOR NAME</label>
            <input type="text" value={profile.name} onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">EMAIL</label>
            <input type="email" value={profile.email} onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">ROLE</label>
            <input type="text" value={profile.role} onChange={(e) => handleChange('role', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors opacity-50 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">TIMEZONE</label>
            <input type="text" value={profile.timezone} onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>
        </div>
        <div className="pt-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn("px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
              isSaved ? "bg-success text-black" : 
              isSaving ? "bg-accent-cyan/50 text-black cursor-not-allowed" : 
              "bg-accent-cyan text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            )}
          >
            {isSaving ? <><RefreshCw size={16} className="animate-spin"/> SAVING...</> :
             isSaved ? <><Check size={16}/> SAVED!</> :
             "SAVE CHANGES"}
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-display font-semibold text-white">API Integration</h3>
        <p className="text-muted text-sm">Configure the backend connection URL to your Django service.</p>
        <div>
          <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">BACKEND API URL</label>
          <input type="url" defaultValue={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors font-mono"
          />
        </div>
        <button className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white hover:text-black transition-all">
          TEST CONNECTION
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Security</h3>
        <button className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white hover:text-black transition-all">
          CHANGE PASSWORD
        </button>
      </motion.div>
    </div>
  );
}
