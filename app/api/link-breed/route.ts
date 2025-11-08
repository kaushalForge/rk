import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CowModel from "@/models/Cow";
import CalfModel from "@/models/Calf";

export async function GET() {
  try {
    await dbConnect();
    const cows = await CowModel.find().populate("calves");
    return NextResponse.json(cows);
  } catch (error) {
    console.error("Error fetching cows:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { cowId, calfData } = await req.json();

    // ✅ 1. Create new calf
    const newCalf = await CalfModel.create(calfData);

    // ✅ 2. Link calf to cow
    await CowModel.findByIdAndUpdate(
      cowId,
      { $push: { calves: newCalf._id } },
      { new: true }
    );

    return NextResponse.json({ success: true, calf: newCalf });
  } catch (error) {
    console.error("Error linking calf:", error);
    return NextResponse.json({ error: "Failed to link calf" }, { status: 500 });
  }
}
