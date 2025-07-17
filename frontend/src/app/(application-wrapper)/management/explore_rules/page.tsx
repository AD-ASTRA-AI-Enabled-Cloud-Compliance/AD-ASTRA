// ✅ File: management/explore_rules/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RulesTable } from "./components/RulesTable";
import { RulesDataProvider } from "./components/DataContext_Rules";

const ExploreRules = () => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "management") {
      alert("Access restricted to management users.");
      router.push("/login");
    }
  }, [router]);

  return (
    <RulesDataProvider>
      <div className='w-[100%] p-4'>
        <RulesTable />
      </div>
    </RulesDataProvider>
  );
};

export default ExploreRules;
