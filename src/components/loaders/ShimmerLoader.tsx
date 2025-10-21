"use client";

import React from "react";

// Base shimmer component
const ShimmerBase: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
    style={{
      animation: "shimmer 1.5s infinite",
    }}
  />
);

// Shimmer animation keyframes (add to global CSS)
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Orders shimmer loader
export const OrdersShimmer: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="border border-gray-200 rounded-xl bg-white shadow-sm mt-6"
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex-1 min-w-0">
              <ShimmerBase className="h-5 w-32 rounded mb-2" />
              <ShimmerBase className="h-4 w-24 rounded" />
            </div>
            <ShimmerBase className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <ShimmerBase className="h-6 w-24 rounded mb-1" />
              <ShimmerBase className="h-4 w-16 rounded" />
            </div>
            <ShimmerBase className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Users shimmer loader
export const UsersShimmer: React.FC = () => (
  <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full mt-6">
    <div className="p-4">
      <ShimmerBase className="h-6 w-20 rounded mb-4" />
      <ul className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="p-2 border border-gray-200 rounded">
            <div className="flex items-center gap-3">
              <ShimmerBase className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <ShimmerBase className="h-4 w-32 rounded mb-1" />
                <ShimmerBase className="h-3 w-48 rounded" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Inventory shimmer loader
export const InventoryShimmer: React.FC = () => (
  <div className="p-6 max-w-7xl mx-auto w-[95vw] md:w-[100vw]">
    {/* Header */}
    <div className="mb-6 flex flex-col md:flex-row md:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h2>
        <ShimmerBase className="h-10 w-24 rounded-lg" />
      </div>
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <ShimmerBase className="h-10 w-20 rounded-lg" />
        <ShimmerBase className="h-10 w-24 rounded-lg" />
      </div>
    </div>

    {/* Filters */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <ShimmerBase className="h-10 flex-1 rounded-lg" />
        <ShimmerBase className="h-10 w-32 rounded-lg" />
        <div className="flex gap-2">
          <ShimmerBase className="h-10 w-20 rounded-lg" />
          <ShimmerBase className="h-10 w-20 rounded-lg" />
          <ShimmerBase className="h-10 w-20 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Results summary */}
    <div className="mb-4">
      <ShimmerBase className="h-4 w-48 rounded" />
    </div>

    {/* Grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
        >
          <div className="flex justify-between items-start gap-2 mb-4">
            <div className="flex-1">
              <ShimmerBase className="h-6 w-32 rounded mb-2" />
              <ShimmerBase className="h-4 w-24 rounded" />
            </div>
            <ShimmerBase className="h-6 w-20 rounded-full" />
            <ShimmerBase className="h-6 w-12 rounded" />
          </div>
          <div className="mb-4">
            <ShimmerBase className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <ShimmerBase className="h-4 w-24 rounded" />
              <ShimmerBase className="h-5 w-12 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <ShimmerBase className="h-4 w-20 rounded" />
              <ShimmerBase className="h-5 w-16 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <ShimmerBase className="h-4 w-16 rounded" />
              <ShimmerBase className="h-5 w-12 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <ShimmerBase className="h-4 w-20 rounded" />
              <ShimmerBase className="h-6 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Collections shimmer loader
export const CollectionsShimmer: React.FC = () => (
  <div className="border border-gray-200 rounded-xl bg-white shadow-sm transition-all duration-300 w-[90vw] mt-6">
    <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <h2 className="font-bold text-lg">Collections</h2>
      <div className="flex-1" />
      <ShimmerBase className="h-10 w-36 rounded-lg" />
    </div>

    <div className="px-4 pb-3">
      <ShimmerBase className="h-10 w-full rounded-lg" />
    </div>

    <div className="divide-y divide-gray-200">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <ShimmerBase className="h-3 w-16 rounded mb-2" />
            <ShimmerBase className="h-5 w-32 rounded mb-2" />
            <ShimmerBase className="h-4 w-full rounded" />
            <ShimmerBase className="h-4 w-3/4 rounded mt-1" />
          </div>
          <div className="flex gap-2">
            <ShimmerBase className="h-8 w-16 rounded" />
            <ShimmerBase className="h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Coupons shimmer loader
export const CouponsShimmer: React.FC = () => (
  <div className="border border-gray-200 rounded-xl bg-white shadow-sm transition-all duration-300 w-[95vw] mt-6">
    {/* Header */}
    <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <h2 className="font-bold text-lg">Coupons</h2>
      <div className="flex-1" />
      <ShimmerBase className="h-10 w-28 rounded-lg" />
      <ShimmerBase className="h-10 w-24 rounded-lg" />
    </div>

    {/* Toolbar */}
    <div className="px-4 pb-3 flex flex-col lg:flex-row gap-3">
      <ShimmerBase className="h-10 flex-1 rounded-lg" />
      <div className="flex gap-2">
        <ShimmerBase className="h-10 w-24 rounded-lg" />
        <ShimmerBase className="h-10 w-24 rounded-lg" />
        <ShimmerBase className="h-10 w-20 rounded-lg" />
      </div>
    </div>

    {/* Bulk bar */}
    <div className="px-4 pb-3 flex items-center gap-2">
      <ShimmerBase className="h-4 w-20 rounded" />
      <div className="flex gap-2 ml-2">
        <ShimmerBase className="h-8 w-16 rounded" />
        <ShimmerBase className="h-8 w-18 rounded" />
        <ShimmerBase className="h-8 w-16 rounded" />
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-3 w-10">
              <ShimmerBase className="h-4 w-4 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-12 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-12 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-12 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-16 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-12 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-16 rounded" />
            </th>
            <th className="p-3 text-left">
              <ShimmerBase className="h-4 w-12 rounded" />
            </th>
            <th className="p-3 text-right">
              <ShimmerBase className="h-4 w-16 rounded" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="p-3">
                <ShimmerBase className="h-4 w-4 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-4 w-20 rounded mb-1" />
                <ShimmerBase className="h-3 w-32 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-4 w-16 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-4 w-12 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-4 w-16 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-4 w-12 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-4 w-24 rounded" />
              </td>
              <td className="p-3">
                <ShimmerBase className="h-8 w-8 rounded" />
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <ShimmerBase className="h-8 w-16 rounded" />
                  <ShimmerBase className="h-8 w-20 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center">
      <ShimmerBase className="h-4 w-16 rounded" />
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ShimmerBase className="h-8 w-12 rounded" />
        <ShimmerBase className="h-4 w-20 rounded" />
        <ShimmerBase className="h-8 w-12 rounded" />
      </div>
    </div>
  </div>
);

// Settings shimmer loader
export const SettingsShimmer: React.FC = () => (
  <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full">
    <div className="p-4">
      <ShimmerBase className="h-6 w-20 rounded mb-4" />
      <div className="p-4">
        <div className="flex items-center gap-4">
          <ShimmerBase className="h-4 w-12 rounded" />
          <ShimmerBase className="h-8 w-16 rounded" />
          <ShimmerBase className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Generic card shimmer
export const CardShimmer: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`border border-gray-200 rounded-xl bg-white shadow-sm p-4 ${className}`}
  >
    <ShimmerBase className="h-6 w-32 rounded mb-3" />
    <div className="space-y-2">
      <ShimmerBase className="h-4 w-full rounded" />
      <ShimmerBase className="h-4 w-3/4 rounded" />
      <ShimmerBase className="h-4 w-1/2 rounded" />
    </div>
  </div>
);

// Generic list shimmer
export const ListShimmer: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 p-3 border border-gray-200 rounded"
      >
        <ShimmerBase className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <ShimmerBase className="h-4 w-32 rounded mb-1" />
          <ShimmerBase className="h-3 w-48 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Generic table shimmer
export const TableShimmer: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: cols }).map((_, index) => (
            <th key={index} className="p-3 text-left">
              <ShimmerBase className="h-4 w-16 rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-t border-gray-200">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex} className="p-3">
                <ShimmerBase className="h-4 w-20 rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
