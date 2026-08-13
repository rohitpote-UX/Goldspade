"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AuthService } from "@/lib/auth/abstraction";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ loading: boolean; error?: string; success?: boolean }>({
    loading: false,
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true });
    const res = await AuthService.signup(email, name);
    if (res.success) {
      setStatus({ loading: false, success: true });
    } else {
      setStatus({ loading: false, error: res.error });
    }
  };

  return (
    <div className="pt-36 pb-28 md:py-40 bg-canvas min-h-screen text-primary-dark flex flex-col justify-center px-6">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold uppercase text-secondary-dark block mb-2">
            CLIENT ACCESS
          </span>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-primary-dark">
            REQUEST PORTAL ACCESS
          </h1>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-editorial-border shadow-sm">
          {status.success ? (
            <div className="text-center space-y-4 py-6">
              <h3 className="text-xl font-bold uppercase text-primary-dark">REQUEST SUBMITTED</h3>
              <p className="text-sm text-secondary-dark">We will verify your client credentials shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {status.error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-mono rounded-xl">
                  {status.error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-canvas border border-editorial-border rounded-xl px-4 py-3 text-primary-dark text-sm focus:outline-none focus:border-primary-dark transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-canvas border border-editorial-border rounded-xl px-4 py-3 text-primary-dark text-sm focus:outline-none focus:border-primary-dark transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={status.loading}
                variant="primary"
                size="md"
                className="w-full"
              >
                {status.loading ? "Submitting..." : "Submit Access Request"}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-editorial-border text-center text-xs text-secondary-dark">
            Already have access?{" "}
            <Link href="/login" className="text-primary-dark font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
