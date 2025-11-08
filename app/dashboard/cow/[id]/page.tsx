// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { FaSyringe, FaBaby, FaCow } from "react-icons/fa";
// import { MdHealthAndSafety } from "react-icons/md";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import Link from "next/link";

// interface Medicine {
//   name: string;
//   dateGiven?: string;
//   dosage?: string;
//   taken?: boolean;
//   note?: string;
// }

// interface Cow {
//   _id: string;
//   name: string;
//   breed?: string;
//   age?: number;
//   weight?: number;
//   isPregnant?: boolean;
//   isSick?: boolean;
//   milkProduction?: number;
//   milkFat?: number;
//   addedAt?: string;
//   imported?: boolean;
//   hasGivenBirthRecently?: boolean;
//   linkedCalves?: { _id: string; name: string }[];
//   medicines?: Medicine[];
//   image?: string;
// }

// export default function CowDetailPage() {
//   const { id } = useParams();
//   const [cow, setCow] = useState<Cow | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCow = async () => {
//       try {
//         const res = await fetch(`/api/cows/${id}`);
//         const data = await res.json();
//         setCow(data);
//       } catch (err) {
//         console.error("Failed to load cow:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCow();
//   }, [id]);

//   if (loading)
//     return <p className="text-center text-gray-400">Loading cow data...</p>;
//   if (!cow) return <p className="text-center text-red-400">Cow not found.</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto text-gray-200">
//       <Link
//         href="/dashboard"
//         className="inline-flex items-center text-sm mb-4 text-gray-400 hover:text-white"
//       >
//         <IoMdArrowRoundBack className="mr-2" /> Back to Dashboard
//       </Link>

//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row items-center gap-6 bg-[#161b22]/70 p-6 rounded-2xl border border-gray-700 shadow-lg">
//         <img
//           src={cow.image || "https://via.placeholder.com/400x300?text=Cow"}
//           alt={cow.name}
//           className="w-64 h-48 object-cover rounded-xl border border-gray-700"
//         />
//         <div>
//           <h1 className="text-3xl font-bold text-white flex items-center gap-2">
//             <FaCow className="text-green-400" /> {cow.name}
//           </h1>
//           <p className="text-gray-400 mt-1">
//             Breed: <span className="text-white">{cow.breed || "N/A"}</span>
//           </p>
//           <p className="text-gray-400">
//             Weight: <span className="text-white">{cow.weight || "?"} kg</span>
//           </p>
//           <p className="text-gray-400">
//             Age: <span className="text-white">{cow.age || "?"} years</span>
//           </p>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {cow.isPregnant && (
//               <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded-md text-sm">
//                 Pregnant 🍼
//               </span>
//             )}
//             {cow.isSick && (
//               <span className="bg-red-600/30 text-red-400 px-3 py-1 rounded-md text-sm">
//                 Sick 🤒
//               </span>
//             )}
//             {cow.imported && (
//               <span className="bg-blue-600/30 text-blue-400 px-3 py-1 rounded-md text-sm">
//                 Imported
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid md:grid-cols-3 gap-4 mt-6">
//         <div className="bg-[#161b22] p-4 rounded-xl border border-gray-700 text-center">
//           <p className="text-gray-400 text-sm">Milk Production</p>
//           <p className="text-xl text-green-400 font-bold">
//             {cow.milkProduction || "N/A"} L/day
//           </p>
//         </div>
//         <div className="bg-[#161b22] p-4 rounded-xl border border-gray-700 text-center">
//           <p className="text-gray-400 text-sm">Milk Fat %</p>
//           <p className="text-xl text-yellow-400 font-bold">
//             {cow.milkFat || "N/A"}%
//           </p>
//         </div>
//         <div className="bg-[#161b22] p-4 rounded-xl border border-gray-700 text-center">
//           <p className="text-gray-400 text-sm">Added To Farm</p>
//           <p className="text-lg text-white font-semibold">
//             {cow.addedAt ? new Date(cow.addedAt).toLocaleDateString() : "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* Medicines */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//           <FaSyringe className="text-cyan-400" /> Medicine Records
//         </h2>
//         {cow.medicines?.length ? (
//           <div className="grid md:grid-cols-2 gap-4 mt-4">
//             {cow.medicines.map((med, i) => (
//               <div
//                 key={i}
//                 className="bg-[#161b22] p-4 rounded-lg border border-gray-700"
//               >
//                 <p className="font-semibold text-white">{med.name}</p>
//                 <p className="text-gray-400 text-sm">
//                   Date Given:{" "}
//                   {med.dateGiven
//                     ? new Date(med.dateGiven).toLocaleDateString()
//                     : "N/A"}
//                 </p>
//                 <p className="text-gray-400 text-sm">
//                   Dosage: {med.dosage || "N/A"}
//                 </p>
//                 <p
//                   className={`text-sm ${
//                     med.taken ? "text-green-400" : "text-red-400"
//                   }`}
//                 >
//                   Status: {med.taken ? "Taken" : "Pending"}
//                 </p>
//                 {med.note && (
//                   <p className="text-gray-500 text-sm italic mt-1">
//                     {med.note}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 mt-3">No medicine records found.</p>
//         )}
//       </div>

//       {/* Linked Calves */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//           <FaBaby className="text-pink-400" /> Linked Calves
//         </h2>
//         {cow.linkedCalves?.length ? (
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//             {cow.linkedCalves.map((calf) => (
//               <Link
//                 href={`/dashboard/calf/${calf._id}`}
//                 key={calf._id}
//                 className="bg-[#161b22] border border-gray-700 p-4 rounded-lg hover:shadow-green-500/20 transition"
//               >
//                 <p className="text-white font-semibold">{calf.name}</p>
//                 <p className="text-gray-500 text-sm">View Details →</p>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400 mt-3">No linked calves found.</p>
//         )}
//       </div>
//     </div>
//   );
// }


import React from 'react'

const page = () => {
  return (
    <div>
      
    </div>
  )
}

export default page
