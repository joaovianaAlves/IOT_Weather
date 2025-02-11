import {
  WiBarometer,
  WiCloudyWindy,
  WiDaySunny,
  WiFlood,
  WiHumidity,
  WiRaindrop,
  WiThermometer,
} from "react-icons/wi";
import { CardTypes } from "@/app/components/Card";
import { PiCompass, PiCompassThin } from "react-icons/pi";

type DataTypes = {
  temperature?: number | undefined;
  humidity?: number;
  pressure?: number;
  altitude?: number;
  uv_index?: number;
  precipitation?: number;
  wind_direction?: string;
  wind_speed?: string;
};

export const getMetrics = (data: DataTypes): CardTypes[] =>
  [
    {
      text: "Temperatura",
      value: data.temperature,
      color: "bg-[#FF5733]", // Warm Red
      icon: { Icon: WiThermometer, color: "text-[#FF5733]" },
      unit: "°C",
    },
    {
      text: "Humidade",
      value: data.humidity,
      color: "bg-[#0099FF]", // Sky Blue
      icon: { Icon: WiHumidity, color: "text-[#0099FF]" },
      unit: "%",
    },
    {
      text: "Pressão",
      value: data.pressure,
      color: "bg-[#7D7D7D]", // Steel Gray
      icon: { Icon: WiBarometer, color: "text-[#7D7D7D]" },
      unit: "hPa",
    },
    {
      text: "UV Index",
      value: data.uv_index,
      color: "bg-[#FFD700]/90", // Golden Yellow
      icon: { Icon: WiDaySunny, color: "text-[#FFD700]" },
      unit: "",
    },
    {
      text: "Precipitação",
      value: data.precipitation,
      color: "bg-[#007FFF]", // Azure Blue
      icon: { Icon: WiRaindrop, color: "text-[#007FFF]" },
      unit: "mm",
    },
    {
      text: "Altitude",
      value: data.altitude,
      color: "bg-[#2ECC71]", // Emerald Green
      icon: { Icon: WiFlood, color: "text-[#2ECC71]" },
      unit: "m",
    },
    {
      text: "Direção",
      value: data.wind_direction,
      color: "bg-[#B0B0B0]", // Light Gray
      icon: { Icon: PiCompass, color: "text-[#B0B0B0]" },
      unit: "",
    },
    {
      text: "Velocidade",
      value: data.wind_speed,
      color: "bg-[#005BBB]", // Deep Blue
      icon: { Icon: WiCloudyWindy, color: "text-[#005BBB]" },
      unit: "km/h",
    },
  ].filter((metrics) => metrics.value != null || metrics.value != undefined);
