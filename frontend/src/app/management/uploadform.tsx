'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Optional: create via `shadcn add textarea`

export default function UploadForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jsonOutput, setJsonOutput] = useState<object | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    // Simulate backend response
    const fakeResponse = {
      username: name,
      fileName: file.name,
      status: "Uploaded successfully",
      timestamp: new Date().toISOString(),
    };

    // In real case, you'd POST to an API here
    setJsonOutput(fakeResponse);
    setCopied(false); // Reset copied state
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
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>

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
