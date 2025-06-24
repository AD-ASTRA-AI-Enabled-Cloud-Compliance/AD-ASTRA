'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Optional: create via `shadcn add textarea`
import { apiCallBuilder } from "@/lib/apiCallBuilder";
import OCRProgress from "../../../components/OCRProgress";
import { useWebSocket } from "../../../contexts/WebSocketContext";

export default function UploadForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jsonOutput, setJsonOutput] = useState<object | null>(null);
  const [copied, setCopied] = useState(false);
  const { lastMessage, setLastMessage } = useWebSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLastMessage(null)
    setJsonOutput(null)
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${process.env.NEXT_PUBLIC_API_URL_DOC_PREPROCESS_PORT}/upload`;
    try {
      const response = await apiCallBuilder(url, "POST", null, formData);
      if (response?.ok) {
        const data = await response.json();
        setJsonOutput(data);
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleCopy = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            name="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
      <OCRProgress />
      {jsonOutput && (
        <div className="space-y-2">
          <Label>Backend JSON Output</Label>
          <Textarea
            className="h-60 font-mono text-sm resize-none"
            readOnly
            value={JSON.stringify(jsonOutput, null, 2)}
          />
          <Button onClick={handleCopy} variant="secondary">
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
        </div>
      )}
    </div>
  );
}
