import React from "react";
import {
  WiThermometer,
  WiHumidity,
  WiBarometer,
  WiDaySunny,
  WiRaindrop,
  WiFlood,
} from "react-icons/wi";

type MetricCardProps = {
  title: string;
  value: Date | string | number | undefined;
  unit: string;
};

export default function MetricCard({ title, value, unit }: MetricCardProps) {
  let icon;
  let bgColor;

  switch (title) {
    case "Temperatura":
      icon = <WiThermometer className="text-5xl text-red-500" />;
      bgColor = "bg-red-500";
      break;
    case "Humidade":
      icon = <WiHumidity className="text-5xl text-blue-400" />;
      bgColor = "bg-blue-500";
      break;
    case "Pressão":
      icon = <WiBarometer className="text-5xl text-gray-600" />;
      bgColor = "bg-gray-500";
      break;
    case "UV Index":
      icon = <WiDaySunny className="text-5xl text-yellow-500" />;
      bgColor = "bg-yellow-500";
      break;
    case "Precipitação":
      icon = <WiRaindrop className="text-5xl text-blue-500" />;
      bgColor = "bg-blue-600";
      break;
    case "Altitude":
      icon = <WiFlood className="text-5xl text-green-500" />;
      bgColor = "bg-green-500";
      break;
    default:
      icon = null;
      bgColor = "bg-gray-400";
  }

  return (
    <div
      className={` rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out bg-gradient-to-r ${bgColor} p-6`}
    >
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex items-baseline justify-center text-4xl font-bold  text-white">
          <span>{String(value)}</span>
          {unit && <span className="text-xl text-white/80 ml-2">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
