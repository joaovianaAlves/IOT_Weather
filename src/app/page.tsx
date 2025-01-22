"use client";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import MetricCard from "./components/MetricCard";
import { NavBar } from "./components/NavBar";
import { supabase } from "@/utils/db";
import { format } from "date-fns";

type DataTypes = {
  id?: string;
  temperature: number;
  humidity: number;
  pressure: number;
  uv_index: number;
  precipitation: number;
  time: Date;
  altitude: number;
};

export default function Home() {
  const [realTimeData, setRealTimeData] = useState<DataTypes | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("hourly_conditions")
        .select()
        .order("time", { ascending: false })
        .limit(1);

      if (error) {
        setError(error);
        return;
      } else if (data && data.length > 0) {
        setRealTimeData(data[0]);
      } else {
        setError(new Error("No data available."));
      }
    }
    fetchData();
  }, []);

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
  const metrics = [
    { title: "Temperatura", value: realTimeData.temperature, unit: "°C" },
    { title: "Humidade", value: realTimeData.humidity, unit: "%" },
    { title: "Pressão", value: realTimeData.pressure, unit: "hPa" },
    { title: "Precipitação", value: realTimeData.precipitation, unit: "mm" },
    { title: "UV Index", value: realTimeData.uv_index, unit: "" },
    { title: "Altitude", value: realTimeData.altitude, unit: "m" },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <h1 className="text-4xl dark:text-white text-gray-800 font-bold text-center mb-2">
        Clima Atual
      </h1>
      <p className="dark:text-white/80 text-gray-600 text-center mb-8">
        Atualizado em: {format(realTimeData.time, "yyyy/MM/dd HH:mm")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-2/3">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
          />
        ))}
      </div>
    </div>
  );
}
