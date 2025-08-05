"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../provisioner.module.css';
import { FiCheckCircle, FiTrash2, FiLoader, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import Loader from '@/components/ui/loader';

interface Resource {
  type: string;
  name: string;
  details: string;
}

export default function ResultsPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDestroying, setIsDestroying] = useState(false);
  const [destroyError, setDestroyError] = useState('');

  const params = useParams();
  const router = useRouter();
  const runId = params.runId as string;

  useEffect(() => {
    if (!runId) return;
    
    fetch(`http://localhost:5001/api/deployment/${runId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'error') {
          throw new Error(data.message);
        }
        setResources(data.resources);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [runId]);

  const handleDestroy = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all these resources?")) {
      return;
    }
    setIsDestroying(true);
    setDestroyError('');
    try {
      const res = await fetch('http://localhost:5001/api/destroy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: runId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      alert("Infrastructure destroyed successfully.");
      router.push('/user/provisioner'); // Redirect back to form
    } catch (err: any) {
      setDestroyError(err.message);
    } finally {
      setIsDestroying(false);
    }
  };

  if (isLoading) {
    return <div className={styles.centeredLoader}><FiLoader className={styles.spinner} /> Loading Deployment Results...</div>;
  }
  
  if (error) {
    return <div className={styles.centeredLoader}>{error}</div>;
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.successHeader}>
        <FiCheckCircle className={styles.successIcon} />
        <h2 className={styles.successTitle}>Deployment Successful</h2>
        <p className={styles.successSubtitle}>Your infrastructure has been provisioned.</p>
        <Loader />
      </div>
      <div className={styles.tableContainer}>
        <h3 className={styles.tableTitle}>Created Resources</h3>
        <table className={styles.resourceTable}>
          <thead>
            <tr>
              <th>Resource Type</th>
              <th>Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, index) => (
              <tr key={index}>
                <td>{resource.type}</td>
                <td>{resource.name}</td>
                <td>{resource.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.controls}>
          <button 
            className={styles.backButton}
            onClick={() => router.push('/user/provisioner')}
          >
            <FiArrowLeft /> Back to Provisioner
          </button>
          <button 
            className={styles.destroyButton}
            onClick={handleDestroy}
            disabled={isDestroying}
          >
            {isDestroying ? (
              <>
                <FiLoader className={styles.spinner} /> Destroying...
              </>
            ) : (
              <>
                <FiTrash2 /> Destroy Infrastructure
              </>
            )}
          </button>
        </div>
        
        {destroyError && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}><FiAlertTriangle /></div>
            <div>
              <h3 className={styles.errorTitle}>Destroy Failed</h3>
              <p className={styles.errorMessage}>{destroyError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
