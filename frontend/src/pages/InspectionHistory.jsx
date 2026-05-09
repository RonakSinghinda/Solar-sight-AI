import React from 'react';
import { useGetInspectionsQuery, useGenerateReportMutation } from '../store/apiSlice';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const InspectionHistory = () => {
  const { data: inspections, isLoading } = useGetInspectionsQuery(undefined, { pollingInterval: 5000 });
  const [generateReport, { isLoading: isGenerating }] = useGenerateReportMutation();

  const handleDownloadReport = async (id) => {
    try {
      const response = await generateReport(id).unwrap();
      if (response.url) {
        window.open(response.url, '_blank');
      } else {
        alert('Report generated, but no download URL was returned.');
      }
    } catch (err) {
      alert('Failed to generate report');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Inspection History</h1>
      
      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inspections?.map(ins => (
              <tr key={ins.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '14px' }}>{ins.id.split('-')[0]}...</td>
                <td>{new Date(ins.date).toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${ins.status === 'Completed' ? 'success' : 'warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {ins.status === 'Completed' ? <CheckCircle size={14}/> : <Clock size={14}/>} {ins.status}
                  </span>
                </td>
                <td>{ins.images?.length || 0} files</td>
                <td>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => handleDownloadReport(ins.id)}
                    disabled={ins.status !== 'Completed' || isGenerating}
                  >
                    <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Get PDF
                  </button>
                </td>
              </tr>
            ))}
            {inspections?.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No inspections found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionHistory;
