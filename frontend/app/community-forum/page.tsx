"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  Sparkles,
  Share2,
  ShieldCheck,
  Clock3,
  TrendingUp,
  Tag
} from "lucide-react";
import Footer from "@/components/Footer";
import AnimatedLeafLogo from "@/components/AnimatedLeafLogo";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const quickStats = [
  { label: "Active growers", value: "8.4k", subtext: "logged-in this month", icon: Users },
  { label: "Expert mentors", value: "140", subtext: "agronomy + supply chain", icon: ShieldCheck },
  { label: "Daily threads", value: "120", subtext: "averaged last 7 days", icon: MessageCircle }
];

const spotlightStories = [
  {
    title: "Drip retrofits on 3 acres",
    region: "Kolhapur",
    detail: "Saved 28% water and cut foliar sprays by using forum playbooks.",
    tag: "Water savings"
  },
  {
    title: "Collective turmeric marketing",
    region: "Sangli",
    detail: "Five growers banded together after a mentor-led session and cracked an export buyer.",
    tag: "Market access"
  }
];

const threads = [
  {
    title: "Need intercrop ideas after sugarcane harvest",
    category: "Crop planning",
    replies: 23,
    updated: "8 min ago",
    highlights: ["Soil test uploaded", "2 acre block"],
    tags: ["Kolhapur", "Drip", "High value"]
  },
  {
    title: "Black thrips flare-up in chilli greenhouse",
    category: "Crop protection",
    replies: 41,
    updated: "32 min ago",
    highlights: ["Sticky cards data", "Humidity 82%"],
    tags: ["IPM", "Protected"]
  },
  {
    title: "Looking for mandi buyers for baby corn",
    category: "Market linkage",
    replies: 17,
    updated: "1 hr ago",
    highlights: ["5 MT weekly", "Cold chain available"],
    tags: ["Contracts", "Logistics"]
  }
];

const discoveryTags = [
  "Soil health",
  "Organic",
  "Export",
  "FPO",
  "Protected",
  "Inputs",
  "Weather",
  "Finance"
];

export default function CommunityForumPage() {
  const [topic, setTopic] = useState("Greenhouse climate empathy");
  const [summary, setSummary] = useState("Need help with balancing humidity and ventilation after 2 PM.");
  const [category, setCategory] = useState("Crop management");
  const [ctaMessage, setCtaMessage] = useState("");

  const sampleResponse = useMemo(() => {
    if (!topic || !summary) return "Share a question to get real-time advice from agronomists and peers.";
    return `We'll route "${topic}" to mentors watching ${category.toLowerCase()} threads.`;
  }, [topic, summary, category]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCtaMessage("Discussion queued – mentors usually reply within 20 minutes.");
    setTopic("");
    setSummary("");
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
              <Link href="/community-forum" className="text-emerald-700">
                Community
              </Link>
              <Link href="/government-schemes" className="transition-colors hover:text-emerald-700">
                Schemes
              </Link>
              <Link href="/weather" className="transition-colors hover:text-emerald-700">
                Weather
              </Link>
              <Button
                variant="outline"
                asChild
                className="border-emerald-200 text-emerald-800 hover:bg-emerald-50"
              >
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
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">Community Forum</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                Rapid answers, shared wins, and mentors on speed dial.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600">
                Stay close to agronomists, supply-chain scouts, and growers working the same soils. Every thread captures files,
                weather snapshots, and market intel so you can act faster on-field.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                <Sparkles className="h-4 w-4" /> Moderated in three languages
              </div>
            </div>
            <Card className="border-slate-100 bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Community uptime</CardTitle>
                <p className="text-sm text-slate-500">Last 24h snapshot</p>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <stat.icon className="h-5 w-5 text-emerald-600" />
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.subtext}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-slate-100 bg-white/90">
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-slate-900">Live threads</CardTitle>
                <p className="text-sm text-slate-500">Curated from farms similar to yours</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <Clock3 className="h-4 w-4" /> Updated continuously
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {threads.map((thread) => (
                <div key={thread.title} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{thread.title}</p>
                      <p className="text-xs text-slate-500">{thread.updated}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {thread.category}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                    {thread.highlights.map((item) => (
                      <span key={item} className="rounded-full bg-white/80 px-3 py-1">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    {thread.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1">
                        <Tag className="h-3 w-3 text-emerald-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{thread.replies} replies</span>
                    <Link href="/community-forum#start" className="text-emerald-600 font-semibold">
                      Join thread
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card id="start" className="border-slate-100 bg-emerald-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Start a discussion</CardTitle>
                <p className="text-sm text-emerald-100">Share context. We route it to mentors instantly.</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-xs uppercase tracking-[0.3em] text-emerald-200">Topic</label>
                    <Input
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      placeholder="Ex: Heat stress on tomatoes"
                      className="mt-1 border-emerald-200 bg-white/10 text-white placeholder:text-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.3em] text-emerald-200">Summary</label>
                    <Textarea
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      rows={3}
                      placeholder="Share soil, weather, or photos"
                      className="mt-1 border-emerald-200 bg-white/10 text-white placeholder:text-emerald-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="discussion-category" className="text-xs uppercase tracking-[0.3em] text-emerald-200">Category</label>
                    <select
                      id="discussion-category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-emerald-200 bg-white/10 px-3 py-2 text-sm text-white"
                    >
                      <option value="Crop management">Crop management</option>
                      <option value="Crop protection">Crop protection</option>
                      <option value="Market linkage">Market linkage</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-white text-emerald-800 hover:bg-emerald-50">
                    Post to community
                  </Button>
                  <p className="text-xs text-emerald-100">{sampleResponse}</p>
                  {ctaMessage && <p className="text-xs font-semibold text-white">{ctaMessage}</p>}
                </form>
              </CardContent>
            </Card>

            <Card className="border-slate-100 bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Success stories</CardTitle>
                <p className="text-sm text-slate-500">What farmers achieved via the forum</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {spotlightStories.map((story) => (
                  <div key={story.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{story.region}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {story.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900">{story.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{story.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-slate-100 bg-white/90">
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-slate-900">Discover threads by topic</CardTitle>
                <p className="text-sm text-slate-500">Filters update in real time</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="h-4 w-4" /> Demand-heavy tags
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {discoveryTags.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                <p className="text-sm font-semibold text-slate-700">Sharing guidelines</p>
                <p className="mt-2 text-sm text-slate-500">
                  Mention weather, soil, lot size, and input history. Uploading lab files or photos gives you a mentor more quickly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Bring your FPO or neighbour</CardTitle>
              <p className="text-sm text-slate-300">Collective intel compounds outcomes.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Co-create private channels</p>
                <p className="mt-1 text-xs text-slate-200">Perfect for sharing packhouse SOPs or contract drafts.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Mentor curation</p>
                <p className="mt-1 text-xs text-slate-200">AgriConnect handpicks agronomists per crop + region.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Plug into future AI assistants</p>
                <p className="mt-1 text-xs text-slate-200">Threads become training data for next-gen advisories.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="flex-1 bg-white text-emerald-800 hover:bg-emerald-50">Invite members</Button>
                <Button variant="outline" className="flex-1 border-white/40 text-white hover:bg-white/5">
                  Share forum link
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-100 bg-white/95 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Prefer talking to a human?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Request a moderated onboarding call and we will walk you through the forum, setup farm profiles, and sync your existing WhatsApp groups.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Book onboarding call
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700">Download forum handbook</Button>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
