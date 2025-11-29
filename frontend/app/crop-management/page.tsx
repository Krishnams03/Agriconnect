"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Droplets,
  Sprout,
  ThermometerSun,
  Gauge,
  CalendarClock,
  BarChart3,
  Leaf,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Tractor,
  ClipboardCheck
} from "lucide-react";
import AnimatedLeafLogo from "@/components/AnimatedLeafLogo";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const crops = [
  {
    id: "turmeric",
    name: "Turmeric",
    baseWaterMm: 18,
    yieldPerAcre: 32,
    pricePerQuintal: 7600,
    costPerAcre: 42000,
    notes: "Loves evenly moist raised beds with mulching"
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    baseWaterMm: 28,
    yieldPerAcre: 38,
    pricePerQuintal: 3400,
    costPerAcre: 52000,
    notes: "Needs heavy irrigation during tillering"
  },
  {
    id: "tomato",
    name: "Tomato",
    baseWaterMm: 12,
    yieldPerAcre: 18,
    pricePerQuintal: 2200,
    costPerAcre: 38000,
    notes: "Consistent moisture prevents blossom end rot"
  }
];

const growthStages = [
  { id: "establishment", label: "Establishment", multiplier: 0.8 },
  { id: "vegetative", label: "Vegetative", multiplier: 1 },
  { id: "flowering", label: "Flowering", multiplier: 1.15 },
  { id: "maturity", label: "Maturity", multiplier: 0.9 }
];

const soilConditions = [
  { id: "saturated", label: "Field capacity", factor: 0.7 },
  { id: "optimal", label: "Optimal moisture", factor: 1 },
  { id: "dry", label: "Dry topsoil", factor: 1.2 }
];

const irrigationModes = [
  { id: "drip", label: "Drip", efficiency: 0.92, intervalDays: 2 },
  { id: "sprinkler", label: "Sprinkler", efficiency: 0.78, intervalDays: 3 },
  { id: "flood", label: "Flood / furrow", efficiency: 0.6, intervalDays: 5 }
];

const nutrientPlan = {
  turmeric: [
    { week: "Week 02", activity: "Apply 20:20:20 @ 5kg/acre through drip" },
    { week: "Week 05", activity: "Soil drench bio-fungicide + micronutrients" },
    { week: "Week 09", activity: "Foliar spray Ca-Boron to support rhizomes" }
  ],
  sugarcane: [
    { week: "Week 03", activity: "Apply urea @ 45kg + potash @ 30kg" },
    { week: "Week 08", activity: "Trash mulching + microbes for ratoon" },
    { week: "Week 12", activity: "Silica rich foliar for stem strength" }
  ],
  tomato: [
    { week: "Week 01", activity: "Soil drench Trichoderma + FYM" },
    { week: "Week 04", activity: "Fertigation 19:19:19 @ 4kg/acre" },
    { week: "Week 07", activity: "Calcium nitrate + magnesium foliar" }
  ]
};

const operations = [
  { title: "Irrigation health", status: "green", detail: "Emitters flushed, pressure stable" },
  { title: "Soil nutrients", status: "amber", detail: "Zinc trending low, schedule foliar" },
  { title: "Pest scouting", status: "green", detail: "No significant pest catch last 48h" },
  { title: "Lab reports", status: "red", detail: "Water EC pending test" }
];

const advisoryTips = [
  {
    title: "Mulch & canopy",
    message: "Retain surface moisture by adding 3cm straw mulch once soil temperature crosses 32°C."
  },
  {
    title: "Sensor sync",
    message: "Soil moisture probe at 30cm shows 22% VWC. Trigger irrigation when it dips below 18%."
  },
  {
    title: "Market forward",
    message: "Export buyers locking turmeric for Jan shipments—fix at least 40% of expected output."
  }
];

export default function CropManagementPage() {
  const [selectedCrop, setSelectedCrop] = useState(crops[0].id);
  const [selectedStage, setSelectedStage] = useState(growthStages[1].id);
  const [soilState, setSoilState] = useState(soilConditions[1].id);
  const [irrigationMode, setIrrigationMode] = useState(irrigationModes[0].id);
  const [areaAcres, setAreaAcres] = useState("2.5");
  const [targetMoisture, setTargetMoisture] = useState("24");

  const cropInfo = useMemo(() => crops.find((crop) => crop.id === selectedCrop) ?? crops[0], [selectedCrop]);
  const stageInfo = useMemo(
    () => growthStages.find((stage) => stage.id === selectedStage) ?? growthStages[0],
    [selectedStage]
  );
  const soilInfo = useMemo(
    () => soilConditions.find((condition) => condition.id === soilState) ?? soilConditions[1],
    [soilState]
  );
  const irrigationInfo = useMemo(
    () => irrigationModes.find((mode) => mode.id === irrigationMode) ?? irrigationModes[0],
    [irrigationMode]
  );
  const parsedAreaAcres = useMemo(() => {
    const num = parseFloat(areaAcres);
    if (Number.isNaN(num) || num <= 0) return 1;
    return Math.min(num, 50);
  }, [areaAcres]);

  const waterGuidance = useMemo(() => {
    const areaHectares = parsedAreaAcres * 0.4047;
    const grossMm = cropInfo.baseWaterMm * stageInfo.multiplier * soilInfo.factor;
    const netMm = grossMm / irrigationInfo.efficiency;
    const liters = netMm * areaHectares * 10000; // 1 mm over 1 ha equals 10,000 L
    const kiloLiters = liters / 1000;
    const perDay = kiloLiters / irrigationInfo.intervalDays;
    return {
      grossMm: grossMm.toFixed(1),
      netMm: netMm.toFixed(1),
      kiloLiters: kiloLiters.toFixed(1),
      perDay: perDay.toFixed(1),
      interval: irrigationInfo.intervalDays
    };
  }, [cropInfo, stageInfo, soilInfo, irrigationInfo, parsedAreaAcres]);

  const profitability = useMemo(() => {
    const revenue = cropInfo.yieldPerAcre * cropInfo.pricePerQuintal * parsedAreaAcres;
    const cost = cropInfo.costPerAcre * parsedAreaAcres;
    const margin = revenue - cost;
    return {
      revenue: Math.round(revenue),
      cost: Math.round(cost),
      margin: Math.round(margin)
    };
  }, [cropInfo, parsedAreaAcres]);

  return (
    <PageTransition variant="fade">
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
        <header className="border-b border-emerald-100 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="flex items-center gap-3" aria-label="AgriConnect home">
              <AnimatedLeafLogo size="sm" />
              <span className="text-xl font-semibold tracking-tight text-slate-900">AgriConnect</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <Link href="/crop-recommendation" className="transition-colors hover:text-emerald-700">
                Crop recommendation
              </Link>
              <Link href="/community-forum" className="transition-colors hover:text-emerald-700">
                Community
              </Link>
              <Link href="/government-schemes" className="transition-colors hover:text-emerald-700">
                Schemes
              </Link>
              <Link href="/weather" className="transition-colors hover:text-emerald-700">
                Weather
              </Link>
              <Button variant="outline" asChild className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                <Link href="/">Back to main</Link>
              </Button>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-12">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-emerald-100 bg-white/85 p-8 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Crop management</p>
                <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                  Precision irrigation and input playbooks tuned for your chosen crop.
                </h1>
                <p className="mt-4 max-w-2xl text-base text-slate-600">
                  Compare water, nutrient, and field operations in one glance. Live field sensors and mandi intelligence plug in here so you can adapt plans quickly without losing profitability.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  <Sprout className="h-4 w-4" />
                  {cropInfo.notes}
                </div>
              </div>

              <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <label className="text-sm font-semibold text-slate-700">Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(event) => setSelectedCrop(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700"
                >
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-semibold text-slate-700">Growth stage</label>
                <select
                  value={selectedStage}
                  onChange={(event) => setSelectedStage(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700"
                >
                  {growthStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-semibold text-slate-700" htmlFor="area">
                  Farm area (acres)
                </label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={areaAcres}
                  onChange={(event) => setAreaAcres(event.target.value)}
                  className="border-slate-200"
                />

                <label className="text-sm font-semibold text-slate-700">Soil moisture snapshot</label>
                <select
                  value={soilState}
                  onChange={(event) => setSoilState(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700"
                >
                  {soilConditions.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.label}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-semibold text-slate-700">Irrigation method</label>
                <select
                  value={irrigationMode}
                  onChange={(event) => setIrrigationMode(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700"
                >
                  {irrigationModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.label}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-semibold text-slate-700" htmlFor="moisture">
                  Target soil moisture (%)
                </label>
                <Input
                  id="moisture"
                  type="number"
                  min="10"
                  max="40"
                  value={targetMoisture}
                  onChange={(event) => setTargetMoisture(event.target.value)}
                  className="border-slate-200"
                />

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Refresh plan</Button>
                <p className="text-xs text-slate-500">Next release: auto-sync with IoT probes and fertigation units.</p>
              </div>
            </div>
          </motion.section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="border-slate-100 bg-white/90">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Watering guidance</CardTitle>
                  <p className="text-sm text-slate-500">Calculated from soil + irrigation efficiency</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Droplets className="h-4 w-4" /> Interval {waterGuidance.interval} days
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Gross depth</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{waterGuidance.grossMm} mm</p>
                  <p className="text-xs text-slate-500">Stage + soil adjusted</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Net depth</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{waterGuidance.netMm} mm</p>
                  <p className="text-xs text-slate-500">After {Math.round(irrigationInfo.efficiency * 100)}% efficiency</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Volume</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{waterGuidance.kiloLiters} kL</p>
                  <p className="text-xs text-slate-500">≈ {waterGuidance.perDay} kL/day</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Profitability snapshot</CardTitle>
                <p className="text-sm text-slate-300">Per current crop + acreage</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Projected revenue</p>
                  <p className="mt-2 text-3xl font-semibold">₹{(profitability.revenue / 100000).toFixed(2)} Lakh</p>
                  <p className="text-xs text-slate-300">Yield × mandi price</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Operational cost</p>
                  <p className="mt-2 text-3xl font-semibold">₹{(profitability.cost / 100000).toFixed(2)} Lakh</p>
                  <p className="text-xs text-slate-300">Inputs + labour</p>
                </div>
                <div className="rounded-2xl border border-emerald-200/50 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Expected margin</p>
                  <p className="mt-2 text-3xl font-semibold text-white">₹{(profitability.margin / 100000).toFixed(2)} Lakh</p>
                  <p className="text-xs text-emerald-100">Lock contracts for stability</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-100 bg-white/90">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Nutrient & field tasks</CardTitle>
                  <p className="text-sm text-slate-500">Rolling 12-week playbook</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <FlaskConical className="h-4 w-4" /> Soil health focus
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(nutrientPlan[selectedCrop as keyof typeof nutrientPlan] ?? []).map((item) => (
                  <div key={item.week} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">{item.week}</div>
                    <p className="mt-2 text-sm text-slate-700">{item.activity}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
                  Sync agronomist tasks from the community forum or upload your own SOP.
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 bg-white/90">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Operations board</CardTitle>
                  <p className="text-sm text-slate-500">Machine health • sensors • risk</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Tractor className="h-4 w-4" /> Updated 15 min ago
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {operations.map((op) => (
                  <div
                    key={op.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{op.title}</p>
                      <p className="text-xs text-slate-500">{op.detail}</p>
                    </div>
                    {op.status === "green" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    {op.status === "amber" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                    {op.status === "red" && <AlertTriangle className="h-5 w-5 text-rose-500" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="mt-10 rounded-3xl border border-slate-100 bg-white/90 p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {advisoryTips.map((tip) => (
                <div key={tip.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    <ThermometerSun className="h-4 w-4" /> {tip.title}
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{tip.message}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Need remote support?</p>
                <p className="mt-2 text-base text-slate-700">
                  Book a 20-minute crop walk-through with an agronomist—share your telemetry and we will calibrate irrigation & fertigation.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Book agronomist slot</Button>
                <Button variant="outline" className="border-emerald-200 text-emerald-800">
                  Download SOP pack
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="border-slate-100 bg-white/90">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Scheduling board</CardTitle>
                  <p className="text-sm text-slate-500">Coming week at a glance</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <CalendarClock className="h-4 w-4" /> Auto-synced
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { day: "Monday", task: "Irrigate 18 kL via drip", icon: Droplets },
                  { day: "Wednesday", task: "Foliar spray micronutrients", icon: FlaskConical },
                  { day: "Friday", task: "Soil moisture probe calibration", icon: Gauge }
                ].map((item) => (
                  <div key={item.day} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <item.icon className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.day}</p>
                      <p className="text-xs text-slate-500">{item.task}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-100 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Readiness checklist</CardTitle>
                <p className="text-sm text-slate-300">Close these before the next irrigation cycle</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Flush fertigation venturi", status: "Done" },
                  { title: "Upload borewell EC report", status: "Pending" },
                  { title: "Calibrate moisture probes", status: "Scheduled" }
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <span>{item.title}</span>
                    <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold">
                      {item.status}
                    </span>
                  </div>
                ))}
                <Button variant="secondary" className="mt-2 w-full bg-white text-emerald-800 hover:bg-emerald-50">
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Export tasks
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
