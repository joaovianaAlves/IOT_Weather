import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { supabase } from "@/utils/db";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DataTypes = {
  temperature: number;
  humidity: number;
  pressure: number;
  uv_index: number;
  precipitation: number;
  time: string;
  altitude: number;
};

const types = [
  { value: "temperature", label: "Temperature", color: "Red" },
  { value: "humidity", label: "Humidity", color: "Blue" },
  { value: "pressure", label: "Pressure", color: "Gray" },
  { value: "uv_index", label: "UV Index", color: "Yellow" },
  { value: "precipitation", label: "Precipitation", color: "Blue" },
];

export default function LineCharts() {
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [filteredData, setFilteredData] = useState<DataTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTypeColor, setSelectedTypeColor] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedType(selectedValue);
    const typeInfo = types.find((type) => type.value === selectedValue);
    setSelectedTypeColor(typeInfo?.color || "");
  };

  function formatTime(time: string) {
    const date = new Date(time);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  }

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
        setError(error.message);
      } else {
        setFilteredData(data);
      }
      setLoading(false);
    }

    fetchAndFilterData();
  }, [selectedDate1, selectedDate2]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900">
        <p className="text-red-700 dark:text-red-100 font-medium">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Weather Data Visualization
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Type
            </label>
            <select
              value={selectedType}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>
                Choose a type...
              </option>
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
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
              End Date
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white"></div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg bg-white dark:bg-gray-800 p-4">
            <LineChart width={1000} height={400} data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                stroke="#6B7280"
                tick={{ fill: "#6B7280" }}
              />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatTime(label)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedType.charAt(0).toUpperCase() +
                            selectedType.slice(1)}
                          : {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{
                  padding: "20px",
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedType}
                stroke={selectedTypeColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}
