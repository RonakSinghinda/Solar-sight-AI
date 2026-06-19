"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Fingerprint, Lock, Mail, ArrowRight, Sun } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await res.json();
      localStorage.setItem('access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      alert('Login failed: Invalid credentials or backend is not running.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      {/* LEFT — Cinematic Visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
            className="absolute left-0 w-full h-48 bg-gradient-to-b from-transparent via-accent-cyan/10 to-transparent border-b border-accent-cyan/30"
          />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan box-glow-cyan">
            <Sun size={22} />
          </div>
          <span className="font-display font-bold tracking-widest text-xl">
            SOLARSIGHT <span className="text-accent-cyan text-glow-cyan">AI</span>
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-display font-bold mb-4 leading-tight">
            Tactical Inspection<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">
              Operating System
            </span>
          </h1>
          <p className="text-muted max-w-sm text-base">
            Authenticate to access real-time drone telemetry, AI diagnostic layers, and fleet management.
          </p>
        </div>

        <div className="relative z-10 flex items-end gap-6 text-[11px] font-mono text-accent-cyan/50">
          <div className="space-y-1">
            <div>SYS_STATE: NORMAL</div>
            <div>LAT: 34.0522° N</div>
            <div>LON: 118.2437° W</div>
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8">
        {/* Success overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSuccess ? 1 : 0 }}
          className="absolute inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{ scale: isSuccess ? [0.8, 1.2, 1] : 0.8 }}
            className="w-20 h-20 rounded-full border border-success/30 flex items-center justify-center mb-4"
          >
            <Fingerprint className="text-success w-9 h-9" />
          </motion.div>
          <div className="font-display text-2xl font-bold tracking-widest text-success text-glow-cyan">ACCESS GRANTED</div>
          <div className="text-xs font-mono text-success/50 mt-2">ESTABLISHING SECURE SESSION...</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold mb-2">System Login</h2>
            <p className="text-muted">Enter your credentials to access the operations grid.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-cyan transition-colors pointer-events-none" />
              <input type="text" required placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-cyan transition-colors pointer-events-none" />
              <input type="password" required placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="text-muted hover:text-white cursor-pointer transition-colors">Remember device</label>
              <a href="#" className="text-accent-cyan hover:text-white transition-colors">Forgot password?</a>
            </div>

            <button type="submit" disabled={isLoading || isSuccess}
              className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-accent-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" /><span>AUTHENTICATING</span></>
              ) : (
                <><span>INITIALIZE SESSION</span><ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-muted font-mono tracking-widest">
            SECURE ENCLAVE V.4.0.2 · ENCRYPTED CONNECTION ACTIVE
          </div>
        </motion.div>
      </div>
    </div>
  );
}
