// app/dashboard/reports/page.tsx
"use client";

import React, { useEffect, useState } from "react";

// 🧩 Components
import BasicInfoSection from "@/components/reportsLayouts/basicInfoReport/page";
import ReproductiveReport from "@/components/reportsLayouts/reproductionReport/page";
import MedicineReport from "@/components/reportsLayouts/medicineReport/page";
import ChartReports from "@/components/reportsLayouts/chartReport/page";

export default function Reports() {
  return (
    <div className="container mx-auto text-white p-4 sm:p-6 space-y-2 md:space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center bg-clip-text drop-shadow-lg">
        🧭 Farm Analytics Overview
      </h1>
      <BasicInfoSection />
      <ReproductiveReport />
      <MedicineReport />
      <ChartReports />

      <div className="text-center py-10 text-gray-400 text-sm">
        <p>
          Generated from <code>/api/reports</code> —{" "}
          <span className="text-cyan-400">Real-Time Cattle Analytics</span>
        </p>
        <p className="text-gray-500 mt-1">© 2025 Farm Analytics Dashboard</p>
      </div>
    </div>
  );
}
