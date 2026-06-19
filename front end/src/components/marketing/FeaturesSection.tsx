"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ThermometerSun, Maximize, Sun, CheckCircle } from 'lucide-react';

const features = [
  {
    title: 'Hotspot Detection',
    desc: 'Identify micro-cracks and hotspots instantaneously with our thermal AI.',
    icon: <Flame className="text-danger w-8 h-8" />,
    color: 'border-danger/30 hover:border-danger box-glow-red',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,0,60,0.2)]'
  },
  {
    title: 'Thermal Analysis',
    desc: 'Deep thermal layer inspection to map power loss and degradation.',
    icon: <ThermometerSun className="text-accent w-8 h-8" />,
    color: 'border-accent/30 hover:border-accent',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,95,0,0.2)]'
  },
  {
    title: 'Crack Detection',
    desc: 'Millimeter precision scanning to detect structural panel anomalies.',
    icon: <Maximize className="text-primary w-8 h-8" />,
    color: 'border-primary/30 hover:border-primary',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
  },
  {
    title: 'Shading Analysis',
    desc: 'Automated shading path predictions and localized generation drop analysis.',
    icon: <Sun className="text-success w-8 h-8" />,
    color: 'border-success/30 hover:border-success',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,255,102,0.2)]'
  },
  {
    title: 'Fault Classification',
    desc: 'Categorizes defects automatically and prioritizes maintenance queues.',
    icon: <CheckCircle className="text-white w-8 h-8" />,
    color: 'border-white/30 hover:border-white',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
  }
];

const FeaturesSection = () => {
  return (
    <section className="relative w-full py-32 bg-[#0a0a0a]" id="ai-detection">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            AI Detection Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-2xl"
          >
            Our proprietary computer vision models are trained on millions of solar anomalies to provide unmatched diagnostic accuracy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group glass-panel p-8 rounded-2xl border transition-all duration-500 cursor-pointer ${feature.color} ${feature.glow}`}
            >
              <div className="mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60">
                {feature.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

