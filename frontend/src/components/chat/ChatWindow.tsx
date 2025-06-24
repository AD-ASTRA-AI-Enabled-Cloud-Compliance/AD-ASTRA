"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import useChat from "../../hooks/useChat";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import Markdown from "react-markdown";
import { ModelOptions } from "./ModelOptions";
import { useModels } from "@/hooks/useDocSetup";


export default function ChatWindow() {
  const { messages, input, setInput, handleSend, loading } = useChat();

  const { models, error } = useModels();
  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent>

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
    <Card className="w-full h-full flex flex-col">
      <CardContent>

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
            <ModelOptions modelsAvailable={models}/>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about HIPAA, PCI, NIST..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
