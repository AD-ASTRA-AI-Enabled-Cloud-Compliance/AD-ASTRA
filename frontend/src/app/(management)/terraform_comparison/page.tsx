'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GaugeChartScore } from '@/components/GaugeChartScore';

// Type definition for the upload form
type UploadForm = {
  baseline_file: FileList;
  actual_file: FileList;
  tfvars_file?: FileList;
};

// Resource structure includes optional comment
type Resource = {
  type: string;
  name: string;
  comment?: string;
};

export default function TerraformComparisonPage() {
  const { register, handleSubmit } = useForm<UploadForm>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource[]>([]);
  const [mergedContent, setMergedContent] = useState('');
  const [score, setScore] = useState(0);
  const [step, setStep] = useState<'upload' | 'select'>('upload');
  const [message, setMessage] = useState('');

  // Handle file upload and fetch initial gaps and score
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

  // Toggle resource selection
  function toggle(res: Resource) {
    setSelected((prev) =>
      prev.some((r) => r.type === res.type && r.name === res.name)
        ? prev.filter((r) => r.type !== res.type || r.name !== res.name)
        : [...prev, res]
    );
  }

  // Handle patch generation from selected resources
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

  // Copy merged patch to clipboard
  function onCopy() {
    navigator.clipboard.writeText(mergedContent);
    setMessage('📋 Copied to clipboard!');
  }

  // Download merged patch as .tf file
  function onDownload() {
    const blob = new Blob([mergedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_actual.tf';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-4">
      {step === 'upload' ? (
        // Upload form
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
        // Gap selection and patch preview
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Resource Selection */}
          <Card className="w-full md:w-1/2 p-4 overflow-y-auto h-[600px]">
            <h2 className="text-lg font-semibold mb-2">Select Resources</h2>
            {resources.map((res) => (
              <Card key={`${res.type}-${res.name}`} className="p-3 mb-3 border rounded-md">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`${res.type}-${res.name}`}
                    checked={selected.some((r) => r.type === res.type && r.name === res.name)}
                    onCheckedChange={() => toggle(res)}
                  />
                  <div>
                    <Label htmlFor={`${res.type}-${res.name}`} className="font-medium">
                      {res.type} "{res.name}"
                    </Label>
                    {res.comment && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        🛡️ {res.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
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

            {/* Gauge Chart Visualization */}
            <div className="mb-4">
              <GaugeChartScore score={score} />
            </div>

            {/* Copy / Download Actions */}
            <div className="flex gap-2 mb-3">
              <Button variant="outline" onClick={onCopy}>📋 Copy</Button>
              <Button variant="outline" onClick={onDownload}>⬇️ Download</Button>
            </div>

            {/* Final Patch Output */}
            <div className="overflow-y-auto bg-muted p-2 rounded-md text-sm font-mono whitespace-pre-wrap flex-1">
              {mergedContent || 'Patch content will appear here after generation.'}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
