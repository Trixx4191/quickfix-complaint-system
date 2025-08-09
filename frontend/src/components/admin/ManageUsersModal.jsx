export default function ManageUsersModal({ open, onClose, users, onAction }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        <ul>
          {users.map((u) => (
            <li key={u.id} className="mb-2 flex justify-between items-center">
              <span>
                <span className="font-medium">{u.email}</span>
                <span className="ml-2 text-xs text-zinc-400">({u.role})</span>
              </span>
              <div className="flex gap-2">
                {u.role === "user" && (
                  <button
                    onClick={() => onAction("promote", u)}
                    className="px-2 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-xs text-white"
                  >
                    Promote
                  </button>
                )}
                {u.role === "admin" && (
                  <button
                    onClick={() => onAction("demote", u)}
                    className="px-2 py-1 rounded bg-amber-700 hover:bg-amber-600 text-xs text-white"
                  >
                    Demote
                  </button>
                )}
                <button
                  onClick={() => onAction("delete", u)}
                  className="px-2 py-1 rounded bg-rose-700 hover:bg-rose-600 text-xs text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}