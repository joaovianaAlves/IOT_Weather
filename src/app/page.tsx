"use client";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import MetricCard from "./components/MetricCard";
import OrderByHourChart from "./components/charts/OrderByHourChart";

type DataTypes = {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  time: string;
};

export type HistoryDataPoint = DataTypes;

export default function Home() {
  const [data, setData] = useState<DataTypes | null>(null);
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      if (!process.env.NEXT_PUBLIC_API_IP) {
        throw new Error("Api is not defined");
      }

      fetch(`${process.env.NEXT_PUBLIC_API_IP}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Response Not ok, http:${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setData(data);
          setError(null);
        })
        .catch((error) => {
          setError(error);
          setData(null);
        });
    };
    const fetchHistory = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_IP}/history`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Something went Wrong ${response.status}`);
          }
          return response.json();
        })
        .then((history: DataTypes[]) => {
          setHistory(history);
          setError(null);
        })
        .catch((error) => {
          setError(error);
          setData(null);
        });
    };
    const dataInterval = setInterval(fetchData, 60 * 1000);
    const historyInterval = setInterval(fetchHistory, 10 * 60 * 1000);
    fetchData();
    fetchHistory();

    return () => {
      clearInterval(dataInterval);
      clearInterval(historyInterval);
    };
  }, []);

  if (error) {
    return <p>Error {error.message}</p>;
  }

  if (!data || history.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LuLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const metrics = [
    { title: "Temperature", value: data.temperature, unit: "°C" },
    { title: "Humidity", value: data.humidity, unit: "%" },
    { title: "Pressure", value: data.pressure, unit: "hPa" },
  ];

  return (
    <main className="flex flex-col justify-center items-center mx-auto">
      <div className="flex justify-between gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
          />
        ))}
      </div>
      <div>
        <OrderByHourChart history={history} />
      </div>
    </main>
  );
}
