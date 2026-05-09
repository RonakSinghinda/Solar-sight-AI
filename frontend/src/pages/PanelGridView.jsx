import React from 'react';
import { useGetFaultsQuery } from '../store/apiSlice';

const PanelGridView = () => {
  const { data: faults, isLoading } = useGetFaultsQuery(undefined, { pollingInterval: 5000 });

  if (isLoading) return <div>Loading...</div>;

  // Group faults by panel_id for the visualization
  const gridMap = {};
  faults?.forEach(fault => {
    const pId = fault.panel || 'Unknown Location';
    if (!gridMap[pId]) gridMap[pId] = [];
    gridMap[pId].push(fault);
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Solar Panel Grid Map</h1>
      
      <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {Object.keys(gridMap).length === 0 ? (
          <p>No fault data mapped to panels yet.</p>
        ) : (
          Object.keys(gridMap).map(panelId => (
            <div key={panelId} style={{ 
              background: 'var(--bg-dark)', 
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              width: '280px'
            }}>
              <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>{panelId}</h3>
              {gridMap[panelId].map(fault => (
                <div key={fault.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <span>{fault.fault_type}</span>
                  <span className={`badge badge-${fault.fault_type === 'Hotspot' ? 'danger' : 'warning'}`}>
                    {(fault.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PanelGridView;
