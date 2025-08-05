"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, UserCog, FileText, ShieldCheck, Upload, CheckCheck, Boxes } from "lucide-react"

export default function GetStartedPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Getting Started with Skylock</h1>
        <p className="text-muted-foreground">
          A step-by-step guide to using the Skylock platform as a user
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Workflow Overview</CardTitle>
          <CardDescription>
            As a user, you'll primarily work with compliance rules, validate Terraform configurations, and provision compliant infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
            <div className="flex flex-1 flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium">1. Review Compliance Rules</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Start by reviewing the compliance rules dashboard to understand the requirements that apply to your infrastructure
              </p>
            </div>
            <div className="flex flex-1 flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900">
                  <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium">2. Validate Your Configuration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload your Terraform configuration files to verify compliance with our security baselines
              </p>
            </div>
            <div className="flex flex-1 flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900">
                  <Boxes className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium">3. Provision Resources</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Deploy your validated configuration to provision compliant cloud resources
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
              Your dashboard provides an at-a-glance view of:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Active compliance frameworks and rule counts</li>
              <li>Visualization of compliance relationships</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Exploring Compliance Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The "Explore Rules" section allows you to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browse compliance rules by framework</li>
              <li>View detailed rule requirements</li>
              <li>Understand relationships between different compliance frameworks</li>
              <li>Search for specific rules or requirements</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Take time to familiarize yourself with the compliance requirements to better understand what your infrastructure needs to meet.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validating Terraform Configurations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            The Terraform validation process helps ensure your infrastructure configurations comply with compliance requirements:
          </p>
          
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium">Step 1: Access the Validator</h3>
            <p className="text-sm">Navigate to the "Deployments" menu and select "Validate Terraform"</p>
            
            <h3 className="font-medium">Step 2: Upload Configuration</h3>
            <p className="text-sm">Upload your Terraform (.tf) files through the provided interface</p>
            
            <h3 className="font-medium">Step 3: Review Results</h3>
            <p className="text-sm">The system will analyze your configuration against all applicable compliance rules</p>
            
            <h3 className="font-medium">Step 4: Address Issues</h3>
            <p className="text-sm">Review any non-compliant elements and make necessary adjustments</p>
            
            <h3 className="font-medium">Step 5: Re-validate</h3>
            <p className="text-sm">Upload your revised configuration to verify all issues have been resolved</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              <CheckCheck className="h-5 w-5 mr-2 text-green-600" />
              Best Practices
            </h3>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Validate early and often during development</li>
              <li>Pay attention to the severity levels of compliance issues</li>
              <li>Maintain a version history of your configurations</li>
              <li>Use the detailed feedback to learn about compliance requirements</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provisioning Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Once your Terraform configuration passes validation, you can proceed to provision resources:
          </p>
          
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium">Step 1: Access the Provisioner</h3>
            <p className="text-sm">Navigate to the "Deployments" menu and select "Provision Resources"</p>
            
            <h3 className="font-medium">Step 2: Select Configuration</h3>
            <p className="text-sm">Upload your validated Terraform configuration</p>
            
            <h3 className="font-medium">Step 3: Configure Deployment Settings</h3>
            <p className="text-sm">Specify any deployment variables or environment-specific settings</p>
            
            <h3 className="font-medium">Step 4: Review Plan</h3>
            <p className="text-sm">Review the deployment plan to confirm the resources to be created</p>
            
            <h3 className="font-medium">Step 5: Apply Changes</h3>
            <p className="text-sm">Confirm to provision the resources in your cloud environment</p>
            
            <h3 className="font-medium">Step 6: Monitor Deployment</h3>
            <p className="text-sm">Track the provisioning process and review the results</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-900">
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Important Notes</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <li>Ensure you have appropriate cloud provider credentials configured</li>
              <li>Be mindful of costs associated with provisioned resources</li>
              <li>Use terraform state management best practices</li>
              <li>Consider using workspaces for different environments</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <a 
          href="/user/documentation/introduction" 
          className="border bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          ← Introduction
        </a>
        <a 
          href="/user/documentation/tutorials" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Tutorials →
        </a>
      </div>
    </div>
  )
}
