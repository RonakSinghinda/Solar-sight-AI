import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '80%', label: 'FASTER INSPECTIONS' },
  { value: '65%', label: 'REDUCED MAINTENANCE COST' },
  { value: '99.9%', label: 'AI ACCURACY' },
  { value: '10x', label: 'ROI ACCELERATION' },
];

const BenefitsSection = () => {
  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-primary tracking-widest uppercase text-glow-cyan">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
