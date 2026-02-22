"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  source: string | null;
  url: string | null;
  date: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

type Category = "INTERVIEW" | "VIDEO" | "BLOG" | "PHOTO";

const CATEGORIES: {
  value: Category;
  label: string;
  plural: string;
  sourceLabel: string;
  urlLabel: string;
  urlPlaceholder: string;
  sourcePlaceholder: string;
  icon: React.ReactNode;
  color: string;
  accentBg: string;
}[] = [
  {
    value: "INTERVIEW",
    label: "Interview",
    plural: "Interviews & Panels",
    sourceLabel: "Event / Platform",
    urlLabel: "Link",
    urlPlaceholder: "https://...",
    sourcePlaceholder: "e.g. UN Women Conference, BBC Africa",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    color: "text-teal bg-teal/10",
    accentBg: "bg-teal/5 border-teal/20",
  },
  {
    value: "VIDEO",
    label: "Video",
    plural: "Video Appearances",
    sourceLabel: "Platform",
    urlLabel: "Video URL",
    urlPlaceholder: "https://youtube.com/...",
    sourcePlaceholder: "e.g. YouTube, Vimeo, TED",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
    color: "text-red-600 bg-red-50",
    accentBg: "bg-red-50/50 border-red-100",
  },
  {
    value: "BLOG",
    label: "Blog",
    plural: "Blogs & Opinion Pieces",
    sourceLabel: "Publication",
    urlLabel: "Article URL",
    urlPlaceholder: "https://...",
    sourcePlaceholder: "e.g. Al Jazeera, Medium, personal blog",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    color: "text-gold bg-gold/10",
    accentBg: "bg-gold/5 border-gold/20",
  },
  {
    value: "PHOTO",
    label: "Photo",
    plural: "Photo Gallery",
    sourceLabel: "Context / Event",
    urlLabel: "Photo URL",
    urlPlaceholder: "https://...",
    sourcePlaceholder: "e.g. Nairobi Conference 2024",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    color: "text-purple-600 bg-purple-50",
    accentBg: "bg-purple-50/50 border-purple-100",
  },
];

const emptyForm = {
  title: "",
  description: "",
  source: "",
  url: "",
  date: "",
  isActive: true,
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category>("INTERVIEW");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  // Photo upload state
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; done: boolean; error?: string }[]>([]);
  const [photoUploadMode, setPhotoUploadMode] = useState<"file" | "url">("file");
  const [photoMeta, setPhotoMeta] = useState({ title: "", source: "", date: "" });

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditing(null);
    setShowForm(false);
    setUploadProgress([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/admin/media/${editing.id}` : "/api/admin/media";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, category: activeTab }),
    });
    setSaving(false);
    resetForm();
    fetchItems();
  };

  // Batch photo upload: upload files, then create a MediaItem per photo
  const handlePhotoFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingPhotos(true);
    setUploadProgress(files.map((f) => ({ name: f.name, done: false })));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "media/photos");
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();

        // Derive title: use meta title as prefix if set, else use filename
        const fileBaseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        const title = photoMeta.title
          ? (files.length > 1 ? `${photoMeta.title} ${i + 1}` : photoMeta.title)
          : fileBaseName;

        await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: "PHOTO",
            title,
            url: data.url,
            isActive: true,
            description: null,
            source: photoMeta.source || null,
            date: photoMeta.date || null,
          }),
        });

        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, done: true } : p))
        );
      } catch {
        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, done: true, error: "Failed" } : p))
        );
      }
    }

    setUploadingPhotos(false);
    fetchItems();
    // Reset file input
    if (photoInputRef.current) photoInputRef.current.value = "";
    setTimeout(() => setUploadProgress([]), 3000);
  };

  const handleEdit = (item: MediaItem) => {
    setActiveTab(item.category as Category);
    setForm({
      title: item.title,
      description: item.description || "",
      source: item.source || "",
      url: item.url || "",
      date: item.date || "",
      isActive: item.isActive,
    });
    setEditing(item);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("media-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const openAddForm = (cat: Category) => {
    setActiveTab(cat);
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const tabItems = items.filter((i) => i.category === activeTab);
  const catConfig = CATEGORIES.find((c) => c.value === activeTab)!;
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c.value, items.filter((i) => i.category === c.value).length])
  );
  const photoItems = items.filter((i) => i.category === "PHOTO");

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="font-body text-sm text-warm-gray">Loading media...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">Media</h1>
          <p className="font-body text-sm text-warm-gray mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} across {CATEGORIES.length} categories
          </p>
        </div>
        <button
          onClick={() => openAddForm(activeTab)}
          className="px-4 py-2.5 bg-gold text-white text-sm font-body font-semibold rounded-xl hover:bg-gold-dark transition-all shadow-sm hover:shadow flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add {catConfig.label}
        </button>
      </div>

      {/* Premium Section Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setActiveTab(cat.value); setShowForm(false); setEditing(null); }}
            className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
              activeTab === cat.value
                ? "border-gold bg-gradient-to-br from-gold/8 to-gold/3 shadow-sm"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${cat.color} ${activeTab === cat.value ? "shadow-sm" : ""}`}>
              {cat.icon}
            </div>
            <div className="min-w-0">
              <p className={`font-body text-sm font-bold truncate ${activeTab === cat.value ? "text-teal" : "text-slate"}`}>
                {cat.plural}
              </p>
              <p className="font-body text-xs text-warm-gray mt-0.5">
                {counts[cat.value]} item{counts[cat.value] !== 1 ? "s" : ""}
              </p>
            </div>
            {activeTab === cat.value && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
        ))}
      </div>

      {/* ===== PHOTO TAB — Album UI ===== */}
      {activeTab === "PHOTO" && (
        <div className="space-y-4">
          {/* Photo Upload Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-purple-600 bg-purple-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-teal">Upload Photos</h2>
                  <p className="font-body text-xs text-warm-gray">Select multiple files to build your album</p>
                </div>
              </div>
              {/* Toggle URL/File */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPhotoUploadMode("file")}
                  className={`px-3 py-1.5 text-xs font-body font-semibold rounded-md transition-all ${photoUploadMode === "file" ? "bg-white text-teal shadow-sm" : "text-warm-gray hover:text-slate"}`}
                >
                  From Files
                </button>
                <button
                  onClick={() => setPhotoUploadMode("url")}
                  className={`px-3 py-1.5 text-xs font-body font-semibold rounded-md transition-all ${photoUploadMode === "url" ? "bg-white text-teal shadow-sm" : "text-warm-gray hover:text-slate"}`}
                >
                  From URL
                </button>
              </div>
            </div>

            <div className="p-6">
              {photoUploadMode === "file" ? (
                <div className="space-y-5">
                  {/* Metadata fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">
                        Title / Album name
                        <span className="ml-1 font-normal text-warm-gray text-xs">(optional prefix)</span>
                      </label>
                      <input
                        type="text"
                        value={photoMeta.title}
                        onChange={(e) => setPhotoMeta({ ...photoMeta, title: e.target.value })}
                        placeholder="e.g. Nairobi Summit"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">Context / Event</label>
                      <input
                        type="text"
                        value={photoMeta.source}
                        onChange={(e) => setPhotoMeta({ ...photoMeta, source: e.target.value })}
                        placeholder="e.g. UN Women Conference"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">Date</label>
                      <input
                        type="text"
                        value={photoMeta.date}
                        onChange={(e) => setPhotoMeta({ ...photoMeta, date: e.target.value })}
                        placeholder="e.g. March 2024"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                  </div>

                  {/* Drop Zone */}
                  <div
                    className="relative border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/30 hover:bg-purple-50/60 hover:border-purple-300 transition-all cursor-pointer group"
                    onClick={() => !uploadingPhotos && photoInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <p className="font-body font-semibold text-slate mb-1">
                        {uploadingPhotos ? "Uploading photos..." : "Click to select photos"}
                      </p>
                      <p className="font-body text-sm text-warm-gray mb-4">
                        Select multiple files at once — each photo is added to the gallery
                      </p>
                      {!uploadingPhotos && (
                        <span className="px-4 py-2 bg-purple-600 text-white text-sm font-body font-semibold rounded-xl hover:bg-purple-700 transition-colors">
                          Choose Files
                        </span>
                      )}
                      {uploadingPhotos && (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                          <span className="font-body text-sm text-purple-600 font-medium">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoFilesChange}
                      disabled={uploadingPhotos}
                    />
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress.length > 0 && (
                    <div className="space-y-2">
                      {uploadProgress.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            p.error ? "bg-red-100" : p.done ? "bg-green-100" : "bg-purple-100"
                          }`}>
                            {p.error ? (
                              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : p.done ? (
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            ) : (
                              <div className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                          <span className="font-body text-sm text-slate truncate flex-1">{p.name}</span>
                          <span className={`font-body text-xs font-medium ${p.error ? "text-red-500" : p.done ? "text-green-600" : "text-purple-500"}`}>
                            {p.error || (p.done ? "Done" : "Uploading")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* URL mode — single photo add */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">Photo Title <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Nairobi Conference 2024"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">Photo URL <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        required
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">Context / Event</label>
                      <input
                        type="text"
                        value={form.source}
                        onChange={(e) => setForm({ ...form, source: e.target.value })}
                        placeholder="e.g. Nairobi Conference 2024"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-slate mb-1">Date</label>
                      <input
                        type="text"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        placeholder="e.g. March 2024"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded accent-purple-600 w-4 h-4" />
                      <span className="font-body text-sm text-slate">Visible on site</span>
                    </label>
                    <button type="submit" disabled={saving} className="px-5 py-2.5 bg-purple-600 text-white text-sm font-body font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center gap-2">
                      {saving && <div className="w-3.5 h-3.5 border border-white/50 border-t-white rounded-full animate-spin" />}
                      Add Photo
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-purple-600 bg-purple-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h2 className="font-heading text-base font-bold text-teal">Photo Gallery</h2>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 text-xs font-body font-semibold rounded-full">
                  {photoItems.length}
                </span>
              </div>
            </div>

            {photoItems.length === 0 ? (
              <div className="py-20 text-center px-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <p className="font-body font-semibold text-slate mb-1">No photos yet</p>
                <p className="font-body text-sm text-warm-gray">Upload photos above to build your gallery.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {photoItems.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                      {photo.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                          </svg>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                      {/* Hidden badge */}
                      {!photo.isActive && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-body font-semibold rounded-lg backdrop-blur-sm">
                          Hidden
                        </div>
                      )}

                      {/* Caption & Actions on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="font-body text-xs text-white font-semibold truncate leading-tight mb-1.5">
                          {photo.title}
                        </p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(photo)}
                            className="flex-1 py-1 bg-white/20 backdrop-blur-sm text-white text-[11px] font-body font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(photo.id)}
                            className="flex-1 py-1 bg-red-500/70 backdrop-blur-sm text-white text-[11px] font-body font-semibold rounded-lg hover:bg-red-500/90 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Photo Form (if editing a photo) */}
          {showForm && editing && (
            <div id="media-form" className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-purple-600 bg-purple-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </div>
                <h2 className="font-heading text-lg font-bold text-teal">Edit Photo</h2>
                <button type="button" onClick={resetForm} className="ml-auto text-warm-gray hover:text-slate">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Title</label>
                    <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Photo URL</label>
                    <input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Context / Event</label>
                    <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                      placeholder="e.g. Nairobi Conference 2024"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Date</label>
                    <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="e.g. March 2024"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300" />
                  </div>
                </div>
                {form.url && (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.url} alt={form.title} className="w-32 h-24 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded accent-purple-600 w-4 h-4" />
                    <span className="font-body text-sm text-slate">Visible on site</span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-xl hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={saving} className="px-5 py-2 bg-purple-600 text-white text-sm font-body font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-60">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ===== NON-PHOTO TABS ===== */}
      {activeTab !== "PHOTO" && (
        <>
          {/* Add / Edit Form */}
          {showForm && (
            <div id="media-form" className={`bg-white rounded-2xl border-2 p-6 shadow-sm ${catConfig.accentBg}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${catConfig.color}`}>
                  {catConfig.icon}
                </div>
                <h2 className="font-heading text-lg font-bold text-teal">
                  {editing ? `Edit ${catConfig.label}` : `Add ${catConfig.label}`}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-warm-gray hover:text-slate hover:bg-gray-100 transition-colors"
                  aria-label="Close form"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-body text-sm font-medium text-slate mb-1">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder={
                      activeTab === "INTERVIEW" ? "e.g. Disability Justice in the Global South — Panel Discussion" :
                      activeTab === "VIDEO" ? "e.g. For All the Brilliant Conversations — Documentary" :
                      "e.g. Queering SRHR: A Disability Perspective"
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">{catConfig.sourceLabel}</label>
                    <input
                      type="text"
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      placeholder={catConfig.sourcePlaceholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">{catConfig.urlLabel}</label>
                    <input
                      type="text"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder={catConfig.urlPlaceholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-slate mb-1">Date</label>
                    <input
                      type="text"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="e.g. March 2024"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-slate mb-1">
                    Description <span className="text-warm-gray font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="Brief description..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded accent-gold w-4 h-4"
                    />
                    <span className="font-body text-sm text-slate">Visible on site</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-200 text-slate text-sm font-body font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 bg-gold text-white text-sm font-body font-semibold rounded-xl hover:bg-gold-dark transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm"
                    >
                      {saving && <div className="w-3.5 h-3.5 border border-white/50 border-t-white rounded-full animate-spin" />}
                      {editing ? "Save Changes" : `Add ${catConfig.label}`}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Items List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${catConfig.color}`}>
                  {catConfig.icon}
                </div>
                <h2 className="font-heading text-base font-bold text-teal">{catConfig.plural}</h2>
                <span className="px-2.5 py-0.5 bg-gray-100 text-warm-gray text-xs font-body font-semibold rounded-full">
                  {tabItems.length}
                </span>
              </div>
              {!showForm && (
                <button
                  onClick={() => openAddForm(activeTab)}
                  className="flex items-center gap-1.5 text-sm font-body font-semibold text-gold hover:text-gold-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add
                </button>
              )}
            </div>

            {tabItems.length === 0 ? (
              <div className="py-20 text-center px-6">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${catConfig.color}`}>
                  {catConfig.icon}
                </div>
                <p className="font-body font-semibold text-slate mb-1">No {catConfig.label.toLowerCase()}s yet</p>
                <p className="font-body text-sm text-warm-gray mb-5">Add your first {catConfig.label.toLowerCase()} using the button above.</p>
                <button
                  onClick={() => openAddForm(activeTab)}
                  className="px-5 py-2.5 bg-gold text-white text-sm font-body font-semibold rounded-xl hover:bg-gold-dark transition-colors shadow-sm"
                >
                  + Add {catConfig.label}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {tabItems.map((item, i) => (
                  <div key={item.id} className={`px-6 py-4 flex items-start gap-4 hover:bg-gray-50/70 group transition-colors ${i % 2 === 0 ? "" : ""}`}>
                    {/* Numbering */}
                    <div className="w-6 text-center shrink-0 pt-0.5">
                      <span className="font-body text-xs text-warm-gray/50 font-semibold">{i + 1}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="font-body text-sm font-semibold text-slate leading-snug">
                          {item.title}
                        </span>
                        {!item.isActive && (
                          <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-body font-semibold rounded-full mt-0.5">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {item.source && (
                          <span className="flex items-center gap-1 font-body text-xs text-warm-gray">
                            <span className="w-1 h-1 rounded-full bg-warm-gray/40 inline-block" />
                            {item.source}
                          </span>
                        )}
                        {item.date && (
                          <span className="flex items-center gap-1 font-body text-xs text-warm-gray">
                            <span className="w-1 h-1 rounded-full bg-warm-gray/40 inline-block" />
                            {item.date}
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-body text-xs text-gold hover:text-gold-dark truncate max-w-[200px]"
                          >
                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            {item.url.replace(/^https?:\/\//, "").substring(0, 36)}{item.url.length > 43 ? "…" : ""}
                          </a>
                        )}
                        {item.description && (
                          <span className="font-body text-xs text-warm-gray/70 truncate max-w-xs">
                            {item.description.substring(0, 80)}{item.description.length > 80 ? "…" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 text-xs font-body font-semibold text-gold border border-gold/30 rounded-lg hover:bg-gold/5 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 text-xs font-body font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
