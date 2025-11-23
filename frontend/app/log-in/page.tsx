"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { isAuthenticated, saveUserSession } from "@/app/utils/auth";

interface LoginResponse {
  message: string;
  token?: string;
}

const metrics = [
  { label: "Active growers", value: "12k+" },
  { label: "Trading efficiencies", value: "98%" },
  { label: "Daily insights shared", value: "5k+" },
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      if (!response.data.token) {
        setError("Login failed. Please check your credentials.");
        return;
      }

  saveUserSession(email, response.data.token, 3600, email);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Something went wrong during login. Please try again.";
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
          href="/sign-up"
          className="rounded-full border border-green-500/70 bg-white px-6 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
        >
          Create account
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
            Sign in
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-4xl font-semibold text-slate-900 tracking-tight md:text-5xl"
          >
            Access your farm intelligence hub in seconds.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-base leading-relaxed text-slate-600"
          >
            Monitor decisions, collaborate with agronomists, and sync your marketplace listings from one secure dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid gap-5 sm:grid-cols-2"
          >
            {metrics.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
              >
                <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                  {item.label}
                </p>
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
              <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue growing with AgriConnect.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

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
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="font-medium text-green-600 transition hover:text-green-700"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className="flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                New to AgriConnect?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-green-600 transition hover:text-green-700"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

