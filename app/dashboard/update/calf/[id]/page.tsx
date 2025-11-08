"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaBaby, FaSkullCrossbones } from "react-icons/fa";

interface Medicine {
  name: string;
  dateGiven?: string;
  dosage?: string;
  hasTaken?: boolean;
  note?: string;
}

interface MedicineToConsume {
  name: string;
  medicineNote?: string;
}

interface Calf {
  _id: string;
  name: string;
  image1: string;
  image2?: string;
  breed?: string;
  age?: number;
  weight?: number;
  isPregenant?: boolean;
  isSick?: boolean;
  medicines?: Medicine[];
  medicineToConsume?: MedicineToConsume[];
}

export default function UpdateCalfPage() {
  const { id } = useParams();
  const router = useRouter();
  const [calf, setCalf] = useState<Calf | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    medicines: true,
    medicineToConsume: true,
  });

  // --- Fetch calf ---
  useEffect(() => {
    const fetchCalf = async () => {
      try {
        const { data } = await axios.get(`/api/calves/${id}`);
        if (data.success) setCalf(data.calf);
      } catch (err) {
        console.error("Failed to load calf:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalf();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;
  if (!calf)
    return <p className="text-center mt-10 text-red-400">Calf not found.</p>;

  const toggleSection = (section: string) =>
    setOpenSections({ ...openSections, [section]: !openSections[section] });

  const handleChange = (field: keyof Calf, value: any) =>
    setCalf({ ...calf, [field]: value });

  // --- Medicines ---
  const handleMedicineChange = (
    i: number,
    field: keyof Medicine,
    value: any
  ) => {
    const meds = [...(calf.medicines || [])];
    meds[i] = { ...meds[i], [field]: value };
    setCalf({ ...calf, medicines: meds });
  };

  const addMedicine = () =>
    setCalf({
      ...calf,
      medicines: [
        ...(calf.medicines || []),
        { name: "", dosage: "", hasTaken: false },
      ],
    });

  const removeMedicine = (i: number) => {
    if (!confirm("Are you sure you want to remove this medicine?")) return;
    const meds = [...(calf.medicines || [])];
    meds.splice(i, 1);
    setCalf({ ...calf, medicines: meds });
  };

  // --- Medicine To Consume ---
  const handleToConsumeChange = (
    i: number,
    field: keyof MedicineToConsume,
    value: any
  ) => {
    const list = [...(calf.medicineToConsume || [])];
    list[i] = { ...list[i], [field]: value };
    setCalf({ ...calf, medicineToConsume: list });
  };

  const addToConsume = () =>
    setCalf({
      ...calf,
      medicineToConsume: [
        ...(calf.medicineToConsume || []),
        { name: "", medicineNote: "" },
      ],
    });

  const removeToConsume = (i: number) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    const list = [...(calf.medicineToConsume || [])];
    list.splice(i, 1);
    setCalf({ ...calf, medicineToConsume: list });
  };

  // ✅ Updated handleSubmit: sends new entries as array, merges properly
  const handleSubmit = async () => {
    if (!calf) return;

    try {
      const payload = {
        name: calf.name,
        breed: calf.breed,
        age: calf.age,
        weight: calf.weight,
        image1: calf.image1,
        image2: calf.image2,
        isPregenant: calf.isPregenant,
        isSick: calf.isSick,
        medicines: calf.medicines || [],
        // Important: always send as array (even single new entries)
        medicineToConsume: calf.medicineToConsume || [],
      };

      const { data } = await axios.put(`/api/calves/${calf._id}`, payload);

      if (data.success) {
        alert("✅ Calf updated successfully!");
        router.refresh();
      } else {
        alert(`❌ Failed to update calf: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update calf");
    }
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  return (
    <div className="p-6 container mx-auto text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Update Calf - {calf.name}
      </h1>

      {/* Images + Status */}
      <div className="flex flex-wrap justify-between items-start gap-8 w-full mb-10">
        {/* Images */}
        <div className="flex gap-6 flex-wrap justify-center">
          {[calf.image1, calf.image2].map(
            (img, idx) =>
              img && (
                <div
                  key={idx}
                  className="relative w-64 h-48 rounded-xl bg-white/5 backdrop-blur-md border-[1px] border-zinc-800 shadow-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={img}
                    alt={`Calf Image ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl border-[1px] border-zinc-800 shadow-inner"
                  />
                  <span className="absolute bottom-2 text-white/70 text-sm font-medium">
                    Image {idx + 1}
                  </span>
                </div>
              )
          )}
        </div>

        {/* Status Toggles */}
        <div className="flex flex-col gap-6">
          {/* Pregnant Toggle */}
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/20">
            <FaBaby className="text-pink-400 text-2xl animate-pulse" />
            <span className="text-white font-semibold text-lg">Pregnant</span>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={calf.isPregenant ?? false}
                onChange={(e) => handleChange("isPregenant", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/20 rounded-full peer-checked:bg-pink-400 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-6 after:h-6 after:bg-white after:rounded-full after:shadow-lg after:transition-all peer-checked:after:translate-x-7"></div>
            </label>
          </div>

          {/* Sick Toggle */}
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/20">
            <FaSkullCrossbones className="text-red-500 text-2xl animate-pulse" />
            <span className="text-white font-semibold text-lg">Sick</span>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={calf.isSick ?? false}
                onChange={(e) => handleChange("isSick", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/20 rounded-full peer-checked:bg-red-500 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-6 after:h-6 after:bg-white after:rounded-full after:shadow-lg after:transition-all peer-checked:after:translate-x-7"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Calf Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          { label: "Name", field: "name" },
          { label: "Breed", field: "breed" },
          { label: "Age", field: "age", type: "number" },
          { label: "Weight", field: "weight", type: "number" },
          { label: "Image 1 URL", field: "image1" },
          { label: "Image 2 URL", field: "image2" },
        ].map((input) => (
          <div key={input.field as string}>
            <label className="block text-gray-400 mb-1">{input.label}</label>
            <input
              type={input.type || "text"}
              value={calf[input.field as keyof Calf] ?? ""}
              onChange={(e) =>
                handleChange(
                  input.field as keyof Calf,
                  input.type === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-[#161b22] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Medicines + To Consume Sections */}
      {[
        {
          key: "medicines",
          label: "Medicines",
          items: calf.medicines,
          addItem: addMedicine,
          removeItem: removeMedicine,
        },
        {
          key: "medicineToConsume",
          label: "Medicine To-Consume",
          items: calf.medicineToConsume,
          addItem: addToConsume,
          removeItem: removeToConsume,
        },
      ].map((section) => (
        <div key={section.key} className="mb-10">
          <div
            className="flex justify-between items-center cursor-pointer bg-[#1b1f28] p-3 rounded"
            onClick={() => toggleSection(section.key)}
          >
            <h2 className="text-2xl font-semibold">{section.label}</h2>
            {openSections[section.key] ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {openSections[section.key] && (
            <div className="mt-4">
              {section.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="relative mb-4 p-4 rounded-lg bg-[#161b22] border border-gray-700"
                >
                  <FaTrash
                    className="absolute top-4 right-4 text-red-500 cursor-pointer"
                    onClick={() => section.removeItem(i)}
                  />
                  {section.key === "medicines" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={item.name}
                        onChange={(e) =>
                          handleMedicineChange(i, "name", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={item.dosage ?? ""}
                        onChange={(e) =>
                          handleMedicineChange(i, "dosage", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white"
                      />
                      <input
                        type="date"
                        value={formatDate(item.dateGiven)}
                        onChange={(e) =>
                          handleMedicineChange(i, "dateGiven", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white"
                      />
                      <textarea
                        placeholder="Note"
                        value={item.note ?? ""}
                        onChange={(e) =>
                          handleMedicineChange(i, "note", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white"
                      />
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={item.hasTaken ?? false}
                          onChange={(e) =>
                            handleMedicineChange(
                              i,
                              "hasTaken",
                              e.target.checked
                            )
                          }
                        />
                        Taken
                      </label>
                    </div>
                  )}

                  {section.key === "medicineToConsume" && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Name"
                        value={item.name}
                        onChange={(e) =>
                          handleToConsumeChange(i, "name", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white flex-1"
                      />
                      <input
                        type="text"
                        placeholder="Note"
                        value={item.medicineNote ?? ""}
                        onChange={(e) =>
                          handleToConsumeChange(
                            i,
                            "medicineNote",
                            e.target.value
                          )
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white flex-1"
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={section.addItem}
                className="px-4 py-2 bg-green-600 rounded text-white mt-2"
              >
                <FaPlus className="inline mr-2" />
                Add {section.label.slice(0, -1)}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Update
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gray-600 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
