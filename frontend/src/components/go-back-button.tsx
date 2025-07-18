"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function GoBackButton() {
  const router = useRouter()

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/dashboard") // Fallback
    }
  }

  return (
    <Button
        onClick={handleClick}
        size="icon"
        variant="ghost"
        className="rounded-full text-white hover:bg-white/10 dark:text-white"
        aria-label="Go back"
        >
        <ArrowLeft className="w-4 h-4" />
    </Button>

  )
}
