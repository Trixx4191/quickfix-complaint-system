// src/components/admin/ComplaintModal.jsx
import React from "react";

export default function ComplaintModal({ open, complaint, onClose = () => {}, onResolve = () => {} }) {
  if (!open || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-zinc-900/80 border border-zinc-700 rounded-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-zinc-400">Complaint #{complaint.id}</div>
            <h3 className="text-xl font-semibold">{complaint.title}</h3>
            <div className="text-sm text-zinc-400">{complaint.user_email} • {new Date(complaint.created_at).toLocaleString()}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { onResolve(complaint.id); }} className="px-3 py-1 rounded-md bg-emerald-600 text-white">Resolve</button>
            <button onClick={onClose} className="px-3 py-1 rounded-md border border-zinc-700">Close</button>
          </div>
        </div>

        <div className="mt-4 text-zinc-300">
          <h4 className="font-medium mb-2">Description</h4>
          <p className="whitespace-pre-wrap">{complaint.description}</p>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Resolution</h4>
            {complaint.resolved_at ? (
              <div className="text-sm text-zinc-300">
                <div><strong>By:</strong> {complaint.resolved_by}</div>
                <div><strong>At:</strong> {new Date(complaint.resolved_at).toLocaleString()}</div>
                <div className="mt-2">{complaint.resolved_description}</div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500">Not resolved yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
