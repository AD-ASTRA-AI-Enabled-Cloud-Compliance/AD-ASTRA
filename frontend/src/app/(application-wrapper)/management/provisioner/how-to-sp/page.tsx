// src/app/(application-wrapper)/management/provisioner/how-to-sp/page.tsx

import Link from 'next/link';
import Image from 'next/image';

// Updated styles for a professional two-column layout
const styles = {
  container: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  mainHeading: { fontSize: '2.25rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' },
  introParagraph: { lineHeight: '1.7', margin: '1.5rem 0', fontSize: '1.1rem', color: 'hsl(var(--muted-foreground))' },

  stepContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '3rem', 
    margin: '4rem 0',
    flexDirection: 'row' as const 
  },
  stepContainerReverse: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '3rem', 
    margin: '4rem 0',
    flexDirection: 'row-reverse' as const
  },
  textColumn: { flex: 1, paddingRight: '1rem' },
  imageColumn: { flex: 1 },

  stepHeading: { fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' },
  stepParagraph: { lineHeight: '1.7', marginBottom: '1rem' },
  code: { backgroundColor: 'hsl(var(--muted))', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' },
  pre: { backgroundColor: 'hsl(var(--muted))', padding: '1rem', borderRadius: '8px', overflowX: 'auto' as const, margin: '1rem 0' },
  link: { color: '#A78BFA', textDecoration: 'underline', marginTop: '3rem', display: 'inline-block' },
  imageWrapper: { border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
};

export default function HowToServicePrincipalPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>How to Create an Azure Service Principal</h1>
      <p style={styles.introParagraph}>
        An Azure Service Principal is an identity created for use with applications, hosted services, and automated tools to access Azure resources. This guide will walk you through creating one using the Azure portal.
      </p>

      {/* --- Step 1 --- */}
      <div style={styles.stepContainer}>
        <div style={styles.textColumn}>
          <h2 style={styles.stepHeading}>1. Start App Registration</h2>
          <p style={styles.stepParagraph}>
            In the Microsoft Entra ID portal, navigate to your directory. Click the **+ Add** button and select **App registration** from the dropdown menu.
          </p>
        </div>
        <div style={styles.imageColumn}>
          <div style={styles.imageWrapper}>
            <Image src="/deploy_tutorial/step 1.JPG" alt="Azure portal - Add App registration" width={500} height={312} layout="responsive" />
          </div>
        </div>
      </div>

      {/* --- Step 2 --- */}
      <div style={styles.stepContainerReverse}>
         <div style={styles.textColumn}>
          <h2 style={styles.stepHeading}>2. Register the Application</h2>
          <p style={styles.stepParagraph}>
            Give your application a name (e.g., "AD-ASTRA-Provisioner"). For account types, select **"Accounts in this organizational directory only"**. Click **Register**.
          </p>
        </div>
        <div style={styles.imageColumn}>
          <div style={styles.imageWrapper}>
            <Image src="/deploy_tutorial/step 2.JPG" alt="Register an application form" width={800} height={500} layout="responsive" />
          </div>
        </div>
      </div>

      {/* --- Step 3 --- */}
      <div style={styles.stepContainer}>
        <div style={styles.textColumn}>
          <h2 style={styles.stepHeading}>3. Copy Essential IDs</h2>
          <p style={styles.stepParagraph}>
            On the application's overview page, copy the **Application (client) ID** and **Directory (tenant) ID**. These are required for authentication.
          </p>
        </div>
        <div style={styles.imageColumn}>
           <div style={styles.imageWrapper}>
            <Image src="/deploy_tutorial/step 3.JPG" alt="Application overview with Client and Tenant IDs" width={800} height={500} layout="responsive" />
          </div>
        </div>
      </div>

      {/* --- Step 4 --- */}
      <div style={styles.stepContainerReverse}>
        <div style={styles.textColumn}>
          <h2 style={styles.stepHeading}>4. Create a Client Secret</h2>
          <p style={styles.stepParagraph}>
            Navigate to **Certificates & secrets**. Click **+ New client secret**, give it a description, and click **Add**.
          </p>
          <p style={styles.stepParagraph}>
            **Important:** Immediately copy the **Value** of the new secret. You will **not** be able to see it again after leaving this page.
          </p>
        </div>
        <div style={styles.imageColumn}>
          <div style={styles.imageWrapper}>
            <Image src="/deploy_tutorial/step 4.JPG" alt="Certificates and secrets page" width={800} height={400} layout="responsive" />
          </div>
        </div>
      </div>

      <Link href="/management/provisioner" style={styles.link}>
        &larr; Back to Provisioner
      </Link>
    </div>
  );
}