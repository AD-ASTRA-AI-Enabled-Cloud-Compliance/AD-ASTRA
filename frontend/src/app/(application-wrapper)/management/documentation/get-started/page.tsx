"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, UserCog, FileText, ShieldCheck, Upload, CheckCheck, Boxes, FileUp } from "lucide-react"

export default function GetStartedPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Getting Started with Skylock Management</h1>
        <p className="text-muted-foreground">
          A step-by-step guide to using the Skylock platform as a management user
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Management Workflow Overview</CardTitle>
          <CardDescription>
            As a management user, you have access to all platform features, including document processing, rule extraction, and terraform generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
            <div className="flex flex-1 flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900">
                  <FileUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium">1. Process Documentation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload compliance documents to extract rules and requirements automatically
              </p>
            </div>
            <div className="flex flex-1 flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium">2. Generate Terraform</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create compliant Terraform configurations based on extracted rules
              </p>
            </div>
            <div className="flex flex-1 flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900">
                  <Boxes className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium">3. Validate & Provision</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Validate and deploy compliant infrastructure to your cloud environment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Dashboard Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your management dashboard provides an enhanced view of:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Compliance frameworks and rule counts</li>
              <li>Interactive visualization of compliance relationships</li>
              <li>Document processing statistics</li>
              <li>Access to validation and provisioning activities</li>
              <li>System-wide compliance score</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Managing Compliance Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              As a management user, you can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and edit compliance rules</li>
              <li>Organize rules into frameworks and control sets</li>
              <li>Map relationships between different compliance standards</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Effective rule management ensures accurate validation and generates appropriate Terraform configurations.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processing Compliance Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            One of your key responsibilities is processing compliance documents to extract rules:
          </p>
          
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium">Step 1: Access Document Processing</h3>
            <p className="text-sm">Navigate to the "New Document" option in the Frameworks menu</p>
            
            <h3 className="font-medium">Step 2: Upload Document</h3>
            <p className="text-sm">Upload your compliance document (PDF) through the interface</p>
            
            <h3 className="font-medium">Step 3: Process Document</h3>
            <p className="text-sm">The system will extract text and analyze the content for compliance rules</p>
            
            <h3 className="font-medium">Step 4: Review Extracted Rules</h3>
            <p className="text-sm">Verify the AI-extracted rules for accuracy and completeness</p>

          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              <CheckCheck className="h-5 w-5 mr-2 text-green-600" />
              Best Practices for Document Processing
            </h3>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Use clean, well-formatted documents for better extraction accuracy</li>
              <li>Process one standard or framework at a time</li>
              <li>Review extracted rules carefully before publishing</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generating Terraform Configurations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            As a management user, you can generate compliant Terraform configurations from extracted rules:
          </p>
          
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium">Step 1: Access Terraform Generator</h3>
            <p className="text-sm">Navigate to the "Generate Terraform" option in the Frameworks menu</p>
            
            <h3 className="font-medium">Step 2: Select Compliance Framework</h3>
            <p className="text-sm">Choose the compliance framework or specific rules to include</p>
            
            <h3 className="font-medium">Step 4: Set Provider Options</h3>
            <p className="text-sm">Configure cloud provider settings and preferences</p>
            
            <h3 className="font-medium">Step 5: Generate Configuration</h3>
            <p className="text-sm">Process the request to create compliant Terraform files</p>
            
            <h3 className="font-medium">Step 6: Review and Save</h3>
            <p className="text-sm">Examine the generated configuration and save the files</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-900">
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Important Considerations</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <li>Generated configurations should be reviewed by infrastructure experts</li>
              <li>Some compliance rules may not directly translate to Terraform</li>
              <li>Consider performance, cost, and operational implications</li>
              <li>Customization may be needed for specific environments</li>
              <li>Generated configurations serve as a starting point, not a final solution</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <a 
          href="/management/documentation/introduction" 
          className="border bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          ← Introduction
        </a>
        <a 
          href="/management/documentation/tutorials" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Tutorials →
        </a>
      </div>
    </div>
  )
}
