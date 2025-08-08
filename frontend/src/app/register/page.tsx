"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        router.push("/login");
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
          <h1 className="mt-4 text-3xl font-bold text-white">Create Your Account</h1>
          <p className="mt-2 text-gray-400">Join QuickFix today</p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-center text-red-400 font-medium">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleRegister}>
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
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none transition"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none transition"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
