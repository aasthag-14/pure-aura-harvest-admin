"use client";

import { InventoryItem } from "@/types/inventory";
import { Order } from "@/types/order";
import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AppDataContextType = {
  orders: Order[];
  users: User[];
  inventory: InventoryItem[];
  refetch: boolean;
  setOrders: (orders: Order[]) => void;
  setUsers: (users: User[]) => void;
  setInventory: (inventory: InventoryItem[]) => void;
  setRefetch: (refetch: boolean) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [refetch, setRefetch] = useState(false);

  return (
    <AppDataContext.Provider
      value={{
        orders,
        users,
        inventory,
        setOrders,
        setUsers,
        setInventory,
        refetch,
        setRefetch,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context)
    throw new Error("useAppData must be used within AppDataProvider");
  return context;
};
