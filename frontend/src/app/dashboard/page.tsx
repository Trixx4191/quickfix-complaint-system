"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    // Get user info
    fetch("http://127.0.0.1:5000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);

    // Get complaints
    fetch("http://127.0.0.1:5000/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setStats({
          total: data.length,
          pending: data.filter((c: any) => c.status === "Pending").length,
          resolved: data.filter((c: any) => c.status === "Resolved").length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-sky-950 via-slate-900 to-black text-white overflow-hidden p-6">
      {/* Floating Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-800 opacity-20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-float-fast"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {user ? `Welcome, ${user.email}` : "Loading..."}
        </h1>
        <Link
          href="/submit"
          className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg shadow-lg transition flex items-center gap-2"
        >
          <PlusCircle size={18} /> New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<AlertCircle />} label="Total Complaints" value={stats.total} color="from-purple-500 to-pink-500" />
        <StatCard icon={<Loader2 />} label="Pending" value={stats.pending} color="from-yellow-500 to-orange-500" />
        <StatCard icon={<CheckCircle />} label="Resolved" value={stats.resolved} color="from-green-500 to-emerald-500" />
      </div>

      {/* Complaints Table */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Complaints</h2>
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-white/10">
                <th className="py-2">Title</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="py-3">{c.title}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === "Resolved"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No complaints found.</p>
        )}
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div
      className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg text-white flex flex-col items-center justify-center`}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
