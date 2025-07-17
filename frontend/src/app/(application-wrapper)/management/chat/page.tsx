"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ManagementChat() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication and correct role
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      // No token, redirect to login
      router.push("/login");
      return;
    }
    
    // Since this is the management chat page, redirect non-management users
    if (role !== "management") {
      // Redirect regular users to the user chat page
      router.push("/user/chat");
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatWindow />
    </div>
  );
}