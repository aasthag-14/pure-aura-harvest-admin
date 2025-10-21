"use client";

import { TABS } from "@/constants";
import { useAppData } from "@/context/AppDataContext";
import { useEffect, useState } from "react";
import InventoryTab from "./tabs/InventoryTab";
import OrdersTable from "./tabs/OrdersTable";
import CouponsTab from "./tabs/CouponsTab";
import CollectionsTab from "./tabs/CollectionsTab";
import {
  OrdersShimmer,
  UsersShimmer,
  InventoryShimmer,
  CollectionsShimmer,
  CouponsShimmer,
  SettingsShimmer,
} from "./loaders/ShimmerLoader";
import { useRouter } from "next/navigation";

type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const router = useRouter();

  return (
    <div className="mt-6 p-1 bg-gray-100 rounded-lg w-full sm:max-w-fit mx-auto overflow-x-scroll">
      <div className="flex flex-nowrap gap-1 min-w-max w-[80vw] sm:w-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              const param = tab.toLowerCase();
              router.replace(`?tab=${param}`);
              setActiveTab(tab);
            }}
            className={`
            px-3 sm:px-4 py-2 rounded-md font-medium text-xs sm:text-sm flex-none
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "Orders" && (orders.length === 0 || refetch)) {
          const res = await fetch("/api/orders");
          const data = await res.json();
          setOrders(data);
        }
        if (activeTab === "Users" && (users.length === 0 || refetch)) {
          const res = await fetch("/api/users");
          const data = await res.json();
          setUsers(data);
        }
        if (activeTab === "Inventory" && (inventory.length === 0 || refetch)) {
          const res = await fetch("/api/inventory");
          const data = await res.json();
          setInventory(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setRefetch(false);
      }
    };

    fetchData();
  }, [
    activeTab,
    refetch,
    orders.length,
    users.length,
    inventory.length,
    setOrders,
    setUsers,
    setInventory,
    setRefetch,
  ]);

  if (loading || refetch) {
    switch (activeTab) {
      case "Orders":
        return <OrdersShimmer />;
      case "Users":
        return <UsersShimmer />;
      case "Inventory":
        return <InventoryShimmer />;
      case "Collections":
        return <CollectionsShimmer />;
      case "Settings":
        return <SettingsShimmer />;
      case "Coupons":
        return <CouponsShimmer />;
      default:
        return null;
    }
  }
  switch (activeTab) {
    case "Orders":
      return <OrdersTable orders={orders} />;
    case "Users":
      return (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full mt-6  w-[90vw] md:w-full">
          <h2 className="p-4 font-bold">Users</h2>

          <ul className="p-4">
            {users.map((u) => (
              <li key={u.id} className="p-2 border border-gray-200 rounded">
                {u.email}
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
