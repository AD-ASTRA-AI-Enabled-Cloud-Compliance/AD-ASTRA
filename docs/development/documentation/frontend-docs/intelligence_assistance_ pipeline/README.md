🌟 Chat & Intelligent Assistance Pipeline
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 1.1 Purpose and Benefits  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

The Chat & Intelligent Assistance Pipeline acts as the human-AI interaction gateway for the entire Cloud Compliance System. It delivers a dynamic, context-aware communication layer powered by LLMs (Large Language Models) and integrated vector-based semantic search, enabling real-time user support, regulation explanation, and infrastructure-aware Q&A.

🔍 Whether end-users are seeking clarification on a compliance rule, or engineers are troubleshooting infrastructure misconfigurations, this pipeline translates natural language questions into structured insight—with traceability to underlying policies, historical decisions, and real-time environment state.

✨ 1.2 Core Features at a Glance ✨✨✨✨✨✨✨✨✨✨


| Feature                          | Description                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 🗣️ **Natural Language Chat**    | Accepts user prompts, follow-ups, and context-rich queries via a live chat interface.                           |
| 🧠 **LLM-Driven Understanding**  | Translates chat into actionable queries using models like **Gemma**, **Mixtral**, or other pluggable AI agents. |
| 🔎 **Semantic Rule Search**      | Integrates with **Qdrant Vector DB** for rule/embedding lookup and similarity matching.                         |
| 📜 **Multi-Turn Dialogue State** | Maintains memory across multi-turn user conversations, tracking compliance context per session.                 |
| 🚦 **Live Session Feedback**     | Provides streamed, token-by-token responses using **WebSocket connections** for interactive AI assistance.      |
| 🛡️ **Role-Based Intelligence**  | Adjusts LLM responses based on user roles (DevOps, Auditors, PMs, etc.), aligning tone and content to audience. |


📌 1.3 Audience and Scope 📌📌📌📌📌📌📌📌📌📌📌📌

This pipeline benefits multiple technical and non-technical personas within the organization:

| Persona                    | Role                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| 🧑‍💻 **DevOps Engineers** | Query infrastructure rules, get actionable advice, and debug misconfigurations.                |
| 📊 **Compliance Officers** | Ask “why” or “how” about compliance status, root cause of violations, or remediation logic.    |
| 📋 **Auditors**            | Generate explanations for decision paths, approvals, and security justifications.              |
| 🤖 **Developers**          | Debug response chains, test prompt templates, and fine-tune AI outputs for internal workflows. |


📚 1.4 Supported Use Cases 📚📚📚📚📚📚📚📚📚📚

✅ Example Use Cases Fully Supported:

                            🔍 “What PCI DSS rules am I currently violating on my S3 buckets?”
                            🔄 “How do I remediate NIST CSF PR.AC-1 violations automatically?”
                            📖 “Explain HIPAA 164.308(a)(1)(ii)(A) in simple terms.”
                            🧭 “What’s the difference between security group and NACL violations?”
                            🧩 “Suggest an IAM policy update for principle of least privilege for function XYZ.”
                            🎯 “Which rules most frequently triggered failures in the past 3 months?”


🧬 1.5 Alignment with Platform Philosophy 🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬

This pipeline is not just a chat interface, but an intelligent assistant embedded into the compliance lifecycle, enabling:

                                                        🔄 Conversational compliance debugging
                                                        🚀 Accelerated onboarding for non-technical users
                                                        🧘 Reduction of knowledge silos across teams
                                                        🔐 Faster mitigation through guided, explainable AI


🏗️ 1.6 Strategic Differentiators 🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️


| Advantage                      | Description                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| 💡 Contextual Understanding    | Learns and adapts to ongoing compliance evaluations and remediations.                  |
| 🔌 Modular AI Support          | Pluggable architecture for using open-source or closed LLMs (Gemma, OpenRouter, etc.). |
| 🔒 Secure Session Isolation    | Per-user chat sandboxing for tenant and session-level privacy.                         |
| 📡 Real-Time Interactivity     | Full-duplex WebSocket implementation enables low-latency, token-streamed replies.      |
| 🧠 Embedded Search + Reasoning | Combines vector database retrieval with reasoning for fact-based answers.              |

The Pipeline brings proactive compliance intelligence to life. It transforms rigid documentation and cryptic rule sets into an interactive, AI-guided experience. It is the voice of the compliance platform—context-aware, infrastructure-informed, and user-personalized.


🏗️ 2. System Architecture
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🪐 2.1 High-Level Architecture Diagram  🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

[ React Chat UI ]
      |
      | 🔁 User Input / AI Response
      ▼
[ WebSocket Gateway ] ◄────────────┐
      |                           |
      ▼                           |
[ Prompt Builder ]               |
      |                           |
      ▼                           |
[ Context & Session Engine ]     |
      |                           |
      ▼                           |
[ Vector DB Search (Qdrant) ]   ─┘
      |
      ▼
[ LLM Adapter & Orchestrator ]
      |
      ▼
[ AI Model (e.g., Mixtral, Claude) ]
      |
      ▼
[ Token Stream Output ]

At its core, the Chat & Intelligent Assistance Pipeline orchestrates real-time human-AI interactions, routing chat prompts through a multi-layered system of preprocessing, vector search, LLM inference, and streamed UI updates.

📡 Key Components:

            🔹 ✉️ WebSocket Gateway: Bi-directional, low-latency channel for streaming user queries and AI responses.
            🔹 🧠 Prompt Engine & LLM Adapter: Dynamically constructs prompts based on user roles, compliance context, and query type.
            🔹 📚 Embedding Retrieval Layer: Matches user input against semantically indexed compliance rules stored in Qdrant Vector DB.
            🔹 ⚙️ LLM Executor: Forwards enriched prompt to a selected LLM (Gemma, Mixtral, Claude, etc.) and streams output.
            🔹 🧾 Chat Session Store: Maintains conversation history, states, and contextually linked results for multi-turn continuity.
            🔹 🎛️ Client Renderer (React): UI layer with token-by-token rendering, loading indicators, retry logic, and chat memory visualizer.


✨ 2.2 Components Breakdown ✨✨✨✨✨✨✨✨✨✨✨✨

Each component is modular, pluggable, and clearly delineated:

| 🧩 Component          | 🧾 Description                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **React Chat UI**     | Presents chat interface with user input box, message bubbles, AI streaming indicator, and retry buttons.    |
| **WebSocket Gateway** | Lightweight gateway for live message exchange; emits tokens as they are generated by the LLM.               |
| **Prompt Builder**    | Enriches user input with session metadata, past messages, compliance rule matches, and user role templates. |
| **Vector DB Search**  | Sends embedding of user query to Qdrant to fetch top `k` semantically similar compliance entries.           |
| **LLM Adapter**       | Handles model-specific input/output transformations, abstracts provider complexity (Mixtral, Claude, etc.). |
| **Session Engine**    | Stores multi-turn conversation data, response cache, and follow-up query references.                        |

🔁 2.3 State Management Strategy 🔁🔁🔁🔁🔁🔁🔁🔁🔁🔁

This pipeline requires advanced client-side and server-side state synchronization:

| 🧠 State Domain      | 📌 Strategy                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Chat Memory**      | Maintained in `Redux` + synchronized with a local `IndexedDB` fallback for resiliency.                     |
| **Streaming Buffer** | Token accumulation streamed via WebSocket → stored in local buffer → flushed into UI with debounce.        |
| **Session Context**  | Session ID and user role passed with every request; used to personalize prompts and filter vector matches. |
| **Error State**      | Resolved using `useReducer` pattern with retry strategies, fallbacks, and real-time feedback.              |


🧬 2.4 WebSocket & Streaming Mechanics 🧬🧬🧬🧬🧬🧬🧬🧬🧬🧬

This real-time pipeline uses WebSockets for ultra-low-latency interaction. Below is a simplified flow of a message session:

            Client connects via wss://chat-api/ws
                ↓
            Client sends {"prompt": "What is NIST AC-2?", "sessionId": "abc123"}
                ↓
            Server receives and:
            → Queries Qdrant for vector matches
            → Builds prompt with contextual knowledge
            → Sends to LLM
                ↓
            LLM streams response token-by-token
                ↓
            Server emits {"token": "AC-2", "stream": true}
                    ... {"token": " is about account control", "stream": true}
                ↓
            Client UI renders tokens progressively
                ↓
            Final message emitted with {"done": true}











START HERE 









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

⚙️ 3.1 Prerequisites ⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️

Before installation, ensure the following dependencies are pre-installed on your local or cloud environment:

| Dependency              | Minimum Version | Description                                |
| ----------------------- | --------------- | ------------------------------------------ |
| Node.js                 | `>= 18.x`       | JavaScript runtime for the frontend        |
| Yarn or NPM             | `>= 1.22 / 9.x` | Dependency manager                         |
| Docker & Docker-Compose | `>= 20.x / 2.x` | For containerizing backend evaluation APIs |
| Git                     | `>= 2.x`        | Version control                            |
| .env File               | Custom          | Environment variables setup (see below)    |

💡 Optional: Use nvm to manage multiple Node versions seamlessly.


🌍 3.1.2 Environment Variables 🌍🌍🌍🌍🌍🌍🌍🌍🌍🌍🌍

Create a .env file at the root of your frontend folder. Below are the required variables:

                        REACT_APP_API_BASE_URL=http://localhost:8081
                        REACT_APP_REMEDIATION_STATUS_REFRESH_INTERVAL=10000
                        REACT_APP_AUTH_TOKEN=your_secure_token_here
                        REACT_APP_ENABLE_DEBUG=true

| Variable                                        | Purpose                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| `REACT_APP_API_BASE_URL`                        | Base URL to connect React UI with backend APIs |
| `REACT_APP_REMEDIATION_STATUS_REFRESH_INTERVAL` | Polling interval for real-time updates (ms)    |
| `REACT_APP_AUTH_TOKEN`                          | Authentication token for protected API calls   |
| `REACT_APP_ENABLE_DEBUG`                        | Enables verbose client logging                 |


🚀 3.2 Launching Locally 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

1️⃣ Clone the Repository

                        git clone https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA.git
                        cd ad-adastra-cloud-compliance-eval-ui

2️⃣ Install Frontend Dependencies

                        yarn install


🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄
🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄 OR IF USING NPM 🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄
🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄🪄

                        npm install

3️⃣ Start Frontend Server

                        yarn start


🚦 3.3 Checklist  🚦🚦🚦🚦🚦🚦🚦🚦🚦🚦

After startup, verify the following:

                ✅ Dashboard Loads: Ensure the Compliance Dashboard UI renders without crash.
                ✅ API Connectivity: Test endpoint /fetch-compliance-status via browser or Postman.
                ✅ Status Auto Refresh: Real-time progress bar updates based on backend polling.
                ✅ Trigger Button Active: “Initiate Remediation” button should appear once results load.
                ✅ Console Logs: Should show Evaluating compliance rules... during fetch cycle.

🚀 3.4 Dockerized Launnch 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

                docker-compose -f docker-compose.eval.yaml up --build

Ensure the following volumes and ports are properly mapped:

                services:
                frontend-eval:
                    build: ./compliance-eval-ui
                    ports:
                    - "3000:3000"
                    environment:
                    - REACT_APP_API_BASE_URL=http://backend-eval:8081

🛡️ Security Tip: Never expose the REACT_APP_AUTH_TOKEN in production builds. Use secret injection tools.

After completing these steps, the pieline should be ready to use real-time remediation logic connected to backend APIs with a fully responsive interface, API synchronization, and secure configuration.


🧭 4 User Guide – Remediation Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
This provides a complete walkthrough for interacting with the Remediation Pipeline’s frontend dashboard. From accessing evaluation results to launching automated remediation flows, this guide ensures that both technical and non-technical users can navigate the system efficiently with confidence

🪐 4.1 Getting Started 🪐🪐🪐🪐🪐🪐🪐🪐🪐🪐

🚀 4.1.1 Navigating the Dashboard 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

Upon visiting the app’s main route http://localhost:3000, you’ll land on the Dashboard.


| Section                         | Description                                                                |
| ------------------------------- | -------------------------------------------------------------------------- |
| 📊 *Compliance Summary Cards*   | Visualizes number of rules evaluated, compliant, and non-compliant states. |
| 🧩 *Framework Tabs*             | Switch between NIST, HIPAA, PCI-DSS, etc. evaluations.                     |
| 📉 *Status Timeline Chart*      | Live timeline of evaluation execution and progress.                        |
| 🧪 *Evaluation Logs Panel*      | Displays real-time messages pushed by backend APIs.                        |
| ⚙️ *Trigger Remediation Button* | Starts remediation sequence if violations exist.                           |


🖼️ 4.2 Interpreting Compliance Results 🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️

Once evaluation is triggered (automatically or manually), the UI populates with structured, color-coded results:

| Indicator               | Meaning                                        |
| ----------------------- | ---------------------------------------------- |
| ✅ *Green (Compliant)*   | Rule passed; infrastructure meets requirement. |
| ❌ *Red (Non-Compliant)* | Rule failed; remediation needed.               |
| 🟡 *Yellow (Warning)*   | Partial compliance or requires human review.   |
| ⏳ *Blue (Evaluating)*   | Evaluation in progress for that rule.          |


Clicking any rule expands a modal with:

                        ✅ Rule ID & Description
                        ✅ Associated Framework Clause
                        ✅ Compliance Evidence (e.g., screenshot, log file)
                        ✅ Suggested Remediation Actions (if applicable)

🩻 4.3 Initiating Remediation 🩻🩻🩻🩻🩻🩻🩻🩻🩻🩻🩻

    Once the system identifies violations, you can initiate remediation in two ways:

Option 1: ✨ Single-Click Remediation (Recommended) ✨✨✨✨✨

    Click the "Initiate Remediation" button at the top-right corner. This triggers:

                                                                ✅ Immediate backend remediation workflows
                                                                ✅ UI modal for progress visibility
                                                                ✅ Real-time updates via WebSockets or polling

Option 2: 🛎️ Manual Rule-by-Rule Remediation 🛎️🛎️🛎️🛎️

    Each failed rule has a "Remediate" button, allowing selective remediation.

    📌 Confirmation Required: Users must confirm remediation actions to prevent accidental changes.

    🧩 Behind the Scenes:

                        ✅ React dispatches a POST /remediate call
                        ✅ Backend queues the action
                        ✅ UI updates status on success/failure


📡 4.4 Tracking Remediation Status 📡📡📡📡📡📡📡📡📡📡

Once remediation begins, the Progress Timeline section activates:

| Step                      | Status Color | Meaning                                     |
| ------------------------- | ------------ | ------------------------------------------- |
| 🟢 Applied                | Green        | Fix was executed successfully               |
| 🔄 In Progress            | Blue         | Fix being applied                           |
| 🔴 Failed                 | Red          | Fix attempt failed; log is available        |
| ⚠️ Manual Review Required | Yellow       | Action needs user confirmation/intervention |

            Users can:

                                    ✅ Click to view execution logs
                                    ✅ Re-run failed steps
                                    ✅ Export remediation results as JSON or PDF


📤 4.5 Exporting Results & Reports 📤📤📤📤📤📤📤📤📤📤

            From the top menu, users can:

                                    🧾 Download Evaluation Report (CSV, JSON, PDF)
                                    📬 Email Results to predefined stakeholders
                                    🔐 Send to Audit Logs via API integration (if configured)


🔐 4.6 Role-Based Access 🔐🔐🔐🔐🔐🔐🔐🔐🔐🔐

| Role         | Permissions                                                  |
| ------------ | ------------------------------------------------------------ |
| **Admin**    | Full access (evaluate, remediate, export)                    |
| **Reviewer** | View evaluations and logs, cannot remediate                  |
| **Auditor**  | View-only access, with permission to download/export reports |

🛡️ Security Note: All user actions are logged and timestamped for audit traceability.

Following this guide, users will be able to interpret evaluation results, launch automated fixes, monitor progress visually, and generate compliance artifacts effortlessly — all via a thoughtfully designed and highly responsive frontend experience.


🛠️ 5: Troubleshooting Guide --- Remediation Pipeline
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Technical compass for resolving operational hiccups, ensuring smooth usage of the evaluation and remediation interface. From UI stalling issues to deeper API or remediation failures, each category below provides actionable guidance with clear visuals, expert logic, and tested recovery steps.


🖼️ 5.1 UI Not Updating on Status Change 🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️

🔍 Symptom: After triggering remediation or compliance evaluation, the UI shows no visible change.

        📦 Possible Causes:

                        ✅ Lost WebSocket connection or polling timeout
                        ✅ React state mutation error
                        ✅ Frontend failed to receive updated evaluation result from backend

🛠 Recommended Steps: 🛠🛠🛠🛠🛠🛠🛠🛠🛠🛠

1️⃣ 🔁 Manual Refresh: Hit Ctrl + R to force refresh the app state.

2️⃣ 🔍 Inspect Console Logs:

                        ✅ Check browser dev tools for WebSocket disconnects.
                        ✅ Verify if React errors are raised during useEffect() triggers.

3️⃣ 🧪 Trigger Diagnostics:

                        ✅ Run local test script npm run test:state-sync to verify frontend state sync.

✅ Fix: Ensure socket.emit and socket.on("status_update") are connected, and that Redux/Context is updating the UI appropriately.


❌ 5.2 Remediation Errors ❌❌❌❌❌❌❌❌❌❌

🔍 Symptom: Remediation fails partially or completely for selected rules.

        📦 Possible Causes:

                        ✅ IAM misconfiguration (example., insufficient permissions)
                        ✅ Invalid resource references in generated Terraform/YAML
                        ✅ API timeout or rate limiting from cloud provider

🛠 Recommended Steps: 🛠🛠🛠🛠🛠🛠🛠🛠🛠🛠

1️⃣ 🔑 Check Role Permissions:

                ✅ Confirm IAM roles assigned to the automation backend include write, update, and delete privileges.

2️⃣ 📁 Review Logs:

                ✅ Locate remediation.log inside container logs:

                        docker logs remediation-service | grep "ERROR"

3️⃣ 🧬 Dry Run Mode:

                Re-run remediation in “dry-run” mode by sending the flag ?dryRun=true in the POST /remediate call.


✅ Fix: Validate generated infra changes before applying and ensure all dependent resources are correctly addressed.

🛜 5.3 API Connection Failures 🛜🛜🛜🛜🛜🛜🛜🛜🛜🛜

🔍 Symptom: React app shows "Unable to fetch compliance status" or "Backend not reachable".

        📦 Possible Causes:

                        ✅ Backend API container not running or unreachable
                        ✅ Port mismatch between .env config and frontend .env.local
                        ✅ CORS misconfiguration during frontend build

🛠 Recommended Steps: 🛠🛠🛠🛠🛠🛠🛠🛠🛠🛠

1️⃣ 🚦 API Health Check:

                            curl http://localhost:5020/health

        Response should be:

                            { "status": "OK" }


2️⃣ ⚙️ Verify Environment Variables:

        In frontend .env.local, make sure:

                            NEXT_PUBLIC_API_URL=http://localhost:5020


3️⃣ 🧪 Run Connectivity Test:

                            ping backend-api
                            docker inspect backend-api --format '{{.NetworkSettings.IPAddress}}'

✅ Fix: Rebuild both services and use docker-compose up --build to restore stable linkage.


🧩 5.4 Rule Evaluation Fails Intermittently 🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩

🔍 Symptom: Evaluation works on some documents but fails on others unpredictably.

                📦 Possible Causes:

                            ✅ Malformed or unsupported JSON rule structures
                            ✅ Inconsistent mapping between compliance framework and evaluation logic
                            ✅ Memory issues when processing large rule sets

🛠 Recommended Steps: 🛠🛠🛠🛠🛠🛠🛠🛠🛠🛠

1️⃣ 🗂️ Log Review:

    Examine logs in evaluation-service/logs/evaluation_errors.log

    Look for:

                RuleMappingError: Missing control_id in PCI v3.2.1 clause

2️⃣ 💾 Memory Constraints:

    Review container memory settings. Ensure service has at least 2GB:

                services:
                evaluation:
                    mem_limit: 2048m


3️⃣ 🛠️ Enable Debug Mode:

Temporarily enable verbose mode in the backend:

                DEBUG=true npm start

✅ Fix: Ensure all rules are pre-validated during upload and frameworks include complete mappings.

📄 5.5 Troubleshooting Cheatsheet Summary 📄📄📄📄📄📄📄📄📄📄📄📄

| Issue                            | Root Cause Example            | Resolution                             |
| -------------------------------- | ----------------------------- | -------------------------------------- |
| UI not updating                  | React state not syncing       | Refresh UI, check WebSocket            |
| Remediation fails                | IAM or API misconfig          | Dry run, fix permissions               |
| API unreachable                  | Network or port issue         | Confirm port mapping                   |
| Inconsistent evaluation results  | Malformed input or low memory | Validate JSON & raise memory           |
| “Unknown error occurred” in logs | Generic catch block error     | Enable debug mode & inspect tracebacks |


💬 Tip

Enable automatic health pinging by setting up a simple watchdog job inside the frontend or orchestrator that calls:

                GET /api/evaluation/health

If the response isn't 200 OK, log the failure with a timestamp and auto-retry remediation queues after a cooldown period.

❓ 6: Frequently Asked Questions (FAQs) --  Remediation Pipeline 
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Section provides concise, clearly categorized answers to common questions from engineers, analysts, security leads, and DevOps professionals. It ensures fast resolution of doubts and accelerates onboarding and effective pipeline use.


💡 6.1 General FAQs 💡💡💡💡💡💡💡💡💡💡💡

🔹 Q1: What is the core purpose of this pipeline?
✅ To continuously evaluate infrastructure and code against compliance frameworks and remediate detected violations in near real-time.

🔹 Q2: Does this pipeline support multi-framework evaluation?
✅ Yes. You can run evaluations for multiple frameworks (e.g., SOC 2, HIPAA, ISO 27001) concurrently on the same resource set.

🔹 Q3: Can non-technical users view results?
✅ Absolutely. The dashboard is designed with clarity in mind and includes status indicators, rule descriptions, and remediation histories in human-readable format.

🔹 Q4: What’s the typical time to evaluate and remediate a single resource?
✅ Depends on infrastructure size and framework complexity, but for a single virtual machine or IAM policy, it averages under 5 seconds for evaluation and 10–30 seconds for remediation.


🔧 6.2 Technical FAQs 🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧

🔹 Q1: How are remediation actions applied?
✅ Remediations are generated as infrastructure-as-code snippets and applied via API integrations (e.g., Terraform Cloud, Ansible Playbooks, or custom shell scripts).

🔹 Q2: How is remediation rollback handled?
✅ Every action is tracked, logged, and versioned. Failed actions automatically trigger rollback mechanisms using previous state snapshots.

🔹 Q3: How is state maintained across sessions?
✅ The system uses persistent state storage (e.g., Redis or MySQL) to maintain remediation status and rule violations across pipeline executions.

🔹 Q4: What if two remediations conflict?
✅ The conflict resolution layer detects incompatible remediation actions and halts execution with a detailed report for user intervention.

🔹 Q5: How are custom compliance rules defined?
✅ Developers can define custom rules as JSON logic expressions or SQL-like policy queries. The UI supports uploading and managing custom rule sets.


🔐 6.3 Compliance & Security FAQs 🔐🔐🔐🔐🔐🔐🔐🔐🔐🔐

🔹 Q1: How is sensitive data protected?
✅ All data is encrypted at rest and in transit using industry-standard protocols (AES-256, TLS 1.3). Access to evaluation and remediation data is governed by RBAC (Role-Based Access Control).

🔹 Q2: Does the system audit its actions?
✅ Yes. A comprehensive audit log records every action: who initiated it, what was changed, timestamps, and whether it succeeded or failed.

🔹 Q3: Are remediation actions sandboxed?
✅ Yes. All actions are previewed in a dry-run containerized environment before being pushed to production systems, ensuring no harmful unintended changes.

🔹 Q4: Can we integrate with SIEM/SOC tools?
✅ Fully supported. The pipeline exposes webhooks and structured log formats (e.g., JSON, syslog) compatible with Splunk, Datadog, and ELK Stack.

🔹 Q5: Are compliance framework updates handled automatically?
✅ Yes. Frameworks can be version-pinned or subscribed to real-time updates. Notifications inform admins of any rule changes impacting their systems.