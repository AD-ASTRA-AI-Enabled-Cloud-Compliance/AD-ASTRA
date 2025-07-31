'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GaugeChartScore } from '@/components/GaugeChartScore';
import Loader from '@/components/ui/loader';

import RuleSelectorForm from '../terraform/components/RuleSelectorForm';
import { frameworks, providers } from '@/utils/commons';
import { Divider } from '@chakra-ui/react';

type UploadForm = {
  // baseline_file: FileList;   // renamed from pci_file
  actual_file: FileList;
  tfvars_file?: FileList;
};

type Resource = {
  type: string;
  name: string;
};

export default function TerraformComparisonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const { register, handleSubmit } = useForm<UploadForm>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource[]>([]);
  const [mergedContent, setMergedContent] = useState('');
  const [score, setScore] = useState(0);
  const [step, setStep] = useState<'upload' | 'select'>('upload');
  const [message, setMessage] = useState('');


  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [downloadLinks, setDownloadLinks] = useState<string[]>([])
  const [tf, setTF] = useState<string>()

  const handleToggle = (
    value: string,
    group: string[],
    setGroup: (group: string[]) => void
  ) => {
    const updatedGroup = group.includes(value)
      ? group.filter((item) => item !== value)
      : [...group, value]
    setGroup(updatedGroup)
  }


  async function onUpload(data: UploadForm) {
    const formData = new FormData();
    // formData.append('baseline_file', data.baseline_file[0]);
    formData.append('actual_file', data.actual_file[0]);
    if (data.tfvars_file?.[0]) {
      formData.append('tfvars_file', data.tfvars_file[0]);
    }
    // Add selected frameworks/providers as JSON string
    formData.append(
      'frameworks',
      JSON.stringify({
        frameworks: selectedFrameworks,
      })
    );
    formData.append(
      'providers',
      JSON.stringify({
        providers: selectedProviders,
      })
    );

    
    const res = await fetch('http://localhost:3030/upload_files', {
      method: 'POST',
      body: formData,

    });
    console.log(res)
    if (!res.ok) {
      setMessage('Upload failed.');
      const errorText = await res.text();
      console.error("Server responded with an error:", errorText);
      throw new Error(`Upload failed: ${res.status}`);
    }

    const json = await res.json();
    console.log(json.gaps);
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

    setMergedContent('');
    const body = {
      selected_resources: selected.map((r) => `${r.type}::${r.name}`),
    };

    const res = await fetch('http://localhost:3030/generate_patch', {
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
      <Loader />
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
    <div className="p-6 space-y-4 ">
      {step}
      {step === 'upload' ? (
        <Card className="mx-auto p-6 space-y-4 flex flex-row">
          {/* <RuleSelectorForm /> */}
          <form onSubmit={handleSubmit(onUpload)} className="space-y-4">

            <CardTitle>
              Generate Terraform Baselines
            </CardTitle>

            <div>
              <Label className='pb-1 text-xs'>
                *Select the frameworks and cloud providers to generate Terraform baselines for.
              </Label>
              <Divider />

              <Label className='pb-1'>Select Framework(s)</Label>

              <div className='flex flex-row gap-1 pb-1'>
                {frameworks.map((fw) => (
                  <div key={fw} className='flex flex-row gap-1 pb-1'>
                    <Checkbox
                      id={`${fw}-checkbox`}
                      checked={selectedFrameworks.includes(fw)}
                      onCheckedChange={() => handleToggle(fw, selectedFrameworks, setSelectedFrameworks)}
                    />
                    <Label htmlFor={`${fw}-checkbox`}>{fw}</Label>
                  </div>
                ))}
              </div>

              <Label className='pb-1'>Select Framework(s)</Label>
              <div className='flex flex-row gap-1'>

                {providers.map((provider) => (
                  <div key={provider} className='flex flex-row gap-1 pb-1'>
                    <Checkbox
                      disabled={provider !== "azure"}
                      id={`${provider}-checkbox`}
                      checked={selectedProviders.includes(provider)}
                      onCheckedChange={() =>
                        handleToggle(provider, selectedProviders, setSelectedProviders)}
                    />
                    <Label htmlFor={`${provider}-checkbox`}>
                      {provider.toUpperCase()}
                      <span className='text-xs '>
                        {provider != "azure" ? "(Coming soon...)" : ""}

                      </span>
                    </Label>
                  </div>
                ))}
              </div>

              <Divider />

              {/* <Button onClick={handleSubmit}>
            Generate Terraform Baselines
          </Button> */}

            </div>
            {/* <div>
              <Label>Baseline (.tf)</Label>
              <Input type="file" {...register('baseline_file', { required: true })} />
            </div> */}
            <div>
              <Label className='pb-1 '>Actual Infra File (.tf)</Label>
              <Input type="file" {...register('actual_file', { required: true })} />
            </div>
            <div>
              <Label className='pb-1'>tfvars<span className='text-xs text-muted-foreground'>(Optional)</span></Label>
              <Input type="file" {...register('tfvars_file')} />
            </div>
            <Button type="submit">Upload & Compare</Button>
          </form>
          {message && <p>{message}</p>}
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Resource Selection */}
          <Card className="w-full md:w-1/2  overflow-y-auto h-[600px]">
            <h2 className="text-lg font-semibold">Select Resources</h2>
            {resources.map((res) => (
              <div key={`${res.type}-${res.name}`} className="flex items-center">
                <Checkbox
                  id={`${res.type}-${res.name}`}
                  checked={selected.some((r) => r.type === res.type && r.name === res.name)}
                  onCheckedChange={() => toggle(res)}
                />
                <Label htmlFor={`${res.type}-${res.name}`} className="ml-2">
                  {res.type} "{res.name}"
                </Label>
              </div>
            ))}
            <Button onClick={onGenerate} className="">
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
