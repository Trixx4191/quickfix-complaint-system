"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", email);

        // Redirect based on role
        if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-950 via-slate-900 to-black overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-800 opacity-20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-float-fast"></div>

      {/* Glass Card */}
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl 
                   transform transition-all duration-500 ease-out 
                   hover:rotate-x-3 hover:rotate-y-3 hover:shadow-cyan-500/40 
                   animate-slide-in-up"
      >
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <img src="/assets/quickfix-logo.png" alt="QuickFix Logo" className="w-16 h-16" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Log in to continue to QuickFix</p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-center text-red-400 font-medium">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-400 text-cyan-500 focus:ring-cyan-400" />
              Remember me
            </label>
            <Link href="#" className="hover:text-cyan-400 transition">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
