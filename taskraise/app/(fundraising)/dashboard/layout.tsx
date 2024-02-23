"use client";
import DashboardNavigationBar from "@/components/dashboard/DashboardNavigationBar";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNavigationBar />
      <div className="px-24 py-10">{children}</div>
    </div>
  );
}

export default DashboardLayout;
