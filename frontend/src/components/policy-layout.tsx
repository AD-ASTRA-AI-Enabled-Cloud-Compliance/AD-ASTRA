"use client"

import { ReactNode } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { GoBackButton } from "@/components/go-back-button"

export default function PolicyLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <div
      className="relative min-h-svh w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 md:p-10"
      style={{ backgroundImage: "url('/static/images/Login-Background.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Go Back - top-left */}
      <div className="absolute top-4 left-4 z-10">
        <GoBackButton />
      </div>

      {/* Theme toggle - top-right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-white hover:bg-white/10 dark:text-white"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 drop-shadow-md" />
          ) : (
            <Moon className="w-5 h-5 drop-shadow-md" />
          )}
        </Button>
      </div>

      {/* Glassy card content */}
      <div className="relative z-10 w-full max-w-4xl">
        <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-xl border border-white/30 dark:border-white/20 rounded-xl">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h1 className="text-3xl font-bold text-center">{title}</h1>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
