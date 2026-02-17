"use client";

import { useState, useEffect, useCallback } from "react";

interface Book {
  id: string;
  title: string;
  slug: string;
  fileName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    fileName: "",
    description: "",
    isActive: true,
  });

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
    setForm({ title: "", slug: "", fileName: "", description: "", isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editing
      ? `/api/admin/books/${editing.id}`
      : "/api/admin/books";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setForm({
      title: book.title,
      slug: book.slug,
      fileName: book.fileName,
      description: book.description || "",
      isActive: book.isActive,
    });
    setEditing(book);
    setShowForm(true);
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
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gold text-white text-sm font-body font-medium rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Book
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-lg font-bold text-teal mb-4">
            {editing ? "Edit Book" : "New Book"}
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
                  onChange={(e) => {
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: editing ? form.slug : generateSlug(e.target.value),
                    });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-slate mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={form.fileName}
                  onChange={(e) =>
                    setForm({ ...form, fileName: e.target.value })
                  }
                  required
                  placeholder="e.g. my-book.pdf"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="isActive"
                  className="font-body text-sm text-slate"
                >
                  Active (visible in shop)
                </label>
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
        {books.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">
            No books yet. Add your first book above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium text-slate">
                        {book.title}
                      </div>
                      <div className="font-body text-xs text-warm-gray">
                        /{book.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">
                      {book.fileName}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-right space-x-2">
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
