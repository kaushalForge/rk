import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Calf from "@/models/Calf";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const calves = await Calf.find();

    const dailyCalfData = calves.map((calf) => ({
      calfId: calf._id.toString(),
      weight: calf.weight || 0,
      age: calf.age || 0,
    }));

    const dailyHealthData = [
      { status: "Healthy", count: calves.filter((c) => !c.isSick).length },
      { status: "Sick", count: calves.filter((c) => c.isSick).length },
    ];

    // Weekly & Monthly: For simplicity, replicate daily for now
    const weeklyCalfData = dailyCalfData;
    const monthlyCalfData = dailyCalfData;

    const weeklyHealthData = dailyHealthData;
    const monthlyHealthData = dailyHealthData;

    return NextResponse.json({
      daily: { calfData: dailyCalfData, healthData: dailyHealthData },
      weekly: { calfData: weeklyCalfData, healthData: weeklyHealthData },
      monthly: { calfData: monthlyCalfData, healthData: monthlyHealthData },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch calf reports" },
      { status: 500 }
    );
  }
}
