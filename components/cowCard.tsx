"use client";

import Image from "next/image";
import { FaVial } from "react-icons/fa";
import { Cow } from "@/types/Cow"; // ✅ Import your cow interface

interface CowCardProps {
  cow: Cow;
}

export default function CowCard({ cow }: CowCardProps) {
  return (
    <div className="bg-[#0e1b2e]/60 backdrop-blur-xl rounded-2xl p-4 border border-blue-800 hover:scale-[1.02] transition duration-300">

      {/* ✅ Primary Image (safe fallback, no fill error) */}
      <div className="w-full h-48 relative">
        <Image
          src={cow.images?.primary || "/fallback-cow.jpg"}
          alt={`${cow.name || "Cow"} photo`}
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-full"
          priority
        />
      </div>

      {/* ✅ Optional Secondary Image */}
      {cow.images?.secondary && (
        <div className="w-full h-32 relative mt-2">
          <Image
            src={cow.images.secondary}
            alt={`${cow.name || "Cow"} secondary image`}
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-full opacity-90 hover:opacity-100 transition"
          />
        </div>
      )}

      {/* ✅ Basic Details */}
      <h2 className="text-xl font-semibold mt-3">{cow.name || "Unnamed Cow"}</h2>
      <p className="text-gray-300">Age: {cow.age ?? "N/A"} years</p>
      <p className="text-gray-300">Weight: {cow.weight ?? "N/A"} kg</p>
      <p className="text-gray-300">Milk Production: {cow.milkProduction ?? "N/A"} L/day</p>

      {/* ✅ Medicine Section */}
      <div className="mt-3">
        <h3 className="text-blue-300 font-medium mb-1 flex items-center gap-1">
          <FaVial /> Medicine Checklist
        </h3>
        <ul className="text-sm text-gray-400">
          {cow.medicines?.length ? (
            cow.medicines.map((m, i) => (
              <li
                key={i}
                className={`flex items-center gap-2 ${
                  m.taken ? "line-through text-gray-500" : "text-green-300"
                }`}
              >
                <span>•</span> {m.name}
              </li>
            ))
          ) : (
            <li>No medicines listed</li>
          )}
        </ul>
      </div>
    </div>
  );
}
