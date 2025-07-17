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
          SkyLock is built for Cloud Security Architects, DevOps Engineers, CISOs, and Compliance Officers — anyone responsible for secure, compliant cloud infrastructure. It’s equally valuable for startups and enterprises.
          <br />
          (Whether you're a startup or enterprise, SkyLock provides role-specific value and automation.)
        </>
      ),
    },
    {
      q: 'Which industries can benefit from using SkyLock?',
      a: (
        <>
        SkyLock supports regulated industries like Healthcare, Finance, eCommerce, and Government with built-in compliance for frameworks like HIPAA, PCI-DSS, and NIST.
          (Skylock is equally effective for any organization aiming to be compliant with these frameworks while securing their cloud infrastructure.)
          <br />
        </>
      ),
    },
  ],
}

export default faq
