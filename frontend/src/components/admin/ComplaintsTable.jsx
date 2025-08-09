// src/components/admin/ComplaintsTable.jsx
import React from "react";

export default function ComplaintsTable({ data = [], onOpen = () => {}, onResolve = () => {} }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="text-sm text-zinc-300">Complaints</div>
        <div className="text-xs text-zinc-500">Showing {data.length} results</div>
      </div>

      <div className="p-4 space-y-3">
        {data.length === 0 && <div className="text-zinc-400">No complaints found.</div>}

        <div className="space-y-3">
          {data.map((c) => (
            <div key={c.id} className="bg-zinc-800/30 border border-zinc-800 rounded-md p-3 flex items-start gap-4">
              <div className="w-12 text-sm font-semibold text-zinc-300">{c.id}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{c.title}</div>
                    <div className="text-xs text-zinc-400">{c.user_email} • {new Date(c.created_at).toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => {
                        // quick local change (not persisted) — in real app call API
                        c.status = e.target.value;
                        onResolve(c.id); // optionally mark resolved for demo
                      }}
                      className={`text-xs px-2 py-1 rounded-md border ${
                        c.status === "Resolved" ? "bg-emerald-600 border-emerald-700" : "bg-amber-600 border-amber-700"
                      }`}
                    >
                      <option>Pending</option>
                      <option>Resolved</option>
                    </select>

                    <button
                      onClick={() => onOpen(c)}
                      className="text-xs px-3 py-1 rounded-md border border-zinc-700 bg-zinc-800/40"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onResolve(c.id, c.status)}
                      className={`px-3 py-1 rounded-md text-white ${
                        c.status === "Resolved"
                          ? "bg-amber-600 hover:bg-amber-500"
                          : "bg-cyan-600 hover:bg-cyan-500"
                      }`}
                    >
                      {c.status === "Resolved" ? "Reopen" : "Resolve"}
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm text-zinc-300 line-clamp-2">{c.description}</div>
              </div>

              
              
            </div>
          ))}
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <div>Page 1 of 1</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded-md border border-zinc-700">Prev</button>
          <button className="px-2 py-1 rounded-md border border-zinc-700">Next</button>
        </div>
      </div>
    </div>
  );
}
