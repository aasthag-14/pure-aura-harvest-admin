"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Download,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Coupon, ListResponse } from "@/types/coupons";
import CouponForm from "../forms/CouponForm";
import ConfirmDialog from "../dialog/ConfirmDialog";

function toDateInputValue(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  const iso = new Date(
    dt.getTime() - dt.getTimezoneOffset() * 60000
  ).toISOString();
  return iso.split("T")[0];
}

function formatInr(n: number | undefined | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const PAGE_SIZES = [10, 20, 50, 100];

export default function CouponsTab() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [type, setType] = useState<"all" | "PERCENT" | "FLAT">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ListResponse>({
    items: [],
    total: 0,
    page: 1,
    pageSize,
  });
  const [selected, setSelected] = useState<string[]>([]);

  const [showForm, setShowForm] = useState<
    false | { mode: "create" } | { mode: "edit"; coupon: Coupon }
  >(false);
  const [confirm, setConfirm] = useState<
    false | { ids: string[]; action: "delete" | "enable" | "disable" }
  >(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.total || 0) / pageSize)),
    [data?.total, pageSize]
  );

  async function fetchCoupons() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status !== "all")
        params.set("isActive", status === "active" ? "true" : "false");
      if (type !== "all") params.set("type", type);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const res = await fetch(`/api/coupons?${params.toString()}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as ListResponse;
      setData(json);
      setSelected([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status, type]);
  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchCoupons();
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function toggleSelectAll() {
    const currentIds = data.items.map((i) => i._id);
    if (selected.length === currentIds.length) setSelected([]);
    else setSelected(currentIds);
  }

  function exportCSV() {
    const headers = [
      "Code",
      "Type",
      "Value",
      "MaxDiscount",
      "MinOrder",
      "Usage",
      "Active",
      "StartsAt",
      "EndsAt",
      "UpdatedAt",
    ];
    const rows = data?.items?.map((c) => [
      c.code,
      c.type,
      c.value,
      c.maxDiscount ?? "",
      c.minOrder ?? "",
      `${c.usedCount ?? 0}/${c.usageLimit ?? "∞"}`,
      c.isActive ? "Yes" : "No",
      c.startsAt ? toDateInputValue(c.startsAt) : "",
      c.endsAt ? toDateInputValue(c.endsAt) : "",
      c.updatedAt ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coupons_page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function bulk(action: "delete" | "enable" | "disable") {
    if (selected.length === 0) return;
    setConfirm({ ids: selected, action });
  }

  async function applyAction(
    ids: string[],
    action: "delete" | "enable" | "disable"
  ) {
    if (ids.length === 0) return;
    if (action === "delete") {
      await Promise.all(
        ids.map((id) => fetch(`/api/coupons/${id}`, { method: "DELETE" }))
      );
    } else {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/coupons/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: action === "enable" }),
          })
        )
      );
    }
    setConfirm(false);
    fetchCoupons();
  }

  async function toggleActive(c: Coupon) {
    await fetch(`/api/coupons/${c._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    fetchCoupons();
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm transition-all duration-300 w-full mt-6">
      {/* Header */}
      <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <h2 className="font-bold text-lg">Coupons</h2>
        <div className="flex-1" />
        <button
          onClick={() => setShowForm({ mode: "create" })}
          className="inline-flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" /> New Coupon
        </button>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 btn-secondary"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-4 pb-3 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code or description…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "all" | "active" | "inactive")
            }
            className="px-3 py-2 rounded-lg border border-gray-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "all" | "PERCENT" | "FLAT")
            }
            className="px-3 py-2 rounded-lg border border-gray-200"
          >
            <option value="all">All Types</option>
            <option value="PERCENT">Percent</option>
            <option value="FLAT">Flat</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-gray-200"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}/page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk bar */}
      <div className="px-4 pb-3 flex items-center gap-2 text-sm">
        <span className="text-gray-600">Selected: {selected.length}</span>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => bulk("enable")}
            className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
          >
            Enable
          </button>
          <button
            onClick={() => bulk("disable")}
            className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
          >
            Disable
          </button>
          <button
            onClick={() => bulk("delete")}
            className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Table */}
      {data?.items?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === data.items.length &&
                      data.items.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Min Order</th>
                <th className="p-3 text-left">Usage</th>
                <th className="p-3 text-left">Validity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />{" "}
                    Loading…
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              ) : (
                data.items.map((c) => {
                  const validity =
                    `${toDateInputValue(c.startsAt) || ""}${
                      c.startsAt ? " → " : ""
                    }${toDateInputValue(c.endsAt) || ""}` || "—";
                  return (
                    <tr key={c._id} className="border-t border-gray-200">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(c._id)}
                          onChange={() => toggleSelect(c._id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{c.code}</div>
                        {c.description && (
                          <div className="text-gray-500 text-xs line-clamp-1">
                            {c.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3">{c.type}</td>
                      <td className="p-3">
                        {c.type === "PERCENT"
                          ? `${c.value}%`
                          : formatInr(c.value)}
                      </td>
                      <td className="p-3">{formatInr(c.minOrder ?? null)}</td>
                      <td className="p-3">{`${c.usedCount ?? 0}/${
                        c.usageLimit ?? "∞"
                      }`}</td>
                      <td className="p-3">{validity || "—"}</td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleActive(c)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        >
                          {c.isActive ? (
                            <ToggleRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              setShowForm({ mode: "edit", coupon: c })
                            }
                            className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() =>
                              setConfirm({ ids: [c._id], action: "delete" })
                            }
                            className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="text-sm text-gray-600">Total: {data.total}</div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <CouponForm
          mode={showForm.mode}
          coupon={showForm.mode === "edit" ? showForm.coupon : undefined}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchCoupons();
          }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={
            confirm.action === "delete"
              ? "Delete coupons"
              : confirm.action === "enable"
              ? "Enable coupons"
              : "Disable coupons"
          }
          message={
            confirm.action === "delete"
              ? `Are you sure you want to delete ${confirm.ids.length} coupon(s)? This cannot be undone.`
              : `Are you sure you want to ${confirm.action} ${confirm.ids.length} coupon(s)?`
          }
          confirmText={
            confirm.action === "delete"
              ? "Delete"
              : confirm.action === "enable"
              ? "Enable"
              : "Disable"
          }
          confirmVariant={confirm.action === "delete" ? "danger" : "primary"}
          onCancel={() => setConfirm(false)}
          onConfirm={() => applyAction(confirm.ids, confirm.action)}
        />
      )}
    </div>
  );
}
