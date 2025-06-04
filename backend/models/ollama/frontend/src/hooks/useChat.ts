import { useState } from "react";

export default function useChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/react_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      console.log("📱 Response:", data);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `**Answer**: ${data.answer}` },
        ...data.steps.map((step: any) => ({
          role: "assistant",
          content: Object.entries(step)
            .map(([k, v]) => `**${k}**: ${v}`)
            .join("\n"),
        })),
      ]);
    } catch (err) {
      console.error("❌ Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, input, setInput, handleSend };
}

