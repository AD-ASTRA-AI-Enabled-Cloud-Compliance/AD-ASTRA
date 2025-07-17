"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ExploreDocs = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    // Check for authentication and correct role
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      // No token, redirect to login
      router.push("/login");
      return;
    }
    
    // Only management role can access this page
    if (role !== "management") {
      setUnauthorized(true);
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2000); // wait 2 seconds before redirect
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show unauthorized message if user doesn't have management role
  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          This page requires management access. Redirecting...
        </p>
      </div>
    );
  }

  // Main component content
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Explore Documents</h1>
      
      {/* Document exploration interface will go here */}
      <div className="bg-card p-6 rounded-lg border">
        <p className="text-muted-foreground">
          Document exploration interface is under development.
        </p>
      </div>
    </div>
  );
};

export default ExploreDocs;