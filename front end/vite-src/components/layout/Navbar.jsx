import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-display font-bold tracking-wider text-white">
          SOLARSIGHT <span className="text-primary text-glow-cyan">AI</span>
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm font-medium text-muted">
          <a href="#product" className="hover:text-white transition-colors duration-200">Product</a>
          <a href="#technology" className="hover:text-white transition-colors duration-200">Technology</a>
          <a href="#ai-detection" className="hover:text-white transition-colors duration-200">AI Detection</a>
          <a href="#dashboard" className="hover:text-white transition-colors duration-200">Dashboard</a>
          <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="hidden md:block px-5 py-2 text-sm font-semibold border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Contact
          </button>
          <button className="md:hidden text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
