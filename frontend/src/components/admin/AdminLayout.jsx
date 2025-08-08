// src/components/admin/AdminLayout.jsx
import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A30] via-[#071026] to-black text-white">
      <div className="py-6">{children}</div>
    </div>
  );
}
