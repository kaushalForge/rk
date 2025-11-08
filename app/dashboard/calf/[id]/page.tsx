"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSyringe, FaBaby } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import Link from "next/link";
import axios from "axios";

interface Medicine {
  name: string;
  dateGiven?: string;
  dosage?: string;
  hasTaken?: boolean;
  note?: string;
}

interface Calf {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  isPregnant?: boolean;
  isSick?: boolean;
  addedAt?: string;
  imported?: boolean;
  medicines?: Medicine[];
  image1?: string;
  image2?: string;
}

export default function CalfDetailPage() {
  const { id } = useParams();
  const [calf, setCalf] = useState<Calf | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalf = async () => {
      try {
        const response = await axios.get(`/api/calves/${id}`);
        const data = response.data.calf;

        // Fix boolean naming from DB
        if (data) {
          data.isPregnant = data.isPregenant ?? false;
          data.isSick = data.isSick ?? false;
        }

        setCalf(data);
      } catch (err) {
        console.error("Failed to load calf:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalf();
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-6">Loading calf data...</p>
    );

  if (!calf)
    return <p className="text-center text-red-400 mt-6">Calf not found.</p>;

  return (
    <div className="p-6 container mx-auto text-gray-200 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#161b22]/70 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-lg">
        <img
          src={calf.image1 || "https://via.placeholder.com/400x300?text=Calf"}
          alt={calf.name}
          className="w-64 h-48 object-cover rounded-xl border border-gray-700"
        />
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <GiCow className="text-green-400" /> {calf.name}
          </h1>
          <p className="text-gray-400">
            Breed: <span className="text-white">{calf.breed || "N/A"}</span>
          </p>
          <p className="text-gray-400">
            Weight: <span className="text-white">{calf.weight ?? "?"} kg</span>
          </p>
          <p className="text-gray-400">
            Age: <span className="text-white">{calf.age ?? "?"} years</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {calf.isPregnant && (
              <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded-md text-sm">
                Pregnant 🍼
              </span>
            )}
            {calf.isSick && (
              <span className="bg-red-600/30 text-red-400 px-3 py-1 rounded-md text-sm">
                Sick 🤒
              </span>
            )}
            {calf.imported && (
              <span className="bg-blue-600/30 text-blue-400 px-3 py-1 rounded-md text-sm">
                Imported
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#161b22] p-3 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Weight</p>
          <p className="text-xl text-green-400 font-bold">
            {calf.weight ?? "N/A"} kg
          </p>
        </div>
        <div className="bg-[#161b22] p-3 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Added To Farm</p>
          <p className="text-lg text-white font-semibold">
            {calf.addedAt ? new Date(calf.addedAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Medicines */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <FaSyringe className="text-cyan-400" /> Medicine Records
        </h2>
        {calf.medicines?.length ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-lg bg-[#0d1117]/60 backdrop-blur-md">
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr className="bg-[#161b22] text-gray-300 uppercase text-xs tracking-wider border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Date Given</th>
                  <th className="py-3 px-4 text-left">Dosage</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {calf.medicines.map((med, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-[#1c2128]/70 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {med.name}
                    </td>
                    <td className="py-3 px-4">
                      {med.dateGiven ? (
                        new Date(med.dateGiven).toLocaleDateString()
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {med.dosage || <span className="text-gray-500">N/A</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          med.hasTaken
                            ? "bg-green-500/10 text-green-400 border border-green-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            med.hasTaken ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></span>
                        {med.hasTaken ? "Taken" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 italic">
                      {med.note || <span className="text-gray-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 mt-3">No medicine records found.</p>
        )}
      </div>
    </div>
  );
}
