"use client";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import MetricCard from "./components/MetricCard";
import { NavBar } from "./components/NavBar";

type DataTypes = {
  temperature: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  precipitation: number;
  time: string;
};

export type HistoryDataPoint = DataTypes;

export default function Home() {
  const [data, setData] = useState<DataTypes | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      if (!process.env.NEXT_PUBLIC_API_IP) {
        throw new Error("API is not defined");
      }

      fetch(`${process.env.NEXT_PUBLIC_API_IP}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Response Not ok, https:${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
          console.log(data);
          setError(null);
        })
        .catch((error) => {
          setError(error);
          setData(null);
        });
    };

    const dataInterval = setInterval(fetchData, 5 * 1000);
    fetchData();

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  if (error) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500 text-center">Error: {error.message}</p>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <NavBar />
        <div className="flex h-screen items-center justify-center">
          <LuLoader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }
  const metrics = [
    { title: "Temperature", value: data.temperature, unit: "°C" },
    { title: "Humidity", value: data.humidity, unit: "%" },
    { title: "Pressure", value: data.pressure, unit: "hPa" },
    { title: "Precipitation", value: data.precipitation, unit: "mm" },
    { title: "UV Index", value: data.uvIndex, unit: "" },
  ];

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Current Weather</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
            />
          ))}
        </div>
      </main>
    </>
  );
}
