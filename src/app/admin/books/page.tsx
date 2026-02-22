"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Book {
  id: string;
  title: string;
  slug: string;
  fileName: string;
  description: string | null;
  publisher: string | null;
  coverImage: string | null;
  priceUSD: number | null;
  priceKES: number | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  slug: "",
  fileName: "",
  description: "",
  publisher: "",
  coverImage: "",
  priceUSD: "",
  priceKES: "",
  order: "0",
  isActive: true,
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Upload states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const fetchBooks = useCallback(async () => {
    const res = await fetch("/api/admin/books");
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setUploadError("");
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    const data = await res.json();
    return data.url;
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadingPdf(true);
    try {
      const url = await uploadFile(file, "books/files");
      setForm((f) => ({ ...f, fileName: url! }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadingCover(true);
    try {
      const url = await uploadFile(file, "books/covers");
      setForm((f) => ({ ...f, coverImage: url! }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editing ? `/api/admin/books/${editing.id}` : "/api/admin/books";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    resetForm();
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setForm({
      title: book.title,
      slug: book.slug,
      fileName: book.fileName,
      description: book.description || "",
      publisher: book.publisher || "",
      coverImage: book.coverImage || "",
      priceUSD: book.priceUSD != null ? String(book.priceUSD) : "",
      priceKES: book.priceKES != null ? String(book.priceKES) : "",
      order: String(book.order),
      isActive: book.isActive,
    });
    setEditing(book);
    setShowForm(true);
    setUploadError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  if (loading) {
    return <div className="text-warm-gray font-body">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-teal">Books</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Book
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-5">
            {editing ? "Edit Book" : "New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title + Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: editing ? form.slug : generateSlug(e.target.value),
                    })
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

            {/* Publisher */}
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">
                Publisher / Author
              </label>
              <input
                type="text"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                placeholder="e.g. Faith Njahira"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the book..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-warm-gray">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.priceUSD}
                    onChange={(e) => setForm({ ...form, priceUSD: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <p className="font-body text-xs text-warm-gray mt-1">Leave 0 for free download</p>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Price (KES)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-warm-gray">KES</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={form.priceKES}
                    onChange={(e) => setForm({ ...form, priceKES: e.target.value })}
                    placeholder="0"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-2">
                Book PDF File
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={uploadingPdf}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-body text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploadingPdf ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-gold" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      Upload PDF
                    </>
                  )}
                </button>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
                {form.fileName && (
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="font-body text-xs text-green-700 truncate">
                      {form.fileName.startsWith("http")
                        ? "File uploaded: " + form.fileName.split("/").pop()
                        : form.fileName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, fileName: "" }))}
                      className="ml-auto text-green-600 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <p className="font-body text-xs text-warm-gray mt-1.5">
                Upload the PDF that customers will download after purchase
              </p>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block font-body text-sm font-medium text-slate mb-2">
                Cover Image
              </label>
              <div className="flex items-start gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-body text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {uploadingCover ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-gold" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Upload Cover
                      </>
                    )}
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  <p className="font-body text-xs text-warm-gray mt-1.5">
                    JPG, PNG (recommended: 600×800px)
                  </p>
                </div>
                {form.coverImage && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="w-16 h-20 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="font-body text-sm text-red-600">{uploadError}</p>
              </div>
            )}

            {/* Order + Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-body text-sm text-slate">Active (visible in shop)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Book" : "Create Book"}
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
        {books.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">
            No books yet. Add your first book above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-8 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="font-body text-sm font-medium text-slate">{book.title}</div>
                          {book.publisher && (
                            <div className="font-body text-xs text-warm-gray">{book.publisher}</div>
                          )}
                          <div className="font-body text-xs text-warm-gray/60">/{book.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-body text-sm text-slate">
                        {book.priceUSD != null ? (
                          <span className="font-medium">${book.priceUSD.toFixed(2)}</span>
                        ) : (
                          <span className="text-warm-gray text-xs">—</span>
                        )}
                      </div>
                      {book.priceKES != null && (
                        <div className="font-body text-xs text-warm-gray">
                          KES {book.priceKES.toLocaleString()}
                        </div>
                      )}
                      {book.priceUSD === 0 && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-body rounded">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {book.fileName ? (
                        <span className="inline-flex items-center gap-1 font-body text-xs text-green-700">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {book.fileName.startsWith("http") ? "Uploaded" : book.fileName}
                        </span>
                      ) : (
                        <span className="font-body text-xs text-red-500">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                          book.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {book.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-sm font-body text-gold hover:text-gold-dark"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
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
