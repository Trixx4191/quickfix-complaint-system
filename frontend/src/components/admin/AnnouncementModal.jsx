"use client";

import { useState } from "react";

export default function AnnouncementModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please fill in all fields");
      return;
    }
    onSubmit({ title, message });
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700"
            placeholder="Message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-zinc-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
