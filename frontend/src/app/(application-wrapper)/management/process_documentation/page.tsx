// ✅ File: management/chat/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DocumentPanel from "@/components/chat/DocumentPanel";
import { GeneratedForm } from "../terraform/components/tf";
import { CardContent } from "@/components/ui/card";
import OCRProgress from "@/components/OCRProgress";

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
      {/* <DocumentPanel /> */}

      <CardContent>
        <OCRProgress />
      </CardContent>
    </div>
  );
};

export default DocumentProcessing;
