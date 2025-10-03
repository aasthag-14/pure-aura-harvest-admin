"use client";

import type { Collection } from "@/types/collection";
import { Coupon, CouponScope, CouponType } from "@/types/coupons";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CouponFormData {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  scope?: CouponScope;
  collectionId?: string | null;
  maxDiscount?: number;
  minOrder?: number;
  usageLimit?: number;
  usagePerUser?: number;
  startsAt?: Date;
  endsAt?: Date;
  isActive: boolean;
}

export default function CouponForm({
  mode,
  coupon,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  coupon?: Coupon;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    type: "PERCENT",
    value: 10,
    scope: "ALL",
    collectionId: null,
    maxDiscount: undefined,
    minOrder: undefined,
    usageLimit: undefined,
    usagePerUser: undefined,
    startsAt: "",
    endsAt: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const isEdit = mode === "edit" && coupon;

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...coupon!,
        startsAt: coupon!.startsAt ? coupon!.startsAt : "",
        endsAt: coupon!.endsAt ? coupon!.endsAt : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, coupon?._id]);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch("/api/collections", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Collection[];
          setCollections(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCollections();
  }, []);

  function update<K extends keyof Coupon>(key: K, val: Coupon[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function save() {
    setSaving(true);
    try {
      const isB1G1 = form.type === "B1G1";
      const payload: CouponFormData = {
        code: String(form.code || "").toUpperCase(),
        description: form.description || "",
        type: form.type || "PERCENT",
        value: isB1G1 ? 0 : Number(form.value || 0),
        scope: form.scope || "ALL",
        collectionId:
          (form.scope || "ALL") === "COLLECTION"
            ? form.collectionId || null
            : null,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        minOrder: form.minOrder ? Number(form.minOrder) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        usagePerUser: form.usagePerUser ? Number(form.usagePerUser) : undefined,
        startsAt: form.startsAt ? new Date(form.startsAt as string) : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt as string) : undefined,
        isActive: !!form.isActive,
      };

      const res = await fetch(
        isEdit ? `/api/coupons/${coupon!._id}` : "/api/coupons",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Failed to save coupon");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full overflow-scroll max-h-[80%] my-10 max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="font-semibold">
            {isEdit ? "Edit coupon" : "Create coupon"}
          </h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Code</label>
            <input
              value={form.code}
              onChange={(e) => update("code", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
              placeholder="WELCOME10"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Type</label>
            <select
              value={form.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                update("type", e.target.value as CouponFormData["type"])
              }
              className="w-full px-3 py-2 rounded border border-gray-200"
            >
              <option value="PERCENT">Percent</option>
              <option value="FLAT">Flat</option>
              <option value="B1G1">B1G1</option>
            </select>
          </div>
          {form.type !== "B1G1" && (
            <div>
              <label className="block text-sm text-gray-600">
                Value {form.type === "PERCENT" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => update("value", Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-gray-200"
              />
            </div>
          )}
          {form.type !== "B1G1" && (
            <div>
              <label className="block text-sm text-gray-600">
                Max Discount (₹)
              </label>
              <input
                type="number"
                value={form.maxDiscount ?? ""}
                onChange={(e) => update("maxDiscount", +e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-200"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600">Scope</label>
            <select
              value={form.scope || "ALL"}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                update("scope", e.target.value as CouponScope)
              }
              className="w-full px-3 py-2 rounded border border-gray-200"
            >
              <option value="ALL">All Collections</option>
              <option value="COLLECTION">Specific Collection</option>
            </select>
          </div>
          {(form.scope || "ALL") === "COLLECTION" && (
            <div>
              <label className="block text-sm text-gray-600">Collection</label>
              <select
                value={form.collectionId || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  update("collectionId", e.target.value || null)
                }
                className="w-full px-3 py-2 rounded border border-gray-200"
              >
                <option value="">Select collection…</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600">Min Order (₹)</label>
            <input
              type="number"
              value={form.minOrder ?? ""}
              onChange={(e) => update("minOrder", +e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">
              Usage Limit (total)
            </label>
            <input
              type="number"
              value={form.usageLimit ?? ""}
              onChange={(e) => update("usageLimit", +e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">
              Usage per User
            </label>
            <input
              type="number"
              value={form.usagePerUser ?? ""}
              onChange={(e) => update("usagePerUser", +e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Starts At</label>
            <input
              type="date"
              value={toDateLocal(form.startsAt as string)}
              onChange={(e) => update("startsAt", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Ends At</label>
            <input
              type="date"
              value={toDateLocal(form.endsAt as string)}
              onChange={(e) => update("endsAt", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}

function toDateLocal(val?: string | null) {
  if (!val) return "";
  const d = new Date(val);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000).toISOString().split("T")[0];
  return local;
}
