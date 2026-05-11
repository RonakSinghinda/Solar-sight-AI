import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: "How long does a typical 100MW scan take?", a: "With our automated flight paths and advanced payloads, a 100MW site can be fully scanned (RGB + Thermal) in approximately 2-3 days, compared to weeks with manual inspection." },
  { q: "What thermal resolution do your drones capture?", a: "We utilize radiometric thermal sensors capturing at 640x512 resolution with a temperature sensitivity of ≤50 mK, ensuring even the smallest micro-cracks are detected." },
  { q: "Does the AI integrate with our existing CMMS?", a: "Yes, SolarSight AI features a robust API that seamlessly pushes fault data, exact coordinates, and work orders directly into systems like Maximo, SAP, and Fiix." },
  { q: "How accurate is the fault classification?", a: "Our proprietary AI models operate at 99.9% accuracy for standard anomalies (hotspots, string failures, bypass diodes) and continuously learn from new environmental data." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-32 bg-background" id="faq">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold">System Specifications</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel border border-white/5 rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
              >
                <span className={`text-lg font-display transition-colors ${openIndex === i ? 'text-primary' : 'text-white'}`}>
                  {faq.q}
                </span>
                <span className="text-primary text-2xl font-light">
                  {openIndex === i ? '-' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-muted leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
