import React from "react";
import UploadForm from "./management/components/uploadform"; // Corrected path with /components/

function App() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Document Upload</h1>
      <UploadForm />
    </div>
  );
}

export default App;