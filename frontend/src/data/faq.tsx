import * as React from 'react'

const faq = {
  title: 'Frequently asked questions',
  // description: '',
  items: [
    {
      q: 'Can I deploy my infrastructure with SkyLock?',
      a: (
        <>
          Yes, select the resources, cloud provider, and regulatory frameworks. Once processed, you can download the Terraform/IaC files or deploy them with one click.
          <br />
          (A policy with the appropriate permissions must 
          be created in your environment)
        </>
      ),
    },
    {
      q: 'What frameworks does SkyLock support?',
      a: (
        <>
          SkyLock supports a growing list of regulatory frameworks including HIPAA, PCI-DSS, GDPR, NIST CSF, and more.
          <br />
          (Custom frameworks can also be uploaded in PDF format.)
        </>
      ),
    },
    {
      q: 'How does SkyLock ensure compliance?',
      a: (
        <>
          SkyLock uses AI to extract rules from compliance documents, maps them to cloud provider services, and generates Terraform to enforce those rules.
          <br />
          (You can compare your infrastructure against these baselines for coverage.)
        </>
      ),
    },
    {
      q: 'Can I upload my own Terraform or IaC files?',
      a: (
        <>
          Yes. You can upload your own IaC templates (e.g., Terraform) and SkyLock will compare them against secure baselines.
          <br />
          (Any configuration gaps are highlighted and scored.)
        </>
      ),
    },
     {
      q: 'Does SkyLock support all major cloud providers?',
      a: (
        <>
          Currently, SkyLock supports AWS, Azure, and GCP, with cloud-specific mappings and Terraform generation for each.
          <br />
          (Multi-cloud support is also available.)
        </>
      ),
    },
    {
      q: 'What happens if my infrastructure is not fully compliant?',
      a: (
        <>
          SkyLock shows you a compliance score, flags gaps, and lets you choose recommended patches.
          <br />
          (You can regenerate a fixed Terraform or selectively apply the changes.)
        </>
      ),
    },
    {
      q: 'Who are the primary stakeholders that can use SkyLock?',
      a: (
        <>
          SkyLock is designed for cross-functional teams, including:
          <br />
            Cloud Security Architects – to define and enforce compliance baselines.
          <br />
            DevOps & Platform Engineers – to deploy secure infrastructure using IaC.
          <br />
            CISOs & Security Teams – to monitor drift, validate controls, and manage risk.
          <br />
            Compliance Officers & Auditors – to validate alignment with regulatory frameworks.
          <br />
            Startup CTOs / Founders – to ensure security without hiring large compliance teams.
          <br />
          (Whether you're a startup or enterprise, SkyLock provides role-specific value and automation.)
        </>
      ),
    },
    {
      q: 'Which industries can benefit from using SkyLock?',
      a: (
        <>
          SkyLock is ideal for any industry that handles sensitive data and is subject to compliance regulations. These include:
          <br />
            Healthcare (HIPAA, HITECH)
          <br />
            Finance & FinTech (PCI-DSS, SOX)
          <br />
            eCommerce & Retail (GDPR, CCPA)
          <br />
            Government & Defense (NIST, FedRAMP)
          <br />
            Legal & Consulting Firms (client data confidentiality)
          <br />
          (SkyLock ensures infrastructure is secure and aligned with required compliance frameworks from day one.)
        </>
      ),
    },
  ],
}

export default faq
