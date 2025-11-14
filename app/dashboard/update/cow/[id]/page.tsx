"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import UpdateSection1 from "@/components/updateUI/Section1/page";
import UpdateSection2 from "@/components/updateUI/Section2/page";

export default function UpdateCowPage() {
  const { id } = useParams();

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
          linkedCalves: data.linkedCalves.map((c: any) =>
            c?.calfId?._id ? c.calfId._id : c.calfId
          ),
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
        console.log(form.linkedCalves, "linked");
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

  if (!form)
    return <div className="text-gray-300 p-10 text-center">Loading cow...</div>;

  return (
    <div className="p-6">
      <UpdateSection1 form={form} setForm={setForm} />
      <UpdateSection2 form={form} setForm={setForm} />

      <button
        onClick={updateCow}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Update Cow
      </button>
    </div>
  );
}
