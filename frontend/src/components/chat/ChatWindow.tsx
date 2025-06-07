"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import useChat from "../../hooks/useChat";

export default function ChatWindow() {
  const { messages, input, setInput, handleSend, loading } = useChat();

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        borderLeft: "1px solid #ccc",
        backgroundColor: "#f9fafb",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", fontWeight: "bold" }}>
        💬 Chat with Compliance Agent
      </h2>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "1rem",
          paddingRight: "0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "white",
          padding: "1rem",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#e0f2fe" : "#f3f4f6",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              fontSize: "0.95rem",
            }}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="p-3 rounded mb-2 max-w-[80%] bg-gray-100 text-sm text-gray-500">
            🤖 Compliance Agent is thinking...
          </div>
        )}
        
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about HIPAA, PCI, NIST..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            opacity: loading ? 0.6 : 1,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
