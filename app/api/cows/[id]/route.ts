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
    // Ensure arrays exist
    body.medicines = Array.isArray(body.medicines) ? body.medicines : [];
    body.linkedCalves = Array.isArray(body.linkedCalves)
      ? body.linkedCalves
      : [];

    // Extract incoming IDs safely from body
    const incomingIds = body.linkedCalves
      .map((c: any) => c?.calfId?._id) // safely get _id
      .filter((id: any) => id); // remove null/undefined

    // Convert to ObjectId and structure correctly
    const fixedLinkedCalves = incomingIds.map((id: string) => ({
      calfId: new mongoose.Types.ObjectId(id),
    }));

    // Assign back to body
    body.linkedCalves = fixedLinkedCalves;

    // 🔥 CHECK: Prevent linking same calf ID twice in the request body
    const hasDuplicates = new Set(incomingIds).size !== incomingIds.length;

    if (hasDuplicates) {
      return NextResponse.json(
        { success: false, message: "Calf already linked (duplicate detected)" },
        { status: 400 }
      );
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
          cowId: body.cowId,
          name: body.name,
          image1: body.image1,
          image2: body.image2,
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
          pregnancies,
          linkedCalves: fixedLinkedCalves,
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
// Delte /api/cows/:id
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await ctx.params;

    const deletedCow = await Cow.findByIdAndDelete(id);

    if (!deletedCow) {
      return NextResponse.json(
        { success: false, message: "Cow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cow deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🐄 Delete cow error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete cow", error },
      { status: 500 }
    );
  }
}
