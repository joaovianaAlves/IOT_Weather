import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { supabase } from "@/utils/db";
import DatePicker from "react-datepicker";
import MetricCard from "./MetricCard";

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
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [filteredData, setFilteredData] = useState<DbDataTypes[] | null>(null);
  const [averages, setAverages] = useState({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    uv_index: 0,
    precipitation: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  const metrics = [
    { title: "Temperatura", value: averages.temperature, unit: "°C" },
    { title: "Humidade", value: averages.humidity, unit: "%" },
    { title: "Pressão", value: averages.pressure, unit: "hPa" },
    { title: "Precipitação", value: averages.precipitation, unit: "mm" },
    { title: "UV Index", value: averages.uv_index, unit: "" },
  ];

  useEffect(() => {
    async function fetchAndFilterData() {
      const startDate = new Date(selectedDate1);
      const endDate = new Date(selectedDate2);

      if (startDate.getTime() === endDate.getTime()) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      const { data, error } = await supabase
        .from("hourly_conditions")
        .select()
        .gte("time", startDate.toISOString())
        .lte("time", endDate.toISOString());

      if (error) {
        setError(error);
        return;
      }

      setFilteredData(data);

      if (data && data.length > 0) {
        const total = data.reduce(
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
          temperature: parseFloat((total.temperature / data.length).toFixed(2)),
          humidity: parseFloat((total.humidity / data.length).toFixed(2)),
          pressure: parseFloat((total.pressure / data.length).toFixed(2)),
          uv_index: parseFloat((total.uv_index / data.length).toFixed(2)),
          precipitation: parseFloat(
            (total.precipitation / data.length).toFixed(2)
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
  }, [selectedDate1, selectedDate2]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 text-center">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full ">
      <div className="w-full max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-4 text-center">
          Filtrar Dados por Data
        </h1>
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <label className="mb-2 font-medium dark:text-white/80 text-gray-700">
              Data inicial
            </label>
            <DatePicker
              id="start-date"
              selected={selectedDate1}
              onChange={(date) => setSelectedDate1(date || new Date())}
              dateFormat="dd-MM-yyyy"
              maxDate={new Date()}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-2 font-medium dark:text-white/80 text-gray-700">
              Data final
            </label>
            <DatePicker
              id="end-date"
              selected={selectedDate2}
              onChange={(date) => setSelectedDate2(date || new Date())}
              dateFormat="dd-MM-yyyy"
              maxDate={new Date()}
              minDate={selectedDate1}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold dark:text-white/80 text-gray-700 mb-4">
          Dados Filtrados:
        </h2>
        {filteredData && filteredData.length > 0 ? (
          <div className="overflow-x-auto max-h-[24rem] rounded-lg relative">
            <table className="min-w-full table-auto bg-white dark:bg-gray-800">
              <thead className="bg-gray-600 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                    Temperatura
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                    Humidade
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                    Pressão
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="dark:hover:bg-blue-900/20 hover:bg-blue-900/20 
                     transition-colors duration-200 
                     bg-white dark:bg-gray-800 
                     dark:text-gray-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {format(new Date(entry.time), "yyyy/MM/dd HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {entry.temperature}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {entry.humidity}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {entry.pressure} hPa
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center dark:text-white text-gray-600">
            Nenhum dado encontrado para o intervalo selecionado.
          </p>
        )}
        <h2 className="text-xl font-semibold dark:text-white text-gray-700 mt-6">
          Médias:
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 mx-auto">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            unit={metric.unit}
            value={metric.value}
          />
        ))}
      </div>
    </div>
  );
}
