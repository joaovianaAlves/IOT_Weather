"use client";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import OrderByHourChart from "../components/charts/OrderByHourChart";
import { NavBar } from "../components/NavBar";

export type HistoryDataPoint = {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  time: string;
};

export default function History() {
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHistory = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_IP}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setHistory((prevHistory) => {
            const lastEntry = prevHistory[prevHistory.length - 1];

            if (lastEntry && lastEntry.time === data.time) {
              return prevHistory;
            }

            const updatedHistory = [...prevHistory, data];

            if (updatedHistory.length > 21) {
              updatedHistory.shift();
            }

            localStorage.setItem(
              "chartHistory",
              JSON.stringify(updatedHistory)
            );

            return updatedHistory;
          });
          setError(null);
        })
        .catch((error) => {
          setError(error);
        });
    };

    const storedHistory = localStorage.getItem("chartHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }

    fetchHistory();
    const historyInterval = setInterval(fetchHistory, 4 * 1000);

    return () => {
      clearInterval(historyInterval);
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

  if (history.length === 0) {
    return (
      <>
        <NavBar />
        <div className="flex h-screen items-center justify-center">
          <LuLoader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Weather History
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <OrderByHourChart history={history} />
        </div>
      </main>
    </>
  );
}
