import React from "react";
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

type HistoryType = {
  history: HistoryDataPoint[];
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

export default function OrderByHourChart({ history }: HistoryType) {
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
