"use client";

import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import Link from "next/link";

interface Cow {
  _id: string;
  name: string;
  breed?: string;
  weight?: number;
  age?: number;
  isPregnant?: boolean;
  isSick?: boolean;
  milkProduction?: number;
  milkFat?: number;
  addedAt?: string;
  imported?: boolean;
  calvesCount?: number;
  images?: { primary?: string };
}

export default function FilterPage() {
  const [filters, setFilters] = useState({
    isSick: false,
    hasTakenMandatoryMedicine: false,
    lastMedicineGivenDays: "",
    nextMedicineDueDays: "",
    hasDiseaseRecord: false,
    isPregnant: false,
    pregnancyStage: "",
    hasGivenBirthRecently: "",
    numberOfCalves: "",
    linkedCalvesCount: "",
    milkProductionMin: "",
    milkProductionMax: "",
    milkFatMin: "",
    milkFatMax: "",
    timeInFarmDays: "",
    breedType: "",
    weightMin: "",
    weightMax: "",
    ageMin: "",
    ageMax: "",
    lowProductionAlert: false,
  });

  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== false) params.append(key, String(value));
      });

      const res = await fetch(`/api/cows?${params.toString()}`);
      const data = await res.json();
      setCows(data);
    } catch (err) {
      console.error("Filter error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-gray-200 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiFilter className="text-green-400 text-3xl" />
        <h1 className="text-3xl font-bold text-white">Advanced Cow Filters</h1>
      </div>

      {/* Filters Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#161b22]/70 p-5 rounded-2xl border border-gray-700 mb-8">
        {/* Boolean Filters */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isSick"
            checked={filters.isSick}
            onChange={handleChange}
          />
          <span>Is Sick</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="hasTakenMandatoryMedicine"
            checked={filters.hasTakenMandatoryMedicine}
            onChange={handleChange}
          />
          <span>Has Taken Mandatory Medicine</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="hasDiseaseRecord"
            checked={filters.hasDiseaseRecord}
            onChange={handleChange}
          />
          <span>Has Disease Record</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPregnant"
            checked={filters.isPregnant}
            onChange={handleChange}
          />
          <span>Is Pregnant</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="lowProductionAlert"
            checked={filters.lowProductionAlert}
            onChange={handleChange}
          />
          <span>Low Production Alert</span>
        </label>

        {/* Dropdowns and Ranges */}
        <div>
          <label className="block text-sm">Pregnancy Stage</label>
          <select
            name="pregnancyStage"
            value={filters.pregnancyStage}
            onChange={handleChange}
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="early">Early</option>
            <option value="mid">Mid</option>
            <option value="late">Late</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Has Given Birth Recently (months)</label>
          <input
            type="number"
            name="hasGivenBirthRecently"
            value={filters.hasGivenBirthRecently}
            onChange={handleChange}
            placeholder="e.g. 6"
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm">Last Medicine Given (days)</label>
          <input
            type="number"
            name="lastMedicineGivenDays"
            value={filters.lastMedicineGivenDays}
            onChange={handleChange}
            placeholder="e.g. 30"
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm">Next Medicine Due (days)</label>
          <input
            type="number"
            name="nextMedicineDueDays"
            value={filters.nextMedicineDueDays}
            onChange={handleChange}
            placeholder="e.g. 15"
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm">Number of Calves</label>
          <input
            type="number"
            name="numberOfCalves"
            value={filters.numberOfCalves}
            onChange={handleChange}
            placeholder="e.g. 2"
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm">Linked Calves Count</label>
          <input
            type="number"
            name="linkedCalvesCount"
            value={filters.linkedCalvesCount}
            onChange={handleChange}
            placeholder="e.g. 3"
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm">Milk Production (liters/day)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="milkProductionMin"
              value={filters.milkProductionMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
            <input
              type="number"
              name="milkProductionMax"
              value={filters.milkProductionMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Milk Fat %</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="milkFatMin"
              value={filters.milkFatMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
            <input
              type="number"
              name="milkFatMax"
              value={filters.milkFatMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Breed Type</label>
          <select
            name="breedType"
            value={filters.breedType}
            onChange={handleChange}
            className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="imported">Imported</option>
            <option value="local">Local</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Weight (kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="weightMin"
              value={filters.weightMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
            <input
              type="number"
              name="weightMax"
              value={filters.weightMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Age (years)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="ageMin"
              value={filters.ageMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
            <input
              type="number"
              name="ageMax"
              value={filters.ageMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-full bg-[#0d1117] border border-gray-600 rounded-md p-2"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleFilter}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Apply Filters
      </button>

      {/* Results */}
      <div className="mt-10">
        {loading ? (
          <p className="text-center text-gray-400">Loading results...</p>
        ) : cows.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cows.map((cow) => (
              <Link
                key={cow._id}
                href={`/dashboard/cow/${cow._id}`}
                className="bg-[#161b22] border border-gray-700 rounded-xl p-4 hover:shadow-green-500/20 transition"
              >
                <img
                  src={
                    cow.images?.primary ||
                    "https://via.placeholder.com/300x200?text=Cow"
                  }
                  alt={cow.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="font-bold text-white text-lg">{cow.name}</h3>
                <p className="text-sm text-gray-400">{cow.breed}</p>
                {cow.isPregnant && (
                  <p className="text-green-400 text-xs mt-1">Pregnant 🍼</p>
                )}
                {cow.isSick && (
                  <p className="text-red-400 text-xs mt-1">Sick 🤒</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No cows found matching filters.
          </p>
        )}
      </div>
    </div>
  );
}
