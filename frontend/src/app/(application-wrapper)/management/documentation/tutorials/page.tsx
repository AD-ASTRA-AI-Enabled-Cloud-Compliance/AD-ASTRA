"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, Users, Layout, FileText, ShieldCheck, Upload, ArrowRight, 
  Boxes, BarChart3, AlertCircle, CheckCircle2, AlertTriangle, Info, 
  FileUp, FileCode 
} from "lucide-react"

export default function TutorialsPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Skylock Management Tutorials</h1>
        <p className="text-muted-foreground">
          Step-by-step guides to get the most out of the Skylock platform as a management user
        </p>
      </div>

      <Tabs defaultValue="document">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="document">Document Processing</TabsTrigger>
          <TabsTrigger value="terraform">Terraform Generation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document" className="space-y-6 mt-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Document Processing Tutorial</CardTitle>
              <CardDescription>
                Learn how to process compliance documents and extract rules using Skylock's AI capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">1</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Accessing Document Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Frameworks menu in the sidebar and select "New Document"
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2">
                      <p className="font-mono">Frameworks → New Document</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">2</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Preparing Your Document</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure your compliance document is in a supported format and contains clearly defined rules
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2">
                      <p className="font-mono">Supported formats: PDF, DOCX, TXT</p>
                      <p className="font-mono mt-1">Best results with structured documents</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">3</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Uploading Your Document</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your compliance document through the interface
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Click the upload area or drag and drop your file</li>
                      <li>Select the document type from the dropdown</li>
                      <li>Click "Process Document" to begin analysis</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">4</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Monitoring Processing Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Track the progress of document processing
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-200 dark:border-blue-900 flex items-start space-x-2">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Text Extraction</p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">OCR and text parsing</p>
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md border border-purple-200 dark:border-purple-900 flex items-start space-x-2">
                        <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Rule Detection</p>
                          <p className="text-xs text-purple-700 dark:text-purple-400">AI analysis of content</p>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-200 dark:border-green-900 flex items-start space-x-2">
                        <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">5</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Reviewing Extracted Rules</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify and refine the AI-extracted compliance rules
                    </p>
                    <ol className="list-decimal pl-5 text-sm space-y-1 mt-2">
                      <li>Review each extracted rule for accuracy</li>
                      <li>Edit rule descriptions, categories, and metadata as needed</li>
                      <li>Add missing rules that weren't automatically detected</li>
                      <li>Remove any false positives or duplicates</li>
                      <li>Assign appropriate tags and classifications</li>
                    </ol>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">6</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Establishing Framework Relationships</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect rules to existing frameworks and establish relationships
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Map rules to existing frameworks when applicable</li>
                      <li>Establish parent-child relationships between rules</li>
                      <li>Create cross-references between related standards</li>
                      <li>Define rule dependencies and prerequisites</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">7</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Publishing Rules</h3>
                    <p className="text-sm text-muted-foreground">
                      Make the reviewed rules available in the platform
                    </p>
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-200 dark:border-amber-900 mt-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Important</p>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        Once published, rules become available for all users. Ensure thorough review before publishing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terraform" className="space-y-6 mt-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Terraform Generation Tutorial</CardTitle>
              <CardDescription>
                Learn how to generate compliant Terraform configurations from compliance rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">1</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Accessing Terraform Generator</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Frameworks menu and select "Generate Terraform"
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2">
                      <p className="font-mono">Frameworks → Generate Terraform</p>
                    </div>
                  </div>
                </div>
            
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">4</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Setting Provider Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure cloud provider settings and preferences
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Select the target cloud provider (AWS, Azure, GCP)</li>
                      <li>Configure provider-specific settings</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">5</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Advanced Configuration Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Fine-tune the Terraform generation process
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="bg-muted p-3 rounded-md flex items-start space-x-2">
                        <div>
                          <p className="text-sm font-medium">Variable Configuration</p>
                          <p className="text-xs text-muted-foreground">Customize variable definitions and defaults</p>
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-md flex items-start space-x-2">
                        <div>
                          <p className="text-sm font-medium">Module Structure</p>
                          <p className="text-xs text-muted-foreground">Configure how Terraform modules are organized</p>
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-md flex items-start space-x-2">
                        <div>
                          <p className="text-sm font-medium">Output Definitions</p>
                          <p className="text-xs text-muted-foreground">Specify resource outputs to expose</p>
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-md flex items-start space-x-2">
                        <div>
                          <p className="text-sm font-medium">Backend Configuration</p>
                          <p className="text-xs text-muted-foreground">Set up state management options</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">6</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Generating the Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Process the request to create compliant Terraform files
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm mt-2">
                      <p className="font-mono">Click "Generate Terraform" to create configuration files</p>
                      <p className="font-mono mt-1">The generation process may take a few minutes depending on complexity</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">7</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Reviewing Generated Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Examine the generated Terraform files for correctness and completeness
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Review each resource definition for accuracy</li>
                      <li>Check that all compliance requirements are properly implemented</li>
                      <li>Verify variable definitions and defaults</li>
                      <li>Ensure provider configuration is correct</li>
                      <li>Examine module structure and relationships</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mt-1">
                    <span className="text-purple-700 dark:text-purple-300 font-bold">8</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Downloading and Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      Save and share the generated Terraform configuration
                    </p>
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-muted rounded-md">
                      <Info className="h-5 w-5 text-blue-500" />
                      <p className="text-xs">You can download individual files or the complete configuration as a ZIP archive</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Compliance Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Create and customize compliance framework visualizations:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Access the visualization dashboard</li>
                  <li>Select frameworks to include in the visualization</li>
                  <li>Configure node and relationship display options</li>
                  <li>Use interactive filters to focus on specific areas</li>
                  <li>Export visualizations for presentations or documentation</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Manage user access and permissions:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Invite new users to the platform</li>
                  <li>Assign management or user roles</li>
                  <li>Configure team structures and permissions</li>
                  <li>Set up custom role-based access controls</li>
                  <li>Monitor user activity and audit logs</li>
                </ol>
              </CardContent>

            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileCode className="h-5 w-5 mr-2" />
                  Custom Rule Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Create custom compliance rules manually:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Access the rule editor interface</li>
                  <li>Define rule metadata and categorization</li>
                  <li>Write rule criteria and requirements</li>
                  <li>Specify validation logic for Terraform resources</li>
                  <li>Test and publish custom rules</li>
                </ol>
              </CardContent>

            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Boxes className="h-5 w-5 mr-2" />
                  Compliance Scoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm">
                  Generate comprehensive compliance score:
                </p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Access the scoring dashboard</li>
                  <li>Select checkboxes for terraform blocks to apply and generate a patch</li>
                  <li>Visualize your security score changes</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <a 
          href="/management/documentation/get-started" 
          className="border bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          ← Getting Started
        </a>
      </div>
    </div>
  )
}
