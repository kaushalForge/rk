"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSyringe, FaBaby } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { GiCow } from "react-icons/gi";
import axios from "axios";

interface Medicine {
  name: string;
  dateGiven?: string;
  dosage?: string;
  hasTaken?: boolean;
  note?: string;
}

interface Cow {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  isPregnant?: boolean;
  isSick?: boolean;
  milkProduction?: number;
  milkFat?: number;
  addedAt?: string;
  imported?: boolean;
  linkedCalves?: { _id: string; name: string }[];
  medicines?: Medicine[];
  image1?: string;
  image2?: string;
}

export default function CowDetailPage() {
  const { id } = useParams();
  const [cow, setCow] = useState<Cow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCow = async () => {
      try {
        const response = await axios.get(`/api/cows/${id}`);
        setCow(response.data.cow);
      } catch (err) {
        console.error("Failed to load cow:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCow();
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-6">Loading cow data...</p>
    );
  if (!cow)
    return <p className="text-center text-red-400 mt-6">Cow not found.</p>;

  return (
    <div className="p-6 container mx-auto text-gray-200 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#161b22]/70 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-lg">
        <img
          src={cow.image1 || "https://via.placeholder.com/400x300?text=Cow"}
          alt={cow.name}
          className="w-64 h-48 object-cover rounded-xl border border-gray-700"
        />
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <GiCow className="text-green-400" /> {cow.name}
          </h1>
          <p className="text-gray-400">
            Breed: <span className="text-white">{cow.breed || "N/A"}</span>
          </p>
          <p className="text-gray-400">
            Weight: <span className="text-white">{cow.weight || "?"} kg</span>
          </p>
          <p className="text-gray-400">
            Age: <span className="text-white">{cow.age || "?"} years</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {cow.isPregnant && (
              <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded-md text-sm">
                Pregnant 🍼
              </span>
            )}
            {cow.isSick && (
              <span className="bg-red-600/30 text-red-400 px-3 py-1 rounded-md text-sm">
                Sick 🤒
              </span>
            )}
            {cow.imported && (
              <span className="bg-blue-600/30 text-blue-400 px-3 py-1 rounded-md text-sm">
                Imported
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#161b22] p-3 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Milk Production</p>
          <p className="text-xl text-green-400 font-bold">
            {cow.milkProduction || "N/A"} L/day
          </p>
        </div>
        <div className="bg-[#161b22] p-3 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Milk Fat %</p>
          <p className="text-xl text-yellow-400 font-bold">
            {cow.milkFat || "N/A"}%
          </p>
        </div>
        <div className="bg-[#161b22] p-3 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Added To Farm</p>
          <p className="text-lg text-white font-semibold">
            {cow.addedAt ? new Date(cow.addedAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Medicines */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <FaSyringe className="text-cyan-400" />
          Medicine Records
        </h2>

        {cow.medicines?.length ? (
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
                {cow.medicines.map((med, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-[#1c2128]/70 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {med.name}
                    </td>
                    <td className="py-3 px-4">
                      {med.dateGiven ? (
                        med.dateGiven
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {med.dosage ? (
                        med.dosage
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
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
                      {med.note ? (
                        med.note
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
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

      {/* Linked Calves */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaBaby className="text-pink-400" /> Linked Calves
        </h2>
        {cow.linkedCalves?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {cow.linkedCalves.map((calf) => (
              <Link
                href={`/dashboard/calf/${calf._id}`}
                key={calf._id}
                className="bg-[#161b22] border border-gray-700 p-3 rounded-lg hover:shadow-pink-400/20 transition"
              >
                <p className="text-white font-semibold truncate">{calf.name}</p>
                <p className="text-gray-500 text-xs mt-1">View Details →</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-2">No linked calves found.</p>
        )}
      </div>
    </div>
  );
}
