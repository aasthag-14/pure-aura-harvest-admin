"use client";
import { AppDataProvider } from "@/context/AppDataContext";
import React, { useState } from "react";
import Tabs, { TabContent } from "./Tabs";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Orders");

  return (
    <AppDataProvider>
      <div className="md:p-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabContent activeTab={activeTab} />
      </div>
    </AppDataProvider>
  );
};

export default Admin;
