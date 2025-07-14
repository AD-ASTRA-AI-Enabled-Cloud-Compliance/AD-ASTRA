"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useForm, FormProvider } from "react-hook-form";

import useChat from "../../hooks/useChat";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useModels } from "@/hooks/useDocSetup";
import { Textarea } from "../ui/textarea";
import { ModelOptions } from "./ModelOptions";

export type ChatData = {
  model: string;
  query: string;
  history?: { role: string; content: string }[];
};

export default function ChatWindow() {
  const methods = useForm<ChatData>({
    defaultValues: { model: "", query: "" },
  });
  const { handleSubmit, register, setValue, watch } = methods;
  const selectedModel = watch("model");

  const { messages, handleSend, loading } = useChat();
  const { models } = useModels();

  const onSubmit = (data: ChatData) => {

    handleSend(data);
    setValue("query", ""); // Clear input after send
  };

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

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <ModelOptions
                disabled={loading}
                modelsAvailable={models}
                value={selectedModel}
                onValueChange={(val) => setValue("model", val)}
              />
              <Textarea
                {...register("query", { required: true })}
                className="w-full"
                placeholder="Ask about HIPAA, PCI, NIST..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "..." : "Send"}
              </Button>
            </form>
          </FormProvider>
          </div>

      </CardContent>
    </Card>
  );
}
