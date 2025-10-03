"use client";
import { Order } from "@/types/order";
import React, { useState } from "react";
const OrdersTable: React.FC<{
  orders: Order[];
}> = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Helpers
  function parseToDate(input: unknown): Date | null {
    if (input == null) return null;
    // Accept number (seconds or ms) or string
    if (typeof input === "number") {
      const ms = input < 1_000_000_000_000 ? input * 1000 : input;
      return new Date(ms);
    }
    if (typeof input === "string") {
      const num = Number(input);
      if (!Number.isNaN(num)) {
        const ms = num < 1_000_000_000_000 ? num * 1000 : num;
        return new Date(ms);
      }
      const d = new Date(input);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    try {
      const d = new Date(String(input));
      return Number.isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  }

  function formatDate(input: unknown): string {
    const d = parseToDate(input);
    if (!d) return "-";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatInr(n: unknown): string {
    const num = typeof n === "string" ? Number(n) : (n as number);
    if (Number.isNaN(num as number)) return String(n ?? "-");
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num as number);
  }

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-4">
      {orders?.map((order) => {
        const isExpanded = expandedOrder === order?._id;

        return (
          <div
            key={order?._id}
            className="border border-gray-200 rounded-xl bg-white shadow-sm mt-6"
          >
            {/* Collapsed View - Minimal Info */}
            <div
              onClick={() => toggleOrder(order?._id)}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    Order #{order?.order_id || order?._id}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {formatDate(order?.created_at)}
                  </p>
                </div>

                <span
                  className={`
                    px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap flex-shrink-0
                    ${
                      order?.order_status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order?.order_status === "created"
                        ? "bg-yellow-100 text-yellow-800"
                        : order?.order_status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order?.order_status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                >
                  {order?.order_status}
                </span>
              </div>

              {/* Bottom Row: Amount & Items */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">
                    {formatInr(order?.total_amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order?.items.length}{" "}
                    {order?.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center transform transition-transform duration-200 flex-shrink-0
                    ${isExpanded ? "rotate-180" : "rotate-0"}
                  `}
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expanded View - Full Details */}
            <div
              className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${
                isExpanded
                  ? "h-auto opacity-100 pointer-events-auto"
                  : "max-h-0 opacity-0 pointer-events-none"
              }
            `}
            >
              <div className="px-4 pb-4 border-t border-gray-100">
                {/* Customer & Payment Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Customer Info
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Order Date:</span>{" "}
                        {formatDate(order?.created_at)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Updated:</span>{" "}
                        {formatDate(order?.updated_at)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Mobile:</span>{" "}
                        {order?.customer?.mobile || "-"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {order?.customer?.addressForm?.email || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Payment Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`
                          ml-2 font-semibold
                          ${
                            order?.payment?.status === "success"
                              ? "text-green-600"
                              : order?.payment?.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        `}
                        >
                          {order?.payment?.status}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Razorpay Order ID:</span>{" "}
                        {order?.razorpay_order_id || "-"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Payment ID:</span>{" "}
                        {order?.payment?.razorpay_payment_id || "-"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Signature:</span>{" "}
                        {order?.payment?.razorpay_signature || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                    Order Items
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full normal-case">
                      {order?.items.length}
                    </span>
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {order?.items.map((item, index) => (
                      <div
                        key={item?.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <h5 className="text-sm font-semibold text-gray-900 leading-tight truncate">
                              {item?.name}
                            </h5>
                          </div>
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-500 flex-shrink-0 ml-2">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Qty:</span>
                            <span className="font-medium">
                              {item?.quantity}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Unit:</span>
                            <div className="flex gap-2">
                              <span className="font-medium">
                                {formatInr(item.unitPrice)}
                              </span>
                              <span className="font-medium line-through">
                                {formatInr(item.originalPrice)}
                              </span>{" "}
                            </div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Line Total:</span>
                            <span className="font-medium">
                              {formatInr(
                                (Number(item.unitPrice) || 0) *
                                  (item.quantity || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    Shipping Address
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-semibold text-gray-900">
                        {order?.customer?.addressForm?.fullName}
                      </p>
                      <p className="text-gray-600">
                        {order?.customer?.addressForm?.phone}
                      </p>
                      <div className="pt-1 space-y-0.5">
                        <p>{order?.customer?.addressForm?.address}</p>
                        {order?.customer?.addressForm?.city && (
                          <p>{order?.customer?.addressForm?.city}</p>
                        )}
                        <p>
                          {order?.customer?.addressForm?.city},{" "}
                          {order?.customer?.addressForm?.state} -{" "}
                          {order?.customer?.addressForm?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mt-6">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    Order Summary
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coupon Details</span>
                        <div className="flex gap-2">
                          <span className="font-semibold">
                            {order?.coupon?.code ?? "NA"}
                          </span>
                          <span className="font-semibold">
                            {formatInr(order?.coupon?.discount || 0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold">
                          {order?.shippingFee
                            ? formatInr(order?.shippingFee)
                            : "FREE"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="font-semibold">
                          {formatInr(order?.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersTable;
