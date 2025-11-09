"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaBaby,
  FaSkullCrossbones,
} from "react-icons/fa";
import { toast } from "sonner";

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

interface Pregnancy {
  startDate?: string;
  dueDate?: string;
  delivered?: boolean;
  notes?: string;
}

interface Cow {
  _id: string;
  name: string;
  image1: string;
  image2?: string;
  breed?: string;
  age?: number;
  weight?: number;
  milkProduction?: number;
  milkFat?: number;
  isPregnant?: boolean;
  isSick?: boolean;
  medicines?: Medicine[];
  medicineToConsume?: MedicineToConsume[];
  pregnancies?: Pregnancy[];
  calves?: (string | { _id: string; name?: string })[];
}

export default function UpdateCowPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cow, setCow] = useState<Cow | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<{
    [key: string]: boolean;
  }>({
    medicines: true,
    medicineToConsume: true,
    pregnancies: true,
    calves: true,
  });

  // --- Fetch cow ---
  useEffect(() => {
    const fetchCow = async () => {
      try {
        const response = await axios.get(`/api/cows/${id}`);
        setCow(response.data.cow);
      } catch (err) {
        console.error("Error Fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCow();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;
  if (!cow)
    return <p className="text-center mt-10 text-red-400">Cow not found.</p>;

  const toggleSection = (section: string) =>
    setOpenSections({ ...openSections, [section]: !openSections[section] });

  const handleChange = (field: keyof Cow, value: any) =>
    setCow({ ...cow, [field]: value });

  // --- Medicines ---
  const handleMedicineChange = (
    i: number,
    field: keyof Medicine,
    value: any
  ) => {
    const meds = [...(cow.medicines || [])];
    meds[i] = { ...meds[i], [field]: value };
    setCow({ ...cow, medicines: meds });
  };

  const addMedicine = () =>
    setCow({
      ...cow,
      medicines: [
        ...(cow.medicines || []),
        { name: "", dosage: "", hasTaken: false },
      ],
    });

  const removeMedicine = (i: number) => {
    toast.warning(
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to remove this medicine?</span>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              const meds = [...(cow.medicines || [])];
              meds.splice(i, 1);
              setCow({ ...cow, medicines: meds });
              toast.success("Medicine removed");
              toast.dismiss();
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  // --- Medicine To-Consume ---
  const handleToConsumeChange = (
    i: number,
    field: keyof MedicineToConsume,
    value: any
  ) => {
    const list = [...(cow.medicineToConsume || [])];
    list[i] = { ...list[i], [field]: value };
    setCow({ ...cow, medicineToConsume: list });
  };

  const addToConsume = () =>
    setCow({
      ...cow,
      medicineToConsume: [
        ...(cow.medicineToConsume || []),
        { name: "", medicineNote: "" },
      ],
    });

  const removeToConsume = (i: number) => {
    toast.warning(
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to remove this item?</span>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              const list = [...(cow.medicineToConsume || [])];
              list.splice(i, 1);
              setCow({ ...cow, medicineToConsume: list });
              toast.success("Item removed");
              toast.dismiss(); // dismiss this toast
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity, // keeps toast visible until user clicks
        position: "top-center",
      }
    );
  };

  // --- Pregnancies ---
  const handlePregnancyChange = (
    i: number,
    field: keyof Pregnancy,
    value: any
  ) => {
    const preg = [...(cow.pregnancies || [])];
    preg[i] = { ...preg[i], [field]: value };
    setCow({ ...cow, pregnancies: preg });
  };

  const addPregnancy = () =>
    setCow({
      ...cow,
      pregnancies: [...(cow.pregnancies || []), { delivered: false }],
    });

  const removePregnancy = (i: number) => {
    toast.warning(
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to remove this pregnancy?</span>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              const preg = [...(cow.pregnancies || [])];
              preg.splice(i, 1);
              setCow({ ...cow, pregnancies: preg });
              toast.success("Pregnancy removed");
              toast.dismiss(); // dismiss this toast
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity, // keeps toast visible until user clicks
        position: "top-center",
      }
    );
  };

  // --- Calves ---
  const addCalf = () => {
    setCow({ ...cow, calves: [...(cow.calves || []), ""] });
  };

  const handleCalfChange = (i: number, value: string) => {
    const list = [...(cow.calves || [])];
    list[i] = value;
    setCow({ ...cow, calves: list });
  };

  const removeCalf = (i: number) => {
    toast.warning(
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to remove this calf ID?</span>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              const list = [...(cow.calves || [])];
              list.splice(i, 1);
              setCow({ ...cow, calves: list });
              toast.success("Calf removed");
              toast.dismiss(); // dismiss the toast
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

  const handleSubmit = async () => {
    if (!cow) return;

    // Convert string IDs or object IDs to valid ObjectId objects
    const validLinkedCalves = (cow.calves || [])
      .map((c) => (typeof c === "string" ? c.trim() : c?._id?.trim()))
      .filter((id) => id && isValidObjectId(id))
      .map((id) => ({ calfId: id })); // ✅ Important: wrap in object

    const invalidIds = (cow.calves || [])
      .map((c) => (typeof c === "string" ? c.trim() : c?._id?.trim()))
      .filter((id) => id && !isValidObjectId(id));

    if (invalidIds.length > 0) {
      toast.error(`Invalid calf ID(s): ${invalidIds.join(", ")}`);
      return;
    }

    const payload: any = {
      ...cow,
      medicines: cow.medicines || [],
      medicineToConsume: cow.medicineToConsume || [],
      pregnancies: cow.pregnancies || [],
      linkedCalves: validLinkedCalves,
      isPregnant: cow.isPregnant ?? false,
      isSick: cow.isSick ?? false,
    };

    try {
      const { data } = await axios.put(`/api/cows/${cow._id}`, payload);
      if (data.success) {
        toast.success("Cow updated successfully!", {
          position: "top-center",
        });
        router.refresh();
      } else {
        toast.error(`Failed to update cow: ${data.message}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update cow");
    }
  };
  const formatDate = (date?: string) =>
    date ? new Date(date).toISOString().slice(0, 10) : "";

  return (
    <div className="p-6 container mx-auto text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Update Cow - {cow.name}
      </h1>

      {/* Images + Status */}
      <div className="flex flex-wrap justify-between items-start gap-8 w-full mb-10">
        {/* Images */}
        <div className="flex gap-6 flex-wrap justify-center">
          {[cow.image1, cow.image2].map(
            (img, idx) =>
              img && (
                <div
                  key={idx}
                  className="relative w-64 h-48 rounded-xl bg-white/5 backdrop-blur-md border-[1px] border-zinc-800 shadow-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={img}
                    alt={`Cow Image ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl border-[1px] border-zinc-800 shadow-inner"
                  />
                  <span className="absolute bottom-2 text-white/70 text-sm font-medium">
                    Image {idx + 1}
                  </span>
                  <div className="absolute inset-0 rounded-xl border-2 border-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 animate-glow pointer-events-none"></div>
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
                checked={cow.isPregnant ?? false}
                onChange={(e) => handleChange("isPregnant", e.target.checked)}
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
                checked={cow.isSick ?? false}
                onChange={(e) => handleChange("isSick", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/20 rounded-full peer-checked:bg-red-500 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-6 after:h-6 after:bg-white after:rounded-full after:shadow-lg after:transition-all peer-checked:after:translate-x-7"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 6px rgba(255,255,255,0.2), 0 0 12px rgba(255,0,255,0.15); }
            50% { box-shadow: 0 0 8px rgba(255,255,255,0.3), 0 0 16px rgba(255,0,255,0.2); }
          }
          .animate-glow { animation: glow 4s ease-in-out infinite; }
        `}
      </style>

      {/* Cow Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          { label: "Name", field: "name" },
          { label: "Breed", field: "breed" },
          { label: "Age", field: "age", type: "number" },
          { label: "Weight", field: "weight", type: "number" },
          { label: "Milk Production", field: "milkProduction", type: "number" },
          { label: "Milk Fat %", field: "milkFat", type: "number" },
          { label: "Image 1 URL", field: "image1" },
          { label: "Image 2 URL", field: "image2" },
        ].map((input) => (
          <div key={input.field as string}>
            <label className="block text-gray-400 mb-1">{input.label}</label>
            <input
              type={input.type || "text"}
              value={cow[input.field as keyof Cow] ?? ""}
              onChange={(e) =>
                handleChange(
                  input.field as keyof Cow,
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

      {/* Collapsible Sections */}
      {[
        {
          key: "medicines",
          label: "Medicines",
          items: cow.medicines,
          addItem: addMedicine,
          removeItem: removeMedicine,
        },
        {
          key: "medicineToConsume",
          label: "Medicine To-Consume",
          items: cow.medicineToConsume,
          addItem: addToConsume,
          removeItem: removeToConsume,
        },
        {
          key: "pregnancies",
          label: "Pregnancies",
          items: cow.pregnancies,
          addItem: addPregnancy,
          removeItem: removePregnancy,
        },
        {
          key: "calves",
          label: "Link Baby Calves IDs",
          items: cow.calves || [],
          addItem: addCalf,
          removeItem: removeCalf,
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
                  {section.key === "pregnancies" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Notes */}
                      <textarea
                        placeholder="Notes"
                        value={item.notes ?? ""}
                        onChange={(e) =>
                          handlePregnancyChange(i, "notes", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white col-span-1 md:col-span-2"
                        rows={2}
                      />

                      {/* Start Date */}
                      <input
                        type="date"
                        value={formatDate(item.startDate)}
                        onChange={(e) =>
                          handlePregnancyChange(i, "startDate", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white"
                      />

                      {/* Due Date */}
                      <input
                        type="date"
                        value={formatDate(item.dueDate)}
                        onChange={(e) =>
                          handlePregnancyChange(i, "dueDate", e.target.value)
                        }
                        className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white"
                      />

                      {/* Delivered */}
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={item.delivered ?? false}
                          onChange={(e) =>
                            handlePregnancyChange(
                              i,
                              "delivered",
                              e.target.checked
                            )
                          }
                        />
                        Delivered
                      </label>
                    </div>
                  )}

                  {section.key === "calves" && (
                    <input
                      type="text"
                      placeholder="Enter the Calf ID"
                      value={typeof item === "string" ? item : item?._id || ""}
                      onChange={(e) => handleCalfChange(i, e.target.value)}
                      className="p-2 rounded bg-[#0f131a] border border-gray-600 text-white w-full"
                    />
                  )}
                </div>
              ))}

              <button
                onClick={section.addItem}
                className="px-4 py-2 bg-green-600 rounded text-white mt-2"
              >
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
