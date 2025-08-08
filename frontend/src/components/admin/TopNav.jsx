// src/components/admin/TopNav.jsx
import React from "react";
import Link from "next/link";

export default function TopNav({ title = "Admin" }) {
  return (
    <header className="bg-transparent border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold">{title}</div>
          <div className="text-sm text-zinc-400">Dashboard</div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <button className="px-3 py-1 rounded-md bg-zinc-900/50 border border-zinc-700">Admin</button>
          </Link>
          <Link href="/dashboard">
            <button className="px-3 py-1 rounded-md bg-transparent border border-zinc-700/40 text-sm">
              User View
            </button>
          </Link>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
