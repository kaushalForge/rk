"use client";

import { useState } from "react";

export default function AddCowPage() {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    milkProduction: "",
    primaryImage: "",
    secondaryImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/add-cow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          breed: formData.breed || "",
          age: Number(formData.age) || null,
          weight: Number(formData.weight) || null,
          milkProduction: Number(formData.milkProduction) || null,
          images: {
            primary: formData.primaryImage,
            secondary: formData.secondaryImage || null,
          },
          medicines: [], // optional, default empty
          pregnancies: [], // optional, default empty
          calves: [], // optional, default empty
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("🐄 Cow added successfully!");
        setFormData({
          name: "",
          breed: "",
          age: "",
          weight: "",
          milkProduction: "",
          primaryImage: "",
          secondaryImage: "",
        });
      } else {
        alert("❌ Error adding cow: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting cow:", error);
      alert("❌ Something went wrong while adding the cow.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-2xl bg-[#0d1117]/70 backdrop-blur-xl border border-gray-700 shadow-lg">
      <h1 className="text-3xl font-bold text-green-400 mb-8 text-center flex items-center justify-center gap-2">
        🐄 Add New Cow
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-200">
        {/* Cow Name */}
        <div>
          <label className="block font-semibold mb-1">Cow Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter cow name (e.g., Bella)"
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
            placeholder="Enter breed (e.g., Jersey, Holstein)"
            value={formData.breed}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Age & Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Age (years)</label>
            <input
              type="number"
              name="age"
              placeholder="e.g., 4"
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
              placeholder="e.g., 450"
              value={formData.weight}
              onChange={handleChange}
              className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Milk Production */}
        <div>
          <label className="block font-semibold mb-1">
            Milk Production (L/day)
          </label>
          <input
            type="number"
            name="milkProduction"
            placeholder="e.g., 20"
            value={formData.milkProduction}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block font-semibold mb-1">Primary Image URL</label>
          <input
            type="text"
            name="primaryImage"
            placeholder="Enter primary image URL"
            value={formData.primaryImage}
            onChange={handleChange}
            required
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Secondary Image URL
          </label>
          <input
            type="text"
            name="secondaryImage"
            placeholder="Optional secondary image URL"
            value={formData.secondaryImage}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-3 rounded-md shadow-md transition-all duration-300"
        >
          ➕ Add Cow
        </button>
      </form>
    </div>
  );
}
