// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Eye, EyeOff, Lock, Mail, ChefHat } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@menuqr.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">MenuQR</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Restaurant Menu Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-white">Sign in to Dashboard</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                  placeholder="admin@menuqr.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-150 active:scale-95 shadow-lg shadow-orange-500/25 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <p className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5" />
              Demo credentials (pre-filled)
            </p>
            <div className="space-y-1">
              <p className="text-xs text-slate-300">📧 admin@menuqr.com</p>
              <p className="text-xs text-slate-300">🔑 admin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Customer menu doesn&apos;t require login •{" "}
          <a href="/menu/spice-garden" className="text-orange-400 hover:text-orange-300">
            View demo menu →
          </a>
        </p>
      </div>
    </div>
  );
}
