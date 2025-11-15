"use client";

import axios from "axios";
import { useState, FormEvent, ChangeEvent } from "react";

interface CalfFormData {
  calfId: string;
  name: string;
  image1: string;
}

export default function AddCalfPage() {
  const [formData, setFormData] = useState<CalfFormData>({
    calfId: "",
    name: "",
    image1: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/add-calf", formData);
      if (!res.data.success) {
        throw new Error(res.data.message || "API error");
      }
      alert("✅ Calf added successfully!");
      setFormData({ calfId: "", name: "", image1: "" });
    } catch (error: unknown) {
      console.log(error);
      alert(`❌ Failed to add calf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-2xl bg-[#0d1117]/70 border border-gray-700">
      <h1 className="text-3xl font-bold text-green-400 mb-8 text-center">
        🐮 Add New Calf
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Calf ID */}
        <div>
          <label className="block font-semibold mb-1">Calf ID</label>
          <input
            type="text"
            name="calfId"
            placeholder="Enter calf ID"
            value={formData.calfId}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3"
          />
        </div>

        {/* Calf Name */}
        <div>
          <label className="block font-semibold mb-1">Calf Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter calf name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3"
          />
        </div>

        {/* Primary Image */}
        <div>
          <label className="block font-semibold mb-1 text-red-400">
            Primary Image URL
          </label>
          <input
            type="url"
            name="image1"
            placeholder="Enter image URL"
            value={formData.image1}
            onChange={handleChange}
            className="w-full bg-[#161b22] border border-gray-600 rounded-md p-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {loading ? "Adding..." : "➕ Add Calf"}
        </button>
      </form>
    </div>
  );
}
