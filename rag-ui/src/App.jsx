import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const askQuestion = async () => {
    if (!question.trim()) return;
    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const aiMsg = { role: "ai", content: data.answer || "No response." };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "❌ Backend error" }]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("✅ File uploaded and processed!");
      } else {
        alert("❌ Upload failed.");
      }
    } catch {
      alert("❌ Backend error during upload.");
    } finally {
      setUploading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container shadow">
        <div className="chat-header bg-primary text-white text-center py-2">
          <h3 className="mb-0">🏏 Cric AI</h3>
        </div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <span>{msg.content}</span>
            </div>
          ))}
          {loading && <div className="chat-message ai">Typing...</div>}
        </div>

        <div className="chat-input">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Ask something about cricket..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askQuestion()}
          />
          <button className="btn btn-primary" onClick={askQuestion} disabled={loading}>
            Send
          </button>
        </div>

        <div className="upload-box mt-3 px-3">
          <input
            type="file"
            accept=".pdf,.json,.doc,.docx"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading && <progress value={progress} max="100" style={{ width: "100%" }} />}
        </div>
      </div>
    </div>
  );
}

export default App;
