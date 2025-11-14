"use client";
import React from "react";

/* UTIL — KEEP AS IS */
const formatDateInput = (value?: string | null) => {
  if (!value) return "";
  let v = value.replace(/\D/g, "");
  if (v.length > 8) v = v.slice(0, 8);
  if (v.length >= 4) v = v.slice(0, 4) + "-" + v.slice(4);
  if (v.length >= 7) v = v.slice(0, 7) + "-" + v.slice(7);
  return v;
};

export default function Section2({ form, setForm }: any) {
  if (!form) {
    return (
      <div className="text-gray-200 p-10 text-center">Loading cow data...</div>
    );
  }

  /* DELETE MEDICINE */
  const deleteMedicine = (idx: number) => {
    const updated = form.medicines.filter((_: any, i: number) => i !== idx);
    setForm({ ...form, medicines: updated });
  };

  /* TOGGLE MEDICINE STATUS */
  const toggleMedicineTaken = (idx: number) => {
    const updated = [...form.medicines];
    updated[idx].hasTaken = !updated[idx].hasTaken;
    setForm({ ...form, medicines: updated });
  };

  /* DELETE PREGNANCY */
  const deletePregnancy = (idx: number) => {
    const updated = form.pregnancies.filter((_: any, i: number) => i !== idx);
    setForm({ ...form, pregnancies: updated });
  };

  return (
    <section className="p-8 text-gray-200">
      <h2 className="text-xl font-semibold mb-6">
        Breeding & Reproductive Records
      </h2>

      <form>
        {/* DATE FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "breedingDate",
            "embryonicDeathDate",
            "expectedCalvingDate",
            "earlyDewormingDate",
            "preCalvingMetabolicSupplimentDate",
            "lateDewormingDate",
            "calvingDate",
          ].map((field) => (
            <div key={field}>
              <label className="text-gray-400 text-sm capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>

              <input
                type="text"
                name={field}
                maxLength={10}
                value={form[field] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [field]: formatDateInput(e.target.value),
                  })
                }
                placeholder="YYYY-MM-DD"
                className="w-full mt-1 bg-[#0D1524] p-3 rounded-lg border border-gray-700 text-gray-100"
              />
            </div>
          ))}

          <div>
            <label className="text-gray-400 text-sm">Calving Count</label>
            <input
              type="number"
              name="calvingCount"
              value={form.calvingCount ?? 0}
              onChange={(e) =>
                setForm({ ...form, calvingCount: Number(e.target.value) })
              }
              className="w-full mt-1 bg-[#0D1524] p-3 rounded-lg border border-gray-700 text-gray-100"
            />
          </div>
        </div>

        {/* MEDICINES */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Medicines</h3>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  medicines: [
                    ...(form.medicines || []),
                    {
                      name: "",
                      dateGiven: "",
                      dosage: "",
                      hasTaken: false,
                      note: "",
                    },
                  ],
                })
              }
              className="px-4 py-2 bg-blue-600/40 rounded-lg hover:bg-blue-600/60"
            >
              Add Medicine
            </button>
          </div>

          {(form.medicines || []).map((m: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-[#0a1220] rounded-xl border border-gray-700"
            >
              {/* NAME */}
              <input
                type="text"
                value={m.name}
                placeholder="Name"
                onChange={(e) => {
                  const updated = [...form.medicines];
                  updated[idx].name = e.target.value;
                  setForm({ ...form, medicines: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              {/* DATE */}
              <input
                type="text"
                value={formatDateInput(m.dateGiven)}
                maxLength={10}
                placeholder="YYYY-MM-DD"
                onChange={(e) => {
                  const updated = [...form.medicines];
                  updated[idx].dateGiven = formatDateInput(e.target.value);
                  setForm({ ...form, medicines: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              {/* DOSAGE */}
              <input
                type="text"
                value={m.dosage}
                placeholder="Dosage"
                onChange={(e) => {
                  const updated = [...form.medicines];
                  updated[idx].dosage = e.target.value;
                  setForm({ ...form, medicines: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              {/* NOTE */}
              <input
                type="text"
                value={m.note}
                placeholder="Note"
                onChange={(e) => {
                  const updated = [...form.medicines];
                  updated[idx].note = e.target.value;
                  setForm({ ...form, medicines: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              {/* STATUS + DELETE */}
              <div className="flex justify-between items-center mt-3 w-full">
                {/* STATUS TOGGLE BOX (Left) */}
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/20 h-12 w-72 shadow-md">
                  {/* FIXED LABEL */}
                  <span className="text-white font-semibold text-lg w-24 text-left block">
                    {m.hasTaken ? "Taken" : "Not Taken"}
                  </span>

                  {/* SLIDER TOGGLE */}
                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      checked={m.hasTaken ?? false}
                      onChange={() => toggleMedicineTaken(idx)}
                      className="sr-only peer"
                    />

                    <div
                      className="w-14 h-7 bg-white/20 rounded-full peer-checked:bg-green-500 transition-all
        after:absolute after:top-0.5 after:left-0.5 after:w-6 after:h-6 after:bg-white
        after:rounded-full after:shadow-lg after:transition-all
        peer-checked:after:translate-x-7"
                    ></div>
                  </label>
                </div>

                {/* DELETE BUTTON (Right) */}
                <button
                  type="button"
                  onClick={() => deleteMedicine(idx)}
                  className="flex items-center justify-center gap-2 px-6 h-12 
               bg-red-600/40 hover:bg-red-600/60 transition-all 
               rounded-xl border border-red-500/30 shadow-lg
               text-white font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
           a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PREGNANCIES */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pregnancies</h3>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  pregnancies: [
                    ...(form.pregnancies || []),
                    {
                      attempt: "",
                      startDate: "",
                      dueDate: "",
                      delivered: false,
                      notes: "",
                    },
                  ],
                })
              }
              className="px-4 py-2 bg-blue-600/40 rounded-lg hover:bg-blue-600/60"
            >
              Add Pregnancy
            </button>
          </div>

          {(form.pregnancies || []).map((p: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-[#0a1220] rounded-xl border border-gray-700"
            >
              <input
                type="number"
                value={p.attempt}
                placeholder="Attempt"
                onChange={(e) => {
                  const updated = [...form.pregnancies];
                  updated[idx].attempt = e.target.value;
                  setForm({ ...form, pregnancies: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              <input
                type="text"
                value={formatDateInput(p.startDate)}
                maxLength={10}
                placeholder="YYYY-MM-DD"
                onChange={(e) => {
                  const updated = [...form.pregnancies];
                  updated[idx].startDate = formatDateInput(e.target.value);
                  setForm({ ...form, pregnancies: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              <input
                type="text"
                value={formatDateInput(p.dueDate)}
                maxLength={10}
                placeholder="YYYY-MM-DD"
                onChange={(e) => {
                  const updated = [...form.pregnancies];
                  updated[idx].dueDate = formatDateInput(e.target.value);
                  setForm({ ...form, pregnancies: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              <input
                type="text"
                value={p.notes}
                placeholder="Notes"
                onChange={(e) => {
                  const updated = [...form.pregnancies];
                  updated[idx].notes = e.target.value;
                  setForm({ ...form, pregnancies: updated });
                }}
                className="p-3 bg-[#0D1524] rounded-lg border border-gray-700 text-gray-100"
              />

              {/* DELETE PREGNANCY BUTTON */}
              <button
                type="button"
                onClick={() => deletePregnancy(idx)}
                className="px-4 py-2 mt-3 bg-red-600/40 rounded-lg hover:bg-red-600/60"
              >
                Delete Pregnancy
              </button>
            </div>
          ))}
        </div>
      </form>
    </section>
  );
}
