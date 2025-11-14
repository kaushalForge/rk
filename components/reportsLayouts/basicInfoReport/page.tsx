"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface BasicInfo {
  cowId: string;
  name: string;
  milkProduction: number;
  isPregnant: boolean;
}

interface ReportData {
  basicInfo: BasicInfo[];
  totalCows: number;
  totalPregnant: number;
  totalFertilized: number;
  averageMilkProduced: number;
}

const CowReport: React.FC = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("/api/reports");
        if (res.data.success) setReport(res.data.reportData);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading)
    return (
      <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">
        Loading...
      </p>
    );
  if (!report)
    return (
      <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">
        No data available.
      </p>
    );

  const {
    basicInfo,
    totalCows,
    totalPregnant,
    totalFertilized,
    averageMilkProduced,
  } = report;
  const cowsToShow = showAll ? basicInfo : basicInfo.slice(0, 8);

  return (
    <div className="mt-1">
      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Total Cows", value: totalCows },
          { label: "Pregnant", value: totalPregnant },
          { label: "Fertilized", value: totalFertilized },
          { label: "Avg Milk (L/day)", value: averageMilkProduced.toFixed(2) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1b1f27] border border-gray-700 rounded-2xl p-1 sm:p-4 text-center text-white shadow-md"
          >
            <h3 className="text-gray-400 text-xs sm:text-sm">{stat.label}</h3>
            <p className="text-lg sm:text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-start">
        <h2 className="text-xl sm:text-3xl font-semibold sm:py-2">
          🐄 Basic Info
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto md:rounded-xl shadow-lg bg-[#0f1118] border border-gray-700">
        <table className="min-w-full border border-gray-700 text-gray-300 text-xs sm:text-sm md:text-base">
          <thead className="bg-[#1a1e28] text-gray-200 uppercase md:tracking-wider">
            <tr>
              {["Cow Id", "Name", "Milk (L/day)", "Pregnant"].map((col) => (
                <th
                  key={col}
                  className="py-2 px-2 sm:py-3 sm:px-4 border border-gray-700 text-center font-medium"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cowsToShow.map((cow) => (
              <tr
                key={cow.cowId}
                className="hover:bg-[#21252f] transition-colors duration-200 cursor-pointer"
              >
                <td className="py-2 sm:py-2 px-2 sm:px-4 border border-gray-700 text-center whitespace-nowrap">
                  {cow.cowId}
                </td>
                <td className="py-2 sm:py-2 px-2 sm:px-4 border border-gray-700 text-center whitespace-nowrap">
                  {cow.name}
                </td>

                <td className="py-2 sm:py-2 px-2 sm:px-4 border border-gray-700 text-center whitespace-nowrap">
                  {cow.milkProduction}
                </td>
                <td className="py-2 sm:py-2 px-2 sm:px-4 border border-gray-700 text-center whitespace-nowrap">
                  <span
                    className={`px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      cow.isPregnant
                        ? "bg-green-600/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {cow.isPregnant ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More Button */}
      {basicInfo.length > 8 && (
        <div className="flex justify-center mt-3 sm:mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-cyan-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-cyan-500 transition-colors text-sm sm:text-base"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CowReport;
