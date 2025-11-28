"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  CloudSun,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Sunrise,
  Sunset,
  Activity,
  ShieldCheck,
  CalendarRange,
  Sprout,
  Sun,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";

type ForecastIcon = "sunny" | "partly" | "rain" | "cloud";

interface ForecastDay {
  id: number;
  label: string;
  date: string;
  condition: string;
  icon: ForecastIcon;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  humidity: number;
  windKph: number;
  soilMoisture: number;
  evapotranspiration: number;
  sunrise: string;
  sunset: string;
}

const defaultForecast: ForecastDay[] = [
  {
    id: 0,
    label: "Today",
    date: "Tue - 07 Jan",
    condition: "Clear sunrise, light clouds after noon",
    icon: "sunny",
    tempMax: 31,
    tempMin: 18,
    rainChance: 8,
    humidity: 58,
    windKph: 12,
    soilMoisture: 38,
    evapotranspiration: 4.1,
    sunrise: "06:38",
    sunset: "18:12",
  },
  {
    id: 1,
    label: "Wed",
    date: "08 Jan",
    condition: "Humid morning, scattered clouds",
    icon: "partly",
    tempMax: 30,
    tempMin: 19,
    rainChance: 22,
    humidity: 64,
    windKph: 16,
    soilMoisture: 41,
    evapotranspiration: 3.9,
    sunrise: "06:38",
    sunset: "18:13",
  },
  {
    id: 2,
    label: "Thu",
    date: "09 Jan",
    condition: "Moisture build-up - evening drizzle",
    icon: "rain",
    tempMax: 28,
    tempMin: 18,
    rainChance: 55,
    humidity: 70,
    windKph: 20,
    soilMoisture: 45,
    evapotranspiration: 3.3,
    sunrise: "06:39",
    sunset: "18:13",
  },
  {
    id: 3,
    label: "Fri",
    date: "10 Jan",
    condition: "Cloud deck holds, cooler night",
    icon: "cloud",
    tempMax: 26,
    tempMin: 17,
    rainChance: 36,
    humidity: 68,
    windKph: 14,
    soilMoisture: 47,
    evapotranspiration: 3.1,
    sunrise: "06:39",
    sunset: "18:14",
  },
];

const guidance = [
  {
    title: "Irrigation",
    highlight: "Skip morning irrigation",
    detail: "Top soil moisture sits at 38% and humidity stays above 55% till noon. Hold irrigation till late evening if leaves remain dry.",
    metric: "Save ~12% water",
    tone: "alert" as const,
    icon: <Droplets className="h-5 w-5" />,
  },
  {
    title: "Protection",
    highlight: "Prep foliar spray window",
    detail: "Wind speeds dip under 10 km/h between 18:00-20:00. Ideal slot for micronutrient spray without drift.",
    metric: "80% spray efficiency",
    tone: "info" as const,
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Field Work",
    highlight: "Transplant on Thursday",
    detail: "Cloud cover plus light drizzle keeps soil friable. Schedule delicate transplanting before Friday cool-down.",
    metric: "Low heat stress",
    tone: "success" as const,
    icon: <Sprout className="h-5 w-5" />,
  },
];

const operationsTimeline = [
  {
    time: "05:30",
    label: "Fog clears",
    detail: "Ventilate polyhouse, open eastern vents gradually.",
  },
  {
    time: "09:15",
    label: "Canopy stress check",
    detail: "Leaf temperature expected plus 3 deg C over air. Spot-check drip blocks.",
  },
  {
    time: "14:00",
    label: "Heat pause",
    detail: "Shade nets to 60% for tender saplings.",
  },
  {
    time: "19:30",
    label: "Spray window",
    detail: "Foliar spray + bio-fungicide, winds calm < 8 km/h.",
  },
];

const soilAdvisory = {
  surface: 38,
  rootzone: 52,
  refillPoint: 35,
  notes: "Moisture trend rising for next 48h. Resume regular schedule post-Thursday drizzle.",
};

const tagStyles = {
  alert: "bg-amber-100 text-amber-800 border-amber-200",
  info: "bg-sky-100 text-sky-800 border-sky-200",
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const degreeSymbol = String.fromCharCode(176);
const formatTemp = (value: number) => `${value}${degreeSymbol}C`;

const iconMap: Record<ForecastIcon, JSX.Element> = {
  sunny: <Sun className="h-4 w-4 text-amber-500" />,
  partly: <CloudSun className="h-4 w-4 text-emerald-500" />,
  rain: <CloudRain className="h-4 w-4 text-sky-500" />,
  cloud: <Cloud className="h-4 w-4 text-slate-500" />,
};

export default function WeatherIntelligencePage() {
  const [location, setLocation] = useState("Nashik, IN");
  const [status, setStatus] = useState("Synced with IMD grid - 2 min ago");
  const [isFetching, setIsFetching] = useState(false);
  const [forecast, setForecast] = useState(defaultForecast);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = forecast[selectedDayIndex];

  const keyStats = useMemo(
    () => [
      {
        label: "Field Temp",
        value: formatTemp(selectedDay.tempMax),
        subtext: `Feels like ${selectedDay.tempMax + 1}${degreeSymbol}C mid-afternoon`,
        icon: <Thermometer className="h-5 w-5 text-emerald-600" />,
      },
      {
        label: "Humidity",
        value: `${selectedDay.humidity}%`,
        subtext: "Optimum for foliar spray",
        icon: <CloudSun className="h-5 w-5 text-sky-600" />,
      },
      {
        label: "Wind",
        value: `${selectedDay.windKph} km/h`,
        subtext: "Peaks near 14:30",
        icon: <Wind className="h-5 w-5 text-blue-600" />,
      },
      {
        label: "Rain chance",
        value: `${selectedDay.rainChance}%`,
        subtext: selectedDay.rainChance > 40 ? "Carry quick drainage" : "Low precipitation risk",
        icon: <CloudRain className="h-5 w-5 text-indigo-600" />,
      },
    ],
    [selectedDay]
  );

  const handleLocationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFetching(true);

    // Mock network call until backend wiring is completed
    setTimeout(() => {
      setStatus(`Updated for ${location} - ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      setForecast((prev) => [...prev]);
      setIsFetching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-white to-white">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/80 backdrop-blur">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center text-xl font-semibold text-emerald-900">
            <Leaf className="mr-2 h-5 w-5 text-emerald-600" />
            AgriConnect
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/growth-factors" className="hover:text-emerald-700">
              Growth Factors
            </Link>
            <Link href="/disease-detection" className="hover:text-emerald-700">
              Disease Detection
            </Link>
            <Link href="/marketplace" className="hover:text-emerald-700">
              Marketplace
            </Link>
          </div>
          <Button variant="outline" asChild className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
            <Link href="/" className="text-sm">
              Dashboard
            </Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto flex-1 px-4 py-12">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-100 bg-white/70 px-6 py-8 shadow-sm backdrop-blur"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">Weather Intelligence</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                Weather-aware recommendations tailored for your field blocks.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600">
                Track hyperlocal forecasts, soil moisture cues, irrigation windows, and smart activity plans. The backend API will plug in live satellite plus sensor feeds, and this page already matches the required data model.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                <Activity className="h-4 w-4" />
                {status}
              </div>
            </div>
            <form onSubmit={handleLocationSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <label className="text-sm font-semibold text-slate-700" htmlFor="location">
                Field / Village
              </label>
              <Input
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Ex: Nashik, IN"
                className="border-slate-200"
              />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isFetching}>
                {isFetching ? "Syncing..." : "Update insights"}
              </Button>
              <p className="text-xs text-slate-500">
                Coming soon: choose blocks directly from your farm profile.
              </p>
            </form>
          </div>
        </motion.section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {keyStats.map((stat) => (
            <Card key={stat.label} className="border-slate-100 bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="border-slate-100 bg-white/90">
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg text-slate-800">{selectedDay.label} - {selectedDay.date}</CardTitle>
                <p className="text-sm text-slate-500">{selectedDay.condition}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {iconMap[selectedDay.icon]}
                <span>Field-ready</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Temperature swing</span>
                  <span className="font-semibold text-slate-900">
                    {formatTemp(selectedDay.tempMin)} &rarr; {formatTemp(selectedDay.tempMax)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Sunrise</span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Sunrise className="h-4 w-4 text-amber-500" />
                    {selectedDay.sunrise}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Sunset</span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Sunset className="h-4 w-4 text-indigo-500" />
                    {selectedDay.sunset}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Evapotranspiration</span>
                  <span className="font-semibold text-slate-900">{selectedDay.evapotranspiration.toFixed(1)} mm</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="text-sm font-semibold text-emerald-700">Moisture alert</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-900">{selectedDay.soilMoisture}%</p>
                  <p className="text-sm text-emerald-800">Surface zone moisture</p>
                  <p className="mt-3 text-xs text-emerald-700">Hold irrigation until <strong>17:00</strong> unless leaf wilting observed.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-5">
                  <p className="text-sm font-semibold text-slate-700">Wind comfort band</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{selectedDay.windKph} km/h</p>
                  <p className="text-xs text-slate-500">Safe for spray operations below 18 km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Operational timeline</CardTitle>
              <p className="text-sm text-slate-300">Auto-generated playbook for today</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {operationsTimeline.map((slot) => (
                <div key={slot.time} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-200">{slot.time}</p>
                    <p className="text-xs text-slate-200">IST</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{slot.label}</p>
                    <p className="text-xs text-slate-200">{slot.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">5-day outlook</h2>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
              <CalendarRange className="h-4 w-4" />
              data refresh every 3 hours
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {forecast.map((day, index) => (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(index)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  index === selectedDayIndex
                    ? "border-emerald-400 bg-emerald-50 shadow"
                    : "border-slate-200 bg-white/80 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>{day.label}</span>
                  {iconMap[day.icon]}
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatTemp(day.tempMax)}</p>
                <p className="text-xs text-slate-500">Low {formatTemp(day.tempMin)} - RH {day.humidity}%</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5 text-sky-500" />
                    {day.rainChance}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="h-3.5 w-3.5 text-emerald-500" />
                    {day.windKph} km/h
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {guidance.map((item) => (
            <Card key={item.title} className={`border ${tagStyles[item.tone]} bg-white`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold text-slate-800">{item.title}</CardTitle>
                <span className="rounded-full bg-white/70 p-2 text-emerald-700">{item.icon}</span>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-slate-900">{item.highlight}</p>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.metric}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="border-slate-100 bg-white/90">
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg text-slate-900">Soil & irrigation insight</CardTitle>
                <p className="text-sm text-slate-500">Based on surface + root zone sensors</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                <Droplets className="h-4 w-4 text-emerald-500" />
                Next backend hook: /api/weather/soil
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-xs uppercase text-emerald-600">Surface</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-900">{soilAdvisory.surface}%</p>
                <p className="text-xs text-emerald-700">Top 15 cm moisture</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Root zone</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{soilAdvisory.rootzone}%</p>
                <p className="text-xs text-slate-500">45 cm sensor read</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Refill point</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{soilAdvisory.refillPoint}%</p>
                <p className="text-xs text-slate-500">Trigger threshold</p>
              </div>
              <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-sm font-semibold text-slate-800">Planner note</p>
                <p className="mt-2 text-sm text-slate-600">{soilAdvisory.notes}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Field watchlist</CardTitle>
              <p className="text-sm text-slate-500">Monitor micro-climate sensitive spots</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">Low-lying patch</p>
                <p className="text-xs text-amber-800">High runoff risk if Thu drizzle strengthens. Keep drains clear.</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <p className="text-sm font-semibold text-sky-900">Polyhouse 2</p>
                <p className="text-xs text-sky-800">Raise vents by 10% after 10:30 to avoid condensation drip.</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">Drip block C1</p>
                <p className="text-xs text-emerald-800">Schedule fertigation Friday early morning when EC stabilises.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-900 px-6 py-6 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-200">Next up</p>
            <h3 className="mt-2 text-2xl font-semibold">Wire live backend feed</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              When the weather microservice is ready, this page already accepts: location, hourly forecast, soil profile, and recommendation payloads. Swap the mock data with API responses and reuse the same layout.
            </p>
          </div>
          <Button asChild className="bg-white text-slate-900 hover:bg-slate-200">
            <Link href="/api/docs">View data contract</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
