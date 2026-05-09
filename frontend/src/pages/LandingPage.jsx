import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Activity, Database, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Sun color="var(--warning)" size={64} />
        </div>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Automated Solar Panel Inspection
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          AI-driven fault detection utilizing UAV thermal and RGB imagery to optimize your solar farm maintenance.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: '18px', padding: '15px 30px' }}>
            Access Dashboard
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'left' }}>
          <div className="glass-panel">
            <Activity color="var(--accent)" size={32} style={{ marginBottom: '16px' }} />
            <h3>YOLOv8 Inference</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Instantly detect hotspots, micro-cracks, and soiling using state-of-the-art vision models.</p>
          </div>
          <div className="glass-panel">
            <Database color="var(--success)" size={32} style={{ marginBottom: '16px' }} />
            <h3>GPS Mapping</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Automatically correlate identified faults with exact physical panel locations via EXIF data.</p>
          </div>
          <div className="glass-panel">
            <Shield color="var(--danger)" size={32} style={{ marginBottom: '16px' }} />
            <h3>Actionable Reports</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Generate PDF maintenance reports and dispatch engineers exactly where they are needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
