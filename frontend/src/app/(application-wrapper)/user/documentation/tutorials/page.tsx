"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, Users, Layout, FileText, ShieldCheck, Upload, ArrowRight, 
  Boxes, BarChart3, AlertCircle, CheckCircle2, AlertTriangle, Info 
} from "lucide-react"

export default function TutorialsPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Skylock Tutorials</h1>
        <p className="text-muted-foreground">
          Step-by-step guides to get the most out of the Skylock platform
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Getting Started</TabsTrigger>
          <TabsTrigger value="validation">Terraform Validation</TabsTrigger>
          <TabsTrigger value="provisioning">Resource Provisioning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Creating Your Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Learn how to create and set up your Skylock account for the first time:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Navigate to the Skylock login page</li>
                  <li>Click "Sign up" to create a new account</li>
                  <li>Fill in your details and select your role</li>
                  <li>Verify your email address</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Layout className="h-5 w-5 mr-2" />
                  Navigating the Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Understand the key components of your user dashboard:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Overview of the compliance summary cards</li>
                  <li>Understanding the compliance framework visualization</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Exploring Compliance Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Learn how to navigate and understand compliance requirements:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Accessing the Explore Rules section</li>
                  <li>Filtering rules by framework or category</li>
                  <li>Understanding rule details and requirements</li>
                  <li>Viewing related compliance frameworks</li>
                  <li>Searching for specific compliance criteria</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Understanding Compliance Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Make sense of the compliance visualization tools:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Interpreting the D3 network graph</li>
                  <li>Identifying relationships between frameworks</li>
                  <li>Using interactive filters and highlighting</li>
                  <li>Exporting visualization data</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="validation" className="space-y-6 mt-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Terraform Validation Tutorial</CardTitle>
              <CardDescription>
                Learn how to validate your Terraform configurations against compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">1</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Accessing the Validation Tool</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Deployments menu in the sidebar and select "Validate Terraform"
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2">
                      <p className="font-mono">Deployments → Validate Terraform</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">2</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Preparing Your Terraform Files</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure your Terraform files are properly formatted and contain all necessary resource definitions
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2 overflow-x-auto">
                      <pre className="font-mono">
{`# Example Terraform file structure
main.tf       # Main resource definitions
variables.tf  # Variable declarations
outputs.tf    # Output definitions
providers.tf  # Provider configuration`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">3</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Uploading Your Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the file upload interface to submit your Terraform files for validation
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Click the upload area or drag and drop your files</li>
                      <li>Wait for the upload to complete before proceeding</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">4</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Understanding Validation Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn to interpret the validation results and their implications
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-200 dark:border-green-900 flex items-start space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">Compliant</p>
                          <p className="text-xs text-green-700 dark:text-green-400">Resource meets all compliance requirements</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-200 dark:border-amber-900 flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Warning</p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">Potential issues that should be reviewed</p>
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-200 dark:border-red-900 flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">Non-compliant</p>
                          <p className="text-xs text-red-700 dark:text-red-400">Resource violates compliance requirements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">5</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Addressing Compliance Issues</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn how to resolve identified compliance violations in your configuration
                    </p>
                    <ol className="list-decimal pl-5 text-sm space-y-1 mt-2">
                      <li>Review each checkbox in the validation output</li>
                      <li>Note the specific resource and property that needs modification</li>
                      <li>Refer to the description for terraform block purpose</li>
                      <li>Update your Terraform files according to the guidance</li>
                      <li>Re-upload and validate the modified configuration</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="provisioning" className="space-y-6 mt-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Resource Provisioning Tutorial</CardTitle>
              <CardDescription>
                Learn how to deploy validated Terraform configurations to your cloud environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">1</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Prerequisites</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure you have all the necessary prerequisites before provisioning
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>A validated Terraform configuration that passes compliance checks</li>
                      <li>Proper cloud provider credentials configured in your account</li>
                      <li>Sufficient permissions to create the defined resources</li>
                      <li>Understanding of the resources to be provisioned and their costs</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Accessing the Provisioner</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the provisioning interface to deploy your configuration
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2">
                      <p className="font-mono">Deployments → Provision Resources</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Uploading Terraform Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your validated Terraform files to the provisioner
                    </p>
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-muted rounded-md">
                      <Info className="h-5 w-5 text-blue-500" />
                      <p className="text-xs">You can use a configuration that has already passed validation or upload a new one</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">4</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Setting Deployment Variables</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure any variables required by your Terraform configuration
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2 overflow-x-auto">
                      <pre className="font-mono">
{`# Example variables
region = "us-west-2"
instance_type = "t2.micro"
environment = "development"
tags = {
  Owner = "DevOps Team"
  Project = "Cloud Migration"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">5</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Reviewing the Deployment Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Carefully review the generated plan before applying changes
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Verify all resources to be created, modified, or destroyed</li>
                      <li>Check resource configurations and properties</li>
                      <li>Confirm that the plan aligns with your expectations</li>
                      <li>Review any warnings or notes provided by the system</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">6</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Applying the Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Deploy your resources by applying the Terraform configuration
                    </p>
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-200 dark:border-amber-900 mt-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Important</p>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        This action will create actual resources in your cloud environment and may incur costs. Double-check your configuration before confirming.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">7</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Monitoring Deployment Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Track the progress of your resource provisioning
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Monitor resource creation and configuration</li>
                      <li>Track any errors or warnings during deployment</li>
                      <li>Wait for the complete execution of the terraform apply command</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">8</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Reviewing Deployment Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify the successful provisioning of your resources
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Verify resources in your cloud provider's console</li>
                      <li>Confirm that all compliance requirements have been met</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <a 
          href="/user/documentation/get-started" 
          className="border bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          ← Getting Started
        </a>
      </div>
    </div>
  )
}
