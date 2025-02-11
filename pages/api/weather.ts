import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🟢 API Request Received: /api/weather");

  try {
    const response = await fetch("http://192.168.5.85");

    if (!response.ok) {
      console.error(`❌ Failed to fetch ESP32 data: ${response.status}`);
      throw new Error(`ESP32 API error: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: "Error fetching weather data" });
  }
}
