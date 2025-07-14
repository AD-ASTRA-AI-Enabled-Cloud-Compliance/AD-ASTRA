"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import RuleSelectorForm from "./components/RuleSelectorForm"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "management") {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="p-4">
      <RuleSelectorForm />
    </div>
  )
}
