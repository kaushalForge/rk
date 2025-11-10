// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Cow from "@/models/Cow";
// import Calf from "@/models/Calf";

// export async function GET(req: Request) {
//   await dbConnect();

//   try {
//     const cows = await Cow.find();
//     const calves = await Calf.find();

//     // Cow Data
//     const dailyMilkData = cows.map((cow) => ({
//       cowId: cow._id.toString(),
//       milk: cow.milkProduction || 0,
//     }));
//     const dailyCowHealth = [
//       { status: "Healthy", count: cows.filter((c) => !c.isSick).length },
//       { status: "Sick", count: cows.filter((c) => c.isSick).length },
//     ];
//     const dailyPregnancy = [
//       { status: "Pregnant", count: cows.filter((c) => c.isPregenant).length },
//       {
//         status: "Not Pregnant",
//         count: cows.filter((c) => !c.isPregenant).length,
//       },
//     ];
//     const dailyMedicines = [
//       {
//         category: "Taken",
//         count: cows.reduce(
//           (acc, c) =>
//             acc + (c.medicines?.filter((m) => m.hasTaken).length || 0),
//           0
//         ),
//       },
//       {
//         category: "Pending",
//         count: cows.reduce(
//           (acc, c) =>
//             acc + (c.medicines?.filter((m) => !m.hasTaken).length || 0),
//           0
//         ),
//       },
//     ];

//     // Calf Data
//     const dailyCalfData = calves.map((c) => ({
//       calfId: c._id.toString(),
//       weight: c.weight || 0,
//       age: c.age || 0,
//     }));
//     const dailyCalfHealth = [
//       { status: "Healthy", count: calves.filter((c) => !c.isSick).length },
//       { status: "Sick", count: calves.filter((c) => c.isSick).length },
//     ];

//     // Weekly & Monthly (same logic, replicate daily for now)
//     const weekly = {
//       milkData: dailyMilkData,
//       healthData: dailyCowHealth,
//       pregnancyData: dailyPregnancy,
//       medicinesData: dailyMedicines,
//       calfData: dailyCalfData,
//       calfHealthData: dailyCalfHealth,
//     };
//     const monthly = {
//       milkData: dailyMilkData,
//       healthData: dailyCowHealth,
//       pregnancyData: dailyPregnancy,
//       medicinesData: dailyMedicines,
//       calfData: dailyCalfData,
//       calfHealthData: dailyCalfHealth,
//     };

//     return NextResponse.json({
//       daily: {
//         milkData: dailyMilkData,
//         healthData: dailyCowHealth,
//         pregnancyData: dailyPregnancy,
//         medicinesData: dailyMedicines,
//         calfData: dailyCalfData,
//         calfHealthData: dailyCalfHealth,
//       },
//       weekly,
//       monthly,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch combined reports" },
//       { status: 500 }
//     );
//   }
// }
