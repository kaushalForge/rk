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
      name: body.name || "",
      breed: body.breed || "",
      age: body.age ?? null,
      weight: body.weight ?? null,
      image1: body.image1 || "",
      image2: body.image2 || "",
      isPregenant: !!body.isPregenant,
      isSick: !!body.isSick,
      medicines: Array.isArray(body.medicines)
        ? body.medicines.map((m: any) => ({
            name: m.name || "",
            dateGiven: m.dateGiven || null,
            dosage: m.dosage || "",
            hasTaken: !!m.hasTaken,
            note: m.note || "",
          }))
        : [],
      medicineToConsume: Array.isArray(body.medicineToConsume)
        ? body.medicineToConsume.map((m: any) => ({
            name: m.name || "",
            medicineNote: m.medicineNote || "",
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
