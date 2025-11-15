"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import UpdateSection1 from "@/components/updateUI/Section1/page";
import UpdateSection2 from "@/components/updateUI/Section2/page";

export default function UpdateCowPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchCow = async () => {
      try {
        const res = await axios.get(`/api/cows/${id}`);
        const data = res.data.cow;
        setForm({
          cowId: data.cowId || "",
          name: data.name || "",
          image1: data.image1 || "",
          image2: data.image2 || "",
          milkProduction: data.milkProduction || "",
          linkedCalves: data.linkedCalves ?? [],
          breedingDate: data.breedingDate?.split("T")[0] || "",
          embryonicDeathDate: data.embryonicDeathDate?.split("T")[0] || "",
          expectedCalvingDate: data.expectedCalvingDate?.split("T")[0] || "",
          earlyDewormingDate: data.earlyDewormingDate?.split("T")[0] || "",
          preCalvingMetabolicSupplimentDate:
            data.preCalvingMetabolicSupplimentDate?.split("T")[0] || "",
          lateDewormingDate: data.lateDewormingDate?.split("T")[0] || "",
          calvingDate: data.calvingDate?.split("T")[0] || "",
          calvingCount: data.calvingCount || 0,
          medicines: data.medicines || [],
          pregnancies: data.pregnancies || [],
          isPregnant: data.isPregnant ?? false,
          isFertilityConfirmed: data.isFertilityConfirmed ?? false,
        });
      } catch (err) {
        console.error("Error fetching cow", err);
      }
    };

    if (id) fetchCow();
  }, [id]);

  const updateCow = async () => {
    try {
      await axios.put(`/api/cows/${id}`, form);
      toast.success("Cow updated successfully!", {
        duration: 2000,
        position: "top-center",
        richColors: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    }
  };

  const deleteCow = async () => {
    toast.custom(
      (t) => (
        <div className="bg-[#0d1117] text-white p-4 rounded-xl shadow-lg border border-gray-700 max-w-sm">
          <p className="font-semibold mb-3">
            Are you sure you want to delete this cow?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded"
              onClick={async () => {
                try {
                  await axios.delete(`/api/cows/${id}`);
                  toast.dismiss(t);
                  toast.success("Cow deleted successfully!", {
                    position: "top-center",
                    richColors: true,
                  });
                  router.push("/dashboard");
                } catch (err) {
                  console.error(err);
                  toast.dismiss(t);
                  toast.error("Error deleting cow");
                }
              }}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        richColors: true,
      }
    );
  };
  if (!form)
    return <div className="text-gray-300 p-10 text-center">Loading cow...</div>;

  return (
    <div className="p-6">
      <UpdateSection1 form={form} setForm={setForm} />
      <UpdateSection2 form={form} setForm={setForm} />

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={updateCow}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Update Cow
        </button>
        <button
          onClick={deleteCow}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Delete Cow
        </button>
      </div>
    </div>
  );
}
