"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, CheckCircle, AlertCircle, Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, today: 0, this_week: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  const reviews = [
    { name: "Jane Doe", text: "Amazing dashboard! Makes my work so much easier." },
    { name: "John Smith", text: "Clean UI and smooth experience." },
    { name: "Emily Johnson", text: "The best complaint tracking tool I've used!" },
  ];

  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:5000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);

    // Fetch announcements
    fetch("http://127.0.0.1:5000/announcements", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAnnouncements);
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;
    setLoading(true);

    if (user.role === "admin") {
      fetch(`http://127.0.0.1:5000/admin/complaints/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setStats);

      const url = new URL("http://127.0.0.1:5000/admin/complaints");
      url.searchParams.append("page", page.toString());
      url.searchParams.append("per_page", "8");
      if (search) url.searchParams.append("search", search);
      if (statusFilter) url.searchParams.append("status", statusFilter);

      fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setComplaints(data.items || []);
          setPages(data.pages || 1);
          setLoading(false);
        });
    } else {
      fetch("http://127.0.0.1:5000/complaints/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setComplaints(data);
          setStats({
            total: data.length,
            pending: data.filter((c: any) => c.status === "Pending").length,
            resolved: data.filter((c: any) => c.status === "Resolved").length,
            today: 0,
            this_week: 0,
          });
          setLoading(false);
        });
    }
  }, [token, user, page, search, statusFilter]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

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
        <div className="flex gap-3 items-center">
          {user?.role !== "admin" && (
            <Link
              href="/submit"
              className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg shadow-lg transition flex items-center gap-2"
            >
              <PlusCircle size={18} /> New Complaint
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg text-white font-semibold shadow transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-6 mb-10">
        <StatCard icon={<AlertCircle />} label="Total" value={stats.total} color="from-purple-500 to-pink-500" />
        <StatCard icon={<Loader2 />} label="Pending" value={stats.pending} color="from-yellow-500 to-orange-500" />
        <StatCard icon={<CheckCircle />} label="Resolved" value={stats.resolved} color="from-green-500 to-emerald-500" />
        {user?.role === "admin" && (
          <>
            <StatCard icon={<Calendar />} label="Today" value={stats.today} color="from-blue-500 to-cyan-500" />
            <StatCard icon={<Calendar />} label="This Week" value={stats.this_week} color="from-pink-500 to-red-500" />
          </>
        )}
      </div>

      {/* Admin Filters */}
      {user?.role === "admin" && (
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 rounded-lg text-black w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-lg text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      )}

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
                {user?.role === "admin" && <th className="py-2">User</th>}
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
                  {user?.role === "admin" && <td className="py-3">{c.user_email}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No complaints found.</p>
        )}
      </div>

      {/* Pagination for Admin */}
      {user?.role === "admin" && pages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} of {pages}</span>
          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Announcements Carousel */}
      {announcements.length > 0 && (
        <section className="mt-16 relative z-10">
          <h2 className="text-2xl font-bold mb-6">Latest Announcements</h2>
          <div className="overflow-hidden relative">
            <motion.div
              className="flex gap-6"
              initial={{ x: 0 }}
              animate={{
                x: [0, -((announcements.length - 1) * 320)],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: announcements.length * 3,
                ease: "linear",
              }}
            >
              {announcements.concat(announcements).map((a, index) => (
                <div
                  key={index}
                  className="min-w-[300px] bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg flex-shrink-0"
                >
                  <h3 className="text-lg font-semibold text-cyan-400">{a.title}</h3>
                  <p className="text-gray-300 mt-2">{a.message}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Animated Reviews */}
      <section className="mt-16 relative z-10">
        <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg"
            >
              <p className="text-gray-300 mb-3">"{review.text}"</p>
              <p className="text-cyan-400 font-semibold">- {review.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
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
