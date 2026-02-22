"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  coverImage: string | null;
  eventType: string;
  isActive: boolean;
  order: number;
  _count: { registrations: number };
  tiers: { id: string; name: string; priceUSD: number; soldCount: number; quantityAvailable: number }[];
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  shortDesc: "",
  coverImage: "",
  eventType: "ONLINE",
  isRecurring: false,
  timezone: "Africa/Nairobi",
  meetingLink: "",
  meetingDetails: "",
  extraDetails: "",
  isActive: true,
  order: "0",
};

const emptyTierDraft = {
  name: "",
  description: "",
  priceUSD: "0",
  priceGBP: "0",
  priceKES: "0",
  quantityAvailable: "0",
  maxPerPurchase: "5",
  isDefault: false,
};

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [pendingTiers, setPendingTiers] = useState<typeof emptyTierDraft[]>([]);
  const [tierDraft, setTierDraft] = useState(emptyTierDraft);
  const [showTierForm, setShowTierForm] = useState(false);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setUploadError("");
    setPendingTiers([]);
    setTierDraft(emptyTierDraft);
    setShowTierForm(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "events/covers");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((f) => ({ ...f, coverImage: data.url }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/admin/events/${editing.id}` : "/api/admin/events";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: parseInt(form.order) }),
    });

    if (!editing && pendingTiers.length > 0) {
      const created = await res.json();
      await Promise.all(
        pendingTiers.map((tier, i) =>
          fetch(`/api/admin/events/${created.id}/tiers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...tier, order: i }),
          })
        )
      );
    }

    setSaving(false);
    resetForm();
    fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setForm({
      title: event.title,
      slug: event.slug,
      description: "",
      shortDesc: event.shortDesc || "",
      coverImage: event.coverImage || "",
      eventType: event.eventType,
      isRecurring: false,
      timezone: "Africa/Nairobi",
      meetingLink: "",
      meetingDetails: "",
      extraDetails: "",
      isActive: event.isActive,
      order: String(event.order),
    });
    setEditing(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session and all its data?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  if (loading) return <div className="text-warm-gray font-body">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-teal">Coaching Sessions</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Session
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-5">
            {editing ? "Edit Session" : "New Session"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Short Description</label>
              <input
                type="text"
                value={form.shortDesc}
                onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                placeholder="One-liner for session cards..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Full Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Full session description..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Session Type</label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="ONLINE">Online</option>
                  <option value="IN_PERSON">In Person</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONE_ON_ONE">1-on-1</option>
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Timezone</label>
                <input
                  type="text"
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Meeting / Zoom Link</label>
              <input
                type="url"
                value={form.meetingLink}
                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                placeholder="https://zoom.us/j/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Meeting Details / Password</label>
              <input
                type="text"
                value={form.meetingDetails}
                onChange={(e) => setForm({ ...form, meetingDetails: e.target.value })}
                placeholder="Meeting ID: 123 456 789 | Password: abc123"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">Extra Details</label>
              <textarea
                value={form.extraDetails}
                onChange={(e) => setForm({ ...form, extraDetails: e.target.value })}
                rows={2}
                placeholder="What to bring, prerequisites, etc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-2">Cover Image</label>
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-body text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingCover ? "Uploading..." : "Upload Cover"}
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                {form.coverImage && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverImage} alt="Cover" className="w-20 h-14 object-cover rounded border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >×</button>
                  </div>
                )}
              </div>
            </div>

            {uploadError && (
              <p className="text-sm text-red-600 font-body">{uploadError}</p>
            )}

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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={form.isRecurring}
                onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isRecurring" className="font-body text-sm text-slate">Recurring session</label>
            </div>

            {/* Ticket Tiers — only on create */}
            {!editing && (
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-body text-sm font-semibold text-slate">Ticket Tiers</h3>
                  {!showTierForm && (
                    <button
                      type="button"
                      onClick={() => setShowTierForm(true)}
                      className="text-xs font-body text-gold hover:text-gold-dark font-medium"
                    >
                      + Add Tier
                    </button>
                  )}
                </div>

                {pendingTiers.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {pendingTiers.map((tier, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="font-body text-sm font-medium text-slate">{tier.name}</span>
                          <span className="font-body text-xs text-warm-gray">${tier.priceUSD} USD</span>
                          {tier.isDefault && (
                            <span className="px-1.5 py-0.5 bg-teal/10 text-teal text-xs font-body rounded">Default</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPendingTiers((t) => t.filter((_, j) => j !== i))}
                          className="text-xs text-red-500 font-body hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showTierForm && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-body text-xs font-medium text-slate mb-1">Tier Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={tierDraft.name}
                          onChange={(e) => setTierDraft((t) => ({ ...t, name: e.target.value }))}
                          placeholder="e.g. Standard, VIP"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-medium text-slate mb-1">Price USD</label>
                        <input
                          type="number"
                          min="0"
                          value={tierDraft.priceUSD}
                          onChange={(e) => setTierDraft((t) => ({ ...t, priceUSD: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-body text-xs font-medium text-slate mb-1">Price GBP</label>
                        <input
                          type="number"
                          min="0"
                          value={tierDraft.priceGBP}
                          onChange={(e) => setTierDraft((t) => ({ ...t, priceGBP: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-medium text-slate mb-1">Price KES</label>
                        <input
                          type="number"
                          min="0"
                          value={tierDraft.priceKES}
                          onChange={(e) => setTierDraft((t) => ({ ...t, priceKES: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-body text-xs font-medium text-slate mb-1">Quantity (0 = unlimited)</label>
                        <input
                          type="number"
                          min="0"
                          value={tierDraft.quantityAvailable}
                          onChange={(e) => setTierDraft((t) => ({ ...t, quantityAvailable: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-medium text-slate mb-1">Max Per Purchase</label>
                        <input
                          type="number"
                          min="1"
                          value={tierDraft.maxPerPurchase}
                          onChange={(e) => setTierDraft((t) => ({ ...t, maxPerPurchase: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-body text-xs font-medium text-slate mb-1">Description</label>
                      <input
                        type="text"
                        value={tierDraft.description}
                        onChange={(e) => setTierDraft((t) => ({ ...t, description: e.target.value }))}
                        placeholder="Optional tier description..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                    <label className="flex items-center gap-2 font-body text-xs text-slate cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tierDraft.isDefault}
                        onChange={(e) => setTierDraft((t) => ({ ...t, isDefault: e.target.checked }))}
                        className="rounded"
                      />
                      Default tier
                    </label>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!tierDraft.name.trim()) return;
                          setPendingTiers((t) => [...t, tierDraft]);
                          setTierDraft(emptyTierDraft);
                          setShowTierForm(false);
                        }}
                        className="px-3 py-1.5 bg-teal text-white text-xs font-body font-medium rounded-lg hover:bg-teal-dark"
                      >
                        Add Tier
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowTierForm(false); setTierDraft(emptyTierDraft); }}
                        className="px-3 py-1.5 border border-gray-200 text-slate text-xs font-body rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Session" : "Create Session"}
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
        {events.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">
            No sessions yet. Add your first session above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Session</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Registrations</th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {event.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={event.coverImage} alt={event.title} className="w-12 h-8 object-cover rounded border border-gray-200 flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-body text-sm font-medium text-slate">{event.title}</div>
                          <div className="font-body text-xs text-warm-gray/60">/{event.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-body text-sm text-slate">{event.eventType}</td>
                    <td className="px-4 py-4 font-body text-sm text-slate">{event._count.registrations}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-medium ${event.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {event.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-sm font-body text-teal hover:text-teal-dark"
                      >
                        Manage
                      </Link>
                      <button onClick={() => handleEdit(event)} className="text-sm font-body text-gold hover:text-gold-dark">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="text-sm font-body text-red-500 hover:text-red-700">
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
