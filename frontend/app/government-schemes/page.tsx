"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedLeafLogo from "@/components/AnimatedLeafLogo";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logUserActivity } from "@/lib/activity";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface Scheme {
  name: string;
  description: string;
  objective?: string;
  details?: string;
  funding?: string;
  eligibility?: string;
  apply_link: string;
}

interface SchemesResponse {
  schemes: {
    national?: Scheme[];
    state?: Record<string, Scheme[]>;
  };
}

export default function GovernmentSchemesPage() {
  const [schemesData, setSchemesData] = useState<SchemesResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"national" | "state">("national");
  const [selectedState, setSelectedState] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/schemes.json")
      .then((response) => response.json() as Promise<SchemesResponse>)
      .then((data) => {
        setSchemesData(data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Error fetching schemes data:", error);
        setLoading(false);
      });
  }, []);

  const nationalSchemes = schemesData?.schemes.national ?? [];
  const stateSchemes = schemesData?.schemes.state ?? {};
  const stateNames = useMemo(() => Object.keys(stateSchemes).sort(), [stateSchemes]);

  useEffect(() => {
    if (!selectedState && stateNames.length) {
      setSelectedState(stateNames[0]);
    }
  }, [selectedState, stateNames]);

  const selectedStateSchemes = selectedState ? stateSchemes[selectedState] ?? [] : [];

  const metrics = [
    { label: "Pan-India programmes", value: nationalSchemes.length.toString() || "--", detail: "curated this season" },
    { label: "State incentives", value: stateNames.length.toString() || "--", detail: "actively tracked" },
    { label: "Avg. processing", value: "14 days", detail: "with assisted filing" }
  ];

  const handleSchemeApply = async (scheme: Scheme, scope: "national" | "state") => {
    if (!scheme.name) return;
    await logUserActivity({
      type: "scheme",
      title: `Opened ${scheme.name}`,
      details: `Viewing ${scope} scheme details`,
      meta: {
        scope,
        link: scheme.apply_link,
        state: scope === "state" ? selectedState : undefined
      }
    });
  };

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
              <Link href="/government-schemes" className="text-emerald-700">
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
            <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">Government Schemes</p>
                <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                  Decode funding, insurance, and relief without the paperwork chaos.
                </h1>
                <p className="mt-4 max-w-2xl text-base text-slate-600">
                  We keep live dossiers on national and state programmes so you can shortlist benefits, understand eligibility, and file with confidence.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                  <Sparkles className="h-4 w-4" /> Updated every Monday with policy changes
                </div>
              </div>
              <Card className="border-slate-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">Coverage snapshot</CardTitle>
                  <p className="text-sm text-slate-500">Smart shortlist for your farm profile</p>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-500">{metric.detail}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <section className="mt-10 space-y-6">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm font-medium text-slate-600">
              <button
                onClick={() => setActiveTab("national")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "national" ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
                }`}
              >
                National programmes
              </button>
              <button
                onClick={() => setActiveTab("state")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "state" ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
                }`}
              >
                State incentives
              </button>
              {activeTab === "state" && (
                <label className="ml-auto flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                  State
                  <select
                    value={selectedState}
                    onChange={(event) => setSelectedState(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    {stateNames.map((stateName) => (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {loading && (
                <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 text-slate-500">
                  Syncing programmes...
                </div>
              )}

              {!loading && activeTab === "national" &&
                (nationalSchemes.length ? nationalSchemes : Array.from({ length: 3 }, () => ({ name: "", description: "", apply_link: "#" } as Scheme)))
                  .map((scheme, index) => (
                    <Card key={`${scheme.name}-${index}`} className="border-slate-100 bg-white/90">
                      <CardHeader>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">National</p>
                        <CardTitle className="text-xl text-slate-900">{scheme.name || "Loading"}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600">{scheme.description || "Preparing summary..."}</p>
                        {scheme.eligibility && (
                          <p className="mt-4 rounded-2xl bg-emerald-50/80 px-4 py-2 text-xs font-medium text-emerald-700">
                            Eligibility: {scheme.eligibility}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          className="mt-6 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
                          asChild
                        >
                          <Link
                            href={scheme.apply_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleSchemeApply(scheme, "national")}
                          >
                            View guidelines <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

              {!loading && activeTab === "state" && (selectedStateSchemes.length ? selectedStateSchemes : [])
                .map((scheme) => (
                  <Card key={scheme.name} className="border-slate-100 bg-white/90">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">{selectedState}</p>
                          <CardTitle className="text-xl text-slate-900">{scheme.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">{scheme.description}</p>
                      {scheme.eligibility && (
                        <p className="mt-4 text-xs font-medium text-slate-500">Eligibility: {scheme.eligibility}</p>
                      )}
                      <Button
                        variant="ghost"
                        className="mt-6 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
                        asChild
                      >
                        <Link
                          href={scheme.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleSchemeApply(scheme, "state")}
                        >
                          Open portal <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}

              {!loading && activeTab === "state" && !selectedStateSchemes.length && (
                <Card className="border-dashed border-slate-200 bg-white/80">
                  <CardContent className="p-8 text-sm text-slate-500">
                    Pick a state to reveal targeted incentives.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <section className="mt-12 rounded-3xl border border-slate-100 bg-white/95 p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Need help filing?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Book a guided session and we will walk you through onboarding, document prep, and submission tracking.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                  Request advisor call
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-700">
                  Download scheme checklist
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
