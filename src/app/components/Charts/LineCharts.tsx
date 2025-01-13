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
  time: string; // ISO date string
  altitude: number;
};

export default function LineCharts() {
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [filteredData, setFilteredData] = useState<DataTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState("");

  const types = [
    { value: "temperature", label: "Temperature" },
    { value: "humidity", label: "Humidity" },
    { value: "pressure", label: "Pressure" },
    { value: "uv_index", label: "UV Index" },
    { value: "precipitation", label: "Precipitation" },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    console.log("Selected Type:", event.target.value);
  };

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

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  if (error) {
    return <p className="text-red-500 font-bold">Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex flex-col items-center">
          <label
            htmlFor="type-select"
            className="mb-2 font-medium text-gray-700"
          >
            Select Type
          </label>
          <select
            id="type-select"
            value={selectedType}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="flex flex-col items-center">
          <label className="mb-2 font-medium text-gray-700">Start Date</label>
          <DatePicker
            id="start-date"
            selected={selectedDate1}
            onChange={(date) => setSelectedDate1(date || new Date())}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-2 font-medium text-gray-700">End Date</label>
          <DatePicker
            id="end-date"
            selected={selectedDate2}
            onChange={(date) => setSelectedDate2(date || new Date())}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            minDate={selectedDate1}
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center font-bold text-gray-700">Loading...</p>
      ) : (
        <LineChart
          width={1000}
          height={400}
          data={filteredData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={formatTime} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={selectedType} stroke="red" />
        </LineChart>
      )}
    </div>
  );
}
