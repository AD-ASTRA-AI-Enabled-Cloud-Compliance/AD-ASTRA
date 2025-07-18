"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage
} from "@/components/ui/breadcrumb"
import {
  SidebarProvider, SidebarInset, SidebarTrigger
} from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { ThemeToggle } from "@/components/ThemeToggle"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import OCRProgress from "@/components/OCRProgress"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "management") {
      setUnauthorized(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000) // wait 2 seconds before redirect
    }
  }, [router])

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          This page requires management login. Redirecting to login...
        </p>
      </div>
    )
  }
 
  return (
    <WebSocketProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="fixed flex w-full bg-background text-foreground shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <ThemeToggle />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      MANAGEMENT&apos;s VIEW
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Separator
                orientation="vertical"
                className="hidden md:block mr-2 data-[orientation=vertical]:h-4"
              />
              <OCRProgress onlyProgress={true} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </WebSocketProvider>
  )
}
