import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

// 🐮 GET /api/add-cow — fetch all cows
export async function GET() {
  try {
    await dbConnect();
    const cows = await Cow.find();
    return NextResponse.json({ success: true, data: cows }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching cows:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cows." },
      { status: 500 }
    );
  }
}

// 🧬 POST /api/add-cow — create new cow
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      cowId,
      name,
      breed,
      age,
      weight,
      milkProduction,
      image1,
      image2,
      medicines,
      medicineToConsume,
      pregnancies,
      calves,
      isPregnant,
      isFertilityConfirmed,
      isSick,
      breedingDate,
      embryonicDeathDate,
      expectedCalvingDate,
      earlyDewormingDate,
      preCalvingMetabolicSupplimentDate,
      lateDewormingDate,
      calvingDate,
      calvingCount,
    } = body;

    // ✅ Basic validation
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

    // ✅ Safely parse and clean incoming values
    const parseDate = (value: any) => {
      if (!value || value === "N/A") return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    };

    const parseNumber = (value: any) => {
      if (value === "" || value === "N/A" || value === null || isNaN(value))
        return null;
      return Number(value);
    };

    // ✅ Create new cow
    const newCow = await Cow.create({
      cowId: cowId || undefined,
      name,
      breed: breed || "N/A",
      age: parseNumber(age),
      weight: parseNumber(weight),
      milkProduction: parseNumber(milkProduction),
      image1,
      image2: image2 || "N/A",
      medicines: Array.isArray(medicines) ? medicines : [],
      medicineToConsume: Array.isArray(medicineToConsume)
        ? medicineToConsume
        : [],
      pregnancies: Array.isArray(pregnancies) ? pregnancies : [],
      linkedCalves:
        Array.isArray(calves) && calves.length > 0
          ? calves.map((id: string) => ({ calfId: id }))
          : [],
      breedingDate: parseDate(breedingDate),
      embryonicDeathDate: parseDate(embryonicDeathDate),
      expectedCalvingDate: parseDate(expectedCalvingDate),
      earlyDewormingDate: parseDate(earlyDewormingDate),
      preCalvingMetabolicSupplimentDate: parseDate(
        preCalvingMetabolicSupplimentDate
      ),
      lateDewormingDate: parseDate(lateDewormingDate),
      calvingDate: parseDate(calvingDate),
      calvingCount: parseNumber(calvingCount) ?? 0,
      isPregnant: Boolean(isPregnant),
      isFertilityConfirmed: Boolean(isFertilityConfirmed),
      isSick: Boolean(isSick),
    });

    return NextResponse.json(
      { success: true, message: "🐄 Cow added successfully!", data: newCow },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error adding cow:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add cow." },
      { status: 500 }
    );
  }
}
