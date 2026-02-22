"use client";

import { useState, useEffect, useCallback } from "react";

interface Publication {
  id: string;
  type: string;
  year: string;
  title: string;
  description: string | null;
  publisher: string | null;
  link: string | null;
  tags: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

const TYPES = [
  { value: "BOOK_CHAPTER", label: "Book / Chapter" },
  { value: "FILM_MEDIA", label: "Film & Media" },
  { value: "REPORT", label: "Report / Technical" },
  { value: "LECTURE", label: "Lecture / Talk" },
];

const emptyForm = {
  type: "BOOK_CHAPTER",
  year: new Date().getFullYear().toString(),
  title: "",
  description: "",
  publisher: "",
  link: "",
  tags: "",
  isActive: true,
  order: 0,
};

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/admin/publications");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/publications/${editing.id}` : "/api/admin/publications";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    fetchItems();
  };

  const handleEdit = (item: Publication) => {
    setForm({
      type: item.type,
      year: item.year,
      title: item.title,
      description: item.description || "",
      publisher: item.publisher || "",
      link: item.link || "",
      tags: item.tags || "",
      isActive: item.isActive,
      order: item.order,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    await fetch(`/api/admin/publications/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const getTypeLabel = (type: string) => TYPES.find((t) => t.value === type)?.label ?? type;

  if (loading) return <div className="text-warm-gray font-body">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-teal">Publications</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Publication
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-4">
            {editing ? "Edit Publication" : "New Publication"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Year</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Publisher</label>
                <input
                  type="text"
                  value={form.publisher}
                  onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Link / URL</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="disability, Kenya, education"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isActive" className="font-body text-sm text-slate">Active (visible on site)</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors">
                {editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">No publications yet. Add your first one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Publisher</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-body text-sm font-medium text-slate max-w-xs truncate">{item.title}</td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">{getTypeLabel(item.type)}</td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">{item.year}</td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">{item.publisher || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-sm font-body text-gold hover:text-gold-dark">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-sm font-body text-red-500 hover:text-red-700">Delete</button>
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
