import React, { useEffect, useState } from "react";

type DbDataTypes = {
  id?: string;
  temperature: number;
  humidity: number;
  pressure: number;
  uv_index: number;
  precipitation: number;
  time: string;
};

export default function DbData() {
  const [dbData, setDbData] = useState<DbDataTypes[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      if (!process.env.NEXT_PUBLIC_API_IP) {
        throw new Error("API is not defined");
      }
      fetch(`${process.env.NEXT_PUBLIC_API_IP}/data`, {
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
          setDbData(data);
          setError(null);
        })
        .catch((error) => {
          setError(error);
        });
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 text-center">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Weather Data Table</h2>
      {dbData ? (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Temperature (°C)</th>
              <th className="px-4 py-2 border">Humidity (%)</th>
              <th className="px-4 py-2 border">Pressure (hPa)</th>
              <th className="px-4 py-2 border">UV Index</th>
              <th className="px-4 py-2 border">Precipitation (mm)</th>
            </tr>
          </thead>
          <tbody>
            {dbData.map((data) => (
              <tr key={data.id} className="border-b">
                <td className="px-4 py-2 border">{data.time}</td>
                <td className="px-4 py-2 border">{data.temperature}°C</td>
                <td className="px-4 py-2 border">{data.humidity}%</td>
                <td className="px-4 py-2 border">{data.pressure} hPa</td>
                <td className="px-4 py-2 border">{data.uv_index}</td>
                <td className="px-4 py-2 border">{data.precipitation} mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">Loading data...</p>
      )}
    </div>
  );
}
