"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GiCow } from "react-icons/gi";
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
  calfId: string;
  image1: string;
  image2?: string;
  isPregnant?: boolean;
  medicines?: Medicine[];
}

export default function CalfDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [calf, setCalf] = useState<Calf | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<"image1" | "image2">(
    "image1"
  );

  useEffect(() => {
    const fetchCalf = async () => {
      try {
        const response = await axios.get(`/api/calves/${id}`);
        const data = response.data.calf;
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
      <div className="flex min-h-screen w-full items-center justify-center mt-6">
        <p className="text-orange-600 font-semibold text-xl">
          Loading calf data...
        </p>
      </div>
    );

  if (!calf)
    return <p className="text-center text-red-400 mt-6">Calf not found.</p>;

  return (
    <div className="p-6 container mx-auto text-gray-200 space-y-10">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row items-center gap-6 bg-[#161b22]/70 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-lg">
        {/* Update Button */}
        <button
          onClick={() => router.push(`/dashboard/update/calf/${calf._id}`)}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          Update
        </button>

        {/* Image Toggle */}
        <div className="relative">
          <img
            src={
              currentImage === "image1"
                ? calf.image1
                : calf.image2 || calf.image1
            }
            alt={calf.name}
            className="w-64 h-48 object-cover rounded-xl border border-gray-700"
          />

          {calf.image2 && (
            <button
              onClick={() =>
                setCurrentImage(currentImage === "image1" ? "image2" : "image1")
              }
              className="absolute bottom-2 right-2 w-12 h-6 bg-orange-600/70 rounded-full p-0.5 flex items-center transition-colors duration-300"
            >
              <span
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  currentImage === "image2" ? "translate-x-6 bg-orange-600" : ""
                }`}
              ></span>
            </button>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <GiCow className="text-green-400" /> {calf.name}
          </h1>
          <p className="text-gray-400">
            Calf ID: <span className="text-white">{calf.calfId}</span>
          </p>
          {calf.isPregnant && (
            <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded-md text-sm">
              Pregnant 🍼
            </span>
          )}
        </div>
      </div>

      {/* Medicines */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Medicine Records</h2>
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
                      {med.dateGiven
                        ? new Date(med.dateGiven).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">{med.dosage || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          med.hasTaken
                            ? "bg-green-500/10 text-green-400 border border-green-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {med.hasTaken ? "Taken" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 italic">
                      {med.note || "—"}
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
