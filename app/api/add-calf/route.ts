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
    const { calfId, name, image1 } = body;

    console.log("CalfId & name", calfId, name);
    console.log("Image1", image1);

    const existingCalf = await Calf.findOne({ calfId });
    if (existingCalf > 0) {
      return NextResponse.json(
        { success: false, message: "A calf with this ID already exists." },
        { status: 400 }
      );
    }

    const newCalf = await Calf.create({ calfId, name, image1 });
    return NextResponse.json(
      {
        success: true,
        message: "🐮 Calf added successfully!",
        data: newCalf,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error adding calf:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add calf." },
      { status: 500 }
    );
  }
}
