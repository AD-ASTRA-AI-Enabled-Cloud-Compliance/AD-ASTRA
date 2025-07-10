import { useState } from "react";
import { ChatData } from "@/components/chat/ChatWindow";

export default function useChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (data: ChatData) => {
    const userMessage = { role: "user", content: data.query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/react_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // now sending full ChatData
      });
      const result = await res.json();
      console.log("📱 Response:", result.answer);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `**Answer**: ${result.answer}` },
        ...result.steps.map((step: any) => ({
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

  return { messages, loading, handleSend };
}
