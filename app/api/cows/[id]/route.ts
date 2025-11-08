import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";
import Calf from "@/models/Calf";
import mongoose from "mongoose";

// GET /api/cows/:id
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    await dbConnect();

    const { id } = await ctx.params; // await the params
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const cow = await Cow.findById(id).populate("calves", "name _id").lean();

    if (!cow) {
      return NextResponse.json(
        { success: false, message: "Cow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cow }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cow:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/cows/:id
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

    // Ensure all arrays exist
    body.medicines = body.medicines || [];
    body.medicineToConsume = body.medicineToConsume || [];
    body.calves = body.calves || [];

    // ✅ Validate each calf ID if provided
    if (Array.isArray(body.calves) && body.calves.length > 0) {
      for (const calfId of body.calves) {
        if (!mongoose.Types.ObjectId.isValid(calfId)) {
          return NextResponse.json(
            { success: false, message: `Invalid calf ID format: ${calfId}` },
            { status: 400 }
          );
        }

        const calfExists = await Calf.exists({ _id: calfId });
        if (!calfExists) {
          return NextResponse.json(
            { success: false, message: `Calf not found for ID: ${calfId}` },
            { status: 404 }
          );
        }
      }
    }

    // ✅ Handle pregnancies structure
    if (body.pregnancies) {
      body.pregnancies = body.pregnancies.map((p: any) => ({
        attempt: p.attempt ?? 1,
        startDate: p.startDate || null,
        dueDate: p.dueDate || null,
        delivered: p.delivered ?? false,
        notes: p.notes || null,
      }));
    } else {
      body.pregnancies = [];
    }

    // ✅ Update cow (replacing calves array)
    const updatedCow = await Cow.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          age: body.age,
          weight: body.weight,
          medicines: body.medicines,
          medicineToConsume: body.medicineToConsume,
          pregnancies: body.pregnancies,
          calves: body.calves, // <-- Replace with new calves array
        },
      },
      { new: true, runValidators: true }
    ).populate("calves", "name _id");

    if (!updatedCow) {
      return NextResponse.json(
        { success: false, message: "Cow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cow updated successfully", data: updatedCow },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating cow:", error);
    let message = "Server error";

    if (error.name === "ValidationError") {
      message = error.message;
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
