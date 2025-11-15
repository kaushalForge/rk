// /app/api/cows/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query: any = {};

    // ✅ Name search (case-insensitive)
    const name = searchParams.get("name");
    if (name) query.name = { $regex: name, $options: "i" };

    // ✅ Pregnancy filter (only if explicitly provided)
    const isPregnantParam = searchParams.get("isPregnant");
    if (isPregnantParam === "true") query.isPregnant = true;
    else if (isPregnantParam === "false") query.isPregnant = false;

    // ✅ Milk production range filter
    const milkMin = searchParams.get("milkProductionMin");
    const milkMax = searchParams.get("milkProductionMax");
    if (milkMin || milkMax) {
      query.milkProduction = {};
      if (milkMin) query.milkProduction.$gte = Number(milkMin);
      if (milkMax) query.milkProduction.$lte = Number(milkMax);
    }

    const cows = await Cow.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, cows }, { status: 200 });
  } catch (error) {
    console.error("🐄 Cow filter error:", error);
    return NextResponse.json(
      { message: "Error filtering cows", error },
      { status: 500 }
    );
  }
}
