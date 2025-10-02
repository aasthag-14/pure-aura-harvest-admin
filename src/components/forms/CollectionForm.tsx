"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Collection } from "@/types/collection";

export default function CollectionForm({
  mode,
  collection,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  collection?: Collection;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = mode === "edit" && collection;
  const [form, setForm] = useState<Partial<Collection>>({
    id: "",
    title: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setForm({
        id: collection!.id,
        title: collection!.title,
        description: collection!.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, collection?._id]);

  function update<K extends keyof Collection>(key: K, val: Collection[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        id: String(form.id || "").trim(),
        title: String(form.title || "").trim(),
        description: String(form.description || "").trim(),
      };
      if (!payload.id || !payload.title || !payload.description) {
        alert("Please fill id, title and description");
        return;
      }

      const res = await fetch(
        isEdit ? `/api/collections/${collection!._id}` : "/api/collections",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Failed to save collection");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="font-semibold">
            {isEdit ? "Edit collection" : "Create collection"}
          </h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600">ID (slug)</label>
            <input
              value={form.id}
              onChange={(e) => update("id", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
              placeholder="car-accessories"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Title</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
              placeholder="Car Accessories"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
              rows={3}
              placeholder="Discover Luxe Aroma's premium..."
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
