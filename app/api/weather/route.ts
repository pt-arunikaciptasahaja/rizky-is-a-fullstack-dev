import { NextResponse } from "next/server";

export const revalidate = 1800;

type WeatherKind = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
}

function describeWeather(code: number): { condition: string; kind: WeatherKind } {
  if (code === 0) return { condition: "Clear sky", kind: "clear" };
  if (code === 1) return { condition: "Mainly clear", kind: "clear" };
  if (code === 2) return { condition: "Partly cloudy", kind: "cloudy" };
  if (code === 3) return { condition: "Overcast", kind: "cloudy" };
  if (code === 45 || code === 48) return { condition: "Fog", kind: "fog" };
  if (code >= 51 && code <= 57) return { condition: "Drizzle", kind: "rain" };
  if (code === 61) return { condition: "Light rain", kind: "rain" };
  if (code === 63) return { condition: "Rain", kind: "rain" };
  if (code === 65) return { condition: "Heavy rain", kind: "rain" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { condition: code >= 80 ? "Rain showers" : "Rain", kind: "rain" };
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return { condition: code >= 85 ? "Snow showers" : "Snow", kind: "snow" };
  }
  if (code >= 95) return { condition: "Thunderstorm", kind: "storm" };
  return { condition: "Variable", kind: "cloudy" };
}

export async function GET() {
  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
  endpoint.searchParams.set("latitude", "-6.2088");
  endpoint.searchParams.set("longitude", "106.8456");
  endpoint.searchParams.set("current", "temperature_2m,weather_code");
  endpoint.searchParams.set("timezone", "Asia/Jakarta");

  try {
    const response = await fetch(endpoint, { next: { revalidate } });

    if (!response.ok) {
      throw new Error(`Open-Meteo responded with ${response.status}`);
    }

    const payload = (await response.json()) as OpenMeteoResponse;
    const temperature = payload.current?.temperature_2m;
    const weatherCode = payload.current?.weather_code;

    if (typeof temperature !== "number" || typeof weatherCode !== "number") {
      throw new Error("Open-Meteo returned incomplete current conditions");
    }

    const weather = describeWeather(weatherCode);

    return NextResponse.json(
      {
        temperature: Math.round(temperature),
        condition: weather.condition,
        kind: weather.kind,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Jakarta weather is temporarily unavailable" },
      { status: 503 },
    );
  }
}
