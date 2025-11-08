"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSyringe, FaBaby, FaPills, FaEdit } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import axios from "axios";

interface Medicine {
  name: string;
  dateGiven?: string;
  dosage?: string;
  hasTaken?: boolean;
  note?: string;
}

interface MedicineToConsume {
  name: string;
  medicineNote?: string;
}

interface Calf {
  _id: string;
  name: string;
}

interface Pregnancy {
  attempt: number;
  startDate?: string;
  dueDate?: string;
  delivered?: boolean;
  notes?: string;
}

interface Cow {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  milkProduction?: number;
  milkFat?: number;
  isPregenant?: boolean;
  isSick?: boolean;
  imported?: boolean;
  addedAt?: string;
  image1: string;
  image2?: string;
  calves?: Calf[];
  medicines?: Medicine[];
  medicineToConsume?: MedicineToConsume[];
  pregnancies?: Pregnancy[];
}

export default function CowDetailPage() {
  const { id } = useParams();
  const [cow, setCow] = useState<Cow | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCow = async () => {
      try {
        const { data } = await axios.get(`/api/cows/${id}`);
        if (data.success) setCow(data.data);
      } catch (err) {
        console.error("Failed to load cow:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCow();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-400">Loading cow data...</p>;
  if (!cow) return <p className="text-center text-red-400">Cow not found.</p>;

  const images = [cow.image1, cow.image2].filter(Boolean) as string[];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-200">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm mb-4 text-gray-400 hover:text-white"
      >
        <IoMdArrowRoundBack className="mr-2" /> Back to Dashboard
      </Link>

      {/* Cow Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#161b22]/70 p-6 rounded-2xl border border-gray-700 shadow-lg">
        <div className="relative w-64 h-48">
          <img
            src={
              images[currentImageIndex] ||
              "https://via.placeholder.com/400x300?text=Cow"
            }
            alt={cow.name}
            className="w-full h-full object-cover rounded-xl border border-gray-700 shadow-glow"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-800 text-white px-2 py-1 rounded"
              >
                ◀
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-800 text-white px-2 py-1 rounded"
              >
                ▶
              </button>
            </>
          )}
        </div>

        <div className="flex-1 relative">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <GiCow className="text-green-400" /> {cow.name}
          </h1>

          {/* Update Button */}
          <Link
            href={`/dashboard/cows/update/${cow._id}`}
            className="absolute right-0 top-0 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition duration-300"
          >
            <FaEdit /> Update
          </Link>

          <p className="text-gray-400 mt-1">
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
            {cow.imported && (
              <span className="bg-blue-600/30 text-blue-400 px-3 py-1 rounded-md text-sm">
                Imported
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#161b22] p-4 rounded-xl border border-gray-700 text-center shadow-glow">
          <p className="text-gray-400 text-sm">Milk Production</p>
          <p className="text-xl text-green-400 font-bold">
            {cow.milkProduction ?? "N/A"} L/day
          </p>
        </div>
        <div className="bg-[#161b22] p-4 rounded-xl border border-gray-700 text-center shadow-glow">
          <p className="text-gray-400 text-sm">Milk Fat %</p>
          <p className="text-xl text-yellow-400 font-bold">
            {cow.milkFat ?? "N/A"}%
          </p>
        </div>
        <div className="bg-[#161b22] p-4 rounded-xl border border-gray-700 text-center shadow-glow">
          <p className="text-gray-400 text-sm">Added To Farm</p>
          <p className="text-lg text-white font-semibold">
            {formatDate(cow.addedAt)}
          </p>
        </div>
      </div>

      {/* Medicines */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaSyringe className="text-cyan-400" /> Medicine Records
        </h2>
        {cow.medicines?.length ? (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {cow.medicines.map((med, i) => (
              <div
                key={i}
                className="bg-[#161b22] p-4 rounded-lg border border-gray-700 shadow-glow"
              >
                <p className="font-semibold text-white">{med.name}</p>
                <p className="text-gray-400 text-sm">
                  Date Given: {med.dateGiven || "N/A"}
                </p>
                <p className="text-gray-400 text-sm">
                  Dosage: {med.dosage || "N/A"}
                </p>
                <p
                  className={`text-sm ${
                    med.hasTaken ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Status: {med.hasTaken ? "Taken" : "Pending"}
                </p>
                {med.note && (
                  <p className="text-gray-500 text-sm italic mt-1">
                    {med.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-3">No medicine records found.</p>
        )}
      </div>

      {/* Medicine To-Consume */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaPills className="text-purple-400" /> Medicine To Consume
        </h2>
        {cow.medicineToConsume?.length ? (
          <ul className="list-disc list-inside mt-4 text-gray-400">
            {cow.medicineToConsume.map((m, i) => (
              <li key={i}>
                {m.name} {m.medicineNote && `- ${m.medicineNote}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mt-3">No medicine to consume.</p>
        )}
      </div>

      {/* Linked Calves */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaBaby className="text-pink-400" /> Linked Calves
        </h2>
        {cow.calves?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {cow.calves.map((calf) => (
              <Link
                href={`/dashboard/calves/${calf._id}`}
                key={calf._id}
                className="bg-[#161b22] border border-gray-700 p-4 rounded-lg hover:shadow-pink-500/20 transition shadow-glow"
              >
                <p className="text-white font-semibold">{calf.name}</p>
                <p className="text-gray-500 text-sm">View Details →</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-3">No linked calves found.</p>
        )}
      </div>

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(0, 255, 150, 0.2);
          transition: box-shadow 0.3s ease-in-out;
        }
        .shadow-glow:hover {
          box-shadow: 0 0 20px rgba(0, 255, 150, 0.4);
        }
      `}</style>
    </div>
  );
}
