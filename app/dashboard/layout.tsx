"use client"

import React, { ReactNode, useState } from "react";
import Sidebar from "@/components/dashboardSidebar/page";
import { FaBars, FaTimes } from "react-icons/fa";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      {/* Sidebar for large screens */}
      <div className="hidden md:flex w-64 fixed top-0 left-0 h-screen border-r border-gray-800">
        <Sidebar />
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0d1117] z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Toggle button for small screens */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white text-2xl"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6 text-white overflow-y-auto max-h-screen w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
