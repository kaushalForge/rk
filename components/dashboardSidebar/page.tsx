"use client";

import { useState } from "react";
import Link from "next/link";
import { MdSpaceDashboard, MdMenu, MdMenuOpen } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
import {
  FaPlusCircle,
  FaBaby,
  FaChartBar,
  FaRegUserCircle,
} from "react-icons/fa";

export default function Dashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col justify-between bg-[#161b22]/80 backdrop-blur-2xl border-r border-gray-800
          transition-all duration-300
          w-10 md:w-16
        `}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center border-b-2 border-green-800/40 justify-center py-4 border-b border-gray-800">
            <MdSpaceDashboard className="text-green-400 text-lg md:text-xl" />
          </div>

          {/* Sidebar Navigation */}
          <nav className="mt-4 flex flex-col gap-3 items-center">
            <SidebarIconLink
              href="/dashboard"
              icon={
                <MdSpaceDashboard className="text-green-400 text-lg md:text-xl" />
              }
            />
            <SidebarIconLink
              href="/dashboard/add-cow"
              icon={
                <FaPlusCircle className="text-green-400 text-lg md:text-xl" />
              }
            />
            <SidebarIconLink
              href="/dashboard/add-calf"
              icon={<FaBaby className="text-green-400 text-lg md:text-xl" />}
            />
            <SidebarIconLink
              href="/dashboard/filter"
              icon={<FiFilter className="text-green-400 text-lg md:text-xl" />}
            />
            <SidebarIconLink
              href="/dashboard/reports"
              icon={
                <FaChartBar className="text-green-400 text-lg md:text-xl" />
              }
            />
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex justify-center py-4 border-t border-gray-800">
          <FaRegUserCircle className="text-gray-400 text-2xl" />
        </div>
      </aside>

      {/* Dashboard content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* Sidebar Icon Link Component */
function SidebarIconLink({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center w-full h-12 hover:bg-green-500/20 transition rounded-md"
    >
      {icon}
    </Link>
  );
}
