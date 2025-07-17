// ✅ File: management/chat/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DocumentPanel from "@/components/chat/DocumentPanel";
import { GeneratedForm } from "../terraform/components/tf";

const DocumentProcessing = () => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "management") {
      alert("Access restricted to management users.");
      router.push("/login");
    }
  }, []);

  return (
    <div className="p-4">
      <GeneratedForm />
      <DocumentPanel />
    </div>
  );
};

export default DocumentProcessing;
