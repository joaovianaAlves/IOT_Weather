import React from "react";
import {
  WiThermometer,
  WiHumidity,
  WiBarometer,
  WiDaySunny,
  WiRaindrop,
} from "react-icons/wi";
type MetricCardProps = {
  title: string;
  value: number | undefined;
  unit: string;
};

export default function MetricCard({ title, value, unit }: MetricCardProps) {
  let icon;
  switch (title) {
    case "Temperature":
      icon = <WiThermometer className="text-2xl text-red-500" />;
      break;
    case "Humidity":
      icon = <WiHumidity className="text-2xl text-blue-400" />;
      break;
    case "Pressure":
      icon = <WiBarometer className="text-2xl text-gray-600" />;
      break;
    case "UV Index":
      icon = <WiDaySunny className="text-2xl text-yellow-500" />;
      break;
    case "Precipitation":
      icon = <WiRaindrop className="text-2xl text-blue-500" />;
      break;
    default:
      icon = null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out border border-gray-200 p-6 ">
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="flex items-center space-x-2 mr-5">
          {icon}
          <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
            {title}
          </h2>
        </div>
        <div className="flex items-baseline justify-center text-4xl font-bold text-blue-600">
          <span>{value}</span>
          {unit && <span className="text-xl text-gray-500 ml-2">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
