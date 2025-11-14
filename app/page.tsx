import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center">
        <Link
          className="border-2 px-2 py-1 rounded-md bg-gray-600 text-white"
          href="dashboard"
        >
          Dashboard
        </Link>
      </div>
    </>
  );
};

export default page;
