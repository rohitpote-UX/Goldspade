"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, ShieldCheck, Mail, Key } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated && (data.session?.role === "ADMIN" || data.session?.role === "TEAM")) {
          router.replace("/admin");
        }
      } catch {
        // Not logged in
      }
    }
    checkExistingSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user?.role === "ADMIN" || data.user?.role === "TEAM") {
          router.push("/admin");
        } else {
          setError("Access restricted. This account does not have staff permissions.");
          setLoading(false);
        }
      } else {
        setError(data.error || "Invalid credentials. Please verify your email and password.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-28 md:py-40 bg-canvas text-primary-dark min-h-screen px-6 sm:px-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-xs uppercase tracking-widest text-secondary-dark hover:text-primary-dark font-mono mb-8 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio
        </Link>

        {/* Card Container */}
        <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-mint/20 text-primary-dark border border-mint inline-flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                STAFF ACCESS
              </span>
              <Lock className="w-4 h-4 text-secondary-dark/60" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark">
              GOLDSPADE INTERNAL
            </h1>
            <p className="text-xs font-mono text-secondary-dark uppercase tracking-wider">
              Private Inquiry CRM &bull; Authorized Personnel Only
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-mono rounded-xl animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2"
              >
                Staff Email
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goldspade.in"
                  className="w-full bg-white dark:bg-black/40 border border-editorial-border rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-secondary-dark/40 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all pl-10"
                />
                <Mail className="w-4 h-4 text-secondary-dark/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white dark:bg-black/40 border border-editorial-border rounded-xl px-4 py-3 text-sm text-primary-dark placeholder:text-secondary-dark/40 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all pl-10"
                />
                <Key className="w-4 h-4 text-secondary-dark/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="mint"
                size="lg"
                className="w-full"
              >
                {loading ? "AUTHENTICATING..." : "ACCESS DASHBOARD ↗"}
              </Button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-editorial-border text-center">
            <p className="text-[11px] font-mono text-secondary-dark/70">
              Session is encrypted with HttpOnly authentication cookies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
