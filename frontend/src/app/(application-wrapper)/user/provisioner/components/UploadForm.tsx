"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../provisioner.module.css';
import { FiUploadCloud, FiTool, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'loading' | 'error';

export default function UploadForm() {
  const [mainTfFile, setMainTfFile] = useState<File | null>(null);
  const [varsFile, setVarsFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorLog, setErrorLog] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mainTfFile) {
      setErrorMessage('The main.tf file is required.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setErrorLog('');

    const formData = new FormData();
    formData.append('main_tf', mainTfFile);
    if (varsFile) {
      formData.append('variables_tf', varsFile);
    }

    try {
      const res = await fetch('http://localhost:5001/api/provision', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'An error occurred during deployment.');
        setErrorLog(data.log || 'No detailed log available.');
        setStatus('error');
        return;
      }
      
      // On success, redirect to the new results page with the run_id
      router.push(`/user/provisioner/results/${data.run_id}`);

    } catch (err: any) {
      setErrorMessage('A network error occurred. Is the backend server running?');
      setStatus('error');
      console.error(err);
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formIcon}><FiTool /></div>
        <h2>Deploy Infrastructure</h2>
        <p>Provision cloud resources by uploading your Terraform files.</p>
        <div className={styles.fileInputGroup}>
          <label htmlFor="main_tf" className={styles.fileInputLabel}>
            <FiUploadCloud />
            <span>{mainTfFile ? mainTfFile.name : 'Upload main.tf *'}</span>
          </label>
          <input id="main_tf" type="file" accept=".tf" onChange={(e) => setMainTfFile(e.target.files ? e.target.files[0] : null)} required />
          <label htmlFor="variables_tf" className={styles.fileInputLabel}>
            <FiUploadCloud />
            <span>{varsFile ? varsFile.name : 'Upload terraform.tfvars'}</span>
          </label>
          <input id="variables_tf" type="file" accept=".tfvars" onChange={(e) => setVarsFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        <Button type="submit" disabled={status === 'loading'} >
          {status === 'loading' ? <><FiLoader className={styles.spinner}/> Deploying...</> : '🚀 Deploy Infrastructure'}
        </Button>
      </form>
      {status === 'error' && (
        <div className={styles.errorContainer}>
            <div className={styles.errorIcon}><FiAlertTriangle /></div>
            <div>
                <h3 className={styles.errorTitle}>Deployment Failed</h3>
                <p className={styles.errorMessage}>{errorMessage}</p>
                <details className={styles.errorDetails}><summary>Show Error Log</summary><pre className={styles.log}>{errorLog}</pre></details>
            </div>
        </div>
      )}
    </div>
  );
}
