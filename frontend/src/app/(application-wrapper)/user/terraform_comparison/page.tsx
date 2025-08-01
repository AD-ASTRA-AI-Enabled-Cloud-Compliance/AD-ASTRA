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

import RuleSelectorForm from '../../management/terraform/components/RuleSelectorForm';
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

  async function handleResourceSelection() {
    if (selected.length === 0) {
      setMessage('Please select at least one resource to patch.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3030/merge_resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resources: selected,
        }),
      });

      const data = await res.json();
      setMergedContent(data.merged_content);
      setScore(data.score);
      // Scroll to the right place
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Failed to merge resources:', error);
      setMessage('Failed to merge resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleResourceToggle(resource: Resource) {
    setSelected(prev => {
      // Check if the resource is already selected
      const isSelected = prev.some(r => r.type === resource.type && r.name === resource.name);
      
      if (isSelected) {
        // Remove the resource if already selected
        return prev.filter(r => !(r.type === resource.type && r.name === resource.name));
      } else {
        // Add the resource if not selected
        return [...prev, resource];
      }
    });
  }

  function downloadMergedFile() {
    const element = document.createElement('a');
    const file = new Blob([mergedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'patched_terraform.tf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Terraform Compliance Checker</h1>
      
      {step === 'upload' && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <CardTitle className="mb-4">Upload Terraform Files</CardTitle>
            
            <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
              <div>
                <Label htmlFor="actual_file">Your Terraform File (.tf)</Label>
                <Input 
                  id="actual_file"
                  type="file" 
                  accept=".tf"
                  {...register('actual_file', { required: true })} 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="tfvars_file">Variables File (.tfvars) - Optional</Label>
                <Input 
                  id="tfvars_file"
                  type="file" 
                  accept=".tfvars"
                  {...register('tfvars_file')} 
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">Select Frameworks:</p>
                <div className="flex flex-wrap gap-4">
                  {frameworks.map((framework) => (
                    <div key={framework} className="flex items-center gap-2">
                      <Checkbox
                        id={`framework-${framework}`}
                        checked={selectedFrameworks.includes(framework)}
                        onCheckedChange={() => handleToggle(framework, selectedFrameworks, setSelectedFrameworks)}
                      />
                      <label htmlFor={`framework-${framework}`} className="text-sm">
                        {framework}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Select Providers:</p>
                <div className="flex flex-wrap gap-4">
                  {providers.map((provider) => (
                    <div key={provider} className="flex items-center gap-2">
                      <Checkbox
                        id={`provider-${provider}`}
                        checked={selectedProviders.includes(provider)}
                        onCheckedChange={() => handleToggle(provider, selectedProviders, setSelectedProviders)}
                      />
                      <label htmlFor={`provider-${provider}`} className="text-sm">
                        {provider}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Upload & Analyze
              </Button>
            </form>
            
            {message && (
              <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {step === 'select' && (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <CardTitle className="mb-4">Select Resources to Patch</CardTitle>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Select</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Resource Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resources.map((resource, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox 
                            checked={selected.some(r => r.type === resource.type && r.name === resource.name)}
                            onCheckedChange={() => handleResourceToggle(resource)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{resource.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{resource.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back to Upload
                </Button>
                <Button onClick={handleResourceSelection} disabled={isLoading}>
                  {isLoading ? <Loader /> : 'Generate Patched File'}
                </Button>
              </div>
              
              {message && (
                <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
                  {message}
                </div>
              )}
            </CardContent>
          </Card>
          
          {mergedContent && (
            <Card id="results">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle>Results</CardTitle>
                  <Button onClick={downloadMergedFile}>
                    Download Patched File
                  </Button>
                </div>
                
                <div className="mb-6 flex justify-center">
                  <div className="w-48">
                    <GaugeChartScore score={score} />
                    <p className="text-center mt-2">Compliance Score</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded overflow-auto">
                  <pre className="text-sm">{mergedContent}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
