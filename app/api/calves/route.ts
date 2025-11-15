// /app/api/calves/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Calf from "@/models/Calf";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query: any = {};

    // ✅ Name search (case-insensitive)
    const name = searchParams.get("name");
    if (name) query.name = { $regex: name, $options: "i" };

    // ✅ Pregnancy filter only if explicitly set
    const isPregnantParam = searchParams.get("isPregnant");
    if (isPregnantParam === "true") query.isPregnant = true;
    else if (isPregnantParam === "false") query.isPregnant = false;
    // else leave it undefined to return all calves

    const calves = await Calf.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, calves }, { status: 200 });
  } catch (error) {
    console.error("🐮 Calf filter error:", error);
    return NextResponse.json(
      { message: "Error filtering calves", error },
      { status: 500 }
    );
  }
}
