import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Calf from "@/models/Calf";

// GET /api/add-calf — fetch all calves
export async function GET() {
  try {
    await dbConnect();

    const calves = await Calf.find().lean();

    return NextResponse.json({ success: true, data: calves }, { status: 200 });
  } catch (error) {
    console.error("Error fetching calves:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calves." },
      { status: 500 }
    );
  }
}

// POST /api/add-calf — create new calf
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      name,
      breed,
      age,
      weight,
      image1,
      image2,
      medicines,
      medicineToConsume, // ✅ added
      isPregenant,
      isSick,
    } = body;

    // Mandatory checks
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }
    if (!image1) {
      return NextResponse.json(
        { success: false, message: "Primary image (image1) is required." },
        { status: 400 }
      );
    }

    // ✅ Create new calf properly
    const newCalf = await Calf.create({
      name,
      breed: breed || "",
      age: age || null,
      weight: weight || null,
      image1,
      image2: image2 || "",
      medicines: medicines || [],
      medicineToConsume: medicineToConsume || [], // ✅ now included separately
      isPregenant: isPregenant || false,
      isSick: isSick || false,
    });

    return NextResponse.json(
      { success: true, message: "🐮 Calf added successfully!", data: newCalf },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding calf:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add calf." },
      { status: 500 }
    );
  }
}
