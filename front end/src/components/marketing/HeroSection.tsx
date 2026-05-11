"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const currentFrame = (index: number) =>
  `/sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let loadedCount = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      imagesRef.current.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = (index: number) => {
      const img = imagesRef.current[index] as HTMLImageElement;
      if (!img) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    };

    render(0);
    const seq = { frame: 0 };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=4000',
      pin: true,
      scrub: 0.5,
      animation: gsap.to(seq, {
        frame: FRAME_COUNT - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: () => render(seq.frame),
      }),
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(seq.frame);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded]);

  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <div className="text-white font-display text-3xl font-bold mb-6 tracking-widest">
            SOLARSIGHT <span className="text-accent-cyan text-glow-cyan">AI</span>
          </div>
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-accent-cyan box-glow-cyan transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-muted font-mono text-xs uppercase tracking-widest">
            Initializing Systems — {progress}%
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-75" />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full h-full container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="w-full md:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <p className="text-accent-cyan font-mono text-xs tracking-[0.3em] uppercase mb-4 text-glow-cyan">
                AI-Powered UAV Monitoring
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-white">
                Next-Generation<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                  Solar Infrastructure
                </span>
              </h1>
              <p className="text-lg text-muted font-light mb-10 max-w-lg leading-relaxed">
                Detect hotspots, cracks, shading, and thermal anomalies using intelligent drone-based inspection systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <button className="px-8 py-4 rounded-full bg-accent-cyan text-black font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300">
                    START MONITORING
                  </button>
                </Link>
                <a href="#product">
                  <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-300">
                    LEARN MORE
                  </button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="hidden md:flex flex-col items-center gap-3 absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <span className="text-[10px] font-mono text-muted tracking-widest">SCROLL TO EXPLORE</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
