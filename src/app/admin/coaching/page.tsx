"use client";

import { useState, useEffect, useCallback } from "react";

interface CoachingSession {
  id: string;
  title: string;
  description: string | null;
  clientName: string | null;
  clientEmail: string | null;
  status: string;
  scheduledAt: string | null;
  recordingUrl: string | null;
  duration: number | null;
  createdAt: string;
}

const statuses = ["UPCOMING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminCoachingPage() {
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CoachingSession | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientName: "",
    clientEmail: "",
    status: "UPCOMING",
    scheduledAt: "",
    recordingUrl: "",
    duration: "",
  });

  const fetchSessions = useCallback(async () => {
    const res = await fetch("/api/admin/coaching");
    const data = await res.json();
    setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      clientName: "",
      clientEmail: "",
      status: "UPCOMING",
      scheduledAt: "",
      recordingUrl: "",
      duration: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editing
      ? `/api/admin/coaching/${editing.id}`
      : "/api/admin/coaching";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchSessions();
  };

  const handleEdit = (session: CoachingSession) => {
    setForm({
      title: session.title,
      description: session.description || "",
      clientName: session.clientName || "",
      clientEmail: session.clientEmail || "",
      status: session.status,
      scheduledAt: session.scheduledAt
        ? new Date(session.scheduledAt).toISOString().slice(0, 16)
        : "",
      recordingUrl: session.recordingUrl || "",
      duration: session.duration?.toString() || "",
    });
    setEditing(session);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    await fetch(`/api/admin/coaching/${id}`, { method: "DELETE" });
    fetchSessions();
  };

  if (loading) {
    return <div className="text-warm-gray font-body">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-teal">
          Coaching Sessions
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Session
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-4">
            {editing ? "Edit Session" : "New Session"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) =>
                    setForm({ ...form, clientEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Scheduled At
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm({ ...form, scheduledAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">
                Recording URL
              </label>
              <input
                type="url"
                value={form.recordingUrl}
                onChange={(e) =>
                  setForm({ ...form, recordingUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
              >
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        {sessions.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">
            No coaching sessions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium text-slate">
                        {session.title}
                      </div>
                      {session.duration && (
                        <div className="font-body text-xs text-warm-gray">
                          {session.duration} min
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-slate">
                      {session.clientName || "—"}
                      {session.clientEmail && (
                        <div className="text-xs text-warm-gray">
                          {session.clientEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                          session.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : session.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : session.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {session.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">
                      {session.scheduledAt
                        ? new Date(session.scheduledAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(session)}
                        className="text-sm font-body text-gold hover:text-gold-dark"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="text-sm font-body text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
