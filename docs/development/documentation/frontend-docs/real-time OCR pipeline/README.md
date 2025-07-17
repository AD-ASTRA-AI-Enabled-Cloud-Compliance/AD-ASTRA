🌟 Real-Time OCR & Progress Reporting Pipeline
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 1.1 Purpose and Benefits  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

The Real-Time OCR & Progress Reporting Pipeline empowers users to upload documents and track their OCR processing live, fostering transparency, user trust, and immediate insight into document digitization workflows. Unlike typical “upload and wait” systems, this pipeline streams granular progress updates, showing real-time percentage completion, current processing stages, and instant failure alerts.

✨ Benefits: 
                🟢 Improved User Trust: Users see live activity instead of a spinning loader.
                ⚡ Faster Feedback Loops: Users can identify stalled processes quickly.
                📈 Audit-Friendly: Logs all progress states for traceability.
                🖥️ Smooth UX: Visual indicators maintain user engagement during heavy OCR tasks.

🧩 1.2 Audience and Scope

This documentation is crafted for:
✅ Frontend engineers integrating OCR progress UI.
✅ DevOps & SREs monitoring real-time system responsiveness.
✅ Product managers & QA validating live user experience and expected behaviors.
✅ Technical writers preparing user-facing guides.
✅ Clients and auditors verifying compliance with workflow transparency requirements.

📌 Scope: 📌📌📌📌📌📌📌📌📌📌

This pipeline covers the frontend orchestration layer only for real-time OCR progress, leveraging:
                            ✅WebSocket streams from backend OCR services.
                            ✅React components and hooks for live updates.
                            ✅User-friendly dashboards to visualize document processing stages.
                            ✅It excludes backend OCR extraction logic, focusing instead on user interaction, UI updates, and connection management.

📚 1.3 Key Concepts and Terminologies  📚📚📚📚📚📚📚📚📚📚
                        ✅OCR (Optical Character Recognition): Extraction of machine-readable text from images/PDFs.
                        ✅Progress Events: Structured real-time updates indicating current OCR stage and % completed.
                        ✅WebSocket Streaming: Persistent bi-directional communication to push live data.
                        ✅Frontend Dashboard: The UI layer showing progress bars, logs, and status indicators.
                        ✅Event-driven UI: Frontend components update based on incoming events without polling.

🛡️ 1.4 Supported Document Types  🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️

The pipeline supports OCR progress tracking for:
                            📄 PDF files (scanned documents).
                            🖼️ Image formats (JPEG, PNG, TIFF).
                            📘 Multi-page documents tracked per page and total %.


🏗️ 2. System Architecture
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 2.1 High-Level Architecture Diagram  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

+-----------------+       WebSocket       +------------------------+
| User Dashboard  |<--------------------->| OCR Progress Broadcaster|
+-----------------+                       +------------------------+
         |                                            |
         | REST API (Upload Document)                 |
         V                                            V
+-----------------+                          +---------------------+
| File Upload API |                          | OCR Processing Engine|
+-----------------+                          +---------------------+
                                                      |
                                               Status Updates via
                                               Event Bus/WebSocket
                                                      |
                                              +---------------------+
                                              | Progress Formatter  |
                                              +---------------------+


🟩 User Dashboard (Frontend): React/Next.js interface displaying live OCR progress using websockets and dynamic charts.
🟧 OCR Progress Broadcaster: Backend service broadcasting OCR progress events.
🟦 OCR Processing Engine: Backend service handling document processing and emitting structured progress updates.
🟨 Progress Formatter: Converts backend updates into user-friendly, granular stages before frontend consumption.

🧬 2.2 Real-Time OCR & Progress Reporting Pipeline - UML Diagram  🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬

This diagram shows the sequence of interactions between the user, frontend, backend services etc during the OCR document processing lifecycle, including real-time progress updates and completion notifications.

![Real-Time OCR & Progress Reporting Pipeline UML Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/c37b0dc72806ea26902cb77c3ea8cf3d7aaed074/docs/development/documentation/frontend-docs/real-time%20OCR%20pipeline/diagrams/Real-Time%20OCR%20&%20Progress%20Reporting%20Pipeline%20-%20UML%20Diagram.png)

🎯 2.3 Real-Time OCR & Progress Reporting Pipeline  - Component Diagram  🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

This diagram shows how our pipeline processes document/image uploads with OCR, enriches them optionally with LLM analysis, stores extracted data, and streams real-time progress and status updates to users.

![Real-Time OCR & Progress Reporting Pipeline Component Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/c37b0dc72806ea26902cb77c3ea8cf3d7aaed074/docs/development/documentation/frontend-docs/real-time%20OCR%20pipeline/diagrams/Real-Time%20OCR%20&%20Progress%20Reporting%20Pipeline%20--%20component.png)


⚡ 2.4 Real-Time OCR & Progress Reporting Pipeline - Deployment Diagram  ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡

This diagram illustrates how our OCR pipeline is physically deployed across frontend, backend, and WebSocket servers, emphasizing live progress updates and vector/metadata storage in your real-time OCR processing system.

![Real-Time OCR & Progress Reporting Pipeline Deployment Diagram](https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA/blob/c37b0dc72806ea26902cb77c3ea8cf3d7aaed074/docs/development/documentation/frontend-docs/real-time%20OCR%20pipeline/diagrams/Real-Time%20OCR%20&%20Progress%20Reporting%20Pipeline%20-%20Deployment%20Diagram.png)


🌿 3 Installation and Setup
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ 3.1 Prerequisites ⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️

Before installing the Real-Time OCR & Progress Reporting Pipeline, ensure the following are available:

✅ Docker & Docker Compose --- Already Installed
✅ Node.js 19+ for frontend build and hot reload  --- --- Already Installed
✅ Backend API endpoint (OCR processing endpoint) reachable within your environment
✅ WebSocket port (/api/socketio) open in firewall (default: 3000)
✅ Recommended: Local GPU acceleration if using advanced OCR models 

🐳 3.1.1 Docker & Docker Compose Setup   🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳 

1️⃣ Verify Docker Installation:
                    docker --version
                    docker-compose --version

2️⃣ Clone your repository:
                    git clone https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA.git
                    cd ad-adastra-cloud-compliance


🌍  3.1.2 Environment Variables 🌍🌍🌍🌍🌍🌍🌍🌍🌍🌍🌍

1️⃣ Navigate to:

                        frontend/

2️⃣ Create .env.local:

                        NEXT_PUBLIC_BACKEND_URL=http://localhost:3030
                        NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
                        OCR_MODEL=tesseract


🛠️ 3.2 Step-by-Step Installation Guide  🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️

🐳 3.2.1 Building Docker Images  🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳

In the root directory:
                    docker-compose build frontend
This will:
                    ✅ Install Node dependencies
                    ✅ Run next build inside the container
                    ✅ Prepare for serving via next start in standalone mode

🌿 3.2.2 Launching the Real-Time OCR Pipeline 🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿

Start the pipeline with:

                    docker-compose up -d frontend

Validate with:

                    docker logs -f adastra-frontend

You should see:

                    Ready on http://localhost:3000

✅ The WebSocket and frontend are now live and ready for OCR file uploads.

⚡3.3 Deployment Best Practices  ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡

🔒 Security:
                Use HTTPS and WSS in production.
                Ensure WebSocket connections are authenticated via tokens or session cookies.

🚦 Scalability:
                Use a reverse proxy (Nginx, Traefik) to handle WebSocket upgrades.
                Deploy OCR services separately in microservices if scaling demand.

📈 Performance:
                Enable caching of partial OCR results for large PDFs.
                Use GPU-based OCR for high-volume document ingestion.

🛡️ Monitoring:
                Integrate frontend with Prometheus/Grafana for container health.
                Enable Next.js telemetry for frontend insights (optional).

🧭 4 User Guide – Real-Time OCR & Progress Reporting Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 4.1 Getting Started 🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

🚀 4.1.1 Navigating the User Interface (Frontend Integration) 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

Access the pipeline interface via http://localhost:3000 or your production URL.
The clean, distraction-free dashboard displays:
                        📂 Upload Panel for document ingestion.
                        📊 Real-Time Progress Bar reflecting OCR parsing completion.
                        📝 Live Updates Panel showing processing stages.

Users can drag and drop documents or select files for OCR ingestion.

4.1.2 📂 How to Upload Compliance Documents  📂📂📂📂📂📂📂📂📂📂
            1️⃣ Click on the Upload Document button or drag your PDF/image into the upload area.
            2️⃣ The UI will immediately:
                        Trigger backend OCR processing.
                        Open a progress modal displaying:
                                            Upload progress.
                                            Current processing status (Queued, Processing, Completed).

✅ Supported formats: PDF, PNG, JPEG, TIFF.

🩻 4.2 Understanding Real-Time OCR & Progress 🩻🩻🩻🩻🩻🩻🩻🩻🩻🩻🩻

📡 Once the document is uploaded:
            ✅The OCR processing pipeline:
                            Splits documents into pages.
                            Parses text using the chosen OCR model.
                            Sends incremental updates via WebSocket to the frontend.

            ⚡ Live updates:

                            Processing percentage displayed dynamically.
                            Status messages like:
                                        "Extracting text from page 3/12"
                                        "OCR Complete. Generating structured JSON output."

🖼️ 4.3 Interpreting OCR Results  🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️

Once completed, the UI will display:
                ✅ Text preview of OCR output.
                ✅ Download button for structured JSON output.
                ✅ Summary panel showing:
                                Total pages processed.
                                Time taken.
                                Number of characters extracted.

✅ Users can review and validate OCR output before further compliance ingestion.


🔎 4.4 Using the Live Progress Dashboard 🔎🔎🔎🔎🔎🔎🔎🔎🔎🔎

Real-Time Dashboard Capabilities:
                    Visual progress indicator (circular/linear progress bar).
                    Log view of OCR steps for each page.
                    Visual alerts if OCR errors or skips occur (e.g., unreadable pages).

✅ Users can stop or re-trigger OCR if needed, enabling control during batch processing.

🛠️ 4.5 Managing OCR Processing and Retrying  🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️🛠️

In case of OCR issues:
                    ✅ Users can re-upload the same document to retry.
                    ✅ Use the ‘Clear History’ button to reset the UI before starting a new document.
                    ✅ Check the OCR Logs panel for error explanations (e.g., unsupported format, corrupted page).


🛠️ 5: Troubleshooting Guide --- Real-Time OCR & Progress Reporting Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🩹 5.1 Common Issues and Solutions 🩹🩹🩹🩹🩹🩹🩹🩹🩹🩹

| 🪐 **Issue**                 | 🩺 **Possible Cause**                                    | 🛠️ **Recommended Solution**                                                           |
| ---------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 📄 OCR stuck at 0%           | - Large file size<br>- Connection to OCR service dropped | - Check container logs (`docker logs document_preprocess`).<br>- Split file and retry. |
| ❌ "Unsupported Format" error | File type not supported                                  | Use PDF, PNG, JPEG, TIFF only.                                                         |
| 🕒 Slow processing           | Low system resources                                     | Increase container CPU/memory allocation.<br>Close other heavy processes.              |
| 🛑 WebSocket disconnects     | Network instability                                      | Check local/remote connection stability.<br>Ensure firewall allows WebSocket traffic.  |
| ⚠️ Incomplete JSON output    | OCR skipped unreadable pages                             | Review logs for "Unreadable Page" notices.<br>Rescan with higher quality and retry.    |


🩺 5.2 Diagnosing OCR Processing Errors 🩺🩺🩺🩺🩺🩺🩺🩺🩺🩺

🔍 Steps:
                1️⃣ Run docker ps to confirm containers (document_preprocess, frontend) are running.
                2️⃣ Use docker logs document_preprocess to capture runtime logs:
                                                        Check for Tesseract or OCR engine errors.
                                                        Review logs for MemoryError or TimeoutError.
                3️⃣ Inspect the WebSocket log flow:
                                                        Check for repeated disconnections.
                                                        Validate socket.io connectivity in the browser console.
                4️⃣ Check CPU/Memory consumption using:
                                                    docker stats

✅ To identify if container throttling is occurring during heavy OCR processing.


🧩 5.3 Debugging Live Progress Reporting 🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩

If progress bars do not update:

✅ Confirm WebSocket connection:
                Look for Connected successfully in frontend console.
                Test with a small sample file.

✅ Ensure lastMessage updates in React state (OCRProgress component).
✅ Confirm backend emits progress via socket.emit('ws', { progress: xx }).


📜 5.4 Analyzing Logs 📜📜📜📜📜📜📜📜📜📜📜📜

📌 Where to find logs:

                Frontend:
                        Browser DevTools Console.
                        Network > WS tab for WebSocket frame activity.

                Backend:
                        Run:
                            docker logs document_preprocess
                            
✅ View logs with timestamps, progress updates, OCR completion signals.


🗂️ 5.5 Troubleshooting WebSocket Connectivity 🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️

🧪 Symptoms:
                Real-time progress does not display.
                Dashboard remains static during processing.

🛠️ Actions:
                Confirm correct WebSocket path in frontend (/api/socketio).
                Ensure ports (3000, 3030) are open and not blocked.

                Restart the frontend:
                            docker restart frontend

                Restart OCR backend:
                            docker restart document_preprocess

🪛 5.6 Reprocessing Failed Documents  🪛🪛🪛🪛🪛🪛🪛🪛🪛🪛🪛

If OCR fails mid-processing:
                ✅ Use the Retry Option on the frontend.
                ✅ Delete partially processed data using your Clear History feature.
                ✅ Re-upload with improved scan quality if pages were unreadable.


❓ 6: Frequently Asked Questions (FAQs)  -- Real-Time OCR & Progress Reporting Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Accessible FAQ section to resolve common user questions quickly, reducing support overhead while improving user confidence and pipeline adoption.

🪐 6.1 General FAQs 🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

🔹 Q1: What types of documents can I upload for OCR processing?
✅ The pipeline supports PDF, PNG, JPEG, and TIFF formats, including scanned compliance documents, forms, and handwritten notes if scan quality is adequate.

🔹 Q2: Is there a file size limit for uploads?
✅ By default, the maximum upload size is 50 MB per file, configurable in your frontend and document_preprocess container settings.

🔹 Q3: Can I use this pipeline offline?
✅ The pipeline is designed for local deployments using Docker, making it usable offline within your secure infrastructure.

🔹 Q4: Is the OCR processing real-time or batch?
✅ The system supports real-time processing with live progress updates but can also handle batch ingestion for high-volume document processing.

🔧 6.2 Technical FAQs 🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧

🔹 Q1: How does the real-time progress reporting work?
✅ Progress updates are streamed via WebSockets, emitting JSON updates from the backend to the frontend using socket.io.

🔹 Q2: What OCR engine is used in the backend?
✅ The pipeline integrates Tesseract OCR (custom-tuned) within the document_preprocess microservice for high-accuracy text extraction.

🔹 Q3: Can I adjust the OCR accuracy settings?
✅ Yes. You can modify OCR configuration within the backend:
                                        Language models
                                        DPI thresholds
                                        Preprocessing filters
                                        Document this under document_preprocess/config/ocr_config.json.

🔹 Q4: How are progress percentages calculated?
✅ Based on:
                        Total pages detected
                        Pages completed
                        Processing stages (preprocessing, text extraction, post-processing)

The pipeline emits updates like:
                                json
                                {
                                "progress": 47,
                                "message": "Processing page 7 of 15"
                                }


🔹 Q5: Where are OCR outputs stored?
✅ Outputs are stored:
                Locally within /processed_docs inside the container.
                Optionally uploaded to your Qdrant vector database for semantic search integration.

🔐 6.3 Security and Privacy FAQs  🔐🔐🔐🔐🔐🔐🔐🔐🔐🔐

🔹 Q1: Is document data stored permanently?
✅ By default, documents are retained only for processing and temporary caching. You can configure auto-deletion or manual cleanup.

🔹 Q2: Does OCR processing expose data to third parties?
✅ No. Processing occurs entirely within your infrastructure unless explicitly configured to sync with external systems.

🔹 Q3: How is data transmitted securely between frontend and backend?
✅ The pipeline supports:
                        Secure WebSockets (WSS) if deployed with HTTPS.
                        TLS-secured REST API endpoints.
                        Internal container-to-container communication within Docker network isolation.

🔹 Q4: How do I ensure data compliance during processing?
✅ Implement policies to:
                        Anonymize sensitive data post-extraction.
                        Use secure storage with encryption if retaining outputs.
                        Regularly audit and clean stored data as per your compliance framework.

🌟 6.4 Performance FAQs 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟

🔹 Q1: Why is my OCR processing slow?
✅ Possible reasons:

                Processing large files with many high-resolution pages.
                Limited CPU/memory allocation to document_preprocess containers.
                High concurrent processing load.

Solution: Scale resources via Docker, optimize scans, and monitor container resource usage.

🔹 Q2: Can the pipeline handle concurrent uploads?
✅ Yes, but concurrency limits depend on your server’s CPU/memory and configuration in your backend service.

🔹 Q3: How can I optimize processing speed?
✅ Strategies:
                Pre-crop and clean scans to reduce noise.
                Use lower DPI where acceptable.
                Allocate additional CPU cores to the backend container.

⚙️ 6.5 Integration FAQs ⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️

🔹 Q1: Can I integrate the OCR outputs with compliance tools?
✅ Yes, outputs are designed to be compatible with the Compliance Rule Ingestion Pipeline for seamless pipeline chaining.

🔹 Q2: Is API documentation available?
✅ A dedicated API Reference Guide exists under Part 4 of this documentation for endpoint details.

🔹 Q3: Can I customize the frontend display for progress reporting?
✅ Yes, you can adapt UI components under:
                                    OCRProgress.tsx
                                    OCRProgressChart.tsx
                                    frontend/src/components/

To match your branding and operational preferences.