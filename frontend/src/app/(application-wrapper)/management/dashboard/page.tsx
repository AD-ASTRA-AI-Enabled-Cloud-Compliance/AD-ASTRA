"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import D3Force from "@/components/ui/d3force"
import Link from "next/link"
import Loader from "@/components/ui/loader"

export default function Page() {
  const [isLoading, setIisLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "management") {
      router.push("/dashboard")
    }
    setIisLoading(false)
  }, [router])



  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Loader />
    );
  }


  return (
    <div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="bg-muted/50 aspect-video rounded-sm">
          <D3Force />
          <Link href="/explore_rules" className="text-sm muted">
            Explore...
          </Link>
        </div>
        <div className="bg-muted/50 aspect-video rounded-sm" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-sm md:min-h-min" />
    </div>
  )
}
