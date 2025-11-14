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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const formattedDate = dateStr.slice(0, 10);

    return formattedDate;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        🗓️ Breeding Info
      </h2>
      <div className="overflow-x-auto md:rounded-xl shadow-lg bg-[#0f1118] border border-gray-700">
        <table className="min-w-full border border-gray-700 text-gray-300 text-xs">
          <thead className="bg-[#1a1e28] text-gray-200 uppercase">
            <tr>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Cow Id
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Breeding
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Embryonic Death
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Expected Calving
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Early Deworming
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Metabolic Supplement
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Late Deworming
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Calves Count
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
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
                <td className="py-1 underline px-3 border border-gray-700 text-center text-cyan-300 whitespace-nowrap">
                  <Link href={`/dashboard/cow/${r._id}`}>{r.cowId}</Link>
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-cyan-300 whitespace-nowrap">
                  {(r.breedingDate !== null && formatDate(r.breedingDate)) ||
                    "N/A"}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-gray-400 whitespace-nowrap">
                  {(r.embryonicDeathDate !== null &&
                    formatDate(r.embryonicDeathDate)) ||
                    "N/A"}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-yellow-300 whitespace-nowrap">
                  {(r.expectedCalvingDate !== null &&
                    formatDate(r.expectedCalvingDate)) ||
                    "N/A"}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-blue-300 whitespace-nowrap">
                  {(r.earlyDewormingDate !== null &&
                    formatDate(r.earlyDewormingDate)) ||
                    "N/A"}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-lime-300 whitespace-nowrap">
                  {(r.preCalvingMetabolicSupplimentDate !== null &&
                    formatDate(r.preCalvingMetabolicSupplimentDate)) ||
                    "N/A"}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-purple-300 whitespace-nowrap">
                  {(r.lateDewormingDate !== null &&
                    formatDate(r.lateDewormingDate)) ||
                    "N/A"}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center text-orange-300 whitespace-nowrap">
                  {r.calvingCount}
                </td>
                <td className="py-1 px-3 border border-gray-700 text-center whitespace-nowrap">
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
