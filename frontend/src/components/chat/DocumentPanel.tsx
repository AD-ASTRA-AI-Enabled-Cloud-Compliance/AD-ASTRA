"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { getModelNames } from "@/utils/llama_models";
import { ModelOptions } from "./ModelOptions";
import OCRProgress from "../OCRProgress";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { getModelNames } from "@/utils/llama_models";
import { ModelOptions } from "./ModelOptions";
import OCRProgress from "../OCRProgress";

export default function DocumentPanel() {
  const [docId, setDocId] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [docOptions, setDocOptions] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelsResponse = await fetch("http://localhost:11434/api/tags");
        const modelsAvailable = await modelsResponse.json();
  
        // Sort by model name before mapping
        const sortedModels = modelsAvailable.models.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
  
        const modelNames = sortedModels.map(model => model.name);
  
        setModels(modelNames);
        console.log(modelNames);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  


  const handleUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    const model = e.target.model;
    const framework = e.target.framework;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model.value);
    formData.append("framework", framework.value);
    alert(formData.get("framework"));
    setUploadMessage("Uploading...");
    setLoading(true);
    setLoading(true);
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
      setLoading(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setLoading(false);
      console.error(err);
      setUploadMessage("❌ Error uploading file");
    }
  };

  return (
    <div >
      <Card>
        <CardContent>
          <CardTitle>
            📂 Document Panel
          </CardTitle>
          <form onSubmit={handleUpload}>
            <ModelOptions modelsAvailable={models} />
            <Input type="file" name="file" accept=".pdf" />
            <Input type="text" name="framework" />
            <Button
              {...loading ? { disabled: true } : {}}
              type="submit">
              {loading ? "Processing PDF... " : "Upload PDF"}

            </Button>
            <p>{uploadMessage}</p>
          </form>
        </CardContent>
        <CardContent>
          <OCRProgress />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent>
          <CardTitle>Available Rules</CardTitle>
          <ul>
            {docOptions.map((doc) => (
              <li key={doc} className="py-1">

                <a
                  href={`http://localhost:3001/cloud_outputs/${docId}.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📥 {doc}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}