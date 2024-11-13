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

  return (
    <div>
      {dbData &&
        dbData.map((data) => (
          <div key={data.id}>
            <p>Time: {data.time}</p>
            <p>Temperature: {data.temperature}°C</p>
            <p>Humidity: {data.humidity}%</p>
            <p>Pressure: {data.pressure} hPa</p>
            <p>UV Index: {data.uv_index}</p>
            <p>Precipitation: {data.precipitation} mm</p>
          </div>
        ))}
    </div>
  );
}
