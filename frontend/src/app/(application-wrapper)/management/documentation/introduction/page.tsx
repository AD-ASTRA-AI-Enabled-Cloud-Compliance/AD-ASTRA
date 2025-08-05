"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function IntroductionPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Skylock Platform: Introduction</h1>
        <p className="text-muted-foreground">
          An AI-powered cloud compliance solution for modern enterprises
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>The Cloud Compliance Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Modern enterprises face increasingly complex cloud infrastructures across multiple providers, 
              making compliance management a significant challenge:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manual compliance checking is error-prone and time-consuming</li>
              <li>Existing tools lack comprehensive understanding of regulatory text</li>
              <li>Disconnected systems create information silos and knowledge gaps</li>
              <li>Security teams struggle to keep pace with cloud infrastructure changes</li>
              <li>Compliance failures can lead to severe penalties and reputational damage</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The Skylock Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Skylock is an AI-powered platform that bridges the gap between cloud infrastructure and compliance requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Intelligent document processing extracts compliance rules from regulatory documents</li>
              <li>AI-powered understanding of both compliance language and infrastructure code</li>
              <li>Automated validation of Terraform configurations against compliance rules</li>
              <li>Interactive visualization of compliance frameworks and relationships</li>
              <li>Streamlined provisioning of compliant cloud resources</li>
              <li>Role-based access for both compliance managers and infrastructure teams</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">For Compliance Managers (You)</h3>
              <p>
                As a management user, you have access to advanced features for ingesting regulatory documents,
                extracting compliance rules, and establishing governance frameworks:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Upload and process compliance documents</li>
                <li>Review and refine AI-extracted compliance rules</li>
                <li>Generate Terraform configurations that satisfy compliance requirements</li>
                <li>Monitor overall compliance status across the organization</li>
                <li>Create and manage compliance frameworks and control sets</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">For Infrastructure Teams (Regular Users)</h3>
              <p>
                Regular users have access to a subset of features focused on validating and deploying 
                cloud resources that align with organizational compliance requirements:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access a dashboard of compliance rules and frameworks</li>
                <li>Validate Terraform configurations against compliance rules</li>
                <li>Provision compliant infrastructure directly from the platform</li>
                <li>Understand compliance requirements through clear documentation</li>
                <li>Receive actionable feedback on compliance violations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold">Speed & Efficiency</h3>
              <p className="text-sm text-muted-foreground">
                Automate compliance checking and validation, reducing manual effort by up to 80% and accelerating deployment cycles.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Reduced Risk</h3>
              <p className="text-sm text-muted-foreground">
                Catch compliance issues before deployment, preventing costly remediation and potential regulatory penalties.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Better Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Bridge the gap between compliance and engineering teams with a shared platform and common language.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Leverage advanced machine learning to extract, interpret, and apply compliance requirements.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Continuous Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Maintain compliance throughout the infrastructure lifecycle, not just at audit time.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Visibility & Traceability</h3>
              <p className="text-sm text-muted-foreground">
                Gain clear visualization of compliance status and relationships across frameworks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <a 
          href="/management/documentation/get-started" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Get Started →
        </a>
      </div>
    </div>
  )
}
