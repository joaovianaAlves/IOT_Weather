"use client";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { format, interval } from "date-fns";
import Card from "./components/Card";
import { getMetrics } from "@/utils/cardMetrics";

type DataTypes = {
  id?: string;
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  uv_index: number;
  precipitation: number;
  wind_direction: string;
  time: Date;
};

export default function Home() {
  const [realTimeData, setRealTimeData] = useState<DataTypes | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/weather");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: DataTypes = await response.json();
        setRealTimeData({ ...data, time: new Date() });
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [interval]);

  if (error) {
    return (
      <div className="dark:bg-gray-800 flex h-screen items-center justify-center mx-auto px-4 py-8">
        <p className="text-red-500 text-center">Error: {error.message}</p>
      </div>
    );
  }

  if (!realTimeData) {
    return (
      <div className="dark:bg-gray-800 flex h-screen items-center justify-center">
        <LuLoader2 className="dark:text-white h-12 w-12 animate-spin text-gray-800" />
      </div>
    );
  }

  const metrics = getMetrics(realTimeData);

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <h1 className="text-4xl dark:text-white text-gray-800 font-bold text-center mb-2">
        Clima Atual
      </h1>
      <p className="dark:text-white/80 text-gray-600 text-center mb-8">
        Atualizado em: {format(realTimeData.time, "yyyy/MM/dd HH:mm")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-2/3">
        {metrics.map(({ icon, color, text, value, unit }, index) => (
          <Card
            key={index}
            icon={icon}
            text={text}
            value={value}
            color={color}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}
