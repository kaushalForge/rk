"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { GiCow, GiMilkCarton } from "react-icons/gi";
import { FaSyringe, FaWeight } from "react-icons/fa";
import axios from "axios";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#a78bfa"];
type Period = "daily" | "weekly" | "monthly";

interface MilkData {
  cowId?: string;
  milk: number;
  month?: string;
}
interface HealthData {
  healthy?: number;
  sick?: number;
  recovering?: number;
  total?: number;
}
interface CalfData {
  calfId?: string;
  weight: number;
  month?: string;
}
interface MedicinesData {
  cowId?: string;
  antibiotics: number;
  vitamins: number;
  month?: string;
}
interface PregnancyData {
  pregnant: number;
  nonPregnant: number;
}
interface FarmStats {
  totalCows: number;
  monthlyMilk: number;
  medicinesAdministered: number;
  avgCalfWeight: number;
}

const ReportsPage = () => {
  const [tab, setTab] = useState<"cow" | "calf" | "combo">("cow");
  const [period, setPeriod] = useState<Period>("daily");

  const [milkData, setMilkData] = useState<MilkData[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [calfData, setCalfData] = useState<CalfData[]>([]);
  const [medicinesData, setMedicinesData] = useState<MedicinesData[]>([]);
  const [pregnancyData, setPregnancyData] = useState<PregnancyData[]>([]);
  const [stats, setStats] = useState<FarmStats>({
    totalCows: 0,
    monthlyMilk: 0,
    medicinesAdministered: 0,
    avgCalfWeight: 0,
  });

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get(`/api/reports/cow`, { params: { period } });
        const data = res.data;

        setMilkData(data.milkData || []);
        setHealthData(data.healthData || []);
        setPregnancyData(data.pregnancyData || []);
        setMedicinesData(data.medicinesData || []);
        // optional stats if available from backend
        setStats(data.stats || stats);
      } catch (error: any) {
        console.error("Failed to fetch reports:", error?.response || error.message);
      }
    }
    fetchReports();
  }, [period]);

  // Prepare Pie Data
  const healthPieData = [
    {
      name: "Healthy",
      value: healthData.reduce((acc, h) => acc + (h.healthy || 0), 0),
    },
    {
      name: "Sick",
      value: healthData.reduce((acc, h) => acc + (h.sick || 0), 0),
    },
    {
      name: "Recovering",
      value: healthData.reduce((acc, h) => acc + (h.recovering || 0), 0),
    },
  ];

  const pregnancyPieData = [
    { name: "Pregnant", value: pregnancyData.reduce((acc, p) => acc + (p.pregnant || 0), 0) },
    { name: "Not Pregnant", value: pregnancyData.reduce((acc, p) => acc + (p.nonPregnant || 0), 0) },
  ];

  return (
    <div className="p-6 min-h-screen text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Farm Reports Dashboard</h1>

      {/* Period Toggle */}
      <div className="flex gap-4 mb-6">
        {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              period === p ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {(["cow", "calf", "combo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} Reports
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
          <GiCow className="text-3xl text-green-400" />
          <div>
            <p className="text-gray-400 text-sm">Total Cows</p>
            <p className="text-xl font-bold">{stats.totalCows}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
          <GiMilkCarton className="text-3xl text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Milk Production</p>
            <p className="text-xl font-bold">{stats.monthlyMilk} L</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
          <FaSyringe className="text-3xl text-red-400" />
          <div>
            <p className="text-gray-400 text-sm">Medicines Administered</p>
            <p className="text-xl font-bold">{stats.medicinesAdministered}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
          <FaWeight className="text-3xl text-purple-400" />
          <div>
            <p className="text-gray-400 text-sm">Avg Calf Weight</p>
            <p className="text-xl font-bold">{stats.avgCalfWeight} kg</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === COW === */}
        {tab === "cow" && (
          <>
            <div className="bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Milk Production</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={milkData}>
                  <CartesianGrid stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip wrapperStyle={{ backgroundColor: "#111827", color: "#f9fafb" }} />
                  <Legend wrapperStyle={{ color: "#f9fafb" }} />
                  <Line type="monotone" dataKey="milk" stroke="#4ade80" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Health Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={{ fill: "#f9fafb" }}
                  >
                    {healthPieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ backgroundColor: "#111827", color: "#f9fafb" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* === CALF === */}
        {tab === "calf" && (
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Calf Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calfData}>
                <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip wrapperStyle={{ backgroundColor: "#111827", color: "#f9fafb" }} />
                <Legend wrapperStyle={{ color: "#f9fafb" }} />
                <Bar dataKey="weight" fill="#60a5fa" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* === COMBO === */}
        {tab === "combo" && (
          <>
            <div className="bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Pregnancy Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pregnancyPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={{ fill: "#f9fafb" }}
                  >
                    {pregnancyPieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ backgroundColor: "#111827", color: "#f9fafb" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Medicines Administered</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={medicinesData} stackOffset="expand">
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    stroke="#9ca3af"
                  />
                  <Tooltip wrapperStyle={{ backgroundColor: "#111827", color: "#f9fafb" }} />
                  <Legend wrapperStyle={{ color: "#f9fafb" }} />
                  <Bar dataKey="antibiotics" stackId="a" fill="#f87171" />
                  <Bar dataKey="vitamins" stackId="a" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
