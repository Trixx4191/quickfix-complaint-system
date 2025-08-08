// src/components/admin/StatCard.jsx
import React from "react";

export default function StatCard({ title, value, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-zinc-900/40 border border-zinc-700 rounded-lg p-4 text-center hover:scale-[1.02] transition transform"
    >
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{subtitle}</div>
    </div>
  );
}
