"use client";
import { AppDataProvider } from "@/context/AppDataContext";
import React, { useEffect, useState } from "react";
import Tabs, { TabContent } from "./Tabs";
import { useSearchParams } from "next/navigation";
import { TABS } from "@/constants";

const Admin = () => {
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const formattedTab = TABS.find(
    (t) => t.toLowerCase() === tabFromUrl?.toLowerCase()
  );
  const [activeTab, setActiveTab] = useState(formattedTab || "Orders");

  useEffect(() => {
    if (tabFromUrl) {
      const formattedTab = TABS.find(
        (t) => t.toLowerCase() === tabFromUrl.toLowerCase()
      );
      if (formattedTab) setActiveTab(formattedTab);
    }
  }, [tabFromUrl, activeTab]);

  return (
    <AppDataProvider>
      <div className="md:p-8">
        {activeTab && (
          <>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabContent activeTab={activeTab} />
          </>
        )}
      </div>
    </AppDataProvider>
  );
};

export default Admin;
