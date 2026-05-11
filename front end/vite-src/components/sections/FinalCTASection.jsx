import React from 'react';
import { motion } from 'framer-motion';

const FinalCTASection = () => {
  return (
    <section className="relative py-40 overflow-hidden">
      {/* Background cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#051015] to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-display font-bold mb-8"
        >
          Power the Future with <br />
          <span className="text-primary text-glow-cyan">AI-Driven</span> Solar Intelligence
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
        >
          <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-primary text-black font-bold tracking-wide box-glow-cyan hover:scale-105 transition-all duration-300">
            SCHEDULE DEMO
          </button>
          <button className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/20 text-white font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300">
            CONTACT TEAM
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
