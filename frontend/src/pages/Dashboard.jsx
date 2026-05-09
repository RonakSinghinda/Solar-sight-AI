import React, { useState } from 'react';
import { useGetDashboardSummaryQuery, useUploadInspectionMutation } from '../store/apiSlice';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { data: summary, isLoading, refetch } = useGetDashboardSummaryQuery(undefined, { pollingInterval: 5000 });
  const [uploadInspection, { isLoading: isUploading }] = useUploadInspectionMutation();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      await uploadInspection(formData).unwrap();
      setFiles([]);
      refetch();
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  if (isLoading) return <div>Loading data...</div>;

  const cardStyle = {
    cursor: 'pointer',
    transition: 'transform 0.2s, boxShadow 0.2s'
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div 
          className="glass-panel stat-card" 
          style={cardStyle}
          onClick={() => navigate('/inspections')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="stat-card-title">Total Inspections</div>
          <div className="stat-card-value" style={{ color: 'var(--accent)' }}>
            {summary?.total_inspections || 0}
          </div>
        </div>
        <div 
          className="glass-panel stat-card"
          style={cardStyle}
          onClick={() => navigate('/panel-view')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="stat-card-title">Detected Faults</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
            {summary?.total_faults || 0}
          </div>
        </div>
        <div 
          className="glass-panel stat-card"
          style={cardStyle}
          onClick={() => navigate('/panel-view')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="stat-card-title">Open Alerts</div>
          <div className="stat-card-value" style={{ color: 'var(--warning)' }}>
            {summary?.open_faults || 0}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }} className="glass-panel">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UploadCloud /> New Inspection Upload
        </h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="input-field"
            style={{ flex: 1 }}
          />
          <button 
            className="btn-primary" 
            onClick={handleUpload} 
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? 'Uploading...' : 'Process Images via AI Pipeline'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
