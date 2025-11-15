"use client";

import { FaBaby, FaSeedling } from "react-icons/fa";

export default function Section1({ form, setForm }: any) {
  if (!form) {
    return (
      <div className="text-gray-200 p-10 text-center">Loading cow data...</div>
    );
  }

  return (
    <section className="w-full h-full p-6">
      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        {/* Images */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <img
              className="h-52 w-52 object-cover object-top rounded-xl shadow-md"
              src={form?.image1}
            />
            <h3 className="text-gray-300 mt-2">Image 1</h3>
          </div>

          {form?.image2 !== "N/A" && (
            <div className="text-center">
              <img
                className="h-52 w-52 object-cover object-top rounded-xl shadow-md"
                src={form.image2}
              />
              <h3 className="text-gray-300 mt-2">Image 2</h3>
            </div>
          )}
        </div>

        {/* RIGHT SIDE TOGGLE MENU */}
        <div className="flex flex-col gap-6 w-full md:w-auto">
          {/* Pregnant Toggle */}
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/20">
            <FaBaby className="text-pink-400 text-2xl animate-pulse" />
            <span className="text-white font-semibold text-lg">Pregnant</span>

            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={form.isPregnant ?? false}
                onChange={(e) =>
                  setForm({ ...form, isPregnant: e.target.checked })
                }
                className="sr-only peer"
              />
              <div
                className="w-14 h-7 bg-white/20 rounded-full peer-checked:bg-pink-400 transition-all 
                after:absolute after:top-0.5 after:left-0.5 after:w-6 after:h-6 after:bg-white 
                after:rounded-full after:shadow-lg after:transition-all 
                peer-checked:after:translate-x-7"
              ></div>
            </label>
          </div>

          {/* Fertilized Toggle */}
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/20">
            <FaSeedling className="text-green-400 text-2xl animate-pulse" />
            <span className="text-white font-semibold text-lg">Fertilized</span>

            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={form.isFertilityConfirmed ?? false}
                onChange={(e) =>
                  setForm({ ...form, isFertilityConfirmed: e.target.checked })
                }
                className="sr-only peer"
              />
              <div
                className="w-14 h-7 bg-white/20 rounded-full peer-checked:bg-green-400 transition-all 
                after:absolute after:top-0.5 after:left-0.5 after:w-6 after:h-6 after:bg-white 
                after:rounded-full after:shadow-lg after:transition-all 
                peer-checked:after:translate-x-7"
              ></div>
            </label>
          </div>
        </div>
      </div>

      {/* FORM FIELDS */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-300 text-sm">Cow ID</label>
          <input
            type="text"
            value={form.cowId}
            onChange={(e) => setForm({ ...form, cowId: e.target.value })}
            className="w-full mt-1 p-3 rounded-lg bg-[#0d1522] border border-gray-700 
            text-gray-100 shadow-inner outline-none"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 p-3 rounded-lg bg-[#0d1522] border border-gray-700 
            text-gray-100 shadow-inner outline-none"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Image 1 URL</label>
          <input
            type="text"
            value={form.image1}
            onChange={(e) => setForm({ ...form, image1: e.target.value })}
            className="w-full mt-1 p-3 rounded-lg bg-[#0d1522] border border-gray-700 text-gray-100"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Image 2 URL</label>
          <input
            type="text"
            value={form.image2}
            onChange={(e) => setForm({ ...form, image2: e.target.value })}
            className="w-full mt-1 p-3 rounded-lg bg-[#0d1522] border border-gray-700 text-gray-100"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Milk Production</label>
          <input
            type="text"
            value={form.milkProduction}
            onChange={(e) =>
              setForm({ ...form, milkProduction: e.target.value })
            }
            className="w-full mt-1 p-3 rounded-lg bg-[#0d1522] border border-gray-700 text-gray-100"
          />
        </div>

        {/* {Linked Calves} */}
        <div>
          <label className="text-gray-300 text-sm">Linked Calves</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {form.linkedCalves?.map((c: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded"
              >
                {c.calfId?._id || c.calfId?.name || "New"}
                <button
                  type="button"
                  onClick={() => {
                    const newLinked = [...form.linkedCalves];
                    newLinked.splice(index, 1);
                    setForm({ ...form, linkedCalves: newLinked });
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter calf ID and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (!val) return;

                const newLinked = [
                  ...(form.linkedCalves || []),
                  { _id: null, calfId: { _id: val, name: "" } },
                ];
                setForm({ ...form, linkedCalves: newLinked });
                e.currentTarget.value = "";
              }
            }}
            className="w-full mt-1 p-3 rounded-lg bg-[#0d1522] border border-gray-700 text-gray-100"
          />
        </div>
      </div>
    </section>
  );
}
