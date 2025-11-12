"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface ReproductiveRecord {
  _id: string;
  cowId: string;
  name: string;
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

interface cowIdDetails {
  cowId: string;
}

// Calculate remaining days from today
const getRemainingDays = (dateStr: string) => {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

// Format date as YYYY-MM-DD
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

const ReproductiveReport: React.FC = () => {
  const [records, setRecords] = useState<ReproductiveRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/reports");
        setRecords(res.data?.reportData?.reproductiveRecords || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const indexLast = currentPage * recordsPerPage;
  const indexFirst = indexLast - recordsPerPage;
  const currentRecords = records.slice(indexFirst, indexLast);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const formatDateWithDays = (dateStr: string) => {
    const days = getRemainingDays(dateStr);
    return `${formatDate(dateStr)} (${days} days)`;
  };

  return (
    <div className="mt-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">🗓️Date Info</h1>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-[#0f1118] border border-gray-700">
        <table className="min-w-full border border-gray-700 text-gray-300 text-xs">
          <thead className="bg-[#1a1e28] text-gray-200 uppercase">
            <tr>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Cod Id
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Breeding
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Embryonic Death
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Expected Calving
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Early Deworming
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Metabolic Supplement
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Late Deworming
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Calves Count
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center">
                Fertility
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((r, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#21252f] transition-colors duration-200"
              >
                <td className="py-1 px-3 border border-gray-700 text-center text-cyan-300">
                  <Link href={`/dashboard/cow/${r._id}`}>{r.cowId}</Link>
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-cyan-300">
                  {formatDateWithDays(r.breedingDate)}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-gray-400">
                  {formatDateWithDays(r.embryonicDeathDate)}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-yellow-300">
                  {formatDateWithDays(r.expectedCalvingDate)}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-blue-300">
                  {formatDateWithDays(r.earlyDewormingDate)}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-lime-300">
                  {formatDateWithDays(r.preCalvingMetabolicSupplimentDate)}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-purple-300">
                  {formatDateWithDays(r.lateDewormingDate)}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-orange-300">
                  {r.calvingCount}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      r.isFertilityConfirmed
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-700/20 text-gray-500"
                    }`}
                  >
                    {r.isFertilityConfirmed ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {records.length > recordsPerPage && (
        <div className="flex justify-center gap-2 my-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-300 text-sm">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReproductiveReport;
