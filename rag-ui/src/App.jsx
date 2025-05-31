import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);

  // Send question to backend
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
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", content: "❌ Backend error" }]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  // Upload document
  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:8000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      alert("✅ File uploaded successfully!");
    } catch (err) {
      alert("❌ Upload failed");
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="chat-container">
      <header className="header">
        <h1>🏏 Cric AI</h1>
      </header>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <span style={{ whiteSpace: "pre-wrap" }}>
              {msg.content.split("\n").map((line, idx) =>
                /^(Thought|Action|Observation):/i.test(line) ? (
                  <span key={idx} className="meta-text">{line}<br /></span>
                ) : line.toLowerCase().startsWith("final answer:") ? (
                  <strong key={idx}>Response: {line.replace(/final answer:\s*/i, "")}<br /></strong>
                ) : (
                  <span key={idx}>{line}<br /></span>
                )
              )}
            </span>
          </div>
        ))}
        {loading && <div className="chat-message ai">Thinking...</div>}
      </div>

      <div className="input-area">
        <textarea
          rows="2"
          placeholder="Ask something about cricket..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={askQuestion} disabled={loading || !question.trim()}>
          Send
        </button>
      </div>

      <div className="upload-section">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload Document</button>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress-bar">
            Uploading: {uploadProgress}%
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
