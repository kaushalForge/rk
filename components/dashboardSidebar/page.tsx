"use client";

import { useState } from "react";
import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";
import { FiFilter } from "react-icons/fi";

import {
  FaPlusCircle,
  FaBaby,
  FaChartBar,
  FaRegUserCircle,
} from "react-icons/fa";
import { MdMenu, MdMenuOpen } from "react-icons/md";

export default function Dashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex sticky min-h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <aside
        className={`${
          expanded ? "w-64" : "w-20"
        } transition-all duration-300 bg-[#161b22]/80 backdrop-blur-2xl border-r border-gray-800 flex flex-col justify-between`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-800">
            <MdSpaceDashboard className="text-green-400 text-2xl" />
            {expanded && (
              <h1 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-green-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-gray-400 hover:text-green-400"
            >
              {expanded ? <MdMenuOpen /> : <MdMenu />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="mt-6 flex flex-col gap-1">
            <SidebarLink
              href="/dashboard"
              icon={<MdSpaceDashboard className="text-green-400 text-lg" />}
              label="Overview"
              expanded={expanded}
            />

            <SidebarLink
              href="/dashboard/add-cow"
              icon={<FaPlusCircle className="text-green-400 text-lg" />}
              label="Add Cow"
              expanded={expanded}
            />

            <SidebarLink
              href="/dashboard/add-calf"
              icon={<FaBaby className="text-green-400 text-lg" />}
              label="Add Calf"
              expanded={expanded}
            />

            <SidebarLink
              href="/dashboard/filter"
              icon={<FiFilter className="text-green-400 text-lg" />}
              label="Filter"
              expanded={expanded}
            />

            <SidebarLink
              href="/dashboard/reports"
              icon={<FaChartBar className="text-green-400 text-lg" />}
              label="Reports"
              expanded={expanded}
            />
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-800 p-4 flex items-center gap-3">
          <FaRegUserCircle className="text-3xl text-gray-400" />
          {expanded && (
            <div>
              <p className="text-sm font-semibold">Farm Manager</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

/* 🔹 Reusable Sidebar Link Component */
function SidebarLink({
  href,
  icon,
  label,
  expanded,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex whitespace-nowrap items-center gap-3 px-4 py-3 hover:bg-green-500/10 transition rounded-md mx-2"
    >
      {icon}
      <span
        className={`text-sm transition-all duration-300 overflow-hidden ${
          expanded ? "opacity-100 ml-2 w-auto" : "opacity-0 ml-0 w-0"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
