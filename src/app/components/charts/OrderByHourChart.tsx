import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
    <div className="mb-6">
      <h2 className="text-center text-lg font-bold mb-3">{title}</h2>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="time"
          tickFormatter={(time) => new Date(time).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
        <Legend />
      </LineChart>
    </div>
  );
}

export default function OrderByHourChart({ history }: HistoryType) {
  return (
    <div className="flex">
      <Chart
        data={history}
        dataKey="temperature"
        title="Temperature over the time"
      />
      <Chart data={history} dataKey="humidity" title="Humidity over the time" />
      <Chart data={history} dataKey="pressure" title="Pressure over the time" />
    </div>
  );
}
