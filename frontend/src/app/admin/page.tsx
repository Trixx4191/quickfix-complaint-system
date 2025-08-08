// src/app/admin/page.jsx
"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import ComplaintsTable from "@/components/admin/ComplaintsTable";
import ComplaintModal from "@/components/admin/ComplaintModal";
import TopNav from "@/components/admin/TopNav";

const DUMMY_COMPLAINTS = [
  {
    id: 101,
    title: "Broken lab projector",
    description: "Projector in Lab A flickers and then goes black.",
    user_email: "alice@example.com",
    status: "Pending",
    created_at: "2025-07-25T09:12:00Z",
    updated_at: "2025-07-25T09:12:00Z",
    resolved_at: null,
    resolved_by: null,
    resolved_description: null,
  },
  {
    id: 102,
    title: "WiFi disconnects during exams",
    description: "Multiple students reported disconnects in exam hall.",
    user_email: "bob@example.com",
    status: "Resolved",
    created_at: "2025-07-01T10:00:00Z",
    updated_at: "2025-07-05T11:00:00Z",
    resolved_at: "2025-07-05T11:00:00Z",
    resolved_by: "admin@quickfix",
    resolved_description: "Router firmware updated and scheduling fixed.",
  },
  {
    id: 103,
    title: "Cafeteria billing mismatch",
    description: "Charged twice for one item at kiosk 3.",
    user_email: "charlie@example.com",
    status: "Pending",
    created_at: "2025-08-01T13:23:00Z",
    updated_at: "2025-08-01T13:23:00Z",
    resolved_at: null,
    resolved_by: null,
    resolved_description: null,
  },
  // add more dummy rows as needed...
];

export default function AdminPage() {
  const [complaints, setComplaints] = useState(DUMMY_COMPLAINTS);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    const avgResolutionHours = (() => {
      const times = complaints
        .filter((c) => c.resolved_at)
        .map((c) => {
          const a = new Date(c.created_at);
          const b = new Date(c.resolved_at);
          return (b - a) / (1000 * 60 * 60);
        });
      if (!times.length) return "--";
      const sum = times.reduce((s, n) => s + n, 0);
      return (sum / times.length).toFixed(1);
    })();
    return { total, pending, resolved, avgResolutionHours };
  }, [complaints]);

  const filtered = complaints.filter((c) => {
    if (filter !== "All" && c.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.user_email.toLowerCase().includes(q)
    );
  });

  function handleResolve(id) {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Resolved",
              resolved_at: new Date().toISOString(),
              resolved_by: "you@quickfix",
              resolved_description: "Resolved via admin dashboard (demo)",
            }
          : c
      )
    );
  }

  return (
    <AdminLayout>
      <TopNav title="Admin Control Center" />

      <section className="px-6 py-6 max-w-7xl mx-auto">
        {/* Hero / Quick Actions */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 bg-gradient-to-b from-zinc-900/60 to-zinc-900/40 border border-zinc-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Welcome, Admin</h2>
            <p className="text-sm text-zinc-300 mb-4">
              Control center overview — quick actions & system insights.
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white">
                Add Announcement
              </button>
              <button className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white">
                Generate Report
              </button>
              <button className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white">
                Manage Users
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-[480px]">
            <StatCard
              title="Total"
              value={stats.total}
              subtitle="Complaints"
              onClick={() => setFilter("All")}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              subtitle="Needs attention"
              onClick={() => setFilter("Pending")}
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              subtitle="Closed"
              onClick={() => setFilter("Resolved")}
            />
            <StatCard
              title="Avg Resolve"
              value={stats.avgResolutionHours}
              subtitle="Hours"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              className="rounded-md bg-zinc-900/60 border border-zinc-700 px-3 py-2 outline-none placeholder:text-zinc-400"
              placeholder="Search title, description or user..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md bg-zinc-900/60 border border-zinc-700 px-3 py-2"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                // example: export CSV (dummy)
                alert("Exported CSV (demo)");
              }}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm"
            >
              Export
            </button>
            <button
              onClick={() => setComplaints(DUMMY_COMPLAINTS)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm"
            >
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* Main grid: table + side panel */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ComplaintsTable
              data={filtered}
              onOpen={(c) => setSelected(c)}
              onResolve={handleResolve}
            />
          </div>

          <aside className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-5 h-fit">
            <h3 className="font-semibold mb-2">Quick Insights</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Complaints this month: <span className="font-medium">12</span>
            </p>

            <div className="space-y-3">
              <div className="bg-zinc-800/40 p-3 rounded-md">
                <div className="text-xs text-zinc-400">Top Categories</div>
                <div className="mt-2 font-medium">Network, Facilities, Billing</div>
              </div>

              <div className="bg-zinc-800/40 p-3 rounded-md">
                <div className="text-xs text-zinc-400">Recent Activity</div>
                <div className="mt-2 text-sm text-zinc-300">
                  Router replaced — <span className="font-medium">2 days ago</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ComplaintModal
        open={!!selected}
        complaint={selected}
        onClose={() => setSelected(null)}
        onResolve={(id) => {
          handleResolve(id);
          setSelected(null);
        }}
      />
    </AdminLayout>
  );
}
