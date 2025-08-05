"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import D3Force from "@/components/ui/d3force"
import Link from "next/link"
import Loader from "@/components/ui/loader"
import { CountsCard } from "../components/CountsCard"
// Modified for enhancing management dashboard functionality
// Added imports for real-time dashboard data fetching and API integration
// TO REVERT: Remove these two import lines
import { useDashboardData } from "@/hooks/useDashboardData"
// import { getDownloadUrl } from "@/lib/dashboardApi"
// End Modified for enhancing management dashboard functionality


export default function Page() {
  const router = useRouter()
  // Modified for enhancing management dashboard functionality
  // Added real-time data fetching for document and rules statistics
  // TO REVERT: Remove this line and the destructuring
  const { documentStats, rulesStats, isLoading, error, refetch } = useDashboardData()
  // End Modified for enhancing management dashboard functionality

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "management") {
      router.push("/dashboard")
    }
  }, [router])



  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Loader />
    );
  }


  return (
    <div className="h-full">
      <div className="grid gap-4 md:grid-cols-2 h-[80vh]">
        {/* Statistics Card - Now on Left */}
        <div className="bg-muted/50 rounded-sm p-4 h-full">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-8">Document & Rules Overview</h3>

            {/* Uploaded Documents Section */}
            <div className="mb-0 pb-0">
              <h4 className="text-md font-medium mb-2">Uploaded Documents</h4>
              <div className="space-y-1">
                {/* Modified for enhancing management dashboard functionality */}
                {/* Original static text (commented out): */}
                {/* <span className="font-medium">Framework Documents:</span> Loading... */}
                {/* Real-time document statistics display with loading states and error handling */}
                {/*
                <div className="p-4 bg-card rounded border text-sm">
                  <span className="font-medium">Framework Documents:</span>{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : error ? (
                    <span className="text-red-500">Error loading data</span>
                  ) : (
                    `${documentStats?.total_documents || 0} files (${documentStats?.pdf_documents || 0} PDFs)`
                  )}
                </div>
                */}
                {/* End Modified for enhancing management dashboard functionality */}
                {/* Removed View & Download Documents button - just showing count for now */}
                <CountsCard
                  data={[{
                    framework: "Framework Documents",
                    count: documentStats?.pdf_documents || 0,
                    countLabel: documentStats?.pdf_documents === 1 ? "PDF" : "PDFs"
                  }]}
                  isLoading={isLoading}
                  error={error ? "Error loading data" : null}
                  totalRules={documentStats?.pdf_documents}
                />
              </div>
            </div>
            
            {/* Rules Statistics Section */}
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Compliance Rules</h4>
              <div className="space-y-4">
                {/* Modified for enhancing management dashboard functionality */}
                {/* Original static text (commented out): */}
                {/* <div className="p-4 bg-card rounded border text-sm"> */}
                {/*   <span className="font-medium">Total Rules:</span> Loading... */}
                {/* </div> */}
                {/* <div className="p-4 bg-card rounded border text-sm"> */}
                {/*   <span className="font-medium">Frameworks:</span> Loading... */}
                {/* </div> */}
                {/* Real-time compliance rules statistics from Qdrant database with loading states */}
                {/*
                <div className="p-4 bg-card rounded border text-sm">
                  <span className="font-medium">Total Rules:</span>{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : error ? (
                    <span className="text-red-500">Error loading data</span>
                  ) : rulesStats?.collection_exists ? (
                    rulesStats.total_rules.toLocaleString()
                  ) : (
                    "Database not available"
                  )}
                </div>
                <div className="p-4 bg-card rounded border text-sm">
                  <span className="font-medium">Frameworks:</span>{" "}
                  {isLoading ? (
                    "Loading..."
                  ) : error ? (
                    <span className="text-red-500">Error loading data</span>
                  ) : rulesStats?.collection_exists ? (
                    `${rulesStats.frameworks_count} frameworks (${rulesStats.frameworks.slice(0, 3).join(", ")}${rulesStats.frameworks.length > 3 ? "..." : ""})`
                  ) : (
                    "Database not available"
                  )}
                </div>
                */}
                {/* End Modified for enhancing management dashboard functionality */}
                <CountsCard
                  data={rulesStats?.collection_exists && Array.isArray(rulesStats.frameworks) && Array.isArray(rulesStats.frameworks_rules_count)
                    ? rulesStats.frameworks.map((fw, idx) => ({
                        framework: fw,
                        count: rulesStats.frameworks_rules_count[idx] || 0
                      }))
                    : []}
                  isLoading={isLoading}
                  error={error ? "Error loading data" : null}
                  totalRules={rulesStats?.total_rules}
                />
                <Link 
                  href="/management/explore_rules" 
                  className="block w-full p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded text-center text-sm border mt-4"
                >
                  🔍 Explore Rules Database
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* D3 Visualization Card - Now on Right */}
        <div className="bg-muted/50 rounded-sm p-4 flex flex-col h-full">
          {/* Description section for D3 visualization */}
          <div className="mb-4 p-3 bg-card border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Compliance Framework Visualization</h3>
            <p className="text-foreground text-sm">
              This interactive network diagram displays the relationships between AI models and compliance frameworks. 
              Each node represents either an AI model (like Gemma, Llama) or a compliance framework (like GDPR, HIPAA). 
              The connections show which models have been used to generate compliance rules for specific frameworks.
            </p>
          </div>
          
          {/* D3 Visualization */}
          <div className="flex-1">
            <D3Force />
            {/* <Link href="/explore_rules" className="text-sm muted">
              Explore...
            </Link> */}
          </div>
        </div>
        
        {/* <div className="bg-muted/50 aspect-video rounded-sm" /> */}
      </div>
      {/* Removed the bottom section to use full height */}
    </div>
  )
}
