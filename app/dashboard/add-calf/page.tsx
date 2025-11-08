"use client";

import { useState, FormEvent, ChangeEvent } from "react";

interface CalfFormData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  hasReachedPregnancyAge: boolean;
  isPregnant: boolean;
  firstPregnancy: boolean;
  motherCow: string;
  promotedToCow: boolean;
  imagePrimary: string;
  imageSecondary?: string;
}

export default function AddCalfPage() {
  const [formData, setFormData] = useState<CalfFormData>({
    name: "",
    breed: "",
    age: "",
    weight: "",
    hasReachedPregnancyAge: false,
    isPregnant: false,
    firstPregnancy: false,
    motherCow: "",
    promotedToCow: false,
    imagePrimary: "",
    imageSecondary: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && "checked" in e.target ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.imagePrimary.trim()) {
      alert("❌ Primary image URL is required!");
      return;
    }

    const payload = {
      ...formData,
      age: formData.age ? Number(formData.age) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      motherCow: formData.motherCow?.trim() || null,
      images: {
        primary: formData.imagePrimary,
        secondary: formData.imageSecondary || null,
      },
    };

    try {
      const res = await fetch("/api/add-calf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");

      alert("✅ Calf added successfully!");

      setFormData({
        name: "",
        breed: "",
        age: "",
        weight: "",
        hasReachedPregnancyAge: false,
        isPregnant: false,
        firstPregnancy: false,
        motherCow: "",
        promotedToCow: false,
        imagePrimary: "",
        imageSecondary: "",
      });
    } catch (error) {
      console.error("Error adding calf:", error);
      alert("❌ Failed to add calf.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-2xl bg-[#0d1117]/70 backdrop-blur-xl border border-gray-700 shadow-lg">
      <h1 className="text-3xl font-bold text-green-400 mb-8 text-center flex items-center justify-center gap-2">
        🐮 Add New Calf
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Calf Name */}
        <div>
          <label className="block font-semibold mb-1">Calf Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter calf name (e.g., Daisy)"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="block font-semibold mb-1">Breed</label>
          <input
            type="text"
            name="breed"
            placeholder="e.g., Jersey, Holstein"
            value={formData.breed}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-red-400">
              Primary Image (required)
            </label>
            <input
              type="text"
              name="imagePrimary"
              placeholder="Enter image URL"
              value={formData.imagePrimary}
              onChange={handleChange}
              required
              className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Secondary Image</label>
            <input
              type="text"
              name="imageSecondary"
              placeholder="Optional image URL"
              value={formData.imageSecondary}
              onChange={handleChange}
              className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Age & Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Age (months)</label>
            <input
              type="number"
              name="age"
              placeholder="e.g., 5"
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="e.g., 120"
              value={formData.weight}
              onChange={handleChange}
              className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Mother Cow */}
        <div>
          <label className="block font-semibold mb-1">Mother Cow ID</label>
          <input
            type="text"
            name="motherCow"
            placeholder="Enter Mother Cow ObjectId (optional)"
            value={formData.motherCow}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Pregnancy Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasReachedPregnancyAge"
              checked={formData.hasReachedPregnancyAge}
              onChange={handleChange}
              className="accent-green-500"
            />
            Reached Pregnancy Age
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPregnant"
              checked={formData.isPregnant}
              onChange={handleChange}
              className="accent-green-500"
            />
            Is Pregnant
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="firstPregnancy"
              checked={formData.firstPregnancy}
              onChange={handleChange}
              className="accent-green-500"
            />
            First Pregnancy
          </label>
        </div>

        {/* Promotion */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="promotedToCow"
            checked={formData.promotedToCow}
            onChange={handleChange}
            className="accent-green-500"
          />
          Promoted to Cow
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600/80 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/20"
        >
          ➕ Add Calf
        </button>
      </form>
    </div>
  );
}
