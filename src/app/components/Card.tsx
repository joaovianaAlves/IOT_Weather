import { IconType } from "react-icons";

export type CardTypes = {
  icon: { Icon: IconType; color: string };
  text: string;
  value: Date | number | string | undefined;
  color: string;
  unit: string;
};

export default function Card({ icon, text, value, color, unit }: CardTypes) {
  console.log(`Rendering Card - ${text} with color:`, color);
  return (
    <div
      className={` rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out bg-gradient-to-r ${color} p-6`}
    >
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
          {<icon.Icon className={`text-5xl ${icon.color}`} />}
        </div>
        <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
          {text}
        </h2>
        <div className="flex items-baseline justify-center text-4xl font-bold  text-white">
          <span>{String(value)}</span>
          {unit && <span className="text-xl text-white/80 ml-2">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
