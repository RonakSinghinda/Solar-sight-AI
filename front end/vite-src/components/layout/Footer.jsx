import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-display font-bold tracking-wider text-white mb-6">
              SOLARSIGHT <span className="text-primary text-glow-cyan">AI</span>
            </div>
            <p className="text-muted text-sm max-w-sm mb-8 leading-relaxed">
              Enterprise-grade drone inspection and AI analytics for the world's largest renewable energy infrastructures.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-primary transition-all cursor-pointer">
                  <div className="w-4 h-4 bg-white/20 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-display font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">AI Detection</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Drone Fleet</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Thermal Analysis</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Reporting Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-display font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 font-mono">
          <div>&copy; 2026 SolarSight AI. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
