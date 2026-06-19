import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Drone Capture', desc: 'Autonomous UAVs scan the solar array using high-resolution RGB and thermal sensors.' },
  { num: '02', title: 'AI Processing', desc: 'Data is uploaded and processed through our proprietary neural networks in real-time.' },
  { num: '03', title: 'Thermal Analysis', desc: 'Temperature deltas are analyzed to identify string failures, diode issues, and cell cracks.' },
  { num: '04', title: 'Fault Detection', desc: 'Anomalies are classified by severity and exact GPS coordinates are mapped.' },
  { num: '05', title: 'Report Generation', desc: 'A comprehensive, actionable maintenance report is generated for the engineering team.' }
];

const WorkflowSection = () => {
  return (
    <section className="relative w-full py-32 bg-[#050505]" id="technology">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Inspection Workflow
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2">
             <motion.div 
               initial={{ height: 0 }}
               whileInView={{ height: '100%' }}
               viewport={{ once: true, margin: "-10%" }}
               transition={{ duration: 2, ease: "linear" }}
               className="w-full bg-primary box-glow-cyan"
             />
          </div>

          <div className="space-y-24">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'} pl-20 md:pl-0`}>
                  <div className="text-primary font-mono text-xl mb-2 text-glow-cyan">{step.num}</div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-muted leading-relaxed">{step.desc}</p>
                </div>
                
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary box-glow-cyan" />
                
                <div className="w-full md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
