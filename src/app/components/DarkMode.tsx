"use client";
import React from "react";
import { NavBar } from "./NavBar";
import { useEffect, useState } from "react";

export default function DarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    const isDark = savedMode === "true";

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("mode", newMode.toString());
  };

  return <NavBar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />;
}
