"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Tier {
  id: string;
  name: string;
  description: string | null;
  priceUSD: number;
  priceGBP: number;
  priceKES: number;
  originalPriceUSD: number | null;
  originalPriceGBP: number | null;
  originalPriceKES: number | null;
  quantityAvailable: number;
  soldCount: number;
  maxPerPurchase: number;
  isSaleClosed: boolean;
  isDefault: boolean;
  order: number;
}

interface Session {
  id: string;
  sessionNumber: number;
  title: string | null;
  startTime: string;
  endTime: string | null;
  timezone: string;
}

interface Registration {
  id: string;
  seatCount: number;
  reminderSent: boolean;
  createdAt: string;
  order: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
  };
  tier: { id: string; name: string };
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventType: string;
  isActive: boolean;
  meetingLink: string | null;
  tiers: Tier[];
  sessions: Session[];
}

const emptyTier = {
  name: "",
  description: "",
  priceUSD: "0",
  priceGBP: "0",
  priceKES: "0",
  originalPriceUSD: "",
  originalPriceGBP: "",
  originalPriceKES: "",
  quantityAvailable: "0",
  maxPerPurchase: "5",
  isSaleClosed: false,
  isDefault: false,
  order: "0",
};

const emptySession = {
  sessionNumber: "1",
  title: "",
  startTime: "",
  endTime: "",
  timezone: "Africa/Nairobi",
};

type Tab = "overview" | "tiers" | "sessions" | "attendees";

export default function AdminEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // Tiers state
  const [showTierForm, setShowTierForm] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [tierForm, setTierForm] = useState(emptyTier);
  const [savingTier, setSavingTier] = useState(false);

  // Sessions state
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionForm, setSessionForm] = useState(emptySession);
  const [savingSession, setSavingSession] = useState(false);

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regTotal, setRegTotal] = useState(0);
  const [regPage, setRegPage] = useState(1);
  const [regSearch, setRegSearch] = useState("");
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    const res = await fetch(`/api/admin/events`);
    const data = await res.json();
    const found = data.find((e: EventData) => e.id === id);
    setEvent(found || null);
    setLoading(false);
  }, [id]);

  const fetchRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    const params = new URLSearchParams({ page: String(regPage), limit: "25", search: regSearch });
    const res = await fetch(`/api/admin/events/${id}/registrations?${params}`);
    const data = await res.json();
    setRegistrations(data.registrations || []);
    setRegTotal(data.total || 0);
    setLoadingRegs(false);
  }, [id, regPage, regSearch]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    if (activeTab === "attendees") fetchRegistrations();
  }, [activeTab, fetchRegistrations]);

  // Tier handlers
  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTier(true);
    const url = editingTier
      ? `/api/admin/events/${id}/tiers/${editingTier.id}`
      : `/api/admin/events/${id}/tiers`;
    const method = editingTier ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tierForm),
    });
    setSavingTier(false);
    setShowTierForm(false);
    setEditingTier(null);
    setTierForm(emptyTier);
    fetchEvent();
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!confirm("Delete this tier?")) return;
    const res = await fetch(`/api/admin/events/${id}/tiers/${tierId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Cannot delete tier");
      return;
    }
    fetchEvent();
  };

  // Session handlers
  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSession(true);
    const url = editingSession
      ? `/api/admin/events/${id}/sessions/${editingSession.id}`
      : `/api/admin/events/${id}/sessions`;
    const method = editingSession ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionForm),
    });
    setSavingSession(false);
    setShowSessionForm(false);
    setEditingSession(null);
    setSessionForm(emptySession);
    fetchEvent();
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/admin/events/${id}/sessions/${sessionId}`, { method: "DELETE" });
    fetchEvent();
  };

  // Registration action
  const handleRegAction = async (regId: string, action: string) => {
    if (action === "refund" && !confirm("Issue a refund for this registration?")) return;
    setActionLoading(regId + action);
    const res = await fetch(`/api/admin/events/${id}/registrations/${regId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setActionLoading(null);
    if (!res.ok) alert(data.error || "Action failed");
    else if (action === "refund") fetchRegistrations();
  };

  const handleExportCSV = () => {
    window.location.href = `/api/admin/events/${id}/registrations/export`;
  };

  if (loading) return <div className="text-warm-gray font-body">Loading...</div>;
  if (!event) return <div className="text-warm-gray font-body">Session not found.</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "tiers", label: `Tiers (${event.tiers.length})` },
    { key: "sessions", label: `Sessions (${event.sessions.length})` },
    { key: "attendees", label: `Attendees` },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/events" className="text-sm font-body text-warm-gray hover:text-slate">
          ← Coaching Sessions
        </Link>
        <h1 className="font-heading text-2xl font-bold text-teal">{event.title}</h1>
        <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium ${event.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {event.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-body font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-gold text-gold"
                : "text-warm-gray hover:text-slate"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-body text-xs text-warm-gray uppercase tracking-wide mb-1">Slug</p>
              <p className="font-body text-sm text-slate">/{event.slug}</p>
            </div>
            <div>
              <p className="font-body text-xs text-warm-gray uppercase tracking-wide mb-1">Session Type</p>
              <p className="font-body text-sm text-slate">{event.eventType}</p>
            </div>
            {event.meetingLink && (
              <div className="col-span-2">
                <p className="font-body text-xs text-warm-gray uppercase tracking-wide mb-1">Meeting Link</p>
                <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-gold hover:underline break-all">
                  {event.meetingLink}
                </a>
              </div>
            )}
            {event.description && (
              <div className="col-span-2">
                <p className="font-body text-xs text-warm-gray uppercase tracking-wide mb-1">Description</p>
                <p className="font-body text-sm text-slate whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === "tiers" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-lg font-bold text-teal">Ticket Tiers</h2>
            <button
              onClick={() => { setShowTierForm(true); setEditingTier(null); setTierForm(emptyTier); }}
              className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark"
            >
              + Add Tier
            </button>
          </div>

          {showTierForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-heading text-base font-bold text-teal mb-4">
                {editingTier ? "Edit Tier" : "New Tier"}
              </h3>
              <form onSubmit={handleSaveTier} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Name *</label>
                    <input type="text" required value={tierForm.name} onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Description</label>
                    <input type="text" value={tierForm.description} onChange={(e) => setTierForm({ ...tierForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Price USD ($)</label>
                    <input type="number" step="0.01" min="0" value={tierForm.priceUSD} onChange={(e) => setTierForm({ ...tierForm, priceUSD: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Price GBP (£)</label>
                    <input type="number" step="0.01" min="0" value={tierForm.priceGBP} onChange={(e) => setTierForm({ ...tierForm, priceGBP: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Price KES</label>
                    <input type="number" step="1" min="0" value={tierForm.priceKES} onChange={(e) => setTierForm({ ...tierForm, priceKES: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Original USD (strike-through)</label>
                    <input type="number" step="0.01" min="0" value={tierForm.originalPriceUSD} onChange={(e) => setTierForm({ ...tierForm, originalPriceUSD: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Original GBP</label>
                    <input type="number" step="0.01" min="0" value={tierForm.originalPriceGBP} onChange={(e) => setTierForm({ ...tierForm, originalPriceGBP: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Original KES</label>
                    <input type="number" step="1" min="0" value={tierForm.originalPriceKES} onChange={(e) => setTierForm({ ...tierForm, originalPriceKES: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Quantity (0 = unlimited)</label>
                    <input type="number" min="0" value={tierForm.quantityAvailable} onChange={(e) => setTierForm({ ...tierForm, quantityAvailable: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Max per Purchase</label>
                    <input type="number" min="1" value={tierForm.maxPerPurchase} onChange={(e) => setTierForm({ ...tierForm, maxPerPurchase: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Display Order</label>
                    <input type="number" min="0" value={tierForm.order} onChange={(e) => setTierForm({ ...tierForm, order: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tierForm.isDefault} onChange={(e) => setTierForm({ ...tierForm, isDefault: e.target.checked })} className="rounded" />
                    <span className="font-body text-sm text-slate">Default tier</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tierForm.isSaleClosed} onChange={(e) => setTierForm({ ...tierForm, isSaleClosed: e.target.checked })} className="rounded" />
                    <span className="font-body text-sm text-slate">Sale closed</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={savingTier} className="px-5 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark disabled:opacity-50">
                    {savingTier ? "Saving..." : editingTier ? "Update Tier" : "Create Tier"}
                  </button>
                  <button type="button" onClick={() => { setShowTierForm(false); setEditingTier(null); }} className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200">
            {event.tiers.length === 0 ? (
              <div className="px-6 py-10 text-center text-warm-gray font-body text-sm">No tiers yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Tier</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Sold / Available</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {event.tiers.map((tier) => (
                      <tr key={tier.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-body text-sm font-medium text-slate">{tier.name}</div>
                          {tier.isDefault && <span className="text-xs text-gold font-body">Default</span>}
                        </td>
                        <td className="px-4 py-4 font-body text-sm text-slate">
                          ${tier.priceUSD} / £{tier.priceGBP} / KES {tier.priceKES.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 font-body text-sm text-slate">
                          {tier.soldCount} / {tier.quantityAvailable === 0 ? "∞" : tier.quantityAvailable}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-body ${tier.isSaleClosed ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {tier.isSaleClosed ? "Closed" : "Open"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right space-x-3">
                          <button
                            onClick={() => {
                              setEditingTier(tier);
                              setTierForm({
                                name: tier.name,
                                description: tier.description || "",
                                priceUSD: String(tier.priceUSD),
                                priceGBP: String(tier.priceGBP),
                                priceKES: String(tier.priceKES),
                                originalPriceUSD: tier.originalPriceUSD != null ? String(tier.originalPriceUSD) : "",
                                originalPriceGBP: tier.originalPriceGBP != null ? String(tier.originalPriceGBP) : "",
                                originalPriceKES: tier.originalPriceKES != null ? String(tier.originalPriceKES) : "",
                                quantityAvailable: String(tier.quantityAvailable),
                                maxPerPurchase: String(tier.maxPerPurchase),
                                isSaleClosed: tier.isSaleClosed,
                                isDefault: tier.isDefault,
                                order: String(tier.order),
                              });
                              setShowTierForm(true);
                            }}
                            className="text-sm font-body text-gold hover:text-gold-dark"
                          >Edit</button>
                          <button onClick={() => handleDeleteTier(tier.id)} className="text-sm font-body text-red-500 hover:text-red-700">
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
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-lg font-bold text-teal">Sessions</h2>
            <button
              onClick={() => { setShowSessionForm(true); setEditingSession(null); setSessionForm(emptySession); }}
              className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark"
            >
              + Add Session
            </button>
          </div>

          {showSessionForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-heading text-base font-bold text-teal mb-4">
                {editingSession ? "Edit Session" : "New Session"}
              </h3>
              <form onSubmit={handleSaveSession} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Session # *</label>
                    <input type="number" min="1" required value={sessionForm.sessionNumber}
                      onChange={(e) => setSessionForm({ ...sessionForm, sessionNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Title</label>
                    <input type="text" value={sessionForm.title}
                      onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                      placeholder="e.g. Introduction, Module 1..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Start Time (UTC) *</label>
                    <input type="datetime-local" required value={sessionForm.startTime}
                      onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">End Time (UTC)</label>
                    <input type="datetime-local" value={sessionForm.endTime}
                      onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-slate mb-1">Timezone label</label>
                  <input type="text" value={sessionForm.timezone}
                    onChange={(e) => setSessionForm({ ...sessionForm, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={savingSession} className="px-5 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark disabled:opacity-50">
                    {savingSession ? "Saving..." : editingSession ? "Update Session" : "Create Session"}
                  </button>
                  <button type="button" onClick={() => { setShowSessionForm(false); setEditingSession(null); }}
                    className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200">
            {event.sessions.length === 0 ? (
              <div className="px-6 py-10 text-center text-warm-gray font-body text-sm">No sessions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Start</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">End</th>
                      <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Timezone</th>
                      <th className="px-4 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {event.sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-body text-sm text-slate">{sess.sessionNumber}</td>
                        <td className="px-4 py-4 font-body text-sm text-slate">{sess.title || "—"}</td>
                        <td className="px-4 py-4 font-body text-sm text-slate">{new Date(sess.startTime).toLocaleString()}</td>
                        <td className="px-4 py-4 font-body text-sm text-slate">{sess.endTime ? new Date(sess.endTime).toLocaleString() : "—"}</td>
                        <td className="px-4 py-4 font-body text-sm text-slate">{sess.timezone}</td>
                        <td className="px-4 py-4 text-right space-x-3">
                          <button
                            onClick={() => {
                              setEditingSession(sess);
                              const toLocal = (dt: string) => new Date(dt).toISOString().slice(0, 16);
                              setSessionForm({
                                sessionNumber: String(sess.sessionNumber),
                                title: sess.title || "",
                                startTime: toLocal(sess.startTime),
                                endTime: sess.endTime ? toLocal(sess.endTime) : "",
                                timezone: sess.timezone,
                              });
                              setShowSessionForm(true);
                            }}
                            className="text-sm font-body text-gold hover:text-gold-dark"
                          >Edit</button>
                          <button onClick={() => handleDeleteSession(sess.id)} className="text-sm font-body text-red-500 hover:text-red-700">
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
      )}

      {/* Attendees Tab */}
      {activeTab === "attendees" && (
        <div>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <h2 className="font-heading text-lg font-bold text-teal">Attendees</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={regSearch}
                onChange={(e) => { setRegSearch(e.target.value); setRegPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 w-56"
              />
              <button onClick={handleExportCSV} className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-lg hover:bg-gray-50">
                Export CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            {loadingRegs ? (
              <div className="px-6 py-10 text-center text-warm-gray font-body text-sm">Loading...</div>
            ) : registrations.length === 0 ? (
              <div className="px-6 py-10 text-center text-warm-gray font-body text-sm">No registrations yet.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Attendee</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Tier</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Seats</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase">Reminder</th>
                        <th className="px-4 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-body text-sm font-medium text-slate">{reg.order.name}</div>
                            <div className="font-body text-xs text-warm-gray">{reg.order.email}</div>
                          </td>
                          <td className="px-4 py-4 font-body text-sm text-slate">{reg.tier.name}</td>
                          <td className="px-4 py-4 font-body text-sm text-slate">{reg.seatCount}</td>
                          <td className="px-4 py-4 font-body text-sm text-slate">{reg.order.currency} {reg.order.amount.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                              reg.order.status === "PAID" ? "bg-green-100 text-green-700"
                              : reg.order.status === "FAILED" ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {reg.order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium ${reg.reminderSent ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                              {reg.reminderSent ? "Sent" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-3">
                            <button
                              disabled={!!actionLoading}
                              onClick={() => handleRegAction(reg.id, "resend-email")}
                              className="text-sm font-body text-gold hover:text-gold-dark disabled:opacity-50"
                            >
                              {actionLoading === reg.id + "resend-email" ? "..." : "Resend Email"}
                            </button>
                            {reg.order.status === "PAID" && (
                              <button
                                disabled={!!actionLoading}
                                onClick={() => handleRegAction(reg.id, "refund")}
                                className="text-sm font-body text-red-500 hover:text-red-700 disabled:opacity-50"
                              >
                                {actionLoading === reg.id + "refund" ? "..." : "Refund"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {regTotal > 25 && (
                  <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="font-body text-sm text-warm-gray">
                      Showing {(regPage - 1) * 25 + 1}–{Math.min(regPage * 25, regTotal)} of {regTotal}
                    </p>
                    <div className="flex gap-2">
                      <button disabled={regPage === 1} onClick={() => setRegPage((p) => p - 1)}
                        className="px-3 py-1 border border-gray-200 rounded-lg font-body text-sm hover:bg-gray-50 disabled:opacity-40">Prev</button>
                      <button disabled={regPage * 25 >= regTotal} onClick={() => setRegPage((p) => p + 1)}
                        className="px-3 py-1 border border-gray-200 rounded-lg font-body text-sm hover:bg-gray-50 disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
