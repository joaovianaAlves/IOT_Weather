import React from "react";

type MetricCardProps = {
  title: string;
  value: number | undefined;
  unit: string;
};

export default function MetricCard({ title, value, unit }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out border border-gray-200 p-6">
      <div className="flex flex-col justify-center items-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex items-baseline justify-center text-4xl font-bold text-blue-600">
          <span>{value}</span>
          {unit && <span className="text-xl text-gray-500 ml-2">{unit}</span>}
        </div>
      </div>
    </div>
  );
}