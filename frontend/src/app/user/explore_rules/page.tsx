// ✅ File: management/explore_rules/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RulesTable } from "./components/RulesTable";
import { RulesDataProvider } from "./components/DataContext_Rules";

const UserExploreRules = () => {
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

    // If this is a management user viewing the user explore_rules page,
    // redirect them to the management version
    if (role === "management") {
      router.push("/management/explore_rules");
      return;
    }

    // If we have a token but no role or invalid role, set a default
    if (!role || (role !== "user" && role !== "management")) {
      localStorage.setItem("role", "user");
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
    <RulesDataProvider>
      <div className="w-[100%] p-4">
        <h1 className="text-2xl font-bold mb-4">Explore Security Rules</h1>
        <p className="text-muted-foreground mb-6">
          Browse and learn about security rules that apply to your resources.
        </p>
        <RulesTable />
      </div>
    </RulesDataProvider>
  );
};

export default UserExploreRules;
