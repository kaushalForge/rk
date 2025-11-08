"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Calf {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  hasReachedPregnancyAge: boolean;
  isPregnant: boolean;
  firstPregnancy: boolean;
  motherCow?: { _id: string; name: string } | null;
  promotedToCow: boolean;
  medicines?: { name: string; dateGiven?: string; dosage?: string; note?: string }[];
  pregnancies?: { startDate?: string; dueDate?: string; delivered?: boolean; notes?: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function CalfDetailPage() {
  const { id } = useParams();
  const [calf, setCalf] = useState<Calf | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCalf = async () => {
      try {
        const res = await fetch(`/api/calves/${id}`);
        const data = await res.json();
        setCalf(data);
      } catch (err) {
        console.error("Error fetching calf:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalf();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading calf details...</p>;
  if (!calf) return <p className="text-center mt-10 text-red-600">Calf not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🐮 {calf.name}</h1>

      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Breed:</strong> {calf.breed || "N/A"}</p>
        <p><strong>Age:</strong> {calf.age ?? "N/A"} months</p>
        <p><strong>Weight:</strong> {calf.weight ?? "N/A"} kg</p>
        <p><strong>Promoted to Cow:</strong> {calf.promotedToCow ? "Yes" : "No"}</p>
        <p><strong>Pregnancy Age:</strong> {calf.hasReachedPregnancyAge ? "Reached" : "Not Reached"}</p>
        <p><strong>Pregnant:</strong> {calf.isPregnant ? "Yes" : "No"}</p>
        <p><strong>First Pregnancy:</strong> {calf.firstPregnancy ? "Yes" : "No"}</p>
        <p><strong>Mother Cow:</strong> {calf.motherCow ? calf.motherCow.name : "N/A"}</p>
      </div>

      {/* 💊 Medicines */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Medicines</h2>
        {calf.medicines && calf.medicines.length > 0 ? (
          <ul className="space-y-2">
            {calf.medicines.map((m, i) => (
              <li key={i} className="border p-2 rounded-md">
                <p><strong>{m.name}</strong> — {m.dosage || "N/A"}</p>
                {m.dateGiven && <p>Date: {new Date(m.dateGiven).toLocaleDateString()}</p>}
                {m.note && <p>Note: {m.note}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medicines recorded.</p>
        )}
      </div>

      {/* 🤰 Pregnancies */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Pregnancies</h2>
        {calf.pregnancies && calf.pregnancies.length > 0 ? (
          <ul className="space-y-2">
            {calf.pregnancies.map((p, i) => (
              <li key={i} className="border p-2 rounded-md">
                <p><strong>Start:</strong> {p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>Due:</strong> {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>Delivered:</strong> {p.delivered ? "Yes" : "No"}</p>
                {p.notes && <p><strong>Notes:</strong> {p.notes}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pregnancy records.</p>
        )}
      </div>
    </div>
  );
}
