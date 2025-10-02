"use client";

import { TABS } from "@/constants";
import { useAppData } from "@/context/AppDataContext";
import { useEffect } from "react";
import InventoryTab from "./tabs/InventoryTab";
import OrdersTable from "./tabs/OrdersTable";
import CouponsTab from "./tabs/CouponsTab";
import CollectionsTab from "./tabs/CollectionsTab";

type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex gap-1 mt-6 p-1 bg-gray-100 rounded-lg w-fit mx-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            px-4 py-2 rounded-md font-medium text-sm
            transition-all duration-200 ease-in-out
            relative overflow-hidden
            ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }
          `}
        >
          <span className="relative z-10">{tab}</span>
          {activeTab === tab && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-md" />
          )}
        </button>
      ))}
    </div>
  );
};
export default Tabs;

export const TabContent = ({ activeTab }: { activeTab: string }) => {
  const {
    orders,
    users,
    inventory,
    refetch,
    setOrders,
    setUsers,
    setInventory,
    setRefetch,
  } = useAppData();

  useEffect(() => {
    // Replace with real API calls
    if (activeTab === "Orders" && orders.length === 0) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }
    if (activeTab === "Users" && users.length === 0) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
    if (activeTab === "Inventory" && inventory.length === 0) {
      fetch("/api/inventory")
        .then((res) => res.json())
        .then((data) => setInventory(data));
    }

    setRefetch(false);
  }, [activeTab, refetch]);

  switch (activeTab) {
    case "Orders":
      return <OrdersTable orders={orders} />;
    case "Users":
      return (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full mt-6">
          <h2 className="p-4 font-bold">Users</h2>

          <ul className="p-4">
            {users.map((u) => (
              <li key={u.id} className="p-2 border border-gray-200 rounded">
                {u.name}: {u.email}
              </li>
            ))}
          </ul>
        </div>
      );
    case "Inventory":
      return <InventoryTab inventory={inventory} />;
    case "Collections":
      return <CollectionsTab />;
    case "Settings":
      return (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full">
          <h2 className="p-4 font-bold">Settings</h2>
          <div className="p-4">
            Theme:{" "}
            <span className="border border-gray-200 rounded px-2 py-1 ml-2">
              Light
            </span>{" "}
            <span className="border border-gray-200 rounded px-2 py-1 ml-2">
              Dark
            </span>
          </div>
        </div>
      );
    case "Coupons":
      return <CouponsTab />;
    default:
      return null;
  }
};
