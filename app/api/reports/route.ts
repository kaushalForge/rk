// /app/api/reports/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

/**
 * POST /api/reports
 * Push report data (Tables 1–5 + charts)
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Ensure valid structure
    if (
      !data?.reproductiveRecords ||
      !Array.isArray(data.reproductiveRecords)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid report data format" },
        { status: 400 }
      );
    }

    // Save or update cows
    for (const cow of data.reproductiveRecords) {
      await Cow.findOneAndUpdate(
        { name: cow.name, cowId: cow.cowId },
        {
          breed: cow.breed || "N/A",
          breedingDate: cow.breedingDate || null,
          embryonicDeathDate: cow.embryonicDeathDate || null,
          expectedCalvingDate: cow.expectedCalvingDate || null,
          earlyDewormingDate: cow.earlyDewormingDate || null,
          preCalvingMetabolicSupplimentDate:
            cow.preCalvingMetabolicSupplimentDate || null,
          lateDewormingDate: cow.lateDewormingDate || null,
          calvingDate: cow.calvingDate || null,
          calvingCount: cow.calvingCount || 0,
          isFertilityConfirmed: cow.isFertilityConfirmed || false,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report data successfully saved!",
    });
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { success: false, message: "Server error while saving report" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reports
 * Fetch combined report data from database
 */
export async function GET() {
  try {
    await dbConnect();
    const cows = await Cow.find().lean();
    const totalMilk = cows.reduce((sum, cow) => sum + cow.milkProduction, 0);

    // Calculate average
    const averageMilkProduced = totalMilk / cows.length;
    console.log("Average milk produced:", averageMilkProduced); // 18.6

    const basicInfo = cows.map((cow) => ({
      _id: cow._id,
      cowId: cow.cowId,
      name: cow.name,
      breed: cow.breed,
      age: cow.age,
      weight: cow.weight,
      milkProduction: cow.milkProduction,
      isSick: cow.isSick,
      isPregnant: cow.isPregnant,
    }));

    const reproductiveRecords = cows.map((cow) => ({
      _id: cow._id,
      cowId: cow.cowId,
      name: cow.name,
      breedingDate: cow.breedingDate,
      embryonicDeathDate: cow.embryonicDeathDate,
      expectedCalvingDate: cow.expectedCalvingDate,
      earlyDewormingDate: cow.earlyDewormingDate,
      preCalvingMetabolicSupplimentDate: cow.preCalvingMetabolicSupplimentDate,
      lateDewormingDate: cow.lateDewormingDate,
      calvingDate: cow.calvingDate,
      calvingCount: cow.calvingCount,
      isFertilityConfirmed: cow.isFertilityConfirmed,
    }));

    return NextResponse.json({
      success: true,
      reportData: {
        basicInfo,
        reproductiveRecords,
        totalCows: cows.length,
        totalPregnant: cows.filter((c) => c.isPregnant).length,
        totalFertilized: cows.filter((c) => c.isFertilityConfirmed).length,
        totalSick: cows.filter((c) => c.isSick).length,
        averageMilkProduced: averageMilkProduced,
      },
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching report" },
      { status: 500 }
    );
  }
}
