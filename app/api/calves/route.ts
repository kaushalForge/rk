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

    // ✅ Boolean filters
    if (searchParams.get("isSick") === "true") query.isSick = true;
    if (searchParams.get("isPregnant") === "true") query.isPregnant = true;

    // ✅ Age range
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }

    // ✅ Weight range
    const weightMin = searchParams.get("weightMin");
    const weightMax = searchParams.get("weightMax");
    if (weightMin || weightMax) {
      query.weight = {};
      if (weightMin) query.weight.$gte = Number(weightMin);
      if (weightMax) query.weight.$lte = Number(weightMax);
    }

    // ✅ Time in farm filter (days)
    const timeInFarmDays = searchParams.get("timeInFarmDays");
    if (timeInFarmDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(timeInFarmDays));
      query.createdAt = { $gte: cutoff };
    }

    // Fetch filtered calves
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
