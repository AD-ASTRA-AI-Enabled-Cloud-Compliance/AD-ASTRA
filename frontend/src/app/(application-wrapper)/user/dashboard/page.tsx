"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import D3Force from "@/components/ui/d3force"
import Link from "next/link"

export default function UserDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

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
    
    setIsLoading(false)
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="bg-muted/50 aspect-video rounded-sm">
          <D3Force />
          <Link href="/user/explore_rules" className="text-sm muted">
            Explore...
          </Link>
        </div>
        <div className="bg-muted/50 aspect-video rounded-sm">
          {/* Placeholder for future user-specific content */}
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Link 
                href="/user/chat" 
                className="block w-full p-2 bg-primary/10 hover:bg-primary/20 rounded text-center"
              >
                Open Chat Assistant
              </Link>
              {/* Removed the "My Documents" button as it's not mapped to anything */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-sm md:min-h-min p-4">
        {/* Framework for adding more content in the future */}
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          <div className="p-3 border rounded-md bg-card">
            <span className="text-sm text-muted-foreground">No recent activity to display</span>
          </div>
          {/* Placeholder for future activity items */}
        </div>
        
        {/* Commented section for future features */}
        {/* 
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Compliance Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md bg-card">
              <h3 className="font-medium">Documents</h3>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="p-4 border rounded-md bg-card">
              <h3 className="font-medium">Pending Reviews</h3>
              <p className="text-2xl font-bold text-amber-500">0</p>
            </div>
            <div className="p-4 border rounded-md bg-card">
              <h3 className="font-medium">Compliance Score</h3>
              <p className="text-2xl font-bold text-green-500">N/A</p>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  )
}