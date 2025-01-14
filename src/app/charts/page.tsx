"use client";
import React from "react";
import LineCharts from "../components/Charts/LineCharts";

export default function Charts() {
  return (
    <main className="container mx-auto px-4">
      <div className="p-6">
        <LineCharts />
      </div>
    </main>
  );
}
