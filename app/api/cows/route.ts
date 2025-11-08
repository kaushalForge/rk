import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

export async function GET() {
  try {
    await dbConnect();
    const cows = await Cow.find();
    return NextResponse.json({ success: true, cows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cows:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cows" },
      { status: 500 }
    );
  }
}
