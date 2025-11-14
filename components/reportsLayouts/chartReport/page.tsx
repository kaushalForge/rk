"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

interface BasicInfo {
  cowId: string;
  name: string;
  breed: string;
  milkProduction: number;
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

// Tooltip styles
const customTooltipStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  border: "1px solid #374151",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "0.8rem",
  padding: "6px 10px",
};

const PieCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "6px",
          color: "#fff",
          padding: "6px 10px",
          fontSize: "0.8rem",
          backdropFilter: "blur(5px)",
        }}
      >
        <p className="m-0">
          <span className="font-semibold">{name}</span>: {value}
        </p>
      </div>
    );
  }
  return null;
};

export default function ChartReports() {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ReportResponse>("/api/reports");
        setData(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-cyan-400 text-lg sm:text-xl">
        Loading reports...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-red-400 text-sm sm:text-base">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-gray-400 text-sm sm:text-base">
        No report data available.
      </div>
    );

  const report = data.reportData;
  const now = new Date();

  const nearCalving = report.reproductiveRecords.filter((r) => {
    const expected = new Date(r.expectedCalvingDate);
    const diffDays = (expected.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const recentlyCalved = report.reproductiveRecords.filter(
    (r) => r.calvingDate && new Date(r.calvingDate).getTime() < now.getTime()
  ).length;

  const fertilizedCows = report.reproductiveRecords.filter(
    (r) => r.isFertilityConfirmed
  ).length;

  const summaryData = [
    { name: "Total Cows", value: report.totalCows },
    { name: "Pregnant", value: report.totalPregnant },
    { name: "Fertilized", value: report.totalFertilized },
  ];

  const fertilityData = [
    { name: "Near Calving", value: nearCalving },
    { name: "Recently Calved", value: recentlyCalved },
    { name: "Fertilized", value: fertilizedCows },
  ];

  const milkProductionData = report.basicInfo.map((cow) => ({
    name: cow.name,
    milk: cow.milkProduction,
  }));

  return (
    <div className="text-gray-200 mt-10">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-100 text-left">
        📊 Chart Records
      </h2>

      <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
        <ChartCard title="Cow Population Overview">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={customTooltipStyle}
                cursor={{ fill: "transparent" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Proportion of Cow Conditions">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summaryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={{ fontSize: 10 }}
              >
                <Cell fill="#10b981" />
                <Cell fill="#3b82f6" />
                <Cell fill="#facc15" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip
                content={<PieCustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fertility & Calving Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fertilityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={{ fontSize: 10 }}
              >
                <Cell fill="#a78bfa" />
                <Cell fill="#60a5fa" />
                <Cell fill="#fbbf24" />
              </Pie>
              <Tooltip
                content={<PieCustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Milk Production by Cow (L/day)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={milkProductionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
              <YAxis stroke="#9ca3af" fontSize={10} />
              <Tooltip
                contentStyle={customTooltipStyle}
                cursor={{ fill: "transparent" }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="milk"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fertility Confirmation Analysis">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fertilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
              <YAxis stroke="#9ca3af" fontSize={10} />
              <Tooltip
                contentStyle={customTooltipStyle}
                cursor={{ fill: "transparent" }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="value" fill="#fbbf24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#121a24]/80 border border-gray-800 p-4 sm:p-5 md:p-6 rounded-xl shadow-md backdrop-blur-sm hover:border-cyan-500/50 transition duration-300">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-cyan-300 text-center tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
