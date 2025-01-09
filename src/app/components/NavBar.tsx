"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LuMoonStar, LuSun } from "react-icons/lu";
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
    <nav className="bg-white dark:bg-gray-900 dark:text-white text-gray-900 dark:border-b-2 dark:border-white border-b-2 border-gray-900  py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className="relative w-8 h-8 overflow-hidden"
          >
            <div
              className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${
                darkMode
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-0 rotate-45"
              }`}
            >
              <LuMoonStar size={24} className="text-3xl" />
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${
                darkMode
                  ? "opacity-0 scale-0 rotate-45"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            >
              <LuSun size={24} className="text-3xl" />
            </div>
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
