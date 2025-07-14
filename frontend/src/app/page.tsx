import React from "react";
import UploadForm from "./management/components/UploadForm";

function App() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Document Upload</h1>
      <UploadForm />
    </div>
  );
}

export default App;

//Commented old code:

// 'use client'

// import React from "react";
// import UploadForm from "./management/uploadform"; // adjust path if needed
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// function App() {
//   const router = useRouter();
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Button onClick={() => router.push('/dashboard')}>
//         Dashboard
//       </Button>
//     </div>
//   );
// }

// export default App;