"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "@/components/dashboardSidebar/page";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-row bg-[#151920]">
      <Sidebar />
      <main className="flex-1 w-full text-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
