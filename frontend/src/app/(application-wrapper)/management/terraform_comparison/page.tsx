'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GaugeChartScore } from '@/components/GaugeChartScore';

type UploadForm = {
  baseline_file: FileList;   // renamed from pci_file
  actual_file: FileList;
  tfvars_file?: FileList;
};

type Resource = {
  type: string;
  name: string;
};

export default function TerraformComparisonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const { register, handleSubmit } = useForm<UploadForm>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource[]>([]);
  const [mergedContent, setMergedContent] = useState('');
  const [score, setScore] = useState(0);
  const [step, setStep] = useState<'upload' | 'select'>('upload');
  const [message, setMessage] = useState('');

  // Authentication and authorization check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      // No token, redirect to login
      router.push("/login");
      return;
    }
    
    // Only management role can access this page
    if (role !== "management") {
      setUnauthorized(true);
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2000); // wait 2 seconds before redirect
    } else {
      setIsLoading(false);
    }
  }, [router]);

  async function onUpload(data: UploadForm) {
    const formData = new FormData();
    formData.append('baseline_file', data.baseline_file[0]);
    formData.append('actual_file', data.actual_file[0]);
    if (data.tfvars_file?.[0]) {
      formData.append('tfvars_file', data.tfvars_file[0]);
    }

    const res = await fetch('http://localhost:5000/upload_files', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      setMessage('Upload failed.');
      return;
    }

    const json = await res.json();
    setResources(json.gaps);
    setStep('select');
    setMessage('✅ Files uploaded. Select resources to patch.');
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

    const res = await fetch('http://localhost:5000/generate_patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = await res.json();
      setMergedContent(json.merged_patch);
      setScore(json.compliance_score);
      setMessage('✅ Merged patch generated and saved to DB.');
    } else {
      setMessage('⚠️ Server error.');
    }
  }

  function onCopy() {
    navigator.clipboard.writeText(mergedContent);
    setMessage('📋 Copied to clipboard!');
  }

  function onDownload() {
    const blob = new Blob([mergedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_actual.tf';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show unauthorized message if user doesn't have management role
  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          This page requires management access. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {step === 'upload' ? (
        <Card className="max-w-md mx-auto p-6 space-y-4">
          <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
            <div>
              <Label>Baseline (.tf)</Label>
              <Input type="file" {...register('baseline_file', { required: true })} />
            </div>
            <div>
              <Label>Actual Infra File (.tf)</Label>
              <Input type="file" {...register('actual_file', { required: true })} />
            </div>
            <div>
              <Label>Optional tfvars</Label>
              <Input type="file" {...register('tfvars_file')} />
            </div>
            <Button type="submit">Upload & Compare</Button>
          </form>
          {message && <p>{message}</p>}
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Resource Selection */}
          <Card className="w-full md:w-1/2 p-4 overflow-y-auto h-[600px]">
            <h2 className="text-lg font-semibold mb-2">Select Resources</h2>
            {resources.map((res) => (
              <div key={`${res.type}-${res.name}`} className="flex items-center mb-2">
                <Checkbox
                  id={`${res.type}-${res.name}`}
                  checked={selected.some((r) => r.type === res.type && r.name === res.name)}
                  onCheckedChange={() => toggle(res)}
                />
                <label htmlFor={`${res.type}-${res.name}`} className="ml-2">
                  {res.type} "{res.name}"
                </label>
              </div>
            ))}
            <Button onClick={onGenerate} className="mt-4">
              Generate Patch
            </Button>
            {message && <p className="mt-2">{message}</p>}
          </Card>

          {/* Right: Patch Preview & Actions */}
          <Card className="w-full md:w-1/2 p-4 h-[600px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Merged Terraform File</h2>
              <span className="text-sm text-green-700 font-semibold">Score: {score}%</span>
            </div>

            {/* Gauge Chart here */}
            <div className="mb-4">
              <GaugeChartScore score={score} />
            </div>

            <div className="flex gap-2 mb-3">
              <Button variant="outline" onClick={onCopy}>📋 Copy</Button>
              <Button variant="outline" onClick={onDownload}>⬇️ Download</Button>
            </div>

            <div className="overflow-y-auto bg-muted p-2 rounded-md text-sm font-mono whitespace-pre-wrap flex-1">
              {mergedContent || 'Patch content will appear here after generation.'}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
