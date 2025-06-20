"use client"

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TerraformForm } from "./TerraformForm";


type UploadForm = {
  pci_file: FileList;
  actual_file: FileList;
  tfvars_file?: FileList;
};

type Resource = {
  type: string;
  name: string;
};

export default function TerraformPage() {
  const { register, handleSubmit } = useForm<UploadForm>();
  const [message, setMessage] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource[]>([]);
  const [step, setStep] = useState<"upload" | "select">("upload");

  async function onUpload(data: UploadForm) {
    const formData = new FormData();
    formData.append("pci_file", data.pci_file[0]);
    formData.append("actual_file", data.actual_file[0]);
    if (data.tfvars_file?.[0]) {
      formData.append("tfvars_file", data.tfvars_file[0]);
    }

    const res = await fetch("http://localhost:5000/upload_files", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setMessage("Upload failed.");
      return;
    }
    setMessage("✅ Files uploaded. Fetching resource list...");

    const json = await res.json();
    const parsed: Resource[] = []; // pseudo
    // replace with real fetch from your endpoint
    setResources(parsed);
    setStep("select");
  }

  function toggle(res: Resource) {
    setSelected((prev) =>
      prev.some((r) => r.type === res.type && r.name === res.name)
        ? prev.filter((r) => r.type !== res.type || r.name !== res.name)
        : [...prev, res]
    );
  }

  async function onGenerate() {
    const body = {
      selected_resources: selected.map((r) => `${r.type}::${r.name}`),
    };
    const res = await fetch("http://localhost:5000/generate_patch", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
        console.log("Patch generation response:", res);
      setMessage("Patch generated! Downloading...");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "updated_actual.tf";
      a.click();
    } else {
      setMessage("Failed to generate patch.");
    }
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-4">
        
        
      {step === "upload" ? (
        <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
          <div>
            <Label>PCI Baseline (.tf)</Label>
            <Input type="file" {...register("pci_file", { required: true })} />
          </div>
          <div>
            <Label>Actual Infra File (.tf)</Label>
            <Input type="file" {...register("actual_file", { required: true })} />
          </div>
          <div>
            <Label>Optional tfvars</Label>
            <Input type="file" {...register("tfvars_file")} />
          </div>
          <Button type="submit">Upload & Compare</Button>
        </form>
      ) : (
        <form className="space-y-4">
          <h2 className="text-lg font-semibold">Select Resources</h2>
          {resources.map((res) => (
            <div key={`${res.type}-${res.name}`} className="flex items-center">
              <Checkbox
                checked={selected.some((r) => r.type === res.type && r.name === res.name)}
                onCheckedChange={() => toggle(res)}
              />
              <span className="ml-2">
                {res.type} "{res.name}"
              </span>
            </div>
          ))}
          <Button onClick={onGenerate}>Generate & Download Patch</Button>
        </form>
      )}
      {message && <p>{message}</p>}
    </Card>
  );
}
