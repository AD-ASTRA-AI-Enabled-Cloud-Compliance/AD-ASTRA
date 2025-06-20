'use client'
import React from 'react';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
  pci_file: FileList;
  actual_file: FileList;
  tfvars_file?: FileList;
};

export  function TerraformForm() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [message, setMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('pci_file', data.pci_file[0]);
    formData.append('actual_file', data.actual_file[0]);

    if (data.tfvars_file && data.tfvars_file.length > 0) {
      formData.append('tfvars_file', data.tfvars_file[0]);
    }

    try {
      const res = await fetch('http://localhost:5000/upload_files', {
        method: 'POST',
        body: formData,
      });

        const response = await res.json();
      if (res.ok) {
        console.log('Upload response:', response);
        setMessage('✅ Files uploaded and processed!');
        // Optionally, trigger redirect or show results
      } else {

        console.log('Upload ERROR:');
        setMessage('❌ Error uploading files.');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Server error.');
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Upload Terraform Files</h1>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div>
          <label>PCI Baseline (.tf)</label><br />
          <input type="file" {...register('pci_file', { required: true })} />
        </div>

        <div>
          <label>Actual Infra File (.tf)</label><br />
          <input type="file" {...register('actual_file', { required: true })} />
        </div>

        <div>
          <label>Terraform tfvars File (Optional)</label><br />
          <input type="file" {...register('tfvars_file')} />
        </div>

        <br />
        <button type="submit">Upload & Compare</button>
      </form>

      <p>{message}</p>
    </main>
  );
}
