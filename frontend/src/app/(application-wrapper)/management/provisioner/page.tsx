import UploadForm from './components/UploadForm';
import styles from './provisioner.module.css'; // This file now only contains form-specific styles

export default function ProvisionerPage() {
  // The <main> wrapper is now handled by the layout.tsx file, so we remove it from here.
  return (
    <>
      <header className={styles.header}> {/* You might want to create a generic header style too */}
        <h1>AD-ASTRA Terraform Provisioner</h1>
        <p>Upload your Terraform configuration to provision resources.</p>
      </header>
      <UploadForm />
    </>
  );
}