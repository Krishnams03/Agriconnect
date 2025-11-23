"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { isAuthenticated, saveUserSession } from "@/app/utils/auth";

interface SignUpResponse {
  message?: string;
  token?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

const highlights = [
  {
    title: "Smart crop insights",
    description: "Tailored recommendations based on region, crop cycle, and resource planning.",
  },
  {
    title: "Connected marketplace",
    description: "Reach verified buyers and suppliers, with transparent pricing and logistics tools.",
  },
  {
    title: "Community expertise",
    description: "Collaborate with agronomists and growers who cultivate smarter every season.",
  },
];

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await axios.post<SignUpResponse>("http://localhost:8000/api/auth/sign-up", {
        name: fullName,
        email,
        password,
      });

      if (response.data.token) {
  saveUserSession(fullName || email, response.data.token, 3600, email);
        router.push("/");
        return;
      }

      setSuccessMessage(response.data.message ?? "Account created successfully. Please sign in.");
      setTimeout(() => router.push("/log-in"), 1800);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong during sign up. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-white">
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl" />
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-8"
      >
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold text-slate-900">AgriConnect</span>
        </Link>
        <Link
          href="/log-in"
          className="rounded-full border border-green-500/70 bg-white px-6 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
        >
          Sign in
        </Link>
      </motion.header>

      <div className="relative mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600"
          >
            Create account
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-4xl font-semibold text-slate-900 tracking-tight md:text-5xl"
          >
            Build lasting resilience for your farm operations.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-base leading-relaxed text-slate-600"
          >
            Registration unlocks crop planning dashboards, expert advisory, market access, and real-time analytics crafted for modern growers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid gap-6"
          >
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[36px] bg-gradient-to-br from-emerald-100 via-white to-white blur-2xl" />
          <div className="relative rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.4)]">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">Let’s get you set up</h2>
              <p className="mt-2 text-sm text-slate-500">
                Start with your basic details — you can personalise your experience later.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 rounded-2xl border border-green-200 bg-green-50/80 p-4 text-sm text-green-700"
              >
                {successMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Khushi Patel"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@farms.io"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Use at least one number and one special character for a stronger password.
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className="flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already using AgriConnect?{" "}
                <Link
                  href="/log-in"
                  className="font-semibold text-green-600 transition hover:text-green-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}