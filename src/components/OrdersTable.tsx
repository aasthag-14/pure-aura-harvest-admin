"use client";
import { Order } from "@/types/order";
import React, { useState } from "react";
const OrdersTable: React.FC<{
  orders: Order[];
}> = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-4">
      {orders?.map((order) => {
        const isExpanded = expandedOrder === order._id;

        return (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Collapsed View - Minimal Info */}
            <div
              onClick={() => toggleOrder(order._id)}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order._id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order?.orderDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                    ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {order.currency} {order.totalAmount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div
                    className={`
                    w-5 h-5 flex items-center justify-center transform transition-transform duration-200
                    ${isExpanded ? "rotate-180" : "rotate-0"}
                  `}
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
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
            </div>

            {/* Expanded View - Full Details */}
            <div
              className={`
              transition-all duration-300 ease-in-out
              ${isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
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
                        <span className="font-medium">User ID:</span>{" "}
                        {order.userId}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Order Date:</span>{" "}
                        {new Date(order?.orderDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
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
                            order.paymentStatus === "paid"
                              ? "text-green-600"
                              : order.paymentStatus === "unpaid"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        `}
                        >
                          {order.paymentStatus}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Method:</span>{" "}
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                    Order Items
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full normal-case">
                      {order.items.length}
                    </span>
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item, index) => (
                      <div
                        key={item.productId}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900 leading-tight">
                            {item.productName}
                          </h5>
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-500 flex-shrink-0 ml-2">
                            #{index + 1}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          {item.brand}
                        </p>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Qty:</span>
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Unit:</span>
                            <span className="font-medium">
                              ₹{item.unitPrice}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">
                              Total:
                            </span>
                            <span className="font-bold text-gray-900">
                              ₹{item.totalPrice}
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
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.phone}
                      </p>
                      <div className="pt-1 space-y-0.5">
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p className="font-medium">
                          {order.shippingAddress.country}
                        </p>
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
