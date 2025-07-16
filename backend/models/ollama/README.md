# # 🌩️ Cloud Security Compliance Tool

An AI-powered tool for extracting, analyzing, and validating security compliance rules from industry frameworks like **PCI**, **HIPAA**, and **NIST** — or from your own uploaded documents.

## 🧠 Features

- 📄 **Document Upload**: Upload PDF-based security frameworks for compliance rule extraction.
- ⚙️ **AI Rule Extraction**: Uses OCR + Ollama GPT to extract structured JSON security rules.
- 🔍 **Chatbot with ReAct + RAG**: Ask compliance-related questions with semantic search.
- 📊 **Vector Search**: Uses Qdrant for chunk-based similarity search and rules matching.
- 🌐 **Web Search Fallback**: MCP-based agent triggers Tavily search when local data fails.
- 🧱 **Modular Architecture**: Clean MVC structure in backend and modular frontend.

---

## 🧰 Tech Stack

| Layer        | Tech                            |
| ------------ | ------------------------------- |
| Frontend     | React (Next.js)                 |
| Backend      | Python (Flask)                  |
| AI Engine    | Ollama GPT (e.g., Gemma:2b)     |
| Vector DB    | Qdrant (Local & Cloud Toggle)   |
| Data Store   | MongoDB / JSON File Storage     |
| Dev Tools    | Docker, GitHub, Tavily API      |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/cloud-compliance-tool.git
cd cloud-compliance-tool
```

### 2. Start Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Start Qdrant & Ollama (Local)

```bash
docker run -d --name qdrant -p 6333:6333 -v qdrant_data:/qdrant/storage qdrant/qdrant

docker run -d --name ollama -p 11434:11434 -v ollama_data:/root/.ollama ollama/ollama
ollama run gemma:2b
```

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── utils/
│   
├── uploads/
├── cloud_outputs/
└── main.py

frontend/
├── app/
├── components/
├── contexts/
├── store/
└── ...
```

---

## 📡 API Endpoints (Backend)

| Route              | Description                             |
| ------------------| --------------------------------------- |
| `POST /upload`     | Uploads and processes PDF               |
| `GET /uploads`     | Lists uploaded documents and outputs    |
| `POST /chat`       | Sends query to compliance AI agent      |
| `GET /documents`   | Lists available JSON rule documents     |

---

## 🧪 How It Works

1. **Upload PDF** → AI extracts rules → stores `.json` output.
2. **Chunking** → Text is embedded into Qdrant for semantic search.
3. **Chatbot** → Accepts natural language queries and returns:
   - Context from rules & chunks
   - Reasoning steps (ReAct)
   - Web fallback if needed (via Tavily)

---

## 🔐 Use Cases

- Internal audit preparation
- Continuous compliance monitoring
- Automated security documentation checks
- Framework understanding for DevSecOps

## ✨ Contributors

- Harsimran Kaur (Lead Developer)

