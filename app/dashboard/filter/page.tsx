"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaFilter, FaBaby } from "react-icons/fa";
import { GiCow } from "react-icons/gi";

export default function FilterPage() {
  const [animalType, setAnimalType] = useState<"cow" | "calf">("cow");
  const [filters, setFilters] = useState({
    name: "",
    isSick: false,
    isPregnant: false,
    ageMin: "",
    ageMax: "",
    milkMin: "",
    milkMax: "",
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Toggle filter values
  const handleFilterChange = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  // Handle input changes
  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch filtered data
  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Boolean filters
      ["isSick", "isPregnant"].forEach((key) => {
        if (filters[key as keyof typeof filters]) {
          queryParams.append(key, "true"); // now includes calf
        }
      });

      // Name search
      if (filters.name) queryParams.append("name", filters.name);

      // Age range
      if (filters.ageMin) queryParams.append("ageMin", filters.ageMin);
      if (filters.ageMax) queryParams.append("ageMax", filters.ageMax);

      // Milk production filter only for cows
      if (animalType === "cow") {
        if (filters.milkMin) queryParams.append("milkProductionMin", filters.milkMin);
        if (filters.milkMax) queryParams.append("milkProductionMax", filters.milkMax);
      }

      const endpoint = animalType === "cow" ? "/api/cows" : "/api/calves";
      const res = await axios.get(`${endpoint}?${queryParams.toString()}`);
      setResults(res.data.cows || res.data.calves || []);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [animalType, filters]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {animalType === "cow" ? (
            <GiCow className="text-cyan-400 text-4xl" />
          ) : (
            <FaBaby className="text-pink-400 text-3xl" />
          )}
          {animalType === "cow" ? "Cow Filters" : "Calf Filters"}
        </h1>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setAnimalType("cow")}
            className={`px-4 py-2 rounded-xl text-sm ${animalType === "cow" ? "bg-cyan-600" : "bg-gray-700"}`}
          >
            Cow
          </button>
          <button
            onClick={() => setAnimalType("calf")}
            className={`px-4 py-2 rounded-xl text-sm ${animalType === "calf" ? "bg-pink-600" : "bg-gray-700"}`}
          >
            Calf
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#161b22] p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaFilter className="text-cyan-400" /> Filter Options
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-400 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={filters.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-700 bg-[#0d1117] text-white placeholder-gray-500"
            />
          </div>

          {/* Health Status */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-400 font-medium">Health Status</label>
            <button
              onClick={() => handleFilterChange("isSick")}
              className={`w-full p-3 rounded-xl font-semibold border ${filters.isSick ? "bg-red-600 border-red-500" : "bg-green-600 border-green-500"}`}
            >
              {filters.isSick ? "Sick" : "Healthy"}
            </button>
          </div>

          {/* Pregnancy Status */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-400 font-medium">Pregnancy Status</label>
            <button
              onClick={() => handleFilterChange("isPregnant")}
              className={`w-full p-3 rounded-xl font-semibold border ${filters.isPregnant ? "bg-purple-600 border-purple-500" : "bg-gray-700 border-gray-600"}`}
            >
              Pregnant
            </button>
          </div>

          {/* Age Range */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-400 font-medium">Age (Years)</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.ageMin}
                onChange={(e) => handleInputChange("ageMin", e.target.value)}
                className="flex-1 w-full p-3 rounded-xl border border-gray-700 bg-[#0d1117] text-white placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.ageMax}
                onChange={(e) => handleInputChange("ageMax", e.target.value)}
                className="flex-1 w-full p-3 rounded-xl border border-gray-700 bg-[#0d1117] text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Milk Production (only for cows) */}
          {animalType === "cow" && (
            <div className="flex flex-col">
              <label className="mb-1 text-gray-400 font-medium">Milk Production (L/day)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.milkMin}
                  onChange={(e) => handleInputChange("milkMin", e.target.value)}
                  className="flex-1 w-full p-3 rounded-xl border border-gray-700 bg-[#0d1117] text-white placeholder-gray-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.milkMax}
                  onChange={(e) => handleInputChange("milkMax", e.target.value)}
                  className="flex-1 w-full p-3 rounded-xl border border-gray-700 bg-[#0d1117] text-white placeholder-gray-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-[#161b22] p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaSearch className="text-cyan-400" /> Results ({results.length})
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400">No results found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full text-sm text-left border border-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-700">Name</th>
                  <th className="px-4 py-3 border-b border-gray-700">Age (years)</th>
                  <th className="px-4 py-3 border-b border-gray-700">Weight (kg)</th>
                  <th className="px-4 py-3 border-b border-gray-700">Status</th>
                  {animalType === "cow" && <th className="px-4 py-3 border-b border-gray-700">Milk (L/day)</th>}
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-700 transition-colors even:bg-gray-900"
                  >
                    <td className="px-4 py-2 border-b border-gray-700">{item.name || "Unnamed"}</td>
                    <td className="px-4 py-2 border-b border-gray-700">{item.age ?? "N/A"}</td>
                    <td className="px-4 py-2 border-b border-gray-700">{item.weight ?? "N/A"}</td>
                    <td className="px-4 py-2 border-b border-gray-700 flex gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isSick ? "bg-red-600" : "bg-green-600"}`}>
                        {item.isSick ? "Sick" : "Healthy"}
                      </span>
                      {item.isPregnant && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white">
                          Pregnant
                        </span>
                      )}
                    </td>
                    {animalType === "cow" && (
                      <td className="px-4 py-2 border-b border-gray-700">{item.milkProduction ?? "-"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
