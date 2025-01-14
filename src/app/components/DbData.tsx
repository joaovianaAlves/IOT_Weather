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
  const [loading, setLoading] = useState(false);

  const metrics = [
    { title: "Temperatura", value: averages.temperature, unit: "°C" },
    { title: "Humidade", value: averages.humidity, unit: "%" },
    { title: "Pressão", value: averages.pressure, unit: "hPa" },
    { title: "Precipitação", value: averages.precipitation, unit: "mm" },
    { title: "UV Index", value: averages.uv_index, unit: "" },
  ];

  useEffect(() => {
    async function fetchAndFilterData() {
      setLoading(true);
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
        setLoading(false);
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
      setLoading(false);
    }

    fetchAndFilterData();
  }, [selectedDate1, selectedDate2]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900">
        <p className="text-red-700 dark:text-red-100 font-medium">
          Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Filtrar Dados por Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data inicial
            </label>
            <DatePicker
              selected={selectedDate1}
              onChange={(date) => setSelectedDate1(date || new Date())}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data final
            </label>
            <DatePicker
              selected={selectedDate2}
              onChange={(date) => setSelectedDate2(date || new Date())}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              minDate={selectedDate1}
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            unit={metric.unit}
            value={metric.value}
          />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white"></div>
        </div>
      ) : filteredData && filteredData.length > 0 ? (
        <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto  max-h-[24rem]">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Temperatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Humidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pressão
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {format(new Date(entry.time), "yyyy/MM/dd HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.temperature}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.humidity}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.pressure} hPa
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Medias:
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                    {averages.temperature}°C
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                    {averages.humidity}%
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                    {averages.pressure} hPa
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Nenhum dado encontrado para o intervalo selecionado.
        </p>
      )}
    </div>
  );
}
