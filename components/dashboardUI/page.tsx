"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { GiCow } from "react-icons/gi";
import { FaBaby } from "react-icons/fa";

interface Cow {
  _id: string;
  name: string;
  age: number;
  image1: string;
}

interface Calf {
  _id: string;
  name: string;
  age?: number;
  image1: string;
}

export default function DashboardUI({
  cows,
  calves,
}: {
  cows: Cow[];
  calves: Calf[];
}) {
  return (
    <div className="min-h-screen container mx-auto px-8 py-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400 tracking-wide">
          Farm Dashboard
        </h1>
        <div className="flex gap-6">
          {/* Cow Icon */}
          <div className="relative group cursor-pointer">
            <GiCow className="text-4xl text-blue-400 transition-transform duration-300 group-hover:scale-110" />
            {cows.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 w-6 h-6 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-lg animate-pulse">
                {cows.length}
              </span>
            )}
          </div>
          {/* Calf Icon */}
          <div className="relative group cursor-pointer">
            <FaBaby className="text-3xl text-green-400 transition-transform duration-300 group-hover:scale-110" />
            {calves.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-lg animate-pulse">
                {calves.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cow Cards */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-300">Cows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {cows.map((cow) => (
          <div
            key={cow._id}
            className="relative bg-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-blue-400 hover:shadow-blue-500/40 transition duration-300 hover:scale-105"
          >
            <img
              src={cow.image1 || "/placeholder-cow.png"}
              alt={cow.name}
              className="w-full h-56 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
            />
            <div className="p-2 bg-gray-900/60 backdrop-blur-sm absolute bottom-0 w-full">
              <h3 className="text-md font-semibold text-white truncate">
                {cow.name}
              </h3>
              <p className="text-gray-300 text-xs">Age: {cow.age} years</p>
              <Link
                href={`/dashboard/cow/${cow._id}`}
                className="text-blue-400 hover:underline mt-1 inline-block text-xs font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Calf Cards */}
      <h2 className="text-2xl font-semibold mb-4 text-green-300">Calves</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {calves.map((calf) => (
          <div
            key={calf._id}
            className="relative bg-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-green-400 hover:shadow-green-500/40 transition duration-300 hover:scale-105"
          >
            <img
              src={calf.image1 || "/placeholder-cow.png"}
              alt={calf.name}
              className="w-full h-56 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
            />
            <div className="p-2 bg-gray-900/60 backdrop-blur-sm absolute bottom-0 w-full">
              <h3 className="text-md font-semibold text-white truncate">
                {calf.name}
              </h3>
              <p className="text-gray-300 text-xs">
                Age: {calf.age !== undefined ? `${calf.age} years` : "N/A"}
              </p>
              <Link
                href={`/dashboard/calf/${calf._id}`}
                className="text-green-400 hover:underline mt-1 inline-block text-xs font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
