"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* Left Side - Description */}
      <div className="flex flex-col justify-center p-10 text-left animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">SkyLock</h1>
        <p className="text-lg leading-relaxed">
          SkyLock provides comprehensive compliance assessment solutions for
          frameworks like <span className="font-semibold">NIST, PCI, HIPAA, ISO</span>, and custom organizational standards. Our platform not only identifies
          vulnerabilities but also helps you remediate them efficiently to ensure
          robust security and regulatory alignment.
        </p>
      </div>

      {/* Right Side - Login Box */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white text-black rounded-2xl shadow-2xl p-8 animate-slide-in-right">
          <CardContent>
            {/* Logo + Heading */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="/skylock-logo.png"
                alt="SkyLock Logo"
                className="h-16 w-auto mb-2"
              />
              <h2 className="text-2xl font-bold text-center">Login to SkyLock</h2>
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password
                </label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full mt-4" type="submit">
                Login
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Don’t have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Create one
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
