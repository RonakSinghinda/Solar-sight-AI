"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-white/5 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-display font-bold tracking-wider text-white mb-4">
              SOLARSIGHT <span className="text-accent-cyan text-glow-cyan">AI</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              The most advanced AI-powered drone inspection platform for solar infrastructure worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Platform</h4>
            <ul className="space-y-2 text-muted text-sm">
              {['Dashboard', 'Panel View', 'Inspections', 'Reports'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Company</h4>
            <ul className="space-y-2 text-muted text-sm">
              {['About', 'Technology', 'Blog', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs font-mono">© 2026 SolarSight AI. All rights reserved.</p>
          <p className="text-muted text-xs font-mono">Built for the future of renewable energy.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
