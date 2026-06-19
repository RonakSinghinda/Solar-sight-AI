"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FinalCTASection = () => {
  return (
    <section className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#051015] to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-cyan/8 blur-[150px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-display font-bold mb-8"
        >
          Power the Future with <br />
          <span className="text-accent-cyan text-glow-cyan">AI-Driven</span> Solar Intelligence
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted text-lg max-w-xl mx-auto mb-12"
        >
          Join the next generation of solar operators using autonomous AI to protect and optimize their assets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/login">
            <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-accent-cyan text-black font-bold tracking-wide box-glow-cyan hover:scale-105 transition-all duration-300">
              ACCESS PLATFORM
            </button>
          </Link>
          <a href="mailto:hello@solarsight.ai">
            <button className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/20 text-white font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300">
              CONTACT TEAM
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
