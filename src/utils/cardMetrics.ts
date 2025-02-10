import {
  WiBarometer,
  WiDaySunny,
  WiFlood,
  WiHumidity,
  WiRaindrop,
  WiThermometer,
} from "react-icons/wi";
import { FaRegCompass } from "react-icons/fa";
import { CardTypes } from "@/app/components/Card";

type DataTypes = {
  temperature?: number | undefined;
  humidity?: number;
  pressure?: number;
  altitude?: number;
  uv_index?: number;
  precipitation?: number;
  wind_direction?: string;
};

export const getMetrics = (data: DataTypes): CardTypes[] =>
  [
    {
      text: "Temperatura",
      value: data.temperature,
      color: "bg-red-500",
      icon: { Icon: WiThermometer, color: "text-red-500" },
      unit: "°C",
    },
    {
      text: "Humidade",
      value: data.humidity,
      color: "bg-blue-500",
      icon: { Icon: WiHumidity, color: "text-blue-500" },
      unit: "%",
    },
    {
      text: "Pressão",
      value: data.pressure,
      color: "bg-gray-500",
      icon: { Icon: WiBarometer, color: "text-gray-500" },
      unit: "hPa",
    },
    {
      text: "UV Index",
      value: data.uv_index,
      color: "bg-yellow-500",
      icon: { Icon: WiDaySunny, color: "text-yellow-500" },
      unit: "",
    },
    {
      text: "Precipitação",
      value: data.precipitation,
      color: "bg-blue-600",
      icon: { Icon: WiRaindrop, color: "text-blue-500" },
      unit: "mm",
    },
    {
      text: "Altitude",
      value: data.altitude,
      color: "bg-green-500",
      icon: { Icon: WiFlood, color: "text-green-500" },
      unit: "m",
    },
    {
      text: "Direção",
      value: data.wind_direction,
      color: "bg-[#c3c3c3]",
      icon: { Icon: FaRegCompass, color: "text-[#c3c3c3]" },
      unit: "",
    },
  ].filter((metrics) => metrics.value != null || metrics.value != undefined);
