"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import D3Force from "@/components/ui/d3force"
import Link from "next/link"
import Loader from "@/components/ui/loader"
import { CountsCard } from "../components/CountsCard"
// Using the same data hooks as management dashboard
import { useDashboardData } from "@/hooks/useDashboardData"

export default function UserDashboardPage() {
  const router = useRouter()
  // Using the same data fetching as management dashboard
  const { documentStats, rulesStats, isLoading, error, refetch } = useDashboardData()

  useEffect(() => {
    // Check both for authentication and role
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    
    if (!token) {
      // No token, redirect to login
      router.push("/login")
      return
    }
    
    // If this is a management user viewing the user dashboard, 
    // redirect them to the management dashboard
    if (role === "management") {
      router.push("/management/dashboard")
      return
    }
    
    // If we have a token but no role or invalid role, set a default
    if (!role || (role !== "user" && role !== "management")) {
      localStorage.setItem("role", "user")
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
        {/* Statistics Card - Left Side */}
        <div className="bg-muted/50 rounded-sm p-4 h-full">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-8">Compliance Rules Overview</h3>
            
            {/* Rules Statistics Section */}
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Compliance Rules</h4>
              <div className="space-y-4">
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
                  href="/user/explore_rules" 
                  className="block w-full p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded text-center text-sm border mt-4"
                >
                  🔍 Explore Rules Database
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* D3 Visualization Card - Right Side */}
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
          </div>
        </div>
      </div>
    </div>
  )
}