// pages/api/reports/[type].ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Reports";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query;

  await dbConnect();

  try {
    // Get last 30 reports sorted by date descending
    const reports = await Report.find().sort({ date: -1 }).limit(30);

    // Helper function for cow metrics
    const getCowMetrics = (reports: any[]) => {
      return {
        milkData: reports.map((r) => ({ date: r.date, milk: r.monthlyMilk })),
        healthData: reports.map((r) => ({
          healthy: r.healthData.filter((c: any) => c.status === "healthy")
            .length,
          sick: r.healthData.filter((c: any) => c.status === "sick").length,
          total: r.healthData.length,
        })),
        pregnancyData: reports.map((r) => ({
          pregnant: r.healthData.filter((c: any) => c.pregnant).length,
          nonPregnant: r.healthData.filter((c: any) => !c.pregnant).length,
        })),
        medicinesData: reports.map((r) => r.medicinesData),

        weightData: reports.map((r) => r.weightData),
      };
    };

    switch (type) {
      case "cow":
        return res.json(getCowMetrics(reports));

      case "calf":
        return res.json({
          calfData: reports.map((r) => r.calfData),
        });

      case "combo":
        return res.json({
          ...getCowMetrics(reports),
          calfData: reports.map((r) => r.calfData),
        });

      default:
        return res.status(400).json({ error: "Invalid report type" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
}
