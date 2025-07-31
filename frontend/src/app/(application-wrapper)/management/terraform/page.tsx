"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import RuleSelectorForm from "./components/RuleSelectorForm"
import OCRProgress from "@/components/OCRProgress"
import { CardContent } from "@/components/ui/card"
import Loader from "@/components/ui/loader"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "management") {
      router.push("/dashboard")
    }
    
    setIsLoading(false);
  }, [router])

  if (isLoading) {
    return (
      <Loader />
    );
  }
  return (
    <div className="p-4">
      <RuleSelectorForm />
    </div>
  )
}
