// src/app/(application-wrapper)/management/provisioner/components/UploadForm.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../provisioner.module.css';
import { FiUploadCloud, FiTool, FiAlertTriangle, FiLoader, FiHelpCircle, FiFileText } from 'react-icons/fi';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'error';

const tfvarsTemplate = `# --- Fill in your Azure credentials below ---
subscription_id = "your_subscription_id_here"
client_id       = "your_client_id_here"
client_secret   = "your_client_secret_here"
tenant_id       = "your_tenant_id_here"

# --- Fill in your Virtual Machine credentials below ---
admin_username = "your_vm_admin_username"
admin_password = "A_Complex_Password!123"

# --- Fill in your Key Vault name below ---
key_vault_name = "your-unique-keyvault-name-here"
`;

export default function UploadForm() {
  const [mainTfFile, setMainTfFile] = useState<File | null>(null);
  const [varsFile, setVarsFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorLog, setErrorLog] = useState('');
  const [showErrorLog, setShowErrorLog] = useState(false);

  const router = useRouter();

  const handleDownloadTemplate = () => {
    const blob = new Blob([tfvarsTemplate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terraform.tfvars';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    setShowErrorLog(false);

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
        setErrorMessage(data.message || 'An unexpected error occurred.');
        setErrorLog(data.log || 'No detailed log available.');
        setStatus('error');
        return;
      }
      router.push(`/management/provisioner/results/${data.run_id}`);
    } catch (err: any)      {
      setErrorMessage('A network error occurred. Is the backend server running?');
      setErrorLog('Could not connect to the backend service. Please ensure it is running and accessible.');
      setStatus('error');
      console.error(err);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* The two corner links are now direct children of the form */}
        <button type="button" onClick={handleDownloadTemplate} className={styles.downloadLink}>
            <div className={styles.downloadContent}>
                <span className={styles.downloadTextTop}>terraform.tfvars</span>
                <span className={styles.downloadTextBottom}>
                    template <FiFileText />
                </span>
            </div>
        </button>

        <Link href="/management/provisioner/how-to-sp" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
          <FiHelpCircle size={22}/>
          <span className={styles.tooltipText}>How to create Azure service principal credentials</span>
        </Link>
        
        <div className={styles.formIcon}><FiTool /></div>
        
        <div className={styles.titleContainer}>
          <h2>Launch Infrastructure</h2>
        </div>

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

        <button type="submit" disabled={!mainTfFile || status === 'loading'} className={styles.button}>
          {status === 'loading' ? <><FiLoader className={styles.spinner}/> Deploying...</> : 'Launch Infrastructure'}
        </button>
      </form>
      
      {status === 'error' && errorMessage && (
        <div className={styles.errorContainer}>
            <div className={styles.errorIcon}><FiAlertTriangle /></div>
            <div>
                <h3 className={styles.errorTitle}>Deployment Failed</h3>
                <p className={styles.errorMessage}>
                  {errorMessage} Please try again or contact support.
                </p>
                <button type="button" onClick={() => setShowErrorLog(!showErrorLog)} className={styles.debugButton}>
                  {showErrorLog ? 'Hide Debug Log' : 'Show Debug Log'}
                </button>
                {showErrorLog && (
                  <pre className={styles.log}>{errorLog}</pre>
                )}
            </div>
        </div>
      )}
    </div>
  );
}