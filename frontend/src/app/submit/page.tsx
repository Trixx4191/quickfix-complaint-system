"use client";
import { useState, useEffect } from "react";

export default function SubmitComplaintPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch recent complaints on mount
  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:5000/complaints/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setComplaints)
        .catch(console.error);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!token) {
      setMessage("You must be logged in to submit a complaint.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
      } else {
        setMessage("✅ Complaint submitted successfully!");
        setTitle("");
        setDescription("");
        // Refresh recent complaints
        fetch("http://127.0.0.1:5000/complaints/mine", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(setComplaints);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-sky-950 via-slate-900 to-black text-white p-6 overflow-hidden">
      {/* Floating Background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-800 opacity-20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-float-fast"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Form Card */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-6">Submit a Complaint</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none"
                placeholder="Enter complaint title"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 outline-none"
                rows={5}
                placeholder="Describe your complaint"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Recent Complaints */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Your Recent Complaints</h2>
          {complaints.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-white/10">
                  <th className="py-2">Title</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c: any) => (
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
                    <td className="py-3 text-gray-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No complaints found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
