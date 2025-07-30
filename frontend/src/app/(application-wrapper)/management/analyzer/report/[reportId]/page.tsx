"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../analyzer.module.css'; // Note the path goes up two levels
import { FiCheckCircle, FiAlertTriangle, FiEyeOff, FiLoader, FiArrowLeft, FiDownload } from 'react-icons/fi';

// Define the structure of the report data
interface ReportItem {
  name: string;
  type: string;
  reason: string;
}
interface ReportData {
  compliant: ReportItem[];
  non_compliant: ReportItem[];
  unmanaged: ReportItem[];
}

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;

  useEffect(() => {
    if (!reportId) return;

    // Fetch the report data from the backend using the ID from the URL
    fetch(`http://localhost:5002/api/report/${reportId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch report. It may have expired or never existed.');
        }
        return res.json();
      })
      .then(data => {
        setReportData(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [reportId]);

  const downloadReport = (format: 'json' | 'tf') => {
    if (!reportData) return;
    let content = '';
    let filename = '';

    if (format === 'json') {
        content = JSON.stringify(reportData, null, 2);
        filename = `report-${reportId}.json`;
    } else {
        // Basic conversion to a Terraform-like comment block
        content = `# Compliance Report ID: ${reportId}\n\n`;
        content += '# NON-COMPLIANT RESOURCES (Drift identified)\n';
        reportData.non_compliant.forEach(item => {
            content += `# Resource: ${item.name} (${item.type})\n# Issue: ${item.reason}\n\n`;
        });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className={styles.centeredLoader}><FiLoader className={styles.spinner} /> Loading Compliance Report...</div>;
  }
  
  if (error) {
    return <div className={styles.centeredLoader}><FiAlertTriangle /> {error}</div>;
  }
  
  if (!reportData) {
    return <div className={styles.centeredLoader}>No report data available.</div>;
  }

  // Calculate summary counts
  const compliantCount = reportData.compliant.length;
  const nonCompliantCount = reportData.non_compliant.length;
  const unmanagedCount = reportData.unmanaged.length;

  return (
    <div className={styles.reportContainer}>
      <div className={styles.reportHeader}>
        <h1>Compliance Report</h1>
        <p>Analysis of live Azure resources against your baseline.</p>
        <div className={styles.summaryBar}>
          <div className={`${styles.summaryItem} ${styles.compliant}`}>
            <FiCheckCircle /><span>{compliantCount} Compliant</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.nonCompliant}`}>
            <FiAlertTriangle /><span>{nonCompliantCount} Non-Compliant</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.unmanaged}`}>
            <FiEyeOff /><span>{unmanagedCount} Unmanaged</span>
          </div>
        </div>
      </div>

      {/* Non-Compliant Resources Table */}
      {nonCompliantCount > 0 && (
        <div className={styles.tableSection}>
          <h2>Non-Compliant Resources</h2>
          <table className={styles.reportTable}>
            <thead><tr><th>Resource Name</th><th>Type</th><th>Reason</th></tr></thead>
            <tbody>
              {reportData.non_compliant.map((item, i) => (
                <tr key={i}><td>{item.name}</td><td>{item.type}</td><td>{item.reason}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Unmanaged Resources Table */}
       {unmanagedCount > 0 && (
        <div className={styles.tableSection}>
          <h2>Unmanaged Resources</h2>
          <table className={styles.reportTable}>
            <thead><tr><th>Resource Name</th><th>Type</th><th>Reason</th></tr></thead>
            <tbody>
              {reportData.unmanaged.map((item, i) => (
                <tr key={i}><td>{item.name}</td><td>{item.type}</td><td>{item.reason}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Compliant Resources Table */}
      {compliantCount > 0 && (
         <div className={styles.tableSection}>
          <h2>Compliant Resources</h2>
          <table className={styles.reportTable}>
            <thead><tr><th>Resource Name</th><th>Type</th><th>Reason</th></tr></thead>
            <tbody>
              {reportData.compliant.map((item, i) => (
                <tr key={i}><td>{item.name}</td><td>{item.type}</td><td>{item.reason}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className={styles.actionsContainer}>
          <button onClick={() => downloadReport('json')} className={styles.buttonSecondary}><FiDownload/> Download JSON</button>
          <button onClick={() => downloadReport('tf')} className={styles.buttonSecondary}><FiDownload/> Download TF Notes</button>
          <button onClick={() => router.push('/management/analyzer')} className={styles.button}><FiArrowLeft /> New Analysis</button>
      </div>

    </div>
  );
}