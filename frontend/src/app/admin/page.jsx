"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import ComplaintsTable from "@/components/admin/ComplaintsTable";
import ComplaintModal from "@/components/admin/ComplaintModal";
import TopNav from "@/components/admin/TopNav";
import AnnouncementModal from "@/components/admin/AnnouncementModal";
import ManageUsersModal from "@/components/admin/ManageUsersModal";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = getToken();
  const router = useRouter();

  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== "All") params.append("status", filter);
        if (query.trim()) params.append("search", query.trim());

        const res = await fetch(
          `http://localhost:5000/admin/complaints?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch complaints");

        const data = await res.json();
        setComplaints(data.items || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setComplaints([]);
      }
      setLoading(false);
    }
    if (token) fetchComplaints();
  }, [filter, query, token]);

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

  // Compute top categories (by most common first word in title)
  const topCategories = useMemo(() => {
    if (!complaints.length) return "--";
    const counts = {};
    complaints.forEach((c) => {
      // Use first word of title as category, or use c.category if you have that field
      const key = c.title.split(" ")[0];
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat)
      .join(", ");
  }, [complaints]);

  // Compute recent activity (most recently updated or created complaint)
  const recentActivity = useMemo(() => {
    if (!complaints.length) return "--";
    const sorted = [...complaints].sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at) -
        new Date(a.updated_at || a.created_at)
    );
    const recent = sorted[0];
    const date = new Date(recent.updated_at || recent.created_at);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let ago = "";
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      ago =
        diffHours > 0
          ? `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
          : "just now";
    } else {
      ago = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
    return `${recent.title} — ${ago}`;
  }, [complaints]);

  async function handleResolve(id, currentStatus) {
    try {
      const newStatus = currentStatus === "Resolved" ? "Pending" : "Resolved";
      const res = await fetch(`http://localhost:5000/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          resolved_by: newStatus === "Resolved" ? "admin@quickfix" : null,
          resolved_description:
            newStatus === "Resolved" ? "Resolved via admin dashboard" : null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Failed to update status: " + (errData.message || res.statusText));
        return;
      }

      // Refresh complaints list
      const params = new URLSearchParams();
      if (filter !== "All") params.append("status", filter);
      if (query.trim()) params.append("search", query.trim());

      const updatedRes = await fetch(
        `http://localhost:5000/admin/complaints?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await updatedRes.json();
      setComplaints(data.items || []);
      setSelected(null);
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Error updating complaint status.");
    }
  }

  async function handleAddAnnouncement(announcement) {
    try {
      const res = await fetch("http://localhost:5000/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcement),
      });
      if (!res.ok) throw new Error("Failed to create announcement");
      alert("Announcement created!");
      setShowAnnouncementModal(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function downloadReport(start, end) {
    if (!start || !end) {
      alert("Please select both dates");
      return;
    }
    const res = await fetch(
      `http://localhost:5000/admin/complaints/report?start_date=${start}&end_date=${end}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      alert("Failed to generate report");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaints_report_${start}_to_${end}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  async function fetchUsers() {
    const res = await fetch("http://localhost:5000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers(await res.json());
      setShowUsersModal(true);
    } else {
      alert("Failed to fetch users");
    }
  }

  async function handleUserAction(action, user) {
    try {
      if (action === "promote" || action === "demote") {
        const newRole = action === "promote" ? "admin" : "user";
        const res = await fetch(`http://localhost:5000/admin/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Failed to update user role");
          return;
        }
        // If current user demotes themselves, log out
        if (user.email === JSON.parse(atob(token.split('.')[1])).sub && newRole === "user") {
          alert("You have demoted yourself and will be logged out.");
          handleLogout();
          return;
        }
      }
      if (action === "delete") {
        if (!window.confirm(`Delete user ${user.email}?`)) return;
        const res = await fetch(`http://localhost:5000/admin/users/${user.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Failed to delete user");
          return;
        }
      }
      // Refresh user list after action
      fetchUsers();
    } catch (err) {
      alert("Network error");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <AdminLayout>
      <TopNav title="Admin Control Center" />

      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 bg-gradient-to-b from-zinc-900/60 to-zinc-900/40 border border-zinc-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Welcome, Admin</h2>
            <p className="text-sm text-zinc-300 mb-4">
              Control center overview — quick actions & system insights.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Add Announcement
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white"
              >
                Generate Report
              </button>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white"
              >
                Manage Users
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-[480px]">
            <StatCard title="Total" value={stats.total} subtitle="Complaints" onClick={() => setFilter("All")} />
            <StatCard title="Pending" value={stats.pending} subtitle="Needs attention" onClick={() => setFilter("Pending")} />
            <StatCard title="Resolved" value={stats.resolved} subtitle="Closed" onClick={() => setFilter("Resolved")} />
            <StatCard title="Avg Resolve" value={stats.avgResolutionHours} subtitle="Hours" />
          </div>
        </div>

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
              onClick={() => alert("Exported CSV (demo)")}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm"
            >
              Export
            </button>
            <button
              onClick={() => { setFilter("All"); setQuery(""); }}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ComplaintsTable
              data={filtered}
              onOpen={(c) => setSelected(c)}
              onResolve={handleResolve}
              loading={loading}
            />
          </div>

          <aside className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-5 h-fit">
            <h3 className="font-semibold mb-2">Quick Insights</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Complaints this month: <span className="font-medium">{stats.total}</span>
            </p>

            <div className="space-y-3">
              <div className="bg-zinc-800/40 p-3 rounded-md">
                <div className="text-xs text-zinc-400">Top Categories</div>
                <div className="mt-2 font-medium">{topCategories}</div>
              </div>

              <div className="bg-zinc-800/40 p-3 rounded-md">
                <div className="text-xs text-zinc-400">Recent Activity</div>
                <div className="mt-2 text-sm text-zinc-300">
                  {recentActivity}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {showAnnouncementModal && (
        <AnnouncementModal
          onClose={() => setShowAnnouncementModal(false)}
          onSubmit={handleAddAnnouncement}
        />
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Generate Complaints Report</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    downloadReport(startDate, endDate);
                    setShowReportModal(false);
                  }}
                  className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ComplaintModal
        open={!!selected}
        complaint={selected}
        onClose={() => setSelected(null)}
        onResolve={handleResolve}
      />

      {showUsersModal && (
        <ManageUsersModal
          open={showUsersModal}
          onClose={() => setShowUsersModal(false)}
          users={users}
          onAction={handleUserAction}
        />
      )}
    </AdminLayout>
  );
}
