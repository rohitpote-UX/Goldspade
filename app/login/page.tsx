"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AuthService } from "@/lib/auth/abstraction";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ loading: boolean; error?: string; success?: boolean }>({
    loading: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true });
    const res = await AuthService.login(email, password);
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
            CLIENT PORTAL
          </span>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-primary-dark">
            LOG IN TO GOLDSPADE
          </h1>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-editorial-border shadow-sm">
          {status.success ? (
            <div className="text-center space-y-4 py-6">
              <h3 className="text-xl font-bold uppercase text-primary-dark">AUTHENTICATED</h3>
              <p className="text-sm text-secondary-dark">Welcome back. Portal loading...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {status.error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-mono rounded-xl">
                  {status.error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="w-full bg-canvas border border-editorial-border rounded-xl px-4 py-3 text-primary-dark text-sm focus:outline-none focus:border-primary-dark transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {status.loading ? "Authenticating..." : "Log In"}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-editorial-border text-center text-xs text-secondary-dark">
            Don&apos;t have a client account?{" "}
            <Link href="/signup" className="text-primary-dark font-bold hover:underline">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
