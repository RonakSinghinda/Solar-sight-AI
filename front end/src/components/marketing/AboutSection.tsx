"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section className="relative w-full py-32 bg-background overflow-hidden" id="product">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-accent font-mono text-sm tracking-widest uppercase mb-4 text-glow-orange">
              Automated Diagnostics
            </h3>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              AI-Powered Drone <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                Inspection
              </span>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              SolarSight AI seamlessly integrates advanced computer vision with high-end drone technology to automate solar farm diagnostics. We reduce inspection time by 80% while increasing fault detection accuracy, ensuring your renewable energy infrastructure operates at peak efficiency.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-display font-bold text-white">99.9%</span>
                <span className="text-xs font-mono text-muted uppercase tracking-wider">Detection Rate</span>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-3xl font-display font-bold text-white">10x</span>
                <span className="text-xs font-mono text-muted uppercase tracking-wider">Faster Scans</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative h-[600px] glass-panel rounded-3xl overflow-hidden group"
          >
            {/* We can use an image or an abstracted visual here. 
                Using a glowing grid for aerospace UI aesthetic */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-mono text-primary box-glow-cyan">
                LIVE FEED SECURE
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-primary box-glow-cyan" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

