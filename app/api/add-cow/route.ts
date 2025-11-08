import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

// GET /api/add-cow — fetch all cows
export async function GET() {
  try {
    await dbConnect();

    const cows = await Cow.find();
    return NextResponse.json({ success: true, data: cows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cows:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cows." },
      { status: 500 }
    );
  }
}

// POST /api/add-cow — create new cow
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
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
      isPregenant,
      isSick,
    } = body;

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

    const newCow = await Cow.create({
      name,
      breed: breed || "",
      age: age || null,
      weight: weight || null,
      milkProduction: milkProduction || null,
      image1,
      image2: image2 || "",
      medicines: medicines || [],
      medicineToConsume: medicineToConsume || [],
      pregnancies: pregnancies || [],
      calves: calves || [],
      isPregenant: isPregenant || false,
      isSick: isSick || false,
    });

    return NextResponse.json(
      { success: true, message: "🐄 Cow added successfully!", data: newCow },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding cow:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add cow." },
      { status: 500 }
    );
  }
}
