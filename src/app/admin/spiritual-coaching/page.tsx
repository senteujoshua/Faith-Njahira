"use client";

import { useState, useEffect, useCallback } from "react";

interface SpiritualCoachingItem {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

const emptyForm = {
  title: "",
  description: "",
  duration: "",
  price: "",
  isActive: true,
  order: 0,
};

export default function AdminSpiritualCoachingPage() {
  const [items, setItems] = useState<SpiritualCoachingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SpiritualCoachingItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/admin/spiritual-coaching");
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
    const url = editing ? `/api/admin/spiritual-coaching/${editing.id}` : "/api/admin/spiritual-coaching";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    fetchItems();
  };

  const handleEdit = (item: SpiritualCoachingItem) => {
    setForm({
      title: item.title,
      description: item.description || "",
      duration: item.duration || "",
      price: item.price || "",
      isActive: item.isActive,
      order: item.order,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offering?")) return;
    await fetch(`/api/admin/spiritual-coaching/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) return <div className="text-warm-gray font-body">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-teal">Spiritual Coaching</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Offering
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-4">
            {editing ? "Edit Offering" : "New Offering"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 60 min"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. $75 / KES 10,000"
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
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">No offerings yet. Add your first one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-body text-sm font-medium text-slate">{item.title}</td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">{item.duration || "—"}</td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">{item.price || "—"}</td>
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
