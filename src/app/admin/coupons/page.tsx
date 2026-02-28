"use client";

import { useState, useEffect, useCallback } from "react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minAmountUSD: number | null;
  maxUses: number | null;
  usedCount: number;
  appliesTo: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  code: "",
  type: "PERCENT",
  value: "",
  minAmountUSD: "",
  maxUses: "",
  appliesTo: "",
  expiresAt: "",
  isActive: true,
};

const typeLabels: Record<string, string> = {
  PERCENT: "% Off",
  FIXED_USD: "Fixed USD",
  FIXED_KES: "Fixed KES",
  FIXED_GBP: "Fixed GBP",
};

const appliesToLabels: Record<string, string> = {
  "": "All Products",
  BOOK: "Books",
  COACHING: "Coaching",
  BUNDLE: "Bundles",
  EVENT: "Events",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCoupons = useCallback(async () => {
    const res = await fetch("/api/admin/coupons");
    const data: Coupon[] = await res.json();
    setCoupons(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      value: parseFloat(form.value) || 0,
      minAmountUSD: form.minAmountUSD ? parseFloat(form.minAmountUSD) : null,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      appliesTo: form.appliesTo || null,
      expiresAt: form.expiresAt || null,
    };

    const url = editing ? `/api/admin/coupons/${editing.id}` : "/api/admin/coupons";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Failed to save coupon");
      setSaving(false);
      return;
    }

    setSaving(false);
    resetForm();
    fetchCoupons();
  };

  const handleEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minAmountUSD: coupon.minAmountUSD ? String(coupon.minAmountUSD) : "",
      maxUses: coupon.maxUses ? String(coupon.maxUses) : "",
      appliesTo: coupon.appliesTo ?? "",
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : "",
      isActive: coupon.isActive,
    });
    setEditing(coupon);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const handleToggle = async (coupon: Coupon) => {
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...coupon, isActive: !coupon.isActive }),
    });
    fetchCoupons();
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.type === "PERCENT") return `${coupon.value}% off`;
    if (coupon.type === "FIXED_USD") return `$${coupon.value} off`;
    if (coupon.type === "FIXED_KES") return `KES ${coupon.value} off`;
    if (coupon.type === "FIXED_GBP") return `£${coupon.value} off`;
    return String(coupon.value);
  };

  if (loading) return <div className="text-warm-gray font-body">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-teal">Coupons</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-5">
            {editing ? "Edit Coupon" : "New Coupon"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-body text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  placeholder={form.type === "PERCENT" ? "e.g. 20" : "e.g. 10.00"}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Min Order (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minAmountUSD}
                  onChange={(e) => setForm({ ...form, minAmountUSD: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Max Uses</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Applies To</label>
                <select
                  value={form.appliesTo}
                  onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {Object.entries(appliesToLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Expiry Date</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 font-body text-sm text-slate cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              Active (can be used by customers)
            </label>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        {coupons.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">
            No coupons yet. Create your first coupon above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Applies To</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Usage</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt
                    ? new Date(coupon.expiresAt) < new Date()
                    : false;
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-bold text-teal tracking-wide">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-slate">
                        {formatDiscount(coupon)}
                        {coupon.minAmountUSD && (
                          <span className="block text-xs text-warm-gray">
                            min ${coupon.minAmountUSD}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-slate">
                        {appliesToLabels[coupon.appliesTo ?? ""] ?? coupon.appliesTo}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-slate">
                        {coupon.usedCount}
                        {coupon.maxUses && (
                          <span className="text-warm-gray"> / {coupon.maxUses}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-slate">
                        {coupon.expiresAt ? (
                          <span className={isExpired ? "text-red-500" : ""}>
                            {new Date(coupon.expiresAt).toLocaleDateString()}
                            {isExpired && <span className="block text-xs">Expired</span>}
                          </span>
                        ) : (
                          <span className="text-warm-gray">Never</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggle(coupon)}
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-medium transition-colors ${
                            coupon.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-sm font-body text-gold hover:text-gold-dark"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-sm font-body text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
