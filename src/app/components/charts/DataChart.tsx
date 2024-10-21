import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type HistoryDataPoint = {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  time: string;
};

function Chart({
  data,
  dataKey,
  title,
}: {
  data: HistoryDataPoint[];
  dataKey: keyof HistoryDataPoint;
  title: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-center text-xl font-bold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DataChart() {
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHistory = () => {
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

            // if (updatedHistory.length > 21) {
            //   updatedHistory.shift();
            // }

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
    const historyInterval = setInterval(fetchHistory, 10 * 60 * 1000);

    return () => {
      clearInterval(historyInterval);
    };
  }, []);

  return (
    <div className="space-y-8">
      <Chart
        data={history}
        dataKey="temperature"
        title="Temperature over time"
      />
      <Chart data={history} dataKey="humidity" title="Humidity over time" />
      <Chart data={history} dataKey="pressure" title="Pressure over time" />
    </div>
  );
}
