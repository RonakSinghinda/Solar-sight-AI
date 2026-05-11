import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const currentFrame = index => `/sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

const HeroSection = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const imagesRef = useRef([]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      imagesRef.current.push(img);
    }
  }, []);

  // Canvas drawing and ScrollTrigger
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = (index) => {
      if (imagesRef.current[index]) {
        // Object-fit cover logic
        const img = imagesRef.current[index];
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.width, img.height,
           centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    };

    render(0);

    const animationSequence = { frame: 0 };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=4000', // 4000px scroll length for the sequence
      pin: true,
      scrub: 0.5,
      animation: gsap.to(animationSequence, {
        frame: FRAME_COUNT - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: () => render(animationSequence.frame)
      })
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(animationSequence.frame);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loaded]);

  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="text-white font-display text-3xl font-bold mb-4 tracking-widest">
            SOLARSIGHT <span className="text-primary text-glow-cyan">AI</span>
          </div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary box-glow-cyan transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-muted font-mono text-sm uppercase tracking-widest">
            Initializing Systems {progress}%
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
        {/* Canvas Background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-cinematic pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-0 radial-gradient pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }} />

        {/* Content Layout */}
        <div className="relative z-10 w-full h-full container mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-none">
          
          {/* Left Content */}
          <div className="w-full md:w-1/2 flex flex-col pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h2 className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-4 text-glow-cyan">
                AI-Powered UAV Monitoring
              </h2>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
                Next-Generation<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  Solar Infrastructure
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted font-light mb-10 max-w-lg leading-relaxed">
                Detect hotspots, cracks, shading, and thermal anomalies using intelligent drone-based inspection systems.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 hover:border-white transition-all duration-300">
                  START MONITORING
                </button>
                <button className="px-8 py-4 rounded-full bg-primary text-black font-semibold box-glow-cyan hover:scale-105 transition-all duration-300">
                  VIEW DEMO
                </button>
              </div>
            </motion.div>
          </div>

          {/* Center Space (Open) */}
          
          {/* Right Navigation */}
          <div className="hidden md:flex flex-col items-end pointer-events-auto">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={loaded ? { opacity: 1, x: 0 } : {}}
               transition={{ duration: 1, delay: 0.6 }}
               className="flex items-center gap-6"
             >
                <div className="text-7xl font-display font-bold text-white/10 select-none">
                  01
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-xs font-mono text-muted tracking-widest rotate-90 my-8 cursor-pointer hover:text-white transition-colors">
                    PREV
                  </div>
                  <div className="w-[1px] h-24 bg-white/20">
                    <div className="w-full h-1/3 bg-primary box-glow-cyan" />
                  </div>
                  <div className="text-xs font-mono text-muted tracking-widest -rotate-90 my-8 cursor-pointer hover:text-white transition-colors">
                    NEXT
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
