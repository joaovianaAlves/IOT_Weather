"use client";
import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";

type DataTypes = {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  altitude?: number;
};

export default function Home() {
  const [data, setData] = useState<DataTypes | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      if (!process.env.NEXT_PUBLIC_API_IP) {
        throw new Error("Api is not defined");
      }

      fetch(process.env.NEXT_PUBLIC_API_IP)
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
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Weather Station Data</h1>
      {error ? <p>Error: {error.message}</p> : null}
      {data ? (
        <div>
          <p>Temperature: {data.temperature}</p>
          <p>Humidity: {data.humidity}</p>
          <p>Pressure: {data.pressure}</p>
        </div>
      ) : (
        <p>
          <LuLoader2 className="animate-spin" size={50} />
        </p>
      )}
    </main>
  );
}
