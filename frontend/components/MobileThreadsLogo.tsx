"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Leaf } from "lucide-react";

type MobileThreadsLogoProps = {
  variant?: "hero" | "nav" | "avatar";
  className?: string;
  showLeafOutline?: boolean;
};

const variantStyles: Record<NonNullable<MobileThreadsLogoProps["variant"]>, {
  wrapper: string;
  glow: string;
  svg: string;
}> = {
  hero: {
    wrapper:
      "relative flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-white/80 to-emerald-50/60 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.8)]",
    glow: "absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/40 to-cyan-200/20 blur-2xl",
    svg: "h-20 w-20"
  },
  nav: {
    wrapper:
      "relative flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-sm",
    glow: "absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-emerald-200/40 to-transparent blur-lg",
    svg: "h-9 w-9"
  },
  avatar: {
    wrapper:
      "relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-white/70 backdrop-blur shadow-sm",
    glow: "absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-emerald-200/50 to-cyan-200/30 blur-xl",
    svg: "h-8 w-8"
  }
};

const MobileThreadsLogo = ({ variant = "hero", className, showLeafOutline = false }: MobileThreadsLogoProps) => {
  const pathLength = 120;
  const styles = variantStyles[variant];

  return (
    <motion.div
      className={clsx(styles.wrapper, className)}
      aria-label="Animated AgriConnect emblem"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.glow}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.svg
        viewBox="0 0 48 48"
        className={styles.svg}
        fill="none"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="agri-thread-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <motion.path
          d="M24 6c-9.94 0-18 8.06-18 18s8.06 18 18 18c9.39 0 16.82-7.39 16.82-16.17 0-5.69-3.57-10.35-8.63-12.19-2.61-.94-6.72-.67-8.89 1.64-1.41 1.5-1.64 4.57 1.91 5.98 6.01 2.46 9.92 5.75 9.92 10.22C35.13 35.38 31 39 25.66 39c-5.13 0-9.16-3.26-9.16-8.22 0-4.02 3.07-7.12 7.06-7.12s6.5 2.46 6.5 5.5c0 2.69-1.99 4.27-4.14 4.27-1.88 0-3.27-1.03-3.27-2.65"
          stroke="url(#agri-thread-stroke)"
          strokeDasharray={pathLength}
          initial={{ strokeDashoffset: pathLength }}
          animate={{ strokeDashoffset: [-pathLength, 0, pathLength] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="24"
          cy="24"
          r="4.2"
          fill="#ecfdf5"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      {showLeafOutline && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="h-[85%] w-[85%] text-emerald-500/60" strokeWidth={1.6} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default MobileThreadsLogo;
