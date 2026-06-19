"use client";

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { quote: "SolarSight AI reduced our array inspection time from 3 weeks down to 4 days, with 100% accuracy on structural defects.", author: "Sarah Jenkins", role: "VP of Operations, Nova Solar" },
  { quote: "The thermal delta mapping is revolutionary. We identified a string failure costing us thousands daily that manual inspections missed.", author: "Marcus Thorne", role: "Lead Engineer, EcoGrid Infrastructure" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-primary tracking-widest uppercase mb-4 text-glow-cyan"
          >
            Industry Trust
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold"
          >
            Securing the World's<br/>Largest Solar Arrays
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="glass-panel p-10 rounded-2xl relative"
            >
              <div className="text-6xl text-white/10 font-serif absolute top-6 left-6">"</div>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed relative z-10 mb-8 italic">
                {t.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div>
                  <div className="text-white font-display font-semibold">{t.author}</div>
                  <div className="text-primary text-xs font-mono">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Logos Placeholder */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale">
           {['NEXUS ENERGY', 'SUNGRID', 'HELION', 'AEROSPACE'].map((logo, i) => (
             <div key={i} className="text-xl font-display font-bold tracking-widest">{logo}</div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

