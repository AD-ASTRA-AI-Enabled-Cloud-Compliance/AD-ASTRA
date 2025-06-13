"use client";

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'

export const LandingPage = () => {
  const router = useRouter();
  
  return (
    <div>
        <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
        <Button>bb</Button>
    </div>
  )
}
