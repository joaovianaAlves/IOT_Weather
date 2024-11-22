import React from "react";
import Link from "next/link";
import { WiDaySunny } from "react-icons/wi";
import { RiHomeLine } from "react-icons/ri";
import { RiLineChartLine } from "react-icons/ri";

export function NavBar() {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <WiDaySunny className="text-3xl" />
          <span className="text-xl font-bold">Weather Station</span>
        </Link>
        <div className="flex justify-between gap-8 mx-2">
          <Link
            href="/"
            className="hover:text-blue-200 transition-colors"
            aria-label="Home"
          >
            <RiHomeLine size={24} aria-hidden="true" />
          </Link>
          <Link
            href="/history"
            className="hover:text-blue-200 transition-colors"
          >
            <RiLineChartLine size={24} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
