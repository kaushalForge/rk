"use client";

import { useState } from "react";
import axios from "axios";

export default function AddCowPage() {
  const [formData, setFormData] = useState({
    name: "",
    milkProduction: "",
    image1: "",
    image2: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/add-cow", {
        name: formData.name,
        milkProduction: Number(formData.milkProduction) || null,
        image1: formData.image1,
        image2: formData.image2,
        medicines: [],
        pregnancies: [],
      });

      if (res.data.success) {
        alert("🐄 Cow added successfully!");
        setFormData({
          name: "",
          milkProduction: "",
          image1: "",
          image2: "",
        });
      } else {
        alert("❌ Error adding cow: " + (res.data.message || "Unknown error"));
      }
    } catch (error: any) {
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
            name="image1"
            placeholder="Enter primary image URL"
            value={formData.image1}
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
            name="image2"
            placeholder="Optional secondary image URL"
            value={formData.image2}
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
