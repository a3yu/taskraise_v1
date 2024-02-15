"use client";
import DashboardNavigationBar from "@/components/dashboard/DashboardNavigationBar";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNavigationBar />
      {children}
    </div>
  );
}

export default DashboardLayout;
