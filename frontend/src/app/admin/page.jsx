"use client";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchStats();
    fetchComplaints();
  }, [search, status]);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/complaints/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/admin/complaints?search=${search}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
    setLoading(false);
  };

  const updateComplaint = async () => {
    if (!selectedComplaint) return;
    try {
      await fetch(
        `http://localhost:5000/complaints/${selectedComplaint.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedComplaint.status,
            resolved_description: selectedComplaint.resolved_description || "",
          }),
        }
      );
      setSelectedComplaint(null);
      fetchStats();
      fetchComplaints();
    } catch (err) {
      console.error("Failed to update complaint", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-950 via-slate-900 to-black p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<AlertCircle />}
            label="Total Complaints"
            value={stats.total}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<Loader2 />}
            label="Pending"
            value={stats.pending}
            color="from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={<CheckCircle />}
            label="Resolved"
            value={stats.resolved}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none transition"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-300 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none transition"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl shadow-xl">
          {loading ? (
            <p className="p-6 text-center text-gray-400">Loading...</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length > 0 ? (
                  complaints.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className="hover:bg-white/10 cursor-pointer transition border-b border-white/5"
                    >
                      <td className="p-4">{c.title}</td>
                      <td className="p-4">{c.status}</td>
                      <td className="p-4">{c.user_email}</td>
                      <td className="p-4">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-gray-400"
                    >
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">
                {selectedComplaint.title}
              </h2>
              <p className="mb-4">{selectedComplaint.description}</p>

              <label className="block mb-2">Status</label>
              <select
                value={selectedComplaint.status}
                onChange={(e) =>
                  setSelectedComplaint({
                    ...selectedComplaint,
                    status: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 mb-4"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <label className="block mb-2">Resolution Notes</label>
              <textarea
                value={selectedComplaint.resolved_description || ""}
                onChange={(e) =>
                  setSelectedComplaint({
                    ...selectedComplaint,
                    resolved_description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateComplaint}
                  className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-400 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
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
