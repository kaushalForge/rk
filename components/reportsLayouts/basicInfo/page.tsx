"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

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

interface ReportData {
  basicInfo: BasicInfo[];
  totalCows: number;
  totalPregnant: number;
  totalFertilized: number;
  totalSick: number;
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
        if (res.data.success) {
          setReport(res.data.reportData);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading)
    return <p className="text-gray-400 text-center mt-6">Loading...</p>;
  if (!report)
    return <p className="text-gray-400 text-center mt-6">No data available.</p>;

  const {
    basicInfo,
    totalCows,
    totalPregnant,
    totalFertilized,
    totalSick,
    averageMilkProduced,
  } = report;

  // Decide how many cows to show
  const cowsToShow = showAll ? basicInfo : basicInfo.slice(0, 8);

  return (
    <>
      <div className="mt-8 px-4">
        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Cows", value: totalCows },
            { label: "Pregnant", value: totalPregnant },
            { label: "Fertilized", value: totalFertilized },
            { label: "Sick", value: totalSick },
            {
              label: "Avg Milk (L/day)",
              value: averageMilkProduced.toFixed(2),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1b1f27] border border-gray-700 rounded-2xl p-4 text-center text-white shadow-md"
            >
              <h3 className="text-gray-400 text-sm">{stat.label}</h3>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-left">
          <h1 className="text-3xl font-semibold py-3">🐄Basic Info</h1>
        </div>
        {/* Table with Borders */}
        <div className="overflow-x-auto rounded-xl shadow-lg bg-[#0f1118] border border-gray-700">
          <table className="min-w-full border border-gray-700 text-gray-300">
            <thead className="bg-[#1a1e28] text-gray-200 uppercase text-sm tracking-wider">
              <tr className="cursor-pointer">
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Name
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  ID
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Breed
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Age (yrs)
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Weight (kg)
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Milk (L/day)
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Pregnant
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Health
                </th>
              </tr>
            </thead>
            <tbody>
              {cowsToShow.map((cow) => (
                <tr
                  key={cow.cowId}
                  className="hover:bg-[#21252f] transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    {cow.name}
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    {cow.cowId}
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    {cow.breed}
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    {cow.age}
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    {cow.weight}
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    {cow.milkProduction}
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cow.isPregnant
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {cow.isPregnant ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border border-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cow.isSick
                          ? "bg-red-600/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {cow.isSick ? "Sick" : "Healthy"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More Button */}
        {basicInfo.length > 8 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-500 transition-colors"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CowReport;
