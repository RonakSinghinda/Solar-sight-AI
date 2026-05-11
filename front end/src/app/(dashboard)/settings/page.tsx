"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-muted text-sm">Manage your account, API keys, and system preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-lg font-display font-semibold text-white">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[['OPERATOR NAME', 'Cmdr. Shepard', 'text'], ['EMAIL', 'shepard@solarsight.ai', 'email'], ['ROLE', 'ADMIN', 'text'], ['TIMEZONE', 'UTC+05:30', 'text']].map(([label, val, type]) => (
            <div key={label as string}>
              <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">{label as string}</label>
              <input type={type as string} defaultValue={val as string}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="pt-2">
          <button className="px-6 py-2.5 rounded-lg bg-accent-cyan text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            SAVE CHANGES
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-display font-semibold text-white">API Integration</h3>
        <p className="text-muted text-sm">Configure the backend connection URL to your Django service.</p>
        <div>
          <label className="block text-[10px] font-mono text-muted mb-2 tracking-widest">BACKEND API URL</label>
          <input type="url" defaultValue="http://localhost:8000/api"
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
