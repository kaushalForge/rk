import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Calf from "@/models/Calf";

// ✅ GET: Fetch calf by ID
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Calf ID is required" },
        { status: 400 }
      );
    }

    const calf = await Calf.findById(id).lean();
    if (!calf) {
      return NextResponse.json(
        { success: false, message: "Calf not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, calf }, { status: 200 });
  } catch (error) {
    console.error("Error fetching calf:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/calves/:id
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await ctx.params;
    const body = await req.json();

    // ✅ Clean and isolate each field explicitly
    const updateData = {
      calfId: body.calfId || "",
      name: body.name || "",
      image1: body.image1 || "",
      image2: body.image2 || "",
      isPregnant: !!body.isPregnant,
      medicines: Array.isArray(body.medicines)
        ? body.medicines.map((m: any) => ({
            name: m.name || "",
            dateGiven: m.dateGiven || null,
            dosage: m.dosage || "",
            hasTaken: !!m.hasTaken,
            note: m.note || "",
          }))
        : [],
    };

    // ✅ Prevent medicineToConsume from being nested inside medicines
    const updatedCalf = await Calf.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCalf)
      return NextResponse.json(
        { success: false, message: "Calf not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "✅ Calf updated successfully",
      data: updatedCalf,
    });
  } catch (error) {
    console.error("Error updating calf:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
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
    const deletedCalf = await Calf.findByIdAndDelete(id);

    if (!deletedCalf) {
      return NextResponse.json(
        { success: false, message: "Calf not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Calf deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🐄 Delete Calf error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete Calf", error },
      { status: 500 }
    );
  }
}
