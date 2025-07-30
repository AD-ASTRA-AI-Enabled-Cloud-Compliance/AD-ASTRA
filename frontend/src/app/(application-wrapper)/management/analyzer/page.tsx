"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './analyzer.module.css';
import { FiShield, FiUploadCloud, FiLoader, FiAlertTriangle } from 'react-icons/fi';

type Status = 'idle' | 'loading' | 'error';
type AnalysisType = 'fetch' | 'upload';

export default function AnalyzerPage() {
  const [baselineFile, setBaselineFile] = useState<File | null>(null);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('fetch');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ... (rest of the function remains the same as before) ...
    if (!baselineFile) {
      setErrorMessage('A baseline .tf file is required.');
      setStatus('error');
      return;
    }
    if (analysisType === 'upload' && !configFile) {
      setErrorMessage('A configuration JSON file is required for the upload method.');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    formData.append('analysis_type', analysisType);
    formData.append('baseline_tf', baselineFile);

    if (analysisType === 'upload' && configFile) {
      formData.append('config_json', configFile);
    }
    
    try {
      const res = await fetch('http://localhost:5002/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Analysis failed.');

      router.push(`/management/analyzer/report/${data.reportId}`);

    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formIcon}><FiShield /></div>
          <h2>Compliance Analyzer</h2>
          <p>Scan your cloud resources against a baseline Terraform file.</p>
          
          <div className={styles.tabs}>
            <button type="button" onClick={() => setAnalysisType('fetch')} className={analysisType === 'fetch' ? styles.activeTab : styles.tab}>
              Fetch Live Configuration
            </button>
            <button type="button" onClick={() => setAnalysisType('upload')} className={analysisType === 'upload' ? styles.activeTab : styles.tab}>
              Upload Configuration File
            </button>
          </div>

          {analysisType === 'fetch' ? (
            <div className={styles.formSection}>
              <h3>Azure Credentials</h3>
              <div className={styles.inputGroup}>
                <input name="subscription_id" placeholder="Subscription ID" required />
                <input name="tenant_id" placeholder="Tenant ID" required />
                <input name="client_id" placeholder="Client ID" required />
                <input name="client_secret" type="password" placeholder="Client Secret" required />
              </div>
            </div>
          ) : (
            <div className={styles.formSection}>
              <h3>Current Configuration</h3>
              <label htmlFor="config_json" className={styles.fileInputLabel}>
                  <FiUploadCloud />
                  <span>{configFile ? configFile.name : 'Upload Configuration JSON *'}</span>
              </label>
              <input id="config_json" type="file" accept=".json" onChange={(e) => setConfigFile(e.target.files ? e.target.files[0] : null)} required />
            </div>
          )}

          <div className={styles.formSection}>
            <h3>Baseline File</h3>
            <label htmlFor="baseline_tf" className={styles.fileInputLabel}>
              <FiUploadCloud />
              <span>{baselineFile ? baselineFile.name : 'Upload Baseline .tf File *'}</span>
            </label>
            <input id="baseline_tf" type="file" accept=".tf" onChange={(e) => setBaselineFile(e.target.files ? e.target.files[0] : null)} required />
          </div>

          <button type="submit" disabled={status === 'loading'} className={styles.button}>
            {status === 'loading' ? <><FiLoader className={styles.spinner}/> Analyzing...</> : 'Analyze Compliance'}
          </button>
        </form>
      </div>
    </div>
  );
}