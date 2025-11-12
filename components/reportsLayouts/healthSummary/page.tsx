"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStethoscope } from "react-icons/fa";

/* -------------------------------------------------------------------------- */
/*                                Type Definitions                            */
/* -------------------------------------------------------------------------- */
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
  embryonicDeathDate: string | null;
  expectedCalvingDate: string;
  earlyDewormingDate: string;
  preCalvingMetabolicSupplimentDate: string;
  lateDewormingDate: string;
  calvingDate: string | null;
  calvingCount: number;
  isFertilityConfirmed: boolean;
}

interface ReportResponse {
  basicInfo: BasicInfo[];
  reproductiveRecords: ReproductiveRecord[];
  totalCows: number;
  totalPregnant: number;
  totalFertilized: number;
  totalSick: number;
  averageMilkProduced: number;
}

/* -------------------------------------------------------------------------- */
/*                                 Main Page                                  */
/* -------------------------------------------------------------------------- */
export default function Page() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/reports");
        setReport(res.data.reportData);
      } catch (err: any) {
        console.error("Error fetching report:", err);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        Loading report data...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        {error}
      </div>
    );

  if (!report)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        No report data available
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-[#0d1117] text-gray-200">
      {/* SECTION — HEALTH SUMMARY */}
      <div className="rounded-2xl border border-gray-800 bg-[#121a24]/80 shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="p-4 bg-gradient-to-r from-green-500/30 to-emerald-600/30 border-b border-gray-700 flex items-center gap-3">
          <FaStethoscope className="text-3xl text-green-400" />
          <h2 className="text-2xl font-semibold text-green-300">
            Pregnancy & Health Summary
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-gray-300">
            <thead className="bg-[#1a1e28] text-gray-200 uppercase text-sm tracking-wider">
              <tr>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Total Cows
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Pregnant
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Fertilized
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Sick
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-medium">
                  Avg. Milk (L/day)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[#21252f] transition-colors duration-200">
                <td className="py-2 px-4 border border-gray-700 text-center">
                  {report.totalCows}
                </td>
                <td className="py-2 px-4 border border-gray-700 text-center">
                  {report.totalPregnant}
                </td>
                <td className="py-2 px-4 border border-gray-700 text-center">
                  {report.totalFertilized}
                </td>
                <td className="py-2 px-4 border border-gray-700 text-center">
                  {report.totalSick}
                </td>
                <td className="py-2 px-4 border border-gray-700 text-center">
                  {report.averageMilkProduced.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
