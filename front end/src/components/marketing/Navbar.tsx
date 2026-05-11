"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="text-xl font-display font-bold tracking-wider text-white">
          SOLARSIGHT <span className="text-accent-cyan text-glow-cyan">AI</span>
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-muted">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#technology" className="hover:text-white transition-colors">Technology</a>
          <a href="#ai-detection" className="hover:text-white transition-colors">AI Detection</a>
          <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="hidden md:block px-5 py-2 text-sm font-semibold border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300">
              Sign In
            </button>
          </Link>
          <Link href="/login">
            <button className="px-5 py-2 text-sm font-semibold bg-accent-cyan text-black rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300">
              Get Access
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
