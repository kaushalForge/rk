import React from "react";
import Sidebar from "@/components/dashboardSidebar/page"; // Make sure you create this component
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
