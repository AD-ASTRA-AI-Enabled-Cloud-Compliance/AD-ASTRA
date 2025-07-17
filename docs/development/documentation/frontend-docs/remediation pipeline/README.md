🌟 Remediation Pipeline 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 1.1 Purpose and Benefits  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

The Remediation Pipeline is engineered to automate the assessment of cloud environments against compliance frameworks while enabling immediate remediation of detected violations.

✨ Benefits: 

                🟢 Continuous Compliance: Automates evaluations, reducing risks of drifting from standards.
                ⚡ Accelerated Remediation: Enforces compliance at the pace of development, reducing audit failures.
                📈 Operational Efficiency: Frees engineers from repetitive remediation tasks.
                🌟 Trust and Visibility: Builds a transparent compliance posture with clear, actionable insights.
                📌 Framework Flexibility: Adaptable to NIST, CIS Benchmarks, PCI DSS, HIPAA, and organizational policies.

                
🧩 1.2 Audience and Scope

This documentation is crafted for:
                ✅ DevOps Engineers: Automate and enforce compliance within CI/CD.
                ✅ Cloud Architects: Validate infrastructure against frameworks.
                ✅ Security & Compliance Teams: Monitor posture and ensure audit readiness.
                ✅ CTOs & Stakeholders: Gain high-level visibility into compliance health.

📌 Scope: 📌📌📌📌📌📌📌📌📌📌

This pipeline covers focuses on cloud infrastructure and IaC compliance evaluations:

                        ✅ Automates remediation steps post evaluation.
                        ✅ Designed to integrate with existing CI/CD pipelines, dashboards, and reporting tools.
                        ✅ Supports multi-cloud environments (AWS, Azure, GCP)


📚 1.3 Key Concepts and Terminologies  📚📚📚📚📚📚📚📚📚📚

                ✅ Compliance Evaluation: Process of comparing environment configurations and resources against regulatory or organizational policies.
                ✅ Remediation: Automated or manual correction of compliance violations to align with policies.
                ✅ Framework Profiles: Defined sets of rules (PCI DSS, HIPAA, NIST, CIS) used as evaluation baselines.
                ✅ Evaluation Trigger: Events (example., new deployment, PR merge, scheduled scan) that initiate compliance checks.
                ✅ Compliance Dashboard: UI component displaying the current state of compliance across resources and the results of remediation actions.
                ✅ Remediation Actions: Corrective steps applied to infrastructure or code to fix detected violations, often using IaC templates, RBAC adjustments, or direct API calls.
                ✅ Status Artifacts: JSON or YAML output files representing the results of compliance scans for traceability and audits.

🛡️ 1.4 Compliance Frameworks Supported  🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️ 

The Remediation Pipeline currently supports the following frameworks, with modular extension capability:

✅ PCI DSS (Payment Card Industry Data Security Standard)                       ✅ NIST 800-53 & 800-171
✅ HIPAA (Health Insurance Portability and Accountability Act)                  ✅ CIS Benchmarks
✅ GDPR (General Data Protection Regulation)

🏗️ 2. System Architecture
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 2.1 High-Level Architecture Diagram  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

+---------------------------+
|      User Interface       |
| (Compliance Dashboard UI) |
+-----------+---------------+
            |
            v
+---------------------------+
|  Compliance Evaluation    |
|        Engine              |
| (Evaluation Logic, Rules) |
+-----------+---------------+
            |
            v
+---------------------------+
|     Remediation Engine    |
|  (IaC Patcher, RBAC Fix)  |
+-----------+---------------+
            |
            v
+---------------------------+
|    Notification System    |
|   (Status, Errors, Logs)  |
+---------------------------+

✨ 2.2 Components Breakdown ✨✨✨✨✨✨✨✨✨✨✨✨

🖥️ 2.2.1 React Frontend & Compliance Dashboard 🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️

                                ✅ Displays compliance evaluation results.
                                ✅ Allows users to initiate evaluations and remediation.
                                ✅ Shows status updates and progress indicators.
                                ✅ Uses react-query and Zustand for state management.

🛠️ 2.2.2 Evaluation Engine 🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️

                                ✅ Core logic for validating resources against compliance rules.
                                ✅ Supports event-based triggers (PR merges, deployments, schedules).
                                ✅ Generates structured JSON reports with evaluation results.

🪄 2.2.3 Remediation Engine 🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄

                                ✅ Generates IaC patches.
                                ✅ Can execute direct API calls for remediation.
                                ✅ Supports approval gates before auto-remediation.

🔔 2.2.4 Notification and Logging 🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔

                        ✅ Slack, Teams, or Email notifications on compliance changes.
                        ✅ Logs status updates for audit trails.
                        ✅ Integrates with Metrics & Reporting Pipeline for historical trend analysis.


🧬 2.3 Remediation Pipeline - UML Diagram  🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬

This diagram models the end-to-end sequence flow from a user viewing compliance status to triggering automated remediation. It shows interactions between user, API gateway, evaluation and remediation services, and backend components.

![Remediation Pipeline UML Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/timmy/docs/development/documentation/frontend-docs/remediation%20pipeline/diagrams/Remediation%20Pipeline%20-%20UML%20Diagram.png)


🎯 2.4 Remediation Pipeline  - Component Diagram  🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

This diagram maps out the key components, services, databases, and external systems involved in your end-to-end compliance evaluation and remediation pipeline, highlighting data flow, interactions, and communication patterns across backend, frontend, and external layers.

![Remediation Pipeline Component Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/62017cfc2cbdf9a7eb6f06c5edf05bdf636a29c8/docs/development/documentation/frontend-docs/remediation%20pipeline/diagrams/Remediation%20Pipeline%20-%20Component%20Diagram.png)


⚡ 2.5 Remediation Pipeline - Deployment Diagram  ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡

This diagram presents how the remediation system is physically structured and deployed in a containerized cloud environment, with an emphasis on real-time infrastructure scanning, policy enforcement, and user interaction.

![Remediation Pipeline - Deployment Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/62017cfc2cbdf9a7eb6f06c5edf05bdf636a29c8/docs/development/documentation/frontend-docs/remediation%20pipeline/diagrams/Remediation%20Pipeline%20deployment%20diagram.png)


🌿 3 Installation and Setup
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

