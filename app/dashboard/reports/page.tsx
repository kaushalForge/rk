// app/dashboard/reports/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import BasicInfoSection from "@/components/reportsLayouts/basicInfo/page";
import ReproductiveReport from "@/components/reportsLayouts/reproductiveData/page";
import HealthSummary from "@/components/reportsLayouts/healthSummary/page";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GiCow } from "react-icons/gi";
import { FaHeartbeat, FaStethoscope, FaTint, FaChartPie } from "react-icons/fa";

interface BasicInfo {
  cowId: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  milkProduction: number;
  isSick: boolean;
  isPregnant: boolean;
}

interface ReproductiveRecord {
  breedingDate: string;
  embryonicDeathDate: string;
  expectedCalvingDate: string;
  earlyDewormingDate: string;
  preCalvingMetabolicSupplimentDate: string;
  lateDewormingDate: string;
  calvingDate: string | null;
  calvingCount: number;
  isFertilityConfirmed: boolean;
}

interface ReportResponse {
  success: boolean;
  reportData: {
    basicInfo: BasicInfo[];
    reproductiveRecords: ReproductiveRecord[];
    totalCows: number;
    totalPregnant: number;
    totalFertilized: number;
    totalSick: number;
    averageMilkProduced: number;
  };
}

export default function Reports() {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ReportResponse>("/api/reports");
        setData(res.data);
      } catch (err: any) {
        console.error("❌ Failed to fetch reports:", err);
        setError(err.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-cyan-400 text-xl">
        Loading reports...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-red-400">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-gray-400">
        No report data available.
      </div>
    );

  const report = data.reportData;
  const cows = report.basicInfo;
  const records = report.reproductiveRecords;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-4 sm:p-6 space-y-10">
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-center bg-clip-text drop-shadow-lg">
        🧭 Farm Analytics Overview
      </h1>

      <BasicInfoSection />
      <ReproductiveReport />
      <HealthSummary />
      {/* SECTION 3 — HEALTH SUMMARY */}

      {/* <div className="rounded-2xl border border-gray-800 bg-[#121a24]/80 shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-500/30 to-emerald-600/30 border-b border-gray-700 flex items-center gap-3">
          <FaStethoscope className="text-3xl text-green-400" />
          <h2 className="text-2xl font-semibold text-green-300">
            Pregnancy & Health Summary
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base text-gray-200">
            <thead className="bg-[#0e1624]/90 text-green-400 uppercase">
              <tr>
                <th className="p-3">Total Cows</th>
                <th className="p-3">Pregnant</th>
                <th className="p-3">Fertilized</th>
                <th className="p-3">Sick</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800 hover:bg-[#1b2532]/80">
                <td className="p-3 text-cyan-300">{report.totalCows}</td>
                <td className="p-3 text-green-400">{report.totalPregnant}</td>
                <td className="p-3 text-emerald-300">
                  {report.totalFertilized}
                </td>
                <td className="p-3 text-red-400">{report.totalSick}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}

      {/* SECTION 4 — MILK PRODUCTION */}
      <div className="rounded-2xl border border-gray-800 bg-[#10161e]/80 shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-400/30 to-cyan-600/30 border-b border-gray-700 flex items-center gap-3">
          <FaTint className="text-3xl text-cyan-400" />
          <h2 className="text-2xl font-semibold text-cyan-300">
            Milk Production Statistics
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base text-gray-200">
            <thead className="bg-[#0e1624]/90 text-cyan-400 uppercase">
              <tr>
                <th className="p-3">Average (L/day)</th>
                <th className="p-3">Highest</th>
                <th className="p-3">Lowest</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800 hover:bg-[#1b2532]/80">
                <td className="p-3 text-cyan-300">
                  {report.averageMilkProduced}
                </td>
                <td className="p-3 text-green-400">
                  {Math.max(...cows.map((c) => c.milkProduction))}
                </td>
                <td className="p-3 text-red-400">
                  {Math.min(...cows.map((c) => c.milkProduction))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CHARTS */}
      <div className="rounded-2xl border border-gray-800 bg-[#0f141b]/80 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-6 flex items-center gap-3">
          <FaChartPie className="text-pink-400" /> Cow Health & Reproductive
          Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie */}
          <div className="bg-[#10161e]/70 rounded-xl p-4 border border-gray-700 shadow-inner">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Pregnant", value: report.totalPregnant },
                    { name: "Fertilized", value: report.totalFertilized },
                    {
                      name: "Healthy",
                      value: report.totalCows - report.totalSick,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#3B82F6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    borderRadius: "8px",
                    border: "1px solid #1F2937",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="bg-[#10161e]/70 rounded-xl p-4 border border-gray-700 shadow-inner">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cows}>
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  tick={{ fill: "#E5E7EB" }}
                />
                <YAxis stroke="#94A3B8" tick={{ fill: "#E5E7EB" }} />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    borderRadius: "8px",
                    border: "1px solid #1F2937",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="milkProduction"
                  fill="#06B6D4"
                  radius={[8, 8, 0, 0]}
                />
                <Bar dataKey="weight" fill="#F43F5E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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
