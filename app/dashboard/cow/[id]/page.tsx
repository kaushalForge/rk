"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaSyringe, FaBaby, FaEdit } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import Link from "next/link";
import axios from "axios";
import { LiaToggleOnSolid } from "react-icons/lia";

interface Medicine {
  name: string;
  dateGiven?: string;
  dosage?: string;
  hasTaken?: boolean;
  note?: string;
}

interface Pregnancy {
  attempt?: number;
  startDate?: string;
  dueDate?: string;
  delivered?: boolean;
  notes?: string;
}

interface MedicineToConsume {
  name?: string;
  medicineNote?: string;
}

interface Cow {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  isPregenant?: boolean;
  isSick?: boolean;
  milkProduction?: number;
  milkFat?: number;
  addedAt?: string;
  imported?: boolean;
  linkedCalves?: {
    calfId: {
      _id: string;
      name: string;
      image1?: string;
    } | null;
  }[];
  medicines?: Medicine[];
  medicineToConsume?: MedicineToConsume[];
  pregnancies?: Pregnancy[];
  image1?: string;
  image2?: string;
}

export default function CowDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cow, setCow] = useState<Cow | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<"image1" | "image2">(
    "image1"
  );

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

    console.log(cow?.linkedCalves, "test");
    fetchCow();
  }, [id]);

  if (!cow)
    return <p className="text-center text-red-400 mt-6">Cow not found.</p>;

  return (
    <div className="p-6 container mx-auto text-gray-200 space-y-10">
      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row items-center gap-6 bg-[#161b22]/70 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-lg">
        {/* Update Button */}
        <button
          onClick={() => router.push(`/dashboard/update/cow/${cow._id}`)}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <FaEdit /> Update
        </button>

        {/* Image Toggle */}
        <div className="relative">
          <img
            src={
              currentImage === "image1"
                ? cow.image1 || "https://via.placeholder.com/400x300?text=Cow"
                : cow.image2 ||
                  cow.image1 ||
                  "https://via.placeholder.com/400x300?text=Cow"
            }
            alt={cow.name}
            className="w-64 h-48 object-cover rounded-xl border border-gray-700"
          />

          {cow.image2 && (
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
            {cow.isPregenant && (
              <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded-md text-sm">
                Pregnant 🍼
              </span>
            )}
            {cow.isSick && (
              <span className="bg-red-600/30 text-red-400 px-3 py-1 rounded-md text-sm">
                Sick 🤒
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
            {cow.addedAt
              ? new Date(cow.addedAt).toISOString().split("T")[0]
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Medicines */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <FaSyringe className="text-cyan-400" /> Medicine Records
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
                        new Date(med.dateGiven).toISOString().split("T")[0]
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

      {/* Medicine To-Consume */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <FaSyringe className="text-cyan-400" /> Medicine To-Consume
        </h2>
        {cow.medicineToConsume?.length ? (
          <ul className="list-disc list-inside space-y-1">
            {cow.medicineToConsume.map((med, i) => (
              <li key={i}>
                <span className="font-semibold">{med.name}</span> -{" "}
                {med.medicineNote || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mt-2">No medicines to consume.</p>
        )}
      </div>

      {/* Pregnancies */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
          <FaBaby className="text-pink-400" /> Pregnancies
        </h2>

        {cow.pregnancies?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cow.pregnancies.map((preg, i) => (
              <div
                key={i}
                className="bg-[#161b22] p-4 rounded-xl border border-gray-700 shadow-md hover:shadow-lg transition duration-200"
              >
                <div className="flex gap-2 items-center mb-2">
                  <span className="text-orange-400 text-lg">Attempt</span>
                  <span className="text-white font-semibold h-6 w-6 flex items-center justify-center p-2 bg-sky-700 rounded-full">
                    {preg.attempt || "N/A"}
                  </span>
                </div>

                <div className="mb-1">
                  <span className="text-gray-400 text-sm">Start Date: </span>
                  <span className="text-white font-medium">
                    {preg.startDate
                      ? new Date(preg.startDate).toString().split("T")[0]
                      : "N/A"}
                  </span>
                </div>

                <div className="mb-1">
                  <span className="text-gray-400 text-sm">Due Date: </span>
                  <span className="text-white font-medium">
                    {preg.dueDate
                      ? new Date(preg.dueDate).toString().split("T")[0]
                      : "N/A"}
                  </span>
                </div>

                <div className="mb-1">
                  <span className="text-gray-400 text-sm">Status: </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      preg.delivered
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {preg.delivered ? "Delivered" : "Pending"}
                  </span>
                </div>

                {preg.notes && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-medium">
                      Notes:
                    </span>
                    <span className="text-white text-sm">
                      {preg.notes || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-2">No pregnancies recorded.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <FaBaby className="text-pink-400" /> Linked Calves
        </h2>

        {cow.linkedCalves?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cow.linkedCalves.map((calf) => {
              const calfData = calf.calfId;
              if (!calfData) return null;

              return (
                <Link
                  href={`/dashboard/calf/${calfData._id}`}
                  key={calfData._id}
                  className="bg-[#161b22] border border-gray-700 p-3 rounded-lg hover:shadow-pink-400/20 transition flex flex-col items-center gap-2"
                >
                  <img
                    src={calfData.image1 || "https://via.placeholder.com/150"}
                    alt={calfData.name}
                    className="w-full h-32 object-cover rounded-lg border border-gray-700"
                  />
                  <p className="text-white font-semibold truncate text-center">
                    {calfData.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 text-center">
                    View Details →
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-red-400 mt-2">No baby calf linked!</p>
        )}
      </div>
    </div>
  );
}
