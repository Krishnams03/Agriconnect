"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with real API call once endpoint is available.
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/log-in");
      }, 2500);
    } catch (err) {
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50/45 to-white">
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-100 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-emerald-200/70 blur-3xl" />

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
          className="rounded-full border border-green-500/70 bg-white px-5 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
        >
          Back to sign in
        </Link>
      </motion.header>

      <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative w-full max-w-xl"
        >
          <div className="absolute inset-0 -z-10 rounded-[36px] bg-gradient-to-br from-emerald-100 via-white to-white blur-2xl" />
          <div className="relative rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.4)]">
            {!isSuccess ? (
              <>
                <div className="mb-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                    <Lock className="h-6 w-6" />
                  </span>
                  <h1 className="mt-5 text-3xl font-semibold text-slate-900">Set a new password</h1>
                  <p className="mt-3 text-sm text-slate-500">
                    Choose a strong password to keep your account protected. Tokens expire after use for security.
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                      <span>New password</span>
                      {token && <span>Token verified</span>}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder="Enter a new password"
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
                      Minimum 8 characters with a mix of numbers and symbols recommended.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder="Re-enter password"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Updating password..." : "Update password"}
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Remembered your credentials?{" "}
                  <Link href="/log-in" className="font-semibold text-green-600 transition hover:text-green-700">
                    Sign in instead
                  </Link>
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0.4, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-900">Password updated</h2>
                <p className="mt-3 text-sm text-slate-500">
                  Your new password is ready to use. We’ll take you back to the sign in screen in a moment.
                </p>
                <Link
                  href="/log-in"
                  className="mt-7 inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Return to sign in
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}