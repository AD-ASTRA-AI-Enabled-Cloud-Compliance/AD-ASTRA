import UploadForm from './components/UploadForm';
import styles from './provisioner.module.css';

export default function ProvisionerPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>AD-ASTRA Terraform Provisioner</h1>
        <p>Upload your Terraform configuration to provision resources.</p>
      </header>
      <UploadForm />
    </main>
  );
}