"use client";
import React, { useState } from "react";
import Link from "next/link";
import { WiDaySunny } from "react-icons/wi";
import { RiDatabase2Line, RiHomeLine } from "react-icons/ri";
import { RiLineChartLine } from "react-icons/ri";

export function NavBar({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex">
          <button onClick={toggleDarkMode} className="pr-1">
            <WiDaySunny className="text-3xl" />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Weather Station</span>
          </Link>
        </div>
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
            <RiDatabase2Line size={24} aria-hidden="true" />
          </Link>
          <Link
            href="/charts"
            className="hover:text-blue-200 transition-colors"
          >
            <RiLineChartLine size={24} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
