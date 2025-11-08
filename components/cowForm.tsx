"use client";
import { useState, FormEvent } from "react";
import { Cow } from "@/types/Cow";

interface Props {
  onCreated: () => void;
}

export default function CowForm({ onCreated }: Props) {
  const [form, setForm] = useState<Cow>({
    cowId: "",
    name: "",
    age: 0,
    weight: 0,
    milkProduction: 0,
    images: { primary: "" },
    medicines: [],
    pregnancy: {},
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/cows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onCreated();
  };

  const handleChange = (key: keyof Cow, value: any) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0e1b2e]/70 p-6 rounded-2xl mb-8"
    >
      <h2 className="text-2xl mb-4 font-semibold text-blue-300">Add New Cow</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Cow ID"
          required
          value={form.cowId}
          onChange={(e) => handleChange("cowId", e.target.value)}
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => handleChange("age", Number(e.target.value))}
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
        <input
          placeholder="Weight (kg)"
          type="number"
          value={form.weight}
          onChange={(e) => handleChange("weight", Number(e.target.value))}
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
        <input
          placeholder="Milk (L/day)"
          type="number"
          value={form.milkProduction}
          onChange={(e) =>
            handleChange("milkProduction", Number(e.target.value))
          }
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
        <input
          placeholder="Primary Image URL"
          required
          value={form.images.primary}
          onChange={(e) =>
            setForm({
              ...form,
              images: { ...form.images, primary: e.target.value },
            })
          }
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
        <input
          placeholder="Secondary Image URL (optional)"
          value={form.images.secondary || ""}
          onChange={(e) =>
            setForm({
              ...form,
              images: { ...form.images, secondary: e.target.value },
            })
          }
          className="p-2 rounded bg-[#12233f] border border-blue-800 text-white"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-lg"
      >
        Save Cow
      </button>
    </form>
  );
}
