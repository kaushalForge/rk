// /app/api/calves/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Calf from "@/models/Calf";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all calves
    const calves = await Calf.find();
    return NextResponse.json({ success: true, data: calves }, { status: 200 });
  } catch (error) {
    console.error("Error fetching calves:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calves" },
      { status: 500 }
    );
  }
}
