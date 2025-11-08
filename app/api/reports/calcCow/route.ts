import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cow from "@/models/Cow";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const cows = await Cow.find();

    // Helper function to calculate counts
    const countBy = (arr: any[], key: string, value: any) =>
      arr.filter((item) => item[key] === value).length;

    // === Daily Stats ===
    const dailyMilkData = cows.map((cow) => ({
      cowId: cow._id.toString(),
      milk: cow.milkProduction || 0,
    }));

    const dailyHealthData = [
      { status: "Healthy", count: countBy(cows, "isSick", false) },
      { status: "Sick", count: countBy(cows, "isSick", true) },
    ];

    const dailyPregnancyData = [
      { status: "Pregnant", count: countBy(cows, "isPregenant", true) },
      { status: "Not Pregnant", count: countBy(cows, "isPregenant", false) },
    ];

    // === Weekly & Monthly ===
    // For simplicity, you can sum milk production in last 7 days / 30 days if you store historical logs
    // Here we'll mock by using same milk values for now
    const weeklyMilkData = dailyMilkData;
    const monthlyMilkData = dailyMilkData;

    const weeklyHealthData = dailyHealthData;
    const monthlyHealthData = dailyHealthData;

    const weeklyPregnancyData = dailyPregnancyData;
    const monthlyPregnancyData = dailyPregnancyData;

    return NextResponse.json({
      daily: {
        milkData: dailyMilkData,
        healthData: dailyHealthData,
        pregnancyData: dailyPregnancyData,
      },
      weekly: {
        milkData: weeklyMilkData,
        healthData: weeklyHealthData,
        pregnancyData: weeklyPregnancyData,
      },
      monthly: {
        milkData: monthlyMilkData,
        healthData: monthlyHealthData,
        pregnancyData: monthlyPregnancyData,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cow reports" }, { status: 500 });
  }
}
