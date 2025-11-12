import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";
import Calf from "@/models/Calf";
import mongoose from "mongoose";

// 🐮 GET /api/cows/:id
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const cow = await Cow.findById(id).populate(
      "linkedCalves.calfId",
      "name image1"
    );

    if (!cow) {
      return NextResponse.json(
        { success: false, message: "Cow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cow }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching cow:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// 🧬 PUT /api/cows/:id
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Cow ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Ensure arrays exist
    body.medicines = body.medicines || [];
    body.medicineToConsume = body.medicineToConsume || [];
    body.calves = body.calves || [];

    // ✅ Validate and format linked calves
    const validCalves: { calfId: mongoose.Types.ObjectId }[] = [];
    if (Array.isArray(body.calves) && body.calves.length > 0) {
      for (const calfId of body.calves) {
        if (!mongoose.Types.ObjectId.isValid(calfId)) {
          return NextResponse.json(
            { success: false, message: `Invalid calf ID: ${calfId}` },
            { status: 400 }
          );
        }
        const calf = await Calf.findById(calfId);
        if (!calf) {
          return NextResponse.json(
            { success: false, message: `Calf not found for ID: ${calfId}` },
            { status: 404 }
          );
        }
        validCalves.push({ calfId: calf._id });
      }
    }

    // ✅ Handle pregnancies
    const pregnancies = (body.pregnancies || []).map((p: any) => ({
      attempt: p.attempt ?? 1,
      startDate: p.startDate || null,
      dueDate: p.dueDate || null,
      delivered: p.delivered ?? false,
      notes: p.notes || null,
    }));

    // ✅ Update cow (matches schema fields)
    let updatedCow = await Cow.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          image1: body.image1,
          image2: body.image2,
          age: body.age,
          weight: body.weight,
          breed: body.breed,
          milkProduction: body.milkProduction,
          breedingDate: body.breedingDate,
          embryonicDeathDate: body.embryonicDeathDate,
          expectedCalvingDate: body.expectedCalvingDate,
          earlyDewormingDate: body.earlyDewormingDate,
          preCalvingMetabolicSupplimentDate:
            body.preCalvingMetabolicSupplimentDate,
          lateDewormingDate: body.lateDewormingDate,
          calvingDate: body.calvingDate,
          calvingCount: body.calvingCount,
          medicines: body.medicines,
          medicineToConsume: body.medicineToConsume,
          pregnancies,
          linkedCalves: validCalves,
          isPregnant: body.isPregnant,
          isSick: body.isSick,
          isFertilityConfirmed: body.isFertilityConfirmed,
        },
      },
      { new: true, runValidators: true }
    );

    // ✅ Populate linked calves again (safe)
    if (updatedCow) {
      try {
        updatedCow = await updatedCow.populate(
          "linkedCalves.calfId",
          "name image1"
        );
      } catch (popErr) {
        console.warn("⚠️ Population failed:", popErr);
      }
    }

    if (!updatedCow) {
      return NextResponse.json(
        { success: false, message: "Cow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cow updated successfully",
        data: updatedCow,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating cow:", error);
    const message =
      error.name === "ValidationError" ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
