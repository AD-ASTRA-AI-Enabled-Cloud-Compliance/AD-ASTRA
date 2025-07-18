"use client"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GoBackButton } from "@/components/go-back-button"


export default function ForgotPasswordPage() {
  return (
    <div
      className="relative min-h-svh w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 md:p-10"
      style={{ backgroundImage: "url('/static/images/Login-Background.jpg')" }}
    >
      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Dark mode toggle button (top-right corner) */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Go Back button (top-left corner) */}
      <div className="absolute top-4 left-4 z-10">
        <GoBackButton />
      </div>

      {/* Glassy card form */}
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
