"use client";

import React, { useEffect, useState } from "react";

export default function DocumentPanel() {
  const [docId, setDocId] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [docOptions, setDocOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/documents")
      .then((res) => res.json())
      .then((docs) => setDocOptions(docs))
      .catch(console.error);
  }, []);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploadMessage("Uploading...");

    try {
      const res = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.rules_saved) {
        const docName = data.rules_saved.replace(".json", "");
        setDocId(docName);
        setUploadMessage("✅ Uploaded and processed: " + data.rules_saved);
        setDocOptions((prev) => Array.from(new Set([...prev, docName])));
      } else {
        setUploadMessage("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setUploadMessage("❌ Error uploading file");
    }
  };

  return (
    <div style={{ width: "35%", backgroundColor: "#fff", padding: "2rem" }}>
      <h2>📂 Document Panel</h2>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" accept=".pdf" />
        <button type="submit">Upload PDF</button>
        <p>{uploadMessage}</p>
      </form>
      <hr />
      <label>Download JSON rules:</label>
      <select onChange={(e) => setDocId(e.target.value)} value={docId}>
        <option value="">-- Select Document --</option>
        {docOptions.map((doc) => (
          <option key={doc} value={doc}>{doc}</option>
        ))}
      </select>
      {docId && (
        <a
          href={`http://localhost:3001/cloud_outputs/${docId}.json`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📥 Download Extracted Rules
        </a>
      )}
    </div>
  );
}