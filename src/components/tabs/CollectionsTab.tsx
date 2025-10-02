"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, Loader2 } from "lucide-react";
import { Collection } from "@/types/collection";
import CollectionForm from "../forms/CollectionForm";

export default function CollectionsTab() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Collection[]>([]);
  const [showForm, setShowForm] = useState<
    false | { mode: "create" } | { mode: "edit"; item: Collection }
  >(false);

  async function fetchCollections() {
    setLoading(true);
    try {
      const res = await fetch("/api/collections", { cache: "no-store" });
      const json = (await res.json()) as Collection[];
      setItems(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  async function remove(id: string) {
    if (!confirm("Delete this collection?")) return;
    const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    fetchCollections();
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm transition-all duration-300 w-full mt-6">
      <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <h2 className="font-bold text-lg">Collections</h2>
        <div className="flex-1" />
        <button
          onClick={() => setShowForm({ mode: "create" })}
          className="inline-flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" /> New Collection
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search id, title or description…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No collections found
        </div>
      ) : (
        <div className="divide-y">
          {filtered.map((c) => (
            <div key={c._id} className="p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500">{c.id}</div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {c.description}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm({ mode: "edit", item: c })}
                  className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => remove(c._id!)}
                  className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CollectionForm
          mode={showForm.mode}
          collection={showForm.mode === "edit" ? showForm.item : undefined}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchCollections();
          }}
        />
      )}
    </div>
  );
}
