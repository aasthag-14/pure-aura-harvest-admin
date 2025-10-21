"use client";

import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { User } from "@/types/user";
import { createContext, ReactNode, useContext, useState } from "react";

type AppDataContextType = {
  orders: Order[];
  users: User[];
  inventory: Product[];
  refetch: boolean;
  setOrders: (orders: Order[]) => void;
  setUsers: (users: User[]) => void;
  setInventory: (inventory: Product[]) => void;
  setRefetch: (refetch: boolean) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
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
