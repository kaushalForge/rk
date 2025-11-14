"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                                Type Definitions                            */
/* -------------------------------------------------------------------------- */
interface MedicineData {
  _id: string;
  name: string;
  dateGiven: string;
  dosage: string;
  hasTaken: boolean;
  note: string;
}

interface MedicineRecord {
  _id: string;
  cowId: string;
  name: string;
  medicines: MedicineData[];
}

/* -------------------------------------------------------------------------- */
/*                                 Date Formatter                             */
/* -------------------------------------------------------------------------- */
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* -------------------------------------------------------------------------- */
/*                                 Main Component                             */
/* -------------------------------------------------------------------------- */
const MedicineReport: React.FC = () => {
  const [records, setRecords] = useState<MedicineRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/reports");
        setRecords(res.data?.reportData?.medicineRecords || []);
      } catch (err) {
        console.error("Error fetching medicine data:", err);
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

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-100">
        💊 Medicine Records
      </h2>

      <div className="overflow-x-auto md:rounded-xl shadow-lg bg-[#0f1118] border border-gray-700">
        <table className="min-w-full border border-gray-700 text-gray-300 text-xs">
          <thead className="bg-[#1a1e28] uppercase">
            <tr>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Cow ID
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Cow Name
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Medicines
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Dates
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Dosages
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Status
              </th>
              <th className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                Notes
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-[#1b2232] transition-colors duration-200"
                >
                  <td className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap text-cyan-300 font-medium">
                    <Link href={`/dashboard/cow/${record._id}`}>
                      {record.cowId}
                    </Link>
                  </td>
                  <td className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap text-gray-200">
                    {record.name}
                  </td>

                  {/* Medicines */}
                  <td className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap text-yellow-300">
                    <div className="divide-y divide-gray-700">
                      {record.medicines.map((m, i) => (
                        <div key={m._id} className="py-1">
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap text-blue-300">
                    <div className="divide-y divide-gray-700">
                      {record.medicines.map((m) => (
                        <div key={m._id} className="py-1">
                          {formatDate(m.dateGiven)}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Dosages */}
                  <td className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap text-lime-300">
                    <div className="divide-y divide-gray-700">
                      {record.medicines.map((m) => (
                        <div key={m._id} className="py-1">
                          {m.dosage}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Has Taken */}
                  <td className="py-2 px-3 border border-gray-700 text-center whitespace-nowrap">
                    <div className="divide-y divide-gray-700">
                      {record.medicines.map((m) => (
                        <div key={m._id} className="py-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              m.hasTaken
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                          >
                            {m.hasTaken ? "Yes" : "No"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Notes */}
                  <td className="py-2 px-3 border border-gray-700 text-left text-gray-400">
                    <div className="divide-y divide-gray-700">
                      {record.medicines.map((m) => (
                        <div
                          key={m._id}
                          className="py-1 truncate max-w-[180px]"
                        >
                          {m.note || "-"}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-400 italic"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default MedicineReport;
