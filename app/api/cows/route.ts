import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query: any = {};

    // ✅ Sick filter
    if (searchParams.get("isSick") === "true") query.isSick = true;

    // ✅ Pregnant filter
    if (searchParams.get("isPregnant") === "true") query.isPregnant = true;

    // ✅ Name search (case-insensitive)
    const name = searchParams.get("name");
    if (name) query.name = { $regex: name, $options: "i" };

    // ✅ Age range filter
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }

    // ✅ Milk production range
    const milkMin = searchParams.get("milkProductionMin");
    const milkMax = searchParams.get("milkProductionMax");
    if (milkMin || milkMax) {
      query.milkProduction = {};
      if (milkMin) query.milkProduction.$gte = Number(milkMin);
      if (milkMax) query.milkProduction.$lte = Number(milkMax);
    }

    // ✅ Low production alert
    if (searchParams.get("lowProductionAlert") === "true") {
      query.milkProduction = { $lt: 5 };
    }

    const cows = await Cow.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, cows }, { status: 200 });
  } catch (error) {
    console.error("🐄 Filter error:", error);
    return NextResponse.json(
      { message: "Error filtering cows", error },
      { status: 500 }
    );
  }
}
