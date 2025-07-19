🌟 Compliance Rule Ingestion Pipeline
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 1.1 Overview and Purpose  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

The Compliance Rule Ingestion Pipeline is a core module of our AI-Driven Cloud Compliance Tool that automates the ingestion, extraction, structuring, and vectorization of compliance rules from uploaded documents (PDF/text) into a searchable, scalable, and audit-ready system.

✅ It bridges the gap between static compliance frameworks (PCI DSS, HIPAA, GDPR, NIST) and actionable enforcement in your cloud environments.

✅ The pipeline leverages LLM-powered extraction (Ollama) + Qdrant vector database + structured JSON parsing to transform complex compliance texts into machine-readable, queryable data.

✅ By automating ingestion, it reduces manual error, increases compliance visibility, and accelerates your organization's journey to continuous compliance readiness.


🎯 1.2 Audience and Scope  🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯  

This documentation is crafted for:

✅ DevOps Engineers & SREs: to deploy, operate, and monitor the pipeline.

✅ Backend & API Developers: to extend, customize, and integrate APIs.

✅ Compliance Teams & Auditors: to understand ingestion outputs for validation.

✅ AI Engineers & Data Scientists: to adapt and improve the LLM-based extraction pipeline.

✅ Technical Product Managers: to align pipeline capabilities with product goals.

📌 Scope: 📌📌📌📌📌📌📌📌📌📌

The scope includes installation, architecture, user workflows, troubleshooting, and enabling seamless onboarding and mastery of the pipeline.

🛡️ 1.3 Compliance Frameworks Supported  🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️ 

The pipeline is designed to support ingestion from multiple compliance frameworks, including but not limited to:

✅ PCI DSS (Payment Card Industry Data Security Standard) --------------  ✅ ISO 27001 

✅ GDPR                                                   --------------  ✅ NIST 800-53 & 800-171

✅ HIPAA (Health Insurance Portability and Accountability Act)  --------  ✅ SOC 2

The pipeline architecture is modular, allowing the addition of new frameworks easily as your organization's compliance needs evolve.


🏗️ 2. System Architecture
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 2.1 High-Level Architecture Diagram  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

User ➡️ Upload Document

          ⬇️

  Flask API Service (`app.py`)

          ⬇️

   LLM Extraction Service (Ollama)

          ⬇️

   JSON Structuring & Validation

          ⬇️
       Vectorization

          ⬇️

    Qdrant Vector DB

          ⬇️

  Status Updates via RabbitMQ

          ⬇️

 Real-Time Frontend Dashboard

🧬 2.2 Compliance Rule Ingestion Pipeline - UML Diagram  🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬

This diagram shows how a compliance document (PDF/TXT) is uploaded by a user, processed to extract structured compliance rules, stored in your vector database, and status updates are published for tracking in your system.

![Compliance Rule Ingestion Pipeline UML Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/62017cfc2cbdf9a7eb6f06c5edf05bdf636a29c8/docs/development/documentation/backend-docs/diagrams/Compliance%20Rule%20Ingestion%20Pipeline%20-%20UML%20Diagram.png)


🎯 2.3 Compliance Rule Ingestion Pipeline - Component Diagram  🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

This diagram shows the architectural components and their interactions for your pipeline that ingests compliance documents, parses them, extracts structured rules, stores them, and updates the user with status.

![Compliance Rule Ingestion Pipeline Component Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/62017cfc2cbdf9a7eb6f06c5edf05bdf636a29c8/docs/development/documentation/backend-docs/diagrams/Compliance%20Rule%20Ingestion%20Pipeline%20-%20Component%20Diagram.png)


⚡ 2.4 Compliance Rule Ingestion Pipeline - Deployment Diagram  ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡

This diagram shows how our pipeline components are physically deployed and communicate, emphasizing technology, ports, and containerized structure for your compliance rule ingestion system.

![Compliance Rule Ingestion Pipeline Deployment Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/62017cfc2cbdf9a7eb6f06c5edf05bdf636a29c8/docs/development/documentation/backend-docs/diagrams/Compliance%20Rule%20Ingestion%20Pipeline%20-%20Deployment%20Diagram%20(Technolgy%20Focus).png)


🛠️ 2.5 Core Components   🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️
 
 | 🌟 Component                  |      Description                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------- |
| **Flask API Service (`app.py`)**  | Exposes `/upload` endpoint to receive PDF/text documents for processing.          |
| **LLM Extraction Service**        | Calls **Ollama** to extract structured compliance rules from uploaded documents.  |
| **JSON Structuring & Validation** | Ensures extracted rules conform to the structured JSON schema before insertion.   |
| **Vectorization Layer**           | Transforms structured text into embeddings for semantic search.                   |
| **Qdrant Vector Database**        | Stores embeddings and metadata, enabling high-speed, accurate semantic retrieval. |
| **RabbitMQ (Event Bus)**          | Publishes ingestion status updates for dashboard visibility.                      |
| **Frontend Dashboard (Next.js)**  | Displays ingestion status and progress, offering real-time transparency to users. |

 
🧩 2.6 Data Flow  🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩

1️⃣ Upload:
User uploads a compliance document via the frontend or API.

2️⃣ Preprocessing:
The Flask service reads the document, performs lightweight cleanup, and streams the content to the LLM extraction engine.

3️⃣ LLM Extraction:
Ollama parses the document, extracts compliance rules, and returns structured content (rule titles, descriptions, references, frameworks).

4️⃣ JSON Structuring & Validation:
Content is validated against a JSON schema ensuring consistency and completeness.

5️⃣ Vectorization:
Extracted rules are converted into embeddings using the Ollama model, preparing them for semantic search.

6️⃣ Storage in Qdrant:
Embeddings and metadata are upserted into Qdrant, organized under relevant collections and partitions.

7️⃣ Status Updates:
Each step's status is published to RabbitMQ, which the frontend consumes to show live ingestion progress.


🚀 2.7 Technology Stack  🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

| 🔹 **Technology**    | **Role**                                      |
| -------------------- | --------------------------------------------- |
| **Python (Flask)**   | Backend ingestion and orchestration           |
| **Ollama**           | LLM-powered rule extraction and vectorization |
| **Qdrant**           | Vector database for semantic retrieval        |
| **RabbitMQ**         | Real-time event streaming                     |
| **Next.js (React)**  | Frontend ingestion UI                         |
| **Docker & Compose** | Containerized, consistent deployment          |


⚙️ 2.8 API & Interface Points ⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️

✅ POST /upload – Accepts documents (PDF/text) for ingestion.
✅ GET /status/<document_id> – Retrieves ingestion progress for a specific document.
✅ WebSocket via RabbitMQ – Streams real-time ingestion status to subscribed frontend clients.


🌿 3 Installation and Setup
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

3.1 ⚙️ Prerequisites ⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️

Before installation, ensure the following are in place:

✅ System Requirements
                            OS: Ubuntu 20.04 LTS / macOS 13+ / Windows 11 WSL2
                            RAM: 8GB minimum, 16GB recommended
                            Disk: 20GB free space
                            Docker & Docker Compose installed

✅ Software Dependencies
                            Docker (v24+)
                            Docker Compose (v2.23+)
                            Node.js (v18+)
                            Python (v3.11+)
                            Git

✅ Network & Permissions
                            Open ports:
                            3000 (Frontend)
                            3030 (Document Preprocess API)
                            11434 (Ollama LLM)
                            6333, 6334 (Qdrant)
                            3306 (MySQL)

✅ Ability to create and manage Docker containers.

3.2 🐳 Docker-Based Installation  🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳

Preferred installation method is using Docker and Docker Compose for a clean, isolated, and replicable environment.

📄 Step 1: Clone the Repository
                            ![git clone https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA.git]()
                            ![cd ad-astra-compliance-pipeline]()

📄 Step 2: Verify Environment Variables
Check and configure:
                            .env files (if used)
                            docker-compose.yaml configurations (uploaded already)
                            Ensure environment variables for:
                                          ![MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE]()
                                          ![QDRANT_HOST, QDRANT_PORT]()
                                          ![Flask and frontend environment configurations]()


📄 Step 3: Build and Run
                            docker-compose up --build

This will:

✅ Pull and build:
                            Frontend Next.js UI
                            Flask Document Preprocessing API
                            Ollama LLM container
                            Qdrant Vector DB
                            MySQL

✅ Configure networking between containers

✅ Automatically expose relevant ports

📄 Step 4: Verify Running Containers

                                   docker ps

You should see containers for:

                                   frontend
                                   document_preprocess
                                   qdrant
                                   mysql
                                   ollama


3.3 🖥️ Local Development Setup  🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️

If you prefer running services individually for debugging and contribution:

✅ Frontend (Next.js)

                            cd frontend
                            npm install
                            npm run dev
                            ![Accessible at: http://localhost:3000]()


✅ Flask Document Preprocess API

                            cd backend/document_preprocess
                            pip install -r requirements.txt
                            flask run --host=0.0.0.0 --port=3030


✅ Qdrant

              Run using Docker:

                            docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant


✅ Ollama LLM

       Run using Docker:

                            docker run -p 11434:11434 ollama/ollama


✅ MySQL

Run using Docker:
                            docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=adastra -e MYSQL_USER=adastra -e MYSQL_PASSWORD=adastrapass mysql:8.0


3.4 🚦 Checklist  🚦🚦🚦🚦🚦🚦🚦🚦🚦🚦

Verify system readiness:

✅ Frontend

                            Open http://localhost:3000
                            Verify login and document upload panel loads

✅ API

Test Flask API health endpoint:

                            curl http://localhost:3030/health
                            Expect {"status": "healthy"}


✅ Qdrant

                            Visit http://localhost:6333/dashboard

✅ Ollama

Test LLM processing using:

                            curl http://localhost:11434

✅ MySQL

Connect using a DB client with credentials:


                            host: localhost
                            user: adastra
                            password: adastrapass
                            db: adastra


✨ 4: User Guide  --- Compliance Rule Ingestion Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

4.1 🚀 Getting Started  🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

4.1.1 🖥️ Navigating the User Interface 🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️

✅ The frontend provides a clean dashboard displaying:
                            Upload panel for compliance documents.
                            Live OCR progress indicators.
                            Status of rule extraction in real-time.
                            Access to vector search and rule management.

✅ Users log in using their credentials (integrated with the broader platform’s RBAC and authentication).

✅ The side navigation bar includes:
                            Upload Documents
                            Monitor Rule Extraction
                            Search Rules
                            View Compliance Status
                            Manage Extracted Rules

4.1.2 📂 How to Upload Compliance Documents  📂📂📂📂📂📂📂📂📂📂

✅ Step-by-step:
                            1️⃣ Navigate to the Upload Panel.
                            2️⃣ Click “Upload Document”.
                            3️⃣ Select the PDF, DOCX, or TXT compliance document.
                            4️⃣ Choose the framework type (PCI DSS, HIPAA, GDPR, etc.) from a dropdown.
                            5️⃣ Click “Start Ingestion”.

✅ A real-time progress bar will show OCR and chunking status.

✅ On completion, you will see:
                            Extracted rule points summary.
                            Ingestion confirmation with a unique document ID.

4.2 🧩 Understanding Rule Extraction and Ingestion 🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩

✅ The system:
                            Performs OCR (if needed) on scanned documents.
                            Chunks and tokenizes the document.
                            Passes chunks to the Ollama LLM for rule extraction.
                            Stores extracted structured rules in:
                                                 Qdrant Vector Database for semantic search.
                                                 MySQL for structured rule management.

✅ Users can view:
                            Rule ID
                            Extracted compliance requirement
                            Related framework section
                            Vector embeddings reference
                            Status of validation

4.3 📊 Interpreting Compliance Status and Results 📊📊📊📊📊📊📊📊📊📊

✅ Once ingestion completes:

Navigate to “Compliance Status”.
Filter results by:
                            Document
                            Framework type
                            Status (Validated, Pending Review, Error)

✅ Color-coded indicators:
🟢 Validated
🟡 Pending Review
🔴 Error (requires user intervention)

✅ Click any rule to:
                            View extracted details.
                            Manually adjust or confirm mappings.
                            Add notes for context.

4.4 🔎 Conducting Vector-based Searches 🔎🔎🔎🔎🔎🔎🔎🔎🔎🔎

✅ Navigate to “Search Rules”.
✅ Enter a compliance question or keyword:
              “What are the data retention requirements for GDPR?”
✅ The system:
              Transforms the query into an embedding vector.
              Searches Qdrant for semantically similar rules.
              Displays top N results with:
                            Matching rule
                            Framework reference
                            Similarity score

✅ Users can:
              Export search results.
              Save queries for repeated compliance checks.
              Use results for compliance audits or control assessments.

4.5 🛠️ Managing and Updating Extracted Rules  🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️

✅ Navigate to “Manage Extracted Rules”.
✅ For each rule:
                            View and edit extracted content.
                            Adjust framework linkage if needed.
                            Add additional metadata or notes.
                            Flag rules for review or validation.
                            Archive deprecated or irrelevant rules.

✅ Users can batch-update rules for:
                            Framework updates.
                            Organizational policy changes.
                            Post-audit compliance corrections.

✅ All updates are logged for audit trails.


🛠️ 5: Troubleshooting Guide --- Compliance Rule Ingestion Pipeline deployment
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

5.1 🧩 Common Issues and Solutions 🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩

✅ Issue: OCR does not complete or fails midway.
              💡 Solution:
                            Ensure the document is clear, high-contrast, and non-password protected.
                            Check document_preprocess container logs for Tesseract or chunking errors.
                            Verify sufficient memory allocation in the Docker container.

✅ Issue: No rules are extracted after ingestion.
              💡 Solution:
                            Confirm the document matches supported formats (.pdf, .docx, .txt).
                            Check LLM integration (ollama logs) for token or request issues.
                            Verify that the pipeline chunking does not exceed max token limits.

✅ Issue: Vector search returns no results.
              💡 Solution:
                            Ensure the qdrant container is running and healthy.
                            Validate that embeddings were successfully generated and upserted.
                            Re-run ingestion for the affected document.

✅ Issue: API requests time out.
              💡 Solution:
                            Check container resource allocation.
                            Verify network connectivity between containers in the Docker network.
                            Inspect document_preprocess logs for slow database or LLM calls.

✅ Issue: Frontend dashboard does not reflect updated statuses.
              💡 Solution:
                            Refresh frontend, clear cache if needed.
                            Ensure WebSocket connection is active for real-time updates.
                            Check backend API logs for payload delivery failures.

5.2 🛑 Diagnosing API Errors  🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑

✅ Checklist:

🔸 Inspect returned HTTP codes:
              400: Invalid request or missing parameters.
              401: Authentication failure, check tokens and login flow.
              500: Server error, review logs.

🔸 Verify API endpoint availability:
              Confirm /upload-document, /rules-status, /vector-search, and /update-rule are live.
              Use curl or Postman for direct testing.

🔸 Check payload structure:
              Ensure JSON body matches the API schema.
              Use known working examples for comparison.

✅ Advanced Debugging:
              Enable verbose logging in the backend temporarily for deeper inspection.
              Cross-check docker-compose.yaml exposed ports and internal network bindings.

5.3 📄 Docker and Container Logs Analysis  📄📄📄📄📄📄📄📄📄📄

✅ Use the following to review logs:

                            docker-compose logs -f document_preprocess
                            docker-compose logs -f qdrant
                            docker-compose logs -f ollama
                            docker-compose logs -f frontend

✅ What to look for:
              ERROR or Traceback in Python logs (document_preprocess).
              Connection errors between document_preprocess and qdrant or mysql.
              LLM request timeouts in ollama.
              Memory or CPU throttling indicators.

✅ Use docker stats to monitor container resource utilization.

If repeated failures occur, consider restarting containers:

                            docker-compose restart document_preprocess


5.4 🗄️ Database Connectivity and Query Issues  🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️🗄️

✅ MySQL Troubleshooting:
                            Ensure mysql service is running: docker-compose ps.


Connect using a MySQL client to verify:
                            mysql -u adastra -padastrapass -h 127.0.0.1 -P 3306


Check if the adastra database and tables exist.
Inspect mysql logs for authentication failures or query errors.


✅ Qdrant Troubleshooting:

                            Check Qdrant health at http://localhost:6333/health.
                            Use the Qdrant HTTP API to confirm collections are present:

              curl http://localhost:6333/collections

Confirm embeddings are stored and retrievable using collection and vector IDs.


5.5 🧠 Debugging LLM Integration Problems  🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠

✅ If rule extraction is not functioning:
                            Check ollama container logs for rate-limiting or request failures.
                            Confirm model availability (ollama should have the required models pulled and ready).
                            Validate payload size (tokens per chunk) and adjust if exceeding LLM limits.
                            Retry ingestion with a smaller document for controlled testing.

✅ Testing the LLM in isolation:

Manually send a test chunk to the LLM endpoint to validate:

curl -X POST http://localhost:11434/your-llm-endpoint -d '{"text":"Sample compliance chunk"}'


❓ 6: Frequently Asked Questions (FAQs) -- Compliance Rule Ingestion Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

This section consolidates common, technical, and compliance-related questions to support rapid onboarding, troubleshooting, and user confidence while using the Compliance Rule Ingestion Pipeline.


6.1 🌍 General FAQs 🌍🌍🌍🌍🌍🌍🌍🌍🌍🌍

✅ Q: What is the purpose of the Compliance Rule Ingestion Pipeline?
A: It automates the extraction, structuring, and vectorization of compliance rules from frameworks (e.g., PCI DSS, HIPAA) for continuous compliance monitoring, reducing manual interpretation efforts and audit preparation time.

✅ Q: Who can use this pipeline?
A: Compliance teams, DevSecOps engineers, cloud security analysts, and auditors who manage regulatory frameworks across cloud environments.

✅ Q: What document formats are supported for ingestion?
A: .pdf, .docx, .txt, and .md. Additional formats can be added during advanced pipeline customization.

✅ Q: Does this pipeline work with real-time compliance checks?
A: Yes, ingested rules are stored in Qdrant for real-time vector similarity searches, allowing automated enforcement in CI/CD or cloud posture management.

✅ Q: Can I use this system without advanced technical knowledge?
A: Yes, with Docker setup and API/UI guidance, non-technical compliance teams can use the system with minimal support.


6.2 🛠️ Technical FAQs 🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️

✅ Q: How do I check if the ingestion pipeline is running correctly?
A: Run docker-compose ps to confirm service statuses, and docker-compose logs -f document_preprocess for live logs.

✅ Q: How can I test the API endpoints?
A: Use Postman, curl, or your frontend interface to hit endpoints such as /upload-document and /rules-status with appropriate payloads.

✅ Q: Where are the rules stored after ingestion?
A: Extracted rules are stored:
                            As vectors in Qdrant (http://localhost:6333)
                            In structured relational data in MySQL (adastra database)

✅ Q: What happens if an ingestion fails?
A: The system logs the error, and the document remains unprocessed. Review container logs for document_preprocess, correct issues, and re-ingest.

✅ Q: Can I modify the pipeline to use another LLM model?
A: Yes, update your ollama configuration or modify API calls to your preferred LLM endpoint. See Part 8: Advanced Topics for detailed steps.

✅ Q: How are documents chunked for LLM processing?
A: Documents are split into token-based chunks suitable for the LLM context window, ensuring complete rule extraction without truncation.

✅ Q: How do I back up my pipeline data?
A: Backup MySQL and Qdrant volumes using:
                            docker cp <container_id>:/path/to/data .

or leverage cloud volume snapshots for consistency.

6.3 🛡️ Compliance and Security FAQs 🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️

✅ Q: Is the data encrypted during storage and transit?
A: Transit encryption is recommended via reverse proxies or VPN, and Qdrant/MySQL can be configured for at-rest encryption depending on your security posture.

✅ Q: Does the pipeline store personal or sensitive information?
A: It stores compliance rule data, which may contain policy-sensitive data but typically does not include PII unless present in the documents ingested.

✅ Q: Can we control who accesses the ingestion pipeline?
A: Yes, secure API endpoints with authentication (JWT, OAuth) and limit Docker host access to authorized personnel.

✅ Q: How do we ensure compliance with internal policies?
A: Configure retention policies on the database, ensure controlled access, and integrate the ingestion pipeline with your cloud compliance monitoring for real-time policy enforcement.

✅ Q: What compliance frameworks are supported out of the box?
A: PCI DSS, HIPAA, GDPR, NIST CSF, and ISO 27001 documents can be ingested. Support for others can be added via LLM prompt engineering or pipeline extension.

✅ Q: Can this system help with audits?
A: Yes, by maintaining an up-to-date vectorized database of compliance requirements, your teams can rapidly respond to audit queries and track control coverage.

❓ 7: Appendices
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The appendices provide detailed supporting information to complement the Compliance Rule Ingestion Pipeline, ensuring clarity, operational continuity, and advanced references for engineers and compliance specialists.


7.1 🗂️ Glossary of Terms 🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️

| **Term**                       | **Definition**                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| **Compliance Framework**       | Structured set of guidelines (e.g., PCI DSS, HIPAA) for data protection and governance. |
| **LLM (Large Language Model)** | AI model used for extracting structured compliance rules from documents.                |
| **Vectorization**              | The process of converting text into numerical vectors for semantic search.              |
| **Qdrant**                     | Open-source vector database storing compliance rules for similarity searches.           |
| **Ollama**                     | Local or cloud-based LLM engine for processing document chunks.                         |
| **Chunking**                   | Splitting documents into smaller parts for LLM context processing.                      |
| **CI/CD**                      | Continuous Integration/Continuous Deployment pipeline integration.                      |
| **Sanity Check**               | Quick test to confirm system readiness post-deployment.                                 |


7.2 📚 Third-Party Libraries and Licenses 📚📚📚📚📚📚📚📚📚📚

| **Library/Tool**    | **Usage in Pipeline**                  | **License**                 |
| ------------------- | -------------------------------------- | --------------------------- |
| `Qdrant`            | Vector database for compliance rules   | Apache 2.0                  |
| `Ollama`            | LLM-based document processing          | Varies (Self-hosted or API) |
| `MySQL`             | Relational storage for structured data | GPL v2                      |
| `Docker`            | Containerization and orchestration     | Apache 2.0                  |
| `Socket.IO`         | WebSocket real-time updates            | MIT                         |
| `React`, `Next.js`  | Frontend architecture                  | MIT                         |
| `D3.js`, `Recharts` | Data visualization in dashboards       | BSD/MIT                     |
| `Shadcn/UI`         | UI components for frontend             | MIT                         |
| `Zod`               | Schema validation                      | MIT                         |



7.3 🔗 Useful Links and Resources 🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗

✅ Official Project Repository: https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/tree/dev
✅ Qdrant Documentation: https://qdrant.tech/documentation/
✅ Ollama LLM Guide: https://ollama.com/docs
✅ Docker Official Docs: https://docs.docker.com
✅ Next.js Documentation: https://nextjs.org/docs
✅ Zod Schema Validation: https://zod.dev
✅ React Official Docs: https://react.dev
✅ MIT License Reference: https://opensource.org/licenses/MIT