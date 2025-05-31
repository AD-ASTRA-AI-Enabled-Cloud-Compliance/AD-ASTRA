import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

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
      const aiRaw = data.answer || "No response.";
      simulateThinking(aiRaw);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "❌ Backend error" }]);
      setLoading(false);
    } finally {
      setQuestion("");
    }
  };

  const simulateThinking = async (text) => {
    const steps = {
      Thought: "",
      Action: "",
      Observation: "",
      Response: "",
    };

    const lines = text.split(/\n+/);
    let current = "";

    for (let line of lines) {
      if (line.startsWith("Thought:")) {
        current = "Thought";
        steps.Thought = line.replace("Thought:", "").trim();
      } else if (line.startsWith("Action:")) {
        current = "Action";
        steps.Action = line.replace("Action:", "").trim();
      } else if (line.startsWith("Observation:")) {
        current = "Observation";
        steps.Observation = line.replace("Observation:", "").trim();
      } else if (line.startsWith("Final Answer:")) {
        current = "Response";
        steps.Response = line.replace("Final Answer:", "").trim();
      } else if (current) {
        steps[current] += " " + line.trim();
      }
    }

    const addMeta = (label, value) =>
      setMessages((prev) => [...prev, { role: "ai", content: `${label}: ${value}`, meta: true }]);

    setMessages((prev) => [...prev, { role: "ai", content: "", meta: true }]);
    await new Promise((r) => setTimeout(r, 300));
    if (steps.Thought) await addMeta("Thought", steps.Thought);
    await new Promise((r) => setTimeout(r, 400));
    if (steps.Action) await addMeta("Action", steps.Action);
    await new Promise((r) => setTimeout(r, 400));
    if (steps.Observation) await addMeta("Observation", steps.Observation);
    await new Promise((r) => setTimeout(r, 1200));

    // Replace last meta with final response
    setMessages((prev) => [
      ...prev.filter((m) => !m.meta),
      { role: "ai", content: `Response: ${steps.Response}`, meta: false },
    ]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
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
              <span className={msg.meta ? "meta-text" : ""}>{msg.content}</span>
            </div>
          ))}
          {loading && <div className="chat-message ai meta-text">Typing...</div>}
        </div>
        <div className="chat-input">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Ask something about cricket..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary"
            onClick={askQuestion}
            disabled={loading || !question.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
