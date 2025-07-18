"use client"

import PolicyLayout from "@/components/policy-layout"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function TermsPage() {
  const handleDownload = () => {
    const content = `SkyLock Terms of Service
Effective Date: July 18, 2025

1. Acceptance of Terms
By accessing our platform, you agree to be bound by these terms.

2. Use of the Service
- Only use the tool for lawful compliance auditing
- No reverse engineering or unauthorized access
- Do not share credentials or data without consent

3. Cloud Credential Usage
If you connect cloud accounts, you consent to temporary credential access for security scanning.
Credentials are encrypted and never used outside your authorization scope.

4. Termination
We may suspend access for misuse, fraud, or violations of our platform terms.

5. Liability Disclaimer
Our platform provides best-effort security scanning and compliance reports.
However, we are not liable for damages caused by misconfiguration, third-party platforms, or unaddressed compliance gaps.

6. Jurisdiction
This agreement is governed by the laws of Ontario, Canada.

7. Contact
Email us at support@skylock.com with any questions.
`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "SkyLock-Terms-of-Service.txt"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PolicyLayout title="Terms of Service">
      {/* Download button */}
      <div className="flex justify-end">
        <Button onClick={handleDownload} className="mb-2">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Actual terms content */}
      <p>Effective Date: July 18, 2025</p>

      <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
      <p>By accessing our platform, you agree to be bound by these terms.</p>

      <h2 className="text-xl font-semibold mt-4">2. Use of the Service</h2>
      <ul className="list-disc ml-6">
        <li>Only use the tool for lawful compliance auditing</li>
        <li>No reverse engineering or unauthorized access</li>
        <li>Do not share credentials or data without consent</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. Cloud Credential Usage</h2>
      <p>
        If you connect cloud accounts, you consent to temporary credential access for security scanning. Credentials are encrypted
        and never used outside your authorization scope.
      </p>

      <h2 className="text-xl font-semibold mt-4">4. Termination</h2>
      <p>We may suspend access for misuse, fraud, or violations of our platform terms.</p>

      <h2 className="text-xl font-semibold mt-4">5. Liability Disclaimer</h2>
      <p>
        Our platform provides best-effort security scanning and compliance reports. However, we are not liable for damages caused
        by misconfiguration, third-party platforms, or unaddressed compliance gaps.
      </p>

      <h2 className="text-xl font-semibold mt-4">6. Jurisdiction</h2>
      <p>This agreement is governed by the laws of Ontario, Canada.</p>

      <h2 className="text-xl font-semibold mt-4">7. Contact</h2>
      <p>
        Email us at <a href="mailto:support@skylock.com" className="underline">support@skylock.com</a> with any questions.
      </p>
    </PolicyLayout>
  )
}
