"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const navigation = [
    {
      title: "Navigate",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "#about" },
        { label: "Features", href: "#features" },
        { label: "Community", href: "#community-forum" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Plant Disease Detection", href: "/plant-disease-detection" },
        { label: "Growth Analytics", href: "/growth-factors" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "Schemes", href: "/government-schemes" },
      ],
    },
  ];

  return (
    <footer className="relative bg-white py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
      <div className="absolute top-10 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 -translate-y-16 rounded-full bg-green-100/60 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.4)] backdrop-blur">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">Newsletter</p>
              <h3 className="mt-4 text-3xl font-semibold text-slate-900 tracking-tight">
                Stay ahead with crop-specific insights and market signals.
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Join our monthly digest curated by agronomists and data scientists. Absolutely no spam.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <Leaf className="h-5 w-5" />
              </span>
              <p className="text-xl font-semibold text-slate-900">AgriConnect</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Empowering farmers with accessible technology, actionable intelligence, and a resilient community.
            </p>
          </div>

          {navigation.map((section) => (
            <div key={section.title} className="space-y-4">
              <p className="text-sm font-semibold text-slate-900 uppercase tracking-[0.2em]">
                {section.title}
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-green-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-900 uppercase tracking-[0.2em]">Contact</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>123 Agricultural Innovation Hub</li>
              <li>Farming District, India</li>
              <li>+91 800 800 8008</li>
              <li>hello@agriconnect.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} AgriConnect. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#privacy" className="transition hover:text-green-600">
              Privacy Policy
            </Link>
            <Link href="#terms" className="transition hover:text-green-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;