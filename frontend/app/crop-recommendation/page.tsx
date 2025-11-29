"use client";

import { useMemo, useState, useCallback, type ChangeEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Ruler,
  Droplets,
  Wheat,
  ClipboardList,
  Sparkles,
  MapPin,
  Gauge,
  TrendingUp
} from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AnimatedLeafLogo from "@/components/AnimatedLeafLogo";
import PageTransition from "@/components/PageTransition";

type ReportStatus = {
  title: string;
  detail: string;
  freshness: string;
  status: "ready" | "pending";
};

type CropRecommendation = {
  name: string;
  soilFit: string;
  cycleDays: number;
  yieldPerAcre: number;
  pricePerQuintal: number;
  rationale: string;
  inputs: string[];
};

type MarketSignal = {
  crop: string;
  mandi: string;
  price: number;
  change: string;
  demand: string;
};

const reportChecklist: ReportStatus[] = [
  {
    title: "Soil profile",
    detail: "Organic carbon, texture, macro nutrients",
    freshness: "Updated 6 days ago",
    status: "ready"
  },
  {
    title: "Water quality",
    detail: "Irrigation sample (EC, pH, hardness)",
    freshness: "Pending upload",
    status: "pending"
  },
  {
    title: "Land survey",
    detail: "Geo boundaries, slope, current cover",
    freshness: "Synced via satellite",
    status: "ready"
  }
];

const cropRecommendations: CropRecommendation[] = [
  {
    name: "Turmeric (Prabha)",
    soilFit: "Loamy, pH 6.5-7.2",
    cycleDays: 210,
    yieldPerAcre: 32,
    pricePerQuintal: 7600,
    rationale: "High rhizome demand from pharma segment; thrives with drip + mulching",
    inputs: ["Seed rhizomes", "Bio-fungicide", "Drip fertigation"]
  },
  {
    name: "Baby corn",
    soilFit: "Sandy loam, moderate drainage",
    cycleDays: 90,
    yieldPerAcre: 16,
    pricePerQuintal: 3400,
    rationale: "Short cycle cash flow, contract buyers available in Kolhapur cluster",
    inputs: ["Hybrid seed", "Soluble NPK", "Foliar micronutrients"]
  },
  {
    name: "Marigold",
    soilFit: "Silt loam, pH 6-7.5",
    cycleDays: 120,
    yieldPerAcre: 14,
    pricePerQuintal: 2800,
    rationale: "Festive spikes Nov-Feb plus bee-attracting intercrop value",
    inputs: ["Nursery trays", "Drip laterals", "Organic mulching"]
  }
];

const marketSignals: MarketSignal[] = [
  { crop: "Turmeric", mandi: "Sangli", price: 7850, change: "+3.8%", demand: "Export polishing units" },
  { crop: "Baby corn", mandi: "Pune", price: 3525, change: "+1.4%", demand: "Food processing" },
  { crop: "Marigold", mandi: "Dombivli", price: 2680, change: "-0.8%", demand: "Retail florists" }
];

const actionPlan = [
  {
    title: "Soil remediation",
    detail: "Incorporate 2 MT vermicompost + gypsum for boron correction",
    status: "Week 01"
  },
  {
    title: "Irrigation retrofit",
    detail: "Lay 16mm inline drip, spacing 40 cm, connect to existing borewell",
    status: "Week 02"
  },
  {
    title: "Nursery & transplant",
    detail: "Raise turmeric sets + marigold trays under shade net",
    status: "Week 04"
  },
  {
    title: "Market locking",
    detail: "Sign forward contract for 40% turmeric output with Sangli processor",
    status: "Week 05"
  }
];

const scenarios = [
  { id: "baseline", label: "Balanced inputs", uplift: 1 },
  { id: "intensive", label: "High-density drip", uplift: 1.18 },
  { id: "organic", label: "Organic focus", uplift: 0.9 }
];

export default function CropRecommendationPage() {
  const [farmLocation, setFarmLocation] = useState("Kolhapur, IN");
  const [farmArea, setFarmArea] = useState("2.5");
  const [activeScenario, setActiveScenario] = useState("baseline");
  const [soilReportFile, setSoilReportFile] = useState<File | null>(null);

  const parsedArea = useMemo(() => {
    const value = parseFloat(farmArea);
    if (Number.isNaN(value) || value <= 0) return 1;
    return Math.min(value, 50);
  }, [farmArea]);

  const scenarioMultiplier = useMemo(() => {
    return scenarios.find((scenario) => scenario.id === activeScenario)?.uplift ?? 1;
  }, [activeScenario]);

  const computedRecommendations = useMemo(() => {
    return cropRecommendations.map((crop) => {
      const yieldQuintals = crop.yieldPerAcre * parsedArea * scenarioMultiplier;
      const revenue = yieldQuintals * crop.pricePerQuintal;
      return {
        ...crop,
        yieldQuintals,
        revenue
      };
    });
  }, [parsedArea, scenarioMultiplier]);

  const handleSoilReportUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSoilReportFile(file);
  }, []);

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
              <Link href="/growth-factors" className="transition-colors hover:text-emerald-700">
                Growth factors
              </Link>
              <Link href="/weather" className="transition-colors hover:text-emerald-700">
                Weather
              </Link>
              <Link href="/community-forum" className="transition-colors hover:text-emerald-700">
                Community
              </Link>
              <Link href="/marketplace" className="transition-colors hover:text-emerald-700">
                Marketplace
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
          className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur"
        >
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Crop Recommendation</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                Turn soil intelligence and land records into crop + yield recommendations.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600">
                Designed for a first-season farmer. Plug in soil reports, water samples, and land size to simulate the best-fit crops,
                expected harvest, and current market sentiment. APIs will soon connect to state labs so this UI is future-ready.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Personalized playbook ready for {farmLocation} farm blocks
              </div>
            </div>

            <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="location">
                Farm location
              </label>
              <Input
                id="location"
                value={farmLocation}
                onChange={(event) => setFarmLocation(event.target.value)}
                placeholder="Village / Mandal"
                className="border-slate-200"
              />
              <label className="text-sm font-semibold text-slate-700" htmlFor="area">
                Land size (acres)
              </label>
              <Input
                id="area"
                type="number"
                step="0.5"
                min="0.5"
                value={farmArea}
                onChange={(event) => setFarmArea(event.target.value)}
                className="border-slate-200"
              />
              <label className="text-sm font-semibold text-slate-700" htmlFor="scenario">
                Investment scenario
              </label>
              <select
                id="scenario"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700"
                value={activeScenario}
                onChange={(event) => setActiveScenario(event.target.value)}
              >
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-white/70 p-4 text-center">
                <Input
                  id="soil-report-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleSoilReportUpload}
                />
                <label
                  htmlFor="soil-report-upload"
                  className="flex cursor-pointer flex-col items-center gap-2 text-sm text-emerald-700"
                >
                  <FileText className="h-5 w-5" />
                  {soilReportFile ? (
                    <>
                      <span className="font-semibold">{soilReportFile.name}</span>
                      <span className="text-xs text-slate-500">Click to replace soil report</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Upload soil report</span>
                      <span className="text-xs text-slate-500">PDF or image, max 10 MB</span>
                    </>
                  )}
                </label>
                {soilReportFile && (
                  <Button
                    variant="ghost"
                    className="mt-3 w-full text-xs text-rose-600 hover:text-rose-700"
                    onClick={() => setSoilReportFile(null)}
                    type="button"
                  >
                    Remove file
                  </Button>
                )}
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Generate plan</Button>
              <p className="text-xs text-slate-500">Live integrations will auto-fetch lab reports and mandi bids.</p>
            </div>
          </div>
        </motion.section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {reportChecklist.map((report) => (
            <Card key={report.title} className="border-slate-100 bg-white/90">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">{report.title}</CardTitle>
                {report.status === "ready" ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ready</span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Pending</span>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">{report.detail}</p>
                <p className="mt-3 text-xs text-slate-400">{report.freshness}</p>
                {report.status === "pending" && (
                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <FileText className="h-4 w-4" />
                    Upload report
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-slate-100 bg-white/90">
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg text-slate-900">Field snapshot</CardTitle>
                <p className="text-sm text-slate-500">Auto-compiled from soil labs + land survey</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <MapPin className="h-4 w-4" /> {farmLocation}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Ruler className="h-4 w-4 text-emerald-600" />
                  Land size
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{parsedArea.toFixed(1)} acres</p>
                <p className="text-xs text-slate-500">Contour leveled with 1% slope</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Droplets className="h-4 w-4 text-sky-600" />
                  Water availability
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-900">Adequate</p>
                <p className="text-xs text-slate-500">Borewell discharge 1.8" + farm pond backup</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Gauge className="h-4 w-4 text-amber-500" />
                  Soil reaction
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-900">pH 6.8</p>
                <p className="text-xs text-slate-500">Medium organic carbon, ideal for spices</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ClipboardList className="h-4 w-4 text-indigo-600" />
                  Constraints
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">Mild boron deficiency, need drip automation</p>
                <p className="text-xs text-slate-500">Action plan allocated budget ₹18k</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Projected yield & revenue</CardTitle>
              <p className="text-sm text-slate-300">Based on selected scenario</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {computedRecommendations.map((crop) => (
                <div key={crop.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{crop.name}</span>
                    <span className="text-emerald-200">{crop.cycleDays} days</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">{crop.yieldQuintals.toFixed(0)} qtl</p>
                  <p className="text-sm text-slate-200">≈ ₹{(crop.revenue / 100000).toFixed(2)} lakh gross</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-100 bg-white/90 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Recommendation deck</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Top crops for your soil band</h2>
              <p className="text-sm text-slate-500">Compares soil fit, input intensity, and market pull.</p>
            </div>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/marketplace">Share plan with agronomist</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {computedRecommendations.map((crop) => (
              <div key={crop.name} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">{crop.name}</p>
                    <p className="text-xs text-slate-500">{crop.soilFit}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">{crop.cycleDays} days</span>
                </div>
                <p className="text-base text-slate-600">{crop.rationale}</p>
                <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <Wheat className="h-4 w-4 text-emerald-600" /> Yield + price
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{crop.yieldQuintals.toFixed(0)} qtl</p>
                  <p className="text-xs text-slate-500">₹{crop.pricePerQuintal.toLocaleString()} / qtl · ₹{(crop.revenue / 100000).toFixed(2)} lakh gross</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-700">Starter kit</p>
                  <ul className="space-y-1 text-xs">
                    {crop.inputs.map((input) => (
                      <li key={input} className="flex items-center gap-2 text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {input}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-slate-100 bg-white/90">
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg text-slate-900">Market pulse</CardTitle>
                <p className="text-sm text-slate-500">Last refreshed 15 minutes ago</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="h-4 w-4" /> Demand outlook
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="py-3">Crop</th>
                    <th>Mandi</th>
                    <th>Avg price</th>
                    <th>Change</th>
                    <th>Demand driver</th>
                  </tr>
                </thead>
                <tbody>
                  {marketSignals.map((signal) => (
                    <tr key={signal.crop} className="border-t border-slate-100 text-slate-700">
                      <td className="py-3 font-semibold">{signal.crop}</td>
                      <td>{signal.mandi}</td>
                      <td className="font-medium text-slate-900">₹{signal.price.toLocaleString()}</td>
                      <td className={signal.change.startsWith("-") ? "text-red-500" : "text-emerald-600"}>{signal.change}</td>
                      <td>{signal.demand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Seasonal action plan</CardTitle>
              <p className="text-sm text-slate-300">Auto-sequenced for a first-time farmer</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionPlan.map((step) => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{step.title}</span>
                    <span className="text-emerald-200">{step.status}</span>
                  </div>
                  <p className="mt-2 text-slate-200 text-sm">{step.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-100 bg-white/95 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Need an agronomist to validate these numbers?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Share the dashboard as a secure link or invite your local agri-dealer. All lab files stay versioned in AgriConnect for compliance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Invite agronomist</Button>
              <Button variant="outline" className="border-slate-200 text-slate-700">
                Export PDF report
              </Button>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
