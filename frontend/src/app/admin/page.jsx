"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchComplaints();
  }, [search, status]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/complaints?search=${search}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-950 via-slate-900 to-black p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

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
          <table className="w-full text-left text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
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
                    className="hover:bg-white/10 transition border-b border-white/5"
                  >
                    <td className="p-4">{c.title}</td>
                    <td className="p-4">{c.description}</td>
                    <td className="p-4">{c.status}</td>
                    <td className="p-4">{c.user_email}</td>
                    <td className="p-4">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
