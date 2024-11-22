import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { supabase } from "@/utils/db";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState<DbDataTypes[] | null>(null);
  const [averages, setAverages] = useState({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    uv_index: 0,
    precipitation: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAndFilterData() {
      const { data, error } = await supabase.from("hourly_conditions").select();
      if (error) {
        setError(error);
        return;
      }

      const selectedDateString = selectedDate.toISOString().split("T")[0];
      const filtered =
        data &&
        data.filter((entry: DbDataTypes) =>
          entry.time.startsWith(selectedDateString)
        );
      setFilteredData(filtered);

      if (filtered && filtered.length > 0) {
        const total = filtered.reduce(
          (acc: DbDataTypes, curr: DbDataTypes) => {
            acc.temperature += curr.temperature;
            acc.humidity += curr.humidity;
            acc.pressure += curr.pressure;
            acc.uv_index += curr.uv_index;
            acc.precipitation += curr.precipitation;
            return acc;
          },
          {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            uv_index: 0,
            precipitation: 0,
          }
        );

        setAverages({
          temperature: parseFloat(
            (total.temperature / filtered.length).toFixed(2)
          ),
          humidity: parseFloat((total.humidity / filtered.length).toFixed(2)),
          pressure: parseFloat((total.pressure / filtered.length).toFixed(2)),
          uv_index: parseFloat((total.uv_index / filtered.length).toFixed(2)),
          precipitation: parseFloat(
            (total.precipitation / filtered.length).toFixed(2)
          ),
        });
      } else {
        setAverages({
          temperature: 0,
          humidity: 0,
          pressure: 0,
          uv_index: 0,
          precipitation: 0,
        });
      }
    }

    fetchAndFilterData();
  }, [selectedDate]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 text-center">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Filtrar Dados por Data
      </h1>
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date || new Date())}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 rounded-md px-4 py-2"
        />
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Dados Filtrados:
      </h2>
      {filteredData && filteredData.length > 0 ? (
        <div className="overflow-x-auto max-h-64">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Time</th>
                <th className="border border-gray-300 px-4 py-2">
                  Temperature
                </th>
                <th className="border border-gray-300 px-4 py-2">Humidity</th>
                <th className="border border-gray-300 px-4 py-2">Pressure</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-100 transition-colors duration-200 odd:bg-red-50 even:bg-white"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {format(new Date(entry.time), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.temperature}°C
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.humidity}%
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.pressure} hPa
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Nenhum dado encontrado para a data selecionada.
        </p>
      )}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">Médias:</h2>
      <ul className="list-disc ml-6 mt-4 text-gray-800">
        <li>Temperatura: {averages.temperature}°C</li>
        <li>Umidade: {averages.humidity}%</li>
        <li>Pressão: {averages.pressure} hPa</li>
        <li>Índice UV: {averages.uv_index}</li>
        <li>Precipitação: {averages.precipitation} mm</li>
      </ul>
    </div>
  );
}
