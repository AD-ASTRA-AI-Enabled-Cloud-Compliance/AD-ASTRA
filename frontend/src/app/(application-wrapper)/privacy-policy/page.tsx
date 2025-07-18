"use client"

import PolicyLayout from "@/components/policy-layout"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function PrivacyPage() {
  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob(
      [
        `SkyLock Privacy Policy\nEffective Date: July 18, 2025

SkyLock ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information, including sensitive credentials, when you use our platform (the "Service").

1. Information We Collect:
- Personal information (e.g., name, email, company name)
- Usage data (e.g., IP address, browser type)
- Cloud account credentials (IAM keys, secrets, etc.)
- Uploaded compliance files

2. Use of Data:
- Run compliance scans, notify results
- Improve service accuracy
- Send service updates or alerts

3. Cloud Credentials:
- Encrypted at rest and in transit
- Only used for authorized operations
- Revocable by user

4. Retention:
- Data retained during use and for legal audit trail
- Can request permanent deletion

5. Security:
- We use encryption, MFA, and audit logging
- Hosting is in Canada with compliant data centers

6. Legal Compliance:
- We comply with PIPEDA (Canada)
- For international users, we follow GDPR principles

7. Rights:
- Access, correction, deletion, or export of your data
- Withdraw consent for data use at any time

Contact: support@skylock.com
        `,
      ],
      { type: "text/plain" }
    )
    element.href = URL.createObjectURL(file)
    element.download = "skylock-privacy-policy.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <PolicyLayout title="Privacy Policy">
      <div className="flex justify-end">
        <Button onClick={handleDownload} className="mb-4">
          <Download className="w-4 h-4 mr-2" /> Download
        </Button>
      </div>

      <p>Effective Date: July 18, 2025</p>

      <p>
        SkyLock ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your
        information, including sensitive credentials, when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-4">1. Hosting & Jurisdiction</h2>
      <p>
        Our services and all data are hosted in Canada. We comply with Canada's{" "}
        <a href="https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/"
           target="_blank" className="underline text-blue-600 dark:text-blue-400">
          PIPEDA
        </a>{" "}
        regulations. International users are subject to equivalent protections under GDPR principles.
      </p>

      <h2 className="text-xl font-semibold mt-4">2. Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Personal details: name, email, company</li>
        <li>Usage: IP address, browser, activity logs</li>
        <li>Cloud credentials and metadata (IAM, keys, role ARNs)</li>
        <li>Uploaded files (e.g., Terraform, audit results)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. Use of Information</h2>
      <p>We use this data to:</p>
      <ul className="list-disc ml-6">
        <li>Provide automated compliance scanning</li>
        <li>Analyze and generate security posture reports</li>
        <li>Retain audit trails to meet security frameworks</li>
        <li>Notify you of critical compliance issues</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">4. Credential Security</h2>
      <p>
        Credentials are encrypted in transit and at rest using secure key vaults. Only authorized services access them
        temporarily for validation tasks. You may revoke credentials from your dashboard or via email request.
      </p>

      <h2 className="text-xl font-semibold mt-4">5. Data Retention & Control</h2>
      <p>
        User data is stored for the duration of your account and retained for up to 12 months after account deletion, unless
        legally required otherwise. You may request deletion of your data and credentials at any time.
      </p>

      <h2 className="text-xl font-semibold mt-4">6. Rights Under PIPEDA & GDPR</h2>
      <ul className="list-disc ml-6">
        <li>Right to access, correct, or delete your data</li>
        <li>Right to withdraw consent</li>
        <li>Right to data portability (export)</li>
        <li>Right to file a complaint with the Privacy Commissioner of Canada</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">7. Contact Us</h2>
      <p>
        To exercise any rights or ask questions about this policy, email us at{" "}
        <a href="mailto:support@skylock.com" className="underline">
          support@skylock.com
        </a>
        .
      </p>
    </PolicyLayout>
  )
}
