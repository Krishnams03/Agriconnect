"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportTips = [
  "You’ll receive a secure link that expires in 15 minutes.",
  "Still stuck? Reach our support team at support@agriconnect.io.",
  "Check your spam folder if the email doesn’t arrive quickly.",
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call once endpoint is available.
      await new Promise((resolve) => setTimeout(resolve, 1600));
      setStatusMessage("We’ve sent a password reset email with the next steps.");
      setEmail("");
    } catch (error) {
      setStatusMessage("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
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
        className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-8"
      >
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold text-slate-900">AgriConnect</span>
        </Link>
        <Link
          href="/log-in"
          className="inline-flex items-center gap-2 rounded-full border border-green-500/70 bg-white px-5 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Sign in
        </Link>
      </motion.header>

      <div className="relative mx-auto grid min-h-[70vh] max-w-5xl items-center gap-12 px-6 pb-16 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600"
          >
            Password reset
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-4xl font-semibold text-slate-900 tracking-tight md:text-5xl"
          >
            Recover access to your AgriConnect workspace.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-base leading-relaxed text-slate-600"
          >
            Enter the email associated with your account and we’ll send you a secure link to set a new password. Keep your crops, orders, and community conversations protected.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ul className="mt-12 space-y-4">
              {supportTips.map((tip) => (
                <li key={tip} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm leading-relaxed text-slate-600 shadow-sm backdrop-blur">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  {tip}
                </li>
              ))}
            </ul>
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
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <MailCheck className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold text-slate-900">Send reset link</h2>
              <p className="mt-2 text-sm text-slate-500">
                We’ll confirm your identity and deliver the instructions immediately.
              </p>
            </div>

            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 rounded-2xl border border-green-200 bg-green-50/80 p-4 text-sm text-green-700"
              >
                {statusMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="reset-email">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@farms.io"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending instructions..." : "Send reset email"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Back to
              {" "}
              <Link href="/log-in" className="font-semibold text-green-600 transition hover:text-green-700">
                sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
