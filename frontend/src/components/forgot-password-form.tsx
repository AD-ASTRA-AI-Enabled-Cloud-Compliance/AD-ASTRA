"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [userVerified, setUserVerified] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setError("")
    setUserVerified(false)
    setPasswordReset(false)

    if (!email.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError("All fields are required.")
      setIsLoading(false)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }
    if (newPassword.length < 5) {
      setError("Password must be at least 5 characters long.")
      setIsLoading(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      const verifyRes = await fetch(`http://127.0.0.1:3010/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const verifyData = await verifyRes.json()
      if (verifyRes.status !== 200) {
        setError(verifyData.message || "User does not exist.")
        setIsLoading(false)
        return
      }
      setUserVerified(true)

      const resetRes = await fetch(`http://127.0.0.1:3010/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      })
      const resetData = await resetRes.json()
      if (resetRes.status === 200) {
        setPasswordReset(true)
        setMessage("Password reset complete. Redirecting to login...")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setError(resetData.message || "Failed to reset password.")
      }
    } catch {
      setError("Failed to reset password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 backdrop-blur-sm bg-white/80 dark:bg-black/30 shadow-xl border border-neutral-200 dark:border-white/20 rounded-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email and choose a new password.
                </p>
              </div>

              {userVerified && !error && <div className="text-green-500">User verified.</div>}
              {error && <div className="text-red-500">{error}</div>}
              {message && <div className="text-green-500">{message}</div>}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <div className="text-center text-sm">
                Remembered your password?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>

          {/* Logo Section */}
          <div className="relative hidden md:flex items-center justify-center bg-white/80 dark:bg-white/10 backdrop-blur-sm p-6 rounded-r-xl">
            <img
              src="/sky_lock_logo.png"
              alt="Skylock Logo"
              className="max-h-60 object-contain transition-all duration-300"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
